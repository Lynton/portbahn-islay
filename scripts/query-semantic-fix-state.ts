/**
 * Pre-flight query for patch-semantic-fixes-2026-02-28.ts
 * Checks current state of all three targets before patching.
 */
import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function run() {
  // Fix 1 — archaeology block first 2 paragraphs
  const arch = await client.fetch(
    `*[_type == "canonicalBlock" && blockId.current == "islay-archaeology-overview" && !(_id in path("drafts.**"))][0]{
      _id, "paras": fullContent[0..2]
    }`
  );
  console.log('\n=== Fix 1: islay-archaeology-overview fullContent[0..2] ===');
  arch?.paras?.forEach((p: any, i: number) => {
    console.log(`  [${i}]: "${p?.children?.[0]?.text?.slice(0, 100) || p?.style}..."`);
  });

  // Fix 2 — property descriptions
  const props = await client.fetch(
    `*[_type == "property" && slug.current in ["portbahn-house", "shorefield-eco-house"] && !(_id in path("drafts.**"))]{
      _id, name, slug,
      "descParas": description[]{
        "text": children[0].text,
        "_key": _key
      }
    }`
  );
  console.log('\n=== Fix 2: Property descriptions ===');
  for (const p of props) {
    console.log(`\n  ${p.name} (${p._id}):`);
    p.descParas?.forEach((para: any, i: number) => {
      console.log(`    [${i}]: "${para.text?.slice(0, 90) || '(no text)'}..."`);
    });
  }

  // Fix 3 — accommodation page _id + all property _ids + check if block exists
  const [accPage, allProps, existingBlock] = await Promise.all([
    client.fetch(`*[_type == "accommodationPage" && !(_id in path("drafts.**"))][0]{_id}`),
    client.fetch(`*[_type == "property" && !(_id in path("drafts.**"))]{_id, name, slug}`),
    client.fetch(`*[_type == "canonicalBlock" && blockId.current == "dog-friendly-properties" && !(_id in path("drafts.**"))][0]{_id}`),
  ]);
  console.log('\n=== Fix 3: Wiring targets ===');
  console.log('  Accommodation page:', accPage?._id || 'NOT FOUND');
  allProps?.forEach((p: any) => console.log(`  Property: ${p.name} → ${p._id}`));
  console.log('  dog-friendly-properties block already exists:', existingBlock ? existingBlock._id : 'NO — will create');
}
run().catch(console.error);
