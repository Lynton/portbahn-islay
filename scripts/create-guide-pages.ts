/**
 * Create Guide Pages (spoke pages for hub-and-spoke architecture)
 *
 * Creates focused topic pages with relevant content blocks and FAQs:
 * - /guides/islay-distilleries
 * - /guides/islay-beaches
 * - /guides/islay-wildlife
 * - /guides/family-holidays
 * - /guides/food-and-drink
 *
 * Note: /jura already exists as a separate page
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface GuidePage {
  _type: 'guidePage';
  _id: string;
  title: string;
  slug: { _type: 'slug'; current: string };
  introduction: string;
  contentBlocks: Array<{
    _type: 'blockReference';
    _key: string;
    block: { _type: 'reference'; _ref: string };
    version: 'full' | 'teaser';
  }>;
  faqBlocks: Array<{
    _type: 'faqBlockReference';
    _key: string;
    faqBlock: { _type: 'reference'; _ref: string };
  }>;
  seoTitle: string;
  seoDescription: string;
}

// Helper to generate unique keys
const generateKey = () => Math.random().toString(36).substring(2, 11);

// Guide page definitions
const guidePages: GuidePage[] = [
  {
    _type: 'guidePage',
    _id: 'guide-islay-distilleries',
    title: "Islay's Whisky Distilleries",
    slug: { _type: 'slug', current: 'islay-distilleries' },
    introduction: "Islay is world-famous for its peaty, smoky single malt whiskies. With ten working distilleries on an island just 25 miles long, you're never far from a dram.",
    contentBlocks: [
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-content-distilleries-overview' },
        version: 'full',
      },
    ],
    faqBlocks: [
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-distilleries-what-is-islay-famous-for' },
      },
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-distilleries-what-is-islay-whisky' },
      },
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-distilleries-how-many-distilleries-are-on-islay' },
      },
    ],
    seoTitle: "Islay Whisky Distilleries Guide | All 10 Distilleries | Portbahn Islay",
    seoDescription: "Complete guide to Islay's ten whisky distilleries including Ardbeg, Laphroaig, Lagavulin and Bruichladdich. Local host recommendations from our Bruichladdich base.",
  },
  {
    _type: 'guidePage',
    _id: 'guide-islay-beaches',
    title: "Islay's Beaches",
    slug: { _type: 'slug', current: 'islay-beaches' },
    introduction: "Islay has some of Scotland's most spectacular beaches - from sweeping Atlantic sands to hidden coves. Most are quiet even in peak season.",
    contentBlocks: [
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-content-beaches-overview' },
        version: 'full',
      },
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-content-portbahn-beach' },
        version: 'full',
      },
    ],
    faqBlocks: [
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-prop-portbahn-how-close-is-portbahn-house-to-the-beach' },
      },
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-prop-shorefield-how-close-is-shorefield-to-the-beach' },
      },
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-prop-curlew-how-close-is-curlew-cottage-to-the-beach' },
      },
    ],
    seoTitle: "Islay Beaches Guide | Best Beaches on Islay | Portbahn Islay",
    seoDescription: "Discover Islay's stunning beaches from Machir Bay to the Big Strand. Our properties are perfectly positioned for beach access.",
  },
  {
    _type: 'guidePage',
    _id: 'guide-islay-wildlife',
    title: "Islay Wildlife & Birdwatching",
    slug: { _type: 'slug', current: 'islay-wildlife' },
    introduction: "Islay is a haven for wildlife, from the 30,000+ barnacle geese arriving each October to seals, otters and golden eagles.",
    contentBlocks: [
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-content-wildlife-geese' },
        version: 'full',
      },
    ],
    faqBlocks: [],
    seoTitle: "Islay Wildlife & Birdwatching Guide | Portbahn Islay",
    seoDescription: "Islay wildlife guide: barnacle geese, seals, otters, eagles. Shorefield has private bird hides. Best times to visit for wildlife.",
  },
  {
    _type: 'guidePage',
    _id: 'guide-family-holidays',
    title: "Family Holidays on Islay",
    slug: { _type: 'slug', current: 'family-holidays' },
    introduction: "Islay is wonderfully family-friendly - safe beaches, wildlife to spot, and a pace of life that lets everyone relax.",
    contentBlocks: [
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-content-families-children' },
        version: 'full',
      },
    ],
    faqBlocks: [
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-family-is-islay-good-for-families' },
      },
    ],
    seoTitle: "Family Holidays on Islay | Child-Friendly Activities | Portbahn Islay",
    seoDescription: "Islay family holiday guide: safe beaches, wildlife spotting, distillery visits (yes, with kids!). Our properties welcome families.",
  },
  {
    _type: 'guidePage',
    _id: 'guide-food-and-drink',
    title: "Food & Drink on Islay",
    slug: { _type: 'slug', current: 'food-and-drink' },
    introduction: "Beyond the whisky, Islay has excellent local produce, seafood, and a growing food scene.",
    contentBlocks: [
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-content-food-drink-islay' },
        version: 'full',
      },
    ],
    faqBlocks: [],
    seoTitle: "Food & Drink on Islay | Restaurants & Local Produce | Portbahn Islay",
    seoDescription: "Islay food guide: restaurants, cafes, local produce. From fresh seafood to farm shops. Local recommendations.",
  },
];

async function createGuidePages() {
  console.log('Creating guide pages...\n');

  for (const page of guidePages) {
    try {
      // Check if page already exists
      const existing = await client.fetch(`*[_id == $id][0]`, { id: page._id });

      if (existing) {
        console.log(`⏭️  ${page.title} already exists, skipping`);
        continue;
      }

      await client.createOrReplace(page);
      console.log(`✅ Created: ${page.title} (/${page.slug.current})`);
    } catch (error: any) {
      console.error(`❌ Error creating ${page.title}:`, error.message);
    }
  }

  console.log('\n✅ Guide pages created!');
  console.log('\nNext steps:');
  console.log('1. Update /explore-islay to be a hub page with teasers');
  console.log('2. Move remaining FAQs from explore-islay to appropriate guide pages');
  console.log('3. Test pages at /guides/[slug]');
}

createGuidePages().catch(console.error);
