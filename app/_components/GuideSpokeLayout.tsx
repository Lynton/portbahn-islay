import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import SchemaMarkup from '@/components/SchemaMarkup';
import type { SchemaType } from '@/lib/schema-markup';
import EntityCard from '@/components/EntityCard';
import GuideMap from '@/components/GuideMap';
import PropertyCardGrid from '@/components/PropertyCardGrid';
import { portableTextComponents } from '@/lib/portable-text';
import type { PropertyData } from '@/lib/queries';

type PTBlock = { _type: string; style?: string; children?: Array<{ text?: string }> };
interface FaqItem { _id: string; question: string; answer: PTBlock[]; }

/** Split a PortableText array into sections at h3 boundaries.
 *  Returns: { intro: PTBlock[], sections: { heading: string, content: PTBlock[] }[] }
 *  Content before the first h3 is the intro. Each h3 starts a new section. */
function splitAtH3(blocks: PTBlock[]): { intro: PTBlock[]; sections: { heading: string; content: PTBlock[] }[] } {
  const intro: PTBlock[] = [];
  const sections: { heading: string; content: PTBlock[] }[] = [];
  let current: { heading: string; content: PTBlock[] } | null = null;

  for (const block of blocks) {
    if (block._type === 'block' && block.style === 'h3') {
      if (current) sections.push(current);
      const text = (block.children || []).map(c => c.text || '').join('');
      current = { heading: text, content: [] };
    } else if (current) {
      current.content.push(block);
    } else {
      intro.push(block);
    }
  }
  if (current) sections.push(current);
  return { intro, sections };
}

export interface GuideSpokeConfig {
  hubLabel: string;
  hubPath: string;
  urlPrefix: string;
  fallbackImages: Record<string, string>;
  relatedGuides: Array<{ slug: string; title: string }>;
}

interface GuideSpokeLayoutProps {
  page: any;
  slug: string;
  properties: PropertyData[];
  config: GuideSpokeConfig;
}

function galleryImage(page: any, index: number) { return page.galleryImages?.[index] || null; }

function ImageBreak({ image, caption, page }: { image: any; caption?: string; page: any }) {
  return (
    <figure className="guide-image-break">
      <Image src={urlFor(image).width(1200).height(700).url()} alt={image.alt || page.title}
        width={1200} height={700} className="w-full object-cover block"
        style={{ aspectRatio: '12/7' }} />
      {caption && (
        <figcaption className="font-mono text-sm text-washed-timber mt-3 pb-2">{caption}</figcaption>
      )}
    </figure>
  );
}

