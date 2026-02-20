/**
 * Import Script: Canonical Content Blocks (V3)
 *
 * Reads from docs/content/CANONICAL-BLOCKS-FINAL.md (V3, current source of truth)
 * and creates all 16 canonical blocks in Sanity using createOrReplace.
 *
 * Usage: npx tsx scripts/import-canonical-blocks.ts
 *
 * Prerequisites:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 * - NEXT_PUBLIC_SANITY_DATASET in .env.local (defaults to 'production')
 * - SANITY_API_TOKEN in .env.local (needs write access)
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
  apiVersion: '2025-02-19',
  useCdn: false,
});

// Block metadata: maps blockId → entityType + canonicalHome
// Aligned with CANONICAL-BLOCKS-FINAL.md V3 (2026-02-20)
const BLOCK_METADATA: Record<string, { entityType: string; canonicalHome: string }> = {
  'ferry-basics':           { entityType: 'travel',      canonicalHome: '/travel-to-islay' },
  'ferry-support':          { entityType: 'trust',        canonicalHome: '/travel-to-islay' },
  'trust-signals':          { entityType: 'credibility',  canonicalHome: '/' },
  'bruichladdich-proximity':{ entityType: 'location',     canonicalHome: '/' },
  'portbahn-beach':         { entityType: 'place',        canonicalHome: '/explore-islay' },
  'shorefield-character':   { entityType: 'property',     canonicalHome: '/accommodation/shorefield-eco-house' },
  'port-charlotte-village': { entityType: 'place',        canonicalHome: '/' },
  'distilleries-overview':  { entityType: 'activity',     canonicalHome: '/explore-islay' },
  'wildlife-geese':         { entityType: 'nature',       canonicalHome: '/explore-islay' },
  'food-drink-islay':       { entityType: 'activity',     canonicalHome: '/explore-islay' },
  'beaches-overview':       { entityType: 'place',        canonicalHome: '/explore-islay' },
  'families-children':      { entityType: 'activity',     canonicalHome: '/explore-islay' },
  'jura-day-trip':          { entityType: 'activity',     canonicalHome: '/jura' },
  'jura-longer-stay':       { entityType: 'activity',     canonicalHome: '/jura' },
  'bothan-jura-teaser':     { entityType: 'property',     canonicalHome: '/jura' },
  'about-us':               { entityType: 'trust',        canonicalHome: '/about' },
};

// Canonical order (matches CANONICAL-BLOCKS-FINAL.md block numbers 1-16)
const BLOCK_ORDER = [
  'ferry-basics',
  'ferry-support',
  'trust-signals',
  'bruichladdich-proximity',
  'portbahn-beach',
  'shorefield-character',
  'port-charlotte-village',
  'distilleries-overview',
  'wildlife-geese',
  'food-drink-islay',
  'beaches-overview',
  'families-children',
  'jura-day-trip',
  'jura-longer-stay',
  'bothan-jura-teaser',
  'about-us',
];

function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Convert a markdown string to Sanity PortableText blocks.
 * Handles: paragraphs, bold headings (**text**), bullet lists, numbered lists,
 * italic quotes (*text*), and inline bold (**text** within a sentence).
 */
function markdownToPortableText(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.trim().split('\n');

  let currentParagraph: string[] = [];
  let currentList: { text: string; style: 'bullet' | 'number' }[] = [];
  let listStyle: 'bullet' | 'number' = 'bullet';

  const flushParagraph = () => {
    if (currentParagraph.length === 0) return;
    const text = currentParagraph.join(' ').trim();
    if (!text) { currentParagraph = []; return; }
    blocks.push({
      _key: generateKey(),
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: parseInlineMarks(text),
    });
    currentParagraph = [];
  };

  const flushList = () => {
    if (currentList.length === 0) return;
    currentList.forEach(item => {
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'normal',
        listItem: item.style,
        level: 1,
        markDefs: [],
        children: parseInlineMarks(item.text),
      });
    });
    currentList = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // H3 heading: ### Heading
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'h3',
        markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text: trimmed.slice(4) }],
      });
      continue;
    }

    // H4 heading: #### Heading
    if (trimmed.startsWith('#### ')) {
      flushParagraph();
      flushList();
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'h4',
        markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text: trimmed.slice(5) }],
      });
      continue;
    }

    // Standalone bold line used as heading: **Heading Text**
    if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
      flushParagraph();
      flushList();
      const text = trimmed.replace(/^\*\*|\*\*$/g, '');
      blocks.push({
        _key: generateKey(),
        _type: 'block',
        style: 'h4',
        markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
      });
      continue;
    }

    // Bullet list items: - item or * item
    if (/^[-*] /.test(trimmed)) {
      flushParagraph();
      if (currentList.length > 0 && listStyle !== 'bullet') flushList();
      listStyle = 'bullet';
      currentList.push({ text: trimmed.slice(2).trim(), style: 'bullet' });
      continue;
    }

    // Numbered list: 1. item
    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      if (currentList.length > 0 && listStyle !== 'number') flushList();
      listStyle = 'number';
      currentList.push({ text: trimmed.replace(/^\d+\.\s/, '').trim(), style: 'number' });
      continue;
    }

    // Regular paragraph text
    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

/**
 * Parse inline marks: bold (**text**) and italic (*text*)
 * Returns Sanity children array with marks.
 */
