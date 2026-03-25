import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SchemaMarkup from '@/components/SchemaMarkup';
import { urlFor } from '@/sanity/lib/image';

interface HubPageProps {
  page: {
    _id?: string;
    title?: string;
    heroImage?: { alt?: string; asset: { _ref: string } };
    seoDescription?: string;
    contentBlocks?: any[];
  } | null;
  cards: Array<{
    _id: string;
    title?: string;
    name?: string;
    slug?: { current: string } | string;
    introduction?: string;
    headline?: string;
    heroImage?: { alt?: string; asset: { _ref: string } };
  }>;
  config: {
    breadcrumbs: Array<{ label: string; href?: string }>;
    introText: string;
    statsLine?: string;
    sectionHeading: string;
    cardLinkPrefix: string;
    cardLinkSuffix?: string;
    cardKickers?: Record<string, string>;
    emptyStateMessage?: string;
    backLink: { href: string; label: string };
    crossLink?: { href: string; label: string };
    showBjrCard?: boolean;
    fallbackImages?: Record<string, string>;
    spokeIndex?: Array<{ slug: string; title: string }>;
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

export default function HubPage({ page, cards, config }: HubPageProps) {
  return (
    <>
      <SchemaMarkup
        type={[config.schemaType, 'BreadcrumbList']}
        data={config.schemaData}
        breadcrumbs={config.breadcrumbs.filter((c) => !!c.href).map((c) => ({ name: c.label, url: c.href! }))}
      />

      <main className="min-h-screen bg-sea-spray">

        {/* ── HERO ──────────────────────────────────────────────── */}
        {page?.heroImage && (
          <div className="w-full relative overflow-hidden" style={{ height: '55vh', minHeight: '380px', maxHeight: '540px' }}>
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || page?.title || 'Portbahn Islay'}
              fill className="object-cover" priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,58,74,0.10) 0%, rgba(15,58,74,0.50) 100%)' }} />
          </div>
        )}

