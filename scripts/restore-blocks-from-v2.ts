/**
 * Restore Script: Canonical Content Blocks from V2
 *
 * Reads from _claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md (V2 — Pi's copy-edited version)
 * and patches 14 canonical blocks in Sanity that lost personal voice and local detail in V3.
 *
 * IMPORTANT: V2 uses different blockIds than V3 for some blocks:
 *   V2 `travel-to-islay`   → Sanity doc `canonical-block-ferry-basics`
 *   V2 `ferry-support`     → Sanity doc `canonical-block-ferry-support`
 *   All other V2 blockIds  → same in Sanity (canonical-block-<blockId>)
 *
 * V2 markdown heading format:
 *   ## Block N: `block-id`
 *   ### Full Version
 *   ### Teaser Version
 *   ### Key Facts (immutable)
 *
 * Usage: npx tsx scripts/restore-blocks-from-v2.ts
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
  apiVersion: '2025-02-19',
  useCdn: false,
});

// Map from V2 blockId → Sanity document _id (canonical-block-<v3-blockId>)
// V2's `travel-to-islay` becomes `ferry-basics` in V3/Sanity
// All others keep their V2 blockId
const V2_TO_SANITY_ID: Record<string, string> = {
  'travel-to-islay':        'canonical-block-ferry-basics',
  'ferry-support':          'canonical-block-ferry-support',
  'trust-signals':          'canonical-block-trust-signals',
  'bruichladdich-proximity':'canonical-block-bruichladdich-proximity',
  'portbahn-beach':         'canonical-block-portbahn-beach',
  'shorefield-character':   'canonical-block-shorefield-character',
  'port-charlotte-village': 'canonical-block-port-charlotte-village',
  'distilleries-overview':  'canonical-block-distilleries-overview',
  'wildlife-geese':         'canonical-block-wildlife-geese',
  'food-drink-islay':       'canonical-block-food-drink-islay',
  'beaches-overview':       'canonical-block-beaches-overview',
  'families-children':      'canonical-block-families-children',
  'jura-day-trip':          'canonical-block-jura-day-trip',
  'jura-longer-stay':       'canonical-block-jura-longer-stay',
  'bothan-jura-teaser':     'canonical-block-bothan-jura-teaser',
  'about-us':               'canonical-block-about-us',
};

// All V2 blocks in order (matches the ## Block N headings)
const V2_BLOCK_ORDER = [
  'travel-to-islay',
  'distilleries-overview',
  'families-children',
  'ferry-support',
  'trust-signals',
  'bruichladdich-proximity',
  'portbahn-beach',
  'shorefield-character',
  'port-charlotte-village',
  'wildlife-geese',
  'food-drink-islay',
  'beaches-overview',
  'jura-day-trip',
  'jura-longer-stay',
  'bothan-jura-teaser',
  'about-us',
];

function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Parse inline marks: bold (**text**) and italic (*text*)
 * Returns Sanity children array with marks.
 */
