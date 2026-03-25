import Link from 'next/link';
import type { SiteEntity } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EntityCardProps {
  entity: SiteEntity;
  /** 'sand' renders on sand background — uses shadow instead of border for contrast.
   *  'compact' renders a slim contact card (name + key stats + contact links, no description). */
  variant?: 'default' | 'sand' | 'compact';
}

// ─── Category label map ───────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  distillery: 'Distillery',
  restaurant: 'Restaurant',
  cafe: 'Café / Shop',
  beach: 'Beach',
  'nature-reserve': 'Nature Reserve',
  heritage: 'Heritage Site',
  route: 'Walking Route',
  activity: 'Activity',
  attraction: 'Attraction',
  village: 'Village',
  transport: 'Transport',
  event: 'Event',
  accommodation: 'Accommodation',
  other: 'Other',
};

// ─── Difficulty label ─────────────────────────────────────────────────────────

function difficultyLabel(d: string) {
  if (d === 'easy') return 'Easy';
  if (d === 'moderate') return 'Moderate';
  if (d === 'strenuous') return 'Strenuous';
  return d;
}

// ─── Format duration ──────────────────────────────────────────────────────────

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

// ─── Ecosystem-linked card (Jura entities → IoJ) ──────────────────────────────

function EcosystemCard({ entity }: EntityCardProps) {
  return (
    <article className="border border-washed-timber rounded p-5 bg-white">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-serif text-xl text-harbour-stone">{entity.name}</h3>
        <span className="font-mono text-xs text-harbour-stone/50 shrink-0 pt-1">
          {CATEGORY_LABELS[entity.category] || entity.category}
        </span>
      </div>

      {entity.shortDescription && (
        <p className="font-mono text-sm text-harbour-stone/70 mb-4 leading-relaxed">
          {entity.shortDescription}
        </p>
      )}

      {entity.location?.distanceFromBruichladdich && (
        <p className="font-mono text-xs text-harbour-stone/60 mb-3">
          {entity.location.distanceFromBruichladdich}
        </p>
      )}

      <Link
        href={entity.canonicalExternalUrl!}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm text-emerald-accent hover:underline inline-flex items-center group"
      >
        Full details on isleofjura.scot
        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </article>
  );
}

// ─── Main EntityCard ──────────────────────────────────────────────────────────

