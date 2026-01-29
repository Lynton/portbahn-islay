import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import SchemaMarkup from '@/components/SchemaMarkup';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import BlockRenderer from '@/components/BlockRenderer';

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * Travel to Islay Page - Simplified flat structure
 *
 * Content blocks and FAQ blocks are fetched directly at page level,
 * not nested within sections. The frontend decides rendering order.
 */
const getGettingHerePage = cache(async () => {
  const query = `*[_type == "gettingHerePage" && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    heroImage,
    content,
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
    faqBlocks[]{
      _key,
      overrideQuestion,
      faqBlock->{
        _id,
        question,
        answer,
        category,
        priority
      }
    },
    seoTitle,
    seoDescription
  }`;

  return await client.fetch(query, {}, {
    next: { revalidate: 60 },
  });
});

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGettingHerePage();

  return {
    title: page?.seoTitle || page?.title || 'Travel to Islay | Ferry & Flight Guide | Portbahn Islay',
    description: page?.seoDescription || 'Complete guide to reaching the Isle of Islay by CalMac ferry or Loganair flight.',
  };
}

export default async function TravelToIslayPage() {
  const page = await getGettingHerePage();

  const schemaData = {
    name: page?.title || 'Getting to the Isle of Islay',
    description: page?.seoDescription || 'Complete guide to reaching the Isle of Islay by CalMac ferry or Loganair flight.',
  };

  // Filter to only resolved FAQs
  const resolvedFaqs = page?.faqBlocks?.filter((fb: any) => fb?.faqBlock) || [];

  return (
    <>
      <SchemaMarkup type={['HowTo', 'Place']} data={schemaData} />
      <main className="min-h-screen bg-sea-spray">
        {page?.heroImage && (
          <div className="w-full h-[40vh] relative overflow-hidden">
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || page?.title || 'Travel to Islay'}
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
            <span>Travel to Islay</span>
          </nav>

          {page?.title && (
            <h1 className="font-serif text-5xl mb-8 text-harbour-stone">
              {page.title}
            </h1>
          )}

          {/* Main Content (if any intro text) */}
          {page?.content && (
            <div className="prose prose-lg prose-emerald max-w-none mb-12">
              <PortableText value={page.content} />
            </div>
          )}

          {/* Content Blocks */}
          {page?.contentBlocks && page.contentBlocks.length > 0 && (
            <div className="space-y-12 mb-16">
              <BlockRenderer blocks={page.contentBlocks} />
            </div>
          )}

          {/* FAQ Section - Fully visible per playbook (no accordions) */}
          {resolvedFaqs.length > 0 && (
            <section className="mt-16 pt-8 border-t border-washed-timber">
              <h2 className="font-serif text-3xl mb-8 text-harbour-stone">
                Common Questions About Travelling to Islay
              </h2>
              <div className="space-y-8">
                {resolvedFaqs.map((faqBlock: any) => (
                  <div
                    key={faqBlock._key}
                    className="bg-white rounded-lg p-6 shadow-sm border border-washed-timber"
                  >
                    <h3 className="font-mono text-lg font-semibold text-harbour-stone mb-3">
                      {faqBlock.overrideQuestion || faqBlock.faqBlock.question}
                    </h3>
                    <div className="font-mono text-base text-harbour-stone/80 prose prose-emerald max-w-none">
                      {faqBlock.faqBlock.answer && (
                        <PortableText value={faqBlock.faqBlock.answer} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {(!page?.contentBlocks || page.contentBlocks.length === 0) && resolvedFaqs.length === 0 && (
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
