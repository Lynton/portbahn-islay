import { defineType, defineField } from 'sanity';

/**
 * FAQ Canonical Block Schema
 *
 * Reusable FAQ items with category-based organization.
 * Supports long-tail SEO, property-specific FAQs, and related question linking.
 *
 * Design Principles:
 * - Single source of truth for each FAQ
 * - Category-based filtering for page-specific FAQ lists
 * - Optional property-specific targeting
 * - Keyword tracking for SEO research
 * - Related questions for user journey mapping
 *
 * Categories:
 * - property-general: Accommodation questions (any property)
 * - property-specific: Questions about specific properties
 * - travel: Getting to Islay (ferry, flights, driving)
 * - distillery: Whisky distillery visits
 * - wildlife: Birds, seals, nature watching
 * - family: Family-friendly activities
 * - food: Restaurants, dining, local produce
 * - beaches: Beach access, activities
 * - ferry: CalMac ferry specific
 * - booking: Reservations, policies, payments
 */
export default defineType({
  name: 'faqCanonicalBlock',
  title: 'FAQ Canonical Block',
  type: 'document',
  icon: () => '❓',
  groups: [
    {
      name: 'content',
      title: 'FAQ Content',
      default: true,
    },
    {
      name: 'categorization',
      title: 'Categorization',
    },
    {
      name: 'seo',
      title: 'SEO & Keywords',
    },
    {
      name: 'relationships',
      title: 'Related Questions',
    },
  ],
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) =>
        Rule.required().max(200).warning('Questions should be concise (under 200 characters)'),
      description: 'The FAQ question in natural language (how users would ask it)',
      group: 'content',
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
      description: 'The answer to the question (supports rich text, lists, links)',
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Primary Category',
      type: 'string',
      options: {
        list: [
          { title: 'Property (General)', value: 'property-general' },
          { title: 'Portbahn House', value: 'property-portbahn' },
          { title: 'Shorefield', value: 'property-shorefield' },
          { title: 'Curlew', value: 'property-curlew' },
          { title: 'Travel', value: 'travel' },
          { title: 'Distilleries', value: 'distilleries' },
          { title: 'Wildlife', value: 'wildlife' },
          { title: 'Family', value: 'family' },
          { title: 'Food & Drink', value: 'food-drink' },
          { title: 'Beaches', value: 'beaches' },
          { title: 'Ferry', value: 'ferry' },
          { title: 'Flights', value: 'flights' },
          { title: 'Booking', value: 'booking' },
          { title: 'Policies', value: 'policies' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
      description: 'Primary category for filtering FAQs on relevant pages',
      group: 'categorization',
    }),
    defineField({
      name: 'secondaryCategories',
      title: 'Secondary Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Property (General)', value: 'property-general' },
          { title: 'Portbahn House', value: 'property-portbahn' },
          { title: 'Shorefield', value: 'property-shorefield' },
          { title: 'Curlew', value: 'property-curlew' },
          { title: 'Travel', value: 'travel' },
          { title: 'Distilleries', value: 'distilleries' },
          { title: 'Wildlife', value: 'wildlife' },
          { title: 'Family', value: 'family' },
          { title: 'Food & Drink', value: 'food-drink' },
          { title: 'Beaches', value: 'beaches' },
          { title: 'Ferry', value: 'ferry' },
          { title: 'Flights', value: 'flights' },
          { title: 'Booking', value: 'booking' },
          { title: 'Policies', value: 'policies' },
        ],
      },
      description: 'Optional: Additional categories if FAQ applies to multiple contexts',
      group: 'categorization',
    }),
    defineField({
      name: 'keywords',
      title: 'SEO Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords and phrases users might search for (for long-tail SEO research)',
      group: 'seo',
    }),
    defineField({
      name: 'searchVolume',
      title: 'Search Volume',
      type: 'string',
      options: {
        list: [
          { title: 'Unknown', value: 'unknown' },
          { title: 'Low (1-100/mo)', value: 'low' },
          { title: 'Medium (100-1000/mo)', value: 'medium' },
          { title: 'High (1000+/mo)', value: 'high' },
        ],
        layout: 'radio',
      },
      initialValue: 'unknown',
      description: 'Estimated monthly search volume for this question',
      group: 'seo',
    }),
    defineField({
      name: 'relatedQuestions',
      title: 'Related Questions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'faqCanonicalBlock' }],
        },
      ],
      description: 'Other FAQs users might be interested in after reading this one',
      group: 'relationships',
    }),
    defineField({
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(100),
      initialValue: 50,
      description: 'Sort order on pages (lower numbers appear first)',
      group: 'categorization',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Internal notes about this FAQ (not displayed publicly)',
      group: 'relationships',
    }),
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      property: 'propertySpecific.title',
    },
    prepare({ title, category, property }) {
      return {
        title: title || 'Untitled FAQ',
        subtitle: property ? `${category} → ${property}` : category,
      };
    },
  },
});
