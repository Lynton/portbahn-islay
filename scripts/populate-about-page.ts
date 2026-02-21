/**
 * Populate About Us Page in Sanity
 *
 * Creates or updates the aboutPage singleton with:
 * - Title, scopeIntro, SEO fields
 * - Content blocks wired: about-us (full), trust-signals (teaser), bothan-jura-teaser (teaser)
 *
 * Usage: npx tsx scripts/populate-about-page.ts
 *
 * Prerequisites:
 * - Canonical blocks must already exist (run import-canonical-blocks.ts first)
 * - NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 * - SANITY_API_TOKEN in .env.local (needs write access)
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

const aboutPageDoc = {
  _type: 'aboutPage',
  _id: 'aboutPage',
  title: 'About Pi & Lynton',
  scopeIntro:
    'This page is about us — Pi, Lynton and Amba. We\'ve been hosting guests on Islay since 2017, managing three family homes in Bruichladdich. We now live on Jura, one more ferry away, but we\'re always on hand to help you plan your trip.',
  seoTitle: 'About Pi & Lynton — Your Islay Hosts Since 2017 | Portbahn Islay',
  seoDescription:
    'Meet Pi and Lynton, hosts of three holiday properties in Bruichladdich, Isle of Islay. Family-run since 2017, 600+ guests, 4.97/5 rating, 5.0/5 communication.',
  entityFraming: {
    whatItIs:
      'An about page for the hosts of three self-catering holiday properties in Bruichladdich, Isle of Islay, Scotland',
    whatItIsNot: [
      'Not a booking page',
      'Not a property listing',
    ],
    primaryDifferentiator:
      'Family-run since 2017 with 4.97/5 rating across 600+ guests and 5.0/5 communication rating',
  },
  trustSignals: {
    ownership: 'Family-owned and managed',
    established: 'Hosting guests since 2017',
    guestExperience: '600+ guests welcomed across three properties',
    localCredentials: [
      'Airbnb Superhost',
      '4.97/5 average rating',
      '5.0/5 communication rating',
      '30+ reviews mention ferry crisis support',
    ],
  },
  contentBlocks: [
    blockRef('about-us', 'full'),
    blockRef('trust-signals', 'teaser', { customHeading: 'Our Track Record' }),
    blockRef('bothan-jura-teaser', 'teaser', { customHeading: 'Also on Jura' }),
  ],
};

async function populateAboutPage() {
  console.log('\n======================================================');
  console.log('  Populate About Us Page');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  // Verify canonical blocks exist
  const requiredBlocks = ['about-us', 'trust-signals', 'bothan-jura-teaser'];
  const existingBlocks = await client.fetch(
    `*[_type == "canonicalBlock" && _id in $ids]{ _id }`,
    { ids: requiredBlocks.map((id) => `canonical-block-${id}`) }
  );

  const existingIds = new Set(existingBlocks.map((b: { _id: string }) => b._id));
  const missing = requiredBlocks.filter((id) => !existingIds.has(`canonical-block-${id}`));

  if (missing.length > 0) {
    console.warn('  ⚠ Missing canonical blocks:');
    missing.forEach((id) => console.warn(`    - ${id}`));
    console.warn('  Run: npx tsx scripts/import-canonical-blocks.ts\n');
  } else {
    console.log('  ✓ All required canonical blocks exist\n');
  }

  // Create or replace aboutPage document
  try {
    await client.createOrReplace(aboutPageDoc);
    console.log('  ✓ aboutPage document created/updated');
    console.log('    Title: ' + aboutPageDoc.title);
    console.log('    Blocks: about-us (full), trust-signals (teaser), bothan-jura-teaser (teaser)');
    console.log('    SEO title: ' + aboutPageDoc.seoTitle);
  } catch (error) {
    console.error('  ✗ Failed to create aboutPage:', error);
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('  ✓ Complete');
  console.log('======================================================\n');
  console.log('Next steps:');
  console.log('1. Add a hero image in Sanity Studio (About Us → Hero Image)');
  console.log('2. Check /about-us in browser');
  console.log('3. Publish the document in Sanity Studio\n');
}

populateAboutPage().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
