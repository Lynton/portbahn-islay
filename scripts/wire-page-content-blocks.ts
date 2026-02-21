/**
 * Wire Page Content Blocks
 *
 * Populates the contentBlocks array on each page singleton in Sanity,
 * referencing the correct canonical blocks with the correct version
 * (full/teaser), custom headings, and key facts visibility.
 *
 * Source of truth:
 * - HOMEPAGE-V3-CORRECTED.md (homepage block layout)
 * - CONTENT-ARCHITECTURE-MVP.md (all page block assignments)
 * - CANONICAL-BLOCKS-MERGED.md (block directory with canonical homes + teaser targets)
 *
 * Prerequisites:
 * - Canonical blocks must already exist in Sanity (run import-canonical-blocks.ts first)
 * - NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 * - NEXT_PUBLIC_SANITY_DATASET in .env.local (defaults to 'production')
 * - SANITY_API_TOKEN in .env.local (needs write access)
 *
 * Usage: npx tsx scripts/wire-page-content-blocks.ts
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-02-19',
  useCdn: false,
});

function generateKey(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Create a blockReference object for Sanity.
 * This matches the blockReference schema: { block (ref), version, showKeyFacts, customHeading }
 */
function blockRef(
  blockId: string,
  version: 'full' | 'teaser',
  options?: { customHeading?: string; showKeyFacts?: boolean }
) {
  return {
    _key: generateKey(),
    _type: 'blockReference',
    block: {
      _type: 'reference',
      _ref: `canonical-block-${blockId}`,
    },
    version,
    showKeyFacts: options?.showKeyFacts ?? false,
    ...(options?.customHeading ? { customHeading: options.customHeading } : {}),
  };
}

// ─────────────────────────────────────────────────────────
// PAGE CONTENT BLOCK ASSIGNMENTS
// Source: HOMEPAGE-V3-CORRECTED.md + CONTENT-ARCHITECTURE-MVP.md
// ─────────────────────────────────────────────────────────

const PAGE_BLOCKS: Record<string, { type: string; blocks: ReturnType<typeof blockRef>[] }> = {
  // ─── HOMEPAGE ─────────────────────────────────────────
  // Spec: HOMEPAGE-V3-CORRECTED.md
  // Section 3: Our Track Record (trust-signals FULL)
  // Section 4: Why We Love Bruichladdich (bruichladdich-proximity FULL + port-charlotte-village FULL)
  // Section 4b: Also on Jura (bothan-jura-teaser TEASER)
  // Section 5: How to Get Here (ferry-basics TEASER + ferry-support TEASER)
  homepage: {
    type: 'homepage',
    blocks: [
      blockRef('trust-signals', 'full', { customHeading: 'Our Track Record', showKeyFacts: true }),
      blockRef('bruichladdich-proximity', 'full', { customHeading: 'Why We Love Bruichladdich' }),
      blockRef('port-charlotte-village', 'full'),
      blockRef('bothan-jura-teaser', 'teaser'),
      blockRef('ferry-basics', 'teaser', { customHeading: 'How to Get Here' }),
      blockRef('ferry-support', 'teaser'),
    ],
  },

  // ─── GETTING HERE / TRAVEL TO ISLAY ──────────────────
  // Spec: CONTENT-ARCHITECTURE-MVP.md (Getting Here section)
  // ferry-basics FULL (canonical home) + ferry-support FULL (canonical home)
  gettingHerePage: {
    type: 'gettingHerePage',
    blocks: [
      blockRef('ferry-basics', 'full', { showKeyFacts: true }),
      blockRef('ferry-support', 'full', { showKeyFacts: true }),
    ],
  },

  // ─── EXPLORE ISLAY ───────────────────────────────────
  // Spec: CONTENT-ARCHITECTURE-MVP.md (Explore Islay section)
  // All FULL (canonical homes): distilleries, beaches, wildlife, food, families
  // jura-day-trip TEASER
  exploreIslayPage: {
    type: 'exploreIslayPage',
    blocks: [
      blockRef('distilleries-overview', 'full', { showKeyFacts: true }),
      blockRef('beaches-overview', 'full'),
      blockRef('portbahn-beach', 'full'),
      blockRef('wildlife-geese', 'full', { showKeyFacts: true }),
      blockRef('food-drink-islay', 'full'),
      blockRef('families-children', 'full'),
      blockRef('jura-day-trip', 'teaser'),
      blockRef('bruichladdich-proximity', 'teaser'),
      blockRef('shorefield-character', 'teaser'),
    ],
  },

  // ─── ABOUT PAGE ──────────────────────────────────────
  // Spec: CONTENT-ARCHITECTURE-MVP.md (About section)
  // about-us FULL (canonical home) + trust-signals TEASER + bothan-jura-teaser TEASER
  aboutPage: {
    type: 'aboutPage',
    blocks: [
      blockRef('about-us', 'full'),
      blockRef('trust-signals', 'teaser'),
      blockRef('bothan-jura-teaser', 'teaser'),
    ],
  },
};

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────

