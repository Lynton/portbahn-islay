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

async function checkFAQs() {
  const faqs = await client.fetch(`*[_type == 'faqCanonicalBlock'] | order(question asc) { _id, question, category }`);

  console.log('Current FAQ Block IDs:\n');

  const nonPrefixed = faqs.filter((faq: any) => !faq._id.startsWith('faqCanonicalBlock.faq-'));
  const prefixed = faqs.filter((faq: any) => faq._id.startsWith('faqCanonicalBlock.faq-'));

  console.log(`✅ Prefixed with faq-: ${prefixed.length}`);
  console.log(`❌ NOT prefixed: ${nonPrefixed.length}`);
  console.log(`📊 Total: ${faqs.length}\n`);

  if (nonPrefixed.length > 0) {
    console.log('Non-prefixed FAQs:');
    nonPrefixed.forEach((faq: any) => {
      console.log(`  - ${faq._id}`);
      console.log(`    ${faq.question.substring(0, 60)}...`);
    });
  } else {
    console.log('✨ All FAQs have the faq- prefix!');
  }
}

checkFAQs().catch(console.error);
