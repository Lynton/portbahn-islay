/**
 * Audit 5 patch: Wire canonical-block-dog-travel-basics to dog-friendly-islay page
 *
 * The block exists on gettingHerePage (islay-travel hub) but not on the
 * dog-friendly-islay guide page. Query "travelling to Islay with a dog"
 * was routing to travelling-without-a-car instead of dog-friendly-islay
 * because transport/CalMac vocabulary was missing from the dog page.
 *
 * Run: npx tsx scripts/patch-audit5-dog-travel-wire.ts
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function main() {
  console.log('Patching guide-dog-friendly-islay — wiring dog-travel-basics block...\n');

  // Verify block exists
  const block = await client.fetch(
    `*[_id == "canonical-block-dog-travel-basics"][0]{ _id, title }`
  );
  if (!block) {
    console.error('ERROR: canonical-block-dog-travel-basics not found');
    process.exit(1);
  }
  console.log(`✓ Block found: ${block.title} (${block._id})`);

  // Get current contentBlocks
  const page = await client.fetch(
    `*[_id == "guide-dog-friendly-islay"][0]{ _id, contentBlocks }`
  );
  if (!page) {
    console.error('ERROR: guide-dog-friendly-islay not found');
    process.exit(1);
  }

  const current = page.contentBlocks || [];
  console.log(`Current contentBlocks: ${current.length} item(s)`);
  current.forEach((b: any) => console.log(`  - ${b.block?._ref} (${b.version})`));

  // Check if already wired
  const alreadyWired = current.some((b: any) => b.block?._ref === 'canonical-block-dog-travel-basics');
  if (alreadyWired) {
    console.log('\n⚠️  dog-travel-basics already wired — no change needed.');
    return;
  }

  // Append the new block reference
  await client
    .patch('guide-dog-friendly-islay')
    .append('contentBlocks', [{
      _type: 'blockReference',
      block: { _type: 'reference', _ref: 'canonical-block-dog-travel-basics' },
      version: 'full',
      showKeyFacts: false,
    }])
    .commit();

  console.log('\n✓ Wired canonical-block-dog-travel-basics → guide-dog-friendly-islay at version: full');

  // Verify
  const updated = await client.fetch(
    `*[_id == "guide-dog-friendly-islay"][0]{ contentBlocks[]{block->{_id, title}, version} }`
  );
  console.log('\nVerification — contentBlocks now:');
  updated.contentBlocks.forEach((b: any) => {
    console.log(`  - ${b.block?.title} (${b.version})`);
  });
}

main().catch(console.error);
