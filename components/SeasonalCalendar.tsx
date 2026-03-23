import type { SiteEntity } from '@/lib/types';

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── Component ───────────────────────────────────────────────────────────────

interface SeasonalCalendarProps {
  entities: SiteEntity[];
}

export default function SeasonalCalendar({ entities }: SeasonalCalendarProps) {
  // Filter to entities with bestMonths data
  const calendarEntities = entities.filter(
    (e) => e.attributes?.bestMonths && e.attributes.bestMonths.length > 0
  );

  if (calendarEntities.length === 0) return null;

  return (
    <div className="seasonal-calendar overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left font-mono text-xs uppercase tracking-widest text-harbour-stone/50 pb-3 pr-4 border-b border-washed-timber min-w-[160px]">
              Site
            </th>
            {MONTHS.map((month) => (
              <th key={month} className="text-center font-mono text-xs uppercase tracking-wider text-harbour-stone/50 pb-3 px-1 border-b border-washed-timber" style={{ minWidth: '36px' }}>
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarEntities.map((entity) => {
            const bestMonths = new Set(entity.attributes!.bestMonths!);
            const isYearRound = bestMonths.size === 12;

            return (
              <tr key={entity._id} className="border-b border-washed-timber/50">
                <td className="py-3 pr-4">
                  <span className="font-serif text-base text-harbour-stone leading-snug">
                    {entity.contact?.website ? (
                      <a href={entity.contact.website} target="_blank" rel="noopener noreferrer" className="hover-link">
                        {entity.name}
                      </a>
                    ) : (
                      entity.name
                    )}
                  </span>
                  {entity.attributes?.keySpecies && entity.attributes.keySpecies.length > 0 && (
                    <span className="block font-mono text-xs text-harbour-stone/40 mt-0.5">
                      {entity.attributes.keySpecies.slice(0, 3).join(', ')}
                      {entity.attributes.keySpecies.length > 3 && ` +${entity.attributes.keySpecies.length - 3}`}
                    </span>
                  )}
                  {entity.attributes?.habitatType && (
                    <span className="block font-mono text-xs text-harbour-stone/30 mt-0.5 capitalize">
                      {entity.attributes.habitatType}
                    </span>
                  )}
                </td>
                {MONTHS.map((month) => {
                  const isActive = bestMonths.has(month);
                  return (
                    <td key={month} className="py-3 px-1 text-center">
                      {isActive ? (
                        <span
                          className="inline-block w-5 h-5 rounded-full"
                          style={{
                            backgroundColor: isYearRound
                              ? 'var(--color-emerald-accent)'
                              : 'var(--color-kelp-edge)',
                            opacity: isYearRound ? 0.4 : 0.85,
                          }}
                        />
                      ) : (
                        <span className="inline-block w-5 h-5 rounded-full bg-washed-timber/20" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex gap-6 mt-4 pt-3 border-t border-washed-timber/30">
        <span className="flex items-center gap-2 font-mono text-xs text-harbour-stone/50">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-kelp-edge)', opacity: 0.85 }} />
          Best months
        </span>
        <span className="flex items-center gap-2 font-mono text-xs text-harbour-stone/50">
          <span className="inline-block w-3 h-3 rounded-full bg-washed-timber/20" />
          Not peak season
        </span>
      </div>
    </div>
  );
}
