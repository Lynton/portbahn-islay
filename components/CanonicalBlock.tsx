import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/lib/portable-text';
import Link from 'next/link';

interface KeyFact {
  fact: string;
  value: string;
}

interface CanonicalBlockData {
  _id: string;
  blockId: { current: string };
  title: string;
  entityType: string;
  canonicalHome: string;
  fullContent: any[];
  teaserContent: any[];
  keyFacts?: KeyFact[];
}

interface BlockReferenceData {
  block: CanonicalBlockData;
  version: 'full' | 'teaser';
  showKeyFacts?: boolean;
  customHeading?: string;
}

interface Props {
  data: BlockReferenceData;
  className?: string;
  hideTitle?: boolean;
}

export default function CanonicalBlock({ data, className = '', hideTitle = false }: Props) {
  const { block, version, showKeyFacts, customHeading } = data;

  if (!block) {
    console.warn('CanonicalBlock: Missing block data');
    return null;
  }

  const content = version === 'full' ? block.fullContent : block.teaserContent;
  const heading = customHeading || block.title;

  return (
    <section
      className={`canonical-block mb-12 ${className}`}
      data-block-id={block.blockId?.current}
      data-entity-type={block.entityType}
    >
      {/* Section Heading */}
      {!hideTitle && heading && (
        <h2 className="font-serif text-3xl text-harbour-stone mb-6">
          {heading}
        </h2>
      )}

      {/* Portable Text Content */}
      {content && content.length > 0 && (
        <div className="prose-portbahn">
          <PortableText value={content} components={portableTextComponents} />
        </div>
      )}

      {/* Teaser: Auto-append link to canonical */}
      {version === 'teaser' && block.canonicalHome && (
        <p className="mt-4">
          <Link
            href={block.canonicalHome}
            className="font-mono text-emerald-accent hover:underline inline-flex items-center group"
          >
            More about {block.title}
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </p>
      )}

      {/* Key Facts Table (optional) */}
      {showKeyFacts && block.keyFacts && block.keyFacts.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-serif text-xl text-harbour-stone mb-4">Key Facts</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {block.keyFacts.map((fact, idx) => (
              <div key={idx} className="flex flex-col">
                <dt className="font-mono text-sm text-harbour-stone opacity-60 mb-1">
                  {fact.fact}
                </dt>
                <dd className="font-mono text-base text-harbour-stone font-semibold">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
