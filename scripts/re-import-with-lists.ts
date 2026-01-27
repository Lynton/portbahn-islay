/**
 * Re-import canonical blocks with proper list formatting
 *
 * This script:
 * 1. Removes block references from homepage temporarily
 * 2. Deletes all canonical blocks
 * 3. Re-imports with improved list parsing
 * 4. Reports which blocks need to be re-added to homepage
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Block metadata mapping
const BLOCK_METADATA: Record<string, { entityType: string; canonicalHome: string }> = {
  'travel-to-islay': { entityType: 'travel', canonicalHome: '/travel-to-islay' },
  'distilleries-overview': { entityType: 'activity', canonicalHome: '/explore-islay#whisky-distilleries-on-islay' },
  'families-children': { entityType: 'activity', canonicalHome: '/explore-islay#families-children' },
  'ferry-support': { entityType: 'trust', canonicalHome: '/travel-to-islay#when-ferry-cancellations-happen' },
  'trust-signals': { entityType: 'credibility', canonicalHome: '/#our-track-record' },
  'bruichladdich-proximity': { entityType: 'location', canonicalHome: '/#why-bruichladdich' },
  'portbahn-beach': { entityType: 'place', canonicalHome: '/explore-islay#islays-beaches' },
  'shorefield-character': { entityType: 'property', canonicalHome: '/properties/shorefield' },
  'port-charlotte-village': { entityType: 'place', canonicalHome: '/#port-charlotte' },
  'wildlife-geese': { entityType: 'nature', canonicalHome: '/explore-islay#wildlife-on-islay' },
  'food-drink-islay': { entityType: 'activity', canonicalHome: '/explore-islay#where-to-eat-on-islay' },
  'beaches-overview': { entityType: 'place', canonicalHome: '/explore-islay#islays-beaches' },
  'jura-day-trip': { entityType: 'activity', canonicalHome: '/jura' },
  'jura-longer-stay': { entityType: 'activity', canonicalHome: '/jura' },
  'bothan-jura-teaser': { entityType: 'property', canonicalHome: '/jura' },
  'about-us': { entityType: 'trust', canonicalHome: '/about' },
};

function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Parse markdown content into Sanity portable text format
 * NOW WITH PROPER LIST SUPPORT
 */
function markdownToPortableText(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.trim().split('\n');

  let currentParagraph: string[] = [];
  let currentList: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'normal',
        children: [{
          _key: generateKey(),
          _type: 'span',
          marks: [],
          text: currentParagraph.join(' '),
        }],
      });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      currentList.forEach(item => {
        blocks.push({
          _key: generateKey(),
          _type: 'block',
          style: 'normal',
          listItem: 'bullet',
          children: [{
            _key: generateKey(),
            _type: 'span',
            marks: [],
            text: item,
          }],
        });
      });
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      flushParagraph();
      flushList();
      const text = trimmed.replace(/\*\*/g, '').trim();
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'h3',
        children: [{
          _key: generateKey(),
          _type: 'span',
          marks: [],
          text,
        }],
      });
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      const listItem = trimmed.substring(2).trim();
      currentList.push(listItem);
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      const listItem = trimmed.replace(/^\d+\.\s/, '').trim();
      currentList.push(listItem);
      continue;
    }

    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

function parseKeyFacts(factsSection: string): Array<{ _key: string; fact: string; value: string }> {
  const facts: Array<{ _key: string; fact: string; value: string }> = [];
  const lines = factsSection.split('\n');

  for (const line of lines) {
    if (line.includes('Fact') || line.includes('---')) continue;
    if (!line.includes('|')) continue;

    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    if (parts.length === 2) {
      facts.push({
        _key: generateKey(),
        fact: parts[0],
        value: parts[1],
      });
    }
  }

  return facts;
}

