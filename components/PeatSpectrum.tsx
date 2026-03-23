import type { SiteEntity, PeatExpression } from '@/lib/types';

// ─── Peat level config ───────────────────────────────────────────────────────

const PEAT_LEVELS = ['unpeated', 'light', 'medium', 'heavy', 'extreme'] as const;

const PEAT_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
  unpeated: { bg: '#f5f0e8', text: 'var(--color-harbour-stone)', border: '#d4c9b5' },
  light:    { bg: '#e8dcc8', text: 'var(--color-harbour-stone)', border: '#c4b49a' },
  medium:   { bg: '#c4a87a', text: '#fff', border: '#a88e60' },
  heavy:    { bg: '#7a5c3a', text: '#fff', border: '#5e4529' },
  extreme:  { bg: '#2c1810', text: '#fff', border: '#1a0e08' },
};

const PEAT_LABELS: Record<string, string> = {
  unpeated: 'Unpeated',
  light: 'Lightly Peated',
  medium: 'Medium Peated',
  heavy: 'Heavily Peated',
  extreme: 'Extreme',
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

  // Group by peat level
  const grouped = PEAT_LEVELS.map((level) => ({
    level,
    label: PEAT_LABELS[level],
    colours: PEAT_COLOURS[level],
    expressions: expressions.filter((e) => e.peatLevel === level),
  })).filter((g) => g.expressions.length > 0);

  return (
    <div className="peat-spectrum">
      <p className="typo-kicker mb-5">Peat Spectrum</p>
      <h3 className="font-serif font-bold text-harbour-stone mb-8" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.4rem)' }}>
        From Unpeated to Extreme
      </h3>

      {/* Spectrum bar */}
      <div className="flex rounded overflow-hidden mb-8" style={{ height: '8px' }}>
        {PEAT_LEVELS.map((level) => (
          <div
            key={level}
            className="flex-1"
            style={{ backgroundColor: PEAT_COLOURS[level].bg }}
          />
        ))}
      </div>

      {/* Grouped expressions */}
      <div className="flex flex-col gap-6">
        {grouped.map((group) => (
          <div key={group.level}>
            {/* Level header */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: group.colours.bg, border: `1px solid ${group.colours.border}` }}
              />
              <span className="font-mono text-xs uppercase tracking-widest text-harbour-stone/60">
                {group.label}
              </span>
            </div>

            {/* Expression cards */}
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {group.expressions.map((expr) => (
                <div
                  key={expr._key}
                  className="rounded p-4"
                  style={{
                    backgroundColor: group.colours.bg,
                    color: group.colours.text,
                    border: `1px solid ${group.colours.border}`,
                  }}
                >
                  <p className="font-serif font-bold text-lg leading-tight mb-1">
                    {expr.distilleryWebsite ? (
                      <a href={expr.distilleryWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {expr.name}
                      </a>
                    ) : (
                      expr.name
                    )}
                  </p>
                  <p className="font-mono text-xs opacity-70 mb-2">{expr.distilleryName}</p>
                  {expr.ppmRange && (
                    <p className="font-mono text-sm font-semibold">{expr.ppmRange} PPM</p>
                  )}
                  {expr.description && (
                    <p className="font-mono text-xs opacity-70 mt-1">{expr.description}</p>
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
