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
    ];
  },
};

export default nextConfig;
