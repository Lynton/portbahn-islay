import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'The FAQ question (used in accordion)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'question',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL slug for full article page (/faq/{slug})',
    }),
    defineField({
      name: 'shortAnswer',
      title: 'Short Answer',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
      ],
      description: 'Brief answer for accordion (max 3 sentences)',
    }),
    defineField({
      name: 'fullAnswer',
      title: 'Full Answer',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: 'Detailed answer for full article page',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Before You Arrive', value: 'before-arrive' },
          { title: 'At the Property', value: 'at-property' },
          { title: 'Local Essentials', value: 'local-essentials' },
          { title: 'Troubleshooting', value: 'troubleshooting' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedProperty',
      title: 'Related Property',
      type: 'reference',
      group: 'content',
      to: [{ type: 'property' }],
      description: 'Optional: Link to specific property if FAQ is property-specific',
    }),
    defineField({
      name: 'relatedGuides',
      title: 'Related Guides',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'beach' },
            { type: 'distillery' },
            { type: 'walk' },
            { type: 'village' },
          ],
        },
      ],
      description: 'Links to related guide pages',
    }),
    // SEO Fields
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Optimized title for search engines (max 60 characters)',
      validation: (Rule) => Rule.max(60).warning('SEO titles should be 60 characters or less'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Brief description for search results (max 160 characters)',
      validation: (Rule) => Rule.max(160).warning('SEO descriptions should be 160 characters or less'),
    }),
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
    },
  },
});


