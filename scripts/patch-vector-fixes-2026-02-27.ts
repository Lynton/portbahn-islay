/**
 * patch-vector-fixes-2026-02-27.ts
 *
 * Executes two content fixes identified by SF v23.3 vector analysis.
 * Source: _work/cw/pbi/handoffs/CW-HANDOFF-VECTOR-FIXES-SANITY-2026-02-27.md
 *
 * Fix 1: distilleries-overview — replace teaserContent
 *   Removes named entity enumeration (7 distillery names) that was causing
 *   0.970 cosine similarity between /explore-islay hub and distilleries spoke.
 *   New teaser: count + proximity differentiator + hosting credential only.
 *   CTA link is auto-appended by CanonicalBlock component from canonicalHome.
 *
 * Fix 2: shorefield-character — prepend fixed spine to fullContent
 *   Block opened with eco/character vocabulary, no accommodation vocabulary.
 *   Prepends two-sentence fixed spine establishing: self-catering, Bruichladdich,
 *   Islay, sleeps 6, 3 bedrooms, lochside, Loch Indaal, Paps of Jura, proximity.
 */

import { createClient } from 'next-sanity';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const DRY_RUN = process.argv.includes('--dry-run');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ─── PortableText helpers ──────────────────────────────────────────────────────

function key(): string {
  return randomBytes(5).toString('hex');
}

function para(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [] as any[],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  };
}

// ─── Fix 1: distilleries-overview teaserContent ───────────────────────────────

const DISTILLERIES_TEASER_TEXT =
  'Islay has ten working whisky distilleries — more concentrated than almost anywhere on earth. ' +
  "You're a 5-minute walk from Bruichladdich, so start there and walk home without worrying about driving. " +
  "For the rest of the island's distilleries, we've hosted whisky groups dozens of times and know exactly " +
  'how to plan a distillery trip from Portbahn.';

async function patchDistilleriesTeaser() {
  const block = await client.fetch(
    `*[_type == "canonicalBlock" && blockId.current == "distilleries-overview" && !(_id in path("drafts.**"))][0]{_id, title}`
  );

  if (!block) {
    console.log('✗ distilleries-overview — not found');
    return;
  }

  const newTeaser = [para(DISTILLERIES_TEASER_TEXT)];

  console.log(`\nFix 1: distilleries-overview (${block._id})`);
  console.log(`  New teaserContent: "${DISTILLERIES_TEASER_TEXT.slice(0, 80)}..."`);

  if (DRY_RUN) {
    console.log('  [DRY RUN] Would replace teaserContent');
    return;
  }

  await client.patch(block._id).set({ teaserContent: newTeaser }).commit();
  console.log('  ✓ teaserContent updated');
}

// ─── Fix 2: shorefield-character fullContent prepend ─────────────────────────

const SHOREFIELD_FIXED_SPINE =
  'Shorefield Eco House is a self-catering holiday cottage in Bruichladdich, Islay — ' +
  'sleeping six guests across three bedrooms, on the lochside with views across Loch Indaal ' +
  "to the Paps of Jura. It's a 5-minute drive from Port Charlotte and a 5-minute walk from " +
  'Bruichladdich distillery.';

async function patchShorefieldCharacter() {
  const block = await client.fetch(
    `*[_type == "canonicalBlock" && blockId.current == "shorefield-character" && !(_id in path("drafts.**"))][0]{_id, title, fullContent}`
  );

  if (!block) {
    console.log('✗ shorefield-character — not found');
    return;
  }

  const existingContent: any[] = block.fullContent || [];

  // Guard: check if fixed spine is already present
  const firstBlockText = existingContent[0]?.children?.[0]?.text || '';
  if (firstBlockText.startsWith('Shorefield Eco House is a self-catering')) {
    console.log('\nFix 2: shorefield-character — fixed spine already present, skipping');
    return;
  }

  const newFullContent = [para(SHOREFIELD_FIXED_SPINE), ...existingContent];

  console.log(`\nFix 2: shorefield-character (${block._id})`);
  console.log(`  Prepending: "${SHOREFIELD_FIXED_SPINE.slice(0, 80)}..."`);
  console.log(`  Existing blocks: ${existingContent.length} → New total: ${newFullContent.length}`);

  if (DRY_RUN) {
    console.log('  [DRY RUN] Would prepend to fullContent');
    return;
  }

  await client.patch(block._id).set({ fullContent: newFullContent }).commit();
  console.log('  ✓ fullContent updated — fixed spine prepended');
}

// ─── Run ───────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== patch-vector-fixes-2026-02-27.ts ===');
  if (DRY_RUN) console.log('DRY RUN — no changes will be committed\n');

  await patchDistilleriesTeaser();
  await patchShorefieldCharacter();

  console.log('\n=== Done ===');
}

run().catch(console.error);
