import Image from 'next/image';
import Link from 'next/link';
import SchemaMarkup from '@/components/SchemaMarkup';
import BlockRenderer from '@/components/BlockRenderer';
import { urlFor } from '@/sanity/lib/image';

interface HubPageProps {
  page: {
    _id?: string;
    title?: string;
    heroImage?: {
      alt?: string;
      asset: { _ref: string };
    };
    seoDescription?: string;
    contentBlocks?: any[];
  } | null;
  cards: Array<{
    _id: string;
    title?: string;
    name?: string;
    slug?: { current: string };
    introduction?: string;
    headline?: string;
    heroImage?: {
      alt?: string;
      asset: { _ref: string };
    };
  }>;
  config: {
    breadcrumbs: Array<{ label: string; href?: string }>;
    introText: string;
    sectionHeading: string;
    cardLinkPrefix: string;
    cardLinkSuffix?: string;
    emptyStateMessage?: string;
    backLink: { href: string; label: string };
    schemaType: 'CollectionPage';
    schemaData: {
      name: string;
      description: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      about?: any;
      hasPart?: Array<{ type: string; url: string; name: string }>;
    };
  };
}

/**
 * HubPage Component - Reusable hub page template
 *
 * Used by /explore-islay, /getting-here, and /accommodation
 * Implements hub-and-spoke architecture with teaser cards
 */
export default function HubPage({ page, cards, config }: HubPageProps) {
  return (
    <>
      <SchemaMarkup
        type={[config.schemaType, 'BreadcrumbList']}
        data={config.schemaData}
        breadcrumbs={config.breadcrumbs
          .filter((c) => !!c.href)
          .map((c) => ({ name: c.label, url: c.href! }))}
      />
      <main className="min-h-screen bg-sea-spray">
        {page?.heroImage && (
          <div className="w-full h-[40vh] relative overflow-hidden">
            <Image
              src={urlFor(page.heroImage).width(1600).height(640).url()}
              alt={page.heroImage.alt || page?.title || 'Portbahn Islay'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Breadcrumbs */}
          <nav className="mb-6 font-mono text-sm text-harbour-stone/70">
            {config.breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-emerald-accent">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {index < config.breadcrumbs.length - 1 && (
                  <span className="mx-2">→</span>
                )}
              </span>
            ))}
          </nav>

          {/* Page Title */}
          <h1 className="font-serif text-5xl mb-4 text-harbour-stone">
            {page?.title || config.breadcrumbs[config.breadcrumbs.length - 1].label}
          </h1>

          {/* Introduction */}
          <p className="font-mono text-lg text-harbour-stone/80 mb-12 leading-relaxed max-w-2xl">
            {config.introText}
          </p>

          {/* Canonical Content Blocks */}
          {page?.contentBlocks && page.contentBlocks.length > 0 && (
            <BlockRenderer blocks={page.contentBlocks} className="mb-16" />
          )}

          {/* Cards Grid */}
          {cards && cards.length > 0 && (
            <>
              <h2 className="font-serif text-3xl text-harbour-stone mb-8">
                {config.sectionHeading}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {cards.map((card) => {
                  const cardTitle = card.title || card.name || 'Untitled';
                  const cardDescription = card.introduction || card.headline;
                  const cardSlug = card.slug?.current;

                  return (
                    <Link
                      key={card._id}
                      href={`${config.cardLinkPrefix}${cardSlug}`}
                      className="group bg-white rounded-lg overflow-hidden shadow-sm border border-washed-timber hover:shadow-md transition-shadow"
                    >
                      {card.heroImage && (
                        <div className="relative h-48 md:h-64 overflow-hidden">
                          <Image
                            src={urlFor(card.heroImage).width(600).height(400).url()}
                            alt={card.heroImage.alt || cardTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="font-serif text-2xl text-harbour-stone mb-2 group-hover:text-emerald-accent transition-colors">
                          {cardTitle}
                        </h2>
                        {cardDescription && (
                          <p className="font-mono text-sm text-harbour-stone/70 mb-4 line-clamp-2">
                            {cardDescription}
                          </p>
                        )}
                        <span className="font-mono text-sm text-emerald-accent group-hover:underline" aria-hidden="true">
                          {config.cardLinkSuffix || 'View details →'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Empty state */}
          {(!cards || cards.length === 0) && (
            <div className="text-center py-12">
              <p className="font-mono text-base text-harbour-stone mb-8">
                {config.emptyStateMessage || 'Content coming soon.'}
              </p>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-12 pt-8 border-t border-washed-timber">
            <Link
              href={config.backLink.href}
              className="font-mono text-emerald-accent hover:underline"
            >
              ← {config.backLink.label}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
