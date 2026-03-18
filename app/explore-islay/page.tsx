import React from 'react';
import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import SchemaMarkup from '@/components/SchemaMarkup';
import BlockRenderer from '@/components/BlockRenderer';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface GuidePage {
  _id: string;
  title: string;
  slug: { current: string };
  introduction?: string;
  heroImage?: {
    alt?: string;
    asset: { _ref: string };
  };
}

interface BlockReferenceData {
  block: {
    _id: string;
    blockId: { current: string };
    title: string;
    entityType: string;
    canonicalHome: string;
    fullContent: any[];
    teaserContent: any[];
    keyFacts?: Array<{ fact: string; value: string }>;
  };
  version: 'full' | 'teaser';
  showKeyFacts?: boolean;
  customHeading?: string;
}

// Revalidate every 60 seconds
export const revalidate = 60;

// Travel slugs excluded from this hub — they belong under /islay-travel/
const TRAVEL_SLUGS = [
  'ferry-to-islay',
  'flights-to-islay',
  'planning-your-trip',
  'travelling-without-a-car',
  'travelling-to-islay-with-your-dog',
  'arriving-on-islay',
  'getting-around-islay',
];

// Hardcoded spoke index — renders unconditionally in server HTML so crawlers
// and AI retrieval systems always have a static path from hub to every spoke,
// independent of Sanity data availability or ISR cache state.
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

