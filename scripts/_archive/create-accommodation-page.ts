/**
 * Create Accommodation Hub Page in Sanity
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const accommodationPage = {
  _type: 'accommodationPage',
  _id: 'accommodationPage',
  title: 'Our Holiday Properties on Islay',
  seoTitle: 'Holiday Accommodation on Islay | Portbahn Islay',
  seoDescription: 'Three unique self-catering holiday properties in Bruichladdich, Islay. Sea view houses, eco cottages, and traditional island homes.',
};

async function createAccommodationPage() {
  console.log('Creating accommodation page...\n');

  try {
    const existing = await client.fetch(`*[_id == $id][0]`, { id: 'accommodationPage' });

    if (existing) {
      console.log('⏭️  Accommodation page already exists, skipping');
      return;
    }

    await client.createOrReplace(accommodationPage);
    console.log('✅ Created: Accommodation Hub Page');
  } catch (error: any) {
    console.error('❌ Error creating accommodation page:', error.message);
  }

  console.log('\n✅ Accommodation page created!');
  console.log('\nNext steps:');
  console.log('1. Add hero image in Sanity Studio');
  console.log('2. Test page at /accommodation');
  console.log('3. Verify property cards are displaying correctly');
}

createAccommodationPage().catch(console.error);
