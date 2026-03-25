import { cache } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import SchemaMarkup from '@/components/SchemaMarkup';
import PropertyCardGrid from '@/components/PropertyCardGrid';
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

  const introText = page?.scopeIntro || 'We offer three unique self-catering holiday properties in Bruichladdich. Portbahn House is our family home. Shorefield is the Jacksons\' creation - they built it, planted every tree, created the bird hides. Curlew Cottage is Alan\'s family retreat. These aren\'t purpose-built rentals - they\'re real family homes with personality.';

  return (
    <>
      <SchemaMarkup
        type={['CollectionPage', 'BreadcrumbList']}
        data={{
          name: 'Self-Catering Family Holiday Homes in Bruichladdich',
          description: page?.seoDescription || 'Three unique self-catering holiday properties in Bruichladdich, Islay.',
          url: '/accommodation',
          hasPart: properties.map((p: any) => ({
            type: 'Accommodation',
            url: `/accommodation/${typeof p.slug === 'string' ? p.slug : p.slug?.current}`,
            name: p.name,
          })),
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Accommodation', url: '/accommodation' },
        ]}
      />

      <main className="min-h-screen bg-sea-spray">
        {/* Hero */}
        {page?.heroImage && (
          <div className="w-full relative overflow-hidden" style={{ height: '55vh', minHeight: '380px', maxHeight: '540px' }}>
            <Image src={urlFor(page.heroImage).width(1600).height(640).url()} alt={page.heroImage.alt || 'Portbahn Islay'} fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,58,74,0.10) 0%, rgba(15,58,74,0.50) 100%)' }} />
          </div>
        )}

        {/* Caption bar */}
        <div className="c1b-caption-bar" style={{ padding: '18px 48px' }}>
          <nav className="typo-nav">
            <Link href="/" className="no-underline">Home</Link> · <span style={{ color: 'rgba(255,254,250,0.9)' }}>Accommodation</span>
          </nav>
          <span className="typo-caption" style={{ color: 'rgba(255,254,250,0.5)' }}>Isle of Islay, Scotland</span>
        </div>

        {/* Title frame */}
        <section className="bg-machair-sand" style={{ padding: '64px 48px 60px' }}>
          <div className="max-w-[860px]">
            <p className="typo-kicker mb-4">Portbahn Islay</p>
            <h1 className="typo-h1 mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.02 }}>
              {page?.title || 'Accommodation'}
            </h1>
            {introText.split('\n\n').filter(Boolean).map((para: string, i: number) => (
              <p key={i} className="typo-body opacity-75 max-w-[680px] mb-4">{para}</p>
            ))}
            <p className="font-mono text-sm text-kelp-edge tracking-wide mt-6 opacity-80">
              3 properties in Bruichladdich · Sleeps 6–8 · Dogs welcome at 2 properties
            </p>
          </div>
        </section>

        {/* Property cards — full enriched cards with BJR */}
        <div className="max-w-[1280px] mx-auto" style={{ padding: '60px 48px 80px' }}>
          <div className="mb-8">
            <p className="typo-kicker mb-2.5">Our Properties</p>
            <h2 className="typo-h2" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}>Self-Catering Family Holiday Homes</h2>
          </div>

          <PropertyCardGrid properties={properties} showHighlights showBjrCard />

          <div className="pt-8 mt-14 border-t border-washed-timber flex flex-wrap gap-6">
            <Link href="/" className="hover-link font-mono text-md tracking-wide text-kelp-edge">
              ← Portbahn Islay homepage
            </Link>
            <Link href="/explore-islay" className="hover-link font-mono text-md tracking-wide text-kelp-edge">
              Explore things to do on Islay →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
