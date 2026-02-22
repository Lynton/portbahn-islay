/**
 * Wire Guide Pages — v4.0
 *
 * Updates the 5 guide pages with correct contentBlocks per handoff spec.
 * Replaces legacy faqBlocks pattern — FAQ content is now canonical blocks
 * wired inline via contentBlocks.
 *
 * Handoff ref: CLAUDE-CODE-GUIDE-PAGES-HANDOFF.md (2026-02-22)
 *
 * Usage: npx tsx scripts/tsconfig.json scripts/wire-guide-pages.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const generateKey = () => Math.random().toString(36).substring(2, 11);

// Block reference IDs — canonical-block-{blockId} as set by import-canonical-blocks.ts
const ref = (blockId: string) => ({
  _type: 'reference' as const,
  _ref: `canonical-block-${blockId}`,
});

const blockRef = (blockId: string, version: 'full' | 'teaser', customHeading?: string) => ({
  _type: 'blockReference' as const,
  _key: generateKey(),
  block: ref(blockId),
  version,
  showKeyFacts: false,
  ...(customHeading ? { customHeading } : {}),
});

/**
 * Guide page definitions per handoff spec.
 * Each page: _id matches existing Sanity document, contentBlocks wired per spec.
 */
const guidePageUpdates = [
  {
    _id: 'guide-islay-distilleries',
    title: "Islay's Whisky Distilleries",
    slug: { _type: 'slug' as const, current: 'islay-distilleries' },
    introduction: "Islay has ten working whisky distilleries — more per square mile than anywhere on earth. You're a 5-minute walk from one of the world's most innovative, Bruichladdich, and the rest are within easy reach. Here's everything you need to plan your distillery days.",
    contentBlocks: [
      blockRef('distilleries-overview',     'full', "Islay's Ten Whisky Distilleries"),
      blockRef('distilleries-islay-faqs',   'full', "Visiting Islay Distilleries — Frequently Asked Questions"),
    ],
    seoTitle: "Islay Whisky Distilleries Guide | All 10 Distilleries | Portbahn Islay",
    seoDescription: "Complete guide to Islay's ten whisky distilleries: Ardbeg, Laphroaig, Lagavulin, Bruichladdich and more. Local recommendations, tour tips, and Fèis Ìle advice from hosts in Bruichladdich.",
  },
  {
    _id: 'guide-islay-beaches',
    title: "Beaches of Islay",
    slug: { _type: 'slug' as const, current: 'islay-beaches' },
    introduction: "Islay's coastline runs to over 130 miles, with beaches ranging from sheltered coves perfect for rock pooling to dramatic Atlantic shores backed by golden dunes. Most are uncrowded even at peak season. Here's our guide to the best.",
    contentBlocks: [
      blockRef('portbahn-beach',         'full', "Portbahn Beach"),
      blockRef('beaches-overview',       'full', "Islay's Beaches"),
      blockRef('beaches-islay-faqs',     'full', "Islay Beaches — Frequently Asked Questions"),
    ],
    seoTitle: "Islay Beaches Guide | Best Beaches on Islay | Portbahn Islay",
    seoDescription: "Guide to Islay's beaches: safe swimming at Portbahn Beach, Machir Bay's dramatic dunes, hidden coves at Singing Sands. Safety warnings, rock pooling spots, and local tips from our Bruichladdich base.",
  },
  {
    _id: 'guide-islay-wildlife',
    title: "Wildlife & Nature on Islay",
    slug: { _type: 'slug' as const, current: 'islay-wildlife' },
    introduction: "Islay supports some of Scotland's most spectacular wildlife. Over 30,000 barnacle geese arrive each winter from Greenland, golden eagles and sea eagles soar year-round, and seals are a daily sighting from our properties. This is a wildlife destination of the first order.",
    contentBlocks: [
      blockRef('wildlife-geese',         'full',   "Barnacle Geese on Islay"),
      blockRef('loch-gruinart-oysters',  'teaser', "Loch Gruinart Oysters"),
      blockRef('wildlife-islay-faqs',    'full',   "Islay Wildlife — Frequently Asked Questions"),
    ],
    seoTitle: "Islay Wildlife Guide | Eagles, Geese & Seals | Portbahn Islay",
    seoDescription: "Islay wildlife guide: 30,000+ barnacle geese at RSPB Loch Gruinart, golden and sea eagles, seals, otters and marine life. Best times to visit and where to go, from hosts in Bruichladdich.",
  },
  {
    _id: 'guide-food-and-drink',
    title: "Food & Drink on Islay",
    slug: { _type: 'slug' as const, current: 'food-and-drink' },
    introduction: "Islay's food scene is built around what the island produces: fresh seafood from local fishermen, lamb and venison from the hills, and whisky from ten distilleries. Dining out isn't cheap, but quality is high. Here's where we send our guests.",
    contentBlocks: [
      blockRef('food-drink-islay',       'full', "Food & Drink on Islay"),
      blockRef('loch-gruinart-oysters',  'full', "Loch Gruinart Oysters"),
      blockRef('food-drink-islay-faqs',  'full', "Food & Drink on Islay — Frequently Asked Questions"),
    ],
    seoTitle: "Food & Drink on Islay | Restaurants & Local Produce | Portbahn Islay",
    seoDescription: "Islay food and drink guide: Lochindaal Seafood Kitchen, Port Charlotte Hotel, Ardbeg café, Loch Gruinart oysters. Where to eat, grocery shopping, and self-catering tips from local hosts.",
  },
  {
    _id: 'guide-family-holidays',
    title: "Family Holidays on Islay",
    slug: { _type: 'slug' as const, current: 'family-holidays' },
    introduction: "Islay is one of Scotland's best family holiday destinations — if your family wants space, fresh air, and genuine nature rather than organised entertainment. Safe beaches, 30,000+ geese in winter, rock pools, and a pace of life that lets everyone actually unwind. Pi and Lynton have raised their own children here.",
    contentBlocks: [
      blockRef('families-children',      'full', "Islay with Children"),
      blockRef('families-islay-faqs',    'full', "Family Holidays on Islay — Frequently Asked Questions"),
    ],
    seoTitle: "Family Holidays on Islay | Child-Friendly Activities | Portbahn Islay",
    seoDescription: "Islay family holiday guide: safe beaches, wildlife, rainy day activities, and properties set up for families. Our hosts have raised their own children on Islay and Jura — they know what works.",
  },
];

