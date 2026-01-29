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

async function renameBlocksWithPrefixes() {
  console.log('🔄 Migrating content from old block IDs to properly prefixed IDs...\n');

  // Get all blocks with content that have mismatched IDs
  const blocks = await client.fetch(`
    *[_type == "canonicalBlock" && defined(fullContent)] {
      _id,
      _type,
      blockId,
      title,
      entityType,
      canonicalHome,
      fullContent,
      teaserContent,
      keyFacts,
      _createdAt,
      _updatedAt
    }
  `);

  console.log(`Found ${blocks.length} blocks with content\n`);

  let migratedCount = 0;

  for (const block of blocks) {
    const currentDocId = block._id;
    const slug = block.blockId?.current;

    if (!slug) {
      console.log(`⚠️  Skipping ${currentDocId} - no blockId slug`);
      continue;
    }

    // Expected document ID should match the slug pattern
    const expectedDocId = `canonical-block-${slug}`;

    if (currentDocId === expectedDocId) {
      console.log(`✓ ${currentDocId} - already correctly named`);
      continue;
    }

    console.log(`\n🔄 Migrating: ${block.title}`);
    console.log(`   Old doc ID: ${currentDocId}`);
    console.log(`   New doc ID: ${expectedDocId}`);

    try {
      // Check if the new ID already exists
      const existing = await client.fetch(`*[_id == $id][0]`, { id: expectedDocId });

      if (existing) {
        console.log(`   📝 Target document exists - updating with content from source`);

        // Update the existing document with content from the old one
        await client
          .patch(expectedDocId)
          .set({
            title: block.title,
            entityType: block.entityType,
            canonicalHome: block.canonicalHome,
            fullContent: block.fullContent,
            teaserContent: block.teaserContent,
            keyFacts: block.keyFacts,
          })
          .commit();

        console.log(`   ✅ Updated ${expectedDocId} with content`);
      } else {
        console.log(`   📝 Creating new document with correct ID`);

        // Create new document with correct ID
        await client.create({
          _id: expectedDocId,
          _type: 'canonicalBlock',
          blockId: block.blockId,
          title: block.title,
          entityType: block.entityType,
          canonicalHome: block.canonicalHome,
          fullContent: block.fullContent,
          teaserContent: block.teaserContent,
          keyFacts: block.keyFacts,
        });

        console.log(`   ✅ Created ${expectedDocId}`);
      }

      // Now delete the old incorrectly-named document
      await client.delete(currentDocId);
      console.log(`   🗑️  Deleted old ${currentDocId}`);

      migratedCount++;
    } catch (error: any) {
      console.log(`   ❌ Error:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Successfully migrated ${migratedCount} blocks`);
  console.log('='.repeat(60));
}

renameBlocksWithPrefixes().catch(console.error);
