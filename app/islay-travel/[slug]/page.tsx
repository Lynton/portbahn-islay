import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import BlockRenderer from '@/components/BlockRenderer';
import SchemaMarkup from '@/components/SchemaMarkup';
import type { SchemaType } from '@/lib/schema-markup';
import EntityCard from '@/components/EntityCard';
import GuideMap from '@/components/GuideMap';
import { portableTextComponents } from '@/lib/portable-text';

export const revalidate = 60;

const TRAVEL_SLUGS = [
  'ferry-to-islay',
  'flights-to-islay',
  'planning-your-trip',
  'travelling-without-a-car',
  'travelling-to-islay-with-your-dog',
  'arriving-on-islay',
  'getting-around-islay',
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

type PTBlock = { _type: string; children?: Array<{ text?: string }> };

interface FaqItem {
  _id: string;
  question: string;
  answer: PTBlock[];
}

const getTravelGuidePage = cache(async (slug: string) => {
  const query = `*[_type == "guidePage" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
    _id,
    title,
    slug,
    heroImage,
    introduction,
    schemaType,
    "contentBlocks": contentBlocks[defined(block._ref)]{
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
    }[defined(block._id)],
    extendedEditorial,
    "featuredEntities": featuredEntities[defined(@->_id)]->{
      _id,
      entityId,
      name,
      category,
      schemaOrgType,
      island,
      status,
      shortDescription,
      editorialNote,
      importantNote,
      canonicalExternalUrl,
      ecosystemSite,
      location,
      contact,
      openingHours,
      attributes,
      tags
    },
    "faqBlocks": faqBlocks[defined(@->_id)]->{_id, question, answer},
    seoTitle,
    seoDescription
  }`;

  return await client.fetch(query, { slug }, {
    cache: 'no-store',
  });
});

export async function generateStaticParams() {
  return TRAVEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getTravelGuidePage(slug);

  if (!page) {
    return { title: 'Guide Not Found | Portbahn Islay' };
  }

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.co.uk'}/islay-travel/${slug}`;

  return {
    title: page.seoTitle || `${page.title} | Portbahn Islay`,
    description: page.seoDescription || `Discover ${page.title} — travel guide for the Isle of Islay.`,
    alternates: { canonical: canonicalUrl },
  };
}

export default async function TravelSubPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getTravelGuidePage(slug);

  if (!page) {
    notFound();
  }

  const schemaType = page.schemaType || 'Article';

  const faqsForSchema = ((page.faqBlocks ?? []) as (FaqItem | null)[])
    .filter((faq): faq is FaqItem => !!faq?.question)
    .map((faq) => ({
      question: faq.question,
      answerText: faq.answer
        .filter((b) => b._type === 'block')
        .map((b) => (b.children ?? []).map((c) => c.text ?? '').join(''))
        .join(' '),
    }));

  const schemaData = {
    name: page.title,
    description: page.seoDescription || page.introduction || `Travel guide: ${page.title} — Isle of Islay.`,
    url: `/islay-travel/${slug}`,
    slug: { current: slug },
    title: page.title,
    seoDescription: page.seoDescription,
    heroImage: page.heroImage,
    faqBlocks: faqsForSchema,
  };

  const schemaTypes: SchemaType[] = [schemaType as SchemaType, 'TouristAttraction', 'BreadcrumbList'];
  if (faqsForSchema.length > 0) schemaTypes.push('FAQPage');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entities: any[] = page.featuredEntities ?? [];

  return (
    <>
      <SchemaMarkup
        type={schemaTypes}
        data={schemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Travel to Islay', url: '/islay-travel' },
          { name: page.title, url: `/islay-travel/${slug}` },
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
            <Link href="/islay-travel" className="hover:text-emerald-accent">Travel to Islay</Link>
            <span className="mx-2">→</span>
            <span>{page.title}</span>
          </nav>

          <h1 className="font-serif text-5xl mb-8 text-harbour-stone">
            {page.title}
          </h1>

          {page.introduction && (
            <p className="font-mono text-lg text-harbour-stone/80 mb-12 leading-relaxed">
              {page.introduction}
            </p>
          )}

          {page.contentBlocks && page.contentBlocks.length > 0 && (
            <div className="space-y-12 mb-16">
              <BlockRenderer blocks={page.contentBlocks} />
            </div>
          )}

          {page.extendedEditorial && page.extendedEditorial.length > 0 && (
            <div className="guide-extended-editorial mb-16">
              <PortableText value={page.extendedEditorial} components={portableTextComponents} />
            </div>
          )}

          {entities.length > 0 && (
            <div className="mb-16">
              <GuideMap entities={entities} pageTitle={page.title} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entities.map((entity) => (
                  <EntityCard key={entity._id} entity={entity} />
                ))}
              </div>
            </div>
          )}

          {page.faqBlocks && page.faqBlocks.length > 0 && (
            <section className="mt-4 pt-8 border-t border-washed-timber">
              <div className="space-y-8">
                {page.faqBlocks.filter((faq: FaqItem) => faq && faq.question).map((faq: FaqItem) => (
                  <div key={faq._id}>
                    <h3 className="font-mono text-lg font-semibold text-harbour-stone mb-3">
                      {faq.question}
                    </h3>
                    <div className="font-mono text-base text-harbour-stone/80 prose prose-emerald max-w-none">
                      <PortableText value={faq.answer} components={portableTextComponents} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 pt-8 border-t border-washed-timber space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-harbour-stone mb-4">Stay on Islay</h2>
              <ul className="font-mono text-base space-y-2">
                <li><Link href="/accommodation/portbahn-house" className="text-emerald-accent hover:underline">Portbahn House — sleeps 8, dogs welcome, 5 minutes from Bruichladdich Distillery</Link></li>
                <li><Link href="/accommodation/shorefield-eco-house" className="text-emerald-accent hover:underline">Shorefield Eco House — sleeps 6, dogs welcome, private bird hides</Link></li>
                <li><Link href="/accommodation/curlew-cottage" className="text-emerald-accent hover:underline">Curlew Cottage — sleeps 6, walled garden, quiet and pet-free</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-harbour-stone mb-4">More travel information</h2>
              <ul className="font-mono text-base space-y-2">
                {TRAVEL_SLUGS.filter((s) => s !== slug).map((s) => {
                  const labels: Record<string, string> = {
                    'ferry-to-islay': 'Ferry to Islay — CalMac timetables & booking',
                    'flights-to-islay': 'Flights to Islay — Loganair from Glasgow',
                    'planning-your-trip': 'Planning your Islay trip',
                    'travelling-without-a-car': 'Travelling to Islay without a car',
                    'travelling-to-islay-with-your-dog': 'Travelling to Islay with your dog',
                    'arriving-on-islay': 'Arriving on Islay — ports, late arrivals & cancellations',
                    'getting-around-islay': 'Getting around Islay — taxis, buses & bike hire',
                  };
                  return (
                    <li key={s}>
                      <Link href={`/islay-travel/${s}`} className="text-emerald-accent hover:underline">
                        {labels[s]}
                      </Link>
                    </li>
                  );
                })}
                <li><Link href="/islay-travel" className="text-emerald-accent hover:underline">← Travel to Islay overview</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
