import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 't25lpmnm',
    dataset: 'production',
    apiVersion: '2025-02-25',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  const ids = [
    'canonical-block-bruichladdich-proximity',
    'canonical-block-port-charlotte-village',
    'canonical-block-distilleries-overview',
    'canonical-block-wildlife-geese',
    'canonical-block-food-drink-islay',
    'canonical-block-beaches-overview',
    'canonical-block-families-children',
    'canonical-block-jura-day-trip',
  ];

  const results = await client.fetch(
    `*[_id in $ids]{
      "blockId": blockId.current,
      "linkCount": count(fullContent[].markDefs[_type == 'link']),
      "sampleHrefs": fullContent[].markDefs[_type == 'link'][0..2][].href
    }`,
    { ids }
  );

  console.log('Block link verification:\n');
  for (const r of results) {
    const status = r.linkCount > 0 ? '✅' : '❌';
    const sample = (r.sampleHrefs || []).slice(0, 2).join(', ');
    console.log(`${status}  ${r.blockId.padEnd(32)} ${String(r.linkCount).padStart(2)} links  ${sample}`);
  }

  // Also check what fields exist on one block
  const oneBlock = await client.fetch(
    `*[_id == 'canonical-block-distilleries-overview'][0]{...}`
  );
  console.log('\nField names on distilleries block:', Object.keys(oneBlock).join(', '));
}

main().catch(err => { console.error(err); process.exit(1); });
