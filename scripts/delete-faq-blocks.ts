/**
 * Delete all FAQ canonical blocks
 * Use this before re-running migration with updated categories
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

async function main() {
  console.log('==============================================');
  console.log('Delete All FAQ Canonical Blocks');
  console.log('==============================================\n');

  // Fetch all FAQ blocks
  const faqs = await client.fetch('*[_type == "faqCanonicalBlock"]{ _id, question, category }');

  console.log(`Found ${faqs.length} FAQ blocks to delete\n`);

  if (faqs.length === 0) {
    console.log('No FAQ blocks found. Nothing to delete.');
    return;
  }

  // Delete each block
  for (const faq of faqs) {
    try {
      await client.delete(faq._id);
      console.log(`  ✓ Deleted: "${faq.question.substring(0, 60)}..." [${faq.category}]`);
    } catch (error) {
      console.error(`  ✗ Failed to delete: "${faq.question.substring(0, 60)}..."`, error);
    }
  }

  console.log('\n==============================================');
  console.log('✓ Deletion Complete!');
  console.log('==============================================\n');
  console.log(`Deleted ${faqs.length} FAQ blocks`);
  console.log('\nYou can now re-run the migration script.\n');
}

main().catch((error) => {
  console.error('Deletion failed:', error);
  process.exit(1);
});
