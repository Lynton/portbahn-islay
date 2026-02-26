/**
 * fetch-block-content.ts
 * Dumps full plain text + current JSON for blocks/pages needing patch.
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/fetch-block-content.ts
 */
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 't25lpmnm',
  dataset: 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const BLOCK_IDS = [
  'canonical-block-islay-archaeology-overview',
  'canonical-block-islay-villages-overview',
  'canonical-block-jura-longer-stay',
  'canonical-block-bothan-jura-teaser',
  'canonical-block-walking-islay-overview',
  'canonical-block-about-us',
  'canonical-block-trust-signals',
  'canonical-block-ferry-support',
  'canonical-block-ferry-basics',
  'canonical-block-portbahn-beach',
  'canonical-block-shorefield-character',
  'canonical-block-loch-gruinart-oysters',
];

const PAGE_IDS = [
  'guide-archaeology-history',
  'guide-islay-villages',
  'guide-visit-jura',
  'guide-food-and-drink',
  'guide-islay-distilleries',
  'guide-walking',
  'guide-islay-wildlife',
  'guide-islay-beaches',
  'guide-family-holidays',
];

async function main() {
  console.log('\n=== CANONICAL BLOCKS (fullContent plain text) ===\n');
  for (const id of BLOCK_IDS) {
    const res = await client.fetch(
      `*[_id == $id][0]{ _id, "blockId": blockId.current, "text": pt::text(fullContent) }`,
      { id }
    );
    if (!res) { console.log(`--- ${id}: NOT FOUND ---\n`); continue; }
    console.log(`\n--- ${id} ---`);
    console.log(res.text || '(empty)');
    console.log('---END---\n');
  }

  console.log('\n=== GUIDE PAGES (extendedEditorial plain text) ===\n');
  for (const id of PAGE_IDS) {
    const res = await client.fetch(
      `*[_id == $id][0]{ _id, "slug": slug.current, "text": pt::text(extendedEditorial) }`,
      { id }
    );
    if (!res) { console.log(`--- ${id}: NOT FOUND ---\n`); continue; }
    console.log(`\n--- ${id} (${res.slug}) ---`);
    console.log(res.text || '(empty)');
    console.log('---END---\n');
  }

  console.log('\n=== PROPERTIES (description + locationIntro) ===\n');
  const props = await client.fetch(`
    *[_type == 'property'] | order(slug.current) {
      _id,
      "slug": slug.current,
      name,
      "descText": pt::text(description),
      "locText": pt::text(locationIntro)
    }
  `);
  for (const p of props) {
    console.log(`\n--- ${p._id} (${p.slug}) ---`);
    console.log('DESCRIPTION:');
    console.log(p.descText || '(empty)');
    console.log('\nLOCATION INTRO:');
    console.log(p.locText || '(empty)');
    console.log('---END---\n');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
