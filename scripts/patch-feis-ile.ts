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
  const doc = await client.fetch(`*[_type=="siteEntity" && entityId.current=="feis-ile"][0]{_id, name}`);
  if (!doc) { console.log('Not found'); return; }
  await client.patch(doc._id).setIfMissing({ contact: {} }).set({ 'contact.website': 'https://feisile.co.uk/' }).commit();
  console.log('Patched:', doc.name, '→ https://feisile.co.uk/');
}
run().catch(console.error);