export default function EntityCard({ entity, variant = 'default' }: EntityCardProps) {
  // Ecosystem-linked entities: brief card + outbound link only
  if (entity.canonicalExternalUrl && entity.ecosystemSite !== 'pbi') {
    return <EcosystemCard entity={entity} />;
  }

  const { category, attributes, location, contact, openingHours, importantNote } = entity;
  const isRoute = category === 'route';
  const isBeach = category === 'beach';
  const isHeritage = category === 'heritage';
  const isDistillery = category === 'distillery';
  const isFood = category === 'restaurant' || category === 'cafe';
  const isTransport = category === 'transport';
  const isVillage = category === 'village';

  // ── Compact variant: visitor centre / contact card ──────────────────────────
  if (variant === 'compact') {
    const CompactWrapper = contact?.website ? 'a' : 'div';
    const compactProps = contact?.website ? {
      href: contact.website,
      target: '_blank' as const,
      rel: 'noopener noreferrer',
    } : {};

    // Strip " Distillery" suffix for compact display
    const displayName = entity.name.replace(/ Distillery$/, '');

    return (
      <CompactWrapper
        {...compactProps}
        className="block hover-card transition-shadow bg-white p-4"
        style={{
          borderTop: '3px solid var(--color-kelp-edge)',
          border: '1px solid var(--color-washed-timber)',
          borderTopWidth: '3px',
          borderTopColor: 'var(--color-kelp-edge)',
          textDecoration: 'none',
          color: 'inherit',
          cursor: contact?.website ? 'pointer' : 'default',
        }}
      >
        {/* Name */}
        <h3 className="font-serif font-bold text-harbour-stone mb-2" style={{ fontSize: '1.05rem', lineHeight: '1.25' }}>
          {displayName}
        </h3>

        {/* Key stats line */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          {location?.distanceFromBruichladdich && (
            <span className="font-mono text-2xs text-washed-timber">{location.distanceFromBruichladdich}</span>
          )}
          {isDistillery && attributes?.tourPriceStandard && (
            <span className="font-mono text-2xs text-washed-timber">Tours {attributes.tourPriceStandard}</span>
          )}
          {isDistillery && attributes?.hasCafe && (
            <span className="font-mono text-2xs text-emerald-accent font-semibold">Café</span>
          )}
          {attributes?.requiresBooking && (
            <span className="font-mono text-2xs text-washed-timber">Book ahead</span>
          )}
        </div>

        {/* Contact info (plain text — card is already clickable) */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {contact?.phone && (
            <span className="font-mono text-xs text-harbour-stone/60">{contact.phone}</span>
          )}
          {contact?.website && (
            <span className="font-mono text-xs text-kelp-edge">Website →</span>
          )}
        </div>
      </CompactWrapper>
    );
  }

  // ── Full card (default / sand variant) ──────────────────────────────────────

  const cardClass = variant === 'sand'
    ? 'p-5 bg-white'
    : 'border border-washed-timber rounded p-5 bg-white';
  const cardStyle: React.CSSProperties | undefined = variant === 'sand'
    ? {
        borderTop: '3px solid var(--color-kelp-edge)',
        borderLeft: '1px solid var(--color-washed-timber)',
        borderRight: '1px solid var(--color-washed-timber)',
        borderBottom: '1px solid var(--color-washed-timber)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      }
    : undefined;

  const Wrapper = contact?.website ? 'a' : 'div';
  const wrapperProps = contact?.website ? {
    href: contact.website,
    target: '_blank' as const,
    rel: 'noopener noreferrer',
  } : {};

  return (
    <Wrapper {...wrapperProps} className={`${cardClass} block hover-card transition-shadow`} style={{ ...cardStyle, textDecoration: 'none', color: 'inherit', cursor: contact?.website ? 'pointer' : 'default' }}>

      {/* Header: category kicker + name */}
      <div className="mb-2">
        <p className="typo-kicker mb-1.5" style={{ letterSpacing: 'var(--tracking-caps)' }}>
          {CATEGORY_LABELS[category] || category}
        </p>
        <h3 className="font-serif text-xl text-harbour-stone leading-snug">
          {entity.name}
        </h3>
      </div>

      {/* Safety warning for beaches */}
      {isBeach && attributes?.safeForSwimming === false && importantNote && (
        <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded font-mono text-xs text-amber-800">
          ⚠ {importantNote}
        </div>
      )}

      {/* Short description */}
      {entity.shortDescription && (
        <p className="font-mono text-sm text-harbour-stone/70 mb-4 leading-relaxed">
          {entity.shortDescription}
        </p>
      )}

      {/* Heritage period */}
      {isHeritage && attributes?.heritagePeriod && (
        <p className="font-mono text-xs text-harbour-stone/60 mb-2">
          Period: {attributes.heritagePeriod}
        </p>
      )}

      {/* Access restrictions (heritage / routes) */}
      {attributes?.accessRestrictions && (
        <p className="font-mono text-xs text-harbour-stone/60 mb-2">
          {attributes.accessRestrictions}
        </p>
      )}

      {/* Route stats */}
      {isRoute && (attributes?.distanceMiles || attributes?.distanceKm || attributes?.durationMinutes) && (
        <div className="flex flex-wrap gap-3 mb-3">
          {(attributes.distanceMiles || attributes.distanceKm) && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">
              {attributes.distanceMiles
                ? `${attributes.distanceMiles} miles`
                : `${attributes.distanceKm} km`}
            </span>
          )}
          {attributes.durationMinutes && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">
              {formatDuration(attributes.durationMinutes)}
            </span>
          )}
          {attributes.difficulty && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">
              {difficultyLabel(attributes.difficulty)}
            </span>
          )}
        </div>
      )}

      {/* Route: start point / parking */}
      {isRoute && attributes?.startPointParking && (
        <p className="font-mono text-xs text-harbour-stone/60 mb-2">
          Start: {attributes.startPointParking}
        </p>
      )}

      {/* Route: accessibility */}
      {isRoute && attributes?.accessibilityNotes && (
        <p className="font-mono text-xs text-harbour-stone/60 mb-2">
          {attributes.accessibilityNotes}
        </p>
      )}

      {/* Distillery: tour info + café */}
      {isDistillery && (attributes?.tourPriceStandard || attributes?.tourDuration) && (
        <div className="flex flex-wrap gap-3 mb-3">
          {attributes.tourPriceStandard && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">
              Tour: {attributes.tourPriceStandard}
            </span>
          )}
          {attributes.tourDuration && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">
              {attributes.tourDuration}
            </span>
          )}
          {attributes.hasCafe && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">
              Café on site
            </span>
          )}
          {attributes.yearFounded && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">
              Est. {attributes.yearFounded}
            </span>
          )}
        </div>
      )}

      {/* Food & drink: cuisine + dog-friendly */}
      {isFood && (attributes?.cuisineType || attributes?.dogFriendlyVenue != null) && (
        <div className="flex flex-wrap gap-3 mb-3">
          {attributes?.cuisineType && attributes.cuisineType !== 'shop' && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone capitalize">
              {attributes.cuisineType.replace('-', ' ')}
            </span>
          )}
          {attributes?.dogFriendlyVenue === true && (
            <span className="font-mono text-xs bg-emerald-accent/15 px-2 py-1 rounded text-emerald-accent">
              Dog-friendly
            </span>
          )}
          {attributes?.priceRange && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">
              {attributes.priceRange}
            </span>
          )}
        </div>
      )}

      {/* Beach: attribute pills */}
      {isBeach && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attributes?.sandType && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone capitalize">
              {attributes.sandType} sand
            </span>
          )}
          {attributes?.surfSuitable && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">Surf</span>
          )}
          {attributes?.sheltered && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">Sheltered</span>
          )}
          {attributes?.rockPools && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">Rock pools</span>
          )}
          {attributes?.dogsAllowed && (
            <span className="font-mono text-xs bg-emerald-accent/15 px-2 py-1 rounded text-emerald-accent">Dogs welcome</span>
          )}
        </div>
      )}

      {/* Transport: mode + route summary */}
      {isTransport && attributes?.routeSummary && (
        <div className="mb-3">
          {attributes.transportMode && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone capitalize mr-2 mb-1 inline-block">
              {attributes.transportMode.replace('-', ' ')}
            </span>
          )}
          {attributes.frequency && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone mr-2 mb-1 inline-block">
              {attributes.frequency}
            </span>
          )}
          <p className="font-mono text-xs text-harbour-stone/60 mt-2">{attributes.routeSummary}</p>
        </div>
      )}

      {/* Village: services */}
      {isVillage && (attributes?.hasShop != null || attributes?.population) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attributes?.hasShop && <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">Shop</span>}
          {attributes?.hasPub && <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">Pub</span>}
          {attributes?.hasFuel && <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">Fuel</span>}
          {attributes?.hasATM && <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">ATM</span>}
          {attributes?.hasPostOffice && <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">Post Office</span>}
          {attributes?.population && <span className="font-mono text-xs text-harbour-stone/50">Pop. {attributes.population}</span>}
        </div>
      )}

      {/* Route: dog-friendly + terrain badges */}
      {isRoute && (attributes?.terrainType || attributes?.dogFriendlyRoute != null) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attributes?.terrainType && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone capitalize">{attributes.terrainType}</span>
          )}
          {attributes?.dogFriendlyRoute && (
            <span className="font-mono text-xs bg-emerald-accent/15 px-2 py-1 rounded text-emerald-accent">Dog-friendly</span>
          )}
          {attributes?.circular && (
            <span className="font-mono text-xs bg-sea-spray px-2 py-1 rounded text-harbour-stone">Circular</span>
          )}
        </div>
      )}

      {/* Heritage: significance + century date */}
      {isHeritage && attributes?.centuryDate && (
        <p className="font-mono text-xs font-semibold text-kelp-edge mb-1">{attributes.centuryDate}</p>
      )}
      {isHeritage && attributes?.significanceNote && (
        <p className="font-mono text-xs text-harbour-stone/60 mb-2">{attributes.significanceNote}</p>
      )}

      {/* Booking callout */}
      {attributes?.requiresBooking && (
        <p className="font-mono text-xs text-harbour-stone/70 mb-2">
          <strong>Booking required.</strong>
          {attributes.bookingAdvice ? ` ${attributes.bookingAdvice}` : ''}
        </p>
      )}

      {/* Opening hours */}
      {openingHours && openingHours.length > 0 && (
        <div className="mb-3">
          {openingHours.map((h, i) => (
            <p key={i} className="font-mono text-xs text-harbour-stone/70">
              {h.label}: {h.opens}–{h.closes}
              {h.notes ? ` (${h.notes})` : ''}
            </p>
          ))}
        </div>
      )}

      {/* Key practical info */}
      <div className="mt-4 flex flex-wrap gap-4 items-center">
        {location?.distanceFromBruichladdich && (
          <span className="font-mono text-xs text-harbour-stone/60">
            {location.distanceFromBruichladdich}
          </span>
        )}
        {contact?.phone && (
          <span className="font-mono text-xs text-harbour-stone/60">
            {contact.phone}
          </span>
        )}
        {contact?.website && (
          <span className="font-mono text-xs text-kelp-edge">
            Website →
          </span>
        )}
      </div>

      {/* Important note — non-swimming beaches etc (if not shown above as warning) */}
      {importantNote && !(isBeach && attributes?.safeForSwimming === false) && (
        <p className="mt-3 font-mono text-xs text-harbour-stone/60 border-t border-washed-timber pt-3">
          {importantNote}
        </p>
      )}
    </Wrapper>
  );
}
