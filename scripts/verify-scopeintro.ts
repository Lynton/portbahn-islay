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
  const page = await client.fetch(
    `*[_type == "exploreIslayPage" && !(_id in path("drafts.**"))][0]{ scopeIntro }`
  );
  console.log('scopeIntro:', page?.scopeIntro || '(empty)');
}
run().catch(console.error);
