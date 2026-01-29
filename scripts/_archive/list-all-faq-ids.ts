import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function listFAQs() {
  const faqs = await client.fetch(`
    *[_type == "faqCanonicalBlock"] | order(question asc) {
      _id,
      question
    }
  `);

  console.log(`Found ${faqs.length} FAQs\n`);
  faqs.slice(0, 15).forEach((faq: any) => {
    console.log(`${faq._id}`);
    console.log(`  -> ${faq.question}\n`);
  });
}

listFAQs();
