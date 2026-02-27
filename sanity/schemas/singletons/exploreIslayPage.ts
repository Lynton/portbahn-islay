import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

/**
 * Explore Islay Page
 *
 * Comprehensive guide to Islay activities, attractions, and experiences.
 * Uses flat contentBlocks + faqBlocks structure for simplicity.
 *
 * Content typically includes (TEASER VERSION ONLY — hub enforces teaser at code level):
 * - distilleries-overview (teaser → /explore-islay/islay-distilleries)
 * - beaches-overview, portbahn-beach
 * - wildlife-geese, families-children, food-drink-islay
 * - jura-day-trip
 *
 * DO NOT wire distilleries-overview as 'full' on this page.
 * Full distillery content belongs exclusively on /explore-islay/islay-distilleries.
 * Rendering full here caused 0.97 semantic similarity (cannibalisation threshold: 0.95).
 * Code-level teaser enforcement added 2026-02-27 as architectural safeguard.
 *
 * FAQs: hub-level only (what is Islay? overview FAQs). Spoke-specific FAQs
 * (distillery visit planning, booking, Fèis Ìle) belong on spoke pages only.
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
