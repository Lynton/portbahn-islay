/**
 * Populate Page Sections Script
 *
 * This script:
 * 1. Reads page section mappings from page-sections-mapping.json
 * 2. Fetches canonical blocks and FAQ blocks from Sanity
 * 3. Creates contentSection objects with proper references
 * 4. Updates Travel to Islay and Explore Islay pages with sections
 *
 * Run with: npx tsx scripts/populate-page-sections.ts
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

interface ContentBlockRef {
  blockId: string;
  renderAs: 'full' | 'teaser';
}

interface SectionMapping {
  sectionTitle: string;
  sectionId: string;
  contentBlocks: ContentBlockRef[];
  faqQuestions: string[];
}

interface PageMapping {
  pageId: string;
  sections: SectionMapping[];
}

interface Mapping {
  travelToIslayPage: PageMapping;
  exploreIslayPage: PageMapping;
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

async function findCanonicalBlockByBlockId(blockId: string): Promise<any | null> {
  const query = `*[_type == "canonicalBlock" && blockId.current == $blockId][0]{ _id }`;
  return await client.fetch(query, { blockId });
}

async function findFAQByQuestion(question: string): Promise<any | null> {
  const query = `*[_type == "faqCanonicalBlock" && question == $question][0]{ _id }`;
  return await client.fetch(query, { question });
}

async function createContentSections(sections: SectionMapping[]): Promise<any[]> {
  const contentSections = [];

  for (const section of sections) {
    console.log(`\n📦 Processing section: "${section.sectionTitle}"`);

    // Build content block references
    const contentBlockRefs = [];
    for (const blockRef of section.contentBlocks) {
      const block = await findCanonicalBlockByBlockId(blockRef.blockId);
      if (block) {
        contentBlockRefs.push({
          _key: generateKey(),
          _type: 'blockReference',
          version: blockRef.renderAs, // 'full' or 'teaser'
          showKeyFacts: false,
          block: {
            _type: 'reference',
            _ref: block._id,
          },
        });
        console.log(`  ✅ Content block: ${blockRef.blockId} (${blockRef.renderAs})`);
      } else {
        console.log(`  ⚠️  Content block NOT FOUND: ${blockRef.blockId}`);
      }
    }

    // Build FAQ block references
    const faqBlockRefs = [];
    for (const question of section.faqQuestions) {
      const faq = await findFAQByQuestion(question);
      if (faq) {
        faqBlockRefs.push({
          _key: generateKey(),
          _type: 'faqBlockReference',
          faqBlock: {
            _type: 'reference',
            _ref: faq._id,
          },
        });
        console.log(`  ✅ FAQ: "${question}"`);
      } else {
        console.log(`  ⚠️  FAQ NOT FOUND: "${question}"`);
      }
    }

    // Create section object
    contentSections.push({
      _key: generateKey(),
      _type: 'contentSection',
      sectionTitle: section.sectionTitle,
      sectionId: {
        _type: 'slug',
        current: section.sectionId,
      },
      contentBlocks: contentBlockRefs,
      faqBlocks: faqBlockRefs,
    });

    console.log(`  📊 Section created: ${contentBlockRefs.length} content + ${faqBlockRefs.length} FAQs`);
  }

  return contentSections;
}

async function updatePage(pageId: string, sections: any[]) {
  console.log(`\n🔄 Updating page: ${pageId}`);

  // Get the page document ID
  const query = `*[_type == $pageId][0]{ _id }`;
  const page = await client.fetch(query, { pageId });

  if (!page) {
    console.log(`  ❌ Page not found: ${pageId}`);
    return false;
  }

  // Update the page with sections
  await client
    .patch(page._id)
    .set({ pageSections: sections })
    .commit();

  console.log(`  ✅ Page updated with ${sections.length} sections`);
  return true;
}

async function populatePages() {
  console.log('🚀 Starting Page Section Population...\n');

  // Read mapping file
  const mappingPath = path.join(process.cwd(), 'scripts', 'page-sections-mapping.json');
  const mapping: Mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  let pagesUpdated = 0;
  let totalSections = 0;

  // Process Travel to Islay page
  console.log('=' .repeat(60));
  console.log('📄 TRAVEL TO ISLAY PAGE');
  console.log('=' .repeat(60));

  const travelSections = await createContentSections(mapping.travelToIslayPage.sections);
  const travelSuccess = await updatePage(mapping.travelToIslayPage.pageId, travelSections);
  if (travelSuccess) {
    pagesUpdated++;
    totalSections += travelSections.length;
  }

  // Process Explore Islay page
  console.log('\n' + '='.repeat(60));
  console.log('📄 EXPLORE ISLAY PAGE');
  console.log('=' .repeat(60));

  const exploreSections = await createContentSections(mapping.exploreIslayPage.sections);
  const exploreSuccess = await updatePage(mapping.exploreIslayPage.pageId, exploreSections);
  if (exploreSuccess) {
    pagesUpdated++;
    totalSections += exploreSections.length;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 POPULATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Pages updated: ${pagesUpdated}/2`);
  console.log(`📦 Total sections created: ${totalSections}`);
  console.log('='.repeat(60));

  console.log('\n✨ Population complete!\n');
  console.log('Next steps:');
  console.log('1. Open Sanity Studio');
  console.log('2. View Travel to Islay page');
  console.log('3. View Explore Islay page');
  console.log('4. Verify sections are populated correctly');
}

// Run population
populatePages().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
