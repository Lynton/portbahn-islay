import { defineField, defineType } from 'sanity';
import { baseGuideFields } from '../_base/baseGuideFields';

export default defineType({
  name: 'village',
  title: 'Village',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...baseGuideFields,
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.min(-90).max(90),
        },
        {
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.min(-180).max(180),
        },
      ],
    }),
    defineField({
      name: 'population',
      title: 'Population',
      type: 'number',
      group: 'content',
      description: 'Approximate population (optional)',
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'Notable features (e.g., "Ferry terminal", "Distillery", "Beach")',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      media: 'heroImage',
    },
  },
});


