import { defineType, defineField } from 'sanity';

/**
 * Content Section Schema
 *
 * Groups related content blocks and FAQ blocks together on a page.
 * This structure aligns with AI Search Playbook 1.3.1 - creating clear
 * entity boundaries for AI retrieval systems.
 *
 * Design:
 * - Each section = one semantic unit (e.g., "Travel to Islay", "Distilleries")
 * - Can contain 0-many content blocks
 * - Can contain 0-many FAQ blocks
 * - Section titles used for H2/H3 headings (SEO/AEO optimized)
 * - Draggable sections maintain content+FAQ relationships
 *
 * Example Usage:
 * Section: "Ferry to Islay"
 *   └─ Content: travel-to-islay (full)
 *   └─ Content: ferry-support (full)
 *   └─ FAQs: How long is the ferry? / Do you help with disruptions?
 *
 * This keeps related content and questions together as AI retrieves passages.
 */
export default defineType({
  name: 'contentSection',
  title: 'Content Section',
  type: 'object',
  icon: () => '📦',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
      description:
        'SEO-optimized section heading (used as H2 or H3 on page). Be specific for search (e.g., "Ferry to Islay" not "Getting Here")',
    }),
    defineField({
      name: 'sectionId',
      title: 'Section ID (URL Anchor)',
      type: 'slug',
      options: {
        source: 'sectionTitle',
        maxLength: 96,
      },
      description:
        'URL-friendly anchor for this section (e.g., #ferry-to-islay). Auto-generated from title.',
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'array',
      of: [{ type: 'blockReference' }],
      description:
        'One or more content blocks for this section. Optional - can have FAQ-only sections.',
    }),
    defineField({
      name: 'faqBlocks',
      title: 'FAQ Blocks',
      type: 'array',
      of: [{ type: 'faqBlockReference' }],
      description:
        'Related FAQ blocks for this section. Optional - can have content-only sections.',
    }),
    defineField({
      name: 'description',
      title: 'Internal Description',
      type: 'text',
      rows: 2,
      description: 'Internal notes about this section (not displayed publicly)',
    }),
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      contentCount: 'contentBlocks',
      faqCount: 'faqBlocks',
    },
    prepare({ title, contentCount, faqCount }) {
      const contentLen = contentCount?.length || 0;
      const faqLen = faqCount?.length || 0;
      return {
        title: title || 'Untitled Section',
        subtitle: `${contentLen} content block(s) + ${faqLen} FAQ(s)`,
      };
    },
  },
});
