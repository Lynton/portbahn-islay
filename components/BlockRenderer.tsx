import CanonicalBlock from './CanonicalBlock';

interface BlockReferenceData {
  block: {
    _id: string;
    blockId: { current: string };
    title: string;
    entityType: string;
    canonicalHome: string;
    fullContent: any[];
    teaserContent: any[];
    keyFacts?: Array<{ fact: string; value: string }>;
  };
  version: 'full' | 'teaser';
  showKeyFacts?: boolean;
  customHeading?: string;
}

interface Props {
  blocks?: BlockReferenceData[];
  className?: string;
  hideBlockTitles?: boolean;
  /** Compact card mode — for hub pages. Shows title + first para + CTA in a styled card. */
  compact?: boolean;
}

export default function BlockRenderer({ blocks, className = '', hideBlockTitles = false, compact = false }: Props) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  if (compact) {
    // Hub page: 2-column card grid
    return (
      <div
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2px',
        }}
      >
        {blocks.filter((blockRef) => blockRef?.block?._id).map((blockRef, index) => (
          <CanonicalBlock
            key={blockRef.block._id || index}
            data={blockRef}
            hideTitle={hideBlockTitles}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`block-renderer ${className}`}>
      {blocks.filter((blockRef) => blockRef?.block?._id).map((blockRef, index) => (
        <CanonicalBlock
          key={blockRef.block._id || index}
          data={blockRef}
          hideTitle={hideBlockTitles}
        />
      ))}
    </div>
  );
}
