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

async function analyzeBlockIds() {
  console.log('🔍 Analyzing block IDs vs document _id...\n');

  const blocks = await client.fetch(`
    *[_type == "canonicalBlock"] | order(blockId.current asc) {
      _id,
      blockId,
      title,
      "hasContent": defined(fullContent)
    }
  `);

  blocks.forEach((block: any) => {
    const slug = block.blockId?.current;
    const docId = block._id;
    const content = block.hasContent ? '✅ HAS CONTENT' : '❌ NO CONTENT';

    console.log(`${content}`);
    console.log(`  Document ID: ${docId}`);
    console.log(`  blockId slug: ${slug}`);
    console.log(`  Title: ${block.title}`);
    console.log();
  });
}

analyzeBlockIds().catch(console.error);
