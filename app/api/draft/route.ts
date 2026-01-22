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
  redirectTo: (searchParams) => {
    const slug = searchParams.get('slug');
    const type = searchParams.get('type');

    // Redirect to the preview URL based on content type
    if (type === 'property') {
      return slug ? `/properties/${slug}` : '/';
    } else if (type === 'beach') {
      return slug ? `/beaches/${slug}` : '/';
    } else if (type === 'distillery') {
      return slug ? `/distilleries/${slug}` : '/';
    } else if (type === 'walk') {
      return slug ? `/walks/${slug}` : '/';
    } else if (type === 'village') {
      return slug ? `/villages/${slug}` : '/';
    }

    // Default redirect
    return '/';
  },
});
