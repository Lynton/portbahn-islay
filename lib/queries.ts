import { cache } from 'react';
import { client } from '@/sanity/lib/client';

/**
 * Shared GROQ queries — single source of truth for data fetching.
 * Each query is wrapped in React cache() for request-level deduplication.
 */

export interface PropertyData {
  _id: string;
  name: string;
  slug: string | { current: string };
  location: string | { address?: string; nearestTown?: string };
  heroImage?: { alt?: string; asset: { _ref: string } };
  headline?: string;
  sleeps?: number;
  bedrooms?: number;
  bathrooms?: number;
  petFriendly?: boolean;
  kitchenDining?: string[];
  livingAreas?: string[];
  outdoorFeatures?: string[];
  totalReviewCount?: number;
  reviewScore?: number;
  nearestDistillery?: string;
  reviewHighlights?: Array<{ quote: string; source: string; rating?: number }>;
}

/** All properties — used by homepage, guide spokes, accommodation hub, about page.
 *  Fixed order: Portbahn House, Shorefield Eco House, Curlew Cottage. */
const PROPERTY_ORDER = ['portbahn-house', 'shorefield-eco-house', 'curlew-cottage'];

export const getProperties = cache(async (): Promise<PropertyData[]> => {
  const props: PropertyData[] = await client.fetch(`*[_type == "property" && !(_id in path("drafts.**"))] {
    _id, name, slug, location, heroImage, headline,
    sleeps, bedrooms, bathrooms, petFriendly,
    kitchenDining, livingAreas, outdoorFeatures,
    totalReviewCount,
    "reviewScore": reviewScores.airbnbScore,
    "nearestDistillery": nearbyAttractions[0],
    reviewHighlights[]{ quote, source, rating }
  }`);
  // Sort by fixed order
  return props.sort((a, b) => {
    const slugA = typeof a.slug === 'string' ? a.slug : a.slug?.current || '';
    const slugB = typeof b.slug === 'string' ? b.slug : b.slug?.current || '';
    return (PROPERTY_ORDER.indexOf(slugA) === -1 ? 99 : PROPERTY_ORDER.indexOf(slugA))
         - (PROPERTY_ORDER.indexOf(slugB) === -1 ? 99 : PROPERTY_ORDER.indexOf(slugB));
  });
});
