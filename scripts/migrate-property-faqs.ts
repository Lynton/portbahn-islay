/**
 * Migrate Property Common Questions to FAQ Canonical Blocks
 *
 * This script:
 * 1. Fetches all properties with commonQuestions
 * 2. Creates FAQ canonical blocks for each question
 * 3. Links property-specific FAQs to their properties
 * 4. Categorizes as property-general or property-specific
 * 5. Reports migration results
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

function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

function generateSlug(question: string, propertyName?: string): string {
  // Create slug from question
  let slug = question
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 60); // Limit length

  // Add property prefix if property-specific
  if (propertyName) {
    const propertySlug = propertyName.toLowerCase().replace(/\s+/g, '-');
    slug = `${propertySlug}-${slug}`;
  }

  return slug;
}

function textToPortableText(text: string): any[] {
  // Simple conversion: split by newlines, create paragraphs
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

interface PropertyFAQ {
  propertyId: string;
  propertyName: string;
  propertySlug: string;
  question: string;
  answer: string;
}

type CategoryType = 'property-general' | 'property-portbahn' | 'property-shorefield' | 'property-curlew';

async function categorizeQuestion(
  question: string,
  answer: string,
  propertyName: string,
  propertySlug: string
): Promise<CategoryType> {
  // Check if question mentions specific property
  const lowerQuestion = question.toLowerCase();
  const lowerAnswer = answer.toLowerCase();
  const lowerPropertyName = propertyName.toLowerCase();

  const mentionsProperty =
    lowerQuestion.includes(lowerPropertyName) ||
    lowerAnswer.includes(lowerPropertyName) ||
    lowerQuestion.includes('this property') ||
    lowerQuestion.includes('this house') ||
    lowerQuestion.includes('this cottage');

  // Keywords that suggest property-specific
  const specificKeywords = [
    'how far',
    'walking distance',
    'view',
    'location',
    'private',
    'garden',
    'beach access',
    'parking',
    'bedroom',
    'bathroom',
    'bird hide',
    'walled garden',
    'distillery',
  ];

  const hasSpecificKeyword = specificKeywords.some(
    (keyword) => lowerQuestion.includes(keyword) || lowerAnswer.includes(keyword)
  );

  // General keywords
  const generalKeywords = [
    'wifi',
    'check-in',
    'check-out',
    'pets',
    'dogs',
    'cancellation',
    'payment',
    'booking',
    'minimum stay',
    'towels',
    'linen',
    'heating',
    'dishwasher',
  ];

  const hasGeneralKeyword = generalKeywords.some(
    (keyword) => lowerQuestion.includes(keyword) || lowerAnswer.includes(keyword)
  );

  // Decision logic - if property-specific, map to specific category
  if (mentionsProperty || (hasSpecificKeyword && !hasGeneralKeyword)) {
    // Map property slug to category
    if (propertySlug.includes('portbahn')) return 'property-portbahn';
    if (propertySlug.includes('shorefield')) return 'property-shorefield';
    if (propertySlug.includes('curlew')) return 'property-curlew';
  }

  return 'property-general';
}

async function createFAQBlock(
  faq: PropertyFAQ,
  category: CategoryType
): Promise<void> {
  const isPropertySpecific = category !== 'property-general';
  const slug = generateSlug(
    faq.question,
    isPropertySpecific ? faq.propertyName : undefined
  );

  const document = {
    _type: 'faqCanonicalBlock',
    _id: `faq-${slug}`,
    question: faq.question,
    answer: textToPortableText(faq.answer),
    category,
    secondaryCategories: [],
    keywords: [], // To be added later during SEO research
    searchVolume: 'unknown',
    relatedQuestions: [],
    priority: 50,
    notes: `Migrated from ${faq.propertyName} commonQuestions on ${new Date().toISOString()}`,
  };

  try {
    const result = await client.createOrReplace(document);
    console.log(`  ✓ Created: "${faq.question.substring(0, 60)}..." [${category}]`);
  } catch (error) {
    console.error(`  ✗ Failed: "${faq.question.substring(0, 60)}..."`, error);
  }
}

async function main() {
  console.log('==============================================');
  console.log('Migrate Property FAQs to Canonical Blocks');
  console.log('==============================================\n');

  // Step 1: Fetch all properties with commonQuestions
  console.log('Step 1: Fetching properties with FAQs...\n');

  const properties = await client.fetch(`
    *[_type == "property" && defined(commonQuestions) && count(commonQuestions) > 0]{
      _id,
      name,
      "slug": slug.current,
      commonQuestions[]{
        question,
        answer
      }
    }
  `);

  console.log(`Found ${properties.length} properties with FAQs\n`);

  if (properties.length === 0) {
    console.log('No properties with commonQuestions found. Exiting.');
    return;
  }

  // Step 2: Process each property
  let totalFAQs = 0;
  const categoryCounts: Record<string, number> = {
    'property-general': 0,
    'property-portbahn': 0,
    'property-shorefield': 0,
    'property-curlew': 0,
  };

  for (const property of properties) {
    console.log(`\n📦 Processing: ${property.name}`);
    console.log(`   ${property.commonQuestions.length} questions found\n`);

    for (const qa of property.commonQuestions) {
      const faq: PropertyFAQ = {
        propertyId: property._id,
        propertyName: property.name,
        propertySlug: property.slug,
        question: qa.question,
        answer: qa.answer,
      };

      const category = await categorizeQuestion(qa.question, qa.answer, property.name, property.slug);

      await createFAQBlock(faq, category);

      totalFAQs++;
      categoryCounts[category]++;
    }
  }

  // Step 3: Summary
  console.log('\n==============================================');
  console.log('✓ Migration Complete!');
  console.log('==============================================');
  console.log(`\nTotal FAQs migrated: ${totalFAQs}`);
  console.log(`  - Property General: ${categoryCounts['property-general']}`);
  console.log(`  - Portbahn House: ${categoryCounts['property-portbahn']}`);
  console.log(`  - Shorefield: ${categoryCounts['property-shorefield']}`);
  console.log(`  - Curlew: ${categoryCounts['property-curlew']}`);

  console.log('\n📝 Next Steps:');
  console.log('1. Review FAQ blocks in Sanity Studio');
  console.log('2. Verify categorization (general vs specific)');
  console.log('3. Add keywords for SEO research');
  console.log('4. Link related questions');
  console.log('5. Set display priorities');
  console.log('6. Add FAQ blocks to property pages via faqBlocks field');
  console.log('7. Build FAQ rendering components for frontend');
  console.log('8. After verification, optionally remove commonQuestions field\n');
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
