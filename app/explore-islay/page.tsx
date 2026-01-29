import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import SchemaMarkup from '@/components/SchemaMarkup';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface GuidePage {
  _id: string;
  title: string;
  slug: { current: string };
  introduction?: string;
  heroImage?: {
    alt?: string;
    asset: { _ref: string };
  };
}

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * Explore Islay Hub Page
 *
 * Hub page in hub-and-spoke architecture. Shows teaser cards
 * linking to focused guide pages (spokes).
 *
 * Playbook alignment:
 * - Hub pages show teasers, not full content
 * - Each spoke page = one retrievable entity for AI
 * - Clear navigation to detailed content
 */

const getExploreIslayPage = cache(async () => {
  const query = `*[_type == "exploreIslayPage" && !(_id in path("drafts.**"))][0]{
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

// Get all guide pages for the hub
const getGuidePages = cache(async () => {
  const query = `*[_type == "guidePage" && !(_id in path("drafts.**"))] | order(title asc) {
    _id,
    title,
    slug,
    introduction,
    heroImage
  }`;

  return await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });
});

export async function generateMetadata(): Promise<Metadata> {
  const page = await getExploreIslayPage();

  return {
    title: page?.seoTitle || page?.title || 'Explore Islay | Portbahn Islay',
    description: page?.seoDescription || "Discover Islay's ten whisky distilleries, stunning beaches, abundant wildlife, and local restaurants.",
  };
}

export default async function ExploreIslayPage() {
  const [page, guidePages] = await Promise.all([
    getExploreIslayPage(),
    getGuidePages(),
  ]);

  const schemaData = {
    name: 'What to See and Do on Islay',
    description: page?.seoDescription || 'Guide to activities, attractions and experiences on the Isle of Islay - from whisky distilleries to hidden beaches.',
    about: {
      '@type': 'Place',
      name: 'Isle of Islay'
    }
  };

  return (
    <>
      <SchemaMarkup type="CollectionPage" data={schemaData} />
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

          <h1 className="font-serif text-5xl mb-4 text-harbour-stone">
            {page?.title || 'Explore the Isle of Islay'}
          </h1>

          <p className="font-mono text-lg text-harbour-stone/80 mb-12 leading-relaxed max-w-2xl">
            Having lived and worked on Islay for a number of years, we know the island well. This guide covers activities, attractions and experiences across Islay - from whisky distilleries to hidden beaches. Islay is one of the Inner Hebrides islands of Scotland, renowned for its ten working whisky distilleries, dramatic Atlantic coastline and abundant wildlife.
          </p>

          {/* Guide Cards Grid */}
          {guidePages && guidePages.length > 0 && (
            <>
              <h2 className="font-serif text-3xl text-harbour-stone mb-8">
                What to See and Do on Islay
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {guidePages.map((guide: GuidePage) => (
                <Link
                  key={guide._id}
                  href={`/guides/${guide.slug?.current}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm border border-washed-timber hover:shadow-md transition-shadow"
                >
                  {guide.heroImage && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={urlFor(guide.heroImage).width(600).height(300).url()}
                        alt={guide.heroImage.alt || guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="font-serif text-2xl text-harbour-stone mb-2 group-hover:text-emerald-accent transition-colors">
                      {guide.title}
                    </h2>
                    {guide.introduction && (
                      <p className="font-mono text-sm text-harbour-stone/70 mb-4 line-clamp-2">
                        {guide.introduction}
                      </p>
                    )}
                    <span className="font-mono text-sm text-emerald-accent group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
              </div>
            </>
          )}

          {/* Jura Link - separate from guide pages */}
          <div className="bg-harbour-stone/5 rounded-lg p-8 mb-12">
            <h2 className="font-serif text-2xl text-harbour-stone mb-4">
              Day Trip to Jura
            </h2>
            <p className="font-mono text-base text-harbour-stone/80 mb-4">
              Just a 5-minute ferry hop from Islay, the Isle of Jura offers a wilder,
              quieter experience with one road, one distillery, and more deer than people.
            </p>
            <Link
              href="/jura"
              className="inline-block font-mono text-emerald-accent hover:underline"
            >
              Plan your Jura day trip →
            </Link>
          </div>

          {/* Empty state if no guide pages */}
          {(!guidePages || guidePages.length === 0) && (
            <div className="text-center py-12">
              <p className="font-mono text-base text-harbour-stone mb-8">
                Guide pages coming soon.
              </p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-washed-timber">
            <Link href="/" className="font-mono text-emerald-accent hover:underline">
              ← Back to Our Properties
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
