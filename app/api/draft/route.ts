import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { createClient } from 'next-sanity';

// Create a client with token for draft mode validation
const clientWithToken = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Token with Viewer permissions
});

export const { GET } = defineEnableDraftMode({
  client: clientWithToken,
});
