import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import BlockRenderer from '@/components/BlockRenderer';
import SchemaMarkup from '@/components/SchemaMarkup';

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * Guide Page - Focused topic pages (spokes in hub-and-spoke architecture)
 *
 * Each guide page focuses on ONE topic with:
 * - Full content blocks (3-6 sentences per passage)
 * - Related FAQs (contextually adjacent)
 *
 * Playbook alignment:
 * - Shorter focused pages = better passage extraction
 * - FAQs adjacent to related content = better AI retrieval
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getGuidePage = cache(async (slug: string) => {
  const query = `*[_type == "guidePage" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    slug,
    heroImage,
    introduction,
    schemaType,
    contentBlocks[]{
      _key,
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

  return await client.fetch(query, { slug }, {
    next: { revalidate: 60 },
  });
});

// Generate static params for all guide pages
export async function generateStaticParams() {
  const query = `*[_type == "guidePage" && defined(slug.current)]{
    "slug": slug.current
  }`;
  const pages = await client.fetch(query);
  return pages.map((page: { slug: string }) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getGuidePage(slug);

  if (!page) {
    return {
      title: 'Guide Not Found | Portbahn Islay',
    };
  }

  return {
    title: page.seoTitle || `${page.title} | Portbahn Islay`,
    description: page.seoDescription || `Discover ${page.title} on the Isle of Islay.`,
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getGuidePage(slug);

  if (!page) {
    notFound();
  }

  const schemaType = page.schemaType || 'Article';

  const schemaData = {
    name: page.title,
    description: page.seoDescription || page.introduction || `Guide to ${page.title} on the Isle of Islay.`,
    url: `/explore-islay/${slug}`,
    slug: { current: slug },
    title: page.title,
    seoDescription: page.seoDescription,
    heroImage: page.heroImage,
  };

  return (
    <>
      <SchemaMarkup
        type={[schemaType, 'BreadcrumbList']}
        data={schemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Explore Islay', url: '/explore-islay' },
          { name: page.title, url: `/explore-islay/${slug}` },
        ]}
      />
      <main className="min-h-screen bg-sea-spray">
      {page.heroImage && (
        <div className="w-full h-[40vh] relative overflow-hidden">
          <Image
            src={urlFor(page.heroImage).width(1600).height(640).url()}
            alt={page.heroImage.alt || page.title}
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
          <Link href="/explore-islay" className="hover:text-emerald-accent">Explore Islay</Link>
          <span className="mx-2">→</span>
          <span>{page.title}</span>
        </nav>

        <h1 className="font-serif text-5xl mb-8 text-harbour-stone">
          {page.title}
        </h1>

        {/* Introduction */}
        {page.introduction && (
          <p className="font-mono text-lg text-harbour-stone/80 mb-12 leading-relaxed">
            {page.introduction}
          </p>
        )}

        {/* Content Blocks */}
        {page.contentBlocks && page.contentBlocks.length > 0 && (
          <div className="space-y-12 mb-16">
            <BlockRenderer blocks={page.contentBlocks} hideBlockTitles={true} />
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-washed-timber">
          <Link href="/explore-islay" className="font-mono text-emerald-accent hover:underline">
            ← Back to Explore Islay
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}
