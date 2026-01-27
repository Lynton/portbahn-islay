/**
 * Import Script: Canonical Content Blocks
 *
 * This script parses the CANONICAL-BLOCKS-FINAL-V2_LL2.md file and creates
 * all 16 canonical blocks in Sanity.
 *
 * Usage: npx tsx scripts/import-canonical-blocks.ts
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Block ID to Entity Type mapping (from handoff doc)
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

/**
 * Parse markdown content into Sanity portable text format
 */
function markdownToPortableText(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.trim().split('\n');

  let currentParagraph: string[] = [];

  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) {
      if (currentParagraph.length > 0) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{
            _type: 'span',
            marks: [],
            text: currentParagraph.join(' '),
          }],
        });
        currentParagraph = [];
      }
      continue;
    }

    // Handle headings
    if (line.startsWith('**') && line.endsWith('**')) {
      // Bold heading (treat as h3)
      const text = line.replace(/\*\*/g, '').trim();
      blocks.push({
        _type: 'block',
        style: 'h3',
        children: [{
          _type: 'span',
          marks: [],
          text,
        }],
      });
      continue;
    }

    // Regular paragraph text
    currentParagraph.push(line.trim());
  }

  // Add final paragraph if exists
  if (currentParagraph.length > 0) {
    blocks.push({
      _type: 'block',
      style: 'normal',
      children: [{
        _type: 'span',
        marks: [],
        text: currentParagraph.join(' '),
      }],
    });
  }

  return blocks;
}

/**
 * Parse key facts from markdown table
 */
function parseKeyFacts(factsSection: string): Array<{ fact: string; value: string }> {
  const facts: Array<{ fact: string; value: string }> = [];
  const lines = factsSection.split('\n');

  for (const line of lines) {
    // Skip table header and separator
    if (line.includes('Fact') || line.includes('---')) continue;
    if (!line.includes('|')) continue;

    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    if (parts.length === 2) {
      facts.push({
        fact: parts[0],
        value: parts[1],
      });
    }
  }

  return facts;
}

/**
 * Extract a single block from markdown content
 */
function extractBlock(content: string, blockNumber: number): {
  blockId: string;
  title: string;
  fullContent: any[];
  teaserContent: any[];
  keyFacts: Array<{ fact: string; value: string }>;
} | null {
  // Find block section
  const blockPattern = new RegExp(`## Block ${blockNumber}: \\\`([^\\\`]+)\\\`([\\s\\S]*?)(?=## Block \\d+:|$)`);
  const match = content.match(blockPattern);

  if (!match) {
    console.log(`Block ${blockNumber} not found`);
    return null;
  }

  const blockId = match[1];
  const blockContent = match[2];

  // Extract title
  const titleMatch = blockContent.match(/\*\*Entity Type:\*\* ([^\n]+)/);
  const title = blockId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Extract full version
  const fullMatch = blockContent.match(/### Full Version\n\n([\s\S]*?)\n\n---\n\n### Teaser/);
  const fullContent = fullMatch ? markdownToPortableText(fullMatch[1]) : [];

  // Extract teaser version
  const teaserMatch = blockContent.match(/### Teaser Version\n\n([\s\S]*?)\n\n---\n\n### Key Facts/);
  const teaserContent = teaserMatch ? markdownToPortableText(teaserMatch[1]) : [];

  // Extract key facts
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

/**
 * Create a canonical block in Sanity
 */
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

/**
 * Main import function
 */
async function importBlocks() {
  console.log('==============================================');
  console.log('Canonical Blocks Import Script');
  console.log('==============================================\n');

  // Read markdown file
  const mdPath = path.join(process.cwd(), '_claude-handoff', 'CANONICAL-BLOCKS-FINAL-V2_LL2.md');

  if (!fs.existsSync(mdPath)) {
    console.error(`Error: File not found: ${mdPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');
  console.log(`✓ Loaded markdown file: ${mdPath}\n`);

  // Extract and create each block
  console.log('Creating blocks in Sanity...\n');

  for (let i = 1; i <= 16; i++) {
    const blockData = extractBlock(content, i);
    if (blockData) {
      await createBlock(blockData);
    }
  }

  console.log('\n==============================================');
  console.log('Import Complete!');
  console.log('==============================================');
  console.log('\nNext steps:');
  console.log('1. Open Sanity Studio and verify blocks');
  console.log('2. Review content for formatting issues');
  console.log('3. Proceed with frontend integration\n');
}

// Run import
importBlocks().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
