/**
 * Patch gettingHerePage stale block references and delete remaining stale blocks.
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

async function run() {
  // Patch gettingHerePage: content-travel-to-islay → ferry-basics, content-ferry-support → ferry-support
  const doc = await client.getDocument('gettingHerePage') as any;
  const patched = doc.contentBlocks.map((ref: any) => {
    if (ref.block?._ref === 'canonical-block-content-travel-to-islay') {
      console.log('  content-travel-to-islay → canonical-block-ferry-basics');
      return { ...ref, block: { _type: 'reference', _ref: 'canonical-block-ferry-basics' } };
    }
    if (ref.block?._ref === 'canonical-block-content-ferry-support') {
      console.log('  content-ferry-support → canonical-block-ferry-support');
      return { ...ref, block: { _type: 'reference', _ref: 'canonical-block-ferry-support' } };
    }
    return ref;
  });

  await client.patch('gettingHerePage').set({ contentBlocks: patched }).commit();
  console.log('✓ Patched: gettingHerePage');

  // Now delete the last two stale blocks
  for (const id of ['canonical-block-content-ferry-support', 'canonical-block-content-travel-to-islay']) {
    try {
      await client.delete(id);
      console.log('✓ Deleted:', id);
    } catch (e: any) {
      console.error('✗ Failed:', id, e.message);
    }
  }

  console.log('\nDone.');
}

run().catch(console.error);
