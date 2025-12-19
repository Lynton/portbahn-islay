import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

// Get the base URL from environment variable or use production domain
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahn-islay.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all properties from Sanity
  const propertiesQuery = `*[_type == "property"]{
    slug,
    _updatedAt
  }`;
  
  const properties = await client.fetch(propertiesQuery);

  // Static pages - ONLY include pages that actually exist
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Dynamic property pages
  const propertyPages: MetadataRoute.Sitemap = properties.map((property: any) => ({
    url: `${baseUrl}/accommodation/${property.slug?.current || property.slug}`,
    lastModified: property._updatedAt ? new Date(property._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // TODO: Add guide pages when they're implemented
  // const guidesQuery = `*[_type == "beach" || _type == "walk" || _type == "distillery" || _type == "village"]{
  //   slug,
  //   _updatedAt
  // }`;
  // const guides = await client.fetch(guidesQuery);
  // const guidePages: MetadataRoute.Sitemap = guides.map((guide: any) => ({
  //   url: `${baseUrl}/islay-guides/${guide.slug?.current || guide.slug}`,
  //   lastModified: guide._updatedAt ? new Date(guide._updatedAt) : new Date(),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }));

  return [...staticPages, ...propertyPages];
}

