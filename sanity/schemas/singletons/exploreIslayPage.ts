import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

/**
 * Explore Islay Page
 *
 * Comprehensive guide to Islay activities, attractions, and experiences.
 * Uses flat contentBlocks + faqBlocks structure for simplicity.
 *
 * Content typically includes:
 * - distilleries-overview, beaches-overview, portbahn-beach
 * - wildlife-geese, families-children, food-drink-islay
 * - jura-day-trip
 *
 * FAQs typically include:
 * - distilleries, family, jura category FAQs
 * - property-specific beach proximity FAQs
 */
export default defineType({
  name: 'exploreIslayPage',
  title: 'Explore Islay Page',
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
