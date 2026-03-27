import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

/**
 * Explore Jura Page (BJR)
 *
 * Hub page for Jura activities, nature, and culture.
 * Uses flat contentBlocks + faqBlocks structure.
 * BJR equivalent of exploreIslayPage.
 */
export default defineType({
  name: 'exploreJuraPage',
  title: 'Explore Jura Page',
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