function parseInlineMarks(text: string): any[] {
  const children: any[] = [];
  // Regex to split on **bold** and *italic* (non-greedy)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  for (const part of parts) {
    if (!part) continue;
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      children.push({ _key: generateKey(), _type: 'span', marks: ['strong'], text: part.slice(2, -2) });
    } else if (/^\*[^*]+\*$/.test(part)) {
      children.push({ _key: generateKey(), _type: 'span', marks: ['em'], text: part.slice(1, -1) });
    } else {
      children.push({ _key: generateKey(), _type: 'span', marks: [], text: part });
    }
  }

  return children.length > 0 ? children : [{ _key: generateKey(), _type: 'span', marks: [], text }];
}

/**
 * Parse key facts from a markdown table
 */
function parseKeyFacts(factsSection: string): Array<{ _key: string; fact: string; value: string }> {
  const facts: Array<{ _key: string; fact: string; value: string }> = [];
  const lines = factsSection.split('\n');

  for (const line of lines) {
    if (line.includes('Fact') || line.includes('---')) continue;
    if (!line.includes('|')) continue;
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    if (parts.length >= 2) {
      facts.push({ _key: generateKey(), fact: parts[0], value: parts[1] });
    }
  }

  return facts;
}

/**
 * Extract a single block's data from the V3 markdown content.
 * V3 format: ### Block N: `block-id`
 */
function extractBlock(content: string, blockId: string, blockNumber: number): {
  blockId: string;
  title: string;
  fullContent: any[];
  teaserContent: any[];
  keyFacts: Array<{ _key: string; fact: string; value: string }>;
} | null {
  // Match V3 heading: ### Block N: `block-id`
  const escapedId = blockId.replace(/-/g, '-');
  const blockPattern = new RegExp(
    `### Block ${blockNumber}: \`${escapedId}\`([\\s\\S]*?)(?=### Block \\d+:|## Summary|$)`
  );
  const match = content.match(blockPattern);

  if (!match) {
    console.log(`  ⚠ Block ${blockNumber} (${blockId}) not found in markdown`);
    return null;
  }

  const blockContent = match[1];

  // Title from blockId (e.g., ferry-basics → Ferry Basics)
  const title = blockId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Extract full version content
  const fullMatch = blockContent.match(/#### Full Version\n\n([\s\S]*?)\n\n#### Teaser Version/);
  const fullContent = fullMatch ? markdownToPortableText(fullMatch[1]) : [];

  // Extract teaser version content
  const teaserMatch = blockContent.match(/#### Teaser Version\n\n([\s\S]*?)\n\n#### Key Facts/);
  const teaserContent = teaserMatch ? markdownToPortableText(teaserMatch[1]) : [];

  // Extract key facts table
  const factsMatch = blockContent.match(/#### Key Facts \(immutable\)\n\n([\s\S]*?)(?=\n---\n|$)/);
  const keyFacts = factsMatch ? parseKeyFacts(factsMatch[1]) : [];

  return { blockId, title, fullContent, teaserContent, keyFacts };
}

/**
 * Upsert a canonical block document in Sanity
 */
async function upsertBlock(blockData: NonNullable<ReturnType<typeof extractBlock>>): Promise<void> {
  const metadata = BLOCK_METADATA[blockData.blockId];
  if (!metadata) {
    console.warn(`  ⚠ No metadata for block: ${blockData.blockId} — skipping`);
    return;
  }

  const document = {
    _type: 'canonicalBlock',
    _id: `canonical-block-${blockData.blockId}`,
    blockId: { _type: 'slug', current: blockData.blockId },
    title: blockData.title,
    entityType: metadata.entityType,
    canonicalHome: metadata.canonicalHome,
    fullContent: blockData.fullContent,
    teaserContent: blockData.teaserContent,
    keyFacts: blockData.keyFacts,
  };

  const result = await client.createOrReplace(document);
  const fullCount = blockData.fullContent.length;
  const factsCount = blockData.keyFacts.length;
  console.log(`  ✓ ${blockData.blockId} — ${fullCount} content blocks, ${factsCount} key facts (${result._id})`);
}

/**
 * Main import function
 */
async function importBlocks() {
  console.log('\n======================================================');
  console.log('  Canonical Blocks Import — V3.1 Merged (CANONICAL-BLOCKS-MERGED.md)');
  console.log('======================================================\n');

  const mdPath = path.join(process.cwd(), 'docs', 'content', 'CANONICAL-BLOCKS-MERGED.md');

  if (!fs.existsSync(mdPath)) {
    console.error(`Error: File not found: ${mdPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');
  console.log(`✓ Loaded: ${mdPath}`);
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);
  console.log('Creating/updating blocks in Sanity...\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < BLOCK_ORDER.length; i++) {
    const blockId = BLOCK_ORDER[i];
    const blockNumber = i + 1;
    try {
      const blockData = extractBlock(content, blockId, blockNumber);
      if (blockData) {
        await upsertBlock(blockData);
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`  ✗ Failed: ${blockId}`, error);
      failCount++;
    }
  }

  console.log('\n======================================================');
  console.log(`  Complete: ${successCount} succeeded, ${failCount} failed`);
  console.log('======================================================\n');

  if (successCount > 0) {
    console.log('Next steps:');
    console.log('1. Open Sanity Studio (/studio) → Canonical Content Blocks');
    console.log('2. Review formatting and content for each block');
    console.log('3. Publish all blocks (they import as drafts if token lacks publish rights)');
    console.log('4. Then wire up page contentBlocks via Studio (see HUB-PAGE-CONTENT-DRAFT.md)\n');
  }
}

importBlocks().catch(error => {
  console.error('Import failed:', error);
  process.exit(1);
});
