import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import type { PropertyData } from '@/lib/queries';

/**
 * PropertyCardGrid — shared property card rendering.
 * Used on homepage (accommodation section) and guide spokes (Stay on Islay).
 * Single source of truth for property card markup, bullets, and highlights.
 */

function buildBullets(p: PropertyData): string[] {
  const bullets: string[] = [];
  if (p.sleeps) bullets.push(`Sleeps ${p.sleeps}`);
  if (p.bedrooms) bullets.push(`${p.bedrooms} bedrooms`);
  if (p.bathrooms) bullets.push(`${p.bathrooms} bathroom${p.bathrooms > 1 ? 's' : ''}`);
  if (p.petFriendly) bullets.push('Dogs welcome');
  if (p.petFriendly === false) bullets.push('Pet-free');
  return bullets;
}

function buildHighlights(p: PropertyData): string[] {
  const h: string[] = [];
  if (p.outdoorFeatures?.includes('sea_views') || p.outdoorFeatures?.includes('sea_views_outdoor')) h.push('Sea views');
  if (p.outdoorFeatures?.includes('walled_garden')) h.push('Walled garden');
  if (p.outdoorFeatures?.includes('bird_reserves')) h.push('Bird hides');
  if (p.outdoorFeatures?.includes('private_garden')) h.push('Private garden');
  if (p.outdoorFeatures?.includes('woodland')) h.push('Woodland grounds');
  if (p.livingAreas?.includes('conservatory')) h.push('Conservatory');
  return [...new Set(h)].slice(0, 3);
}

interface Props {
  properties: PropertyData[];
  /** Show amenity highlight tags below bullets */
  showHighlights?: boolean;
}

export default function PropertyCardGrid({ properties, showHighlights = false }: Props) {
  return (
    <div className="g-stay-cards">
      {properties.map((p) => {
        const imageUrl = p.heroImage ? urlFor(p.heroImage).width(1200).height(800).url() : '';
        const locationText = typeof p.location === 'string' ? p.location : (p.location?.address || p.location?.nearestTown || 'Bruichladdich, Islay');
        const propSlug = typeof p.slug === 'string' ? p.slug : p.slug?.current;
        const bullets = buildBullets(p);
        const highlights = showHighlights ? buildHighlights(p) : [];

        return (
          <Link key={p._id} href={`/accommodation/${propSlug}`} className="block hover-card">
            <div className="bg-harbour-stone relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {imageUrl && <Image src={imageUrl} alt={p.heroImage?.alt || p.name} fill className="object-cover" />}
            </div>
            <div className="bg-machair-sand p-5 pb-6">
              <p className="typo-kicker mb-2">{locationText}</p>
              <h3 className="typo-card-title mb-2.5">{p.name}</h3>
              <p className="font-mono text-base text-harbour-stone opacity-60 mb-2.5">{bullets.join(' · ')}</p>
              {highlights.length > 0 && (
                <ul className="flex flex-wrap gap-1.5 mb-3.5" style={{ listStyle: 'none' }}>
                  {highlights.map((h) => <li key={h} className="font-mono text-xs tracking-wide text-kelp-edge bg-sea-spray px-2.5 py-1">{h}</li>)}
                </ul>
              )}
              <span className="typo-cta">View property →</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
