import type { SiteEntity } from '@/lib/types';

// ─── Cluster config ──────────────────────────────────────────────────────────

const CLUSTER_CONFIG: Record<string, { label: string; title: string; note: string }> = {
  'south-coast': {
    label: 'South Coast',
    title: 'The Smoky Trio',
    note: '~45 min drive. Lunch at Ardbeg café.',
  },
  'north-coast': {
    label: 'North Coast',
    title: 'Sound of Islay',
    note: '~30–35 min drive. Food at Ardnahoe.',
  },
  rhinns: {
    label: 'Walking Distance',
    title: 'No Car Needed',
    note: 'Start here. Full spectrum of styles.',
  },
};

const CLUSTER_ORDER = ['south-coast', 'north-coast', 'rhinns'] as const;

// ─── Component ───────────────────────────────────────────────────────────────

interface DistilleryClustersProps {
  entities: SiteEntity[];
}

export default function DistilleryClusters({ entities }: DistilleryClustersProps) {
  // Group entities by cluster
  const clusters = CLUSTER_ORDER.map((clusterId) => ({
    ...CLUSTER_CONFIG[clusterId],
    clusterId,
    distilleries: entities.filter(
      (e) => e.attributes?.distilleryCluster === clusterId
    ),
  })).filter((c) => c.distilleries.length > 0);

  if (clusters.length === 0) return null;

  return (
    <div className="distillery-clusters">
      <p className="typo-kicker mb-3">Planning Your Days</p>
      <h3
        className="font-serif font-bold text-harbour-stone mb-8"
        style={{ fontSize: 'clamp(1.15rem, 2vw, 1.4rem)' }}
      >
        Distillery Clusters
      </h3>

      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${clusters.length}, 1fr)`,
          background: 'var(--colour-harbour-stone, #2B2C2E)',
        }}
      >
        {clusters.map((cluster) => (
          <div
            key={cluster.clusterId}
            className="bg-machair-sand"
            style={{ padding: '28px 20px' }}
          >
            {/* Cluster header */}
            <p className="typo-label mb-3">{cluster.label}</p>
            <p
              className="font-serif font-bold text-harbour-stone mb-3"
              style={{ fontSize: '1.15rem', lineHeight: '1.2' }}
            >
              {cluster.title}
            </p>

            {/* Distillery list */}
            <div
              className="border-t border-washed-timber pt-2.5 mb-2.5"
              style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
            >
              {cluster.distilleries.map((d) => (
                <p
                  key={d._id}
                  className="font-mono text-xs text-harbour-stone"
                  style={{ lineHeight: '1.8' }}
                >
                  {d.contact?.website ? (
                    <a
                      href={d.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-link"
                      style={{ color: 'var(--color-harbour-stone)' }}
                    >
                      {d.name.replace(' Distillery', '')}
                    </a>
                  ) : (
                    d.name.replace(' Distillery', '')
                  )}
                  {d.location?.distanceFromBruichladdich && (
                    <span className="font-mono text-2xs text-washed-timber ml-2">
                      {d.location.distanceFromBruichladdich}
                    </span>
                  )}
                  {d.attributes?.hasCafe && (
                    <span className="font-mono text-2xs text-emerald-accent ml-1.5">
                      café
                    </span>
                  )}
                </p>
              ))}
            </div>

            {/* Cluster note */}
            <p className="font-mono text-xs text-washed-timber" style={{ lineHeight: '1.4' }}>
              {cluster.note}
            </p>
          </div>
        ))}
      </div>

      {/* Link to map */}
      <p className="mt-4">
        <a href="#entities" className="hover-link font-mono text-sm tracking-wide text-kelp-edge">
          View on map ↓
        </a>
      </p>
    </div>
  );
}
