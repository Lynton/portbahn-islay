/**
 * Create Travel Guide Pages (spoke pages for hub-and-spoke architecture)
 *
 * Creates focused travel topic pages with relevant content blocks and FAQs:
 * - /travel/ferry-to-islay
 * - /travel/flights-to-islay
 * - /travel/planning-your-trip
 *
 * These will be linked from /getting-here (hub page)
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

// Travel guide page definitions
const travelGuidePages: GuidePage[] = [
  {
    _type: 'guidePage',
    _id: 'guide-ferry-to-islay',
    title: 'Ferry to Islay',
    slug: { _type: 'slug', current: 'ferry-to-islay' },
    introduction: "The CalMac ferry from Kennacraig to Port Ellen or Port Askaig is the main way to reach Islay. We provide comprehensive ferry support to help ensure your crossing goes smoothly.",
    contentBlocks: [
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-content-travel-to-islay' },
        version: 'full',
      },
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-content-ferry-support' },
        version: 'full',
      },
    ],
    faqBlocks: [
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-trvl-ferries-how-long-is-the-ferry-to-islay' },
      },
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-trvl-ferries-do-you-help-with-ferry-disruptions' },
      },
    ],
    seoTitle: "Ferry to Islay | CalMac Timetable & Booking | Portbahn Islay",
    seoDescription: "Complete guide to the CalMac ferry to Islay from Kennacraig. Timetables, booking tips, and our comprehensive ferry support service.",
  },
  {
    _type: 'guidePage',
    _id: 'guide-flights-to-islay',
    title: 'Flights to Islay',
    slug: { _type: 'slug', current: 'flights-to-islay' },
    introduction: "Loganair operates daily flights to Islay from Glasgow, offering a quick and scenic alternative to the ferry. The flight takes just 40 minutes.",
    contentBlocks: [],
    faqBlocks: [
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-trvl-flights-can-you-fly-to-islay-from-glasgow' },
      },
    ],
    seoTitle: "Flights to Islay | Loganair from Glasgow | Portbahn Islay",
    seoDescription: "Fly to Islay with Loganair from Glasgow. Flight times, booking information, and tips for flying to the Isle of Islay.",
  },
  {
    _type: 'guidePage',
    _id: 'guide-planning-your-trip',
    title: 'Planning Your Trip to Islay',
    slug: { _type: 'slug', current: 'planning-your-trip' },
    introduction: "Everything you need to know about visiting Islay - from when to visit to getting around the island once you're here.",
    contentBlocks: [],
    faqBlocks: [
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-trvl-planning-how-many-days-do-i-need-on-islay' },
      },
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-trvl-planning-when-is-the-best-time-to-visit-islay' },
      },
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-trvl-planning-whats-the-weather-like-on-islay' },
      },
      {
        _type: 'faqBlockReference',
        _key: generateKey(),
        faqBlock: { _type: 'reference', _ref: 'faqCanonicalBlock.faq-trvl-planning-can-you-get-around-islay-without-a-car' },
      },
    ],
    seoTitle: "Planning Your Islay Trip | When to Visit | Portbahn Islay",
    seoDescription: "Plan your perfect Islay holiday. Best times to visit, weather guide, getting around, and how long to stay on the Isle of Islay.",
  },
];

async function createTravelGuidePages() {
  console.log('Creating travel guide pages...\n');

  for (const page of travelGuidePages) {
    try {
      // Check if page already exists
      const existing = await client.fetch(`*[_id == $id][0]`, { id: page._id });

      if (existing) {
        console.log(`⏭️  ${page.title} already exists, skipping`);
        continue;
      }

      await client.createOrReplace(page);
      console.log(`✅ Created: ${page.title} (/guides/${page.slug.current})`);
    } catch (error: any) {
      console.error(`❌ Error creating ${page.title}:`, error.message);
    }
  }

  console.log('\n✅ Travel guide pages created!');
  console.log('\nNext steps:');
  console.log('1. Update /getting-here to be a hub page with teasers');
  console.log('2. Add navigation submenu for Travel to Islay');
  console.log('3. Test pages at /guides/[slug]');
}

createTravelGuidePages().catch(console.error);