        {/* ── CAPTION BAR ──────────────────────────────────────── */}
        <div className="c1b-caption-bar" style={{ padding: '18px 48px' }}>
          <nav className="typo-nav">
            {config.breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {crumb.href ? (
                  <Link href={crumb.href} className="no-underline">{crumb.label}</Link>
                ) : (
                  <span style={{ color: 'rgba(255,254,250,0.9)' }}>{crumb.label}</span>
                )}
                {index < config.breadcrumbs.length - 1 && ' · '}
              </span>
            ))}
          </nav>
          <span className="typo-caption" style={{ color: 'rgba(255,254,250,0.5)' }}>Isle of Islay, Scotland</span>
        </div>

        {/* ── TITLE FRAME ──────────────────────────────────────── */}
        <section className="bg-machair-sand" style={{ padding: '64px 48px 60px' }}>
          <div className="max-w-[860px]">
            <p className="typo-kicker mb-4">
              {(() => {
                const parent = config.breadcrumbs.length > 1 ? config.breadcrumbs[config.breadcrumbs.length - 2]?.label : null;
                return (parent && parent !== 'Home') ? parent : 'Portbahn Islay';
              })()}
            </p>
            <h1 className="typo-h1 mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.02 }}>
              {page?.title || config.breadcrumbs[config.breadcrumbs.length - 1].label}
            </h1>
            {config.introText.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} className="typo-body opacity-75 max-w-[680px] mb-4">{para}</p>
            ))}
            {config.statsLine && (
              <p className="font-mono text-sm text-kelp-edge tracking-wide mt-6 opacity-80">{config.statsLine}</p>
            )}
          </div>
        </section>

        {/* ── CARDS ────────────────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto" style={{ padding: '60px 48px 80px' }}>
          {cards && cards.length > 0 && (
            <>
              <div className="mb-8">
                <p className="typo-kicker mb-2.5">Explore</p>
                <h2 className="typo-h2" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}>{config.sectionHeading}</h2>
              </div>

              <div className="hub-card-grid mb-14">
                {cards.map((card, index) => {
                  const cardTitle = card.title || card.name || 'Untitled';
                  const cardDescription = card.introduction || card.headline;
                  const cardSlug = typeof card.slug === 'string' ? card.slug : card.slug?.current;
                  const kicker = config.cardKickers?.[cardSlug || ''];
                  const isFeatured = index === 0;
                  return (
                    <Link key={card._id} href={`${config.cardLinkPrefix}${cardSlug}`} className={`block group${isFeatured ? ' hub-card-featured' : ''}`}>
                      <div className="hover-card bg-white border border-washed-timber overflow-hidden flex flex-col h-full">
                        <div className={`relative overflow-hidden bg-harbour-stone shrink-0${isFeatured ? ' h-[280px]' : ' h-[200px]'}`}>
                          {(card.heroImage || config.fallbackImages?.[cardSlug || '']) ? (
                            card.heroImage ? (
                              <Image src={urlFor(card.heroImage).width(isFeatured ? 900 : 600).height(isFeatured ? 560 : 400).url()} alt={card.heroImage.alt || cardTitle} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={config.fallbackImages![cardSlug || '']} alt={cardTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            )
                          ) : null}
                        </div>
                        <div className="p-5 pb-5 flex flex-col flex-grow">
                          {kicker && (
                            <p className="typo-kicker mb-2">{kicker}</p>
                          )}
                          <h2 className={`font-serif font-bold text-harbour-stone leading-snug tracking-snug mb-2${isFeatured ? ' text-[1.4rem]' : ' text-[1.15rem]'}`}>{cardTitle}</h2>
                          {cardDescription && (
                            <p className="font-mono text-sm text-harbour-stone/60 mb-4 line-clamp-2 flex-grow" style={{ lineHeight: '1.5' }}>{cardDescription}</p>
                          )}
                          <span className="typo-cta mt-auto">
                            {config.cardLinkSuffix || 'Full guide →'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {/* BJR cross-promo card */}
                {config.showBjrCard && (
                  <a href="https://www.bothanjuraretreat.co.uk" target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="hover-card overflow-hidden flex flex-col h-full" style={{ backgroundColor: 'var(--color-sound-of-islay)' }}>
                      <div className="relative h-[200px] overflow-hidden bg-harbour-stone shrink-0" />
                      <div className="p-5 pb-5 flex flex-col flex-grow">
                        <p className="font-mono text-2xs tracking-ultra uppercase text-emerald-accent mb-2">Stay on Jura</p>
                        <h2 className="font-serif font-bold text-sea-spray/90 leading-snug tracking-snug mb-2 text-[1.15rem]">Bothan Jura Retreat</h2>
                        <p className="font-mono text-sm text-sea-spray/50 mb-4 flex-grow" style={{ lineHeight: '1.5' }}>
                          4 units with hot tubs and saunas at the foot of the Paps of Jura. Sleeps 2 per unit. Dogs welcome.
                        </p>
                        <span className="font-mono text-sm tracking-wider uppercase text-emerald-accent mt-auto">
                          bothanjuraretreat.co.uk →
                        </span>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </>
          )}

          {(!cards || cards.length === 0) && (
            <div className="py-12 text-center">
              <p className="font-mono text-xl text-harbour-stone opacity-60">{config.emptyStateMessage || 'Content coming soon.'}</p>
            </div>
          )}

          <div className="pt-8 border-t border-washed-timber flex flex-wrap gap-6">
            <Link href={config.backLink.href} className="hover-link font-mono text-md tracking-wide text-kelp-edge">
              ← {config.backLink.label}
            </Link>
            {config.crossLink && (
              <Link href={config.crossLink.href} className="hover-link font-mono text-md tracking-wide text-kelp-edge">
                {config.crossLink.label} →
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
