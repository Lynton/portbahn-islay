import type { KeyFactSet } from '@/lib/types';

interface KeyFactSetDisplayProps {
  factSets: KeyFactSet[];
}

export default function KeyFactSetDisplay({ factSets }: KeyFactSetDisplayProps) {
  if (!factSets || factSets.length === 0) return null;

  return (
    <div className="key-fact-sets">
      {factSets.map((factSet) => (
        <div key={factSet._id} className="mb-8">
          <p className="typo-label mb-5">{factSet.title || 'Key Facts'}</p>
          <dl className="grid gap-0" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {factSet.facts?.map((fact) => (
              <div key={fact._key} className="border-t border-washed-timber pt-3 pb-3 pr-4">
                <dt className="font-mono text-xs uppercase tracking-widest text-harbour-stone/50 mb-1">{fact.label}</dt>
                <dd className="font-mono text-xl text-harbour-stone font-semibold leading-tight">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
