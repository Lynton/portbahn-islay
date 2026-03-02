/**
 * patch-audit4-studio-fixes.ts
 *
 * Applies all remaining Audit 4 Sanity fixes that were previously marked as "Studio actions"
 * but can be applied programmatically. Covers:
 *
 *   Fix 1a — gettingHerePage scopeIntro: remove crossing times, broaden scope signal
 *            + hub contentBlocks: switch ferry-basics from full → teaser
 *            + canonical-block-ferry-basics teaserContent: remove 2h/2h20m/12-week
 *
 *   Fix 1b — guide-ferry-to-islay.introduction: remove crossing times from spoke card
 *
 *   Fix 2  — exploreIslayPage.scopeIntro: apply personalised replacement (Portbahn version)
 *
 *   Fix 4  — Portbahn House + Shorefield Eco House description: append dog-friendly paragraph
 *            (Property pages have no contentBlocks field — appending to description is correct)
 *
 * Source: _work/cw/pbi/handoffs/CW-HANDOFF-AUDIT4-STUDIO-EDITS-2026-02-28.md
 * Run: npx tsx --tsconfig scripts/tsconfig.json scripts/patch-audit4-studio-fixes.ts
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

const k = () => randomBytes(5).toString('hex');

function para(text: string) {
  return {
    _type: 'block', _key: k(), style: 'normal', markDefs: [] as any[],
    children: [{ _type: 'span', _key: k(), text, marks: [] }],
  };
}

// ─── Fix 1a content ───────────────────────────────────────────────────────────
// New gettingHerePage.scopeIntro — no crossing times, broadens hub scope signal
// Source: handoff Fix 1a replacement text

const HUB_SCOPE_INTRO =
  'Travel to Islay is not straightforward - and that\'s part of the appeal. You don\'t come to the Scottish islands if you want easy: you come for the adventure, and for an experience you can\'t get on the mainland.\n\nMost guests arrive by ferry from Kennacraig on the Kintyre peninsula - around 2 hours on the water. Some fly with Loganair from Glasgow in around 40 minutes. Either way, the journey itself is part of arriving. We now live on Jura but spent years on Islay before that, and we\'ve helped over 600 guests plan every aspect of the trip - ferry and flight options, travelling without a car, what the drive from the ports involves, and what to do when CalMac cancels. The sections below cover everything.';

// New ferry-basics teaserContent — no 2h / 2h20m / 12 weeks
// Replaces existing teaser used on homepage and property pages
const FERRY_BASICS_TEASER = [
  para(
    'Travel to Islay is not straightforward — and that\'s the point. Most guests arrive by CalMac ferry from Kennacraig on the Kintyre peninsula. Some fly with Loganair from Glasgow in about 40 minutes. Either way, the journey is part of arriving. We\'ve helped 600+ guests navigate the crossing — including car-free options, travelling with dogs, and what to do when CalMac disrupts your plans.'
  ),
];

// ─── Fix 1b content ───────────────────────────────────────────────────────────
// New guide-ferry-to-islay.introduction — no crossing times on the hub card
// Source: handoff Fix 1b replacement text

const FERRY_SPOKE_INTRODUCTION =
  'CalMac operates two routes from Kennacraig — to Port Askaig in the north and Port Ellen in the south. Book ahead for summer sailings and Fèis Ìle.';

// ─── Fix 2 content ────────────────────────────────────────────────────────────
// New exploreIslayPage.scopeIntro — personalised Portbahn version, no named distilleries
// Source: handoff Fix 2 replacement text

const EXPLORE_SCOPE_INTRO =
  'Having lived and worked on Islay for a number of years, we know the island well - the whisky, the beaches, the wildlife, the food, and what it takes to plan a good trip. The Isle of Islay is one of Scotland\'s Inner Hebrides: it has more working whisky distilleries than almost anywhere on earth, a coastline that stretches for over 50 kilometres, and more than 30,000 barnacle geese arriving from Greenland each winter. Our properties sit in Bruichladdich village on the Rhinns, with everything the island offers within easy reach. These guides cover all of it: distilleries, beaches, wildlife, walking, food and drink, villages, families, and day trips to Jura.';

// ─── Fix 4 content ────────────────────────────────────────────────────────────
// Dog-friendly paragraph to append to Portbahn House + Shorefield description
// Source: Block 25 teaser version from CANONICAL-BLOCKS-MERGED-v4.md
// Note: Curlew Cottage does NOT accept dogs — do NOT append to Curlew

const DOG_FRIENDLY_PROPERTY_PARA = para(
  'Portbahn House and Shorefield Eco House welcome dogs at £15 per stay — no size or number limit. (Curlew Cottage does not accept dogs.) Portbahn Beach is 5 minutes\' walk from both properties. Islay is one of the best dog destinations in Scotland: empty beaches, quiet roads, and open countryside. RSPB Loch Gruinart Nature Reserve welcomes dogs on leads — arrive in winter and 30,000 barnacle geese from Greenland are the view.'
);

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n======================================================');
  console.log('  patch-audit4-studio-fixes.ts');
  console.log('  Fix 1a: hub scopeIntro + ferry-basics full→teaser + teaser update');
  console.log('  Fix 1b: ferry-to-islay spoke card introduction');
  console.log('  Fix 2:  explore-islay scopeIntro');
  console.log('  Fix 4:  property description dog-friendly paragraph');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  // ── Fix 1a-i: gettingHerePage.scopeIntro ─────────────────────────────────────

  console.log('Fix 1a-i: Patching gettingHerePage.scopeIntro...');
  try {
    await client.patch('gettingHerePage').set({ scopeIntro: HUB_SCOPE_INTRO }).commit();
    console.log('  ✓ gettingHerePage.scopeIntro updated');
  } catch (err: any) {
    console.error(`  ✗ scopeIntro patch failed: ${err.message}`);
  }

  // ── Fix 1a-ii: hub contentBlocks ferry-basics: full → teaser ─────────────────
  // Key for the ferry-basics blockReference in gettingHerePage.contentBlocks: x8nt56fy

  console.log('\nFix 1a-ii: Switching hub ferry-basics contentBlock from full → teaser...');
  try {
    await client
      .patch('gettingHerePage')
      .set({ 'contentBlocks[_key == "x8nt56fy"].version': 'teaser' })
      .commit();
    console.log('  ✓ hub contentBlocks[ferry-basics].version → "teaser"');
  } catch (err: any) {
    console.error(`  ✗ hub contentBlocks version patch failed: ${err.message}`);
  }

  // ── Fix 1a-iii: ferry-basics teaserContent — remove crossing times ────────────

  console.log('\nFix 1a-iii: Updating canonical-block-ferry-basics teaserContent...');
  try {
    await client
      .patch('canonical-block-ferry-basics')
      .set({ teaserContent: FERRY_BASICS_TEASER })
      .commit();
    console.log('  ✓ canonical-block-ferry-basics teaserContent updated (crossing times removed)');
  } catch (err: any) {
    console.error(`  ✗ ferry-basics teaserContent patch failed: ${err.message}`);
  }

  // ── Fix 1b: guide-ferry-to-islay.introduction ────────────────────────────────

  console.log('\nFix 1b: Patching guide-ferry-to-islay.introduction...');
  try {
    await client
      .patch('guide-ferry-to-islay')
      .set({ introduction: FERRY_SPOKE_INTRODUCTION })
      .commit();
    console.log('  ✓ guide-ferry-to-islay.introduction updated (crossing times removed)');
    console.log(`  ✓ New text: "${FERRY_SPOKE_INTRODUCTION}"`);
  } catch (err: any) {
    console.error(`  ✗ ferry-to-islay introduction patch failed: ${err.message}`);
  }

  // ── Fix 2: exploreIslayPage.scopeIntro ───────────────────────────────────────

  console.log('\nFix 2: Patching exploreIslayPage.scopeIntro...');
  try {
    await client.patch('exploreIslayPage').set({ scopeIntro: EXPLORE_SCOPE_INTRO }).commit();
    console.log('  ✓ exploreIslayPage.scopeIntro updated (personalised Portbahn version, no named distilleries)');
  } catch (err: any) {
    console.error(`  ✗ exploreIslayPage scopeIntro patch failed: ${err.message}`);
  }

  // ── Fix 4a: Portbahn House description — append dog-friendly paragraph ────────

  console.log('\nFix 4a: Appending dog-friendly paragraph to Portbahn House description...');
  const PORTBAHN_ID = '7adb6498-a6dd-4ca9-a5a2-e38ee56cab84';
  try {
    // Check last paragraph first — don't double-add
    const portbahn = await client.fetch<{ description: any[] }>(
      `*[_id == $id][0]{description}`,
      { id: PORTBAHN_ID }
    );
    const lastPara: string = portbahn?.description?.at(-1)?.children?.[0]?.text || '';
    if (lastPara.includes('Portbahn House and Shorefield Eco House welcome dogs')) {
      console.log('  ⚠️  Dog-friendly paragraph already present in Portbahn House. Skipping.');
    } else {
      await client
        .patch(PORTBAHN_ID)
        .append('description', [DOG_FRIENDLY_PROPERTY_PARA])
        .commit();
      console.log('  ✓ Dog-friendly paragraph appended to Portbahn House description');
    }
  } catch (err: any) {
    console.error(`  ✗ Portbahn House patch failed: ${err.message}`);
  }

  // ── Fix 4b: Shorefield Eco House description — append dog-friendly paragraph ──

  console.log('\nFix 4b: Appending dog-friendly paragraph to Shorefield Eco House description...');
  const SHOREFIELD_ID = 'b3bb432f-1bde-479f-953e-2507c459f4f3';
  try {
    const shorefield = await client.fetch<{ description: any[] }>(
      `*[_id == $id][0]{description}`,
      { id: SHOREFIELD_ID }
    );
    const lastPara: string = shorefield?.description?.at(-1)?.children?.[0]?.text || '';
    if (lastPara.includes('Portbahn House and Shorefield Eco House welcome dogs')) {
      console.log('  ⚠️  Dog-friendly paragraph already present in Shorefield. Skipping.');
    } else {
      await client
        .patch(SHOREFIELD_ID)
        .append('description', [DOG_FRIENDLY_PROPERTY_PARA])
        .commit();
      console.log('  ✓ Dog-friendly paragraph appended to Shorefield Eco House description');
    }
  } catch (err: any) {
    console.error(`  ✗ Shorefield Eco House patch failed: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log('  Done. Verify then revalidate:');
  console.log('  /api/revalidate?secret=...&path=all');
  console.log('======================================================');
}

run().catch(console.error);
