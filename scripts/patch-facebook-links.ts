/**
 * patch-facebook-links.ts
 *
 * Patch contact.website on 4 restaurant/cafe entities that have no
 * official website — using their Facebook pages instead.
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
];

async function run() {
  console.log('=== patch-facebook-links.ts ===\n');

  for (const p of patches) {
    const doc = await client.fetch(
      `*[_type=="siteEntity" && entityId.current==$eid][0]{_id}`,
      { eid: p.entityId }
    );
    if (!doc?._id) {
      console.log(`  ⚠ ${p.name}: document not found (entityId: ${p.entityId})`);
      continue;
    }
    await client.patch(doc._id).set({ 'contact.website': p.website }).commit();
    console.log(`  ✓ ${p.name}: ${p.website}`);
  }

  console.log('\n=== Done ===');
}

run().catch(console.error);
