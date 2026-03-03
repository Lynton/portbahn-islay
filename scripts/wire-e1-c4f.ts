/**
 * wire-e1-c4f.ts
 *
 * E1: Wire Block 25 (dog-friendly-properties) to accommodationPage contentBlocks[]
 * C4f: Create islay-geology canonical block + guidePage shell + wire to exploreIslayPage
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/wire-e1-c4f.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import { randomBytes } from 'crypto';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const k = () => randomBytes(5).toString('hex');

function para(text: string): any {
  return {
    _key: k(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  };
}

function ok(id: string, msg: string) { console.log(`  ✓ ${id}: ${msg}`); }
function warn(id: string, msg: string) { console.log(`  ⚠ ${id}: ${msg}`); }
function fail(id: string, err: unknown) { console.error(`  ✗ ${id}:`, err instanceof Error ? err.message : err); }

// ─── E1: Wire Block 25 to accommodation hub ──────────────────────────────────

async function wireE1() {
  console.log('\n══ E1 — Wire Block 25 to accommodation hub ══════════════════');

  try {
    const accPage = await client.fetch<{ _id: string; contentBlocks: any[] | null }>(
      `*[_id == "accommodationPage"][0]{ _id, contentBlocks }`
    );

    if (!accPage) {
      warn('E1', 'accommodationPage not found');
      return;
    }

    // Check if Block 25 already wired
    const existing = (accPage.contentBlocks || []).find(
      (b: any) => b?.block?._ref === 'canonical-block-dog-friendly-properties'
    );
    if (existing) {
      warn('E1', 'Block 25 already in accommodationPage.contentBlocks — skipped');
      return;
    }

    const newBlock = {
      _key: k(),
      _type: 'blockReference',
      block: { _ref: 'canonical-block-dog-friendly-properties', _type: 'reference' },
      version: 'full',
      showKeyFacts: false,
    };

    await client.patch('accommodationPage').append('contentBlocks', [newBlock]).commit();
    ok('E1', 'Block 25 (dog-friendly-properties) appended to accommodationPage.contentBlocks[]');
  } catch (err) {
    fail('E1', err);
  }
}

// ─── C4f: Create islay-geology canonical block ───────────────────────────────

async function createGeologyBlock() {
  console.log('\n══ C4f-1 — Create islay-geology canonical block ═════════════');

  try {
    // Check if already exists
    const existing = await client.fetch(
      `*[(blockId.current == "islay-geology")][0]{ _id }`
    );
    if (existing?._id) {
      warn('C4f-1', `islay-geology block already exists (_id: ${existing._id}) — skipping create`);
      return existing._id;
    }

    const C4F_FULL = [
      para('The rocks beneath your feet on Islay go back 1.8 billion years. The Rhinns Complex is some of the oldest exposed rock in the British Isles and one of the best places to see it. The stromatolite fossils at Bunnahabhain are among the best evidence of Precambrian life in Britain, and the Port Askaig Tillite is a world-famous glacial deposit that draws university geology field trips year after year. The islaygeology.org group runs guided tours if you want to explore with an expert.'),
    ];

    const C4F_TEASER = [
      para("Islay's rocks go back nearly 2 billion years — older than complex life on Earth. The Rhinns Complex, the Port Askaig Tillite, and the stromatolite fossils at Bunnahabhain make this one of the most geologically significant islands in Britain."),
    ];

    const doc = {
      _id: 'canonical-block-islay-geology',
      _type: 'canonicalBlock',
      blockId: { _type: 'slug', current: 'islay-geology' },
      title: 'The Geology of Islay',
      entityType: 'nature',
      canonicalHome: '/explore-islay/islay-geology',
      fullContent: C4F_FULL,
      teaserContent: C4F_TEASER,
    };

    await client.createIfNotExists(doc);
    ok('C4f-1', 'islay-geology canonical block created (_id: canonical-block-islay-geology)');
    return 'canonical-block-islay-geology';
  } catch (err) {
    fail('C4f-1', err);
    return null;
  }
}

// ─── C4f: Wire geology block to exploreIslayPage ─────────────────────────────

async function wireGeologyToExploreIslay() {
  console.log('\n══ C4f-2 — Wire islay-geology to exploreIslayPage ══════════');

  try {
    const page = await client.fetch<{ contentBlocks: any[] | null }>(
      `*[_id == "exploreIslayPage"][0]{ contentBlocks }`
    );

    const existing = (page?.contentBlocks || []).find(
      (b: any) => b?.block?._ref === 'canonical-block-islay-geology'
    );
    if (existing) {
      warn('C4f-2', 'islay-geology already in exploreIslayPage.contentBlocks — skipped');
      return;
    }

    const newBlock = {
      _key: k(),
      _type: 'blockReference',
      block: { _ref: 'canonical-block-islay-geology', _type: 'reference' },
      version: 'full',
      showKeyFacts: false,
    };

    // Insert before jura-day-trip (the teaser blocks at the end) — position 5
    // Current order: distilleries(0), portbahn-beach(1), wildlife-geese(2), food-drink(3), families(4), jura-day-trip(5), bothan-jura-teaser(6)
    // Geology goes at position 5, before Jura teasers
    const currentBlocks = page?.contentBlocks || [];
    const juraIdx = currentBlocks.findIndex((b: any) => b?.block?._ref === 'canonical-block-jura-day-trip');

    let updatedBlocks: any[];
    if (juraIdx >= 0) {
      updatedBlocks = [
        ...currentBlocks.slice(0, juraIdx),
        newBlock,
        ...currentBlocks.slice(juraIdx),
      ];
    } else {
      updatedBlocks = [...currentBlocks, newBlock];
    }

    await client.patch('exploreIslayPage').set({ contentBlocks: updatedBlocks }).commit();
    ok('C4f-2', `islay-geology block inserted at position ${juraIdx >= 0 ? juraIdx : 'end'} in exploreIslayPage.contentBlocks[]`);
  } catch (err) {
    fail('C4f-2', err);
  }
}

// ─── C4f: Create islay-geology guidePage shell ───────────────────────────────

async function createGeologyGuidePage() {
  console.log('\n══ C4f-3 — Create islay-geology guidePage shell ════════════');

  try {
    const existing = await client.fetch(
      `*[_type == "guidePage" && slug.current == "islay-geology"][0]{ _id }`
    );
    if (existing?._id) {
      warn('C4f-3', `islay-geology guidePage already exists (_id: ${existing._id}) — skipped`);
      return;
    }

    const doc = {
      _id: 'guide-islay-geology',
      _type: 'guidePage',
      title: 'The Geology of Islay',
      slug: { _type: 'slug', current: 'islay-geology' },
      introduction: 'PLACEHOLDER — CW content to follow. See GUIDE-GEOLOGY.md.',
      seoTitle: 'Islay Geology | Ancient Rocks, Glacial Deposits & 1.8 Billion Years of History',
      seoDescription: 'Islay\'s rocks go back nearly 2 billion years. The Rhinns Complex, Port Askaig Tillite and stromatolites at Bunnahabhain make this one of Britain\'s most geologically significant islands.',
      contentBlocks: [],
      featuredEntities: [],
      faqBlocks: [],
    };

    await client.createIfNotExists(doc);
    ok('C4f-3', 'islay-geology guidePage shell created at /explore-islay/islay-geology');
  } catch (err) {
    fail('C4f-3', err);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('wire-e1-c4f.ts — running\n');
  await wireE1();
  await createGeologyBlock();
  await wireGeologyToExploreIslay();
  await createGeologyGuidePage();
  console.log('\nDone.');
}

main().catch(console.error);
