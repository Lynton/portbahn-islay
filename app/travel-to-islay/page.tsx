import { cache } from 'react';
import { Metadata } from 'next';
import HubPage from '@/app/_components/HubPage';
import { client } from '@/sanity/lib/client';

export const revalidate = 60;

const getTravelToIslayPage = cache(async () => {
  const query = `*[_type == "gettingHerePage" && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    scopeIntro,
    heroImage,
    seoTitle,
    seoDescription
  }`;

  return await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });
});

const getTravelGuidePages = cache(async () => {
  const query = `*[_type == "guidePage" && slug.current in ["ferry-to-islay", "flights-to-islay", "planning-your-trip"] && !(_id in path("drafts.**"))] | order(title asc) {
    _id,
    title,
    slug,
    introduction,
    heroImage
  }`;

  return await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });
});

export async function generateMetadata(): Promise<Metadata> {
  const page = await getTravelToIslayPage();

  return {
    title: page?.seoTitle || page?.title || 'Travel to Islay | Ferry & Flight Guide | Portbahn Islay',
    description: page?.seoDescription || 'Complete guide to reaching the Isle of Islay by CalMac ferry or Loganair flight.',
  };
}

export default async function TravelToIslayPage() {
  const [page, travelGuides] = await Promise.all([
    getTravelToIslayPage(),
    getTravelGuidePages(),
  ]);

  const config = {
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Travel to Islay' },
    ],
    introText: page?.scopeIntro || 'Travel to Islay is not straightforward - you don\'t come to the Scottish islands if you want easy. This guide covers all your travel options for reaching Islay by ferry or flight. Whether you choose the scenic CalMac ferry crossing or a quick Loganair flight from Glasgow, we\'re here to help make your journey smooth.',
    sectionHeading: 'Our guide on getting to and from Islay',
    cardLinkPrefix: '/guides/',
    emptyStateMessage: 'Travel guide pages coming soon.',
    backLink: {
      href: '/',
      label: 'Back to Our Properties',
    },
    schemaType: 'CollectionPage' as const,
    schemaData: {
      name: 'Ways to Reach Islay',
      description: page?.seoDescription || 'Complete guide to travel options for reaching the Isle of Islay by CalMac ferry, Loganair flight, car, and bus.',
      url: '/travel-to-islay',
      about: {
        '@type': 'Trip',
        name: 'Travel to Isle of Islay',
      },
    },
  };

  return <HubPage page={page} cards={travelGuides} config={config} />;
}
