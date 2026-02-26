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
    .join('\n\n');
}

async function main() {
  const docs = await client.fetch(
    `*[_type=="canonicalBlock"]{_id, title, fullContent} | order(title asc)`
  );

  for (const doc of docs) {
    const text = extractText(doc.fullContent);
    console.log(`=== BLOCK: ${doc.title} ===`);
    console.log(text);
    console.log('');
  }
}

main().catch(console.error);
