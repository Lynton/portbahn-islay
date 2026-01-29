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

async function findDuplicates() {
  console.log('🔍 Finding duplicate canonical blocks...\n');

  const allBlocks = await client.fetch(`
    *[_type == "canonicalBlock"] | order(blockId.current asc, _updatedAt desc) {
      _id,
      _updatedAt,
      blockId,
      title,
      "hasFullContent": defined(fullContent),
      "hasTeaser": defined(teaserContent),
      "fullContentLength": length(fullContent)
    }
  `);

  const grouped: { [key: string]: any[] } = {};

  allBlocks.forEach((block: any) => {
    const key = block.blockId?.current || 'NO_BLOCK_ID';
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(block);
  });

  console.log('📊 Blocks grouped by blockId:\n');

  Object.entries(grouped).forEach(([blockId, blocks]) => {
    if (blocks.length > 1) {
      console.log(`⚠️  DUPLICATE: ${blockId} (${blocks.length} copies)`);
      blocks.forEach((block, idx) => {
        const content = block.hasFullContent ? `✅ ${block.fullContentLength} blocks` : '❌ NO CONTENT';
        const updated = new Date(block._updatedAt).toISOString().split('T')[0];
        console.log(`   ${idx + 1}. ${block._id} - ${content} (updated: ${updated})`);
      });
      console.log();
    }
  });

  // Show blocks that are referenced in pages
  console.log('\n🔗 Checking which blocks are referenced in pages:\n');

  const pages = await client.fetch(`
    *[_type in ["gettingHerePage", "exploreIslayPage"]] {
      _type,
      pageSections[]{
        sectionTitle,
        contentBlocks[]{
          "refId": block._ref,
          block->{
            _id,
            blockId,
            title,
            "hasContent": defined(fullContent)
          }
        }
      }
    }
  `);

  pages.forEach((page: any) => {
    console.log(`📄 ${page._type}:`);
    page.pageSections?.forEach((section: any) => {
      if (section.contentBlocks && section.contentBlocks.length > 0) {
        console.log(`  📌 ${section.sectionTitle}:`);
        section.contentBlocks.forEach((cb: any) => {
          if (cb.block) {
            const status = cb.block.hasContent ? '✅' : '❌';
            console.log(`     ${status} ${cb.block.title} (ref: ${cb.refId})`);
          } else {
            console.log(`     ⚠️  BROKEN REF: ${cb.refId}`);
          }
        });
      }
    });
    console.log();
  });
}

findDuplicates().catch(console.error);
