import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
});

async function checkFaqStatus() {
  console.log('Checking FAQ document status...\n');

  // Check one specific referenced FAQ
  const testId = 'faqCanonicalBlock.faq-trvl-flights-can-you-fly-to-islay-from-glasgow';
  
  console.log(`Checking: ${testId}\n`);

  // Check published
  const published = await client.fetch(`*[_id == $id][0]{_id, question}`, { id: testId });
  console.log(`Published version: ${published ? '✓ Found' : '✗ Not found'}`);
  if (published) {
    console.log(`  ID: ${published._id}`);
    console.log(`  Question: ${published.question}`);
  }

  // Check draft
  const draft = await client.fetch(`*[_id == $id][0]{_id, question}`, { id: `drafts.${testId}` });
  console.log(`\nDraft version: ${draft ? '✓ Found' : '✗ Not found'}`);
  if (draft) {
    console.log(`  ID: ${draft._id}`);
    console.log(`  Question: ${draft.question}`);
  }

  // Check all FAQs
  console.log('\n--- Checking all FAQs ---\n');
  const allFaqs = await client.fetch(`*[_type == "faqCanonicalBlock"]{_id, question}`);
  console.log(`Total FAQs found: ${allFaqs.length}`);
  
  if (allFaqs.length > 0) {
    console.log('\nFirst 5 FAQs:');
    allFaqs.slice(0, 5).forEach((f: any) => {
      const isDraft = f._id.startsWith('drafts.');
      console.log(`  ${isDraft ? '[DRAFT]' : '[PUBLISHED]'} ${f._id}: ${f.question}`);
    });
  }

  // Check if referenced IDs exist
  console.log('\n--- Checking referenced IDs ---\n');
  const refs = [
    'faqCanonicalBlock.faq-trvl-flights-can-you-fly-to-islay-from-glasgow',
    'faqCanonicalBlock.faq-trvl-ferries-how-long-is-the-ferry-to-islay',
  ];

  for (const refId of refs) {
    const exists = await client.fetch(`*[_id == $id][0]{_id}`, { id: refId });
    const draftExists = await client.fetch(`*[_id == $id][0]{_id}`, { id: `drafts.${refId}` });
    
    console.log(`${refId}:`);
    console.log(`  Published: ${exists ? '✓' : '✗'}`);
    console.log(`  Draft: ${draftExists ? '✓' : '✗'}`);
    
    // Try without faq- prefix
    const withoutPrefix = refId.replace(/\.faq-/, '.');
    const altExists = await client.fetch(`*[_id == $id][0]{_id}`, { id: withoutPrefix });
    if (altExists) {
      console.log(`  Alternative (without faq-): ✓ ${withoutPrefix}`);
    }
    console.log('');
  }
}

checkFaqStatus().catch(console.error);
