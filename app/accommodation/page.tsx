import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import SchemaMarkup from '@/components/SchemaMarkup';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface Property {
  _id: string;
  name: string;
  slug: { current: string };
  heroImage?: {
    alt?: string;
    asset: { _ref: string };
  };
  headline?: string;
}

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * Accommodation Hub Page
 *
 * Hub page in hub-and-spoke architecture. Shows teaser cards
 * linking to individual property pages (spokes).
 *
 * Playbook alignment:
 * - Hub pages show teasers, not full content
 * - Each spoke page = one retrievable entity for AI
 * - Clear navigation to detailed content
 */

const getAccommodationPage = cache(async () => {
  const query = `*[_type == "accommodationPage" && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    heroImage,
    seoTitle,
    seoDescription
  }`;

  return await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });
});

// Get all properties for the hub
const getProperties = cache(async () => {
  const query = `*[_type == "property" && !(_id in path("drafts.**"))] | order(name asc) {
    _id,
    name,
    slug,
    headline,
    heroImage
  }`;

  return await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });
});

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAccommodationPage();

  return {
    title: page?.seoTitle || page?.title || 'Holiday Accommodation on Islay | Portbahn Islay',
    description: page?.seoDescription || 'Three unique holiday properties in Bruichladdich, Islay. From sea view houses to eco cottages.',
  };
}

export default async function AccommodationPage() {
  const [page, properties] = await Promise.all([
    getAccommodationPage(),
    getProperties(),
  ]);

  const schemaData = {
    name: 'Portbahn Islay Accommodation',
    description: page?.seoDescription || 'Three unique holiday properties in Bruichladdich on the Isle of Islay.',
  };

  return (
    <>
      <SchemaMarkup type="Accommodation" data={schemaData} />
      <main className="min-h-screen bg-sea-spray">
        {page?.heroImage && (
          <div className="w-full h-[40vh] relative overflow-hidden">
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || page?.title || 'Accommodation'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 py-12">
          <nav className="mb-6 font-mono text-sm text-harbour-stone/70">
            <Link href="/" className="hover:text-emerald-accent">Home</Link>
            <span className="mx-2">→</span>
            <span>Accommodation</span>
          </nav>

          <h1 className="font-serif text-5xl mb-4 text-harbour-stone">
            {page?.title || 'Our Properties'}
          </h1>

          <p className="font-mono text-lg text-harbour-stone/80 mb-12 leading-relaxed max-w-2xl">
            We offer three unique holiday properties in Bruichladdich, each with its own character
            and charm. All are perfectly positioned to explore Islay&apos;s distilleries, beaches,
            and wildlife.
          </p>

          {/* Property Cards Grid */}
          {properties && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {properties.map((property: Property) => (
                <Link
                  key={property._id}
                  href={`/accommodation/${property.slug?.current}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm border border-washed-timber hover:shadow-md transition-shadow"
                >
                  {property.heroImage && (
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={urlFor(property.heroImage).width(600).height(400).url()}
                        alt={property.heroImage.alt || property.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="font-serif text-2xl text-harbour-stone mb-2 group-hover:text-emerald-accent transition-colors">
                      {property.name}
                    </h2>
                    {property.headline && (
                      <p className="font-mono text-sm text-harbour-stone/70 mb-4 line-clamp-2">
                        {property.headline}
                      </p>
                    )}
                    <span className="font-mono text-sm text-emerald-accent group-hover:underline">
                      View property →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty state if no properties */}
          {(!properties || properties.length === 0) && (
            <div className="text-center py-12">
              <p className="font-mono text-base text-harbour-stone mb-8">
                Properties coming soon.
              </p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-washed-timber">
            <Link href="/" className="font-mono text-emerald-accent hover:underline">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
