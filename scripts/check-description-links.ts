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

async function run() {
  const props = await client.fetch(
    `*[_type=='property']{name, 'slug': slug.current, description, locationIntro}`
  );

  for (const p of props) {
    console.log(`\n====== ${p.name} ======`);
    for (const field of ['description', 'locationIntro'] as const) {
      const blocks = p[field];
      if (!Array.isArray(blocks)) { console.log(`  ${field}: not an array`); continue; }

      const withLinks = blocks.filter((b: any) => b.markDefs && b.markDefs.length > 0);
      if (withLinks.length === 0) {
        console.log(`  ${field}: no existing links`);
        continue;
      }
      console.log(`  ${field}: ${withLinks.length} block(s) with markDefs:`);
      for (const b of withLinks) {
        for (const md of b.markDefs) {
          const span = b.children?.find((c: any) => c.marks?.includes(md._key));
          console.log(`    [${md._type}] "${span?.text}" → ${md.href || JSON.stringify(md)}`);
        }
      }
    }
  }
}

run().catch(console.error);
