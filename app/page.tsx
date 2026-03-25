import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import SchemaMarkup from '@/components/SchemaMarkup';
import MultiPropertyMap from '@/components/MultiPropertyMap';
import PropertyCardGrid from '@/components/PropertyCardGrid';
import BlockRenderer from '@/components/BlockRenderer';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { portableTextComponents } from '@/lib/portable-text';
import { getProperties } from '@/lib/queries';

const getHomepage = cache(async () => {
  const query = `*[_type == "homepage"][0]{
    _id, heroImage, title, tagline, introText,
    contentBlocks[]{ version, showKeyFacts, customHeading,
      block->{ _id, blockId, title, entityType, canonicalHome, fullContent, teaserContent, keyFacts }
    },
    seoTitle, seoDescription
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
        data={{ ...homepage, url: '/', name: homepage?.seoTitle || homepage?.title || 'Portbahn Islay', description: homepage?.seoDescription || homepage?.tagline || 'Holiday rental properties on Islay, Scotland' }}
        breadcrumbs={[{ name: 'Home', url: '/' }]}
      />

      <main className="min-h-screen bg-sea-spray">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ height: '88vh', maxHeight: '900px', minHeight: '500px' }}>
          {homepage?.heroImage ? (
            <Image src={urlFor(homepage.heroImage).width(1800).height(1200).url()} alt={homepage.heroImage.alt || 'Portbahn Islay — holiday homes on the Isle of Islay'} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-sound-of-islay" />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,58,74,0.15) 0%, rgba(15,58,74,0.55) 60%, rgba(15,58,74,0.80) 100%)' }} />

          <div className="absolute bottom-0 left-0 right-0 max-w-[1280px] mx-auto" style={{ padding: '0 48px 56px' }}>
            <p className="typo-kicker mb-3.5" style={{ color: 'rgba(255,254,250,0.65)' }}>Isle of Islay · Scotland</p>
            <h1 className="font-serif font-bold text-sea-spray tracking-tight mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.0 }}>
              {homepage?.title || 'Portbahn Islay'}
            </h1>
            {homepage?.tagline && (
              <p className="font-mono text-xl max-w-[520px] mb-7" style={{ color: 'rgba(255,254,250,0.75)', lineHeight: 1.5 }}>
                {homepage.tagline}
              </p>
            )}
            <Link href="/accommodation" className="typo-btn hover-btn">View Accommodation</Link>
          </div>
        </div>

        {/* ── INTRO TEXT ──────────────────────────────────────────── */}
        {homepage?.introText && homepage.introText.length > 0 && (
          <section className="bg-machair-sand border-b border-washed-timber" style={{ padding: '60px 48px' }}>
            <div className="max-w-[680px] mx-auto">
              <PortableText value={homepage.introText} components={portableTextComponents} />
            </div>
          </section>
        )}

        {/* ── ACCOMMODATION ────────────────────────────────────────── */}
        {properties.length > 0 && (
          <section className="py-[72px] pb-20">
            <div className="px-12 mb-10">
              <p className="typo-kicker mb-2.5">Self-catering on Islay</p>
              <h2 className="typo-h2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}>Our Accommodation</h2>
            </div>

            <div className="mb-16">
              <PropertyCardGrid properties={properties} showBjrCard />
            </div>

            <div className="px-12">
              <p className="typo-kicker mb-2.5">Where we are</p>
              <h3 className="typo-h3 mb-5">Property Locations</h3>
              <MultiPropertyMap />
            </div>
          </section>
        )}

        {/* ── CANONICAL CONTENT BLOCKS ─────────────────────────────── */}
        {homepage?.contentBlocks && homepage.contentBlocks.length > 0 && (
          <section className="border-t border-washed-timber" style={{ padding: '72px 48px 80px' }}>
            <div className="max-w-[1280px] mx-auto">
              <BlockRenderer blocks={homepage.contentBlocks} />
            </div>
          </section>
        )}

        {/* ── FALLBACK ─────────────────────────────────────────────── */}
        {!homepage && (
          <div className="max-w-[1280px] mx-auto" style={{ padding: '80px 48px' }}>
            <h1 className="typo-h1 mb-4">Portbahn Islay</h1>
            <p className="font-mono text-xl text-harbour-stone opacity-70">Self-catering accommodation on the Isle of Islay</p>
          </div>
        )}

      </main>
    </>
  );
}
