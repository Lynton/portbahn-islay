import Link from 'next/link';

/**
 * Shared PortableText component configuration
 * Used across all pages rendering Sanity block content
 */
export const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="font-mono text-base text-harbour-stone mb-4 leading-relaxed">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-serif text-2xl text-harbour-stone mb-4 mt-10">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-serif text-xl text-harbour-stone mb-3 mt-6">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ children, value }: any) => {
      const href = value?.href || '';
      const isExternal = href.startsWith('http');
      return isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-accent hover:underline"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="text-emerald-accent hover:underline">
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-1 mb-4 font-mono text-base text-harbour-stone ml-4">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 font-mono text-base text-harbour-stone ml-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
  types: {
    // Render horizontal rules from Sanity portable text — prevents "---" rendering as literal text
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    break: (_props: any) => <hr className="my-8 border-washed-timber" />,
  },
};
