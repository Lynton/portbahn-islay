import { defineField } from 'sanity';

// Shared fields for all guide types (beach, distillery, walk, village)
export const baseGuideFields = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    group: 'content',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    group: 'content',
    options: {
      source: 'title',
      maxLength: 96,
    },
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'category',
    title: 'Category',
    type: 'string',
    group: 'content',
    options: {
      list: [
        { title: 'Beaches', value: 'beaches' },
        { title: 'Walks', value: 'walks' },
        { title: 'Distilleries', value: 'distilleries' },
        { title: 'Villages', value: 'villages' },
        { title: 'Food & Drink', value: 'food-drink' },
        { title: 'Ferries', value: 'ferries' },
        { title: 'Travel', value: 'travel' },
        { title: 'Local Essentials', value: 'local-essentials' },
      ],
    },
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
    name: 'summary',
    title: 'Summary',
    type: 'text',
    group: 'content',
    rows: 3,
    description: 'Brief summary (25-40 words)',
    validation: (Rule) => Rule.max(200),
  }),
  defineField({
    name: 'quickFacts',
    title: 'Quick Facts',
    type: 'array',
    group: 'content',
    of: [
      {
        type: 'object',
        fields: [
          {
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'value',
            title: 'Value',
            type: 'string',
            validation: (Rule) => Rule.required(),
          },
        ],
        preview: {
          select: {
            title: 'label',
            subtitle: 'value',
          },
        },
      },
    ],
    description: 'Key facts displayed prominently (e.g., Distance, Duration, Difficulty)',
  }),
  defineField({
    name: 'body',
    title: 'Body Content',
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
    description: 'Main content with structured sections (H2/H3 headings, paragraphs, lists)',
  }),
  defineField({
    name: 'geoMarkers',
    title: 'GEO Markers',
    type: 'array',
    group: 'content',
    of: [{ type: 'string' }],
    description: 'Geographic entities mentioned (distillery names, beaches, villages)',
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
  defineField({
    name: 'relatedProperties',
    title: 'Related Properties',
    type: 'array',
    group: 'content',
    of: [
      {
        type: 'reference',
        to: [{ type: 'property' }],
      },
    ],
    description: 'Properties to feature in cross-link cards',
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
  defineField({
    name: 'ogImage',
    title: 'Open Graph Image',
    type: 'image',
    group: 'seo',
    description: 'Social media preview image (optional, defaults to hero image)',
    options: {
      hotspot: true,
    },
  }),
];

