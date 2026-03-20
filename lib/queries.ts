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
  reviewHighlights?: Array<{ quote: string; source: string; rating?: number }>;
}

/** All properties — used by homepage, guide spokes, accommodation hub, about page */
export const getProperties = cache(async (): Promise<PropertyData[]> => {
  return await client.fetch(`*[_type == "property" && !(_id in path("drafts.**"))] | order(name asc) {
    _id, name, slug, location, heroImage, headline,
    sleeps, bedrooms, bathrooms, petFriendly,
    kitchenDining, livingAreas, outdoorFeatures,
    totalReviewCount, reviewHighlights[]{ quote, source, rating }
  }`);
});
