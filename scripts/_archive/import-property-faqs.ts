import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

function textToPortableText(text: string): any[] {
  const paragraphs = text.split('\n\n').filter(p => p.trim());

  return paragraphs.map(para => ({
    _key: generateKey(),
    _type: 'block',
    style: 'normal',
    children: [
      {
        _key: generateKey(),
        _type: 'span',
        marks: [],
        text: para.trim(),
      },
    ],
  }));
}

async function importPropertyFAQs() {
  console.log('🚀 Importing property-specific FAQs...\n');

  const dataPath = path.join(process.cwd(), 'scripts', 'faq-import-property-specific.json');
  const faqData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`📊 Found ${faqData.length} FAQs to import\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const faq of faqData) {
    const existing = await client.fetch(
      `*[_type == "faqCanonicalBlock" && question == $question][0]{_id, answer}`,
      { question: faq.question }
    );

    if (existing) {
      const hasNoAnswer = !existing.answer || existing.answer.length === 0;
      if (hasNoAnswer) {
        console.log(`🔄 Updating: "${faq.question}"`);
        await client
          .patch(existing._id)
          .set({
            answer: textToPortableText(faq.answer),
            category: faq.category,
            priority: faq.priority || 50,
          })
          .commit();
        updated++;
      } else {
        console.log(`⏭️  Skipping (has content): "${faq.question}"`);
        skipped++;
      }
    } else {
      console.log(`⚠️  Not found: "${faq.question}"`);
      notFound++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📈 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Updated: ${updated} FAQs`);
  console.log(`⏭️  Skipped: ${skipped} FAQs (already have content)`);
  console.log(`⚠️  Not found: ${notFound} FAQs`);
  console.log('='.repeat(60));
}

importPropertyFAQs().catch(console.error);
