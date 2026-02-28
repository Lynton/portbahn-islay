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

async function run() {
  const blocks = await client.fetch(
    `*[_type == "canonicalBlock" && blockId.current in ["distilleries-overview", "shorefield-character"] && !(_id in path("drafts.**"))]{
      blockId, teaserContent, "firstFullPara": fullContent[0]
    }`
  );
  for (const b of blocks) {
    console.log('\n---', b.blockId.current, '---');
    const t = b.teaserContent?.[0]?.children?.[0]?.text;
    const f = b.firstFullPara?.children?.[0]?.text;
    console.log('teaserContent[0]:', t ? t.slice(0, 150) : '(empty)');
    console.log('fullContent[0]:', f ? f.slice(0, 150) : '(empty)');
  }
}
run().catch(console.error);