function parseInlineMarks(text: string): any[] {
  const children: any[] = [];
  // Split on **bold** and *italic* (non-greedy, avoiding ** for italic)
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
 * Convert a markdown string to Sanity PortableText blocks.
 * Handles: paragraphs, bold headings (**text**), bullet lists, numbered lists,
 * italic quotes (*text*), and inline bold/italic within sentences.
 * Supports H3 (###) and H4 (####).
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

    // Bullet list items: - item or * item (but not * standalone for italic)
    if (/^[-] /.test(trimmed) || /^\* /.test(trimmed)) {
      flushParagraph();
      if (currentList.length > 0 && listStyle !== 'bullet') flushList();
      listStyle = 'bullet';
      const itemText = trimmed.startsWith('- ') ? trimmed.slice(2).trim() : trimmed.slice(2).trim();
      currentList.push({ text: itemText, style: 'bullet' });
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
 * Extract a single block's data from V2 markdown.
 * V2 heading format: ## Block N: `block-id`
 * V2 subheadings: ### Full Version / ### Teaser Version / ### Key Facts (immutable)
 */
function extractV2Block(content: string, blockId: string, blockNumber: number): {
  blockId: string;
  title: string;
  fullContent: any[];
  teaserContent: any[];
  keyFacts: Array<{ _key: string; fact: string; value: string }>;
} | null {
  // Match V2 heading: ## Block N: `block-id`
  const blockPattern = new RegExp(
    `## Block ${blockNumber}: \`${blockId.replace(/-/g, '\\-')}\`([\\s\\S]*?)(?=## Block \\d+:|## Implementation|$)`
  );
  const match = content.match(blockPattern);

  if (!match) {
    console.log(`  ⚠ Block ${blockNumber} (${blockId}) not found in V2 markdown`);
    return null;
  }

  const blockContent = match[1];

  // Title from blockId (e.g., ferry-basics → Ferry Basics)
  const title = blockId.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Extract full version content (between ### Full Version and ### Teaser Version)
  const fullMatch = blockContent.match(/### Full Version\n\n([\s\S]*?)\n\n---\n\n### Teaser Version/);
  const fullContent = fullMatch ? markdownToPortableText(fullMatch[1]) : [];

  // Extract teaser version content (between ### Teaser Version and ---)
  const teaserMatch = blockContent.match(/### Teaser Version\n\n([\s\S]*?)\n\n---\n\n### Key Facts/);
  const teaserContent = teaserMatch ? markdownToPortableText(teaserMatch[1]) : [];

  // Extract key facts table
  const factsMatch = blockContent.match(/### Key Facts \(immutable\)\n\n([\s\S]*?)(?=\n---\n|$)/);
  const keyFacts = factsMatch ? parseKeyFacts(factsMatch[1]) : [];

  return { blockId, title, fullContent, teaserContent, keyFacts };
}

/**
 * Patch a canonical block document in Sanity (updates only content fields, preserves _id and schema fields)
 */
async function patchBlock(
  sanityId: string,
  blockData: NonNullable<ReturnType<typeof extractV2Block>>
): Promise<void> {
  // Use createOrReplace to fully update the document
  // We need to preserve the existing _type, blockId slug, entityType, canonicalHome
  // So we fetch the existing doc first, then merge
  const existing = await client.getDocument(sanityId);
  if (!existing) {
    console.warn(`  ⚠ Document ${sanityId} not found in Sanity — skipping`);
    return;
  }

  const updated = {
    ...existing,
    fullContent: blockData.fullContent,
    teaserContent: blockData.teaserContent,
    keyFacts: blockData.keyFacts,
  };

  const result = await client.createOrReplace(updated);
  const fullCount = blockData.fullContent.length;
  const factsCount = blockData.keyFacts.length;
  console.log(`  ✓ ${sanityId} — ${fullCount} PT blocks, ${factsCount} key facts (${result._id})`);
}

/**
 * Main restore function
 */
async function restoreBlocks() {
  console.log('\n======================================================');
  console.log('  Canonical Blocks Restore — V2 Personal Voice');
  console.log('  Source: _claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md');
  console.log('======================================================\n');

  const mdPath = path.join(process.cwd(), '_claude-handoff', 'CANONICAL-BLOCKS-FINAL-V2_LL2.md');

  if (!fs.existsSync(mdPath)) {
    console.error(`Error: File not found: ${mdPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');
  console.log(`✓ Loaded: ${mdPath}`);
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);
  console.log('Patching blocks in Sanity with V2 content...\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < V2_BLOCK_ORDER.length; i++) {
    const v2BlockId = V2_BLOCK_ORDER[i];
    const blockNumber = i + 1;
    const sanityId = V2_TO_SANITY_ID[v2BlockId];

    if (!sanityId) {
      console.warn(`  ⚠ No Sanity ID mapping for V2 block: ${v2BlockId} — skipping`);
      failCount++;
      continue;
    }

    try {
      const blockData = extractV2Block(content, v2BlockId, blockNumber);
      if (blockData) {
        await patchBlock(sanityId, blockData);
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`  ✗ Failed: ${v2BlockId} → ${sanityId}`, error);
      failCount++;
    }
  }

  console.log('\n======================================================');
  console.log(`  Complete: ${successCount} succeeded, ${failCount} failed`);
  console.log('======================================================\n');

  if (successCount > 0) {
    console.log('Next steps:');
    console.log('1. Open Sanity Studio → Canonical Content Blocks');
    console.log('2. Spot-check ferry-basics, families-children, food-drink-islay, trust-signals');
    console.log('3. Publish any remaining drafts if needed');
    console.log('4. Verify frontend at /explore-islay and /travel-to-islay\n');
  }
}

restoreBlocks().catch(error => {
  console.error('Restore failed:', error);
  process.exit(1);
});
