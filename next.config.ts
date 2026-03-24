import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      // Legacy /properties/[slug] → canonical /accommodation/[slug]
      {
        source: '/properties/:slug',
        destination: '/accommodation/:slug',
        permanent: true,
      },
      // Short-form /accommodation/shorefield → canonical full name
      {
        source: '/accommodation/shorefield',
        destination: '/accommodation/shorefield-eco-house',
        permanent: true,
      },
      // Legacy /guides/[slug] → canonical /explore-islay/[slug]
      {
        source: '/guides/islay-beaches',
        destination: '/explore-islay/islay-beaches',
        permanent: true,
      },
      {
        source: '/guides/islay-distilleries',
        destination: '/explore-islay/islay-distilleries',
        permanent: true,
      },
      {
        source: '/guides/islay-wildlife',
        destination: '/explore-islay/islay-wildlife',
        permanent: true,
      },
      {
        source: '/guides/food-and-drink',
        destination: '/explore-islay/food-and-drink',
        permanent: true,
      },
      {
        source: '/guides/family-holidays',
        destination: '/explore-islay/family-holidays',
        permanent: true,
      },
      {
        source: '/guides/walking',
        destination: '/explore-islay/walking',
        permanent: true,
      },
      {
        source: '/guides/visit-jura',
        destination: '/explore-islay/visit-jura',
        permanent: true,
      },
      // Wildcard catch-all for any other /guides/ paths
      {
        source: '/guides/:slug',
        destination: '/explore-islay/:slug',
        permanent: true,
      },
      // Dog travel spoke merged into explore-islay/dog-friendly-islay
      {
        source: '/islay-travel/travelling-to-islay-with-your-dog',
        destination: '/explore-islay/dog-friendly-islay',
        permanent: true,
      },
      // Legacy /getting-here → canonical /islay-travel
      {
        source: '/getting-here',
        destination: '/islay-travel',
        permanent: true,
      },
      // Legacy /travel-to-islay → canonical /islay-travel
      {
        source: '/travel-to-islay',
        destination: '/islay-travel',
        permanent: true,
      },
      // Travel sub-pages: move from /explore-islay/ → /islay-travel/
      {
        source: '/explore-islay/ferry-to-islay',
        destination: '/islay-travel/ferry-to-islay',
        permanent: true,
      },
      {
        source: '/explore-islay/flights-to-islay',
        destination: '/islay-travel/flights-to-islay',
        permanent: true,
      },
      {
        source: '/explore-islay/planning-your-trip',
        destination: '/islay-travel/planning-your-trip',
        permanent: true,
      },
      // ── Lodgify legacy URLs (current live site portbahnislay.co.uk) ──
      // These ensure SEO equity transfers when switching from Lodgify to Next.js
      {
        source: '/en/2473312/all-properties',
        destination: '/accommodation',
        permanent: true,
      },
      {
        source: '/en/2473314/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/en/2473378/portbahn-islay',
        destination: '/accommodation/portbahn-house',
        permanent: true,
      },
      {
        source: '/en/2473399/shorefield-islay',
        destination: '/accommodation/shorefield-eco-house',
        permanent: true,
      },
      {
        source: '/en/2474022/islay',
        destination: '/explore-islay',
        permanent: true,
      },
      {
        source: '/en/2474023/bothanjuraretreat',
        destination: '/explore-islay/visit-jura',
        permanent: true,
      },
      {
        source: '/en/2487599/bruichladdich',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/2487600/faq-islay',
        destination: '/islay-travel/planning-your-trip',
        permanent: true,
      },
      {
        source: '/en/3895376/travel',
        destination: '/islay-travel',
        permanent: true,
      },
      {
        source: '/en/5132129/curlew-cottage-islay',
        destination: '/accommodation/curlew-cottage',
        permanent: true,
      },
      // Catch-all for any other /en/ Lodgify paths
      {
        source: '/en/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
