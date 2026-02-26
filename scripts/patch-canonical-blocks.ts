/**
 * patch-canonical-blocks.ts
 *
 * 1. Fixes `title` field on 5 canonicalBlock documents (showing ID-style strings in Studio)
 * 2. Patches Block 17 (loch-gruinart-oysters) — full content + teaser with inline link
 *
 * Source: cw/pbi/STUDIO-EDIT-INSTRUCTIONS.md (confirmed content)
 * Teaser structure: body para + inline link para (same pattern as wire-travel-pages.ts teasers)
 */

import { createClient } from 'next-sanity';
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

// ─── PortableText helpers ──────────────────────────────────────────────────────

function key(): string {
  return randomBytes(5).toString('hex');
}

function para(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

function h3(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'h3',
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

function strong(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: ['strong'] }],
  };
}

/** Paragraph ending with an inline link (optional leading text) */
function paraWithLink(before: string, linkText: string, href: string) {
  const linkKey = key();
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [{ _type: 'link', _key: linkKey, href }],
    children: [
      ...(before ? [{ _type: 'span', _key: key(), text: before, marks: [] }] : []),
      { _type: 'span', _key: key(), text: linkText, marks: [linkKey] },
    ],
  };
}

// ─── Block 17 full content ─────────────────────────────────────────────────────
// Source: cw/pbi/STUDIO-EDIT-INSTRUCTIONS.md, Section 2

const oysterFullContent = [
  para(
    'Loch Gruinart is one of Islay\'s most remarkable places — a tidal loch on the northern Rhinns that functions simultaneously as an RSPB nature reserve for migratory barnacle geese and the source of some of the finest oysters in the UK. The Oyster Shed, Islay sits at the loch\'s edge and sells freshly shucked oysters direct to visitors, with a small restaurant serving lunch Thursday to Saturday.'
  ),
  para(
    'The cold, clean, nutrient-rich tidal waters of Loch Gruinart give the oysters a distinctly briny, clean flavour. Atlantic water, filtered through Islay\'s peat landscape and driven by strong tidal flow, creates near-ideal growing conditions. We\'d back Loch Gruinart oysters against any in Britain — Whitstable included. The Times agreed.'
  ),
  para(
    'The Oyster Shed opens Thursday, Friday and Saturday, 10am–3pm. Lunch is served 11:30am–2:30pm (last orders). Table booking is advisable — call 07376 781214 for all enquiries and reservations.'
  ),
  para(
    'Loch Gruinart is 20 minutes\' drive from our properties in Bruichladdich. The combination of the RSPB reserve and the Oyster Shed makes it one of the best half-days on the island. In winter, arrive at dawn to watch 30,000+ barnacle geese lift from the loch. Come back Thursday to Saturday for oysters at the shed. If you time it right, you can do both on the same day.'
  ),
  // Contact paragraph with bold label
  {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [] as any[],
    children: [
      { _type: 'span', _key: key(), text: 'Contact: ', marks: ['strong'] },
      { _type: 'span', _key: key(), text: '07376 781214 — call to book and to check opening before travelling. @oystershed_islay on Instagram for current updates.', marks: [] },
    ],
  },
];

// ─── Block 17 teaser content ───────────────────────────────────────────────────
// Source: cw/pbi/STUDIO-EDIT-INSTRUCTIONS.md, Section 3
// Pattern: body para + separate inline link para (consistent with wire-travel-pages.ts)

const oysterTeaserContent = [
  para(
    'Loch Gruinart produces some of the finest oysters in the UK — farmed in the cold, clean tidal waters of the RSPB reserve loch on the northern Rhinns. The Oyster Shed, Islay serves freshly shucked oysters on site, Thursday to Saturday, lunch from 11:30am. Table booking advisable — call 07376 781214. Twenty minutes\' drive from Bruichladdich. Combine with the barnacle geese reserve for a memorable morning out.'
  ),
  paraWithLink(
    '',
    'Food & drink on Islay — our complete guide \u2192',
    '/explore-islay/food-and-drink'
  ),
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== patch-canonical-blocks.ts ===\n');

  // 1. Title fixes — 5 blocks
  const titleFixes = [
    { id: 'canonical-block-distilleries-overview', title: "Islay's Ten Whisky Distilleries" },
    { id: 'canonical-block-wildlife-geese',        title: 'Barnacle Geese on Islay' },
    { id: 'canonical-block-food-drink-islay',      title: 'Food & Drink on Islay' },
    { id: 'canonical-block-families-children',     title: 'Islay with Children' },
    { id: 'canonical-block-bothan-jura-teaser',    title: 'Bothan Jura Retreat' },
  ];

  console.log('Applying title fixes...');
  for (const { id, title } of titleFixes) {
    try {
      await client.patch(id).set({ title }).commit();
      console.log(`  ✓ ${id} → "${title}"`);
    } catch (err: any) {
      console.error(`  ✗ ${id}: ${err.message}`);
    }
  }

  // 2. Block 17 — full content + teaser
  console.log('\nPatching canonical-block-loch-gruinart-oysters...');
  try {
    await client
      .patch('canonical-block-loch-gruinart-oysters')
      .set({
        fullContent: oysterFullContent,
        teaserContent: oysterTeaserContent,
      })
      .commit();
    console.log('  ✓ Block 17 full content + teaser updated');
    console.log('  Note: canonicalHome link (/explore-islay/food-and-drink) is inline in teaserContent');
  } catch (err: any) {
    console.error(`  ✗ Block 17 patch failed: ${err.message}`);
  }

  console.log('\n=== Done ===');
  console.log('\nVerify at:');
  console.log('  /explore-islay          — block headings should show readable titles');
  console.log('  /explore-islay/food-and-drink  — Block 17 full content (confirmed oyster shed details)');
  console.log('  /explore-islay/islay-wildlife  — Block 17 teaser with /explore-islay/food-and-drink link');
}

run().catch(console.error);
