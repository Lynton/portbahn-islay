/**
 * Markdown content API for AI retrieval.
 *
 * Serves page content as clean Markdown for AI search systems.
 * Mirrors the HTML page structure but stripped of layout/styling.
 *
 * Routes:
 *   /api/md/accommodation/:slug  → property page
 *   /api/md/explore-islay/:slug  → explore guide page
 *   /api/md/islay-travel/:slug   → travel guide page
 */

import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { toMarkdown } from '@/lib/portable-text-to-markdown';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.co.uk';

const TRAVEL_SLUGS = [
  'ferry-to-islay',
  'flights-to-islay',
  'planning-your-trip',
  'travelling-without-a-car',
  'travelling-to-islay-with-your-dog',
  'arriving-on-islay',
  'getting-around-islay',
];

const FEATURE_LABELS: Record<string, string> = {
  dishwasher: 'Dishwasher', microwave: 'Microwave', oven: 'Oven',
  refrigerator: 'Refrigerator', toaster: 'Toaster', coffee_machine: 'Coffee machine',
  vacuum_cleaner: 'Vacuum cleaner', bbq_grill: 'BBQ grill', high_chair: "Children's high chair",
  kitchen_stove: 'Kitchen stove/range', dining_table_6: 'Dining table for 6',
  dining_table_8: 'Dining table for 8',
  open_plan: 'Open plan layout', separate_sitting: 'Separate sitting room',
  separate_dining: 'Separate dining room', conservatory: 'Conservatory',
  sea_views: 'Sea views', wifi: 'Wifi/broadband', books_games: 'Books and games',
  double_glazing: 'Double glazing',
  private_garden: 'Private garden', sea_views_outdoor: 'Sea views',
  bbq_area: 'BBQ area', play_equipment: "Children's play equipment",
  trampoline: 'Trampoline', swings: 'Swings', woodland: 'Woodland/nature area',
  ponds: 'Ponds', bird_reserves: 'Bird reserves', greenhouse: 'Greenhouse',
  garage: 'Garage', walled_garden: 'Walled garden', elevated: 'Elevated position',
};

