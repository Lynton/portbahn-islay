import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-02-19',
  useCdn: false,
});

const ids = [
  'canonical-block-content-about-us',
  'canonical-block-content-beaches-overview',
  'canonical-block-content-bothan-jura-teaser',
  'canonical-block-content-bruichladdich-proximity',
  'canonical-block-content-distilleries-overview',
  'canonical-block-content-families-children',
  'canonical-block-content-ferry-support',
  'canonical-block-content-food-drink-islay',
  'canonical-block-content-jura-day-trip',
  'canonical-block-content-jura-longer-stay',
  'canonical-block-content-port-charlotte-village',
  'canonical-block-content-portbahn-beach',
  'canonical-block-content-shorefield-character',
  'canonical-block-content-travel-to-islay',
  'canonical-block-content-trust-signals',
  'canonical-block-content-wildlife-geese',
];

async function deleteBlocks() {
  let deleted = 0;
  for (const id of ids) {
    try {
      await client.delete(id);
      console.log('✓ Deleted:', id);
      deleted++;
    } catch (e: any) {
      console.error('✗ Failed:', id, e.message);
    }
  }
  console.log(`\nDone: ${deleted}/${ids.length} deleted`);
}

deleteBlocks().catch(console.error);
