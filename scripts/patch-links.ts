/**
 * patch-links.ts
 *
 * Comprehensive link audit fixes:
 *
 * 1. Fix broken /visit-jura → /explore-islay/visit-jura in jura-day-trip teaser
 * 2. Add CalMac external link to ferry-basics canonical block
 * 3. Add Loganair external link to flights-basics canonical block
 * 4. Patch restaurant entity contact.website URLs (4 confirmed)
 * 5. Fix Port Ellen Distillery null website
 * 6. Add internal cross-links to guide page extendedEditorial:
 *    - islay-distilleries → food-and-drink
 *    - islay-beaches → islay-wildlife
 *    - food-and-drink → islay-wildlife
 *    - visit-jura → bothanjuraretreat.co.uk + ferry-to-islay
 *    - planning-your-trip → ferry-to-islay + flights-to-islay
 */

import { createClient } from 'next-sanity';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ─── PortableText helpers ──────────────────────────────────────────────────────

function key(): string {
  return randomBytes(5).toString('hex');
}

function para(text: string) {
  return {
    _type: 'block' as const,
    _key: key(),
    style: 'normal',
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

/** A paragraph containing one or more linked spans + surrounding text */
function paraWithLinks(
  parts: Array<
    | { type: 'text'; text: string }
    | { type: 'link'; text: string; href: string }
  >
) {
  const markDefs: any[] = [];
  const children: any[] = [];

  for (const part of parts) {
    if (part.type === 'text') {
      children.push({ _type: 'span', _key: key(), text: part.text, marks: [] });
    } else {
      const linkKey = key();
      markDefs.push({ _type: 'link', _key: linkKey, href: part.href });
      children.push({ _type: 'span', _key: key(), text: part.text, marks: [linkKey] });
    }
  }

  return {
    _type: 'block' as const,
    _key: key(),
    style: 'normal',
    markDefs,
    children,
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== patch-links.ts ===\n');

  // ── 1. Fix broken /visit-jura in jura-day-trip teaserContent ─────────────────
  console.log('1. Fixing jura-day-trip teaserContent broken link...');
  await client
    .patch('canonical-block-jura-day-trip')
    .set({
      teaserContent: [
        paraWithLinks([
          {
            type: 'text',
            text: "A 5-minute ferry from Port Askaig takes you to Jura — visit the distillery, lunch at the Antlers, cycle to Small Isles Bay. One road, one pub, more deer than people. It feels like a different world. ",
          },
          {
            type: 'link',
            text: 'Visiting Jura from Islay — a day trip guide →',
            href: '/explore-islay/visit-jura',
          },
        ]),
      ],
    })
    .commit();
  console.log('  ✓ /visit-jura → /explore-islay/visit-jura fixed');

  // ── 2. Add CalMac booking link to ferry-basics canonical block ────────────────
  console.log('2. Adding CalMac link to ferry-basics...');
  await client
    .patch('canonical-block-ferry-basics')
    .append('fullContent', [
      paraWithLinks([
        {
          type: 'link',
          text: 'Book your CalMac ferry crossing at calmac.co.uk',
          href: 'https://www.calmac.co.uk',
        },
        {
          type: 'text',
          text: ' — vehicle reservations open up to 12 weeks ahead. Book as soon as your accommodation is confirmed.',
        },
      ]),
    ])
    .commit();
  console.log('  ✓ CalMac link appended to ferry-basics');

  // ── 3. Add Loganair booking link to flights-basics canonical block ────────────
  console.log('3. Adding Loganair link to flights-basics...');
  await client
    .patch('canonical-block-flights-basics')
    .append('fullContent', [
      paraWithLinks([
        {
          type: 'link',
          text: 'Check Loganair flight times and book at loganair.co.uk',
          href: 'https://www.loganair.co.uk',
        },
        {
          type: 'text',
          text: ' — Glasgow to Islay (GLA–ILY). Fares vary significantly; book early for the best prices.',
        },
      ]),
    ])
    .commit();
  console.log('  ✓ Loganair link appended to flights-basics');

  // ── 4. Patch restaurant entity websites ──────────────────────────────────────
  console.log('4. Patching restaurant entity websites...');

  const restaurantPatches: Array<{ entityId: string; name: string; website: string }> = [
    {
      entityId: 'lochindaal-seafood-kitchen',
      name: 'Lochindaal Seafood Kitchen',
      website: 'https://www.lochindaalseafoodkitchen.co.uk/',
    },
    {
      entityId: 'port-charlotte-hotel',
      name: 'Port Charlotte Hotel',
      website: 'https://www.portcharlottehotel.co.uk/',
    },
    {
      entityId: 'peatzeria-bowmore',
      name: 'Peatzeria',
      website: 'https://peatzeria.com/',
    },
    {
      entityId: 'seasalt-bistro-port-ellen',
      name: 'SeaSalt Bistro',
      website: 'https://www.seasalt-bistro.co.uk/',
    },
  ];

  for (const r of restaurantPatches) {
    // Find document by entityId slug
    const doc = await client.fetch(
      `*[_type=="siteEntity" && entityId.current==$eid][0]{_id}`,
      { eid: r.entityId }
    );
    if (!doc?._id) {
      console.log(`  ⚠ ${r.name}: document not found (entityId: ${r.entityId})`);
      continue;
    }
    await client
      .patch(doc._id)
      .set({ 'contact.website': r.website })
      .commit();
    console.log(`  ✓ ${r.name}: ${r.website}`);
  }

  // ── 5. Fix Port Ellen Distillery null website ─────────────────────────────────
  console.log('5. Fixing Port Ellen Distillery website...');
  const portEllenDoc = await client.fetch(
    `*[_type=="siteEntity" && entityId.current=="port-ellen-distillery"][0]{_id}`
  );
  if (portEllenDoc?._id) {
    await client
      .patch(portEllenDoc._id)
      .set({ 'contact.website': 'https://www.malts.com/en-gb/distilleries/port-ellen' })
      .commit();
    console.log('  ✓ Port Ellen Distillery website set');
  } else {
    console.log('  ⚠ Port Ellen Distillery document not found');
  }

  // ── 6. Add internal cross-links to guide page extendedEditorial ───────────────
  console.log('6. Adding internal cross-links to guide pages...\n');

  // ── 6a. islay-distilleries → food-and-drink ──────────────────────────────────
  console.log('  6a. islay-distilleries → food-and-drink...');
  await client
    .patch('guide-islay-distilleries')
    .append('extendedEditorial', [
      paraWithLinks([
        {
          type: 'text',
          text: 'Several distilleries have excellent cafés worth planning around — Ardbeg, Kilchoman, and Ardnahoe in particular. Our ',
        },
        {
          type: 'link',
          text: 'food and drink guide',
          href: '/explore-islay/food-and-drink',
        },
        {
          type: 'text',
          text: ' covers distillery cafés alongside Islay\'s best restaurants.',
        },
      ]),
    ])
    .commit();
  console.log('  ✓ Done');

  // ── 6b. islay-beaches → islay-wildlife ───────────────────────────────────────
  console.log('  6b. islay-beaches → islay-wildlife...');
  await client
    .patch('guide-islay-beaches')
    .append('extendedEditorial', [
      paraWithLinks([
        {
          type: 'text',
          text: 'Ardnave Point dunes connect directly to RSPB Loch Gruinart nature reserve — combining both makes an excellent half-day. Singing Sands on the east coast is also good for quiet birdwatching. See the ',
        },
        {
          type: 'link',
          text: 'wildlife guide',
          href: '/explore-islay/islay-wildlife',
        },
        {
          type: 'text',
          text: ' for eagle spotting, barnacle geese, and otter locations around the coast.',
        },
      ]),
    ])
    .commit();
  console.log('  ✓ Done');

  // ── 6c. food-and-drink → islay-wildlife ──────────────────────────────────────
  console.log('  6c. food-and-drink → islay-wildlife...');
  await client
    .patch('guide-food-and-drink')
    .append('extendedEditorial', [
      paraWithLinks([
        {
          type: 'text',
          text: 'Loch Gruinart combines naturally with an early start — the dawn barnacle geese flight at the RSPB reserve is one of the most extraordinary wildlife experiences in Scotland, and the Oyster Shed opens from 10am for the best oysters on the island. That combination makes one of the best half-days on Islay. See the ',
        },
        {
          type: 'link',
          text: 'wildlife guide',
          href: '/explore-islay/islay-wildlife',
        },
        {
          type: 'text',
          text: ' for geese timings and reserve access details.',
        },
      ]),
    ])
    .commit();
  console.log('  ✓ Done');

  // ── 6d. visit-jura → ferry-to-islay + bothanjuraretreat.co.uk ────────────────
  console.log('  6d. visit-jura → ferry-to-islay + BJR...');
  await client
    .patch('guide-visit-jura')
    .append('extendedEditorial', [
      paraWithLinks([
        {
          type: 'text',
          text: 'Getting to Jura requires the Islay ferry first — see our ',
        },
        {
          type: 'link',
          text: 'ferry to Islay guide',
          href: '/explore-islay/ferry-to-islay',
        },
        {
          type: 'text',
          text: ' for CalMac booking and vehicle reservation advice.',
        },
      ]),
      paraWithLinks([
        {
          type: 'text',
          text: 'For longer stays on Jura, we run three holiday properties through ',
        },
        {
          type: 'link',
          text: 'Bothan Jura Retreat',
          href: 'https://www.bothanjuraretreat.co.uk',
        },
        {
          type: 'text',
          text: " — Mrs Leonard's Cottage, The Black Hut, and The Rusty Hut.",
        },
      ]),
    ])
    .commit();
  console.log('  ✓ Done');

  // ── 6e. planning-your-trip → ferry + flights ──────────────────────────────────
  console.log('  6e. planning-your-trip → ferry + flights...');
  await client
    .patch('guide-planning-your-trip')
    .append('extendedEditorial', [
      paraWithLinks([
        {
          type: 'text',
          text: 'For detailed travel logistics: ',
        },
        {
          type: 'link',
          text: 'Ferry to Islay',
          href: '/explore-islay/ferry-to-islay',
        },
        {
          type: 'text',
          text: ' (CalMac from Kennacraig, vehicle booking, what to expect on the crossing) and ',
        },
        {
          type: 'link',
          text: 'Flights to Islay',
          href: '/explore-islay/flights-to-islay',
        },
        {
          type: 'text',
          text: ' (Loganair from Glasgow, 25 minutes, weather considerations).',
        },
      ]),
    ])
    .commit();
  console.log('  ✓ Done');

  // ── 6f. islay-wildlife → islay-beaches ───────────────────────────────────────
  console.log('  6f. islay-wildlife → islay-beaches...');
  await client
    .patch('guide-islay-wildlife')
    .append('extendedEditorial', [
      paraWithLinks([
        {
          type: 'text',
          text: 'The coastal paths around Islay — particularly the Bruichladdich to Port Charlotte cycle path — are excellent for wildlife watching as well as swimming. See the ',
        },
        {
          type: 'link',
          text: 'beaches guide',
          href: '/explore-islay/islay-beaches',
        },
        {
          type: 'text',
          text: ' for safe swimming spots, Portbahn Beach access, and Machir Bay coastal walks.',
        },
      ]),
    ])
    .commit();
  console.log('  ✓ Done');

  console.log('\n=== All patches complete ===');
  console.log('\nSummary:');
  console.log('  ✓ 1 broken link fixed (jura-day-trip teaser → /explore-islay/visit-jura)');
  console.log('  ✓ 2 external links added to canonical blocks (CalMac, Loganair)');
  console.log('  ✓ 4 restaurant websites patched');
  console.log('  ✓ 1 distillery website fixed (Port Ellen)');
  console.log('  ✓ 6 internal cross-links added to guide page extendedEditorial');
  console.log('\nVerify at:');
  console.log('  /islay-travel (broken link fix)');
  console.log('  /explore-islay/ferry-to-islay (CalMac link)');
  console.log('  /explore-islay/flights-to-islay (Loganair link)');
  console.log('  /explore-islay/food-and-drink (restaurant entity cards + wildlife link)');
  console.log('  /explore-islay/islay-distilleries (food cross-link)');
  console.log('  /explore-islay/islay-beaches (wildlife cross-link)');
  console.log('  /explore-islay/islay-wildlife (beaches cross-link)');
  console.log('  /explore-islay/visit-jura (ferry + BJR links)');
  console.log('  /explore-islay/planning-your-trip (ferry + flights links)');
}

run().catch(console.error);
