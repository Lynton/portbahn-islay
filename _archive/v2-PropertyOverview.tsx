import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portable-text";

interface PropertyOverviewProps {
  heading: string;
  /** Portable Text block array from Sanity, or a plain string fallback */
  body: any[] | string;
  pullQuote?: string;
  pullQuoteSource?: string;
  ownerNote?: string;
}

export default function PropertyOverview({
  heading,
  body,
  pullQuote,
  pullQuoteSource,
  ownerNote,
}: PropertyOverviewProps) {
  const hasBody = Array.isArray(body) ? body.length > 0 : !!body;

  return (
    <section
      aria-label="Property overview"
      className="bg-sea-spray"
      style={{ paddingTop: "120px", paddingBottom: "120px" }}
    >
      {/*
        Asymmetric editorial layout — the overview reads like a magazine spread.
        Pull quote is offset to the right of the body column, breaking the grid
        like an editorial callout in Cereal or Kinfolk.
        Max content width ~1120px, but NOT centred — left-aligned with generous
        left padding to create the editorial indent.
      */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 max-w-[1280px]">
        {/* Section heading — serif H2, given room */}
        <h2
          className="font-serif font-bold text-harbour-stone mb-12 md:mb-16 max-w-[20ch]"
          style={{
            fontSize: "clamp(1.75rem, 3vw + 0.5rem, 3rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {heading}
        </h2>

        {/* Body + pull-quote — asymmetric two-column on desktop */}
        <div className="lg:grid lg:grid-cols-[minmax(0,720px)_1fr] lg:gap-x-20 xl:gap-x-28 items-start">
          {/* Main body column — mono, max 65ch, full render (no truncation) */}
          {hasBody && (
            <div
              className="font-mono text-harbour-stone [&_p]:mb-6 [&_p:last-child]:mb-0 [&_a]:text-kelp-edge [&_a]:underline [&_a:hover]:text-emerald-accent"
              style={{
                fontSize: "clamp(1rem, 0.5vw + 0.875rem, 1.125rem)",
                lineHeight: 1.6,
                maxWidth: "65ch",
              }}
            >
              {Array.isArray(body) ? (
                <PortableText value={body} components={portableTextComponents} />
              ) : (
                <p>{body}</p>
              )}
            </div>
          )}

          {/*
            Pull quote — offset right column, editorial callout.
            Not a box, not a card. Just large italic serif text given breathing room,
            set apart from the main column like a Monocle magazine pull quote.
          */}
          {pullQuote && (
            <aside className="mt-12 lg:mt-0 lg:pt-2 lg:pl-0">
              <blockquote className="lg:sticky lg:top-32">
                <p
                  className="font-serif font-bold italic text-harbour-stone"
                  style={{
                    fontSize: "clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)",
                    lineHeight: 1.25,
                  }}
                >
                  {"\u201C"}
                  {pullQuote}
                  {"\u201D"}
                </p>
                {pullQuoteSource && (
                  <footer className="mt-5">
                    <cite
                      className="font-mono text-washed-timber not-italic"
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {pullQuoteSource}
                    </cite>
                  </footer>
                )}
              </blockquote>
            </aside>
          )}
        </div>

        {/* Owner note — personal touch, separated by a quiet washed-timber rule */}
        {ownerNote && (
          <div
            className="border-t border-washed-timber max-w-[65ch]"
            style={{ marginTop: "80px", paddingTop: "40px" }}
          >
            <p
              className="font-mono text-kelp-edge mb-5"
              style={{
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                lineHeight: 1.4,
              }}
            >
              A note from the owners
            </p>
            <p
              className="font-mono text-harbour-stone"
              style={{
                fontSize: "14px",
                lineHeight: 1.65,
                maxWidth: "60ch",
                opacity: 0.8,
              }}
            >
              {ownerNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
