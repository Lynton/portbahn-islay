/**
 * fix-entity-websites.ts
 *
 * Definitive patch for all entity contact.website fields.
 * Root cause of previous failures: contact was null on many entities —
 * dot-notation .set() silently no-ops on a null parent.
 * Fix: .setIfMissing({ contact: {} }) before every .set().
 *
 * Safe to re-run — setIfMissing only creates the object if absent.
 */

import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const patches: Array<{ entityId: string; name: string; website: string }> = [
  // ── Restaurants & cafés ───────────────────────────────────────────────────
  {
    entityId: 'lochindaal-seafood-kitchen',
    name: 'Lochindaal Seafood Kitchen',
    website: 'https://www.lochindaalseafoodkitchen.co.uk/',
  },
  {
    entityId: 'port-charlotte-hotel',
    name: 'Port Charlotte Hotel',
    website: 'https://www.portcharlottehotel.co.uk/',
  },
  {
    entityId: 'peatzeria-bowmore',
    name: 'Peatzeria',
    website: 'https://peatzeria.com/',
  },
  {
    entityId: 'seasalt-bistro-port-ellen',
    name: 'SeaSalt Bistro',
    website: 'https://www.seasalt-bistro.co.uk/',
  },
  {
    entityId: 'an-tigh-seinnse-portnahaven',
    name: 'An Tigh Seinnse',
    website: 'https://www.facebook.com/p/An-Tigh-Seinnse-100089564695464/?locale=en_GB',
  },
  {
    entityId: 'the-copper-still-port-ellen',
    name: 'The Copper Still',
    website: 'https://www.facebook.com/CopperStillCoffeeIslay/?locale=en_GB',
  },
  {
    entityId: 'islays-plaice-bowmore',
    name: "Islay's Plaice",
    website: 'https://www.facebook.com/p/Islays-Plaice-61568208287189/',
  },
  {
    entityId: 'the-oyster-shed-islay',
    name: 'The Oyster Shed, Islay',
    website: 'https://www.facebook.com/p/Islay-Oysters-100063634821212/?locale=en_GB',
  },
  {
    entityId: 'jura-hotel',
    name: 'Jura Hotel',
    website: 'https://www.jurahotel.co.uk/',
  },
  {
    entityId: 'the-antlers-jura',
    name: 'The Antlers (Deer Island Bakehouse)',
    website: 'https://www.facebook.com/antlers.jura/',
  },
  // ── Distilleries ──────────────────────────────────────────────────────────
  {
    entityId: 'port-ellen-distillery',
    name: 'Port Ellen Distillery',
    website: 'https://www.malts.com/en-gb/distilleries/port-ellen',
  },
];

async function run() {
  console.log('=== fix-entity-websites.ts ===\n');

  for (const p of patches) {
    const doc = await client.fetch(
      `*[_type=="siteEntity" && entityId.current==$eid][0]{_id, 'current': contact.website}`,
      { eid: p.entityId }
    );

    if (!doc?._id) {
      console.log(`  ⚠ NOT FOUND  ${p.name} (entityId: ${p.entityId})`);
      continue;
    }

    await client
      .patch(doc._id)
      .setIfMissing({ contact: {} })
      .set({ 'contact.website': p.website })
      .commit();

    const prev = doc.current ? `(was: ${doc.current.substring(0, 40)})` : '(was: null)';
    console.log(`  ✓  ${p.name} ${prev}`);
    console.log(`     → ${p.website}`);
  }

  // Verify
  console.log('\n=== Verification ===');
  const results = await client.fetch(
    `*[_type=="siteEntity" && entityId.current in ${JSON.stringify(patches.map(p => p.entityId))}]{name, 'website': contact.website} | order(name asc)`
  );
  const missing = results.filter((r: any) => !r.website);
  if (missing.length === 0) {
    console.log(`  All ${results.length} entities have contact.website ✓`);
  } else {
    console.log(`  ⚠ Still null: ${missing.map((r: any) => r.name).join(', ')}`);
  }
}

run().catch(console.error);
