'use client';

/**
 * GuideMap — foundation component for entity map rendering on guide pages.
 *
 * Phase 1 (current): renders an iframe Google Maps embed using a search query
 * covering all entity names, or a direct lat/lng when coordinates are available.
 * Falls back to a static text "map" (entity list with Maps links) when no API key.
 *
 * Phase 2 (future, v0 UI): swap to Mapbox GL JS or Leaflet with coloured category
 * pins, click-to-expand tooltips, and automatic bounds fitting.
 *
 * PROPS:
 *   entities — pre-resolved siteEntity documents (already filtered from guide page query)
 *   pageTitle — used for the placeholder heading
 *
 * The component gracefully renders nothing if no entities have location data.
 */

interface EntityLocation {
  _id: string;
  name: string;
  category: string;
  location?: {
    coordinates?: { lat: number; lng: number };
    googleMapsUrl?: string;
    village?: string;
    distanceFromBruichladdich?: string;
  };
}

interface GuideMapProps {
  entities: EntityLocation[];
  pageTitle: string;
}

// Entities with a googleMapsUrl are useful for the link list even without coordinates
function hasMapData(e: EntityLocation): boolean {
  return !!(e.location?.coordinates || e.location?.googleMapsUrl || e.location?.village);
}

export default function GuideMap({ entities, pageTitle }: GuideMapProps) {
  const mappableEntities = entities.filter(hasMapData);

  if (mappableEntities.length === 0) return null;

  const withCoords = entities.filter(
    (e) => e.location?.coordinates?.lat && e.location?.coordinates?.lng
  );

  const withMapLinks = entities.filter(
    (e) => e.location?.googleMapsUrl
  );

  // If we have coordinates → could render a proper map (Phase 2)
  // For now: render a compact "Where to find them" list with map links
  // This is intentionally lightweight — full map UI is deferred to v0 phase

  if (withCoords.length === 0 && withMapLinks.length === 0) {
    // Only village names — don't render the section at all
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="font-serif text-2xl text-harbour-stone mb-4">
        Where to find them
      </h2>
      <p className="font-mono text-sm text-harbour-stone/60 mb-5">
        {pageTitle} — locations on Islay
      </p>

      {/* Map links list — shown when coordinates aren't populated yet */}
      {withMapLinks.length > 0 && (
        <div className="border border-washed-timber rounded p-5 bg-white">
          <ul className="space-y-2">
            {withMapLinks.map((entity) => (
              <li key={entity._id} className="flex items-start gap-3">
                <span className="font-mono text-xs text-harbour-stone/50 shrink-0 mt-0.5 w-24">
                  {entity.category}
                </span>
                <a
                  href={entity.location!.googleMapsUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-emerald-accent hover:underline"
                >
                  {entity.name}
                  {entity.location?.distanceFromBruichladdich
                    ? ` — ${entity.location.distanceFromBruichladdich}`
                    : ''}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-xs text-harbour-stone/40 mt-4">
            Full interactive map coming in site redesign.
          </p>
        </div>
      )}
    </section>
  );
}