async function wirePageBlocks() {
  console.log('\n======================================================');
  console.log('  Wire Page Content Blocks');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  // Step 1: Verify canonical blocks exist
  console.log('Checking canonical blocks exist in Sanity...\n');
  const existingBlocks = await client.fetch(
    `*[_type == "canonicalBlock"]{ _id, blockId }`
  );
  const existingIds = new Set(existingBlocks.map((b: { _id: string }) => b._id));
  console.log(`  Found ${existingBlocks.length} canonical blocks in Sanity\n`);

  // Collect all referenced block IDs to validate
  const allRefs = new Set<string>();
  for (const [, config] of Object.entries(PAGE_BLOCKS)) {
    for (const block of config.blocks) {
      allRefs.add(block.block._ref);
    }
  }

  const missing = [...allRefs].filter((ref) => !existingIds.has(ref));
  if (missing.length > 0) {
    console.warn('  ⚠ Missing blocks (run import-canonical-blocks.ts first):');
    missing.forEach((ref) => console.warn(`    - ${ref}`));
    console.warn('');
  }

  // Step 2: Wire blocks to each page
  console.log('Wiring content blocks to pages...\n');

  let successCount = 0;
  let failCount = 0;

  for (const [pageKey, config] of Object.entries(PAGE_BLOCKS)) {
    try {
      // Find the singleton document
      const doc = await client.fetch(
        `*[_type == "${config.type}"][0]{ _id }`
      );

      if (!doc) {
        console.log(`  ⚠ ${pageKey}: No document found for type "${config.type}" — skipping`);
        console.log(`    (Create the document in Sanity Studio first, then re-run)\n`);
        failCount++;
        continue;
      }

      // Patch the document's contentBlocks
      await client
        .patch(doc._id)
        .set({ contentBlocks: config.blocks })
        .commit();

      const blockSummary = config.blocks
        .map((b) => {
          const id = b.block._ref.replace('canonical-block-', '');
          return `${id} (${b.version})`;
        })
        .join(', ');

      console.log(`  ✓ ${pageKey}: ${config.blocks.length} blocks wired`);
      console.log(`    → ${blockSummary}\n`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ ${pageKey}: Failed`, error);
      failCount++;
    }
  }

  console.log('======================================================');
  console.log(`  Complete: ${successCount} pages wired, ${failCount} failed`);
  console.log('======================================================\n');

  if (successCount > 0) {
    console.log('Next steps:');
    console.log('1. Open Sanity Studio → each page type');
    console.log('2. Verify the Content Blocks array shows the right blocks');
    console.log('3. Publish each page document');
    console.log('4. Check the frontend renders correctly with npm run dev\n');
  }

  // Step 3: Print the full page→block mapping for reference
  console.log('─── Page → Block Reference Map ───\n');
  for (const [pageKey, config] of Object.entries(PAGE_BLOCKS)) {
    console.log(`  ${pageKey} (${config.type}):`);
    config.blocks.forEach((b, i) => {
      const id = b.block._ref.replace('canonical-block-', '');
      const heading = b.customHeading ? ` → "${b.customHeading}"` : '';
      const facts = b.showKeyFacts ? ' [+facts]' : '';
      console.log(`    ${i + 1}. ${id} (${b.version})${heading}${facts}`);
    });
    console.log('');
  }
}

wirePageBlocks().catch((error) => {
  console.error('Wire failed:', error);
  process.exit(1);
});
