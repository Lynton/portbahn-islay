/**
 * import-dog-merge-2026-03-04.ts
 *
 * Implements CC actions from CC-HANDOFF-DOG-PAGE-MERGE-2026-03-04.md
 *
 * C1 — Create canonical-block-dog-travel-basics (full + teaser content)
 * C2 — gettingHerePage.scopeIntro (REPLACE — de-operationalised, no ferry times)
 * C3 — gettingHerePage.contentBlocks (ADD dog-travel-basics teaser)
 * C4 — Delete guide-travelling-to-islay-with-your-dog (published + draft)
 * C5 — Verify/update guide-travelling-without-a-car introduction (check old dog link)
 * C6 — Verify/update guide-getting-around-islay introduction (check old dog link)
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/import-dog-merge-2026-03-04.ts
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

function block(style: string, text: string): any {
  return {
    _type: 'block',
    _key: k(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  };
}

const para = (text: string) => block('normal', text);
const h3 = (text: string) => block('h3', text);
const h4 = (text: string) => block('h4', text);

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

// ─── C1: Create canonical-block-dog-travel-basics ────────────────────────────

async function C1() {
  console.log('\n── C1 create canonical-block-dog-travel-basics ──');
  try {
    const fullContent = [
      h3('Getting to Islay with Your Dog'),

      h4('Dogs on the ferry'),
      para(
        "CalMac welcomes dogs on all sailings from Kennacraig to Islay. Dogs must be kept on a lead at all times on board. Foot passengers with dogs use the designated outdoor deck areas for the crossing; if you're travelling by car, your dog travels on the vehicle deck during boarding and disembarkation, with deck access during the sailing. There is no extra charge from CalMac for dogs."
      ),
      paraWithLinkSuffix(
        '',
        'Full ferry guide, timetables and booking →',
        '/islay-travel/ferry-to-islay'
      ),

      h4('Dogs on the bus'),
      para(
        "Citylink (Glasgow to Kennacraig) does not permit dogs - assistance dogs only. Islay Coaches (local island buses) also does not permit dogs. If you're travelling to Islay with a dog, you'll need to come by car or arrange private transport to Kennacraig. If you're planning a car-free trip with a dog, get in touch and we'll help you think through alternatives."
      ),

      h4('Arriving by foot with a dog'),
      para(
        "Taxi services operate at both Port Askaig and Port Ellen. It's worth confirming when booking that the taxi accepts dogs - most do. Two firms we use: Bruichladdich Taxis (07899 942673 / 01496 850271) and Attic Cabs (07944 873323)."
      ),
      paraWithLinkSuffix(
        'For a full list: ',
        'islayinfo.com — getting around',
        'https://www.islayinfo.com/get-here/getting-around'
      ),

      h4('Where to stay with your dog'),
      para(
        'Portbahn House and Shorefield Eco House welcome dogs (£15 per dog per stay). Portbahn has a secure garden and direct coastal path access. Shorefield has lochside access and walks from the door. Curlew Cottage is pet-free — maintained for allergy sufferers.'
      ),
    ];

    const teaserContent = [
      para(
        "CalMac welcomes dogs on all ferries from Kennacraig - no charge, lead required on board. Citylink and local Islay buses do not allow dogs (assistance dogs excepted), so if you're travelling with a dog you'll need to come by car or arrange private transport to Kennacraig. Two of our three properties - Portbahn House and Shorefield Eco House - welcome dogs. Curlew Cottage is pet-free."
      ),
      paraWithLinkSuffix(
        '',
        'Full guide: ferry policy, bus restrictions, and where to stay with your dog →',
        '/explore-islay/dog-friendly-islay'
      ),
    ];

    await client.createOrReplace({
      _type: 'canonicalBlock',
      _id: 'canonical-block-dog-travel-basics',
      blockId: { _type: 'slug', current: 'dog-travel-basics' },
      title: 'Travelling to Islay with Your Dog',
      entityType: 'travel',
      canonicalHome: '/explore-islay/dog-friendly-islay',
      fullContent,
      teaserContent,
    });
    ok('C1', 'canonical-block-dog-travel-basics created');
  } catch (err) { fail('C1', err); }
}

// ─── C2: gettingHerePage.scopeIntro (REPLACE) ────────────────────────────────

async function C2() {
  console.log('\n── C2 gettingHerePage.scopeIntro (replace) ──');
  try {
    const NEW_SCOPE_INTRO =
      "Travel to Islay is not straightforward. You don't come to the Scottish islands if you want easy - you come because of the adventure and for an experience you can't get on the mainland. We now live on Jura, but lived on Islay for a few years before that. We know every sailing from Kennacraig, every delay and every disruption - and we know exactly why guests tell us the ferry crossing was one of the highlights of their trip.";

    await client
      .patch('gettingHerePage')
      .set({ scopeIntro: NEW_SCOPE_INTRO })
      .commit();
    ok('C2', `gettingHerePage.scopeIntro updated (${NEW_SCOPE_INTRO.length} chars — ferry times removed)`);
  } catch (err) { fail('C2', err); }
}

// ─── C3: gettingHerePage.contentBlocks — add dog-travel-basics (teaser) ──────

async function C3() {
  console.log('\n── C3 gettingHerePage.contentBlocks (add dog-travel-basics teaser) ──');
  try {
    const page = await client.fetch<{ contentBlocks: any[] | null }>(
      `*[_id == "gettingHerePage"][0]{ contentBlocks }`
    );
    const existing = page?.contentBlocks || [];

    const alreadyWired = existing.some(
      (b: any) => b?.block?._ref === 'canonical-block-dog-travel-basics'
    );
    if (alreadyWired) {
      ok('C3', 'dog-travel-basics already in contentBlocks — no change');
      return;
    }

    const dogRef = {
      _type: 'blockReference',
      _key: k(),
      block: { _type: 'reference', _ref: 'canonical-block-dog-travel-basics' },
      version: 'teaser',
      showKeyFacts: false,
    };

    const updated = [...existing, dogRef];
    await client.patch('gettingHerePage').set({ contentBlocks: updated }).commit();
    ok('C3', `dog-travel-basics (teaser) added to contentBlocks (${updated.length} total blocks)`);
  } catch (err) { fail('C3', err); }
}

// ─── C4: Delete guide-travelling-to-islay-with-your-dog ──────────────────────

async function C4() {
  console.log('\n── C4 delete guide-travelling-to-islay-with-your-dog ──');
  try {
    const doc = await client.fetch<{ _id: string } | null>(
      `*[_type == "guidePage" && slug.current == "travelling-to-islay-with-your-dog"][0]{ _id }`
    );

    if (!doc) {
      warn('C4', 'guide page "travelling-to-islay-with-your-dog" not found — already deleted?');
      return;
    }

    const baseId = doc._id.replace(/^drafts\./, '');
    const draftId = `drafts.${baseId}`;

    let deleted = 0;
    try { await client.delete(baseId); deleted++; } catch { /* not published */ }
    try { await client.delete(draftId); deleted++; } catch { /* no draft */ }

    ok('C4', `deleted ${baseId} (${deleted} version(s) removed)`);
  } catch (err) { fail('C4', err); }
}

