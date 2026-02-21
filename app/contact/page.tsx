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
 * Contact Page
 *
 * Simple contact page with email, phone, address from Sanity.
 * Can also display content blocks (e.g. ferry-support teaser)
 * and FAQ blocks if wired in Sanity.
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

const getContactPage = cache(async () => {
  const query = `*[_type == "contactPage" && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    scopeIntro,
    heroImage,
    email,
    phone,
    address,
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

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();

  return {
    title: page?.seoTitle || 'Contact Us | Portbahn Islay',
    description: page?.seoDescription || 'Get in touch with Pi and Lynton about holiday accommodation on Islay. We love helping guests plan their trips.',
  };
}

export default async function ContactPage() {
  const page = await getContactPage();

  const schemaData = {
    name: 'Contact Portbahn Islay',
    description: page?.seoDescription || 'Contact Pi and Lynton about holiday accommodation on the Isle of Islay.',
    url: '/contact',
  };

  return (
    <>
      <SchemaMarkup
        type={['WebPage', 'BreadcrumbList']}
        data={schemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
      />
      <main className="min-h-screen bg-sea-spray">
        {page?.heroImage && (
          <div className="w-full h-[40vh] relative overflow-hidden">
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || 'Contact Portbahn Islay'}
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
            <span>Contact</span>
          </nav>

          <h1 className="font-serif text-5xl mb-4 text-harbour-stone">
            {page?.title || 'Get in Touch'}
          </h1>

          {page?.scopeIntro && (
            <p className="font-mono text-lg text-harbour-stone/80 mb-12 leading-relaxed max-w-2xl">
              {page.scopeIntro}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Contact Details */}
            <div>
              <h2 className="font-serif text-2xl text-harbour-stone mb-6">
                Contact Details
              </h2>

              <div className="space-y-6">
                {page?.email && (
                  <div>
                    <h3 className="font-mono text-sm text-harbour-stone/60 uppercase tracking-wider mb-1">
                      Email
                    </h3>
                    <a
                      href={`mailto:${page.email}`}
                      className="font-mono text-lg text-emerald-accent hover:underline"
                    >
                      {page.email}
                    </a>
                  </div>
                )}

                {page?.phone && (
                  <div>
                    <h3 className="font-mono text-sm text-harbour-stone/60 uppercase tracking-wider mb-1">
                      Phone
                    </h3>
                    <a
                      href={`tel:${page.phone.replace(/\s/g, '')}`}
                      className="font-mono text-lg text-emerald-accent hover:underline"
                    >
                      {page.phone}
                    </a>
                  </div>
                )}

                {page?.address && (
                  <div>
                    <h3 className="font-mono text-sm text-harbour-stone/60 uppercase tracking-wider mb-1">
                      Address
                    </h3>
                    <p className="font-mono text-base text-harbour-stone/80 whitespace-pre-line">
                      {page.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Fallback if Sanity data not populated */}
              {!page?.email && !page?.phone && !page?.address && (
                <p className="font-mono text-base text-harbour-stone/70">
                  Contact details will appear here once added in Sanity Studio.
                </p>
              )}
            </div>

            {/* Response Info */}
            <div className="bg-white rounded-lg p-6 border border-washed-timber h-fit">
              <h2 className="font-serif text-2xl text-harbour-stone mb-4">
                We&apos;re here to help
              </h2>
              <div className="space-y-4 font-mono text-base text-harbour-stone/80">
                <p>
                  Whether you&apos;re planning your first trip to Islay or you&apos;re a returning guest, we&apos;re happy to help with:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start">
                    <span className="text-emerald-accent mr-2 mt-0.5">&bull;</span>
                    Property availability and booking queries
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-accent mr-2 mt-0.5">&bull;</span>
                    Ferry booking advice and travel planning
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-accent mr-2 mt-0.5">&bull;</span>
                    Local tips — restaurants, walks, distilleries
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-accent mr-2 mt-0.5">&bull;</span>
                    Accessibility or specific needs
                  </li>
                </ul>
                <p className="text-sm text-harbour-stone/60 pt-2 border-t border-washed-timber">
                  We hold a <strong>5.0/5 communication rating</strong> and typically respond within a few hours.
                </p>
              </div>
            </div>
          </div>

          {/* Content Blocks (e.g. ferry-support teaser if wired) */}
          {page?.contentBlocks && page.contentBlocks.length > 0 && (
            <BlockRenderer blocks={page.contentBlocks} className="mb-16" />
          )}

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