function extractBlock(content: string, blockNumber: number): {
  blockId: string;
  title: string;
  fullContent: any[];
  teaserContent: any[];
  keyFacts: Array<{ _key: string; fact: string; value: string }>;
} | null {
  const blockPattern = new RegExp(`## Block ${blockNumber}: \\\`([^\\\`]+)\\\`([\\s\\S]*?)(?=## Block \\d+:|$)`);
  const match = content.match(blockPattern);

  if (!match) {
    console.log(`Block ${blockNumber} not found`);
    return null;
  }

  const blockId = match[1];
  const blockContent = match[2];

  const title = blockId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const fullMatch = blockContent.match(/### Full Version\n\n([\s\S]*?)\n\n---\n\n### Teaser/);
  const fullContent = fullMatch ? markdownToPortableText(fullMatch[1]) : [];

  const teaserMatch = blockContent.match(/### Teaser Version\n\n([\s\S]*?)\n\n---\n\n### Key Facts/);
  const teaserContent = teaserMatch ? markdownToPortableText(teaserMatch[1]) : [];

  const factsMatch = blockContent.match(/### Key Facts \(immutable\)\n\n([\s\S]*?)\n\n---/);
  const keyFacts = factsMatch ? parseKeyFacts(factsMatch[1]) : [];

  return {
    blockId,
    title,
    fullContent,
    teaserContent,
    keyFacts,
  };
}

async function createBlock(blockData: ReturnType<typeof extractBlock>): Promise<void> {
  if (!blockData) return;

  const metadata = BLOCK_METADATA[blockData.blockId];
  if (!metadata) {
    console.warn(`No metadata found for block: ${blockData.blockId}`);
    return;
  }

  const document = {
    _type: 'canonicalBlock',
    _id: `canonical-block-${blockData.blockId}`,
    blockId: {
      _type: 'slug',
      current: blockData.blockId,
    },
    title: blockData.title,
    entityType: metadata.entityType,
    canonicalHome: metadata.canonicalHome,
    fullContent: blockData.fullContent,
    teaserContent: blockData.teaserContent,
    keyFacts: blockData.keyFacts,
  };

  try {
    const result = await client.createOrReplace(document);
    console.log(`✓ Created block: ${blockData.blockId} (${result._id})`);
  } catch (error) {
    console.error(`✗ Failed to create block: ${blockData.blockId}`, error);
  }
}

async function main() {
  console.log('==============================================');
  console.log('Re-import Canonical Blocks with List Support');
  console.log('==============================================\n');

  // Step 1: Check for references
  console.log('Step 1: Checking for block references...\n');
  const homepage = await client.fetch('*[_id == "homepage"][0]{ contentBlocks[]{ block->{ blockId } } }');
  const draftHomepage = await client.fetch('*[_id == "drafts.homepage"][0]{ contentBlocks[]{ block->{ blockId } } }');

  const savedRefs: string[] = [];

  if (homepage?.contentBlocks && homepage.contentBlocks.length > 0) {
    console.log('⚠️  Homepage has block references:');
    homepage.contentBlocks.forEach((ref: any, i: number) => {
      if (ref.block?.blockId?.current) {
        console.log(`   ${i + 1}. ${ref.block.blockId.current}`);
        savedRefs.push(ref.block.blockId.current);
      }
    });
    console.log('\nRemoving contentBlocks from published homepage...');
    await client.patch('homepage').set({ contentBlocks: [] }).commit();
    console.log('✓ References removed from published\n');
  }

  if (draftHomepage?.contentBlocks && draftHomepage.contentBlocks.length > 0) {
    console.log('⚠️  Draft homepage has block references:');
    draftHomepage.contentBlocks.forEach((ref: any, i: number) => {
      if (ref.block?.blockId?.current) {
        console.log(`   ${i + 1}. ${ref.block.blockId.current}`);
        if (!savedRefs.includes(ref.block.blockId.current)) {
          savedRefs.push(ref.block.blockId.current);
        }
      }
    });
    console.log('\nRemoving contentBlocks from draft homepage...');
    await client.patch('drafts.homepage').set({ contentBlocks: [] }).commit();
    console.log('✓ References removed from draft\n');
  }

  if (savedRefs.length === 0) {
    console.log('✓ No block references found\n');
  }

  // Step 2: Delete existing blocks
  console.log('Step 2: Deleting existing blocks...\n');
  const result = await client.delete({ query: '*[_type == "canonicalBlock"]' });
  console.log(`✓ Deleted ${result.results?.length || 0} blocks\n`);

  // Step 3: Re-import with improved parsing
  console.log('Step 3: Re-importing blocks with list support...\n');

  const mdPath = path.join(process.cwd(), '_claude-handoff', 'CANONICAL-BLOCKS-FINAL-V2_LL2.md');

  if (!fs.existsSync(mdPath)) {
    console.error(`Error: File not found: ${mdPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');
  console.log(`✓ Loaded markdown file\n`);

  for (let i = 1; i <= 16; i++) {
    const blockData = extractBlock(content, i);
    if (blockData) {
      await createBlock(blockData);
    }
  }

  console.log('\n==============================================');
  console.log('✓ Re-import Complete!');
  console.log('==============================================');

  if (savedRefs.length > 0) {
    console.log('\n📝 Next step: Re-add block references to Homepage in Sanity Studio');
    console.log('   The following blocks were previously referenced:');
    savedRefs.forEach((blockId: string, i: number) => {
      console.log(`   ${i + 1}. ${blockId}`);
    });
  }

  console.log('\n');
}

main().catch((error) => {
  console.error('Re-import failed:', error);
  process.exit(1);
});
