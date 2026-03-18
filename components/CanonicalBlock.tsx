import { PortableText } from '@portabletext/react';
import { portableTextComponents, compactPortableTextComponents } from '@/lib/portable-text';
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
  /** Compact card mode — used on hub pages. Shows title + first para + CTA only. */
  compact?: boolean;
}

export default function CanonicalBlock({ data, className = '', hideTitle = false, compact = false }: Props) {
  const { block, version, showKeyFacts, customHeading } = data;

  if (!block) {
    console.warn('CanonicalBlock: Missing block data');
    return null;
  }

  const content = version === 'full' ? block.fullContent : block.teaserContent;
  const heading = customHeading || block.title;

  // Compact mode: card for hub pages
  if (compact) {
    const firstPara = (content || []).slice(0, 1);

    return (
      <div
        className={className}
        style={{
          background: 'var(--color-machair-sand)',
          border: '1px solid var(--color-washed-timber)',
          borderTop: '3px solid var(--color-kelp-edge)',
          padding: '24px 24px 20px',
        }}
        data-block-id={block.blockId?.current}
      >
        {/* Entity type kicker */}
        {block.entityType && (
          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-kelp-edge)',
            marginBottom: '10px',
          }}>
            {block.entityType}
          </p>
        )}

        {/* Heading */}
        {!hideTitle && heading && (
          <h2 style={{
            fontFamily: '"The Seasons", Georgia, serif',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: 'var(--color-harbour-stone)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            marginBottom: '10px',
          }}>
            {heading}
          </h2>
        )}

        {/* First paragraph */}
        {firstPara.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <PortableText value={firstPara} components={compactPortableTextComponents} />
          </div>
        )}

        {/* CTA */}
        {block.canonicalHome && (
          <Link
            href={block.canonicalHome}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-kelp-edge)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Read more →
          </Link>
        )}
      </div>
    );
  }

  // ── FULL mode — editorial section on spoke pages ──────────────────────────
  return (
    <section
      className={className}
      style={{
        borderTop: '1px solid var(--color-washed-timber)',
        paddingTop: '48px',
        marginBottom: '56px',
      }}
      data-block-id={block.blockId?.current}
      data-entity-type={block.entityType}
    >
      {/* Entity type kicker */}
      {block.entityType && (
        <p style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-kelp-edge)',
          marginBottom: '12px',
        }}>
          {block.entityType}
        </p>
      )}

      {/* Section heading */}
      {!hideTitle && heading && (
        <h2 style={{
          fontFamily: '"The Seasons", Georgia, serif',
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
          color: 'var(--color-harbour-stone)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          marginBottom: '24px',
        }}>
          {heading}
        </h2>
      )}

      {/* Content */}
      {content && content.length > 0 && (
        <div>
          <PortableText value={content} components={portableTextComponents} />
        </div>
      )}

      {/* Teaser CTA */}
      {version === 'teaser' && block.canonicalHome && (
        <p style={{ marginTop: '20px' }}>
          <Link
            href={block.canonicalHome}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              letterSpacing: '0.06em',
              color: 'var(--color-kelp-edge)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            More about {block.title} →
          </Link>
        </p>
      )}

      {/* Key Facts */}
      {showKeyFacts && block.keyFacts && block.keyFacts.length > 0 && (
        <div style={{
          marginTop: '28px',
          padding: '20px 24px',
          background: 'var(--color-machair-sand)',
          borderLeft: '3px solid var(--color-kelp-edge)',
        }}>
          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--color-kelp-edge)',
            marginBottom: '16px',
          }}>
            Key Facts
          </p>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {block.keyFacts.map((fact, idx) => (
              <div key={idx}>
                <dt style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px', color: 'var(--color-harbour-stone)', opacity: 0.55, marginBottom: '4px' }}>
                  {fact.fact}
                </dt>
                <dd style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '13px', color: 'var(--color-harbour-stone)', fontWeight: 600 }}>
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
