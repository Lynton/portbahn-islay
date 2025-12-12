import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import {media} from 'sanity-plugin-media';

export default defineConfig({
  name: 'default',
  title: 'Portbahn Islay',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',

  plugins: [structureTool(), visionTool(), media()],

  schema: {
    types: schemaTypes,
  },
});

