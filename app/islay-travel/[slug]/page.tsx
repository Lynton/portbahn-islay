import React, { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import SchemaMarkup from '@/components/SchemaMarkup';
import type { SchemaType } from '@/lib/schema-markup';
import EntityCard from '@/components/EntityCard';
import GuideMap from '@/components/GuideMap';
import { portableTextComponents } from '@/lib/portable-text';

export const revalidate = 60;

const getProperties = cache(async () => {
  const query = `*[_type == "property"]{
    _id, name, slug, location, heroImage,
    sleeps, bedrooms, bathrooms, petFriendly,
    kitchenDining, livingAreas, outdoorFeatures
  }`;
  return await client.fetch(query);
});

interface PropertyCard {
  _id: string; name: string; slug: string | { current: string };
  location: string | { address?: string; nearestTown?: string };
  heroImage?: { alt?: string; asset: { _ref: string } };
  sleeps?: number; bedrooms?: number; bathrooms?: number; petFriendly?: boolean;
  kitchenDining?: string[]; livingAreas?: string[]; outdoorFeatures?: string[];
}

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

interface PageProps { params: Promise<{ slug: string }>; }
type PTBlock = { _type: string; children?: Array<{ text?: string }> };
interface FaqItem { _id: string; question: string; answer: PTBlock[]; }

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

export async function generateStaticParams() {
  return TRAVEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getTravelGuidePage(slug);
  if (!page) return { title: 'Guide Not Found | Portbahn Islay' };
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.co.uk'}/islay-travel/${slug}`;
  return {
    title: page.seoTitle || `${page.title} | Portbahn Islay`,
    description: page.seoDescription || `Discover ${page.title} — travel guide for the Isle of Islay.`,
    alternates: { canonical: canonicalUrl },
  };
}

function galleryImage(page: any, index: number) { return page.galleryImages?.[index] || null; }

function ImageBreak({ image, caption, page }: { image: any; caption?: string; page: any }) {
  return (
    <div>
      <div style={{ overflow: 'hidden' }}>
        <Image src={urlFor(image).width(1600).height(900).url()} alt={image.alt || page.title} width={1600} height={900}
          style={{ width: '100%', height: '50vh', maxHeight: '460px', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }} />
      </div>
      {caption && (
        <div className="c1b-caption-bar">
          <span style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: '18px', color: 'var(--color-sea-spray)', fontStyle: 'italic' }}>{caption}</span>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: 'var(--color-washed-timber)', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0, marginLeft: '24px' }}>Isle of Islay</span>
        </div>
      )}
    </div>
  );
}

