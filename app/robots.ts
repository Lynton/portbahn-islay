import { MetadataRoute } from 'next';

// Block all crawlers on non-production environments to avoid competing with
// the live site at portbahnislay.co.uk.
// When going live: set NEXT_PUBLIC_SITE_URL=https://portbahnislay.co.uk in
// Vercel env vars (Production environment only).
const isProduction =
  process.env.NEXT_PUBLIC_SITE_URL === 'https://portbahnislay.co.uk' &&
  process.env.VERCEL_ENV === 'production';

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/api/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
