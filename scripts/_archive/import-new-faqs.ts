/**
 * Import New FAQ Canonical Blocks
 *
 * This script:
 * 1. Reads FAQ data from faq-import-data.json
 * 2. Creates FAQ canonical blocks in Sanity
 * 3. Handles duplicates (updates existing FAQs marked for replacement)
 * 4. Reports import results
 *
 * Run with: npx tsx scripts/import-new-faqs.ts
 */

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

function generateSlug(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80);
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

interface FAQData {
  question: string;
  answer: string;
  category: string;
  secondaryCategories?: string[];
  priority?: number;
  note?: string;
}

async function findExistingFAQ(question: string): Promise<any | null> {
  const query = `*[_type == "faqCanonicalBlock" && question == $question][0]{
    _id,
    question,
    answer,
    category
  }`;
  return await client.fetch(query, { question });
}

async function importFAQs() {
  console.log('🚀 Starting FAQ Import...\n');

  // Read FAQ data
  const dataPath = path.join(process.cwd(), 'scripts', 'faq-import-data.json');
  const faqData: FAQData[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`📊 Found ${faqData.length} FAQs to import\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const faq of faqData) {
    try {
      // Check if FAQ already exists
      const existing = await findExistingFAQ(faq.question);

      const faqDoc = {
        _type: 'faqCanonicalBlock',
        question: faq.question,
        answer: textToPortableText(faq.answer),
        category: faq.category,
        secondaryCategories: faq.secondaryCategories || [],
        priority: faq.priority || 50,
        notes: faq.note || '',
      };

      if (existing) {
        // Update existing FAQ if it has no answer or if marked for replacement
        const hasNoAnswer = !existing.answer || existing.answer.length === 0;
        if (hasNoAnswer || faq.note?.includes('REPLACES')) {
          console.log(`🔄 Updating: "${faq.question}"`);
          await client
            .patch(existing._id)
            .set(faqDoc)
            .commit();
          updated++;
        } else {
          console.log(`⏭️  Skipping (already has content): "${faq.question}"`);
          skipped++;
        }
      } else {
        // Create new FAQ
        console.log(`✅ Creating: "${faq.question}"`);
        await client.create({
          ...faqDoc,
          _id: `faqCanonicalBlock.${generateSlug(faq.question)}`,
        });
        created++;
      }
    } catch (error) {
      const errorMsg = `❌ Error with "${faq.question}": ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Created: ${created} new FAQs`);
  console.log(`🔄 Updated: ${updated} existing FAQs`);
  console.log(`⏭️  Skipped: ${skipped} FAQs (already exist)`);
  console.log(`❌ Errors: ${errors.length}`);
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n⚠️  ERRORS:');
    errors.forEach(err => console.log(err));
  }

  console.log('\n✨ Import complete!\n');
}

// Run import
importFAQs().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
