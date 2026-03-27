import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

/**
 * Collaborate Page (BJR)
 *
 * Retreats, workshops, seasonal group bookings.
 * Unique to BJR — demoted to footer link, not primary nav.
 */
export default defineType({
  name: 'collaboratePage',
  title: 'Collaborate Page',
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
