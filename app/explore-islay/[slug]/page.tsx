import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import GuideSpokeLayout, { type GuideSpokeConfig } from '@/app/_components/GuideSpokeLayout';

export const revalidate = 60;

const FALLBACK_IMAGES: Record<string, string> = {
  'islay-distilleries':   'https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?w=1600&h=640&fit=crop&auto=format',
  'islay-beaches':        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=640&fit=crop&auto=format',
  'islay-wildlife':       'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=1600&h=640&fit=crop&auto=format',
  'food-and-drink':       'https://images.unsplash.com/photo-1476224203421-9ac39bcb3df1?w=1600&h=640&fit=crop&auto=format',
  'walking':              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=640&fit=crop&auto=format',
  'family-holidays':      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1600&h=640&fit=crop&auto=format',
  'islay-villages':       'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&h=640&fit=crop&auto=format',
  'visit-jura':           'https://images.unsplash.com/photo-1465321756780-2e5c7fc42fae?w=1600&h=640&fit=crop&auto=format',
  'archaeology-history':  'https://images.unsplash.com/photo-1565436454699-b0cbcdf9c99a?w=1600&h=640&fit=crop&auto=format',
  'islay-geology':        'https://images.unsplash.com/photo-1519710164239-da838a7e055b?w=1600&h=640&fit=crop&auto=format',
  'dog-friendly-islay':   'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&h=640&fit=crop&auto=format',
};

const TRAVEL_SLUGS = [
  'ferry-to-islay', 'flights-to-islay', 'planning-your-trip',
  'travelling-without-a-car', 'travelling-to-islay-with-your-dog',
  'arriving-on-islay', 'getting-around-islay',
];

const RELATED_GUIDES = [
  { slug: 'islay-distilleries', title: 'Whisky Distilleries' },
  { slug: 'islay-beaches', title: 'Beaches of Islay' },
  { slug: 'islay-wildlife', title: 'Wildlife & Nature' },
  { slug: 'food-and-drink', title: 'Food & Drink' },
  { slug: 'walking', title: 'Walking on Islay' },
  { slug: 'visit-jura', title: 'Visiting Jura' },
  { slug: 'family-holidays', title: 'Family Holidays' },
  { slug: 'islay-villages', title: 'Villages of Islay' },
];

const CONFIG: GuideSpokeConfig = {
  hubLabel: 'Explore Islay',
  hubPath: '/explore-islay',
  urlPrefix: '/explore-islay/',
  fallbackImages: FALLBACK_IMAGES,
  relatedGuides: RELATED_GUIDES,
};

interface PageProps { params: Promise<{ slug: string }>; }

const getGuidePage = cache(async (slug: string) => {
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

export async function generateStaticParams() {
  const query = `*[_type == "guidePage" && defined(slug.current) && !(slug.current in $travelSlugs)]{ "slug": slug.current }`;
  const pages = await client.fetch(query, { travelSlugs: TRAVEL_SLUGS });
  return pages.map((page: { slug: string }) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (TRAVEL_SLUGS.includes(slug)) notFound();
  const page = await getGuidePage(slug);
  if (!page) return { title: 'Guide Not Found | Portbahn Islay' };
  return {
    title: page.seoTitle || `${page.title} | Portbahn Islay`,
    description: page.seoDescription || `Discover ${page.title} on the Isle of Islay.`,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.co.uk'}/explore-islay/${slug}` },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  if (TRAVEL_SLUGS.includes(slug)) notFound();
  const [page, properties] = await Promise.all([getGuidePage(slug), getProperties()]);
  if (!page) notFound();

  return <GuideSpokeLayout page={page} slug={slug} properties={properties} config={CONFIG} />;
}
