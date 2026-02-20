/**
 * Fix Stale Block References
 *
 * Guide pages and the exploreIslayPage singleton were populated pointing at
 * old V1 canonical blocks (IDs prefixed with "content-"). This script patches
 * them to reference the correct V3 blocks (clean IDs like "ferry-basics"),
 * then deletes the 9 remaining stale blocks.
 *
 * Usage: npx tsx scripts/fix-stale-block-references.ts
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-02-19',
  useCdn: false,
});

// Maps stale block ID → correct V3 block ID
const STALE_TO_V3: Record<string, string> = {
  'canonical-block-content-beaches-overview':     'canonical-block-beaches-overview',
  'canonical-block-content-distilleries-overview':'canonical-block-distilleries-overview',
  'canonical-block-content-families-children':    'canonical-block-families-children',
  'canonical-block-content-ferry-support':        'canonical-block-ferry-support',
  'canonical-block-content-food-drink-islay':     'canonical-block-food-drink-islay',
  'canonical-block-content-jura-day-trip':        'canonical-block-jura-day-trip',
  'canonical-block-content-portbahn-beach':       'canonical-block-portbahn-beach',
  'canonical-block-content-travel-to-islay':      'canonical-block-ferry-basics', // travel-to-islay block → ferry-basics (V3 rename)
  'canonical-block-content-wildlife-geese':       'canonical-block-wildlife-geese',
};

// Documents that need patching: id → current contentBlocks
const DOCUMENTS_TO_PATCH = [
  'exploreIslayPage',
  'guide-family-holidays',
  'guide-ferry-to-islay',
  'guide-food-and-drink',
  'guide-islay-beaches',
  'guide-islay-distilleries',
  'guide-islay-wildlife',
];

async function patchDocument(docId: string) {
  // Fetch full document
  const doc = await client.getDocument(docId) as any;
  if (!doc) {
    console.log(`  ⚠ Not found: ${docId}`);
    return;
  }

  if (!doc.contentBlocks || doc.contentBlocks.length === 0) {
    console.log(`  – No contentBlocks: ${docId}`);
    return;
  }

  let changed = false;
  const patched = doc.contentBlocks.map((ref: any) => {
    const currentRef = ref.block?._ref;
    if (currentRef && STALE_TO_V3[currentRef]) {
      const v3Id = STALE_TO_V3[currentRef];
      console.log(`    ${currentRef} → ${v3Id}`);
      changed = true;
      return {
        ...ref,
        block: { _type: 'reference', _ref: v3Id },
      };
    }
    return ref;
  });

  if (!changed) {
    console.log(`  – No stale refs found: ${docId}`);
    return;
  }

  await client.patch(docId).set({ contentBlocks: patched }).commit();
  console.log(`  ✓ Patched: ${docId}`);
}

async function deleteStaleBlocks() {
  const staleIds = Object.keys(STALE_TO_V3);
  let deleted = 0;
  for (const id of staleIds) {
    try {
      await client.delete(id);
      console.log(`  ✓ Deleted: ${id}`);
      deleted++;
    } catch (e: any) {
      console.error(`  ✗ Failed to delete ${id}: ${e.message}`);
    }
  }
  console.log(`\n  ${deleted}/${staleIds.length} stale blocks deleted`);
}

async function run() {
  console.log('\n=== Step 1: Patch document references ===\n');
  for (const docId of DOCUMENTS_TO_PATCH) {
    console.log(`Patching: ${docId}`);
    await patchDocument(docId);
  }

  console.log('\n=== Step 2: Delete stale blocks ===\n');
  await deleteStaleBlocks();

  console.log('\n=== Done ===\n');
}

run().catch(console.error);
