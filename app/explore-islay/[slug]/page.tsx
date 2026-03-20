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

const GUIDE_IMAGES: Record<string, string> = {
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

interface PageProps { params: Promise<{ slug: string }>; }
type PTBlock = { _type: string; children?: Array<{ text?: string }> };
interface FaqItem { _id: string; question: string; answer: PTBlock[]; }

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

function galleryImage(page: any, index: number) { return page.galleryImages?.[index] || null; }

function ImageBreak({ image, caption, page }: { image: any; caption?: string; page: any }) {
  return (
    <div>
      <div className="overflow-hidden">
        <Image
          src={urlFor(image).width(1600).height(900).url()}
          alt={image.alt || page.title}
          width={1600} height={900}
          className="w-full object-cover block"
          style={{ height: '50vh', maxHeight: '460px', objectPosition: 'center 40%' }}
        />
      </div>
      {caption && (
        <div className="c1b-caption-bar">
          <span className="font-serif text-lg text-sea-spray italic">{caption}</span>
          <span className="typo-caption ml-6 shrink-0">Isle of Islay</span>
        </div>
      )}
    </div>
  );
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  if (TRAVEL_SLUGS.includes(slug)) notFound();
  const [page, properties] = await Promise.all([getGuidePage(slug), getProperties()]);
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
    description: page.seoDescription || page.introduction || `Guide to ${page.title} on the Isle of Islay.`,
    url: `/explore-islay/${slug}`, slug: { current: slug }, title: page.title,
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

  const relatedGuides = [
    { slug: 'islay-distilleries', title: 'Whisky Distilleries' },
    { slug: 'islay-beaches', title: 'Beaches of Islay' },
    { slug: 'islay-wildlife', title: 'Wildlife & Nature' },
    { slug: 'food-and-drink', title: 'Food & Drink' },
    { slug: 'walking', title: 'Walking on Islay' },
    { slug: 'visit-jura', title: 'Visiting Jura' },
    { slug: 'family-holidays', title: 'Family Holidays' },
    { slug: 'islay-villages', title: 'Villages of Islay' },
  ].filter((g) => g.slug !== slug).slice(0, 6);

  let galleryIndex = 0;
  const nextGalleryImage = () => galleryImage(page, galleryIndex++);

  return (
    <>
      <SchemaMarkup
        type={schemaTypes} data={schemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Explore Islay', url: '/explore-islay' },
          { name: page.title, url: `/explore-islay/${slug}` },
        ]}
      />
      <main className="min-h-screen bg-sea-spray">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        {(page.heroImage || GUIDE_IMAGES[slug]) && (
          <div className="w-full relative overflow-hidden" style={{ height: '65vh', minHeight: '440px', maxHeight: '620px' }}>
            {page.heroImage ? (
              <Image src={urlFor(page.heroImage).width(1600).height(900).url()} alt={page.heroImage.alt || page.title} fill className="object-cover" priority />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={GUIDE_IMAGES[slug]} alt={page.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,58,74,0.05) 0%, rgba(15,58,74,0.45) 100%)' }} />
          </div>
        )}

        {/* ── CAPTION BAR ────────────────────────────────────────────── */}
        <div className="c1b-caption-bar">
          <nav className="typo-nav">
            <Link href="/" className="opacity-70 no-underline">Home</Link>
            <span className="mx-2.5 opacity-35">·</span>
            <Link href="/explore-islay" className="opacity-70 no-underline">Explore Islay</Link>
            <span className="mx-2.5 opacity-35">·</span>
            <span className="opacity-100" style={{ color: 'rgba(255,254,250,0.9)' }}>{page.title}</span>
          </nav>
          <span className="typo-caption" style={{ color: 'rgba(255,254,250,0.5)' }}>Isle of Islay, Scotland</span>
        </div>

        {/* ── TITLE FRAME ────────────────────────────────────────────── */}
        <section className="bg-machair-sand" style={{ padding: '80px 48px 72px' }}>
          <div className="max-w-[860px] mx-auto">
            <p className="typo-kicker mb-5">Explore Islay</p>
            <h1 className="typo-h1 mb-7">{page.title}</h1>
            {page.introduction && (
              <div className="max-w-[640px]">
                {page.introduction.split('\n\n').filter(Boolean).slice(0, 2).map((para: string, i: number) => (
                  <p key={i} className="typo-body opacity-75 mb-4">{para}</p>
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
          const bgClass = index % 2 === 0 ? 'bg-sea-spray' : 'bg-machair-sand';

          const teaserCta = blockRef.version === 'teaser' && blockRef.block.canonicalHome ? (
            <p className="mt-6">
              <Link href={blockRef.block.canonicalHome} className="font-mono text-base tracking-wide text-kelp-edge underline underline-offset-[3px]">
                More about {blockRef.block.title} →
              </Link>
            </p>
          ) : null;

          const keyFactsEl = showKeyFacts ? (
            <div className={`mt-8 p-6 border-l-[3px] border-kelp-edge ${index % 2 === 0 ? 'bg-machair-sand' : 'bg-sea-spray'}`}>
              <p className="typo-kicker mb-4" style={{ letterSpacing: 'var(--tracking-caps)' }}>Key Facts</p>
              <dl className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {blockRef.block.keyFacts.map((fact: any, idx: number) => (
                  <div key={idx}>
                    <dt className="font-mono text-sm text-harbour-stone opacity-55 mb-1">{fact.fact}</dt>
                    <dd className="font-mono text-lg text-harbour-stone font-semibold">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null;

          const breakImg = (index < blocks.length - 1) ? nextGalleryImage() : null;

          return (
            <React.Fragment key={blockRef.block._id || index}>
              {isFirst ? (
                <section className="bg-sea-spray" data-block-id={blockRef.block.blockId?.current}>
                  <div className="g-layout-overview">
                    <div className="g-layout-overview-label">{blockRef.block.entityType || 'Guide'}</div>
                    <div className="g-layout-overview-body">
                      {heading && <h2 className="typo-h2 mb-8">{heading}</h2>}
                      {content && content.length > 0 && <div><PortableText value={content} components={portableTextComponents} /></div>}
                      {teaserCta}
                      {keyFactsEl}
                    </div>
                    <div className="g-layout-overview-aside">
                      <nav>
                        <p className="typo-kicker mb-4" style={{ letterSpacing: 'var(--tracking-caps)' }}>On this page</p>
                        <ul className="flex flex-col gap-2.5" style={{ listStyle: 'none' }}>
                          {blocks.slice(1).map((b: any) => (
                            <li key={b.block._id}><span className="font-mono text-base text-harbour-stone opacity-70">{b.customHeading || b.block.title}</span></li>
                          ))}
                          {entities.length > 0 && <li><span className="font-mono text-base text-harbour-stone opacity-70">Essential Listings</span></li>}
                          {faqs.length > 0 && <li><span className="font-mono text-base text-harbour-stone opacity-70">Frequently Asked</span></li>}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </section>
              ) : (
                <section className={bgClass} data-block-id={blockRef.block.blockId?.current}>
                  <div className="g-layout-spread">
                    {blockRef.block.entityType && <p className="typo-kicker mb-5">{blockRef.block.entityType}</p>}
                    <div className="g-layout-spread-grid">
                      <div>
                        {heading && <h2 className="typo-spread-heading sticky top-[100px]">{heading}</h2>}
                      </div>
                      <div>
                        {content && content.length > 0 && <PortableText value={content} components={portableTextComponents} />}
                        {teaserCta}
                        {keyFactsEl}
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
                <div className="g-pull-quote bg-sound-of-islay">
                  <blockquote className="text-sea-spray">&ldquo;{pullQuote}&rdquo;</blockquote>
                </div>
              )}

              {!isFirst && breakImg && <ImageBreak image={breakImg} page={page} />}
            </React.Fragment>
          );
        })}

        {/* ── EXTENDED EDITORIAL ──────────────────────────────────────── */}
        {page.extendedEditorial && page.extendedEditorial.length > 0 && (
          <section className={blocks.length % 2 === 0 ? 'bg-sea-spray' : 'bg-machair-sand'}>
            <div className="g-layout-spread">
              <p className="typo-kicker mb-5">Further reading</p>
              <div className="g-layout-spread-grid">
                <div><h2 className="typo-spread-heading sticky top-[100px]">More to<br />Discover</h2></div>
                <div><PortableText value={page.extendedEditorial} components={portableTextComponents} /></div>
              </div>
            </div>
          </section>
        )}

        {blocks.length <= 1 && pullQuote && (
          <div className="g-pull-quote bg-sound-of-islay">
            <blockquote className="text-sea-spray">&ldquo;{pullQuote}&rdquo;</blockquote>
          </div>
        )}

        {/* ── ENTITIES ───────────────────────────────────────────────── */}
        {entities.length > 0 && (
          <section className="g-entities">
            <div className="g-section-header">
              <p className="typo-kicker mb-3">Featured</p>
              <h2 className="typo-h2 mb-4">Essential Listings</h2>
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
              <p className="typo-kicker mb-3" style={{ color: 'rgba(255,254,250,0.55)' }}>Common questions</p>
              <h2 className="typo-h2 text-sea-spray mb-12">Frequently Asked</h2>
              <div className="flex flex-col gap-9">
                {faqs.map((faq) => (
                  <div key={faq._id} className="g-faq-item">
                    <h3 className="typo-h3 text-sea-spray mb-2.5">{faq.question}</h3>
                    <div>
                      <PortableText value={faq.answer} components={{
                        ...portableTextComponents,
                        block: { ...portableTextComponents.block,
                          normal: ({ children }: any) => <p className="font-mono text-lg leading-wide mb-4" style={{ color: 'rgba(255,254,250,0.75)' }}>{children}</p>,
                        },
                        marks: { ...portableTextComponents.marks,
                          link: ({ children, value }: any) => {
                            const href = value?.href || '';
                            const cls = 'underline underline-offset-[3px]';
                            const style = { color: 'rgba(255,254,250,0.9)' };
                            return href.startsWith('http')
                              ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{children}</a>
                              : <Link href={href} className={cls} style={style}>{children}</Link>;
                          },
                        },
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
            <p className="typo-kicker mb-3">Accommodation</p>
            <h2 className="typo-h2">Stay on Islay</h2>
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
                <Link key={p._id} href={`/accommodation/${propSlug}`} className="block hover-opacity">
                  <div className="bg-harbour-stone relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    {imageUrl && <Image src={imageUrl} alt={p.heroImage?.alt || p.name} fill className="object-cover" />}
                  </div>
                  <div className="bg-machair-sand p-5 pb-6">
                    <p className="typo-kicker mb-2">{locationText}</p>
                    <h3 className="typo-card-title mb-2.5">{p.name}</h3>
                    <p className="font-mono text-base text-harbour-stone opacity-60 mb-2.5">{bullets.join(' · ')}</p>
                    {unique.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5 mb-3.5" style={{ listStyle: 'none' }}>
                        {unique.map((h) => <li key={h} className="font-mono text-xs tracking-wide text-kelp-edge bg-sea-spray px-2.5 py-1">{h}</li>)}
                      </ul>
                    )}
                    <span className="typo-cta">View property →</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="max-w-[1280px] mx-auto mt-7 text-center">
            <Link href="/availability" className="typo-btn hover-opacity">Check Availability</Link>
          </div>
        </section>

        {/* ── RELATED GUIDES ─────────────────────────────────────────── */}
        <div className="g-related">
          <div className="g-related-inner">
            <span className="typo-kicker shrink-0">More guides</span>
            {relatedGuides.map((g, i) => (
              <span key={g.slug}>
                <Link href={`/explore-islay/${g.slug}`} className="hover-dim font-mono text-md text-harbour-stone">{g.title}</Link>
                {i < relatedGuides.length - 1 && <span className="mx-1 text-washed-timber">·</span>}
              </span>
            ))}
            <Link href="/explore-islay" className="typo-cta ml-auto shrink-0" style={{ textTransform: 'none', letterSpacing: 'var(--tracking-wider)' }}>← All guides</Link>
          </div>
        </div>

      </main>
    </>
  );
}