async function wireGuidePages() {
  console.log('\n======================================================');
  console.log('  Wire Guide Pages — v4.0 contentBlocks');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  let updated = 0;
  let created = 0;
  let failed = 0;

  for (const page of guidePageUpdates) {
    try {
      const existing = await client.fetch(`*[_id == $id][0]{_id, title}`, { id: page._id });

      const doc = {
        _type: 'guidePage' as const,
        _id: page._id,
        title: page.title,
        slug: page.slug,
        introduction: page.introduction,
        contentBlocks: page.contentBlocks,
        // Explicitly unset faqBlocks — legacy field being removed
        faqBlocks: [],
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        schemaType: 'Article',
      };

      await client.createOrReplace(doc);

      if (existing) {
        console.log(`  ✓ Updated: ${page.title} (/${page.slug.current}) — ${page.contentBlocks.length} blocks`);
        updated++;
      } else {
        console.log(`  ✓ Created: ${page.title} (/${page.slug.current}) — ${page.contentBlocks.length} blocks`);
        created++;
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`  ✗ Failed: ${page.title} — ${msg}`);
      failed++;
    }
  }

  console.log('\n======================================================');
  console.log(`  Complete: ${updated} updated, ${created} created, ${failed} failed`);
  console.log('======================================================\n');

  if (failed === 0) {
    console.log('Next steps:');
    console.log('1. Verify pages in Sanity Studio — /studio → Guide Pages');
    console.log('2. Check contentBlocks wiring matches handoff spec headings');
    console.log('3. Publish any draft blocks (Blocks 17–22 may need publishing)');
    console.log('4. Test at localhost:3000/explore-islay/[slug]\n');
  }
}

wireGuidePages().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
