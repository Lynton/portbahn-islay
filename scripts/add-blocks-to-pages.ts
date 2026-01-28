/**
 * Add Canonical Blocks to Pages
 *
 * This script automatically adds the correct canonical blocks to:
 * - Getting Here page
 * - Explore Islay page
 * - Homepage
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

interface BlockConfig {
  blockId: string;
  version: 'full' | 'teaser';
  showKeyFacts?: boolean;
  customHeading?: string;
}

async function addBlocksToPage(
  pageId: string,
  pageName: string,
  blocks: BlockConfig[]
): Promise<void> {
  console.log(`\n📄 ${pageName}`);
  console.log(`   Adding ${blocks.length} blocks...\n`);

  // Fetch the canonical blocks by blockId
  const blockReferences = [];

  for (const blockConfig of blocks) {
    // Find the canonical block by blockId
    const canonicalBlock = await client.fetch(
      `*[_type == "canonicalBlock" && blockId.current == $blockId][0]{ _id, title }`,
      { blockId: blockConfig.blockId }
    );

    if (!canonicalBlock) {
      console.error(`  ✗ Block not found: ${blockConfig.blockId}`);
      continue;
    }

    // Create block reference
    const blockRef = {
      _type: 'blockReference',
      _key: Math.random().toString(36).substring(2, 11),
      block: {
        _type: 'reference',
        _ref: canonicalBlock._id,
      },
      version: blockConfig.version,
      showKeyFacts: blockConfig.showKeyFacts || false,
      customHeading: blockConfig.customHeading || undefined,
    };

    blockReferences.push(blockRef);
    console.log(`  ✓ Added: ${canonicalBlock.title} (${blockConfig.version})`);
  }

  // Update the page
  try {
    await client
      .patch(pageId)
      .set({ contentBlocks: blockReferences })
      .commit();

    console.log(`\n  ✅ Successfully updated ${pageName}`);
  } catch (error) {
    console.error(`\n  ✗ Failed to update ${pageName}:`, error);
  }
}

async function main() {
  console.log('==============================================');
  console.log('Add Canonical Blocks to Pages');
  console.log('==============================================');

  // Getting Here Page
  await addBlocksToPage('gettingHerePage', 'Getting Here Page', [
    {
      blockId: 'travel-to-islay',
      version: 'full',
      showKeyFacts: true,
    },
    {
      blockId: 'ferry-support',
      version: 'full',
    },
  ]);

  // Explore Islay Page
  await addBlocksToPage('exploreIslayPage', 'Explore Islay Page', [
    {
      blockId: 'distilleries-overview',
      version: 'full',
    },
    {
      blockId: 'families-children',
      version: 'full',
    },
    {
      blockId: 'beaches-overview',
      version: 'full',
    },
    {
      blockId: 'wildlife-geese',
      version: 'full',
    },
    {
      blockId: 'food-drink-islay',
      version: 'full',
    },
  ]);

  // Homepage - add teaser versions
  console.log('\n📄 Homepage');
  console.log('   Checking existing blocks...\n');

  const homepage = await client.fetch(
    '*[_id == "homepage"][0]{ contentBlocks }'
  );

  if (homepage?.contentBlocks && homepage.contentBlocks.length > 0) {
    console.log(`   ℹ️  Homepage already has ${homepage.contentBlocks.length} blocks`);
    console.log('   Skipping (to avoid overwriting existing configuration)\n');
  } else {
    await addBlocksToPage('homepage', 'Homepage', [
      {
        blockId: 'bruichladdich-proximity',
        version: 'teaser',
      },
      {
        blockId: 'trust-signals',
        version: 'full',
        showKeyFacts: true,
      },
      {
        blockId: 'travel-to-islay',
        version: 'teaser',
      },
      {
        blockId: 'about-us',
        version: 'teaser',
      },
    ]);
  }

  console.log('\n==============================================');
  console.log('✓ Complete!');
  console.log('==============================================');
  console.log('\n📝 Next Steps:');
  console.log('1. Check the pages on Vercel to verify blocks are rendering');
  console.log('2. Review block order and versions in Sanity Studio');
  console.log('3. Adjust showKeyFacts, customHeading as needed');
  console.log('4. Clear old inline content from page.content fields\n');
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
