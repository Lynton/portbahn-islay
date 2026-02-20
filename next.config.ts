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
    ];
  },
};

export default nextConfig;
