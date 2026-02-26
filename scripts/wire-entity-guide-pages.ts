/**
 * wire-entity-guide-pages.ts
 *
 * Patches `featuredEntities[]` on existing guide page documents.
 * Maps entity IDs (from populate-entities.ts) to their guide pages.
 *
 * Wires these 5 live guide pages:
 *   - guide-islay-distilleries
 *   - guide-food-and-drink
 *   - guide-islay-beaches
 *   - guide-islay-wildlife
 *   - guide-family-holidays
 *
 * Run AFTER:
 *   1. populate-entities.ts has run (entities exist in Sanity)
 *   2. siteEntity schema is deployed (Studio restart may be needed)
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/wire-entity-guide-pages.ts
 */

import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// ─── Helper ───────────────────────────────────────────────────────────────────

function entityRef(entityId: string) {
  return {
    _type: 'reference' as const,
    _ref: `siteEntity.${entityId}`,
  };
}

// ─── Entity-to-guide-page mapping ─────────────────────────────────────────────

const PAGE_ENTITY_MAP: Record<string, string[]> = {
  'guide-islay-distilleries': [
    'bruichladdich-distillery',
    'bowmore-distillery',
    'kilchoman-distillery',
    'bunnahabhain-distillery',
    'caol-ila-distillery',
    'ardnahoe-distillery',
    'ardbeg-distillery',
    'lagavulin-distillery',
    'laphroaig-distillery',
    'port-ellen-distillery',
  ],
  'guide-food-and-drink': [
    'lochindaal-seafood-kitchen',
    'port-charlotte-hotel',
    'an-tigh-seinnse-portnahaven',
    'peatzeria-bowmore',
    'the-cottage-bowmore',
    'islays-plaice-bowmore',
    'the-copper-still-port-ellen',
    'seasalt-bistro-port-ellen',
    'the-oyster-shed-islay',
    'aileens-mini-market-bruichladdich',
    'coop-bowmore',
    'port-charlotte-stores',
    'jeans-fresh-fish-van',
  ],
  'guide-islay-beaches': [
    'portbahn-beach',
    'port-charlotte-beach',
    'laggan-bay',
    'machir-bay',
    'saligo-bay',
    'sanaigmore-beach',
    'ardnave-point',
    'singing-sands-islay',
    'claggain-bay',
    'kilnaughton-bay',
    'port-ellen-beach',
  ],
  'guide-islay-wildlife': [
    'rspb-loch-gruinart',
    'rspb-the-oa',
    'loch-indaal',
    'portnahaven-harbour',
    'the-oyster-shed-islay',
  ],
  'guide-family-holidays': [
    'portbahn-beach',
    'port-charlotte-beach',
    'laggan-bay',
    'mactaggart-leisure-centre',
    'persabus-pottery',
    'islay-woollen-mill',
    'ardbeg-distillery',
    'kilchoman-distillery',
    'peatzeria-bowmore',
    'the-cottage-bowmore',
    'islays-plaice-bowmore',
  ],
};

// ─── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('=== wire-entity-guide-pages.ts ===\n');

  for (const [pageId, entityIds] of Object.entries(PAGE_ENTITY_MAP)) {
    const refs = entityIds.map(entityRef);
    console.log(`Patching ${pageId} (${entityIds.length} entities)...`);
    try {
      await client
        .patch(pageId)
        .set({ featuredEntities: refs })
        .commit();
      console.log(`  ✓ ${pageId} → ${entityIds.length} entity refs wired`);
    } catch (err: any) {
      console.error(`  ✗ ${pageId}: ${err.message}`);
    }
  }

  console.log('\n=== Done ===');
  console.log('\nVerify in Studio: each guide page → Featured Entities field');
  console.log('Then check EntityCard rendering on the live site.');
  console.log('\nWalking and visit-jura guide pages to be wired once those pages are created.');
}

run().catch(console.error);
