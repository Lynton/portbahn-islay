import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function cleanupOldBlocks() {
  console.log('🗑️  Cleaning up old incorrectly-named blocks...\n');

  // Find all blocks where the _id doesn't match the expected pattern based on blockId
  const blocks = await client.fetch(`
    *[_type == "canonicalBlock"] {
      _id,
      blockId,
      title
    }
  `);

  const toDelete: string[] = [];

  blocks.forEach((block: any) => {
    const slug = block.blockId?.current;
    if (!slug) return;

    const expectedId = `canonical-block-${slug}`;

    if (block._id !== expectedId && !block._id.includes('-content-')) {
      toDelete.push(block._id);
      console.log(`📌 Will delete: ${block._id} (expected: ${expectedId})`);
    }
  });

  console.log(`\nFound ${toDelete.length} old blocks to delete\n`);

  let deletedCount = 0;

  for (const blockId of toDelete) {
    try {
      await client.delete(blockId);
      console.log(`✅ Deleted: ${blockId}`);
      deletedCount++;
    } catch (error: any) {
      console.log(`❌ Error deleting ${blockId}:`, error.message);
    }
  }

  console.log(`\n✨ Deleted ${deletedCount} old blocks\n`);
}

cleanupOldBlocks().catch(console.error);
