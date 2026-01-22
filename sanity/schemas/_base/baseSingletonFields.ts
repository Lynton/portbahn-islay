import { defineField } from 'sanity';

// Shared fields for singleton pages (homepage, about, getting-here, etc.)
export const baseSingletonFields = [
  defineField({
    name: 'title',
    title: 'Title (H1 Heading)',
    type: 'string',
    group: 'content',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'heroImage',
    title: 'Hero Image',
    type: 'image',
    group: 'content',
    options: {
      hotspot: true,
    },
    fields: [
      {
        name: 'alt',
        type: 'string',
        title: 'Alt Text',
        validation: (Rule) => Rule.required(),
      },
    ],
  }),
  defineField({
    name: 'content',
    title: 'Content',
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
          {
            name: 'caption',
            type: 'string',
            title: 'Caption',
          },
        ],
      },
    ],
    description: 'Main page content',
  }),
  // SEO Fields
  defineField({
    name: 'seoTitle',
    title: 'SEO Title',
    type: 'string',
    group: 'seo',
    description: 'Optimized title for search engines (max 70 characters)',
    validation: (Rule) => Rule.max(70).warning('SEO titles should be 70 characters or less'),
  }),
  defineField({
    name: 'seoDescription',
    title: 'SEO Description',
    type: 'text',
    group: 'seo',
    rows: 3,
    description: 'Brief description for search results (max 200 characters)',
    validation: (Rule) => Rule.max(200).warning('SEO descriptions should be 200 characters or less'),
  }),
];


