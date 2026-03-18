import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';

interface Property {
  _id: string;
  name: string;
  slug: { current: string } | string;
  location?: string | { address?: string; nearestTown?: string };
  overview?: Array<{ _type: string; children?: Array<{ text?: string }> }>;
  sleeps?: number;
  bedrooms?: number;
  heroImage?: { alt?: string; asset: { _ref: string } };
}
import PropertyCard from '@/components/PropertyCard';
import SchemaMarkup from '@/components/SchemaMarkup';
import MultiPropertyMap from '@/components/MultiPropertyMap';
import BlockRenderer from '@/components/BlockRenderer';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { portableTextComponents } from '@/lib/portable-text';

// Cached fetches - dedupe calls within same request
const getHomepage = cache(async () => {
  const query = `*[_type == "homepage"][0]{
    _id,
    heroImage,
    title,
    tagline,
    introText,
    contentBlocks[]{
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
    },
    seoTitle,
    seoDescription
  }`;
  return await client.fetch(query);
});

const getProperties = cache(async () => {
  const query = `*[_type == "property"]{
    _id,
    name,
    slug,
    location,
    overview,
    sleeps,
    bedrooms,
    heroImage
  }`;
  return await client.fetch(query);
});

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();

  return {
    title: homepage?.seoTitle || homepage?.title || 'Portbahn Islay',
    description: homepage?.seoDescription || homepage?.tagline || 'Holiday rental properties on Islay, Scotland',
  };
}

export default async function Home() {
  const homepage = await getHomepage();
  const properties = await getProperties();

  return (
    <>
      <SchemaMarkup
        type={['WebPage', 'Organization', 'LocalBusiness', 'Place', 'BreadcrumbList']}
        data={{
          ...homepage,
          url: '/',
          name: homepage?.seoTitle || homepage?.title || 'Portbahn Islay',
          description:
            homepage?.seoDescription ||
            homepage?.tagline ||
            'Holiday rental properties on Islay, Scotland',
        }}
        breadcrumbs={[{ name: 'Home', url: '/' }]}
      />

      <main className="min-h-screen bg-sea-spray">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ height: '88vh', maxHeight: '900px', minHeight: '500px' }}>
          {homepage?.heroImage ? (
            <Image
              src={urlFor(homepage.heroImage).width(1800).height(1200).url()}
              alt={homepage.heroImage.alt || 'Portbahn Islay — holiday homes on the Isle of Islay'}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--color-sound-of-islay)' }} />
          )}

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(15,58,74,0.15) 0%, rgba(15,58,74,0.55) 60%, rgba(15,58,74,0.80) 100%)',
          }} />

          {/* Hero text */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 48px 56px',
            maxWidth: '1280px',
            margin: '0 auto',
          }}>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '9px',
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'rgba(255,254,250,0.65)',
              marginBottom: '14px',
            }}>
              Isle of Islay · Scotland
            </p>
            <h1 style={{
              fontFamily: '"The Seasons", Georgia, serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'var(--color-sea-spray)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}>
              {homepage?.title || 'Portbahn Islay'}
            </h1>
            {homepage?.tagline && (
              <p style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '14px',
                color: 'rgba(255,254,250,0.75)',
                lineHeight: 1.5,
                maxWidth: '520px',
                marginBottom: '28px',
              }}>
                {homepage.tagline}
              </p>
            )}
            <Link
              href="/accommodation"
              className="hover-opacity"
              style={{
                display: 'inline-block',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '10.5px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: 'var(--color-emerald-accent)',
                color: '#fff',
                padding: '14px 28px',
                textDecoration: 'none',
              }}
            >
              View Accommodation
            </Link>
          </div>
        </div>

        {/* ── INTRO TEXT ──────────────────────────────────────────── */}
        {homepage?.introText && homepage.introText.length > 0 && (
          <section style={{
            background: 'var(--color-machair-sand)',
            borderBottom: '1px solid var(--color-washed-timber)',
            padding: '60px 48px',
          }}>
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <PortableText value={homepage.introText} components={portableTextComponents} />
            </div>
          </section>
        )}

        {/* ── ACCOMMODATION ────────────────────────────────────────── */}
        {properties.length > 0 && (
          <section style={{ paddingTop: '72px', paddingBottom: '80px' }}>

            {/* Section heading — contained */}
            <div style={{ padding: '0 48px', marginBottom: '40px' }}>
              <p style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-kelp-edge)',
                marginBottom: '10px',
              }}>
                Self-catering on Islay
              </p>
              <h2 style={{
                fontFamily: '"The Seasons", Georgia, serif',
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
                color: 'var(--color-harbour-stone)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}>
                Our Accommodation
              </h2>
            </div>

            {/* Full-width landscape cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', marginBottom: '64px' }}>
              {(properties as Property[]).map((p) => {
                const imageUrl = p.heroImage
                  ? urlFor(p.heroImage).width(1200).height(800).url()
                  : '';
                const locationText = typeof p.location === 'string'
                  ? p.location
                  : (p.location?.address || p.location?.nearestTown || 'Bruichladdich, Islay');
                const slug = typeof p.slug === 'string' ? p.slug : p.slug?.current;

                return (
                  <Link key={p._id} href={`/accommodation/${slug}`} style={{ display: 'block', textDecoration: 'none' }} className="hover-opacity">
                    {/* Landscape image */}
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', background: 'var(--color-harbour-stone)' }}>
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={p.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    {/* Summary below */}
                    <div style={{ padding: '20px 24px 24px', background: 'var(--color-machair-sand)' }}>
                      <p style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '9px',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--color-kelp-edge)',
                        marginBottom: '8px',
                      }}>
                        {locationText}
                      </p>
                      <h3 style={{
                        fontFamily: '"The Seasons", Georgia, serif',
                        fontWeight: 700,
                        fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
                        color: 'var(--color-harbour-stone)',
                        lineHeight: 1.1,
                        letterSpacing: '-0.01em',
                        marginBottom: '10px',
                      }}>
                        {p.name}
                      </h3>
                      <p style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '11px',
                        color: 'var(--color-harbour-stone)',
                        opacity: 0.6,
                      }}>
                        Sleeps {p.sleeps ?? '—'} · {p.bedrooms ?? '—'} bedrooms
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Map — contained */}
            <div style={{ padding: '0 48px' }}>
              <p style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-kelp-edge)',
                marginBottom: '10px',
              }}>
                Where we are
              </p>
              <h3 style={{
                fontFamily: '"The Seasons", Georgia, serif',
                fontWeight: 700,
                fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
                color: 'var(--color-harbour-stone)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                marginBottom: '20px',
              }}>
                Property Locations
              </h3>
              <MultiPropertyMap />
            </div>

          </section>
        )}

        {/* ── CANONICAL CONTENT BLOCKS ─────────────────────────────── */}
        {homepage?.contentBlocks && homepage.contentBlocks.length > 0 && (
          <section style={{
            borderTop: '1px solid var(--color-washed-timber)',
            padding: '72px 48px 80px',
          }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <BlockRenderer blocks={homepage.contentBlocks} />
            </div>
          </section>
        )}

        {/* ── FALLBACK ─────────────────────────────────────────────── */}
        {!homepage && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 48px' }}>
            <h1 style={{
              fontFamily: '"The Seasons", Georgia, serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'var(--color-harbour-stone)',
              marginBottom: '16px',
              lineHeight: 1.05,
            }}>
              Portbahn Islay
            </h1>
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', opacity: 0.7 }}>
              Self-catering accommodation on the Isle of Islay
            </p>
          </div>
        )}

      </main>
    </>
  );
}
