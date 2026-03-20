import Link from 'next/link';

/**
 * Shared PortableText component configuration
 * Uses typo-* presets + Tailwind utilities from design system
 */

export const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="font-mono text-lg text-harbour-stone leading-wide opacity-85 mb-5">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="typo-h2 mt-12 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-serif font-bold text-[1.25rem] text-harbour-stone leading-snug mt-8 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="font-serif italic text-harbour-stone leading-relaxed border-l-[3px] border-emerald-accent pl-6 my-9" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)' }}>
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => {
      const href = value?.href || '';
      const cls = 'text-emerald-accent underline underline-offset-[3px] hover:opacity-75 transition-opacity';
      return href.startsWith('http') ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
      ) : (
        <Link href={href} className={cls}>{children}</Link>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="font-mono text-lg text-harbour-stone opacity-85 pl-2 flex flex-col gap-1.5 mb-5" style={{ listStyleType: 'disc', listStylePosition: 'inside' }}>
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="font-mono text-lg text-harbour-stone opacity-85 pl-2 flex flex-col gap-1.5 mb-5" style={{ listStyleType: 'decimal', listStylePosition: 'inside' }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  types: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    break: (_props: any) => <hr className="my-10 border-t border-washed-timber" />,
  },
};

// Compact version for hub page teasers — suppresses headings, smaller text
export const compactPortableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="font-mono text-md text-harbour-stone opacity-72 leading-body m-0">{children}</p>
    ),
    h2: () => null,
    h3: () => null,
    blockquote: ({ children }: any) => (
      <p className="font-mono text-md text-harbour-stone opacity-72 leading-body italic m-0">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children }: any) => <span>{children}</span>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="m-0 pl-3">{children}</ul>,
    number: ({ children }: any) => <ol className="m-0 pl-3">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="font-mono text-md text-harbour-stone opacity-72">{children}</li>,
    number: ({ children }: any) => <li className="font-mono text-md text-harbour-stone opacity-72">{children}</li>,
  },
  types: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    break: (_props: any) => null,
  },
};
