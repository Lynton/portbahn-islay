import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import BlockRenderer from '@/components/BlockRenderer';
import SchemaMarkup from '@/components/SchemaMarkup';
import type { SchemaType } from '@/lib/schema-markup';
import EntityCard from '@/components/EntityCard';
import GuideMap from '@/components/GuideMap';
import { portableTextComponents } from '@/lib/portable-text';

export const revalidate = 60;

// Stock photo fallbacks (Unsplash CC) — replace with Sanity hero images when available
const TRAVEL_IMAGES: Record<string, string> = {
  'ferry-to-islay':                    'https://images.unsplash.com/photo-1464621922360-27f3bf0eca75?w=1600&h=640&fit=crop&auto=format',
  'flights-to-islay':                  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=640&fit=crop&auto=format',
  'planning-your-trip':                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=640&fit=crop&auto=format',
  'travelling-without-a-car':          'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&h=640&fit=crop&auto=format',
  'travelling-to-islay-with-your-dog': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&h=640&fit=crop&auto=format',
  'arriving-on-islay':                 'https://images.unsplash.com/photo-1465321756780-2e5c7fc42fae?w=1600&h=640&fit=crop&auto=format',
  'getting-around-islay':              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=640&fit=crop&auto=format&sat=-20',
};

const TRAVEL_SLUGS = [
  'ferry-to-islay',
  'flights-to-islay',
  'planning-your-trip',
  'travelling-without-a-car',
  'travelling-to-islay-with-your-dog',
  'arriving-on-islay',
  'getting-around-islay',
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

type PTBlock = { _type: string; children?: Array<{ text?: string }> };

interface FaqItem {
  _id: string;
  question: string;
  answer: PTBlock[];
}

const getTravelGuidePage = cache(async (slug: string) => {
  const query = `*[_type == "guidePage" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    slug,
    heroImage,
    introduction,
    schemaType,
    "contentBlocks": contentBlocks[defined(block._ref)]{
      _key,
      version,
      showKeyFacts,
      customHeading,
      block->{
        _id,
        blockId,
        title,
        entityType,
        canonicalHome,
        fullContent,
        teaserContent,
        keyFacts
      }
    }[defined(block._id)],
    extendedEditorial,
    "featuredEntities": featuredEntities[defined(@->_id)]->{
      _id,
      entityId,
      name,
      category,
      schemaOrgType,
      island,
      status,
      shortDescription,
      editorialNote,
      importantNote,
      canonicalExternalUrl,
      ecosystemSite,
      location,
      contact,
      openingHours,
      attributes,
      tags
    },
    "faqBlocks": faqBlocks[defined(@->_id)]->{_id, question, answer},
    seoTitle,
    seoDescription
  }`;

  return await client.fetch(query, { slug }, {
    cache: 'no-store',
  });
});

export async function generateStaticParams() {
  return TRAVEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getTravelGuidePage(slug);

  if (!page) {
    return { title: 'Guide Not Found | Portbahn Islay' };
  }

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.co.uk'}/islay-travel/${slug}`;

  return {
    title: page.seoTitle || `${page.title} | Portbahn Islay`,
    description: page.seoDescription || `Discover ${page.title} — travel guide for the Isle of Islay.`,
    alternates: { canonical: canonicalUrl },
  };
}

export default async function TravelSubPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getTravelGuidePage(slug);

  if (!page) {
    notFound();
  }

  const schemaType = page.schemaType || 'Article';

  const faqsForSchema = ((page.faqBlocks ?? []) as (FaqItem | null)[])
    .filter((faq): faq is FaqItem => !!faq?.question)
    .map((faq) => ({
      question: faq.question,
      answerText: faq.answer
        .filter((b) => b._type === 'block')
        .map((b) => (b.children ?? []).map((c) => c.text ?? '').join(''))
        .join(' '),
    }));

  const schemaData = {
    name: page.title,
    description: page.seoDescription || page.introduction || `Travel guide: ${page.title} — Isle of Islay.`,
    url: `/islay-travel/${slug}`,
    slug: { current: slug },
    title: page.title,
    seoDescription: page.seoDescription,
    heroImage: page.heroImage,
    faqBlocks: faqsForSchema,
  };

  const schemaTypes: SchemaType[] = [schemaType as SchemaType, 'TouristAttraction', 'BreadcrumbList'];
  if (faqsForSchema.length > 0) schemaTypes.push('FAQPage');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entities: any[] = page.featuredEntities ?? [];

  const travelLabels: Record<string, string> = {
    'ferry-to-islay': 'Ferry to Islay',
    'flights-to-islay': 'Flights to Islay',
    'planning-your-trip': 'Planning Your Trip',
    'travelling-without-a-car': 'Travelling Without a Car',
    'travelling-to-islay-with-your-dog': 'Travelling With Your Dog',
    'arriving-on-islay': 'Arriving on Islay',
    'getting-around-islay': 'Getting Around Islay',
  };

  return (
    <>
      <SchemaMarkup
        type={schemaTypes}
        data={schemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Travel to Islay', url: '/islay-travel' },
          { name: page.title, url: `/islay-travel/${slug}` },
        ]}
      />
      <main className="min-h-screen bg-sea-spray">

        {/* ── HERO — Sanity image or stock fallback ───────────────── */}
        {(page.heroImage || TRAVEL_IMAGES[slug]) && (
          <div className="w-full relative overflow-hidden" style={{ height: '50vh', maxHeight: '520px' }}>
            {page.heroImage ? (
              <Image
                src={urlFor(page.heroImage).width(1600).height(640).url()}
                alt={page.heroImage.alt || page.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={TRAVEL_IMAGES[slug]}
                alt={page.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(15,58,74,0.10) 0%, rgba(15,58,74,0.55) 100%)',
            }} />
          </div>
        )}

        {/* ── TEAL CAPTION BAR ────────────────────────────────────── */}
        <div style={{
          background: 'var(--color-sound-of-islay)',
          padding: '18px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <nav style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,254,250,0.65)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            {' · '}
            <Link href="/islay-travel" style={{ color: 'inherit', textDecoration: 'none' }}>Travel to Islay</Link>
            {' · '}
            <span style={{ color: 'rgba(255,254,250,0.9)' }}>{page.title}</span>
          </nav>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,254,250,0.5)' }}>
            Isle of Islay, Scotland
          </span>
        </div>

        {/* ── SAND TITLE FRAME ────────────────────────────────────── */}
        <section style={{ background: 'var(--color-machair-sand)', padding: '64px 48px 60px' }}>
          <div style={{ maxWidth: '860px' }}>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '9px',
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'var(--color-kelp-edge)',
              marginBottom: '16px',
            }}>
              Travel to Islay
            </p>
            <h1 style={{
              fontFamily: '"The Seasons", Georgia, serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--color-harbour-stone)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}>
              {page.title}
            </h1>
            {page.introduction && (
              <p style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '15px',
                color: 'var(--color-harbour-stone)',
                opacity: 0.75,
                lineHeight: 1.7,
                maxWidth: '680px',
              }}>
                {page.introduction}
              </p>
            )}
          </div>
        </section>

        {/* ── GUIDE CONTENT ───────────────────────────────────────── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 48px 80px' }}>

          {/* Main content + sidebar two-column */}
          <div className="guide-grid">
            {/* Main content column */}
            <div style={{ minWidth: 0 }}>

              {/* Content Blocks */}
              {page.contentBlocks && page.contentBlocks.length > 0 && (
                <div style={{ marginBottom: '52px' }}>
                  <BlockRenderer blocks={page.contentBlocks} />
                </div>
              )}

              {/* Extended Editorial */}
              {page.extendedEditorial && page.extendedEditorial.length > 0 && (
                <div style={{ marginBottom: '52px' }}>
                  <PortableText value={page.extendedEditorial} components={portableTextComponents} />
                </div>
              )}

              {/* Entity Cards + Map */}
              {entities.length > 0 && (
                <div style={{ marginBottom: '52px' }}>
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '10px' }}>
                    Featured
                  </p>
                  <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--color-harbour-stone)', lineHeight: 1.1, marginBottom: '24px' }}>
                    Essential Listings
                  </h2>
                  <GuideMap entities={entities} pageTitle={page.title} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
                    {entities.map((entity) => (
                      <EntityCard key={entity._id} entity={entity} />
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Blocks */}
              {page.faqBlocks && page.faqBlocks.length > 0 && (
                <section style={{ paddingTop: '44px', borderTop: '1px solid var(--color-washed-timber)' }}>
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '10px' }}>
                    Common questions
                  </p>
                  <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--color-harbour-stone)', lineHeight: 1.1, marginBottom: '32px' }}>
                    Frequently Asked
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {page.faqBlocks.filter((faq: FaqItem) => faq && faq.question).map((faq: FaqItem) => (
                      <div key={faq._id} style={{ borderLeft: '3px solid var(--color-kelp-edge)', paddingLeft: '20px' }}>
                        <h3 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-harbour-stone)', marginBottom: '8px', lineHeight: 1.2 }}>
                          {faq.question}
                        </h3>
                        <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', opacity: 0.8, lineHeight: 1.65 }}>
                          <PortableText value={faq.answer} components={portableTextComponents} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* Right sidebar — stay links + related travel guides */}
            <aside className="hidden md:block">
              <div style={{ position: 'sticky', top: '80px' }}>

                {/* Stay on Islay */}
                <div style={{
                  border: '1px solid var(--color-washed-timber)',
                  borderTop: '3px solid var(--color-kelp-edge)',
                  padding: '20px',
                  marginBottom: '20px',
                  background: 'var(--color-machair-sand)',
                }}>
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '14px' }}>
                    Stay on Islay
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { href: '/accommodation/portbahn-house', name: 'Portbahn House', detail: 'Sleeps 8 · dogs welcome' },
                      { href: '/accommodation/shorefield-eco-house', name: 'Shorefield Eco House', detail: 'Sleeps 6 · bird hides' },
                      { href: '/accommodation/curlew-cottage', name: 'Curlew Cottage', detail: 'Sleeps 6 · walled garden' },
                    ].map(({ href, name, detail }) => (
                      <li key={href} style={{ listStyle: 'none' }}>
                        <Link href={href} style={{ textDecoration: 'none' }}>
                          <span style={{ display: 'block', fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-harbour-stone)', marginBottom: '2px' }}>
                            {name}
                          </span>
                          <span style={{ display: 'block', fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: 'var(--color-harbour-stone)', opacity: 0.55 }}>
                            {detail}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/availability" style={{
                    display: 'block',
                    marginTop: '16px',
                    background: 'var(--color-emerald-accent)',
                    color: '#fff',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '9.5px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '11px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}>
                    Check Availability
                  </Link>
                </div>

                {/* Related travel guides */}
                <div style={{ border: '1px solid var(--color-washed-timber)', padding: '20px', background: 'var(--color-machair-sand)' }}>
                  <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '14px' }}>
                    More travel information
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {TRAVEL_SLUGS
                      .filter((s) => s !== slug)
                      .map((s) => (
                        <li key={s} style={{ listStyle: 'none' }}>
                          <Link href={`/islay-travel/${s}`}
                            className="hover-dim"
                            style={{
                              fontFamily: '"IBM Plex Mono", monospace',
                              fontSize: '11px',
                              color: 'var(--color-harbour-stone)',
                              textDecoration: 'none',
                              display: 'block',
                            }}>
                            {travelLabels[s] || s} →
                          </Link>
                        </li>
                      ))}
                    <li style={{ listStyle: 'none', paddingTop: '6px', borderTop: '1px solid var(--color-washed-timber)' }}>
                      <Link href="/islay-travel" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--color-kelp-edge)', textDecoration: 'none' }}>
                        ← Travel to Islay
                      </Link>
                    </li>
                  </ul>
                </div>

              </div>
            </aside>

          </div>

          {/* Mobile: Stay on Islay + related travel (shown below content on mobile) */}
          <div className="md:hidden" style={{ marginTop: '52px', paddingTop: '44px', borderTop: '1px solid var(--color-washed-timber)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '12px' }}>
                Stay on Islay
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/accommodation/portbahn-house', text: 'Portbahn House — sleeps 8, dogs welcome' },
                  { href: '/accommodation/shorefield-eco-house', text: 'Shorefield Eco House — sleeps 6' },
                  { href: '/accommodation/curlew-cottage', text: 'Curlew Cottage — sleeps 6, walled garden' },
                ].map(({ href, text }) => (
                  <li key={href} style={{ listStyle: 'none' }}>
                    <Link href={href} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-kelp-edge)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Link href="/islay-travel" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-kelp-edge)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                ← Travel to Islay
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
