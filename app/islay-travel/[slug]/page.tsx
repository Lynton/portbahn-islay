import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import GuideSpokeLayout, { type GuideSpokeConfig } from '@/app/_components/GuideSpokeLayout';

export const revalidate = 60;

const FALLBACK_IMAGES: Record<string, string> = {
  'ferry-to-islay':                    'https://images.unsplash.com/photo-1464621922360-27f3bf0eca75?w=1600&h=640&fit=crop&auto=format',
  'flights-to-islay':                  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=640&fit=crop&auto=format',
  'planning-your-trip':                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=640&fit=crop&auto=format',
  'travelling-without-a-car':          'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&h=640&fit=crop&auto=format',
  'travelling-to-islay-with-your-dog': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&h=640&fit=crop&auto=format',
  'arriving-on-islay':                 'https://images.unsplash.com/photo-1465321756780-2e5c7fc42fae?w=1600&h=640&fit=crop&auto=format',
  'getting-around-islay':              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=640&fit=crop&auto=format&sat=-20',
};

const TRAVEL_SLUGS = [
  'ferry-to-islay', 'flights-to-islay', 'planning-your-trip',
  'travelling-without-a-car', 'travelling-to-islay-with-your-dog',
  'arriving-on-islay', 'getting-around-islay',
];

const TRAVEL_LABELS: Record<string, string> = {
  'ferry-to-islay': 'Ferry to Islay', 'flights-to-islay': 'Flights to Islay',
  'planning-your-trip': 'Planning Your Trip', 'travelling-without-a-car': 'Travelling Without a Car',
  'travelling-to-islay-with-your-dog': 'Travelling With Your Dog',
  'arriving-on-islay': 'Arriving on Islay', 'getting-around-islay': 'Getting Around Islay',
};

const CONFIG: GuideSpokeConfig = {
  hubLabel: 'Travel to Islay',
  hubPath: '/islay-travel',
  urlPrefix: '/islay-travel/',
  fallbackImages: FALLBACK_IMAGES,
  relatedGuides: TRAVEL_SLUGS.map((s) => ({ slug: s, title: TRAVEL_LABELS[s] || s })),
};

interface PageProps { params: Promise<{ slug: string }>; }

const getTravelGuidePage = cache(async (slug: string) => {
  const query = `*[_type == "guidePage" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id, title, slug, heroImage, introduction, pullQuote, galleryImages, schemaType,
    "contentBlocks": contentBlocks[defined(block._ref)]{
      _key, version, showKeyFacts, customHeading,
      block->{ _id, blockId, title, entityType, canonicalHome, fullContent, teaserContent, keyFacts }
    }[defined(block._id)],
    extendedEditorial,
    "featuredEntities": featuredEntities[defined(@->_id)]->{
      _id, entityId, name, category, schemaOrgType, island, status, shortDescription,
      editorialNote, importantNote, canonicalExternalUrl, ecosystemSite,
      location, contact, openingHours, attributes, tags
    },
    "faqBlocks": faqBlocks[defined(@->_id)]->{_id, question, answer},
    seoTitle, seoDescription
  }`;
  return await client.fetch(query, { slug }, { cache: 'no-store' });
});

const getProperties = cache(async () => {
  return await client.fetch(`*[_type == "property"]{
    _id, name, slug, location, heroImage,
    sleeps, bedrooms, bathrooms, petFriendly,
    kitchenDining, livingAreas, outdoorFeatures
  }`);
});

export async function generateStaticParams() { return TRAVEL_SLUGS.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getTravelGuidePage(slug);
  if (!page) return { title: 'Guide Not Found | Portbahn Islay' };
  return {
    title: page.seoTitle || `${page.title} | Portbahn Islay`,
    description: page.seoDescription || `Discover ${page.title} — travel guide for the Isle of Islay.`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.co.uk'}/islay-travel/${slug}` },
  };
}

export default async function TravelSubPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, properties] = await Promise.all([getTravelGuidePage(slug), getProperties()]);
  if (!page) notFound();

  return <GuideSpokeLayout page={page} slug={slug} properties={properties} config={CONFIG} />;
}
