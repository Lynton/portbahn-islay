/**
 * fix-block-structure.ts
 *
 * Fixes identified in block structure audit (2026-03-03):
 *
 * 1. ferry-basics teaserContent: "40 minutes" → "25 minutes"
 * 2. ferry-support canonicalHome: /travel-to-islay → /islay-travel + fix embedded link in teaserContent
 * 3. accommodationPage contentBlocks: re-wire Block 25 (dog-friendly-properties) — E1 wire did not persist
 * 4. Delete duplicate dog-friendly-properties block (kWrWAeEgZxSEuRVoOpwcTn)
 * 5. bothan-jura-teaser: add teaserContent (was null, referenced as 'teaser' on exploreIslayPage → rendered empty)
 * 6. exploreIslayPage: switch distilleries-overview + islay-geology from 'full' → 'teaser'
 * 7. guide-islay-geology guidePage: wire canonical-block-islay-geology with version:'full'
 * 8. dog-friendly-islay guidePage: wire canonical-block-dog-friendly-properties with version:'full'
 *
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/fix-block-structure.ts
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

// ─── 1. Fix ferry-basics teaserContent: 40 → 25 minutes ──────────────────────

async function fixFerryBasicsTeaser() {
  console.log('\n══ 1 — Fix ferry-basics teaserContent (40 → 25 min) ════════');
  try {
    const block = await client.fetch<{ _id: string; teaserContent: any[] }>(
      `*[blockId.current == "ferry-basics"][0]{ _id, teaserContent }`
    );
    if (!block) { warn('1', 'ferry-basics not found'); return; }

    // Update the text in-place: replace "40 minutes" → "25 minutes"
    const updated = (block.teaserContent || []).map((b: any) => ({
      ...b,
      children: (b.children || []).map((c: any) => ({
        ...c,
        text: typeof c.text === 'string'
          ? c.text.replace('about 40 minutes', 'about 25 minutes').replace('40 minutes', '25 minutes')
          : c.text,
      })),
    }));

    await client.patch(block._id).set({ teaserContent: updated }).commit();
    ok('1', 'ferry-basics teaserContent: "40 minutes" → "25 minutes"');
  } catch (err) {
    fail('1', err);
  }
}

// ─── 2. Fix ferry-support canonicalHome + embedded teaserContent link ─────────

async function fixFerrySupport() {
  console.log('\n══ 2 — Fix ferry-support canonicalHome + teaserContent link ═');
  try {
    const block = await client.fetch<{ _id: string; canonicalHome: string; teaserContent: any[] }>(
      `*[blockId.current == "ferry-support"][0]{ _id, canonicalHome, teaserContent }`
    );
    if (!block) { warn('2', 'ferry-support not found'); return; }

    // Fix canonicalHome
    const patch = client.patch(block._id).set({ canonicalHome: '/islay-travel' });

    // Fix the embedded href in teaserContent markDefs
    const updatedTeaser = (block.teaserContent || []).map((b: any) => ({
      ...b,
      markDefs: (b.markDefs || []).map((md: any) => ({
        ...md,
        href: typeof md.href === 'string'
          ? md.href.replace('/travel-to-islay', '/islay-travel')
          : md.href,
      })),
    }));

    await patch.set({ teaserContent: updatedTeaser }).commit();
    ok('2', 'ferry-support canonicalHome → /islay-travel; teaserContent link fixed');
  } catch (err) {
    fail('2', err);
  }
}

// ─── 3. Re-wire Block 25 to accommodationPage ─────────────────────────────────

async function rewireAccommodationPage() {
  console.log('\n══ 3 — Re-wire Block 25 to accommodationPage ════════════════');
  try {
    const accPage = await client.fetch<{ _id: string; contentBlocks: any[] | null }>(
      `*[_id == "accommodationPage"][0]{ _id, contentBlocks }`
    );
    if (!accPage) { warn('3', 'accommodationPage not found'); return; }

    const existing = (accPage.contentBlocks || []).find(
      (b: any) => b?.block?._ref === 'canonical-block-dog-friendly-properties'
    );
    if (existing) {
      warn('3', 'Block 25 already in accommodationPage.contentBlocks — skipped');
      return;
    }

    const newBlock = {
      _key: k(),
      _type: 'blockReference',
      block: { _ref: 'canonical-block-dog-friendly-properties', _type: 'reference' },
      version: 'full',
      showKeyFacts: false,
    };

    await client.patch('accommodationPage').set({
      contentBlocks: [...(accPage.contentBlocks || []), newBlock],
    }).commit();
    ok('3', 'Block 25 (dog-friendly-properties) wired to accommodationPage.contentBlocks[]');
  } catch (err) {
    fail('3', err);
  }
}

// ─── 4. Delete duplicate dog-friendly-properties block ────────────────────────

async function deleteDuplicateDogBlock() {
  console.log('\n══ 4 — Delete duplicate dog-friendly-properties block ════════');
  try {
    const DUPE_ID = 'kWrWAeEgZxSEuRVoOpwcTn';
    const exists = await client.fetch(`*[_id == $id][0]{ _id }`, { id: DUPE_ID });
    if (!exists) {
      warn('4', `Duplicate block ${DUPE_ID} not found — already deleted?`);
      return;
    }
    await client.delete(DUPE_ID);
    ok('4', `Deleted duplicate block _id: ${DUPE_ID}`);
  } catch (err) {
    fail('4', err);
  }
}

// ─── 5. Add teaserContent to bothan-jura-teaser ───────────────────────────────

async function fixBothanJuraTeaser() {
  console.log('\n══ 5 — Add teaserContent to bothan-jura-teaser ══════════════');
  try {
    const block = await client.fetch<{ _id: string; teaserContent: any[] | null }>(
      `*[blockId.current == "bothan-jura-teaser"][0]{ _id, teaserContent }`
    );
    if (!block) { warn('5', 'bothan-jura-teaser not found'); return; }
    if (block.teaserContent && block.teaserContent.length > 0) {
      warn('5', 'bothan-jura-teaser already has teaserContent — skipped');
      return;
    }

    const teaserContent = [
      para("We also own and run Bothan Jura Retreat on Jura — four cabins we built from scratch on the island next door. If you're thinking of combining Islay with Jura, or want somewhere even more remote, it's worth a look."),
    ];

    await client.patch(block._id).set({ teaserContent }).commit();
    ok('5', 'bothan-jura-teaser teaserContent added');
  } catch (err) {
    fail('5', err);
  }
}

// ─── 6. Switch distilleries-overview + islay-geology to 'teaser' on exploreIslayPage ──

async function switchExploreIslayBlockVersions() {
  console.log('\n══ 6 — Switch hub blocks to teaser on exploreIslayPage ══════');
  try {
    const page = await client.fetch<{ contentBlocks: any[] | null }>(
      `*[_id == "exploreIslayPage"][0]{ contentBlocks }`
    );
    if (!page) { warn('6', 'exploreIslayPage not found'); return; }

    const SWITCH_TO_TEASER = [
      'canonical-block-distilleries-overview',
      'canonical-block-islay-geology',
    ];

    let changed = 0;
    const updated = (page.contentBlocks || []).map((b: any) => {
      if (SWITCH_TO_TEASER.includes(b?.block?._ref) && b.version !== 'teaser') {
        changed++;
        return { ...b, version: 'teaser' };
      }
      return b;
    });

    if (changed === 0) {
      warn('6', 'No blocks needed switching — already teaser or not found');
      return;
    }

    await client.patch('exploreIslayPage').set({ contentBlocks: updated }).commit();
    ok('6', `Switched ${changed} block(s) to 'teaser' on exploreIslayPage (distilleries-overview, islay-geology)`);
  } catch (err) {
    fail('6', err);
  }
}

// ─── 7. Wire islay-geology canonical block to guide-islay-geology guidePage ───

async function wireGeologyToGuidePage() {
  console.log('\n══ 7 — Wire islay-geology block to guide-islay-geology page ═');
  try {
    const page = await client.fetch<{ _id: string; contentBlocks: any[] | null }>(
      `*[_id == "guide-islay-geology"][0]{ _id, contentBlocks }`
    );
    if (!page) { warn('7', 'guide-islay-geology not found'); return; }

    const existing = (page.contentBlocks || []).find(
      (b: any) => b?.block?._ref === 'canonical-block-islay-geology'
    );
    if (existing) {
      warn('7', 'canonical-block-islay-geology already in guide-islay-geology — skipped');
      return;
    }

    const newBlock = {
      _key: k(),
      _type: 'blockReference',
      block: { _ref: 'canonical-block-islay-geology', _type: 'reference' },
      version: 'full',
      showKeyFacts: false,
    };

    await client.patch('guide-islay-geology').set({
      contentBlocks: [...(page.contentBlocks || []), newBlock],
    }).commit();
    ok('7', 'canonical-block-islay-geology wired to guide-islay-geology with version:full');
  } catch (err) {
    fail('7', err);
  }
}

// ─── 8. Wire dog-friendly-properties block to dog-friendly-islay guidePage ───

async function wireDogBlockToSpoke() {
  console.log('\n══ 8 — Wire dog-friendly-properties to dog-friendly-islay ══');
  try {
    const page = await client.fetch<{ _id: string; contentBlocks: any[] | null }>(
      `*[_type == "guidePage" && slug.current == "dog-friendly-islay"][0]{ _id, contentBlocks }`
    );
    if (!page) { warn('8', 'dog-friendly-islay guidePage not found'); return; }

    const existing = (page.contentBlocks || []).find(
      (b: any) => b?.block?._ref === 'canonical-block-dog-friendly-properties'
    );
    if (existing) {
      warn('8', 'dog-friendly-properties already in dog-friendly-islay — skipped');
      return;
    }

    const newBlock = {
      _key: k(),
      _type: 'blockReference',
      block: { _ref: 'canonical-block-dog-friendly-properties', _type: 'reference' },
      version: 'full',
      showKeyFacts: false,
    };

    await client.patch(page._id).set({
      contentBlocks: [...(page.contentBlocks || []), newBlock],
    }).commit();
    ok('8', 'canonical-block-dog-friendly-properties wired to dog-friendly-islay with version:full');
  } catch (err) {
    fail('8', err);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('fix-block-structure.ts — running\n');
  await fixFerryBasicsTeaser();
  await fixFerrySupport();
  await rewireAccommodationPage();
  await deleteDuplicateDogBlock();
  await fixBothanJuraTeaser();
  await switchExploreIslayBlockVersions();
  await wireGeologyToGuidePage();
  await wireDogBlockToSpoke();
  console.log('\nDone.');
}

main().catch(console.error);
