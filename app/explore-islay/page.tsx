import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import SchemaMarkup from '@/components/SchemaMarkup';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import BlockRenderer from '@/components/BlockRenderer';

// Revalidate every 60 seconds to pick up Sanity changes
export const revalidate = 60;

// Cached fetch - dedupes calls within same request
const getExploreIslayPage = cache(async () => {
  const query = `*[_type == "exploreIslayPage"][0]{
    _id,
    title,
    heroImage,
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

export async function generateMetadata(): Promise<Metadata> {
  const page = await getExploreIslayPage();

  return {
    title: page?.seoTitle || page?.title || 'Explore Islay | Portbahn Islay',
    description: page?.seoDescription || "Discover Islay's nine whisky distilleries, stunning beaches, abundant wildlife, and local restaurants.",
  };
}

export default async function ExploreIslayPage() {
  const page = await getExploreIslayPage();

  const schemaData = {
    name: 'Isle of Islay',
    description: page?.seoDescription || 'Scottish island renowned for nine whisky distilleries, pristine beaches, and abundant wildlife.',
  };

  return (
    <>
      <SchemaMarkup type={['TouristAttraction', 'Place']} data={schemaData} />
      <main className="min-h-screen bg-sea-spray">
        {page?.heroImage && (
          <div className="w-full h-[40vh] relative overflow-hidden">
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || page?.title || 'Explore Islay'}
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
            <span>Explore Islay</span>
          </nav>

          {page?.title && (
            <h1 className="font-serif text-5xl mb-8 text-harbour-stone">
              {page.title}
            </h1>
          )}

          {page?.contentBlocks && page.contentBlocks.length > 0 && (
            <BlockRenderer blocks={page.contentBlocks} />
          )}

          {(!page || !page.contentBlocks || page.contentBlocks.length === 0) && (
            <div className="text-center py-12">
              <p className="font-mono text-base text-harbour-stone mb-8">
                Content coming soon. Add canonical blocks to this page in Sanity Studio.
              </p>
              <Link
                href="/"
                className="inline-block bg-emerald-accent text-white px-6 py-3 rounded hover:bg-emerald-accent/90 transition"
              >
                Return to Homepage
              </Link>
            </div>
          )}

          {page?.contentBlocks && page.contentBlocks.length > 0 && (
            <div className="mt-12 pt-8 border-t border-washed-timber">
              <Link href="/" className="font-mono text-emerald-accent hover:underline">
                ← Back to Our Properties
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
