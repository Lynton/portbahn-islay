import { PortableText } from '@portabletext/react';
import { portableTextComponents, compactPortableTextComponents } from '@/lib/portable-text';
import Link from 'next/link';

interface KeyFact { fact: string; value: string; }

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
  compact?: boolean;
}

export default function CanonicalBlock({ data, className = '', hideTitle = false, compact = false }: Props) {
  const { block, version, showKeyFacts, customHeading } = data;
  if (!block) return null;

  const content = version === 'full' ? block.fullContent : block.teaserContent;
  const heading = customHeading || block.title;

  if (compact) {
    const firstPara = (content || []).slice(0, 1);
    return (
      <div className={`bg-machair-sand border border-washed-timber border-t-[3px] border-t-kelp-edge p-6 pb-5 ${className}`} data-block-id={block.blockId?.current}>
        {block.entityType && <p className="typo-kicker mb-2.5" style={{ letterSpacing: 'var(--tracking-caps)' }}>{block.entityType}</p>}
        {!hideTitle && heading && <h2 className="font-serif font-bold text-[1.2rem] text-harbour-stone leading-snug tracking-snug mb-2.5">{heading}</h2>}
        {firstPara.length > 0 && <div className="mb-3.5"><PortableText value={firstPara} components={compactPortableTextComponents} /></div>}
        {block.canonicalHome && (
          <Link href={block.canonicalHome} className="typo-cta underline underline-offset-[3px]">Read more →</Link>
        )}
      </div>
    );
  }

  return (
    <section className={`border-t border-washed-timber pt-12 mb-14 ${className}`} data-block-id={block.blockId?.current} data-entity-type={block.entityType}>
      {block.entityType && <p className="typo-kicker mb-3">{block.entityType}</p>}
      {!hideTitle && heading && <h2 className="typo-h2 mb-6">{heading}</h2>}
      {content && content.length > 0 && <div><PortableText value={content} components={portableTextComponents} /></div>}

      {version === 'teaser' && block.canonicalHome && (
        <p className="mt-5">
          <Link href={block.canonicalHome} className="font-mono text-base tracking-wide text-kelp-edge underline underline-offset-[3px]">
            More about {block.title} →
          </Link>
        </p>
      )}

      {showKeyFacts && block.keyFacts && block.keyFacts.length > 0 && (
        <div className="mt-7 p-5 bg-machair-sand border-l-[3px] border-kelp-edge">
          <p className="typo-kicker mb-4" style={{ letterSpacing: 'var(--tracking-caps)' }}>Key Facts</p>
          <dl className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {block.keyFacts.map((fact, idx) => (
              <div key={idx}>
                <dt className="font-mono text-sm text-harbour-stone opacity-55 mb-1">{fact.fact}</dt>
                <dd className="font-mono text-lg text-harbour-stone font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
