import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

/**
 * Travel to Islay Page (formerly "Getting Here")
 *
 * Comprehensive guide to reaching Isle of Islay by ferry and flight.
 * Uses flat contentBlocks + faqBlocks structure for simplicity.
 *
 * Content typically includes:
 * - travel-to-islay block (ferry info)
 * - ferry-support block (CalMac disruption help)
 *
 * FAQs typically include:
 * - travel-ferries category FAQs
 * - travel-flights category FAQs
 * - travel-planning category FAQs
 */
export default defineType({
  name: 'gettingHerePage',
  title: 'Travel to Islay Page',
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


