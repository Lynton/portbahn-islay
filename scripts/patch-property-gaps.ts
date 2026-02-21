/**
 * Patch Property Data Gaps — Shorefield + Curlew Cottage
 *
 * Adds missing fields to bring both properties to 100% completeness:
 *
 * SHOREFIELD (3 fields):
 * - entityFraming (positioning statement)
 * - trustSignals (credentials)
 * - licenseNotes (licensing context)
 *
 * CURLEW COTTAGE (7 fields + typo fixes):
 * - entityFraming (positioning statement)
 * - trustSignals (credentials — host-level, trust transfer)
 * - ownerContext (Alan's family retreat)
 * - propertyNickname ("The Family Retreat")
 * - reviewHighlights (4 curated host-quality reviews from PH + SF)
 * - googleBusinessUrl (Google Maps listing)
 * - Fix typos in gettingHereIntro and nearbyAttractions
 *
 * Usage: npx tsx scripts/patch-property-gaps.ts
 *
 * Source: CURLEW-HOST-REVIEWS-SELECTION.md, CURLEW-TRUST-TRANSFER-SPEC.md,
 *         SHF-Reviews-Working.md, PBI-NUANCE-BRIEF-ENHANCED.md
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

// ─────────────────────────────────────────────────────────
// SHOREFIELD ECO HOUSE — 3 missing fields
// ─────────────────────────────────────────────────────────

const SHOREFIELD_PATCH = {
  entityFraming: {
    category: 'characterful-eco-house',
    whatItIs:
      'A 3-bedroom, pet-friendly, eco-powered holiday home with private bird reserves and woodland on the Isle of Islay in Bruichladdich, sleeping 6 guests',
    whatItIsNot: [
      'Not a modern minimalist property',
      'Not suitable for guests seeking contemporary finishes',
      'Not a hotel or bed and breakfast',
    ],
    primaryDifferentiator:
      'Only property on Islay with private bird reserves and woodland created by the owners, powered by wind and solar',
  },
  trustSignals: {
    ownership: 'Owner-managed — hosts live locally and actively manage',
    established: 'Welcoming guests since 2018',
    localCredentials: [
      'Airbnb Guest Favourite — 4.97 rating',
      'Booking.com Superb — 9.2/10',
      '5.0/5 Google rating',
      '156+ reviews across platforms',
    ],
  },
  licenseNotes:
    'Approved license AR02246F. Operating under full compliance with Islay licensing regulations.',
};

// ─────────────────────────────────────────────────────────
// CURLEW COTTAGE — 6 missing fields + typo fixes
// ─────────────────────────────────────────────────────────

const CURLEW_PATCH = {
  entityFraming: {
    category: 'family-cottage',
    whatItIs:
      "A 3-bedroom, pet-free family cottage with walled garden and private access in Bruichladdich, Isle of Islay, sleeping 6 guests. Managed by Airbnb Superhosts with a 4.97/5 rating across 380+ reviews.",
    whatItIsNot: [
      'Not a pet-friendly property',
      'Not a hotel or bed and breakfast',
      'Not suitable for large groups or parties',
    ],
    primaryDifferentiator:
      "Pet-free property ideal for allergy sufferers, with safe walled garden and private access road — managed by experienced Superhosts (4.97/5 across 380+ reviews)",
  },
  trustSignals: {
    ownership: "Family friend's retreat, managed by Pi and Lynton",
    established: 'Opening to guests for the first time in 2026',
    localCredentials: [
      'Managed by Airbnb Superhosts (4.97/5 rating)',
      'Hosts: 600+ guests across Portbahn House and Shorefield',
      '5.0/5 communication rating',
      '30+ reviews mention ferry crisis support',
    ],
  },
  ownerContext:
    "Curlew Cottage is our friend Alan's family retreat, now opening to guests for the first time. Alan has maintained the cottage lovingly over the years — the walled garden was converted from former farm steading buildings, and the private access road means it's one of the most peaceful spots in Bruichladdich. We manage it with the same care and attention as our own properties.",
  propertyNickname: 'The Family Retreat',
  // Curated host-quality reviews for trust transfer
  // Source: CURLEW-HOST-REVIEWS-SELECTION.md (Top 4 recommended)
  reviewHighlights: [
    {
      _key: 'trust_host1',
      quote:
        'A big thank you to Pi for his proactivity when our ferry was cancelled.',
      source: 'Airbnb, October 2025 — Portbahn House',
      rating: 5,
    },
    {
      _key: 'trust_host2',
      quote:
        'The host was extremely kind and responsive. The house felt like a home.',
      source: 'Airbnb, August 2025 — Portbahn House',
      rating: 5,
    },
    {
      _key: 'trust_host3',
      quote:
        'Pi was so friendly and helpful. Would highly recommend as a home base to explore the island.',
      source: 'Airbnb, November 2025 — Shorefield',
      rating: 5,
    },
    {
      _key: 'trust_host4',
      quote:
        'Pi and the team were incredible hosts. Everything was clean, sufficient supplies, friendly communication.',
      source: 'Airbnb, June 2025 — Portbahn House',
      rating: 5,
    },
  ],
  // Google listing
  googlePlaceId: 'ChIJe28bAphfikgRK5mxg24xTfI',
  googleBusinessUrl: 'https://maps.app.goo.gl/uwhzH2r4vHhEBvX48?g_st=ic',
  // Typo fixes
  gettingHereIntro:
    'Half a mile outside Bruichladdich, 30 minutes from ferry ports and airport',
  nearbyAttractions: [
    'Bruichladdich Distillery, 10 minutes walk',
    'Port Charlotte village, 30 minutes walk along coastal path',
    "Port Mor children's playground, 5 minute drive, 30 minute walk",
  ],
};

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────

async function patchProperties() {
  console.log('\n======================================================');
  console.log('  Patch Property Data Gaps');
  console.log('======================================================\n');
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  // Find properties by slug
  const properties = await client.fetch(
    `*[_type == "property" && slug.current in ["shorefield-eco-house", "curlew-cottage"]]{ _id, name, slug }`
  );

  interface PropertyDoc { _id: string; name: string; slug: { current: string } }
  const bySlug = new Map<string, PropertyDoc>(
    properties.map((p: PropertyDoc) => [p.slug.current, p])
  );

  // Patch Shorefield
  const shorefield = bySlug.get('shorefield-eco-house');
  if (shorefield) {
    try {
      await client.patch(shorefield._id).set(SHOREFIELD_PATCH).commit();
      console.log(`  ✓ Shorefield Eco House (${shorefield._id})`);
      console.log('    + entityFraming');
      console.log('    + trustSignals');
      console.log('    + licenseNotes');
    } catch (error) {
      console.error('  ✗ Shorefield patch failed:', error);
    }
  } else {
    console.log('  ⚠ Shorefield Eco House not found in Sanity');
  }

  console.log('');

  // Patch Curlew
  const curlew = bySlug.get('curlew-cottage');
  if (curlew) {
    try {
      await client.patch(curlew._id).set(CURLEW_PATCH).commit();
      console.log(`  ✓ Curlew Cottage (${curlew._id})`);
      console.log('    + entityFraming');
      console.log('    + trustSignals');
      console.log('    + ownerContext');
      console.log('    + propertyNickname');
      console.log('    + reviewHighlights (4 trust-transfer reviews)');
      console.log('    + googleBusinessUrl');
      console.log('    ~ gettingHereIntro typo fix');
      console.log('    ~ nearbyAttractions typo fix');
    } catch (error) {
      console.error('  ✗ Curlew patch failed:', error);
    }
  } else {
    console.log('  ⚠ Curlew Cottage not found in Sanity');
  }

  console.log('\n======================================================');
  console.log('  ✓ Complete');
  console.log('======================================================\n');
  console.log('Next steps:');
  console.log('1. Verify in Sanity Studio (property → AI & Search Optimization tab)');
  console.log('2. Check Curlew Cottage page renders trust transfer section');
  console.log('3. Add hero images for all properties\n');
}

patchProperties().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
