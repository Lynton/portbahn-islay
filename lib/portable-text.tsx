import Link from 'next/link';

/**
 * Shared PortableText component configuration
 * Concept-1b design system — inline styles throughout
 */

const monoStyle = {
  fontFamily: '"IBM Plex Mono", monospace',
  fontSize: '13.5px',
  color: 'var(--color-harbour-stone)',
  lineHeight: 1.75,
  marginBottom: '20px',
  opacity: 0.85,
} as React.CSSProperties;

export const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p style={monoStyle}>{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 style={{
        fontFamily: '"The Seasons", Georgia, serif',
        fontWeight: 700,
        fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
        color: 'var(--color-harbour-stone)',
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
        marginBottom: '16px',
        marginTop: '48px',
      }}>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{
        fontFamily: '"The Seasons", Georgia, serif',
        fontWeight: 700,
        fontSize: '1.25rem',
        color: 'var(--color-harbour-stone)',
        lineHeight: 1.15,
        marginBottom: '12px',
        marginTop: '32px',
      }}>{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: '3px solid var(--color-emerald-accent)',
        paddingLeft: '24px',
        margin: '36px 0',
        fontFamily: '"The Seasons", Georgia, serif',
        fontStyle: 'italic',
        fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
        color: 'var(--color-harbour-stone)',
        lineHeight: 1.55,
      }}>{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 600 }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: 'italic' }}>{children}</em>
    ),
    link: ({ children, value }: any) => {
      const href = value?.href || '';
      const isExternal = href.startsWith('http');
      return isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-emerald-accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          {children}
        </a>
      ) : (
        <Link href={href} style={{ color: 'var(--color-emerald-accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => (
      <ul style={{
        listStyleType: 'disc',
        listStylePosition: 'inside',
        marginBottom: '20px',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '13.5px',
        color: 'var(--color-harbour-stone)',
        opacity: 0.85,
        paddingLeft: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      } as React.CSSProperties}>
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol style={{
        listStyleType: 'decimal',
        listStylePosition: 'inside',
        marginBottom: '20px',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '13.5px',
        color: 'var(--color-harbour-stone)',
        opacity: 0.85,
        paddingLeft: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      } as React.CSSProperties}>
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
    break: (_props: any) => (
      <hr style={{ margin: '40px 0', borderTop: '1px solid var(--color-washed-timber)', borderBottom: 'none' }} />
    ),
  },
};

// Compact version for hub page teasers — suppresses headings, smaller text
export const compactPortableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p style={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '12px',
        color: 'var(--color-harbour-stone)',
        opacity: 0.72,
        lineHeight: 1.65,
        margin: 0,
      }}>{children}</p>
    ),
    h2: ({ children }: any) => null,
    h3: ({ children }: any) => null,
    blockquote: ({ children }: any) => (
      <p style={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '12px',
        color: 'var(--color-harbour-stone)',
        opacity: 0.72,
        lineHeight: 1.65,
        margin: 0,
        fontStyle: 'italic',
      }}>{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ children }: any) => <span>{children}</span>,
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ margin: 0, paddingLeft: '12px' }}>{children}</ul>,
    number: ({ children }: any) => <ol style={{ margin: 0, paddingLeft: '12px' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-harbour-stone)', opacity: 0.72 }}>{children}</li>,
    number: ({ children }: any) => <li style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px', color: 'var(--color-harbour-stone)', opacity: 0.72 }}>{children}</li>,
  },
  types: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    break: (_props: any) => null,
  },
};
