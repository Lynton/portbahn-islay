/**
 * import-sanity-2026-03-03.ts
 *
 * Applies all 9 items from SANITY-IMPORT-2026-03-03.md
 * Source: _work/cw/pbi/handoffs/SANITY-IMPORT-2026-03-03.md
 *
 * A1  — wildlife-geese · teaserContent (ADD)
 * A2  — food-drink-islay · teaserContent (ADD)
 * A3  — families-children · teaserContent (ADD)
 * B1a — ferry-basics · teaserContent (REPLACE)
 * B1b — ferry-basics · fullContent · opening 3 paragraphs (REPLACE with 1 paragraph)
 * B2  — islay-travel hub (gettingHerePage) · ferry-basics · version full→teaser (STRUCTURAL)
 * B3  — guide-travelling-without-a-car · introduction (REPLACE)
 * B4  — guide-travelling-to-islay-with-your-dog · introduction (REPLACE)
 * B5  — families-children · fullContent · opening 2 paragraphs (REPLACE with 2 paragraphs)
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/import-sanity-2026-03-03.ts
 */

import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const k = () => randomBytes(5).toString('hex');

function para(text: string): any {
  return {
    _type: 'block',
    _key: k(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  };
}

/** Single paragraph with one hyperlink at the end */
function paraWithLinkSuffix(before: string, linkText: string, href: string): any {
  const linkKey = k();
  return {
    _type: 'block',
    _key: k(),
    style: 'normal',
    markDefs: [{ _type: 'link', _key: linkKey, href }],
    children: [
      { _type: 'span', _key: k(), text: before, marks: [] },
      { _type: 'span', _key: k(), text: linkText, marks: [linkKey] },
    ],
  };
}

function blockText(block: any): string {
  if (!block || block._type !== 'block') return '';
  return (block.children || [])
    .filter((s: any) => s._type === 'span')
    .map((s: any) => s.text || '')
    .join('');
}

function findHeadingIdx(blocks: any[], headingText: string): number {
  return blocks.findIndex(
    b => b._type === 'block' && ['h2', 'h3'].includes(b.style) && blockText(b).startsWith(headingText.slice(0, 40))
  );
}

// ─── Result tracking ──────────────────────────────────────────────────────────

const results: { id: string; status: '✓' | '✗' | '⚠'; note?: string }[] = [];

function ok(id: string, note?: string) {
  results.push({ id, status: '✓', note });
  console.log(`  ✓ ${id}${note ? ' — ' + note : ''}`);
}

function fail(id: string, err: any) {
  results.push({ id, status: '✗', note: String(err?.message || err) });
  console.error(`  ✗ ${id} — ${err?.message || err}`);
}

function warn(id: string, note: string) {
  results.push({ id, status: '⚠', note });
  console.warn(`  ⚠ ${id} — ${note}`);
}

// ─── SECTION A: Add teaserContent to 3 canonical blocks ──────────────────────

async function sectionA() {
  console.log('\n══ A — teaserContent additions ══════════════════════════════');

  // ── A1: wildlife-geese teaserContent ─────────────────────────────────────────
  console.log('\n── A1 wildlife-geese teaserContent ──');
  try {
    const A1_TEXT =
      'Every October on Islay, a great spectacle in the birdwatching world takes place — around 30,000 barnacle geese migrate from their Greenland breeding grounds and settle on the fields across the island, particularly around the broad estuary of Loch Gruinart where the RSPB sanctuary is. Standing watching a vast flock lift off in a synchronised ripple, turn and settle again is quite a mesmerising sight.';
    await client
      .patch('canonical-block-wildlife-geese')
      .set({ teaserContent: [para(A1_TEXT)] })
      .commit();
    ok('A1', 'wildlife-geese teaserContent added');
  } catch (err) { fail('A1', err); }

  // ── A2: food-drink-islay teaserContent ───────────────────────────────────────
  console.log('\n── A2 food-drink-islay teaserContent ──');
  try {
    const A2_TEXT =
      "Islay's food is created from the land and seas that surround the island — seafood straight from the boats, prized lamb and beef from the farms, venison from the hills and, of course, whisky from some of the best distilleries on the planet. It's not fancy food, but the best of it is excellent — the kind of meal you savour, enjoy and remember. We've put together some of our own particular favourites, from simple fish and chips to a freshly caught seafood platter.";
    await client
      .patch('canonical-block-food-drink-islay')
      .set({ teaserContent: [para(A2_TEXT)] })
      .commit();
    ok('A2', 'food-drink-islay teaserContent added');
  } catch (err) { fail('A2', err); }

  // ── A3: families-children teaserContent ──────────────────────────────────────
  console.log('\n── A3 families-children teaserContent ──');
  try {
    const A3_TEXT =
      'Islay is a precious place to spend time with children. We have two of our own, now 12 and 14, who\'ve spent nearly all their lives on the islands and who still love it here. Being here feels like winding the clock back fifty years — safe beaches, empty roads, wildlife on your doorstep, playgrounds, swimming in the sea. And best of all: island time. Time to actually enjoy it all.';
    await client
      .patch('canonical-block-families-children')
      .set({ teaserContent: [para(A3_TEXT)] })
      .commit();
    ok('A3', 'families-children teaserContent added');
  } catch (err) { fail('A3', err); }
}

// ─── SECTION B: ferry-basics + guide page introductions ──────────────────────

async function sectionB() {
  console.log('\n══ B — ferry-basics + guide page updates ════════════════════');

  // ── B1a: ferry-basics teaserContent (REPLACE) ────────────────────────────────
  console.log('\n── B1a ferry-basics teaserContent (replace) ──');
  try {
    const B1a_BEFORE =
      "Getting to Islay isn't easy. And that's what makes it so special. With the right planning the journey is as much a part of the holiday as being here — not something to push through in choruses of \"are we nearly there yet?\". From the moment you leave Glasgow and reach Loch Lomond, the scenery changes dramatically. Bye bye Lowlands, hello Highlands. We make this crossing all the time, in all weathers — get in touch if you're not sure and we'll help you find the best route. ";
    const newTeaser = [
      paraWithLinkSuffix(B1a_BEFORE, 'Plan your journey →', '/islay-travel/ferry-to-islay'),
    ];
    await client
      .patch('canonical-block-ferry-basics')
      .set({ teaserContent: newTeaser })
      .commit();
    ok('B1a', 'ferry-basics teaserContent replaced (Loch Lomond, no 2017 ref)');
  } catch (err) { fail('B1a', err); }

  // ── B1b: ferry-basics fullContent — replace opening 3 paragraphs ─────────────
  console.log('\n── B1b ferry-basics fullContent opening (replace 3 → 1 para) ──');
  try {
    const doc = await client.fetch<{ fullContent: any[] }>(
      `*[_id == "canonical-block-ferry-basics"][0]{ fullContent }`
    );
    const blocks: any[] = doc?.fullContent || [];

    // Find the "By Ferry from Kennacraig" h3 heading — everything before it is replaced
    const headingIdx = findHeadingIdx(blocks, 'By Ferry from Kennacraig');
    if (headingIdx < 0) {
      warn('B1b', '"By Ferry from Kennacraig" heading not found — skipped');
    } else {
      const B1b_NEW_PARA =
        "We've been running Portbahn Islay since 2017 and we've made this crossing in every condition — gales, flat calm, fog delays, missed sailings. It's a genuinely good journey and we can help you plan it. Below is everything you need: ferry routes and ports, flights from Glasgow, how to read the weather, and how to make the most of the travel day.";
      const unchangedTail = blocks.slice(headingIdx);
      const updated = [para(B1b_NEW_PARA), ...unchangedTail];
      await client
        .patch('canonical-block-ferry-basics')
        .set({ fullContent: updated })
        .commit();
      ok('B1b', `ferry-basics fullContent: 3 opening paras → 1 (heading at idx ${headingIdx})`);
    }
  } catch (err) { fail('B1b', err); }

  // ── B2: gettingHerePage ferry-basics version: full → teaser ──────────────────
  console.log('\n── B2 gettingHerePage ferry-basics version (full → teaser) ──');
  try {
    const page = await client.fetch<{ contentBlocks: any[] | null }>(
      `*[_id == "gettingHerePage"][0]{ contentBlocks }`
    );
    const blocks = page?.contentBlocks || [];
    const ferryEntry = blocks.find(
      (b: any) => b?.block?._ref === 'canonical-block-ferry-basics'
    );
    if (!ferryEntry) {
      warn('B2', 'ferry-basics not found in gettingHerePage.contentBlocks — skipped');
    } else if (ferryEntry.version === 'teaser') {
      ok('B2', 'ferry-basics already set to teaser — no change needed');
    } else {
      const updated = blocks.map((b: any) =>
        b?.block?._ref === 'canonical-block-ferry-basics'
          ? { ...b, version: 'teaser' }
          : b
      );
      await client.patch('gettingHerePage').set({ contentBlocks: updated }).commit();
      ok('B2', `ferry-basics version: "${ferryEntry.version}" → "teaser" on gettingHerePage`);
    }
  } catch (err) { fail('B2', err); }

  // ── B3: travelling-without-a-car introduction (REPLACE) ──────────────────────
  console.log('\n── B3 travelling-without-a-car introduction (replace) ──');
  try {
    const B3_INTRO =
      'Although having a car makes it a lot easier to get around Islay, many people still travel as foot passengers or with a bicycle. Take the Citylink bus from Glasgow Bus Station (and airport) to the ferry terminal at Kennacraig, then CalMac ferry to Islay. For cyclists, the Glasgow–Arran–Kintyre route is a hugely overlooked and beautifully scenic way to arrive here. Between April and September there\'s also the Jura Passenger Ferry — a small seasonal service from Tayvallich to Craighouse on Jura, worth knowing about if you\'re routing via Jura or combining the islands. In this guide we\'ve put together all the main ways to get from Glasgow to Islay without a car and who you need to contact or book with to organise.';
    await client
      .patch('guide-travelling-without-a-car')
      .set({ introduction: B3_INTRO })
      .commit();
    ok('B3', 'travelling-without-a-car introduction replaced (JPF clarification added)');
  } catch (err) { fail('B3', err); }

  // ── B4: travelling-to-islay-with-your-dog introduction (REPLACE) ─────────────
  console.log('\n── B4 travelling-to-islay-with-your-dog introduction (replace) ──');
  try {
    const B4_INTRO = [
      "If you're travelling with dogs to Islay, the CalMac ferry from Kennacraig is the main route — and it's very dog-friendly. You can bring your dogs upstairs into the lounge and they always leave water bowls out. Just keep them on a lead.",
      "If you're on foot, Citylink buses only allow assistance dogs — so you'd need a taxi or private transfer from Glasgow to Kennacraig. If you're cycling, see our guide to getting to Islay without a car for the full route options. For cyclists combining Jura and Islay, the seasonal Jura Passenger Ferry (Tayvallich to Craighouse, April–September) is worth knowing about — the Jura detour can be a highlight rather than a hindrance, and dogs are welcome on board. You'd continue through Jura to the Port Askaig crossing at Feolin.",
      "Once you're on the island, Islay is genuinely excellent for dogs. We're dog owners too and have put together our tips for getting here with your pet.",
    ].join('\n\n');
    await client
      .patch('guide-travelling-to-islay-with-your-dog')
      .set({ introduction: B4_INTRO })
      .commit();
    ok('B4', 'travelling-to-islay-with-your-dog introduction replaced (JPF framing, Feolin named)');
  } catch (err) { fail('B4', err); }

  // ── B5: families-children fullContent — replace opening 2 paragraphs ─────────
  console.log('\n── B5 families-children fullContent opening (replace 2 → 2 paras) ──');
  try {
    const doc = await client.fetch<{ fullContent: any[] }>(
      `*[_id == "canonical-block-families-children"][0]{ fullContent }`
    );
    const blocks: any[] = doc?.fullContent || [];

    // Find the "Safe Beaches for Kids" heading — everything before it is replaced
    const headingIdx = findHeadingIdx(blocks, 'Safe Beaches for Kids');
    if (headingIdx < 0) {
      warn('B5', '"Safe Beaches for Kids" heading not found — skipped');
    } else {
      const B5_PARA1 =
        "We've been hosting families at Portbahn Islay since 2017 — from babies on their first island trip to teenagers who come back year after year. The experiences that seem to stick aren't the planned activities. They're the seals spotted from the breakfast window, the crab rescued from the rock pool, the whole week that went by without anyone asking for a screen.";
      const B5_PARA2 =
        "Below is our honest guide to Islay for families — the beaches, the rainy days, the wildlife, and the things our own children have grown up doing. These are the things we actually do, not the ones that just sound good.";
      const unchangedTail = blocks.slice(headingIdx);
      const updated = [para(B5_PARA1), para(B5_PARA2), ...unchangedTail];
      await client
        .patch('canonical-block-families-children')
        .set({ fullContent: updated })
        .commit();
      ok('B5', `families-children fullContent: 2 opening paras replaced (heading at idx ${headingIdx})`);
    }
  } catch (err) { fail('B5', err); }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' import-sanity-2026-03-03.ts');
  console.log('═══════════════════════════════════════════════════════════════');

  await sectionA();
  await sectionB();

  console.log('\n══ Summary ════════════════════════════════════════════════════');
  const counts = { '✓': 0, '⚠': 0, '✗': 0 };
  for (const r of results) {
    console.log(`  ${r.status} ${r.id}${r.note ? ' — ' + r.note : ''}`);
    counts[r.status]++;
  }
  console.log(`\n  ${counts['✓']} ✓ | ${counts['⚠']} ⚠ | ${counts['✗']} ✗`);
  console.log('\nDone. Re-run semantic audit with --no-cache to check scores.');
  console.log('Targets: islay-travel ↔ ferry-to-islay below 0.95 · dog ↔ without-a-car below 0.92');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
