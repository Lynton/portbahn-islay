import { defineField, defineType } from 'sanity';
import { baseGuideFields } from '../_base/baseGuideFields';

export default defineType({
  name: 'walk',
  title: 'Walk',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...baseGuideFields,
    defineField({
      name: 'distance',
      title: 'Distance',
      type: 'string',
      group: 'content',
      description: 'e.g., "3 miles", "5km"',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'content',
      description: 'e.g., "2 hours", "Half day"',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Easy', value: 'easy' },
          { title: 'Moderate', value: 'moderate' },
          { title: 'Challenging', value: 'challenging' },
        ],
      },
    }),
    defineField({
      name: 'startLocation',
      title: 'Start Location',
      type: 'string',
      group: 'content',
      description: 'Where the walk starts (village, car park, etc.)',
    }),
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'distance',
      media: 'heroImage',
    },
  },
});


