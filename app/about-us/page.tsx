import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import SchemaMarkup from '@/components/SchemaMarkup';
import BlockRenderer from '@/components/BlockRenderer';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * About Us Page
 *
 * Canonical home for the `about-us` block.
 * Also shows: trust-signals (teaser), bothan-jura-teaser (teaser),
 * and property cards linking to /accommodation/[slug].
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

const getAboutPage = cache(async () => {
  const query = `*[_type == "aboutPage" && !(_id in path("drafts.**"))][0]{
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

const getProperties = cache(async () => {
  const query = `*[_type == "property" && !(_id in path("drafts.**"))] | order(name asc) {
    _id,
    name,
    slug,
    headline,
    heroImage,
    sleeps,
    bedrooms,
    petFriendly,
    totalReviewCount,
    reviewHighlights[]{
      quote,
      source,
      rating
    }
  }`;

  return await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });
});

interface ReviewHighlight {
  quote: string;
  source: string;
  rating?: number;
}

interface Property {
  _id: string;
  name: string;
  slug: { current: string };
  headline?: string;
  heroImage?: { alt?: string; asset: { _ref: string } };
  sleeps?: number;
  bedrooms?: number;
  petFriendly?: boolean;
  totalReviewCount?: number;
  reviewHighlights?: ReviewHighlight[];
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();

  return {
    title: page?.seoTitle || 'About Pi & Lynton | Portbahn Islay',
    description: page?.seoDescription || 'Meet Pi and Lynton — hosting guests on Islay since 2017. Three family homes in Bruichladdich, managed with care. 600+ guests, 4.97/5 rating.',
  };
}

export default async function AboutUsPage() {
  const [page, properties] = await Promise.all([
    getAboutPage(),
    getProperties(),
  ]);

  const schemaData = {
    name: 'About Pi & Lynton',
    description: page?.seoDescription || 'Meet Pi and Lynton, hosts of three holiday properties in Bruichladdich, Isle of Islay.',
    url: '/about-us',
  };

  return (
    <>
      <SchemaMarkup
        type={['WebPage', 'BreadcrumbList']}
        data={schemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about-us' },
        ]}
      />
      <main className="min-h-screen bg-sea-spray">
        {page?.heroImage && (
          <div className="w-full h-[40vh] relative overflow-hidden">
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || 'Pi and Lynton — your Islay hosts'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 py-12">
          <nav className="mb-6 font-mono text-sm text-harbour-stone/70">
            <Link href="/" className="hover:text-emerald-accent">Home</Link>
            <span className="mx-2">&rarr;</span>
            <span>About Us</span>
          </nav>

          <h1 className="font-serif text-5xl mb-4 text-harbour-stone">
            {page?.title || 'About Us'}
          </h1>

          {page?.scopeIntro && (
            <p className="font-mono text-lg text-harbour-stone/80 mb-12 leading-relaxed max-w-2xl">
              {page.scopeIntro}
            </p>
          )}

          {/* Canonical Content Blocks (about-us full, trust-signals teaser, bothan-jura-teaser teaser) */}
          {page?.contentBlocks && page.contentBlocks.length > 0 && (
            <BlockRenderer blocks={page.contentBlocks} className="mb-16" />
          )}

          {/* Guest Quotes — personal service (only from properties with their own reviews) */}
          {(() => {
            const allQuotes = (properties || [])
              .filter((p: Property) => (p.totalReviewCount ?? 0) > 0)
              .flatMap((p: Property) =>
                (p.reviewHighlights || []).map((r: ReviewHighlight) => ({
                  ...r,
                  propertyName: p.name,
                }))
              );
            if (allQuotes.length === 0) return null;
            return (
              <section className="mb-16">
                <h2 className="font-serif text-3xl text-harbour-stone mb-8">
                  What Our Guests Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allQuotes.slice(0, 6).map((q: ReviewHighlight & { propertyName: string }, i: number) => (
                    <blockquote
                      key={i}
                      className="bg-white rounded-lg p-6 border border-washed-timber"
                    >
                      <p className="font-mono text-base text-harbour-stone/80 italic leading-relaxed mb-3">
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      <footer className="font-mono text-sm text-harbour-stone/60">
                        {q.source}
                        <span className="mx-1">&middot;</span>
                        {q.propertyName}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* The Homes We Manage */}
          {properties && properties.length > 0 && (
            <section className="mb-16">
              <h2 className="font-serif text-3xl text-harbour-stone mb-8">
                The Homes We Manage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map((property: Property) => (
                  <Link
                    key={property._id}
                    href={`/accommodation/${property.slug?.current}`}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm border border-washed-timber hover:shadow-md transition-shadow"
                  >
                    {property.heroImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={urlFor(property.heroImage).width(400).height(300).url()}
                          alt={property.heroImage.alt || property.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-serif text-xl text-harbour-stone mb-1 group-hover:text-emerald-accent transition-colors">
                        {property.name}
                      </h3>
                      {property.headline && (
                        <p className="font-mono text-sm text-harbour-stone/70 mb-3 line-clamp-2">
                          {property.headline}
                        </p>
                      )}
                      <div className="font-mono text-xs text-harbour-stone/60 flex flex-wrap gap-3">
                        {property.sleeps && <span>Sleeps {property.sleeps}</span>}
                        {property.bedrooms && <span>{property.bedrooms} bedrooms</span>}
                        {property.petFriendly !== undefined && (
                          <span>{property.petFriendly ? 'Dogs welcome' : 'Pet-free'}</span>
                        )}
                      </div>
                      <span className="font-mono text-sm text-emerald-accent group-hover:underline mt-3 inline-block">
                        View property &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="bg-white rounded-lg p-8 border border-washed-timber text-center mb-12">
            <h2 className="font-serif text-2xl text-harbour-stone mb-3">
              Questions about Islay or our properties?
            </h2>
            <p className="font-mono text-base text-harbour-stone/70 mb-6 max-w-xl mx-auto">
              We love helping guests plan their trips. Get in touch and we&apos;ll help with anything from ferry bookings to local restaurant tips.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-emerald-accent text-white font-mono text-sm px-6 py-3 rounded hover:bg-emerald-accent/90 transition-colors"
            >
              Get in touch &rarr;
            </Link>
          </section>

          <div className="mt-12 pt-8 border-t border-washed-timber">
            <Link href="/" className="font-mono text-emerald-accent hover:underline">
              &larr; Back to Our Properties
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
