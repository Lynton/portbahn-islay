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

async function checkDraftContent() {
  console.log('🔍 Checking for draft and published versions of canonical blocks...\n');

  // Check both published and draft versions
  const query = `*[_id in [
    "canonical-block-content-travel-to-islay",
    "drafts.canonical-block-content-travel-to-islay",
    "canonical-block-content-explore-islay",
    "drafts.canonical-block-content-explore-islay"
  ]]{
    _id,
    _type,
    blockId,
    title,
    entityType,
    canonicalHome,
    "hasFullContent": defined(fullContent),
    "hasTeaser": defined(teaserContent),
    "fullContentLength": length(fullContent),
    "teaserLength": length(teaserContent),
    "fullContentPreview": fullContent[0..1]
  }`;

  const results = await client.fetch(query);

  console.log('Found documents:', results.length);
  console.log(JSON.stringify(results, null, 2));

  // Also check all canonical blocks
  console.log('\n📋 All canonical blocks summary:\n');

  const allBlocks = await client.fetch(`
    *[_type == "canonicalBlock"]{
      _id,
      blockId,
      title,
      "hasFullContent": defined(fullContent),
      "hasTeaser": defined(teaserContent)
    }
  `);

  allBlocks.forEach((block: any) => {
    const status = block.hasFullContent ? '✅ HAS content' : '❌ MISSING content';
    console.log(`${status}: ${block.title} (${block.blockId?.current || block._id})`);
  });

  console.log(`\nTotal blocks: ${allBlocks.length}`);
}

checkDraftContent().catch(console.error);