function formatFeature(val: string): string {
  return FEATURE_LABELS[val] ?? val.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

// ─── GROQ Queries ────────────────────────────────────────────────────────────

const GUIDE_QUERY = `*[_type == "guidePage" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  title,
  slug,
  introduction,
  pullQuote,
  seoDescription,
  "contentBlocks": contentBlocks[defined(block._ref)]{
    version,
    showKeyFacts,
    customHeading,
    block->{
      _id, title, fullContent, teaserContent, keyFacts
    }
  }[defined(block._id)],
  extendedEditorial,
  "featuredEntities": featuredEntities[defined(@->_id)]->{
    name, category, shortDescription, island,
    location, contact, openingHours
  },
  "faqBlocks": faqBlocks[defined(@->_id)]->{question, answer}
}`;

const PROPERTY_QUERY = `*[_type == "property" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
  name, slug, propertyType,
  overviewIntro, description,
  sleeps, bedrooms, beds, bathrooms,
  sleepingIntro, bedroomDetails[], bathroomDetails[],
  kitchenDining[], livingAreas[], outdoorFeatures[],
  locationIntro, location, nearbyAttractions[],
  petFriendly, petPolicyIntro, petPolicyDetails[],
  reviewScores {
    airbnbScore, airbnbCount,
    bookingScore, bookingCount,
    googleScore, googleCount
  },
  reviewHighlights[] { quote, source, rating },
  totalReviewCount,
  honestFriction[] { issue, context },
  seoDescription,
  postcode, latitude, longitude
}`;

// ─── Renderers ───────────────────────────────────────────────────────────────

function renderGuidePage(page: any, section: string, slug: string): string {
  const parts: string[] = [];
  const pageUrl = `${baseUrl}/${section}/${slug}`;

  parts.push(`# ${page.title}`);
  if (page.seoDescription) parts.push('', page.seoDescription);
  parts.push('', `Source: ${pageUrl}`);

  // Introduction
  if (page.introduction) {
    parts.push('', toMarkdown(page.introduction));
  }

  // Pull quote
  if (page.pullQuote) {
    parts.push('', `> ${page.pullQuote}`);
  }

  // Content blocks
  const blocks = (page.contentBlocks || []).filter((b: any) => b?.block);
  for (const blockRef of blocks) {
    const block = blockRef.block;
    const heading = blockRef.customHeading || block.title;
    if (heading) parts.push('', `## ${heading}`);

    const content = blockRef.version === 'teaser' ? block.teaserContent : block.fullContent;
    const md = toMarkdown(content);
    if (md) parts.push('', md);

    // Key facts
    if (blockRef.showKeyFacts && Array.isArray(block.keyFacts) && block.keyFacts.length) {
      parts.push('', '**Key facts:**');
      for (const fact of block.keyFacts) {
        if (fact.label && fact.value) {
          parts.push(`- ${fact.label}: ${fact.value}`);
        }
      }
    }
  }

  // Extended editorial
  const editorial = toMarkdown(page.extendedEditorial);
  if (editorial) {
    parts.push('', '## More Information', '', editorial);
  }

  // Featured entities
  const entities = (page.featuredEntities || []).filter((e: any) => e);
  if (entities.length) {
    parts.push('', '## Places & Attractions');
    for (const entity of entities) {
      parts.push('', `### ${entity.name}`);
      if (entity.category) parts.push(`Category: ${entity.category}`);
      if (entity.island) parts.push(`Island: ${entity.island}`);
      if (entity.shortDescription) parts.push('', entity.shortDescription);
      if (entity.location?.village) parts.push(`Location: ${entity.location.village}`);
      if (entity.location?.distanceFromBruichladdich) {
        parts.push(`Distance from Bruichladdich: ${entity.location.distanceFromBruichladdich}`);
      }
      if (entity.contact?.website) parts.push(`Website: ${entity.contact.website}`);
      if (entity.contact?.phone) parts.push(`Phone: ${entity.contact.phone}`);
      if (entity.openingHours) parts.push(`Hours: ${entity.openingHours}`);
    }
  }

  // FAQs
  const faqs = (page.faqBlocks || []).filter((f: any) => f?.question);
  if (faqs.length) {
    parts.push('', '## Frequently Asked Questions');
    for (const faq of faqs) {
      parts.push('', `### ${faq.question}`, '', toMarkdown(faq.answer));
    }
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function renderPropertyPage(property: any, slug: string): string {
  const parts: string[] = [];
  const pageUrl = `${baseUrl}/accommodation/${slug}`;

  parts.push(`# ${property.name}`);
  if (property.seoDescription) parts.push('', property.seoDescription);
  parts.push('', `Source: ${pageUrl}`);

  // Quick facts
  const facts: string[] = [];
  if (property.sleeps) facts.push(`Sleeps: ${property.sleeps}`);
  if (property.bedrooms) facts.push(`Bedrooms: ${property.bedrooms}`);
  if (property.bathrooms) facts.push(`Bathrooms: ${property.bathrooms}`);
  if (property.petFriendly !== undefined) {
    facts.push(`Dog-friendly: ${property.petFriendly ? 'Yes' : 'No'}`);
  }
  if (facts.length) {
    parts.push('', facts.join(' | '));
  }

  // Overview
  if (property.overviewIntro) {
    parts.push('', '## Overview', '', toMarkdown(property.overviewIntro));
  }
  if (property.description) {
    parts.push('', toMarkdown(property.description));
  }

  // Sleeping arrangements
  if (property.sleepingIntro || property.bedroomDetails?.length) {
    parts.push('', '## Sleeping Arrangements');
    if (property.sleepingIntro) parts.push('', toMarkdown(property.sleepingIntro));
    if (property.bedroomDetails?.length) {
      for (const detail of property.bedroomDetails) {
        parts.push(`- ${detail}`);
      }
    }
    if (property.bathroomDetails?.length) {
      parts.push('', '**Bathrooms:**');
      for (const detail of property.bathroomDetails) {
        parts.push(`- ${detail}`);
      }
    }
  }

  // Features
  const featureSections = [
    { key: 'kitchenDining', label: 'Kitchen & Dining' },
    { key: 'livingAreas', label: 'Living Areas' },
    { key: 'outdoorFeatures', label: 'Outdoor' },
  ];
  for (const { key, label } of featureSections) {
    const items = property[key];
    if (Array.isArray(items) && items.length) {
      parts.push('', `## ${label}`);
      for (const item of items) {
        parts.push(`- ${formatFeature(item)}`);
      }
    }
  }

  // Location
  if (property.locationIntro || property.location) {
    parts.push('', '## Location');
    if (property.locationIntro) parts.push('', toMarkdown(property.locationIntro));
    if (property.location) parts.push('', toMarkdown(property.location));
    if (property.postcode) parts.push(`Postcode: ${property.postcode}`);
  }

  // Nearby attractions
  if (property.nearbyAttractions?.length) {
    parts.push('', '## Nearby Attractions');
    for (const attraction of property.nearbyAttractions) {
      parts.push(`- ${attraction}`);
    }
  }

  // Pet policy
  if (property.petFriendly && (property.petPolicyIntro || property.petPolicyDetails?.length)) {
    parts.push('', '## Dog Policy');
    if (property.petPolicyIntro) parts.push('', toMarkdown(property.petPolicyIntro));
    if (property.petPolicyDetails?.length) {
      for (const detail of property.petPolicyDetails) {
        parts.push(`- ${detail}`);
      }
    }
  }

  // Reviews
  const scores = property.reviewScores;
  if (scores || property.totalReviewCount) {
    parts.push('', '## Guest Reviews');
    if (property.totalReviewCount) parts.push(`Total reviews: ${property.totalReviewCount}`);
    if (scores?.airbnbScore) parts.push(`Airbnb: ${scores.airbnbScore}/5 (${scores.airbnbCount} reviews)`);
    if (scores?.bookingScore) parts.push(`Booking.com: ${scores.bookingScore}/10 (${scores.bookingCount} reviews)`);
    if (scores?.googleScore) parts.push(`Google: ${scores.googleScore}/5 (${scores.googleCount} reviews)`);
  }

  // Review highlights
  if (property.reviewHighlights?.length) {
    parts.push('', '**Guest highlights:**');
    for (const review of property.reviewHighlights) {
      parts.push(`> "${review.quote}" — ${review.source}`);
    }
  }

  // Honest friction
  if (property.honestFriction?.length) {
    parts.push('', '## Good to Know');
    for (const item of property.honestFriction) {
      parts.push(`- **${item.issue}:** ${item.context}`);
    }
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;

  if (!slug || slug.length < 2) {
    return NextResponse.json(
      { error: 'Expected format: /api/md/{section}/{slug}' },
      { status: 400 }
    );
  }

  const [section, pageSlug] = slug;
  let markdown: string | null = null;

  try {
    if (section === 'accommodation') {
      const property = await client.fetch(PROPERTY_QUERY, { slug: pageSlug });
      if (property) markdown = renderPropertyPage(property, pageSlug);
    } else if (section === 'explore-islay') {
      if (TRAVEL_SLUGS.includes(pageSlug)) {
        return NextResponse.json({ error: 'Travel pages are under /api/md/islay-travel/' }, { status: 400 });
      }
      const page = await client.fetch(GUIDE_QUERY, { slug: pageSlug });
      if (page) markdown = renderGuidePage(page, section, pageSlug);
    } else if (section === 'islay-travel') {
      const page = await client.fetch(GUIDE_QUERY, { slug: pageSlug });
      if (page) markdown = renderGuidePage(page, section, pageSlug);
    } else {
      return NextResponse.json(
        { error: `Unknown section: ${section}. Valid: accommodation, explore-islay, islay-travel` },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(`[/api/md] Error fetching ${section}/${pageSlug}:`, err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  if (!markdown) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
