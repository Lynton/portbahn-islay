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

async function deleteAllBlocks() {
  console.log('Deleting all canonical blocks...');

  const result = await client.delete({ query: '*[_type == "canonicalBlock"]' });

  console.log(`✓ Deleted ${result.results?.length || 0} blocks`);
}

deleteAllBlocks().catch(console.error);
