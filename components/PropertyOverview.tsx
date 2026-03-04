interface PropertyOverviewProps {
  heading: string;
  body: string;
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
  return (
    <section
      aria-label="Property overview"
      className="bg-sea-spray px-6 md:px-12 lg:px-20 py-20 md:py-[120px]"
    >
      <div className="max-w-[960px]">
        {/* Section heading */}
        <h2 className="font-serif font-bold text-harbour-stone text-[1.75rem] leading-[1.12] md:text-[2.75rem] md:leading-[1.1] mb-10 md:mb-14">
          {heading}
        </h2>

        {/* Body + pull-quote layout — asymmetric editorial grid */}
        <div className="md:grid md:grid-cols-[1fr_280px] md:gap-x-16 lg:gap-x-24 items-start">
          {/* Main body column — max 65ch, mono */}
          <div>
            <p className="font-mono text-base leading-[1.6] text-harbour-stone max-w-[65ch] md:text-[1.0625rem] md:leading-[1.6]">
              {body}
            </p>
          </div>

          {/* Pull quote — offset right of body, editorial callout */}
          {pullQuote && (
            <aside className="mt-10 md:mt-0 md:pt-4">
              <blockquote>
                <p className="font-serif font-bold italic text-harbour-stone text-xl leading-[1.25] md:text-2xl md:leading-[1.2]">
                  {`\u201C${pullQuote}\u201D`}
                </p>
                {pullQuoteSource && (
                  <footer className="mt-4">
                    <cite className="font-mono text-xs tracking-[0.1em] uppercase text-washed-timber not-italic">
                      {pullQuoteSource}
                    </cite>
                  </footer>
                )}
              </blockquote>
            </aside>
          )}
        </div>

        {/* Owner note */}
        {ownerNote && (
          <div className="mt-16 md:mt-20 pt-10 border-t border-washed-timber max-w-[65ch]">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-kelp-edge mb-4">
              A note from the owners
            </p>
            <p className="font-mono text-sm leading-[1.6] text-harbour-stone/80">
              {ownerNote}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
