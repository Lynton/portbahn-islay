'use client';

import { useEffect, useRef, useState } from 'react';
import type { SiteEntity } from '@/lib/types';

// ─── Category colours for map pins ───────────────────────────────────────────

const CATEGORY_COLOURS: Record<string, string> = {
  distillery: '#1B6B5A',
  restaurant: '#D97706',
  cafe: '#D97706',
  beach: '#0EA5E9',
  'nature-reserve': '#16A34A',
  heritage: '#7C3AED',
  route: '#EA580C',
  village: '#6B7280',
  transport: '#2563EB',
  activity: '#EC4899',
  attraction: '#8B5CF6',
  event: '#F59E0B',
  accommodation: '#1B6B5A',
  other: '#6B7280',
};

const CATEGORY_LABELS: Record<string, string> = {
  distillery: 'Distillery',
  restaurant: 'Restaurant',
  cafe: 'Café',
  beach: 'Beach',
  'nature-reserve': 'Nature Reserve',
  heritage: 'Heritage',
  route: 'Walking Route',
  village: 'Village',
  transport: 'Transport',
  activity: 'Activity',
  attraction: 'Attraction',
  event: 'Event',
  accommodation: 'Accommodation',
  other: 'Other',
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface GuideMapProps {
  entities: SiteEntity[];
  pageTitle: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GuideMap({ entities, pageTitle }: GuideMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  const withCoords = entities.filter(
    (e) => e.location?.coordinates?.lat && e.location?.coordinates?.lng
  );

  // Don't render if no entities have coordinates
  if (withCoords.length === 0) return null;

  // Calculate map bounds
  const lats = withCoords.map((e) => e.location!.coordinates!.lat);
  const lngs = withCoords.map((e) => e.location!.coordinates!.lng);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

  return (
    <section className="mb-12">
      <div className="grid gap-8 mb-6" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'end', maxWidth: '1280px' }}>
        <div>
          <p className="typo-label mb-3">Locations</p>
          <h3 className="font-serif font-bold text-harbour-stone" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.4rem)' }}>
            Find the {pageTitle.split(/['']s?\s/)[1] || 'Places'}
          </h3>
        </div>
        <p className="font-mono text-sm text-harbour-stone/60 mb-0">
          {withCoords.length} location{withCoords.length !== 1 ? 's' : ''} on Islay
        </p>
      </div>

      {/* Map container */}
      <LeafletMap
        entities={withCoords}
        centerLat={centerLat}
        centerLng={centerLng}
      />

      {/* Distance list below map */}
      <div className="grid gap-0 mt-6" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: '1280px' }}>
        {withCoords.map((entity, i) => (
          <div
            key={entity._id}
            className="flex justify-between items-baseline"
            style={{
              padding: i % 2 === 0 ? '10px 16px 10px 0' : '10px 0 10px 16px',
              borderBottom: i < withCoords.length - 2 ? '1px solid var(--color-washed-timber)' : undefined,
            }}
          >
            <span className="font-mono text-sm text-harbour-stone">{entity.name}</span>
            {entity.location?.distanceFromBruichladdich && (
              <span className="font-mono text-xs text-kelp-edge">{entity.location.distanceFromBruichladdich}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Leaflet map (loaded client-side only) ───────────────────────────────────

function LeafletMap({
  entities,
  centerLat,
  centerLng,
}: {
  entities: SiteEntity[];
  centerLat: number;
  centerLng: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const map = L.map(containerRef.current!, {
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([centerLat, centerLng], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 16,
      }).addTo(map);

      // Add entity markers
      entities.forEach((entity) => {
        const { lat, lng } = entity.location!.coordinates!;
        const colour = CATEGORY_COLOURS[entity.category] || '#6B7280';
        const label = CATEGORY_LABELS[entity.category] || entity.category;

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width: 14px; height: 14px;
            background: ${colour};
            border: 2px solid #fff;
            border-radius: 50%;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const distance = entity.location?.distanceFromBruichladdich
          ? `<br><span style="opacity:0.6">${entity.location.distanceFromBruichladdich}</span>`
          : '';

        const popup = `
          <div style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; line-height: 1.5;">
            <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: ${colour};">${label}</span><br>
            <strong>${entity.name}</strong>
            ${distance}
          </div>
        `;

        L.marker([lat, lng], { icon }).addTo(map).bindPopup(popup);
      });

      // Fit bounds if multiple markers
      if (entities.length > 1) {
        const bounds = L.latLngBounds(
          entities.map((e) => [e.location!.coordinates!.lat, e.location!.coordinates!.lng] as [number, number])
        );
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [entities, centerLat, centerLng]);

  return (
    <div
      ref={containerRef}
      style={{ height: '480px', borderRadius: '2px', background: 'var(--color-machair-sand)' }}
    />
  );
}
