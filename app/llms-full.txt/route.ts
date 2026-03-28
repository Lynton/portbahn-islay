/**
 * llms-full.txt — Complete site content as a single markdown document
 *
 * Per the llms.txt spec, this is the "give me everything" variant.
 * All property and guide page content concatenated with separators.
 *
 * Cached more aggressively (5 min) since it's a heavier endpoint.
 */

import { NextResponse } from 'next/server';
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

// Full GROQ queries — fetch all content in one go

const ALL_PROPERTIES_QUERY = `*[_type == "property" && defined(slug.current) && !(_id in path("drafts.**"))] | order(name asc) {
  name, slug, propertyType,
  overviewIntro, description,
  sleeps, bedrooms, beds, bathrooms,
  sleepingIntro, bedroomDetails[], bathroomDetails[],
  kitchenDining[], livingAreas[], outdoorFeatures[],
  locationIntro, location, nearbyAttractions[],
  petFriendly, petPolicyIntro, petPolicyDetails[],
  reviewScores { airbnbScore, airbnbCount, bookingScore, bookingCount, googleScore, googleCount },
  reviewHighlights[] { quote, source, rating },
  totalReviewCount,
  honestFriction[] { issue, context },
  seoDescription, postcode
}`;

const ALL_GUIDES_QUERY = `*[_type == "guidePage" && defined(slug.current) && !(_id in path("drafts.**"))] | order(title asc) {
  title, slug, introduction, pullQuote, seoDescription,
  "contentBlocks": contentBlocks[defined(block._ref)]{
    version, showKeyFacts, customHeading,
    block->{ _id, title, fullContent, teaserContent, keyFacts }
  }[defined(block._id)],
  extendedEditorial,
  "featuredEntities": featuredEntities[defined(@->_id)]->{
    name, category, shortDescription, island,
    location, contact, openingHours
  },
  "faqBlocks": faqBlocks[defined(@->_id)]->{question, answer}
}`;

// ─── Render helpers (mirrors /api/md/ logic) ──────────────────────────────

