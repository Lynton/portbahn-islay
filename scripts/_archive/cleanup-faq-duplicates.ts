/**
 * Cleanup FAQ Duplicates
 *
 * This script removes old non-prefixed FAQ blocks that have duplicates
 * with the faq- prefix, keeping only the faq- prefixed versions.
 *
 * Run with: npx tsx scripts/cleanup-faq-duplicates.ts
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

async function cleanupDuplicates() {
  console.log('🧹 Starting FAQ Duplicate Cleanup...\n');

  // Get all FAQ blocks
  const allFAQs = await client.fetch(
    `*[_type == "faqCanonicalBlock"] | order(question asc) { _id, question, category }`
  );

  console.log(`Found ${allFAQs.length} total FAQ blocks\n`);

  // Group by question to find duplicates
  const faqsByQuestion = new Map<string, any[]>();

  for (const faq of allFAQs) {
    if (!faqsByQuestion.has(faq.question)) {
      faqsByQuestion.set(faq.question, []);
    }
    faqsByQuestion.get(faq.question)!.push(faq);
  }

  // Find duplicates and decide which to keep/delete
  const toDelete: string[] = [];
  let duplicatesFound = 0;

  for (const [question, faqs] of faqsByQuestion.entries()) {
    if (faqs.length > 1) {
      duplicatesFound++;
      console.log(`\n🔍 Duplicate found: "${question.substring(0, 60)}..."`);

      // Find the faq- prefixed version (preferred)
      const prefixedVersion = faqs.find(f => f._id.includes('.faq-'));
      // Find old non-prefixed version(s)
      const oldVersions = faqs.filter(f => !f._id.includes('.faq-') || f._id.split('.faq-').length > 2);

      if (prefixedVersion && oldVersions.length > 0) {
        console.log(`  ✅ Keep: ${prefixedVersion._id}`);
        oldVersions.forEach(old => {
          console.log(`  ❌ Delete: ${old._id}`);
          toDelete.push(old._id);
        });
      } else {
        // No clear winner - keep the one with faq- prefix closest to start
        const sorted = [...faqs].sort((a, b) => {
          const aIsPrefixed = a._id.startsWith('faqCanonicalBlock.faq-');
          const bIsPrefixed = b._id.startsWith('faqCanonicalBlock.faq-');
          if (aIsPrefixed && !bIsPrefixed) return -1;
          if (!aIsPrefixed && bIsPrefixed) return 1;
          return a._id.length - b._id.length;
        });

        console.log(`  ✅ Keep: ${sorted[0]._id}`);
        sorted.slice(1).forEach(old => {
          console.log(`  ❌ Delete: ${old._id}`);
          toDelete.push(old._id);
        });
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 CLEANUP SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total FAQs: ${allFAQs.length}`);
  console.log(`Duplicate sets found: ${duplicatesFound}`);
  console.log(`FAQs to delete: ${toDelete.length}`);
  console.log('='.repeat(60));

  if (toDelete.length === 0) {
    console.log('\n✨ No duplicates to clean up!');
    return;
  }

  // Check if any of the documents to delete are referenced
  console.log('\n🔍 Checking for references...\n');

  for (const docId of toDelete) {
    const references = await client.fetch(
      `*[references($docId)]{ _id, _type }`,
      { docId }
    );

    if (references.length > 0) {
      console.log(`⚠️  WARNING: ${docId} is referenced by:`);
      references.forEach((ref: any) => console.log(`   - ${ref._type}: ${ref._id}`));
    }
  }

  // Delete duplicates
  console.log('\n🗑️  Deleting duplicate FAQs...\n');

  let deleted = 0;
  for (const docId of toDelete) {
    try {
      await client.delete(docId);
      console.log(`✅ Deleted: ${docId}`);
      deleted++;
    } catch (error) {
      console.log(`❌ Error deleting ${docId}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Deleted ${deleted}/${toDelete.length} duplicate FAQs`);
  console.log('='.repeat(60));
  console.log('\n✨ Cleanup complete!\n');
}

cleanupDuplicates().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