/**
 * Explore Islay Hub Page
 *
 * Hub page in hub-and-spoke architecture. Shows teaser cards
 * linking to focused guide pages (spokes).
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

const getExploreIslayPage = cache(async () => {
  const query = `*[_type == "exploreIslayPage" && !(_id in path("drafts.**"))][0]{
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

// Get explore guide pages for the hub — excludes travel pages
const getGuidePages = cache(async () => {
  const query = `*[_type == "guidePage" && !(slug.current in $travelSlugs) && !(_id in path("drafts.**"))] | order(title asc) {
    _id,
    title,
    slug,
    introduction,
    heroImage
  }`;

  return await client.fetch(query, { travelSlugs: TRAVEL_SLUGS }, {
    next: { revalidate: 60 },
  });
});

export async function generateMetadata(): Promise<Metadata> {
  const page = await getExploreIslayPage();

  return {
    title: page?.seoTitle || page?.title || 'Explore Islay | Portbahn Islay',
    description: page?.seoDescription || "A local family's guide to things to do on Islay — whisky distilleries, beaches, wildlife, walking, food and drink, villages, and family holidays on this remarkable Scottish island.",
  };
}

export default async function ExploreIslayPage() {
  const [page, guidePages] = await Promise.all([
    getExploreIslayPage(),
    getGuidePages(),
  ]);

  // Force teaser version on all hub content blocks.
  // Hub pages are signposts — full content belongs exclusively on spoke pages.
  // This prevents semantic cannibalisation of spoke pages by the hub regardless
  // of what version is stored in Sanity, and enforces the hub-and-spoke principle
  // at the architectural level.
  const teaserBlocks: BlockReferenceData[] = (page?.contentBlocks ?? []).map(
    (b: BlockReferenceData) => ({ ...b, version: 'teaser' as const })
  );

  const schemaData = {
    name: 'Explore the Isle of Islay — Things to See and Do',
    description: page?.seoDescription || "A local family's guide to things to do on Islay — whisky distilleries, beaches, wildlife, walking, food and drink, villages, and family holidays.",
    url: '/explore-islay',
    about: {
      '@type': 'Place',
      name: 'Isle of Islay'
    }
  };

  return (
    <>
      <SchemaMarkup
        type={['CollectionPage', 'BreadcrumbList']}
        data={schemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Explore Islay', url: '/explore-islay' },
        ]}
      />
      <main style={{ minHeight: '100vh', background: 'var(--color-sea-spray)' }}>

        {/* ── HERO ────────────────────────────────────────────────── */}
        {page?.heroImage && (
          <div className="w-full relative overflow-hidden" style={{ height: '45vh', maxHeight: '480px' }}>
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || page?.title || 'Explore Islay'}
              fill
              className="object-cover"
              priority
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(15,58,74,0.10) 0%, rgba(15,58,74,0.50) 100%)',
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
            <span style={{ color: 'rgba(255,254,250,0.9)' }}>Explore Islay</span>
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
              Portbahn Islay
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
              {page?.title || 'Explore the Isle of Islay'}
            </h1>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '15px',
              color: 'var(--color-harbour-stone)',
              opacity: 0.75,
              lineHeight: 1.7,
              maxWidth: '680px',
            }}>
              {page?.scopeIntro || "Islay is a 25-mile island off Scotland's west coast with more to explore than most visitors expect. These guides are written by hosts who have lived and worked here — covering whisky distilleries, beaches, walking routes, wildlife, food and drink, villages, family activities, and day trips to neighbouring Jura. Each guide goes deep on its topic. This is the overview."}
            </p>
          </div>
        </section>

        {/* ── PAGE CONTENT ────────────────────────────────────────── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 48px 80px' }}>

          {/* Canonical Content Blocks — teaser only */}
          {teaserBlocks.length > 0 && (
            <div style={{ marginBottom: '64px' }}>
              <BlockRenderer blocks={teaserBlocks} className="mb-0" />
            </div>
          )}

          {/* Guide Cards Grid */}
          {guidePages && guidePages.length > 0 && (
            <>
              <div style={{ marginBottom: '32px' }}>
                <p style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '9px',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--color-kelp-edge)',
                  marginBottom: '10px',
                }}>
                  Explore
                </p>
                <h2 style={{
                  fontFamily: '"The Seasons", Georgia, serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                  color: 'var(--color-harbour-stone)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                }}>
                  A local family&apos;s guide to things to do on Islay
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3px', marginBottom: '64px' }}>
                {guidePages.map((guide: GuidePage) => (
                  <Link
                    key={guide._id}
                    href={`/explore-islay/${guide.slug?.current}`}
                    style={{ display: 'block', textDecoration: 'none' }}
                    className="hover-opacity"
                  >
                    <div style={{ background: 'var(--color-machair-sand)', border: '1px solid var(--color-washed-timber)', overflow: 'hidden' }}>
                      {guide.heroImage && (
                        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                          <Image
                            src={urlFor(guide.heroImage).width(600).height(300).url()}
                            alt={guide.heroImage.alt || guide.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div style={{ padding: '20px 20px 22px' }}>
                        <h2 style={{
                          fontFamily: '"The Seasons", Georgia, serif',
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          color: 'var(--color-harbour-stone)',
                          lineHeight: 1.15,
                          marginBottom: '8px',
                          letterSpacing: '-0.01em',
                        }}>
                          {guide.title}
                        </h2>
                        {guide.introduction && (
                          <p style={{
                            fontFamily: '"IBM Plex Mono", monospace',
                            fontSize: '12px',
                            color: 'var(--color-harbour-stone)',
                            opacity: 0.65,
                            lineHeight: 1.6,
                            marginBottom: '14px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          } as React.CSSProperties}>
                            {guide.introduction}
                          </p>
                        )}
                        <span style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '10px',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--color-kelp-edge)',
                        }}>
                          Read guide →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {(!guidePages || guidePages.length === 0) && (
            <div style={{ paddingTop: '48px', paddingBottom: '48px', textAlign: 'center' }}>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', opacity: 0.6 }}>
                Guide pages coming soon.
              </p>
            </div>
          )}

          {/* Static spoke index — always present in server HTML for crawlers and AI retrieval */}
          <nav aria-label="Islay guides" style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--color-washed-timber)' }}>
            <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', color: 'var(--color-harbour-stone)', marginBottom: '16px' }}>
              All Islay guides
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {EXPLORE_SPOKES.map((spoke) => (
                <li key={spoke.slug} style={{ listStyle: 'none' }}>
                  <Link href={`/explore-islay/${spoke.slug}`} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-kelp-edge)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    {spoke.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--color-washed-timber)' }}>
            <Link href="/" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', letterSpacing: '0.06em', color: 'var(--color-kelp-edge)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              ← Back to Our Properties
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
