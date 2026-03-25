import { cache } from 'react';
import { Metadata } from 'next';
import HubPage from '@/app/_components/HubPage';
import { client } from '@/sanity/lib/client';
import { getProperties } from '@/lib/queries';

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * Accommodation Hub Page
 *
 * Hub page in hub-and-spoke architecture. Shows teaser cards
 * linking to individual property pages (spokes).
 *
 * Playbook alignment:
 * - Hub pages show teasers, not full content
 * - Each spoke page = one retrievable entity for AI
 * - Clear navigation to detailed content
 */

const BLOCK_FIELDS = `
  block->{
    _id,
    blockId,
    title,
    entityType,
    canonicalHome,
    fullContent,
    teaserContent,
    keyFacts
  },
  version,
  showKeyFacts,
  customHeading
`;

const getAccommodationPage = cache(async () => {
  const query = `*[_type == "accommodationPage" && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    scopeIntro,
    heroImage,
    seoTitle,
    seoDescription,
    contentBlocks[]{
      ${BLOCK_FIELDS}
    }
  }`;

  return await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });
});


export async function generateMetadata(): Promise<Metadata> {
  const page = await getAccommodationPage();

  return {
    title: page?.seoTitle || page?.title || 'Holiday Accommodation on Islay | Portbahn Islay',
    description: page?.seoDescription || 'Three unique holiday properties in Bruichladdich, Islay. From sea view houses to eco cottages.',
  };
}

export default async function AccommodationPage() {
  const [page, properties] = await Promise.all([
    getAccommodationPage(),
    getProperties(),
  ]);

  const config = {
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Accommodation' },
    ],
    introText: page?.scopeIntro || 'We offer three unique self-catering holiday properties in Bruichladdich. Portbahn House is our family home. Shorefield is the Jacksons\' creation - they built it, planted every tree, created the bird hides. Curlew Cottage is Alan\'s family retreat. These aren\'t purpose-built rentals - they\'re real family homes with personality.',
    statsLine: '3 properties in Bruichladdich · Sleeps 6–8 · Dogs welcome at 2 properties',
    sectionHeading: 'Self-Catering Family Holiday Homes in Bruichladdich',
    cardLinkPrefix: '/accommodation/',
    cardLinkSuffix: 'View property →',
    showBjrCard: true,
    cardKickers: {
      'portbahn-house': 'Sleeps 8',
      'shorefield-eco-house': 'Eco House',
      'curlew-cottage': 'Pet-Free',
    },
    emptyStateMessage: 'Properties coming soon.',
    backLink: {
      href: '/',
      label: 'Portbahn Islay homepage',
    },
    crossLink: { href: '/explore-islay', label: 'Explore things to do on Islay' },
    schemaType: 'CollectionPage' as const,
    schemaData: {
      name: 'Self-Catering Family Holiday Homes in Bruichladdich',
      description: page?.seoDescription || 'Three unique self-catering holiday properties in Bruichladdich, Islay - real family homes with personality.',
      url: '/accommodation',
      hasPart: properties.map((p: any) => ({
        type: 'Accommodation',
        url: `/accommodation/${p.slug.current}`,
        name: p.name
      }))
    },
  };

  return <HubPage page={page} cards={properties} config={config} />;
}
