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

function addKeysToPortableText(blocks: any[]): any[] {
  if (!blocks || !Array.isArray(blocks)) return blocks;

  return blocks.map(block => ({
    ...block,
    _key: block._key || generateKey(),
    children: block.children?.map((child: any) => ({
      ...child,
      _key: child._key || generateKey(),
    })) || block.children,
  }));
}

function addKeysToFacts(facts: any[]): any[] {
  if (!facts || !Array.isArray(facts)) return facts;

  return facts.map(fact => ({
    ...fact,
    _key: fact._key || generateKey(),
  }));
}

async function fixBlockKeys() {
  console.log('Fetching all canonical blocks...');

  const blocks = await client.fetch('*[_type == "canonicalBlock"]');

  console.log(`Found ${blocks.length} blocks to fix`);

  for (const block of blocks) {
    const blockId = block.blockId?.current || block.blockId;
    console.log(`\nFixing block: ${blockId}`);

    const patches: any = {};

    if (block.fullContent) {
      patches.fullContent = addKeysToPortableText(block.fullContent);
    }

    if (block.teaserContent) {
      patches.teaserContent = addKeysToPortableText(block.teaserContent);
    }

    if (block.keyFacts) {
      patches.keyFacts = addKeysToFacts(block.keyFacts);
    }

    if (Object.keys(patches).length > 0) {
      await client.patch(block._id).set(patches).commit();
      console.log(`✓ Fixed ${blockId}`);
    } else {
      console.log(`⊘ No changes needed for ${blockId}`);
    }
  }

  console.log('\n==============================================');
  console.log('All blocks fixed!');
  console.log('==============================================');
}

fixBlockKeys().catch(console.error);
