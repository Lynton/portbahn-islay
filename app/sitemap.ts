import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// Use production domain when set; fall back to Vercel preview URL.
// Note: sitemap is only linked from robots.txt on production, so preview
// deployments will serve this but it won't be submitted to search engines.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahn-islay.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all properties from Sanity
  const propertiesQuery = `*[_type == "property" && defined(slug.current)]{
    slug,
    _updatedAt
  }`;

  // Fetch all published guide pages from Sanity
  const guidePagesQuery = `*[_type == "guidePage" && defined(slug.current) && !(_id in path("drafts.**"))]{
    slug,
    _updatedAt
  }`;

  const [properties, guidePages] = await Promise.all([
    client.fetch(propertiesQuery),
    client.fetch(guidePagesQuery),
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

  // Dynamic guide pages (spokes in hub-and-spoke architecture)
  const guidePageEntries: MetadataRoute.Sitemap = guidePages.map(
    (guide: { slug: { current: string }; _updatedAt?: string }) => ({
      url: `${baseUrl}/explore-islay/${guide.slug.current}`,
      lastModified: guide._updatedAt ? new Date(guide._updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...propertyPages, ...guidePageEntries];
}

