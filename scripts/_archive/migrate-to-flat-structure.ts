/**
 * Migrate pages from nested contentSection structure to flat structure
 *
 * This script:
 * 1. Reads pages with pageSections
 * 2. Extracts all contentBlocks and faqBlocks from sections
 * 3. Updates pages with flat arrays
 *
 * Run with: npx tsx scripts/migrate-to-flat-structure.ts
 * Add --dry-run to preview changes without writing
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const isDryRun = process.argv.includes('--dry-run');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface BlockReference {
  _key: string;
  _type: string;
  block: { _type: string; _ref: string };
  version?: string;
  showKeyFacts?: boolean;
  customHeading?: string;
}

interface FaqBlockReference {
  _key: string;
  _type: string;
  faqBlock: { _type: string; _ref: string };
  overrideQuestion?: string;
}

interface ContentSection {
  _key: string;
  sectionTitle: string;
  sectionId: { current: string };
  contentBlocks?: BlockReference[];
  faqBlocks?: FaqBlockReference[];
}

async function migratePages() {
  console.log('='.repeat(60));
  console.log(isDryRun ? 'DRY RUN: Previewing migration' : 'MIGRATION: Flattening page structures');
  console.log('='.repeat(60));
  console.log('');

  // Find pages with pageSections
  const pagesWithSections = await client.fetch(`
    *[_type in ["gettingHerePage", "exploreIslayPage"] && defined(pageSections)]{
      _id,
      _type,
      title,
      pageSections
    }
  `);

  console.log(`Found ${pagesWithSections.length} pages with pageSections`);
  console.log('');

  for (const page of pagesWithSections) {
    console.log(`Processing: ${page.title} (${page._type})`);
    console.log('-'.repeat(40));

    // Extract all content blocks and FAQ blocks from sections
    const allContentBlocks: BlockReference[] = [];
    const allFaqBlocks: FaqBlockReference[] = [];

    for (const section of page.pageSections as ContentSection[]) {
      console.log(`  Section: ${section.sectionTitle}`);

      if (section.contentBlocks?.length) {
        console.log(`    - ${section.contentBlocks.length} content blocks`);
        for (const block of section.contentBlocks) {
          // Ensure proper structure
          allContentBlocks.push({
            _key: block._key,
            _type: 'blockReference',
            block: {
              _type: 'reference',
              _ref: block.block?._ref || (block as any).blockRef,
            },
            version: block.version || 'full',
            showKeyFacts: block.showKeyFacts,
            customHeading: block.customHeading,
          });
        }
      }

      if (section.faqBlocks?.length) {
        console.log(`    - ${section.faqBlocks.length} FAQ blocks`);
        for (const faq of section.faqBlocks) {
          allFaqBlocks.push({
            _key: faq._key,
            _type: 'faqBlockReference',
            faqBlock: {
              _type: 'reference',
              _ref: faq.faqBlock?._ref || (faq as any).faqRef,
            },
            overrideQuestion: faq.overrideQuestion,
          });
        }
      }
    }

    console.log('');
    console.log(`  Total: ${allContentBlocks.length} content blocks, ${allFaqBlocks.length} FAQ blocks`);
    console.log('');

    if (isDryRun) {
      console.log('  [DRY RUN] Would update with:');
      console.log(`    contentBlocks: ${JSON.stringify(allContentBlocks.slice(0, 2), null, 2)}...`);
      console.log(`    faqBlocks: ${JSON.stringify(allFaqBlocks.slice(0, 2), null, 2)}...`);
    } else {
      // Create the patch
      const result = await client
        .patch(page._id)
        .set({
          contentBlocks: allContentBlocks,
          faqBlocks: allFaqBlocks,
        })
        .unset(['pageSections'])
        .commit();

      console.log(`  ✅ Updated: ${result._id}`);
    }

    console.log('');
  }

  console.log('='.repeat(60));
  console.log(isDryRun ? 'DRY RUN COMPLETE - No changes made' : 'MIGRATION COMPLETE');
  console.log('='.repeat(60));
}

migratePages().catch(console.error);