export default async function TravelSubPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, properties] = await Promise.all([getTravelGuidePage(slug), getProperties()]);
  if (!page) notFound();

  const schemaType = page.schemaType || 'Article';
  const faqsForSchema = ((page.faqBlocks ?? []) as (FaqItem | null)[])
    .filter((faq): faq is FaqItem => !!faq?.question)
    .map((faq) => ({
      question: faq.question,
      answerText: faq.answer.filter((b) => b._type === 'block').map((b) => (b.children ?? []).map((c) => c.text ?? '').join('')).join(' '),
    }));

  const schemaData = {
    name: page.title,
    description: page.seoDescription || page.introduction || `Travel guide: ${page.title} — Isle of Islay.`,
    url: `/islay-travel/${slug}`, slug: { current: slug }, title: page.title,
    seoDescription: page.seoDescription, heroImage: page.heroImage, faqBlocks: faqsForSchema,
  };
  const schemaTypes: SchemaType[] = [schemaType as SchemaType, 'TouristAttraction', 'BreadcrumbList'];
  if (faqsForSchema.length > 0) schemaTypes.push('FAQPage');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entities: any[] = page.featuredEntities ?? [];
  const faqs = ((page.faqBlocks ?? []) as (FaqItem | null)[]).filter((faq): faq is FaqItem => !!faq?.question);
  const blocks = (page.contentBlocks || []).filter((b: any) => b?.block?._id);

  const pullQuote: string | null = (() => {
    if (page.pullQuote) return page.pullQuote;
    const firstPara = (page.introduction || '').split('\n\n')[0] || '';
    const firstSentence = firstPara.match(/^[^.!?]+[.!?]/)?.[0] || '';
    return (firstSentence.length >= 30 && firstSentence.length <= 180) ? firstSentence : null;
  })();

  const relatedGuides = TRAVEL_SLUGS.filter((s) => s !== slug).map((s) => ({ slug: s, title: TRAVEL_LABELS[s] || s }));

  let galleryIndex = 0;
  const nextGalleryImage = () => galleryImage(page, galleryIndex++);

  return (
    <>
      <SchemaMarkup type={schemaTypes} data={schemaData}
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Travel to Islay', url: '/islay-travel' }, { name: page.title, url: `/islay-travel/${slug}` }]} />
      <main className="min-h-screen bg-sea-spray">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        {(page.heroImage || TRAVEL_IMAGES[slug]) && (
          <div className="w-full relative overflow-hidden" style={{ height: '65vh', minHeight: '440px', maxHeight: '620px' }}>
            {page.heroImage ? (
              <Image src={urlFor(page.heroImage).width(1600).height(900).url()} alt={page.heroImage.alt || page.title} fill className="object-cover" priority />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={TRAVEL_IMAGES[slug]} alt={page.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,58,74,0.10) 0%, rgba(15,58,74,0.50) 100%)' }} />
          </div>
        )}

        {/* ── CAPTION BAR ────────────────────────────────────────────── */}
        <div className="c1b-caption-bar">
          <nav style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,254,250,0.65)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>{' · '}
            <Link href="/islay-travel" style={{ color: 'inherit', textDecoration: 'none' }}>Travel to Islay</Link>{' · '}
            <span style={{ color: 'rgba(255,254,250,0.9)' }}>{page.title}</span>
          </nav>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,254,250,0.5)' }}>Isle of Islay, Scotland</span>
        </div>

        {/* ── TITLE FRAME ────────────────────────────────────────────── */}
        <section style={{ background: 'var(--color-machair-sand)', padding: '80px 48px 72px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '20px' }}>Travel to Islay</p>
            <h1 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2.75rem, 6vw, 4.5rem)', color: 'var(--color-harbour-stone)', lineHeight: 0.98, letterSpacing: '-0.02em', marginBottom: '28px' }}>{page.title}</h1>
            {page.introduction && (
              <div style={{ maxWidth: '640px' }}>
                {page.introduction.split('\n\n').filter(Boolean).slice(0, 2).map((para: string, i: number) => (
                  <p key={i} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '15px', color: 'var(--color-harbour-stone)', opacity: 0.75, lineHeight: 1.7, marginBottom: '16px' }}>{para}</p>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CONTENT BLOCKS ─────────────────────────────────────────── */}
        {blocks.map((blockRef: any, index: number) => {
          const heading = blockRef.customHeading || blockRef.block.title;
          const content = blockRef.version === 'full' ? blockRef.block.fullContent : blockRef.block.teaserContent;
          const showKeyFacts = blockRef.showKeyFacts && blockRef.block.keyFacts?.length > 0;
          const isFirst = index === 0;
          const bg = index % 2 === 0 ? 'var(--color-sea-spray)' : 'var(--color-machair-sand)';

          const teaserCta = blockRef.version === 'teaser' && blockRef.block.canonicalHome ? (
            <p style={{ marginTop: '24px' }}>
              <Link href={blockRef.block.canonicalHome} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', letterSpacing: '0.06em', color: 'var(--color-kelp-edge)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                More about {blockRef.block.title} →
              </Link>
            </p>
          ) : null;

          const keyFactsEl = showKeyFacts ? (
            <div style={{ marginTop: '32px', padding: '24px 28px', background: index % 2 === 0 ? 'var(--color-machair-sand)' : 'var(--color-sea-spray)', borderLeft: '3px solid var(--color-kelp-edge)' }}>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '16px' }}>Key Facts</p>
              <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {blockRef.block.keyFacts.map((fact: any, idx: number) => (
                  <div key={idx}>
                    <dt style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '4px' }}>{fact.fact}</dt>
                    <dd style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', fontWeight: 600 }}>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null;

          const breakImg = (index < blocks.length - 1) ? nextGalleryImage() : null;

          return (
            <React.Fragment key={blockRef.block._id || index}>
              {isFirst ? (
                <section style={{ background: 'var(--color-sea-spray)' }} data-block-id={blockRef.block.blockId?.current}>
                  <div className="g-layout-overview">
                    <div className="g-layout-overview-label">{blockRef.block.entityType || 'Guide'}</div>
                    <div className="g-layout-overview-body">
                      {heading && <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.08, color: 'var(--color-harbour-stone)', letterSpacing: '-0.01em', marginBottom: '32px' }}>{heading}</h2>}
                      {content && content.length > 0 && <div><PortableText value={content} components={portableTextComponents} /></div>}
                      {teaserCta}{keyFactsEl}
                    </div>
                    <div className="g-layout-overview-aside">
                      <nav>
                        <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '16px' }}>On this page</p>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {blocks.slice(1).map((b: any) => (
                            <li key={b.block._id}><span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-harbour-stone)', opacity: 0.7 }}>{b.customHeading || b.block.title}</span></li>
                          ))}
                          {entities.length > 0 && <li><span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-harbour-stone)', opacity: 0.7 }}>Essential Listings</span></li>}
                          {faqs.length > 0 && <li><span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-harbour-stone)', opacity: 0.7 }}>Frequently Asked</span></li>}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </section>
              ) : (
                <section style={{ background: bg }} data-block-id={blockRef.block.blockId?.current}>
                  <div className="g-layout-spread">
                    {blockRef.block.entityType && <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '20px' }}>{blockRef.block.entityType}</p>}
                    <div className="g-layout-spread-grid">
                      <div>{heading && <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, color: 'var(--color-harbour-stone)', letterSpacing: '-0.01em', position: 'sticky', top: '100px' }}>{heading}</h2>}</div>
                      <div>
                        {content && content.length > 0 && <PortableText value={content} components={portableTextComponents} />}
                        {teaserCta}{keyFactsEl}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {isFirst && (() => {
                const img = breakImg || (blocks.length > 1 ? page.heroImage : null);
                if (!img) return null;
                return <ImageBreak image={img} caption={img.caption || img.alt || `${page.title} — Isle of Islay`} page={page} />;
              })()}

              {isFirst && blocks.length > 1 && pullQuote && (
                <div className="g-pull-quote" style={{ background: 'var(--color-sound-of-islay)' }}>
                  <blockquote style={{ color: 'var(--color-sea-spray)' }}>&ldquo;{pullQuote}&rdquo;</blockquote>
                </div>
              )}

              {!isFirst && breakImg && <ImageBreak image={breakImg} page={page} />}
            </React.Fragment>
          );
        })}

        {/* ── EXTENDED EDITORIAL ──────────────────────────────────────── */}
        {page.extendedEditorial && page.extendedEditorial.length > 0 && (
          <section style={{ background: blocks.length % 2 === 0 ? 'var(--color-sea-spray)' : 'var(--color-machair-sand)' }}>
            <div className="g-layout-spread">
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '20px' }}>Further reading</p>
              <div className="g-layout-spread-grid">
                <div><h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, color: 'var(--color-harbour-stone)', letterSpacing: '-0.01em', position: 'sticky', top: '100px' }}>More to<br />Discover</h2></div>
                <div><PortableText value={page.extendedEditorial} components={portableTextComponents} /></div>
              </div>
            </div>
          </section>
        )}

        {blocks.length <= 1 && pullQuote && (
          <div className="g-pull-quote" style={{ background: 'var(--color-sound-of-islay)' }}>
            <blockquote style={{ color: 'var(--color-sea-spray)' }}>&ldquo;{pullQuote}&rdquo;</blockquote>
          </div>
        )}

        {/* ── ENTITIES ───────────────────────────────────────────────── */}
        {entities.length > 0 && (
          <section className="g-entities">
            <div className="g-section-header">
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '12px' }}>Featured</p>
              <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-harbour-stone)', lineHeight: 1.05, letterSpacing: '-0.01em', marginBottom: '16px' }}>Essential Listings</h2>
              <GuideMap entities={entities} pageTitle={page.title} />
            </div>
            <div className="g-entities-grid">
              {entities.map((entity) => <EntityCard key={entity._id} entity={entity} variant="sand" />)}
            </div>
          </section>
        )}

        {faqs.length > 0 && (() => { const img = nextGalleryImage(); return img ? <ImageBreak image={img} page={page} /> : null; })()}

        {/* ── FAQs ───────────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section className="g-faqs">
            <div className="g-faqs-inner">
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,254,250,0.55)', marginBottom: '12px' }}>Common questions</p>
              <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-sea-spray)', lineHeight: 1.05, letterSpacing: '-0.01em', marginBottom: '48px' }}>Frequently Asked</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                {faqs.map((faq) => (
                  <div key={faq._id} className="g-faq-item">
                    <h3 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'var(--color-sea-spray)', marginBottom: '10px', lineHeight: 1.2 }}>{faq.question}</h3>
                    <div>
                      <PortableText value={faq.answer} components={{
                        ...portableTextComponents,
                        block: { ...portableTextComponents.block, normal: ({ children }: any) => <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13.5px', color: 'rgba(255,254,250,0.75)', lineHeight: 1.75, marginBottom: '16px' }}>{children}</p> },
                        marks: { ...portableTextComponents.marks, link: ({ children, value }: any) => {
                          const href = value?.href || '';
                          const style = { color: 'rgba(255,254,250,0.9)', textDecoration: 'underline' as const, textUnderlineOffset: '3px' };
                          return href.startsWith('http') ? <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a> : <Link href={href} style={style}>{children}</Link>;
                        }},
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── STAY ON ISLAY ──────────────────────────────────────────── */}
        <section className="g-stay">
          <div className="g-section-header">
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '12px' }}>Accommodation</p>
            <h2 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-harbour-stone)', lineHeight: 1.05, letterSpacing: '-0.01em' }}>Stay on Islay</h2>
          </div>
          <div className="g-stay-cards">
            {(properties as PropertyCard[]).map((p) => {
              const imageUrl = p.heroImage ? urlFor(p.heroImage).width(1200).height(800).url() : '';
              const locationText = typeof p.location === 'string' ? p.location : (p.location?.address || p.location?.nearestTown || 'Bruichladdich, Islay');
              const propSlug = typeof p.slug === 'string' ? p.slug : p.slug?.current;
              const bullets: string[] = [];
              if (p.sleeps) bullets.push(`Sleeps ${p.sleeps}`);
              if (p.bedrooms) bullets.push(`${p.bedrooms} bedrooms`);
              if (p.bathrooms) bullets.push(`${p.bathrooms} bathroom${p.bathrooms > 1 ? 's' : ''}`);
              if (p.petFriendly) bullets.push('Dogs welcome');
              if (p.petFriendly === false) bullets.push('Pet-free');
              const highlights: string[] = [];
              if (p.outdoorFeatures?.includes('sea_views') || p.outdoorFeatures?.includes('sea_views_outdoor')) highlights.push('Sea views');
              if (p.outdoorFeatures?.includes('walled_garden')) highlights.push('Walled garden');
              if (p.outdoorFeatures?.includes('bird_reserves')) highlights.push('Bird hides');
              if (p.outdoorFeatures?.includes('private_garden')) highlights.push('Private garden');
              if (p.outdoorFeatures?.includes('woodland')) highlights.push('Woodland grounds');
              if (p.livingAreas?.includes('conservatory')) highlights.push('Conservatory');
              const unique = [...new Set(highlights)].slice(0, 3);
              return (
                <Link key={p._id} href={`/accommodation/${propSlug}`} style={{ display: 'block', textDecoration: 'none' }} className="hover-opacity">
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', background: 'var(--color-harbour-stone)' }}>
                    {imageUrl && <Image src={imageUrl} alt={p.heroImage?.alt || p.name} fill style={{ objectFit: 'cover' }} />}
                  </div>
                  <div style={{ padding: '20px 24px 24px', background: 'var(--color-machair-sand)' }}>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', marginBottom: '8px' }}>{locationText}</p>
                    <h3 style={{ fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.25rem, 2vw, 1.6rem)', color: 'var(--color-harbour-stone)', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '10px' }}>{p.name}</h3>
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', color: 'var(--color-harbour-stone)', opacity: 0.6, marginBottom: '10px' }}>{bullets.join(' · ')}</p>
                    {unique.length > 0 && (
                      <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                        {unique.map((h) => <li key={h} style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.06em', color: 'var(--color-kelp-edge)', background: 'var(--color-sea-spray)', padding: '4px 10px' }}>{h}</li>)}
                      </ul>
                    )}
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)' }}>View property →</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div style={{ maxWidth: '1280px', margin: '28px auto 0', textAlign: 'center' }}>
            <Link href="/availability" className="hover-opacity" style={{ display: 'inline-block', background: 'var(--color-emerald-accent)', color: '#fff', fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '14px 48px', textDecoration: 'none' }}>Check Availability</Link>
          </div>
        </section>

        {/* ── RELATED GUIDES ─────────────────────────────────────────── */}
        <div className="g-related">
          <div className="g-related-inner">
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-kelp-edge)', flexShrink: 0 }}>More travel info</span>
            {relatedGuides.map((g, i) => (
              <span key={g.slug}>
                <Link href={`/islay-travel/${g.slug}`} className="hover-dim" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-harbour-stone)', textDecoration: 'none' }}>{g.title}</Link>
                {i < relatedGuides.length - 1 && <span style={{ margin: '0 4px', color: 'var(--color-washed-timber)' }}>·</span>}
              </span>
            ))}
            <Link href="/islay-travel" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', letterSpacing: '0.08em', color: 'var(--color-kelp-edge)', textDecoration: 'none', marginLeft: 'auto', flexShrink: 0 }}>← All travel guides</Link>
          </div>
        </div>

      </main>
    </>
  );
}
