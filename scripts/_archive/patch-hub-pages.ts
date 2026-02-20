/**
 * Patch Hub Page Singletons
 *
 * Populates gettingHerePage and exploreIslayPage from HUB-PAGE-CONTENT-DRAFT.md spec:
 * - scopeIntro
 * - entityFraming (whatItIs, whatItIsNot, primaryDifferentiator)
 * - trustSignals (ownership, established, guestExperience)
 * - seoTitle, seoDescription (corrections only where wrong)
 * - contentBlocks (rebuilt to exact spec order and versions)
 *
 * Usage: npx tsx scripts/patch-hub-pages.ts
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

function ref(id: string) {
  return { _type: 'reference', _ref: id };
}

function blockRef(blockDocId: string, version: 'full' | 'teaser', showKeyFacts = false) {
  return {
    _type: 'blockReference',
    _key: Math.random().toString(36).slice(2, 10),
    block: ref(blockDocId),
    version,
    showKeyFacts,
  };
}

// ─── gettingHerePage ──────────────────────────────────────────────────────────

const gettingHerePatch = {
  // SEO — title already correct, description already correct
  // H1 title already correct

  scopeIntro: 'Travel to Islay takes a little planning — and that\'s part of the magic. You reach the island by CalMac ferry from Kennacraig on the Kintyre Peninsula (2 hours to Port Askaig, 2 hours 20 minutes to Port Ellen) or by Loganair flight from Glasgow (25 minutes). We\'ve been helping guests make this journey successfully since 2017, and we know every wrinkle of the crossing: when to book, which port to choose, how to handle bad-weather cancellations, and why the ferry journey itself is worth embracing as part of the holiday. This guide covers everything you need — from booking your vehicle space 12 weeks ahead to what to do if CalMac throws a curveball.',

  entityFraming: {
    whatItIs: 'A travel guide to reaching the Isle of Islay, Scotland, covering CalMac ferry routes from Kennacraig and Loganair flights from Glasgow.',
    whatItIsNot: [
      'Not real-time ferry schedules or live booking',
      'Not a general Scotland travel guide',
      'Not a CalMac official resource',
    ],
    primaryDifferentiator: 'Written by local hosts who have helped 600+ guests navigate the Islay crossing since 2017, including dozens of disruptions.',
  },

  trustSignals: {
    ownership: 'Family-owned',
    established: 'Hosting guests on Islay since 2017',
    guestExperience: '600+ guests welcomed',
    localCredentials: ['5.0/5 communication rating on Airbnb', '30+ reviews mentioning ferry crisis support'],
  },

  // contentBlocks: ferry-basics (full), ferry-support (full), jura-day-trip (teaser)
  contentBlocks: [
    blockRef('canonical-block-ferry-basics',   'full'),
    blockRef('canonical-block-ferry-support',  'full'),
    blockRef('canonical-block-jura-day-trip',  'teaser'),
  ],
};

// ─── exploreIslayPage ─────────────────────────────────────────────────────────

const exploreIslayPatch = {
  // Fix seoTitle (spec says "Portbahn Guide", current has "Portbahn Islay")
  seoTitle: 'Explore Islay | Distilleries, Beaches & Wildlife | Portbahn Guide',

  // Fix seoDescription: "nine" → "ten"
  seoDescription: 'Discover Islay\'s ten whisky distilleries, stunning beaches, abundant wildlife, and local restaurants. Your personal guide from Pi, who\'s welcomed 600+ guests since 2017.',

  scopeIntro: 'Having lived and worked on Islay for a number of years, we know the island well and want to share what we love most about it. The Isle of Islay is one of Scotland\'s Inner Hebrides islands, renowned worldwide for its ten working single malt whisky distilleries — from the world\'s peatiest whisky at Bruichladdich\'s Octomore, to the approachable Bunnahabhain and the trio of south coast "killers" at Ardbeg, Lagavulin and Laphroaig. But whisky is only part of the story. Our properties sit in Bruichladdich village on the Rhinns, just a 5-minute walk from the distillery along the coastal cycle path. From here, everything Islay offers is within easy reach: hidden beaches, over 30,000 wintering barnacle geese, golden eagles, wild swimming, and some quietly excellent restaurants. This is our personal guide to all of it.',

  entityFraming: {
    whatItIs: 'A guide to activities, attractions and experiences on the Isle of Islay, Scotland, covering whisky distilleries, beaches, wildlife and food.',
    whatItIsNot: [
      'Not a booking platform for distillery tours',
      'Not a real-time events guide',
      'Not a comprehensive transport guide',
    ],
    primaryDifferentiator: 'Personal recommendations from Pi and Lynton, who have lived on Islay and hosted 600+ guests since 2017.',
  },

  trustSignals: {
    ownership: 'Family-owned',
    established: 'Living and hosting on Islay since 2017',
    guestExperience: '600+ guests welcomed',
    localCredentials: ['Average rating 4.97/5', '5.0/5 communication rating on Airbnb'],
  },

  // contentBlocks per spec: distilleries-overview (full), portbahn-beach (full),
  // wildlife-geese (full), food-drink-islay (full), families-children (full),
  // jura-day-trip (teaser), bothan-jura-teaser (teaser)
  contentBlocks: [
    blockRef('canonical-block-distilleries-overview', 'full'),
    blockRef('canonical-block-portbahn-beach',        'full'),
    blockRef('canonical-block-wildlife-geese',        'full'),
    blockRef('canonical-block-food-drink-islay',      'full'),
    blockRef('canonical-block-families-children',     'full'),
    blockRef('canonical-block-jura-day-trip',         'teaser'),
    blockRef('canonical-block-bothan-jura-teaser',    'teaser'),
  ],
};

async function run() {
  console.log('\n=== Patching gettingHerePage ===\n');
  await client.patch('gettingHerePage').set(gettingHerePatch).commit();
  console.log('✓ gettingHerePage patched');

  console.log('\n=== Patching exploreIslayPage ===\n');
  await client.patch('exploreIslayPage').set(exploreIslayPatch).commit();
  console.log('✓ exploreIslayPage patched');

  console.log('\n=== Verifying ===\n');
  const docs = await client.fetch(
    '*[_id in ["gettingHerePage","exploreIslayPage"]]{ _id, seoTitle, seoDescription, scopeIntro, contentBlocks[]{ version, block->{ blockId } } }'
  );

  for (const doc of docs) {
    console.log(`\n${doc._id}`);
    console.log(`  seoTitle:      ${doc.seoTitle}`);
    console.log(`  seoDesc:       ${doc.seoDescription?.slice(0, 80)}…`);
    console.log(`  scopeIntro:    ${doc.scopeIntro ? doc.scopeIntro.slice(0, 60) + '…' : 'MISSING'}`);
    console.log(`  contentBlocks:`);
    for (const b of (doc.contentBlocks || [])) {
      console.log(`    ${b.block?.blockId?.current} (${b.version})`);
    }
  }

  console.log('\n=== Done ===\n');
}

run().catch(console.error);
