import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import SchemaMarkup from '@/components/SchemaMarkup';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

// Revalidate every 60 seconds to pick up Sanity changes
export const revalidate = 60;

async function getExploreIslayPage() {
  const query = `*[_type == "exploreIslayPage"][0]{
    _id,
    title,
    heroImage,
    content,
    seoTitle,
    seoDescription
  }`;

  return await client.fetch(query);
}

// PortableText components for rendering block content
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="font-mono text-base text-harbour-stone mb-4 leading-relaxed">{children}</p>,
    h2: ({ children }: any) => <h2 className="font-serif text-3xl text-harbour-stone mb-6 mt-10">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-serif text-xl text-harbour-stone mb-3 mt-6">{children}</h3>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => {
      const href = value?.href || '';
      const isExternal = href.startsWith('http');
      return isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-accent hover:underline">
          {children}
        </a>
      ) : (
        <Link href={href} className="text-emerald-accent hover:underline">
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-1 mb-4 font-mono text-base text-harbour-stone ml-4">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside space-y-1 mb-4 font-mono text-base text-harbour-stone ml-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getExploreIslayPage();

  return {
    title: page?.seoTitle || page?.title || 'Explore Islay | Portbahn Islay',
    description: page?.seoDescription || 'Discover Islay\'s nine whisky distilleries, stunning beaches, abundant wildlife, and local restaurants.',
  };
}

export default async function ExploreIslayPage() {
  const page = await getExploreIslayPage();

  // Schema markup for TouristAttraction (Isle of Islay)
  const schemaData = {
    name: 'Isle of Islay',
    description: page?.seoDescription || 'Scottish island renowned for nine whisky distilleries, pristine beaches, and abundant wildlife.',
  };

  return (
    <>
      <SchemaMarkup
        type={['TouristAttraction', 'Place']}
        data={schemaData}
      />
      <main className="min-h-screen bg-sea-spray">
        {/* Hero Image */}
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
          {/* Breadcrumbs */}
          <nav className="mb-6 font-mono text-sm text-harbour-stone/70">
            <Link href="/" className="hover:text-emerald-accent">Home</Link>
            <span className="mx-2">→</span>
            <span>Explore Islay</span>
          </nav>

          {/* Title */}
          {page?.title && (
            <h1 className="font-serif text-5xl mb-8 text-harbour-stone">
              {page.title}
            </h1>
          )}

          {/* Main Content */}
          {page?.content && page.content.length > 0 && (
            <article className="prose-portbahn">
              <PortableText
                value={page.content}
                components={portableTextComponents}
              />
            </article>
          )}

          {/* Fallback if no content */}
          {(!page || !page.content || page.content.length === 0) && (
            <div className="text-center py-12">
              <h1 className="font-serif text-5xl mb-4 text-harbour-stone">
                Explore the Isle of Islay
              </h1>
              <p className="font-mono text-base text-harbour-stone mb-8">
                Content coming soon. Please check back shortly.
              </p>
              <Link
                href="/"
                className="inline-block bg-emerald-accent text-white px-6 py-3 rounded hover:bg-emerald-accent/90 transition"
              >
                Return to Homepage
              </Link>
            </div>
          )}

          {/* Back to Home CTA */}
          {page?.content && page.content.length > 0 && (
            <div className="mt-12 pt-8 border-t border-washed-timber">
              <Link
                href="/"
                className="font-mono text-emerald-accent hover:underline"
              >
                ← Back to Our Properties
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
