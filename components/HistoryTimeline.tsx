import type { SiteEntity } from '@/lib/types';

// ─── Component ───────────────────────────────────────────────────────────────

interface HistoryTimelineProps {
  entities: SiteEntity[];
}

export default function HistoryTimeline({ entities }: HistoryTimelineProps) {
  // Filter to entities that have centuryDate, sort by a rough chronological key
  const timelineEntities = entities
    .filter((e) => e.attributes?.centuryDate)
    .sort((a, b) => {
      const aDate = a.attributes!.centuryDate!;
      const bDate = b.attributes!.centuryDate!;
      return parseTimelineSort(aDate) - parseTimelineSort(bDate);
    });

  if (timelineEntities.length === 0) return null;

  return (
    <div className="history-timeline">
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-[11px] top-0 bottom-0 w-px"
          style={{ backgroundColor: 'var(--color-washed-timber)' }}
        />

        <div className="flex flex-col gap-8">
          {timelineEntities.map((entity) => (
            <div key={entity._id} className="relative pl-10">
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-1 w-[23px] h-[23px] rounded-full border-2 bg-sea-spray"
                style={{ borderColor: 'var(--color-kelp-edge)' }}
              />

              {/* Date badge */}
              <p className="font-mono text-xs font-semibold text-kelp-edge mb-1">
                {entity.attributes!.centuryDate}
              </p>

              {/* Entity name */}
              <h4 className="font-serif font-bold text-lg text-harbour-stone leading-snug mb-1">
                {entity.contact?.website ? (
                  <a href={entity.contact.website} target="_blank" rel="noopener noreferrer" className="hover-link">
                    {entity.name}
                  </a>
                ) : (
                  entity.name
                )}
              </h4>

              {/* Significance note or heritage period */}
              {entity.attributes?.significanceNote && (
                <p className="font-mono text-sm text-harbour-stone/70 leading-relaxed">
                  {entity.attributes.significanceNote}
                </p>
              )}

              {/* Location */}
              {entity.location?.village && (
                <p className="font-mono text-xs text-harbour-stone/40 mt-1.5">
                  {entity.location.village}
                  {entity.location.distanceFromBruichladdich && ` · ${entity.location.distanceFromBruichladdich}`}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sort helper ─────────────────────────────────────────────────────────────
// Extracts a rough numeric sort key from centuryDate strings
// "8th century" → -800, "1779" → 1779, "~1.2 billion years ago" → -1200000000

function parseTimelineSort(dateStr: string): number {
  // Billions
  const billionMatch = dateStr.match(/([\d.]+)\s*billion/i);
  if (billionMatch) return -parseFloat(billionMatch[1]) * 1_000_000_000;

  // Millions
  const millionMatch = dateStr.match(/([\d.]+)\s*million/i);
  if (millionMatch) return -parseFloat(millionMatch[1]) * 1_000_000;

  // Century format: "8th century", "15th century"
  const centuryMatch = dateStr.match(/(\d+)(?:st|nd|rd|th)\s*century/i);
  if (centuryMatch) return (parseInt(centuryMatch[1]) - 1) * 100;

  // Year range: "12th–16th century" → use start
  const rangeMatch = dateStr.match(/(\d+)(?:st|nd|rd|th)/i);
  if (rangeMatch) {
    const num = parseInt(rangeMatch[1]);
    // If it looks like a century number (< 30), convert
    if (num < 30 && dateStr.toLowerCase().includes('century')) return (num - 1) * 100;
  }

  // Plain year or year range: "1779", "1946–1949", "12th–17th century"
  const yearMatch = dateStr.match(/(\d{4})/);
  if (yearMatch) return parseInt(yearMatch[1]);

  // Century range without "century" word: "12th–16th"
  const shortCenturyMatch = dateStr.match(/(\d+)(?:st|nd|rd|th)/);
  if (shortCenturyMatch) return (parseInt(shortCenturyMatch[1]) - 1) * 100;

  return 0;
}