// ─── C5: Verify guide-travelling-without-a-car introduction ──────────────────

async function C5() {
  console.log('\n── C5 verify guide-travelling-without-a-car introduction ──');
  try {
    const doc = await client.fetch<{ _id: string; introduction?: string } | null>(
      `*[_type == "guidePage" && slug.current == "travelling-without-a-car"][0]{ _id, introduction }`
    );

    const intro = doc?.introduction || '';
    if (intro.includes('travelling-to-islay-with-your-dog')) {
      const updated = intro.replace(
        /\/islay-travel\/travelling-to-islay-with-your-dog/g,
        '/explore-islay/dog-friendly-islay'
      );
      const id = doc!._id.replace(/^drafts\./, '');
      await client.patch(id).set({ introduction: updated }).commit();
      ok('C5', 'travelling-without-a-car: old dog link replaced in introduction');
    } else {
      ok('C5', 'travelling-without-a-car: no old dog link in introduction — no change');
    }
  } catch (err) { fail('C5', err); }
}

// ─── C6: Verify guide-getting-around-islay introduction ──────────────────────

async function C6() {
  console.log('\n── C6 verify guide-getting-around-islay introduction ──');
  try {
    const doc = await client.fetch<{ _id: string; introduction?: string } | null>(
      `*[_type == "guidePage" && slug.current == "getting-around-islay"][0]{ _id, introduction }`
    );

    const intro = doc?.introduction || '';
    if (intro.includes('travelling-to-islay-with-your-dog')) {
      const updated = intro.replace(
        /\/islay-travel\/travelling-to-islay-with-your-dog/g,
        '/explore-islay/dog-friendly-islay'
      );
      const id = doc!._id.replace(/^drafts\./, '');
      await client.patch(id).set({ introduction: updated }).commit();
      ok('C6', 'getting-around-islay: old dog link replaced in introduction');
    } else {
      ok('C6', 'getting-around-islay: no old dog link in introduction — no change');
    }
  } catch (err) { fail('C6', err); }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' import-dog-merge-2026-03-04.ts');
  console.log('═══════════════════════════════════════════════════════════════');

  await C1();
  await C2();
  await C3();
  await C4();
  await C5();
  await C6();

  console.log('\n══ Summary ════════════════════════════════════════════════════');
  const counts = { '✓': 0, '⚠': 0, '✗': 0 };
  for (const r of results) {
    console.log(`  ${r.status} ${r.id}${r.note ? ' — ' + r.note : ''}`);
    counts[r.status]++;
  }
  console.log(`\n  ${counts['✓']} ✓ | ${counts['⚠']} ⚠ | ${counts['✗']} ✗`);
  console.log('\nPending code changes (not handled by this script):');
  console.log('  1. next.config.ts — 301: /islay-travel/travelling-to-islay-with-your-dog → /explore-islay/dog-friendly-islay');
  console.log('  2. app/islay-travel/page.tsx — remove "travelling-to-islay-with-your-dog" from TRAVEL_SPOKE_SLUGS');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
