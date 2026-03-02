/**
 * patch-audit4-fixes.ts
 *
 * Two CC actions from CW-HANDOFF-AUDIT4-STUDIO-EDITS-2026-02-28.md:
 *
 *   1. Import Block 25 (`dog-friendly-properties`) — new canonicalBlock
 *      Source: cw/pbi/content/CANONICAL-BLOCKS-MERGED-v4.md, Block 25
 *      Canonical home: /accommodation
 *      Teaser on: portbahn-house, shorefield-eco-house ONLY (Curlew Cottage does NOT accept dogs)
 *      Note: Supersedes Block 23 from CW-HANDOFF-SEMANTIC-FIXES-2 — that version had wrong Curlew policy
 *
 *   2. Patch Block 28 (`islay-archaeology-overview`) — remove duplicate opening paragraph
 *      Source: CW-HANDOFF-SEMANTIC-FIXES-2-2026-02-28.md Fix 1
 *      The page Opening field already covers the intro; Block 28 body should start at "The Oldest Layer"
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/patch-audit4-fixes.ts
 */

import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateKey = () => randomBytes(5).toString('hex');

function parseInlineMarks(text: string): { children: any[]; markDefs: any[] } {
  const children: any[] = [];
  const markDefs: any[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  for (const part of parts) {
    if (!part) continue;
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      children.push({ _key: generateKey(), _type: 'span', marks: ['strong'], text: part.slice(2, -2) });
    } else if (/^\*[^*]+\*$/.test(part)) {
      children.push({ _key: generateKey(), _type: 'span', marks: ['em'], text: part.slice(1, -1) });
    } else if (/^\[[^\]]+\]\([^)]+\)$/.test(part)) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, linkText, href] = match;
        const linkKey = generateKey();
        markDefs.push({ _key: linkKey, _type: 'link', href });
        children.push({ _key: generateKey(), _type: 'span', marks: [linkKey], text: linkText });
      }
    } else {
      children.push({ _key: generateKey(), _type: 'span', marks: [], text: part });
    }
  }
  return {
    children: children.length > 0 ? children : [{ _key: generateKey(), _type: 'span', marks: [], text }],
    markDefs,
  };
}

function markdownToPortableText(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.trim().split('\n');
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length === 0) return;
    const text = currentParagraph.join(' ').trim();
    if (!text) { currentParagraph = []; return; }
    const { children, markDefs } = parseInlineMarks(text);
    blocks.push({
      _key: generateKey(), _type: 'block', style: 'normal', markDefs,
      children,
    });
    currentParagraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '---') { flushParagraph(); continue; }

    if (trimmed.startsWith('### ')) {
      flushParagraph();
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'h3', markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text: trimmed.slice(4) }],
      });
      continue;
    }

    if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
      flushParagraph();
      const text = trimmed.replace(/^\*\*|\*\*$/g, '');
      blocks.push({
        _key: generateKey(), _type: 'block', style: 'h3', markDefs: [],
        children: [{ _key: generateKey(), _type: 'span', marks: [], text }],
      });
      continue;
    }

    flushParagraph();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  return blocks;
}

// ─── Block 25: dog-friendly-properties ───────────────────────────────────────
// Source: CANONICAL-BLOCKS-MERGED-v4.md, Block 25
// Key policy: Portbahn House + Shorefield ✅, Curlew Cottage ❌

const DOG_FRIENDLY_FULL_MD = `
Portbahn House and Shorefield Eco House welcome dogs. Dogs are accepted at both properties at £15 per stay — no limit on the number of dogs, and no size restriction. **Curlew Cottage does not accept dogs.**

Portbahn House has a private, mature enclosed garden with sea views across Loch Indaal — safe for dogs off the lead. Portbahn Beach, five minutes' walk from the house, has three sheltered bays ideal for swimming and running, with no road crossing. The coastal cycle path in both directions from the village gives easy walking without traffic. Dogs have come to Portbahn Beach with generations of guests and are a regular part of the scene.

Shorefield Eco House has private woodland and ponds on the lochside — unusual space for a dog to explore, with birdlife and water interest at every turn. The Loch Indaal shore is accessible from the garden. The coastal path connects the village to Port Charlotte beach and beyond.

Islay as a whole is an outstanding destination for dogs. The RSPB Loch Gruinart nature reserve welcomes dogs on leads. The beaches at Machir Bay, Saligo Bay, and Ardnave Point are large, open, and rarely busy. The island has almost no livestock on the main roads and walking routes are quiet. Most of Islay's heritage sites (Finlaggan, the American Monument, the Kildalton Cross) are open farmland or coastal — dogs on leads are usual practice.

**One note:** During the winter geese season (October to April), dogs must be kept on leads at RSPB Loch Gruinart and on the Gruinart Flats. Over 30,000 barnacle geese roost there; it's worth the lead for what you see.
`;

