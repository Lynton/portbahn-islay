import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// Use production domain when set; fall back to Vercel preview URL.
// Note: sitemap is only linked from robots.txt on production, so preview
// deployments will serve this but it won't be submitted to search engines.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahn-islay.vercel.app';

// Travel spokes belong under /islay-travel/ — kept separate from /explore-islay/ cluster
const TRAVEL_SLUGS = [
  'ferry-to-islay',
  'flights-to-islay',
  'planning-your-trip',
  'travelling-without-a-car',
  'travelling-to-islay-with-your-dog',
  'arriving-on-islay',
  'getting-around-islay',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all properties from Sanity
  const propertiesQuery = `*[_type == "property" && defined(slug.current)]{
    slug,
    _updatedAt
  }`;

  // Fetch explore guide pages — excludes travel pages
  const guidePagesQuery = `*[_type == "guidePage" && defined(slug.current) && !(slug.current in $travelSlugs) && !(_id in path("drafts.**"))]{
    slug,
    _updatedAt
  }`;

  // Fetch travel spoke pages for /islay-travel/ hub
  const travelPagesQuery = `*[_type == "guidePage" && slug.current in $travelSlugs && !(_id in path("drafts.**"))]{
    slug,
    _updatedAt
  }`;

  const [properties, guidePages, travelPages] = await Promise.all([
    client.fetch(propertiesQuery),
    client.fetch(guidePagesQuery, { travelSlugs: TRAVEL_SLUGS }),
    client.fetch(travelPagesQuery, { travelSlugs: TRAVEL_SLUGS }),
  ]);

  // Static hub pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/accommodation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/islay-travel`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/explore-islay`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/availability`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Dynamic property pages
  const propertyPages: MetadataRoute.Sitemap = properties.map(
    (property: { slug: { current: string }; _updatedAt?: string }) => ({
      url: `${baseUrl}/accommodation/${property.slug.current}`,
      lastModified: property._updatedAt ? new Date(property._updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })
  );

  // Explore Islay spoke pages
  const guidePageEntries: MetadataRoute.Sitemap = guidePages.map(
    (guide: { slug: { current: string }; _updatedAt?: string }) => ({
      url: `${baseUrl}/explore-islay/${guide.slug.current}`,
      lastModified: guide._updatedAt ? new Date(guide._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })
  );

  // Travel to Islay spoke pages
  const travelPageEntries: MetadataRoute.Sitemap = travelPages.map(
    (guide: { slug: { current: string }; _updatedAt?: string }) => ({
      url: `${baseUrl}/islay-travel/${guide.slug.current}`,
      lastModified: guide._updatedAt ? new Date(guide._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...propertyPages, ...guidePageEntries, ...travelPageEntries];
}
