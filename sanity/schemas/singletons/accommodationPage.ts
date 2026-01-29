import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

/**
 * Accommodation Page
 *
 * Hub page for showcasing our three holiday properties.
 * Links to individual property pages (spokes).
 *
 * Properties:
 * - Portbahn House
 * - Shorefield Eco House
 * - Curlew Cottage
 */
export default defineType({
  name: 'accommodationPage',
  title: 'Accommodation Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'ai-search', title: 'AI & Search Optimization' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...baseSingletonFields,
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
});
