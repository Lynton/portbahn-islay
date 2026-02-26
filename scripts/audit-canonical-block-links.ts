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

function extractText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => (b.children || []).map((c: any) => c.text || '').join(''))
    .join(' ');
}

function isAlreadyLinked(blocks: any[], phrase: string): boolean {
  for (const block of blocks) {
    if (block._type !== 'block') continue;
    const markDefs = block.markDefs || [];
    const linkKeys = markDefs.filter((md: any) => md._type === 'link').map((md: any) => md._key);
    for (const child of (block.children || [])) {
      if (child.text?.includes(phrase) && (child.marks || []).some((m: string) => linkKeys.includes(m))) {
        return true;
      }
    }
  }
  return false;
}

async function main() {
  console.log('Fetching siteEntity documents...');
  const entities = await client.fetch(
    `*[_type=="siteEntity"]{name, 'eid': entityId.current, 'website': contact.website, category}`
  );
  console.log(`Found ${entities.length} entities.\n`);

  console.log('Fetching canonicalBlock documents...');
  const blocks = await client.fetch(
    `*[_type=="canonicalBlock"]{_id, title, slug, fullContent}`
  );
  console.log(`Found ${blocks.length} canonical blocks.\n`);

  let totalUnlinked = 0;
  const results: { blockTitle: string; slug: string; unlinked: string[] }[] = [];

  for (const block of blocks) {
    const plainText = extractText(block.fullContent || []);
    const unlinked: string[] = [];

    for (const entity of entities) {
      if (!entity.name) continue;
      if (plainText.includes(entity.name)) {
        if (!isAlreadyLinked(block.fullContent || [], entity.name)) {
          unlinked.push(entity.name);
        }
      }
    }

    if (unlinked.length > 0) {
      results.push({
        blockTitle: block.title || block._id,
        slug: block.slug?.current || '(no slug)',
        unlinked,
      });
      totalUnlinked += unlinked.length;
    }
  }

  console.log('='.repeat(60));
  console.log('AUDIT RESULTS: Unlinked entity mentions in canonical blocks');
  console.log('='.repeat(60));

  if (results.length === 0) {
    console.log('\nNo unlinked entity mentions found.');
  } else {
    for (const r of results) {
      console.log(`\nBlock: "${r.blockTitle}" [${r.slug}]`);
      console.log(`  Unlinked entities (${r.unlinked.length}):`);
      for (const name of r.unlinked) {
        console.log(`    - ${name}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`SUMMARY: ${results.length} blocks with unlinked mentions | ${totalUnlinked} total unlinked entity references`);
  console.log('='.repeat(60));
}

main().catch(console.error);
