import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SchemaMarkup from '@/components/SchemaMarkup';
import { urlFor } from '@/sanity/lib/image';

interface HubPageProps {
  page: {
    _id?: string;
    title?: string;
    heroImage?: {
      alt?: string;
      asset: { _ref: string };
    };
    seoDescription?: string;
    contentBlocks?: any[];
  } | null;
  cards: Array<{
    _id: string;
    title?: string;
    name?: string;
    slug?: { current: string };
    introduction?: string;
    headline?: string;
    heroImage?: {
      alt?: string;
      asset: { _ref: string };
    };
  }>;
  config: {
    breadcrumbs: Array<{ label: string; href?: string }>;
    introText: string;
    sectionHeading: string;
    cardLinkPrefix: string;
    cardLinkSuffix?: string;
    emptyStateMessage?: string;
    backLink: { href: string; label: string };
    schemaType: 'CollectionPage';
    schemaData: {
      name: string;
      description: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      about?: any;
      hasPart?: Array<{ type: string; url: string; name: string }>;
    };
  };
}

/**
 * HubPage Component - Reusable hub page template
 *
 * Used by /explore-islay, /islay-travel, and /accommodation
 * Implements hub-and-spoke architecture with teaser cards
 */
export default function HubPage({ page, cards, config }: HubPageProps) {
  return (
    <>
      <SchemaMarkup
        type={[config.schemaType, 'BreadcrumbList']}
        data={config.schemaData}
        breadcrumbs={config.breadcrumbs
          .filter((c) => !!c.href)
          .map((c) => ({ name: c.label, url: c.href! }))}
      />

      <main className="min-h-screen bg-sea-spray">

        {/* ── HERO ──────────────────────────────────────────────── */}
        {page?.heroImage && (
          <div className="w-full relative overflow-hidden" style={{ height: '45vh', maxHeight: '480px' }}>
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || page?.title || 'Portbahn Islay'}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(15,58,74,0.10) 0%, rgba(15,58,74,0.50) 100%)',
            }} />
          </div>
        )}

        {/* ── TEAL CAPTION BAR ──────────────────────────────────── */}
        <div style={{
          background: 'var(--color-sound-of-islay)',
          padding: '18px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <nav style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,254,250,0.65)' }}>
            {config.breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {crumb.href ? (
                  <Link href={crumb.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: 'rgba(255,254,250,0.9)' }}>{crumb.label}</span>
                )}
                {index < config.breadcrumbs.length - 1 && ' · '}
              </span>
            ))}
          </nav>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,254,250,0.5)' }}>
            Isle of Islay, Scotland
          </span>
        </div>

        {/* ── SAND TITLE FRAME ──────────────────────────────────── */}
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
              {(() => {
                const parent = config.breadcrumbs.length > 1
                  ? config.breadcrumbs[config.breadcrumbs.length - 2]?.label
                  : null;
                return (parent && parent !== 'Home') ? parent : 'Portbahn Islay';
              })()}
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
              {page?.title || config.breadcrumbs[config.breadcrumbs.length - 1].label}
            </h1>
            {config.introText.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '15px',
                color: 'var(--color-harbour-stone)',
                opacity: 0.75,
                lineHeight: 1.7,
                maxWidth: '680px',
                marginBottom: '16px',
              }}>
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* ── PAGE CONTENT ──────────────────────────────────────── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 48px 80px' }}>

          {/* Cards Grid */}
          {cards && cards.length > 0 && (
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
                  {config.sectionHeading}
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '56px' }}>
                {cards.map((card) => {
                  const cardTitle = card.title || card.name || 'Untitled';
                  const cardDescription = card.introduction || card.headline;
                  const cardSlug = card.slug?.current;

                  return (
                    <Link
                      key={card._id}
                      href={`${config.cardLinkPrefix}${cardSlug}`}
                      style={{ display: 'block', textDecoration: 'none' }}
                      className="group"
                    >
                      <div
                        className="hover-card"
                        style={{
                          background: 'var(--color-machair-sand)',
                          border: '1px solid var(--color-washed-timber)',
                          overflow: 'hidden',
                        }}
                      >
                        {card.heroImage && (
                          <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                            <Image
                              src={urlFor(card.heroImage).width(600).height(400).url()}
                              alt={card.heroImage.alt || cardTitle}
                              fill
                              className="object-cover"
                              style={{ transition: 'transform 0.4s ease' }}
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
                            {cardTitle}
                          </h2>
                          {cardDescription && (
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
                              {cardDescription}
                            </p>
                          )}
                          <span style={{
                            fontFamily: '"IBM Plex Mono", monospace',
                            fontSize: '10px',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--color-kelp-edge)',
                          }}>
                            {config.cardLinkSuffix || 'Read more →'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Empty state */}
          {(!cards || cards.length === 0) && (
            <div style={{ paddingTop: '48px', paddingBottom: '48px', textAlign: 'center' }}>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px', color: 'var(--color-harbour-stone)', opacity: 0.6 }}>
                {config.emptyStateMessage || 'Content coming soon.'}
              </p>
            </div>
          )}

          {/* Back Link */}
          <div style={{ paddingTop: '32px', borderTop: '1px solid var(--color-washed-timber)' }}>
            <Link
              href={config.backLink.href}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '12px',
                letterSpacing: '0.06em',
                color: 'var(--color-kelp-edge)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              ← {config.backLink.label}
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
