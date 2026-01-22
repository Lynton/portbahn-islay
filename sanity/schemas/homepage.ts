import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Visual Fields
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
      validation: (Rule) => Rule.required(),
    }),

    // Content Fields
    defineField({
      name: 'title',
      title: 'Title (H1 Heading)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (Subtitle)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
      ],
      description: '2-3 intro paragraphs',
    }),
    defineField({
      name: 'whyStayTitle',
      title: 'Why Stay Section - Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'whyStayText',
      title: 'Why Stay Section - Text',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'gettingHereTitle',
      title: 'Getting Here Section - Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'gettingHereText',
      title: 'Getting Here Section - Text',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
      ],
    }),

    // SEO Fields
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Optimized title for search engines (max 70 characters)',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Brief description for search results (max 200 characters)',
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'tagline',
      media: 'heroImage',
    },
  },
});


