/**
 * Cleanup Old Page Fields
 *
 * Removes the old contentBlocks and faqBlocks fields from pages
 * since we've migrated to the new pageSections structure.
 *
 * Run with: npx tsx scripts/cleanup-old-page-fields.ts
 */

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

async function cleanupOldFields() {
  console.log('🧹 Cleaning up old page fields...\n');

  const pages = await client.fetch(
    `*[_type in ["gettingHerePage", "exploreIslayPage", "homepage"]] {
      _id,
      _type,
      'hasContentBlocks': defined(contentBlocks),
      'hasFaqBlocks': defined(faqBlocks)
    }`
  );

  console.log(`Found ${pages.length} pages to check\n`);

  let pagesUpdated = 0;

  for (const page of pages) {
    const fieldsToRemove: string[] = [];

    if (page.hasContentBlocks) {
      fieldsToRemove.push('contentBlocks');
    }

    if (page.hasFaqBlocks) {
      fieldsToRemove.push('faqBlocks');
    }

    if (fieldsToRemove.length > 0) {
      console.log(`🔄 ${page._type}: Removing ${fieldsToRemove.join(', ')}`);

      try {
        await client.patch(page._id).unset(fieldsToRemove).commit();

        console.log(`✅ Cleaned up ${page._type}\n`);
        pagesUpdated++;
      } catch (error) {
        console.log(`❌ Error cleaning ${page._type}:`, error);
      }
    } else {
      console.log(`✓ ${page._type}: Already clean\n`);
    }
  }

  console.log('='.repeat(60));
  console.log('📊 CLEANUP SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Pages cleaned: ${pagesUpdated}`);
  console.log('='.repeat(60));

  console.log('\n✨ Cleanup complete!\n');
}

cleanupOldFields().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
