import type { SiteEntity } from '@/lib/types';

// ─── Column definitions per page context ─────────────────────────────────────

export interface MatrixColumn {
  key: string;
  label: string;
  /** Path into entity to extract value. Dot notation supported: 'attributes.hasShop' */
  path: string;
  /** How to render the cell */
  type: 'boolean' | 'text' | 'difficulty';
}

/** Pre-defined column sets for each page context */
export const MATRIX_COLUMNS: Record<string, MatrixColumn[]> = {
  beach: [
    { key: 'swim', label: 'Swim', path: 'attributes.safeForSwimming', type: 'boolean' },
    { key: 'surf', label: 'Surf', path: 'attributes.surfSuitable', type: 'boolean' },
    { key: 'dogs', label: 'Dogs', path: 'attributes.dogsAllowed', type: 'boolean' },
    { key: 'shelter', label: 'Sheltered', path: 'attributes.sheltered', type: 'boolean' },
    { key: 'pools', label: 'Rock Pools', path: 'attributes.rockPools', type: 'boolean' },
    { key: 'sand', label: 'Sand', path: 'attributes.sandType', type: 'text' },
  ],
  village: [
    { key: 'shop', label: 'Shop', path: 'attributes.hasShop', type: 'boolean' },
    { key: 'pub', label: 'Pub', path: 'attributes.hasPub', type: 'boolean' },
    { key: 'fuel', label: 'Fuel', path: 'attributes.hasFuel', type: 'boolean' },
    { key: 'atm', label: 'ATM', path: 'attributes.hasATM', type: 'boolean' },
    { key: 'post', label: 'Post Office', path: 'attributes.hasPostOffice', type: 'boolean' },
    { key: 'pop', label: 'Pop.', path: 'attributes.population', type: 'text' },
  ],
  walking: [
    { key: 'diff', label: 'Difficulty', path: 'attributes.difficulty', type: 'difficulty' },
    { key: 'dist', label: 'Distance', path: 'attributes.distanceMiles', type: 'text' },
    { key: 'time', label: 'Time', path: 'attributes.durationMinutes', type: 'text' },
    { key: 'loop', label: 'Circular', path: 'attributes.circular', type: 'boolean' },
    { key: 'terrain', label: 'Terrain', path: 'attributes.terrainType', type: 'text' },
    { key: 'dogs', label: 'Dogs', path: 'attributes.dogFriendlyRoute', type: 'boolean' },
  ],
  'dog-friendly': [
    { key: 'beach', label: 'Beach', path: 'attributes.dogsAllowed', type: 'boolean' },
    { key: 'venue', label: 'Venue', path: 'attributes.dogFriendlyVenue', type: 'boolean' },
    { key: 'route', label: 'Route', path: 'attributes.dogFriendlyRoute', type: 'boolean' },
  ],
  transport: [
    { key: 'mode', label: 'Mode', path: 'attributes.transportMode', type: 'text' },
    { key: 'operator', label: 'Operator', path: 'attributes.operator', type: 'text' },
    { key: 'freq', label: 'Frequency', path: 'attributes.frequency', type: 'text' },
    { key: 'route', label: 'Route', path: 'attributes.routeSummary', type: 'text' },
  ],
  ferry: [
    { key: 'route', label: 'Route', path: 'attributes.routeSummary', type: 'text' },
    { key: 'freq', label: 'Frequency', path: 'attributes.frequency', type: 'text' },
    { key: 'operator', label: 'Operator', path: 'attributes.operator', type: 'text' },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function formatDistance(miles: number | undefined, km: number | undefined): string {
  if (miles) return `${miles} mi`;
  if (km) return `${km} km`;
  return '';
}

// ─── Cell renderers ──────────────────────────────────────────────────────────

function BooleanCell({ value }: { value: any }) {
  if (value === true) return <span className="text-emerald-accent font-mono text-sm">Yes</span>;
  if (value === false) return <span className="text-harbour-stone/30 font-mono text-sm">-</span>;
  return <span className="text-harbour-stone/20 font-mono text-sm">?</span>;
}

function TextCell({ value }: { value: any }) {
  if (value == null || value === '') return <span className="text-harbour-stone/20 font-mono text-sm">-</span>;
  return <span className="font-mono text-sm text-harbour-stone">{String(value)}</span>;
}

function DifficultyCell({ value }: { value: any }) {
  const colours: Record<string, string> = {
    easy: 'bg-emerald-accent/15 text-emerald-accent',
    moderate: 'bg-amber-100 text-amber-700',
    strenuous: 'bg-red-100 text-red-700',
  };
  const cls = colours[value] || 'bg-sea-spray text-harbour-stone';
  const label = value === 'easy' ? 'Easy' : value === 'moderate' ? 'Moderate' : value === 'strenuous' ? 'Strenuous' : value || '-';
  return <span className={`font-mono text-xs px-2 py-0.5 rounded ${cls}`}>{label}</span>;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AttributeMatrixProps {
  entities: SiteEntity[];
  columns: MatrixColumn[];
}

export default function AttributeMatrix({ entities, columns }: AttributeMatrixProps) {
  if (entities.length === 0 || columns.length === 0) return null;

  return (
    <div className="attribute-matrix overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left font-mono text-xs uppercase tracking-widest text-harbour-stone/50 pb-3 pr-4 border-b border-washed-timber">
              Name
            </th>
            {columns.map((col) => (
              <th key={col.key} className="text-left font-mono text-xs uppercase tracking-widest text-harbour-stone/50 pb-3 px-3 border-b border-washed-timber whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => (
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
                {entity.location?.village && (
                  <span className="block font-mono text-xs text-harbour-stone/40 mt-0.5">{entity.location.village}</span>
                )}
              </td>
              {columns.map((col) => {
                let value = getNestedValue(entity, col.path);

                // Special formatting for walking columns
                if (col.key === 'dist') {
                  value = formatDistance(entity.attributes?.distanceMiles, entity.attributes?.distanceKm);
                }
                if (col.key === 'time' && entity.attributes?.durationMinutes) {
                  value = formatDuration(entity.attributes.durationMinutes);
                }

                return (
                  <td key={col.key} className="py-3 px-3">
                    {col.type === 'boolean' && <BooleanCell value={value} />}
                    {col.type === 'text' && <TextCell value={value} />}
                    {col.type === 'difficulty' && <DifficultyCell value={value} />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
