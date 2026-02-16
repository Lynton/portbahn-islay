import { cache } from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
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
    whyStayTitle,
    whyStayText,
    gettingHereTitle,
    gettingHereText,
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
      {/* Hero Image */}
      {homepage?.heroImage && (
        <div className="w-full h-[60vh] relative overflow-hidden">
          <Image
            src={urlFor(homepage.heroImage).width(1600).height(960).url()}
            alt={homepage.heroImage.alt || homepage?.title || 'Portbahn Islay'}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Title & Tagline */}
        {homepage?.title && (
          <h1 className="font-serif text-6xl mb-4 text-harbour-stone">
            {homepage.title}
          </h1>
        )}
        {homepage?.tagline && (
          <p className="font-mono text-base text-harbour-stone mb-12">
            {homepage.tagline}
          </p>
        )}

        {/* Intro Text */}
        {homepage?.introText && homepage.introText.length > 0 && (
          <section className="mb-12">
            <PortableText
              value={homepage.introText}
              components={portableTextComponents}
            />
          </section>
        )}

        {/* Accommodation Grid */}
        {properties.length > 0 && (
          <section className="mb-16">
            <h2 className="font-serif text-4xl text-harbour-stone mb-8">Our Accommodation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {properties.map((property: unknown) => {
                const p = property as any;
                const imageUrl = p.heroImage 
                  ? urlFor(p.heroImage).width(800).height(1200).url() 
                  : '';
                
                // Extract description from overview PortableText or use fallback
                let description = '';
                if (p.overview && Array.isArray(p.overview)) {
                  // Extract text from first block
                  const firstBlock = p.overview.find((block: any) => block._type === 'block');
                  if (firstBlock && firstBlock.children) {
                    description = firstBlock.children
                      .map((child: any) => child.text || '')
                      .join(' ')
                      .substring(0, 150);
                  }
                }
                
                // Handle both string (legacy) and object (new) location formats
                const locationText = typeof p.location === 'string' 
                  ? p.location 
                  : (p.location?.address || p.location?.nearestTown || '');
                
                return (
                  <PropertyCard
                    key={p._id}
                    name={p.name}
                    location={locationText}
                    description={description || 'Self-catering holiday home on Islay'}
                    sleeps={p.sleeps}
                    bedrooms={p.bedrooms}
                    imageUrl={imageUrl}
                    href={`/accommodation/${p.slug?.current || p.slug}`}
                  />
                );
              })}
            </div>
            
            {/* Map showing all properties */}
            <div className="mt-12">
              <h3 className="font-serif text-3xl text-harbour-stone mb-6">Property Locations</h3>
              <MultiPropertyMap />
            </div>
          </section>
        )}

        {/* Canonical Content Blocks */}
        {homepage?.contentBlocks && homepage.contentBlocks.length > 0 && (
          <section className="mb-16">
            <BlockRenderer blocks={homepage.contentBlocks} />
          </section>
        )}

        {/* Why Stay Section */}
        {(homepage?.whyStayTitle || homepage?.whyStayText) && (
          <section className="mb-12">
            {homepage.whyStayTitle && (
              <h2 className="font-serif text-3xl text-harbour-stone mb-4">
                {homepage.whyStayTitle}
              </h2>
            )}
            {homepage.whyStayText && homepage.whyStayText.length > 0 && (
              <div>
                <PortableText
                  value={homepage.whyStayText}
                  components={portableTextComponents}
                />
              </div>
            )}
          </section>
        )}

        {/* Getting Here Section */}
        {(homepage?.gettingHereTitle || homepage?.gettingHereText) && (
          <section className="mb-12">
            {homepage.gettingHereTitle && (
              <h2 className="font-serif text-3xl text-harbour-stone mb-4">
                {homepage.gettingHereTitle}
              </h2>
            )}
            {homepage.gettingHereText && homepage.gettingHereText.length > 0 && (
              <div>
                <PortableText
                  value={homepage.gettingHereText}
                  components={portableTextComponents}
                />
              </div>
            )}
          </section>
        )}

        {/* Fallback if no homepage content */}
        {!homepage && (
          <div className="mb-12">
            <h1 className="font-serif text-6xl mb-4">
              Portbahn Islay
            </h1>
            <p className="font-mono text-base text-harbour-stone mb-12">
              Self-catering accommodation on the Isle of Islay
            </p>
            {properties.length === 0 && (
              <p className="font-mono text-base text-harbour-stone">
                No properties available at this time.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
    </>
  );
}
