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
    sectionHeading: string;
    cardLinkPrefix: string;
    cardLinkSuffix?: string;
    emptyStateMessage?: string;
    backLink: { href: string; label: string };
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

              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 mb-14">
                {cards.map((card) => {
                  const cardTitle = card.title || card.name || 'Untitled';
                  const cardDescription = card.introduction || card.headline;
                  const cardSlug = typeof card.slug === 'string' ? card.slug : card.slug?.current;
                  return (
                    <Link key={card._id} href={`${config.cardLinkPrefix}${cardSlug}`} className="block group">
                      <div className="hover-card bg-machair-sand border border-washed-timber overflow-hidden flex flex-col h-full">
                        {/* Fixed-height image */}
                        <div className="relative h-[200px] overflow-hidden bg-harbour-stone shrink-0">
                          {(card.heroImage || config.fallbackImages?.[cardSlug || '']) ? (
                            card.heroImage ? (
                              <Image src={urlFor(card.heroImage).width(600).height(400).url()} alt={card.heroImage.alt || cardTitle} fill className="object-cover transition-transform duration-400" />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={config.fallbackImages![cardSlug || '']} alt={cardTitle} className="w-full h-full object-cover" />
                            )
                          ) : null}
                        </div>
                        {/* Card body — flex-grow to fill remaining space */}
                        <div className="p-5 pb-5 flex flex-col flex-grow">
                          <h2 className="font-serif font-bold text-[1.25rem] text-harbour-stone leading-snug tracking-snug mb-2">{cardTitle}</h2>
                          {cardDescription && (
                            <p className="typo-body-sm opacity-65 mb-4 line-clamp-3 flex-grow">{cardDescription}</p>
                          )}
                          <span className="typo-cta mt-auto">
                            {config.cardLinkSuffix || `${cardTitle} guide →`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {(!cards || cards.length === 0) && (
            <div className="py-12 text-center">
              <p className="font-mono text-xl text-harbour-stone opacity-60">{config.emptyStateMessage || 'Content coming soon.'}</p>
            </div>
          )}

          <div className="pt-8 border-t border-washed-timber">
            <Link href={config.backLink.href} className="font-mono text-md tracking-wide text-kelp-edge underline underline-offset-[3px]">
              ← {config.backLink.label}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
