import { defineType, defineField } from 'sanity';

/**
 * FAQ Block Reference
 *
 * Reusable object for referencing FAQ canonical blocks within pages.
 * Allows pages to show category-filtered FAQ lists.
 *
 * Usage:
 * - Add to page schemas as array field
 * - Reference specific FAQ blocks
 * - Or use category filter to auto-populate FAQs
 */
export default defineType({
  name: 'faqBlockReference',
  title: 'FAQ Block Reference',
  type: 'object',
  fields: [
    defineField({
      name: 'faqBlock',
      title: 'FAQ Block',
      type: 'reference',
      to: [{ type: 'faqCanonicalBlock' }],
      validation: (Rule) => Rule.required(),
      description: 'Select which FAQ to display',
    }),
    defineField({
      name: 'overrideQuestion',
      title: 'Override Question',
      type: 'string',
      description: 'Optional: Override the question text for this specific context',
    }),
  ],
  preview: {
    select: {
      question: 'faqBlock.question',
      category: 'faqBlock.category',
      override: 'overrideQuestion',
    },
    prepare({ question, category, override }) {
      return {
        title: override || question || 'Untitled FAQ',
        subtitle: category,
      };
    },
  },
});
