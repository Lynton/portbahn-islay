import { cache } from 'react';
import { Metadata } from 'next';
import HubPage from '@/app/_components/HubPage';
import { client } from '@/sanity/lib/client';

export const revalidate = 60;

const FALLBACK_IMAGES: Record<string, string> = {
  'islay-distilleries':   'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=300&fit=crop&auto=format',
  'islay-beaches':        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop&auto=format',
  'islay-wildlife':       'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&h=300&fit=crop&auto=format',
  'food-and-drink':       'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=300&fit=crop&auto=format',
  'walking':              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&auto=format',
  'family-holidays':      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&h=300&fit=crop&auto=format',
  'islay-villages':       'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=300&fit=crop&auto=format',
  'visit-jura':           'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop&auto=format&sat=-40',
  'archaeology-history':  'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&h=300&fit=crop&auto=format',
  'islay-geology':        'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=300&fit=crop&auto=format',
  'dog-friendly-islay':   'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=300&fit=crop&auto=format',
};

const TRAVEL_SLUGS = [
  'ferry-to-islay', 'flights-to-islay', 'planning-your-trip',
  'travelling-without-a-car', 'travelling-to-islay-with-your-dog',
  'arriving-on-islay', 'getting-around-islay',
];

const EXPLORE_SPOKES = [
  { slug: 'islay-distilleries',   title: "Islay's Whisky Distilleries" },
  { slug: 'islay-beaches',        title: 'Beaches of Islay' },
  { slug: 'islay-wildlife',       title: 'Wildlife & Nature on Islay' },
  { slug: 'food-and-drink',       title: 'Food & Drink on Islay' },
  { slug: 'walking',              title: 'Walking on Islay' },
  { slug: 'family-holidays',      title: 'Family Holidays on Islay' },
  { slug: 'islay-villages',       title: 'Islay Villages' },
  { slug: 'visit-jura',           title: 'Visiting Jura from Islay' },
  { slug: 'archaeology-history',  title: 'Archaeology & History' },
  { slug: 'islay-geology',        title: 'Geology' },
  { slug: 'dog-friendly-islay',   title: 'Dog-Friendly Islay' },
];

const getExploreIslayPage = cache(async () => {
  const query = `*[_type == "exploreIslayPage" && !(_id in path("drafts.**"))][0]{
    _id, title, scopeIntro, heroImage, seoTitle, seoDescription
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 60 } });
});

const getGuidePages = cache(async () => {
  const query = `*[_type == "guidePage" && !(slug.current in $travelSlugs) && !(_id in path("drafts.**"))] | order(title asc) {
    _id, title, slug, introduction, heroImage
  }`;
  return await client.fetch(query, { travelSlugs: TRAVEL_SLUGS }, { next: { revalidate: 60 } });
});

export async function generateMetadata(): Promise<Metadata> {
  const page = await getExploreIslayPage();
  return {
    title: page?.seoTitle || page?.title || 'Explore Islay | Portbahn Islay',
    description: page?.seoDescription || "A local family's guide to things to do on Islay — whisky distilleries, beaches, wildlife, walking, food and drink, villages, and family holidays.",
  };
}

export default async function ExploreIslayPage() {
  const [page, guidePages] = await Promise.all([getExploreIslayPage(), getGuidePages()]);

  const config = {
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Explore Islay' },
    ],
    introText: page?.scopeIntro || "Islay is a 25-mile island off Scotland's west coast with more to explore than most visitors expect. These guides are written by hosts who have lived and worked here — covering whisky distilleries, beaches, walking routes, wildlife, food and drink, villages, family activities, and day trips to neighbouring Jura.",
    sectionHeading: "A local family's guide to things to do on Islay",
    cardLinkPrefix: '/explore-islay/',
    emptyStateMessage: 'Guide pages coming soon.',
    backLink: { href: '/accommodation', label: 'Portbahn Islay — self-catering accommodation on Islay' },
    fallbackImages: FALLBACK_IMAGES,
    schemaType: 'CollectionPage' as const,
    schemaData: {
      name: 'Explore the Isle of Islay — Things to See and Do',
      description: page?.seoDescription || "A local family's guide to things to do on Islay.",
      url: '/explore-islay',
      about: { '@type': 'Place', name: 'Isle of Islay' },
    },
  };

  return <HubPage page={page} cards={guidePages} config={config} />;
}
