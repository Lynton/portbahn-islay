import type { SiteEntity, PeatExpression } from '@/lib/types';

// ─── Peat level config ───────────────────────────────────────────────────────

const PEAT_LEVELS = ['unpeated', 'light', 'medium', 'heavy', 'extreme'] as const;

const PEAT_CONFIG: Record<string, { label: string; zone: string; bg: string; text: string; kicker: string }> = {
  unpeated: { label: 'Unpeated', zone: '0 ppm', bg: '#f5f0e8', text: 'var(--color-harbour-stone)', kicker: 'var(--color-washed-timber)' },
  light:    { label: 'Lightly Peated', zone: '5–20 ppm', bg: '#e8dcc8', text: 'var(--color-harbour-stone)', kicker: 'var(--color-washed-timber)' },
  medium:   { label: 'Medium', zone: '20–40 ppm', bg: '#c4a87a', text: '#fff', kicker: 'rgba(255,255,255,0.5)' },
  heavy:    { label: 'Heavily Peated', zone: '40–55 ppm', bg: '#7a5c3a', text: '#fff', kicker: 'rgba(255,255,255,0.5)' },
  extreme:  { label: 'Off the Scale', zone: '80–300+ ppm', bg: 'var(--color-sound-of-islay)', text: '#fff', kicker: 'var(--color-emerald-accent)' },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface PeatSpectrumProps {
  entities: SiteEntity[];
}

interface ExpressionWithDistillery extends PeatExpression {
  distilleryName: string;
  distilleryWebsite?: string;
}

export default function PeatSpectrum({ entities }: PeatSpectrumProps) {
  // Collect all peat expressions from distillery entities
  const expressions: ExpressionWithDistillery[] = [];
  for (const entity of entities) {
    if (entity.peatExpressions && entity.peatExpressions.length > 0) {
      for (const expr of entity.peatExpressions) {
        expressions.push({
          ...expr,
          distilleryName: entity.name,
          distilleryWebsite: entity.contact?.website,
        });
      }
    }
  }

  if (expressions.length === 0) return null;

  // Group by peat level — only show levels that have expressions
  const grouped = PEAT_LEVELS
    .map((level) => ({
      level,
      config: PEAT_CONFIG[level],
      expressions: expressions.filter((e) => e.peatLevel === level),
    }))
    .filter((g) => g.expressions.length > 0);

  return (
    <div className="peat-spectrum">
      <p className="typo-label mb-3">At a Glance</p>
      <h3 className="typo-h2 mb-3">Peat &amp; Flavour Spectrum</h3>
      <p className="font-mono text-lg text-harbour-stone opacity-75 mb-8" style={{ maxWidth: '560px' }}>
        Every Islay distillery sits somewhere on the peat spectrum — from gentle and unpeated to intensely smoky.
      </p>

      {/* Spectrum gradient bar */}
      <div className="flex rounded overflow-hidden mb-1" style={{ height: '8px' }}>
        {PEAT_LEVELS.map((level) => (
          <div key={level} className="flex-1" style={{ backgroundColor: PEAT_CONFIG[level].bg }} />
        ))}
      </div>

      {/* Zone labels */}
      <div className="flex mb-8">
        {PEAT_LEVELS.map((level) => (
          <div key={level} className="flex-1">
            <p className="font-mono text-2xs uppercase tracking-wider" style={{ color: 'var(--color-washed-timber)' }}>
              {PEAT_CONFIG[level].label}
            </p>
          </div>
        ))}
      </div>

      {/* Vertical columns — one per peat level */}
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${grouped.length}, 1fr)`, background: 'var(--color-harbour-stone)' }}>
        {grouped.map((group) => (
          <div
            key={group.level}
            style={{
              backgroundColor: group.config.bg,
              color: group.config.text,
              padding: '20px 16px',
            }}
          >
            <p className="font-mono font-semibold mb-3" style={{
              fontSize: '9px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: group.config.kicker,
            }}>
              {group.config.label} · {group.config.zone}
            </p>

            <div className="flex flex-col gap-3">
              {group.expressions.map((expr) => (
                <div key={expr._key}>
                  <p className="font-serif font-bold mb-0.5" style={{ fontSize: '14px' }}>
                    {expr.distilleryWebsite ? (
                      <a href={expr.distilleryWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {expr.name}
                      </a>
                    ) : (
                      expr.name
                    )}
                  </p>
                  {expr.description && (
                    <p className="font-mono opacity-60" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                      {expr.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
