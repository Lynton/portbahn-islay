/**
 * Verify the flat structure after migration
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function verify() {
  console.log('='.repeat(60));
  console.log('VERIFYING FLAT STRUCTURE');
  console.log('='.repeat(60));
  console.log('');

  const pages = await client.fetch(`
    *[_type in ["gettingHerePage", "exploreIslayPage", "homepage"]]{
      _type,
      title,
      "hasPageSections": defined(pageSections),
      "contentBlockCount": count(contentBlocks),
      "faqBlockCount": count(faqBlocks),
      "contentBlocks": contentBlocks[]{
        _key,
        version,
        "blockId": block->blockId.current,
        "blockTitle": block->title
      },
      "faqBlocks": faqBlocks[]{
        _key,
        "question": faqBlock->question
      }
    }
  `);

  for (const page of pages) {
    console.log(`${page._type}: ${page.title}`);
    console.log('-'.repeat(40));

    if (page.hasPageSections) {
      console.log('❌ Still has pageSections (not migrated)');
    } else {
      console.log('✅ No pageSections (flat structure)');
    }

    console.log(`Content blocks: ${page.contentBlockCount}`);
    if (page.contentBlocks?.length) {
      page.contentBlocks.forEach((b: any) => {
        console.log(`  - ${b.blockId || 'unknown'} (${b.version})`);
      });
    }

    console.log(`FAQ blocks: ${page.faqBlockCount}`);
    if (page.faqBlocks?.length) {
      page.faqBlocks.slice(0, 5).forEach((f: any) => {
        console.log(`  - ${f.question?.slice(0, 50)}...`);
      });
      if (page.faqBlocks.length > 5) {
        console.log(`  ... and ${page.faqBlocks.length - 5} more`);
      }
    }

    console.log('');
  }

  console.log('='.repeat(60));
  console.log('VERIFICATION COMPLETE');
  console.log('='.repeat(60));
}

verify().catch(console.error);
