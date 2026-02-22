/**
 * Wire Guide Pages — v4.0
 *
 * Updates the 5 guide pages with:
 * - contentBlocks: editorial canonical blocks only
 * - faqBlocks: direct references to faqCanonicalBlock documents
 *
 * Then removes the 5 canonical FAQ blocks (18–22) — their content
 * now lives in individual faqCanonicalBlock documents.
 *
 * Handoff ref: CLAUDE-CODE-GUIDE-PAGES-HANDOFF.md (2026-02-22)
 *
 * Usage: npx tsx --tsconfig scripts/tsconfig.json scripts/wire-guide-pages.ts
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

const canonicalRef = (blockId: string) => ({
  _type: 'reference' as const,
  _ref: `canonical-block-${blockId}`,
});

const faqRef = (faqId: string) => ({
  _type: 'reference' as const,
  _ref: faqId,
});

const blockRef = (blockId: string, version: 'full' | 'teaser', customHeading?: string) => ({
  _type: 'blockReference' as const,
  _key: generateKey(),
  block: canonicalRef(blockId),
  version,
  showKeyFacts: false,
  ...(customHeading ? { customHeading } : {}),
});

// ---------------------------------------------------------------------------
// Guide page definitions — contentBlocks (editorial) + faqBlocks (Q&A)
// ---------------------------------------------------------------------------

const guidePageUpdates = [
  {
    _id: 'guide-islay-distilleries',
    title: "Islay's Whisky Distilleries",
    slug: { _type: 'slug' as const, current: 'islay-distilleries' },
    introduction: "Islay has ten working whisky distilleries — more per square mile than anywhere on earth. You're a 5-minute walk from one of the world's most innovative, Bruichladdich, and the rest are within easy reach. Here's everything you need to plan your distillery days.",
    contentBlocks: [
      blockRef('distilleries-overview', 'full', "Islay's Ten Whisky Distilleries"),
    ],
    faqBlocks: [
      faqRef('faq-guide-distilleries-visit-first'),
      faqRef('faq-guide-distilleries-book-tours'),
      faqRef('faq-guide-distilleries-how-many-per-day'),
      faqRef('faq-guide-distilleries-feis-ile'),
      faqRef('faq-guide-distilleries-drink-driving'),
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
      blockRef('portbahn-beach',   'full', "Portbahn Beach"),
      blockRef('beaches-overview', 'full', "Islay's Beaches"),
    ],
    faqBlocks: [
      faqRef('faq-guide-beaches-best-beach'),
      faqRef('faq-guide-beaches-safe-swimming'),
      faqRef('faq-guide-beaches-machir-safe'),
      faqRef('faq-guide-beaches-rock-pools'),
      faqRef('faq-guide-beaches-surfing'),
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
      blockRef('wildlife-geese',        'full',   "Barnacle Geese on Islay"),
      blockRef('loch-gruinart-oysters', 'teaser', "Loch Gruinart Oysters"),
    ],
    faqBlocks: [
      faqRef('faq-guide-wildlife-what-wildlife'),
      faqRef('faq-guide-wildlife-best-time'),
      faqRef('faq-guide-wildlife-barnacle-geese'),
      faqRef('faq-guide-wildlife-otters'),
      faqRef('faq-guide-wildlife-eagles'),
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
      blockRef('food-drink-islay',      'full', "Food & Drink on Islay"),
      blockRef('loch-gruinart-oysters', 'full', "Loch Gruinart Oysters"),
    ],
    faqBlocks: [
      faqRef('faq-guide-food-book-restaurants'),
      faqRef('faq-guide-food-best-restaurant'),
      faqRef('faq-guide-food-fresh-oysters'),
      faqRef('faq-guide-food-groceries'),
      faqRef('faq-guide-food-distillery-cafe'),
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
      blockRef('families-children', 'full', "Islay with Children"),
    ],
    faqBlocks: [
      faqRef('faq-guide-family-good-for-families'),
      faqRef('faq-guide-family-safe-beaches'),
      faqRef('faq-guide-family-machir-bay'),
      faqRef('faq-guide-family-rainy-day'),
      faqRef('faq-guide-family-best-age'),
    ],
    seoTitle: "Family Holidays on Islay | Child-Friendly Activities | Portbahn Islay",
    seoDescription: "Islay family holiday guide: safe beaches, wildlife, rainy day activities, and properties set up for families. Our hosts have raised their own children on Islay and Jura — they know what works.",
  },
];

// Canonical FAQ blocks to delete once pages are rewired
const canonicalFaqBlockIds = [
  'canonical-block-food-drink-islay-faqs',
  'canonical-block-families-islay-faqs',
  'canonical-block-beaches-islay-faqs',
  'canonical-block-wildlife-islay-faqs',
  'canonical-block-distilleries-islay-faqs',
];

async function wireGuidePages() {
  console.log('\n======================================================');
  console.log('  Wire Guide Pages — v4.0');
  console.log('  contentBlocks: editorial | faqBlocks: Q&A');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  let updated = 0;
  let created = 0;
  let failed = 0;

  // 1. Update guide pages
  console.log('Updating guide pages...\n');
  for (const page of guidePageUpdates) {
    try {
      const existing = await client.fetch(`*[_id == $id][0]{_id}`, { id: page._id });
      const doc = {
        _type: 'guidePage' as const,
        _id: page._id,
        title: page.title,
        slug: page.slug,
        introduction: page.introduction,
        contentBlocks: page.contentBlocks,
        faqBlocks: page.faqBlocks,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        schemaType: 'Article',
      };
      await client.createOrReplace(doc);
      const label = `${page.contentBlocks.length} content + ${page.faqBlocks.length} FAQs`;
      if (existing) {
        console.log(`  ✓ Updated: ${page.title} — ${label}`);
        updated++;
      } else {
        console.log(`  ✓ Created: ${page.title} — ${label}`);
        created++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ Failed: ${page.title} — ${msg}`);
      failed++;
    }
  }

  // 2. Remove canonical FAQ blocks (references now cleared)
  console.log('\nRemoving canonical FAQ blocks (migrated to faqCanonicalBlock)...\n');
  let deleted = 0;
  for (const id of canonicalFaqBlockIds) {
    try {
      await client.delete(id);
      console.log(`  ✓ Deleted: ${id}`);
      deleted++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  — ${id}: ${msg}`);
    }
  }

  console.log('\n======================================================');
  console.log(`  Pages: ${updated} updated, ${created} created, ${failed} failed`);
  console.log(`  Canonical FAQ blocks removed: ${deleted}`);
  console.log('======================================================\n');
}

wireGuidePages().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
