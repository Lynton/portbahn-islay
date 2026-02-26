import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface OpeningHoursEntry {
  label: string;
  opens?: string;
  closes?: string;
  notes?: string;
}

interface SiteEntity {
  _id: string;
  entityId: { current: string };
  name: string;
  category: string;
  schemaOrgType?: string;
  island?: string;
  status?: string;
  shortDescription?: string;
  editorialNote?: string;
  importantNote?: string;
  canonicalExternalUrl?: string;
  ecosystemSite?: string;
  location?: {
    address?: string;
    village?: string;
    distanceFromBruichladdich?: string;
    googleMapsUrl?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    bookingUrl?: string;
    instagram?: string;
  };
  openingHours?: OpeningHoursEntry[];
  attributes?: {
    safeForSwimming?: boolean;
    requiresBooking?: boolean;
    bookingAdvice?: string;
    priceRange?: string;
    familyFriendly?: boolean;
    peatLevel?: string;
    hasCafe?: boolean;
    yearFounded?: number;
    yearReopened?: number;
    distanceMiles?: number;
    distanceKm?: number;
    durationMinutes?: number;
    difficulty?: string;
    accessibilityNotes?: string;
    startPointParking?: string;
    heritagePeriod?: string;
    accessRestrictions?: string;
    eventMonth?: string;
    eventDuration?: string;
  };
  tags?: string[];
}

interface EntityCardProps {
  entity: SiteEntity;
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

export default function EntityCard({ entity }: EntityCardProps) {
  // Ecosystem-linked entities: brief card + outbound link only
  if (entity.canonicalExternalUrl && entity.ecosystemSite !== 'pbi') {
    return <EcosystemCard entity={entity} />;
  }

  const { category, attributes, location, contact, openingHours, importantNote } = entity;
  const isRoute = category === 'route';
  const isBeach = category === 'beach';
  const isHeritage = category === 'heritage';

  return (
    <article className="border border-washed-timber rounded p-5 bg-white">

      {/* Header: name + category badge */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-serif text-xl text-harbour-stone leading-snug">
          {entity.name}
        </h3>
        <span className="font-mono text-xs text-harbour-stone/50 shrink-0 pt-1">
          {CATEGORY_LABELS[category] || category}
        </span>
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

      {/* Key practical links */}
      <div className="mt-4 flex flex-wrap gap-4 items-center">

        {/* Distance */}
        {location?.distanceFromBruichladdich && (
          <span className="font-mono text-xs text-harbour-stone/60">
            {location.distanceFromBruichladdich}
          </span>
        )}

        {/* Phone — clickable on mobile */}
        {contact?.phone && (
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className="font-mono text-sm text-emerald-accent hover:underline"
          >
            {contact.phone}
          </a>
        )}

        {/* Website */}
        {contact?.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-emerald-accent hover:underline"
          >
            Website
          </a>
        )}

        {/* Booking URL (if separate from website) */}
        {contact?.bookingUrl && contact.bookingUrl !== contact.website && (
          <a
            href={contact.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-emerald-accent hover:underline"
          >
            Book
          </a>
        )}

        {/* Google Maps link */}
        {location?.googleMapsUrl && (
          <a
            href={location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-emerald-accent hover:underline"
          >
            View on map
          </a>
        )}
      </div>

      {/* Important note — non-swimming beaches etc (if not shown above as warning) */}
      {importantNote && !(isBeach && attributes?.safeForSwimming === false) && (
        <p className="mt-3 font-mono text-xs text-harbour-stone/60 border-t border-washed-timber pt-3">
          {importantNote}
        </p>
      )}
    </article>
  );
}