export default function GuideSpokeLayout({ page, slug, properties, config }: GuideSpokeLayoutProps) {
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
    url: `${config.urlPrefix}${slug}`, slug: { current: slug }, title: page.title,
    seoDescription: page.seoDescription, heroImage: page.heroImage, faqBlocks: faqsForSchema,
  };
  const schemaTypes: SchemaType[] = [schemaType as SchemaType, 'TouristAttraction', 'BreadcrumbList'];
  if (faqsForSchema.length > 0) schemaTypes.push('FAQPage');

  const entities: any[] = page.featuredEntities ?? [];
  const faqs = ((page.faqBlocks ?? []) as (FaqItem | null)[]).filter((faq): faq is FaqItem => !!faq?.question);
  const blocks = (page.contentBlocks || []).filter((b: any) => b?.block?._id);

  const pullQuote: string | null = (() => {
    if (page.pullQuote) return page.pullQuote;
    const firstPara = (page.introduction || '').split('\n\n')[0] || '';
    const firstSentence = firstPara.match(/^[^.!?]+[.!?]/)?.[0] || '';
    return (firstSentence.length >= 30 && firstSentence.length <= 180) ? firstSentence : null;
  })();

  const relatedGuides = config.relatedGuides.filter((g) => g.slug !== slug).slice(0, 6);

  // Slugify heading text for anchor IDs
  const toAnchor = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Entity section heading — contextual, not generic (must be before quickNav)
  const entityHeading = (() => {
    if (entities.length === 0) return '';
    const categories = [...new Set(entities.map((e: any) => e.category).filter(Boolean))];
    if (categories.length === 1) {
      const labels: Record<string, string> = {
        distillery: 'Distilleries', restaurant: 'Where to Eat & Drink', beach: 'Beaches',
        'nature-reserve': 'Nature Reserves', heritage: 'Heritage Sites', route: 'Walking Routes',
        village: 'Villages', transport: 'Transport & Services', activity: 'Activities',
      };
      return labels[categories[0]] || `${page.title}`;
    }
    return `${page.title} — Places & Services`;
  })();

  // Build quick nav from ALL heading sources in page order
  const quickNav: Array<{ label: string; anchor: string }> = [];
  blocks.forEach((b: any) => {
    const title = b.customHeading || b.block.title;
    if (title) quickNav.push({ label: title, anchor: `block-${b.block.blockId?.current || b.block._id}` });
    (b.block.contentHeadings || []).forEach((h: string) => {
      if (h) quickNav.push({ label: h, anchor: toAnchor(h) });
    });
  });
  (page.editorialHeadings || []).forEach((h: string) => {
    if (h) quickNav.push({ label: h, anchor: toAnchor(h) });
  });
  if (entities.length > 0) quickNav.push({ label: entityHeading || 'Places & Listings', anchor: 'entities' });
  if (faqs.length > 0) quickNav.push({ label: 'Common Questions', anchor: 'faqs' });
  quickNav.push({ label: 'Stay on Islay', anchor: 'stay' });
  // Deduplicate by anchor (same heading in block + editorial = one nav item)
  const seen = new Set<string>();
  const uniqueNav = quickNav.filter((item) => {
    if (seen.has(item.anchor)) return false;
    seen.add(item.anchor);
    return true;
  });

  // PortableText with anchored headings
  const anchoredComponents = {
    ...portableTextComponents,
    block: {
      ...portableTextComponents.block,
      h2: ({ children }: any) => {
        const text = typeof children === 'string' ? children : (Array.isArray(children) ? children.join('') : '');
        return <h2 id={toAnchor(text)} className="typo-h2 mt-12 mb-4">{children}</h2>;
      },
      h3: ({ children }: any) => {
        const text = typeof children === 'string' ? children : (Array.isArray(children) ? children.join('') : '');
        return <h3 id={toAnchor(text)} className="font-serif font-bold text-[1.25rem] text-harbour-stone leading-snug mt-8 mb-3">{children}</h3>;
      },
    },
  };

  let galleryIndex = 0;
  const nextGalleryImage = () => galleryImage(page, galleryIndex++);

  return (
    <>
      <SchemaMarkup type={schemaTypes} data={schemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: config.hubLabel, url: config.hubPath },
          { name: page.title, url: `${config.urlPrefix}${slug}` },
        ]}
      />
      <main id="top" className="min-h-screen bg-sea-spray">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        {(page.heroImage || config.fallbackImages[slug]) && (
          <div className="w-full relative overflow-hidden" style={{ height: '65vh', minHeight: '440px', maxHeight: '620px' }}>
            {page.heroImage ? (
              <Image src={urlFor(page.heroImage).width(1600).height(900).url()} alt={page.heroImage.alt || page.title} fill className="object-cover" priority />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={config.fallbackImages[slug]} alt={page.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,58,74,0.05) 0%, rgba(15,58,74,0.45) 100%)' }} />
          </div>
        )}

        {/* ── CAPTION BAR ────────────────────────────────────────────── */}
        <div className="c1b-caption-bar">
          <nav className="typo-nav">
            <Link href="/" className="opacity-70 no-underline hover-light">Home</Link>
            <span className="mx-2.5 opacity-35">·</span>
            <Link href={config.hubPath} className="opacity-70 no-underline hover-light">{config.hubLabel}</Link>
            <span className="mx-2.5 opacity-35">·</span>
            <span className="opacity-100" style={{ color: 'rgba(255,254,250,0.9)' }}>{page.title}</span>
          </nav>
          <span className="typo-caption" style={{ color: 'rgba(255,254,250,0.5)' }}>Isle of Islay, Scotland</span>
        </div>

        {/* ── TITLE FRAME ────────────────────────────────────────────── */}
        <section className="bg-machair-sand" style={{ padding: '80px 48px 72px' }}>
          <div className="max-w-[860px]">
            <p className="typo-kicker mb-5">{config.hubLabel}</p>
            <h1 className="typo-h1 mb-7">{page.title}</h1>
            {page.introduction && (
              <div className="max-w-[640px]">
                {page.introduction.split('\n\n').filter(Boolean).map((para: string, i: number) => (
                  <p key={i} className="typo-body opacity-75 mb-4">{para}</p>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── MOBILE NAV (horizontal, below title frame) ────────────── */}
        {uniqueNav.length > 0 && (
          <nav className="guide-mobile-nav bg-sea-spray py-6 border-b border-washed-timber">
            <p className="typo-kicker mb-3">On this page</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {uniqueNav.map((item) => (
                <a key={item.anchor} href={`#${item.anchor}`} className="hover-link font-mono text-base text-harbour-stone opacity-70">{item.label}</a>
              ))}
            </div>
          </nav>
        )}

        {/* ── 2-COL GRID: Content + Sidebar ────────────────────────── */}
        <div className="guide-grid">

          {/* ── CONTENT COLUMN (LHC) ─────────────────────────────────── */}
          <div className="min-w-0">
            {blocks.map((blockRef: any, index: number) => {
              const heading = blockRef.customHeading || blockRef.block.title;
              const content: PTBlock[] = blockRef.version === 'full' ? (blockRef.block.fullContent || []) : (blockRef.block.teaserContent || []);
              const showKeyFacts = blockRef.showKeyFacts && blockRef.block.keyFacts?.length > 0;
              const isFirst = index === 0;
              const kicker = blockRef.block.entityType || (isFirst ? 'Guide' : config.hubLabel);

              const teaserCta = blockRef.version === 'teaser' && blockRef.block.canonicalHome ? (
                <p className="mt-6">
                  <Link href={blockRef.block.canonicalHome} className="hover-link font-mono text-base tracking-wide text-kelp-edge">
                    More about {blockRef.block.title} →
                  </Link>
                </p>
              ) : null;

              const keyFactsEl = showKeyFacts ? (
                <div className="guide-key-facts">
                  <p className="typo-label mb-5">Key Facts</p>
                  <dl>
                    {blockRef.block.keyFacts.map((fact: any, idx: number) => (
                      <div key={idx} className="border-t border-washed-timber pt-3 pb-1">
                        <dt className="typo-caption mb-1">{fact.fact}</dt>
                        <dd className="font-mono text-xl text-harbour-stone font-semibold">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null;

              // Split content at h3 boundaries for visual section treatment
              const { intro, sections } = splitAtH3(content);
              const hasSections = sections.length > 0;

              return (
                <React.Fragment key={blockRef.block._id || index}>
                  {/* Lead section: block heading + intro content (before first h3) */}
                  <div className={`guide-block${isFirst ? ' guide-block-lead' : ''}`} id={`block-${blockRef.block.blockId?.current || blockRef.block._id}`} data-block-id={blockRef.block.blockId?.current}>
                    <p className={isFirst ? 'typo-label mb-6' : 'typo-kicker mb-5'}>{kicker}</p>
                    {heading && <h2 className={isFirst ? 'typo-h2 mb-8' : 'typo-h2 mb-6'}>{heading}</h2>}
                    <div className="guide-block-body">
                      {intro.length > 0 && <PortableText value={intro} components={anchoredComponents} />}
                      {!hasSections && teaserCta}
                      {!hasSections && keyFactsEl}
                    </div>
                  </div>

                  {/* 60:40 image spread + pullquote after lead block */}
                  {isFirst && (() => {
                    const img = nextGalleryImage() || page.heroImage;
                    if (!img || !pullQuote) return img ? <ImageBreak image={img} page={page} /> : null;
                    return (
                      <div className="grid my-2 overflow-hidden" style={{ gridTemplateColumns: '60fr 40fr', minHeight: '45vh' }}>
                        <div className="overflow-hidden">
                          <Image src={urlFor(img).width(900).height(700).url()} alt={img.alt || page.title}
                            width={900} height={700} className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-machair-sand flex flex-col justify-center" style={{ padding: '56px 36px' }}>
                          <p className="typo-label mb-5">{page.title}</p>
                          <blockquote className="font-serif font-bold italic text-harbour-stone border-l-[3px] border-kelp-edge pl-5"
                            style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)', lineHeight: '1.3' }}>
                            &ldquo;{pullQuote}&rdquo;
                          </blockquote>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Gallery pair after lead block */}
                  {isFirst && (() => {
                    const img1 = nextGalleryImage();
                    const img2 = nextGalleryImage();
                    if (!img1) return null;
                    return (
                      <div className="grid gap-[3px] bg-harbour-stone my-2" style={{ gridTemplateColumns: img2 ? '3fr 2fr' : '1fr' }}>
                        <div className="overflow-hidden">
                          <Image src={urlFor(img1).width(800).height(500).url()} alt={img1.alt || page.title}
                            width={800} height={500} className="w-full object-cover" style={{ height: '320px' }} />
                        </div>
                        {img2 && (
                          <div className="overflow-hidden">
                            <Image src={urlFor(img2).width(600).height(500).url()} alt={img2.alt || page.title}
                              width={600} height={500} className="w-full object-cover" style={{ height: '320px' }} />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* h3 sub-sections — each rendered as its own visual block */}
                  {sections.map((section, sIdx) => {
                    const isLastSection = sIdx === sections.length - 1;
                    const sectionImg = nextGalleryImage();
                    return (
                      <React.Fragment key={`${blockRef.block._id}-s${sIdx}`}>
                        <div className="guide-block" id={toAnchor(section.heading)}>
                          <p className="typo-kicker mb-5">{kicker}</p>
                          <h2 className="typo-h2 mb-6">{section.heading}</h2>
                          <div className="guide-block-body">
                            {section.content.length > 0 && <PortableText value={section.content} components={anchoredComponents} />}
                            {isLastSection && teaserCta}
                            {isLastSection && keyFactsEl}
                          </div>
                        </div>
                        {sectionImg && !isLastSection && <ImageBreak image={sectionImg} page={page} />}
                      </React.Fragment>
                    );
                  })}

                  {/* Image break between blocks (non-lead, non-sectioned) */}
                  {!isFirst && !hasSections && (() => {
                    const img = nextGalleryImage();
                    return img ? <ImageBreak image={img} page={page} /> : null;
                  })()}
                </React.Fragment>
              );
            })}

            {/* ── EXTENDED EDITORIAL ────────────────────────────────────── */}
            {page.extendedEditorial && page.extendedEditorial.length > 0 && (() => {
              const { intro: edIntro, sections: edSections } = splitAtH3(page.extendedEditorial);
              return (
                <>
                  {edIntro.length > 0 && (
                    <div className="guide-block">
                      <div className="guide-block-body">
                        <PortableText value={edIntro} components={anchoredComponents} />
                      </div>
                    </div>
                  )}
                  {edSections.map((section, sIdx) => {
                    const sectionImg = nextGalleryImage();
                    return (
                      <React.Fragment key={`ed-s${sIdx}`}>
                        {sIdx > 0 && sectionImg && <ImageBreak image={sectionImg} page={page} />}
                        <div className="guide-block" id={toAnchor(section.heading)}>
                          <p className="typo-kicker mb-5">{page.title}</p>
                          <h2 className="typo-h2 mb-6">{section.heading}</h2>
                          <div className="guide-block-body">
                            {section.content.length > 0 && <PortableText value={section.content} components={anchoredComponents} />}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </>
              );
            })()}

            {blocks.length <= 1 && pullQuote && !page.galleryImages?.length && (
              <div className="guide-pull-quote">
                <blockquote className="text-harbour-stone">&ldquo;{pullQuote}&rdquo;</blockquote>
              </div>
            )}
          </div>

          {/* ── STICKY SIDEBAR (RHC) ─────────────────────────────────── */}
          <aside className="guide-sidebar">
            {/* On this page — persistent sticky nav */}
            {uniqueNav.length > 0 && (
              <nav className="mb-6">
                <p className="typo-kicker mb-4">On this page</p>
                <ul className="flex flex-col gap-2">
                  {uniqueNav.map((item) => (
                    <li key={item.anchor}>
                      <a href={`#${item.anchor}`} className="hover-link font-mono text-base text-harbour-stone opacity-70">{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Related guides — sidebar version */}
            {relatedGuides.length > 0 && (
              <div className="pt-4 border-t border-washed-timber">
                <p className="typo-kicker mb-4">More Guides</p>
                <ul className="flex flex-col gap-2.5 list-none">
                  {relatedGuides.slice(0, 4).map((g) => (
                    <li key={g.slug}>
                      <Link href={`${config.urlPrefix}${g.slug}`} className="hover-link font-mono text-base text-harbour-stone opacity-70">{g.title}</Link>
                    </li>
                  ))}
                </ul>
                <Link href={config.hubPath} className="hover-link font-mono text-sm tracking-wider text-kelp-edge mt-4 inline-block">← All guides</Link>
              </div>
            )}
          </aside>

        </div>

        {/* ── ENTITIES ───────────────────────────────────────────────── */}
        {entities.length > 0 && (
          <section className="g-entities" id="entities">
            <div className="g-section-header">
              <p className="typo-kicker mb-3">{page.title}</p>
              <h2 className="typo-h2 mb-4">{entityHeading}</h2>
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
          <section className="g-faqs" id="faqs">
            <div className="g-faqs-inner">
              <p className="typo-kicker-light mb-3">Common questions</p>
              <h2 className="typo-h2-light mb-12">{page.title}</h2>
              <div className="flex flex-col gap-9">
                {faqs.map((faq) => (
                  <div key={faq._id} className="g-faq-item">
                    <h3 className="typo-h3-light mb-2.5">{faq.question}</h3>
                    <div>
                      <PortableText value={faq.answer} components={{
                        ...portableTextComponents,
                        block: { ...portableTextComponents.block,
                          normal: ({ children }: any) => <p className="typo-body-light mb-4">{children}</p>,
                        },
                        marks: { ...portableTextComponents.marks,
                          link: ({ children, value }: any) => {
                            const href = value?.href || '';
                            const cls = 'underline underline-offset-[3px] hover-light text-sea-spray/90';
                            return href.startsWith('http')
                              ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
                              : <Link href={href} className={cls}>{children}</Link>;
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
        <section className="g-stay" id="stay">
          <div className="g-section-header">
            <p className="typo-kicker mb-3">Accommodation</p>
            <h2 className="typo-h2">Stay on Islay</h2>
          </div>
          <PropertyCardGrid properties={properties} showHighlights showBjrCard />
          <div className="max-w-[1280px] mx-auto mt-7 text-center flex items-center justify-center gap-6">
            <Link href="/availability" className="typo-btn hover-btn">Check Availability</Link>
          </div>
        </section>

        {/* ── RELATED GUIDES ─────────────────────────────────────────── */}
        <div className="g-related">
          <div className="g-related-inner">
            <span className="typo-kicker shrink-0">More guides</span>
            {relatedGuides.map((g, i) => (
              <span key={g.slug}>
                <Link href={`${config.urlPrefix}${g.slug}`} className="hover-link font-mono text-md text-harbour-stone">{g.title}</Link>
                {i < relatedGuides.length - 1 && <span className="mx-1 text-washed-timber">·</span>}
              </span>
            ))}
            <Link href={config.hubPath} className="hover-link font-mono text-sm tracking-wider text-kelp-edge ml-auto shrink-0">← All guides</Link>
          </div>
        </div>

        {/* ── BACK TO TOP ──────────────────────────────────────────── */}
        <div className="fixed bottom-6 right-6 z-50">
          <a href="#top" className="flex items-center justify-center w-10 h-10 bg-sea-spray text-kelp-edge border border-washed-timber rounded-full hover-card" aria-label="Back to top" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3L3 8.5M8 3L13 8.5M8 3V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </main>
    </>
  );
}
