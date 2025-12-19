import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    // Use SANITY_STUDIO_ prefix for standalone mode, NEXT_PUBLIC_ for Next.js integration
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
});



