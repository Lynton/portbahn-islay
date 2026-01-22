import { defineField, defineType } from 'sanity';
import { baseGuideFields } from '../_base/baseGuideFields';

export default defineType({
  name: 'distillery',
  title: 'Distillery',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...baseGuideFields,
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'content',
      description: 'Village or area name (e.g., "Bruichladdich", "Port Ellen")',
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
    defineField({
      name: 'toursAvailable',
      title: 'Tours Available',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'tourBookingUrl',
      title: 'Tour Booking URL',
      type: 'url',
      group: 'content',
      description: 'Link to book distillery tours',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'heroImage',
    },
  },
});


