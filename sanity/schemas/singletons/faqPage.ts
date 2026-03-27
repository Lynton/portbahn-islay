import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

/**
 * FAQ Page (BJR)
 *
 * Standalone FAQ page. BJR has enough FAQ content (20+ questions) to
 * warrant a dedicated page. PBI embeds FAQs inline on guide pages.
 */
export default defineType({
  name: 'faqPage',
  title: 'FAQ Page',
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