const DOG_FRIENDLY_TEASER_MD = `
Portbahn House and Shorefield Eco House welcome dogs at £15 per stay — no size or number limit. (Curlew Cottage does not accept dogs.) Portbahn Beach is 5 minutes from both properties. Islay is one of the best dog destinations in Scotland: empty beaches, quiet roads, and open countryside.
`;

const DOG_FRIENDLY_KEY_FACTS = [
  { _key: generateKey(), fact: 'Dog-friendly properties', value: 'Portbahn House + Shorefield Eco House only' },
  { _key: generateKey(), fact: 'Curlew Cottage dogs', value: 'NOT accepted' },
  { _key: generateKey(), fact: 'Dog charge', value: '£15 per stay (Portbahn House + Shorefield)' },
  { _key: generateKey(), fact: 'Size/number restriction', value: 'None' },
  { _key: generateKey(), fact: 'Portbahn House garden', value: 'Private, mature, enclosed' },
  { _key: generateKey(), fact: 'Nearest beach — Portbahn House & Shorefield', value: 'Portbahn Beach, 5 min walk' },
  { _key: generateKey(), fact: 'RSPB Loch Gruinart dog rule', value: 'Leads required Oct–Apr (geese season)' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n======================================================');
  console.log('  patch-audit4-fixes.ts');
  console.log('  1. Import Block 25: dog-friendly-properties');
  console.log('  2. Patch Block 28: remove duplicate opening paragraph');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  // ── Task 1: Import Block 25 ─────────────────────────────────────────────────

  console.log('Task 1: Importing Block 25 (dog-friendly-properties)...');
  try {
    await client.createOrReplace({
      _type: 'canonicalBlock',
      _id: 'canonical-block-dog-friendly-properties',
      blockId: { _type: 'slug', current: 'dog-friendly-properties' },
      title: 'Dog-Friendly Properties on Islay',
      entityType: 'amenity',
      canonicalHome: '/accommodation',
      fullContent: markdownToPortableText(DOG_FRIENDLY_FULL_MD),
      teaserContent: markdownToPortableText(DOG_FRIENDLY_TEASER_MD),
      keyFacts: DOG_FRIENDLY_KEY_FACTS,
    });
    console.log('  ✓ canonical-block-dog-friendly-properties created/replaced');
    console.log('  Note: Wire teaser to portbahn-house + shorefield-eco-house in Studio (NOT Curlew Cottage)');
  } catch (err: any) {
    console.error(`  ✗ Block 25 import failed: ${err.message}`);
  }

  // ── Task 2: Patch Block 28 — remove duplicate opening paragraph ─────────────

  console.log('\nTask 2: Patching Block 28 (islay-archaeology-overview)...');

  const BLOCK28_ID = 'canonical-block-islay-archaeology-overview';
  const DUPLICATE_PARAGRAPH_START = 'Islay has been continuously inhabited for more than 8,000 years';

  try {
    const block28 = await client.fetch<{ fullContent: any[] }>(
      `*[_id == $id][0]{fullContent}`,
      { id: BLOCK28_ID }
    );

    if (!block28?.fullContent?.length) {
      console.error('  ✗ Block 28 not found in Sanity or fullContent is empty');
    } else {
      const firstBlock = block28.fullContent[0];
      const firstText: string = firstBlock?.children?.[0]?.text || '';

      if (!firstText.startsWith(DUPLICATE_PARAGRAPH_START)) {
        console.log('  ⚠️  First block does not match expected duplicate paragraph.');
        console.log(`     First block text begins: "${firstText.slice(0, 80)}..."`);
        console.log('     Skipping — manual review required.');
      } else {
        await client
          .patch(BLOCK28_ID)
          .unset(['fullContent[0]'])
          .commit();
        console.log('  ✓ Removed duplicate opening paragraph from Block 28 fullContent');
        console.log(`  ✓ Block now begins at: "${block28.fullContent[1]?.children?.[0]?.text?.slice(0, 60) || '(next block)'}..."`);
      }
    }
  } catch (err: any) {
    console.error(`  ✗ Block 28 patch failed: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log('  Done');
  console.log('======================================================');
  console.log('\nNext steps (Studio — not CC):');
  console.log('  1. Wire Block 25 teaser to portbahn-house contentBlocks');
  console.log('  2. Wire Block 25 teaser to shorefield-eco-house contentBlocks');
  console.log('  3. Fix 1a: islay-travel hub → "Ferry Basics" section — replace body text');
  console.log('  4. Fix 1b: islay-travel hub → "Ferry to Islay" card — remove 2h/2h20m/12-week detail');
  console.log('  5. Fix 2: explore-islay scopeIntro — apply replacement text');
}

run().catch(console.error);