function renderProperty(property: any): string {
  const slug = property.slug?.current || property.slug;
  const parts: string[] = [];

  parts.push(`# ${property.name}`);
  if (property.seoDescription) parts.push('', property.seoDescription);
  parts.push('', `Source: ${baseUrl}/accommodation/${slug}`);

  const facts: string[] = [];
  if (property.sleeps) facts.push(`Sleeps: ${property.sleeps}`);
  if (property.bedrooms) facts.push(`Bedrooms: ${property.bedrooms}`);
  if (property.bathrooms) facts.push(`Bathrooms: ${property.bathrooms}`);
  if (property.petFriendly !== undefined) {
    facts.push(`Dog-friendly: ${property.petFriendly ? 'Yes' : 'No'}`);
  }
  if (facts.length) parts.push('', facts.join(' | '));

  if (property.overviewIntro) parts.push('', '## Overview', '', toMarkdown(property.overviewIntro));
  if (property.description) parts.push('', toMarkdown(property.description));

  if (property.sleepingIntro || property.bedroomDetails?.length) {
    parts.push('', '## Sleeping Arrangements');
    if (property.sleepingIntro) parts.push('', toMarkdown(property.sleepingIntro));
    if (property.bedroomDetails?.length) {
      for (const d of property.bedroomDetails) parts.push(`- ${d}`);
    }
    if (property.bathroomDetails?.length) {
      parts.push('', '**Bathrooms:**');
      for (const d of property.bathroomDetails) parts.push(`- ${d}`);
    }
  }

  for (const { key, label } of [
    { key: 'kitchenDining', label: 'Kitchen & Dining' },
    { key: 'livingAreas', label: 'Living Areas' },
    { key: 'outdoorFeatures', label: 'Outdoor' },
  ]) {
    const items = property[key];
    if (Array.isArray(items) && items.length) {
      parts.push('', `## ${label}`);
      for (const item of items) parts.push(`- ${formatFeature(item)}`);
    }
  }

  if (property.locationIntro || property.location) {
    parts.push('', '## Location');
    if (property.locationIntro) parts.push('', toMarkdown(property.locationIntro));
    if (property.location) parts.push('', toMarkdown(property.location));
    if (property.postcode) parts.push(`Postcode: ${property.postcode}`);
  }

  if (property.nearbyAttractions?.length) {
    parts.push('', '## Nearby Attractions');
    for (const a of property.nearbyAttractions) parts.push(`- ${a}`);
  }

  if (property.petFriendly && (property.petPolicyIntro || property.petPolicyDetails?.length)) {
    parts.push('', '## Dog Policy');
    if (property.petPolicyIntro) parts.push('', toMarkdown(property.petPolicyIntro));
    if (property.petPolicyDetails?.length) {
      for (const d of property.petPolicyDetails) parts.push(`- ${d}`);
    }
  }

  const scores = property.reviewScores;
  if (scores || property.totalReviewCount) {
    parts.push('', '## Guest Reviews');
    if (property.totalReviewCount) parts.push(`Total reviews: ${property.totalReviewCount}`);
    if (scores?.airbnbScore) parts.push(`Airbnb: ${scores.airbnbScore}/5 (${scores.airbnbCount} reviews)`);
    if (scores?.bookingScore) parts.push(`Booking.com: ${scores.bookingScore}/10 (${scores.bookingCount} reviews)`);
    if (scores?.googleScore) parts.push(`Google: ${scores.googleScore}/5 (${scores.googleCount} reviews)`);
  }

  if (property.reviewHighlights?.length) {
    parts.push('', '**Guest highlights:**');
    for (const r of property.reviewHighlights) parts.push(`> "${r.quote}" — ${r.source}`);
  }

  if (property.honestFriction?.length) {
    parts.push('', '## Good to Know');
    for (const item of property.honestFriction) parts.push(`- **${item.issue}:** ${item.context}`);
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function renderGuide(page: any): string {
  const slug = page.slug?.current;
  const section = TRAVEL_SLUGS.includes(slug) ? 'islay-travel' : 'explore-islay';
  const parts: string[] = [];

  parts.push(`# ${page.title}`);
  if (page.seoDescription) parts.push('', page.seoDescription);
  parts.push('', `Source: ${baseUrl}/${section}/${slug}`);

  if (page.introduction) parts.push('', toMarkdown(page.introduction));
  if (page.pullQuote) parts.push('', `> ${page.pullQuote}`);

  const blocks = (page.contentBlocks || []).filter((b: any) => b?.block);
  for (const blockRef of blocks) {
    const block = blockRef.block;
    const heading = blockRef.customHeading || block.title;
    if (heading) parts.push('', `## ${heading}`);
    const content = blockRef.version === 'teaser' ? block.teaserContent : block.fullContent;
    const md = toMarkdown(content);
    if (md) parts.push('', md);
    if (blockRef.showKeyFacts && Array.isArray(block.keyFacts) && block.keyFacts.length) {
      parts.push('', '**Key facts:**');
      for (const fact of block.keyFacts) {
        if (fact.label && fact.value) parts.push(`- ${fact.label}: ${fact.value}`);
      }
    }
  }

  const editorial = toMarkdown(page.extendedEditorial);
  if (editorial) parts.push('', '## More Information', '', editorial);

  const entities = (page.featuredEntities || []).filter((e: any) => e);
  if (entities.length) {
    parts.push('', '## Places & Attractions');
    for (const entity of entities) {
      parts.push('', `### ${entity.name}`);
      if (entity.category) parts.push(`Category: ${entity.category}`);
      if (entity.shortDescription) parts.push('', entity.shortDescription);
      if (entity.location?.village) parts.push(`Location: ${entity.location.village}`);
      if (entity.contact?.website) parts.push(`Website: ${entity.contact.website}`);
      if (entity.contact?.phone) parts.push(`Phone: ${entity.contact.phone}`);
      if (entity.openingHours) parts.push(`Hours: ${entity.openingHours}`);
    }
  }

  const faqs = (page.faqBlocks || []).filter((f: any) => f?.question);
  if (faqs.length) {
    parts.push('', '## Frequently Asked Questions');
    for (const faq of faqs) {
      parts.push('', `### ${faq.question}`, '', toMarkdown(faq.answer));
    }
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function GET() {
  try {
    const [properties, guides] = await Promise.all([
      client.fetch(ALL_PROPERTIES_QUERY),
      client.fetch(ALL_GUIDES_QUERY),
    ]);

    const sections: string[] = [
      '# Portbahn Islay — Complete Content',
      '',
      '> Three self-catering holiday rentals in Bruichladdich, Isle of Islay, Scotland.',
      '> Managed by Pi & Lynton. 600+ guests hosted, 4.97/5 average rating.',
      '',
      `Website: ${baseUrl}`,
    ];

    // Properties
    if (properties?.length) {
      sections.push('', '---', '', '# Holiday Properties');
      for (const property of properties) {
        sections.push('', '---', '', renderProperty(property));
      }
    }

    // Guide pages
    if (guides?.length) {
      // Split into explore and travel
      const explore = guides.filter((g: any) => !TRAVEL_SLUGS.includes(g.slug?.current));
      const travel = guides.filter((g: any) => TRAVEL_SLUGS.includes(g.slug?.current));

      if (explore.length) {
        sections.push('', '---', '', '# Explore Islay Guides');
        for (const guide of explore) {
          sections.push('', '---', '', renderGuide(guide));
        }
      }

      if (travel.length) {
        sections.push('', '---', '', '# Getting to Islay');
        for (const guide of travel) {
          sections.push('', '---', '', renderGuide(guide));
        }
      }
    }

    const content = sections.join('\n').replace(/\n{3,}/g, '\n\n').trim();

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('[/llms-full.txt] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
