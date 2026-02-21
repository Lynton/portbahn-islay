/**
 * Create Visit Jura guide page in Sanity
 *
 * Usage: npx tsx --tsconfig scripts/tsconfig.json scripts/create-visit-jura.ts
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

const generateKey = () => Math.random().toString(36).substring(2, 11);

async function createVisitJura() {
  console.log('Creating visit-jura guide page...\n');

  await client.createOrReplace({
    _type: 'guidePage',
    _id: 'guide-visit-jura',
    title: 'Visit Jura from Islay',
    slug: { _type: 'slug', current: 'visit-jura' },
    introduction:
      "Jura is just one short ferry ride from Islay \u2014 five minutes across the sound from Port Askaig. Whether you're planning a day trip or a longer stay at Bothan Jura, our guide covers how to get there, what to see and where to stay.",
    contentBlocks: [
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-jura-day-trip' },
        version: 'full',
      },
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-jura-longer-stay' },
        version: 'full',
      },
      {
        _type: 'blockReference',
        _key: generateKey(),
        block: { _type: 'reference', _ref: 'canonical-block-bothan-jura-teaser' },
        version: 'full',
      },
    ],
    faqBlocks: [],
    seoTitle: 'Visit Jura from Islay | Day Trips & Longer Stays | Portbahn Islay',
    seoDescription:
      'How to visit Jura from Islay: the 5-minute ferry from Port Askaig, day trip ideas, and Bothan Jura for longer stays. Local advice from your Islay hosts.',
  });

  console.log('Done: guide-visit-jura created');
  console.log('Check: http://localhost:3000/guides/visit-jura');
}

createVisitJura().catch(console.error);
