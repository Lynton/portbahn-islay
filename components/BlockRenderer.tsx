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
}

export default function BlockRenderer({ blocks, className = '', hideBlockTitles = false }: Props) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={`block-renderer space-y-12 ${className}`}>
      {blocks.map((blockRef, index) => (
        <CanonicalBlock
          key={blockRef.block._id || index}
          data={blockRef}
          hideTitle={hideBlockTitles}
        />
      ))}
    </div>
  );
}
