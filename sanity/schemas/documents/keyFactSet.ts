import { defineType, defineField } from 'sanity'

/**
 * Key Fact Set — standalone reusable document type for grouped label/value summary stats.
 * Replaces inline keyFacts[] on canonicalBlock.
 * Reusable across pages: e.g. distillery facts on distilleries page AND planning page.
 *
 * Schema v2: entity → block → page. Key facts are their own content type, like FAQs.
 */
export default defineType({
  name: 'keyFactSet',
  title: 'Key Fact Set',
  type: 'document',
  icon: () => '📊',
  fields: [
    defineField({
      name: 'factSetId',
      title: 'Fact Set ID',
      type: 'slug',
      description: 'Unique identifier (e.g., "distillery-stats", "ferry-times")',
      validation: (Rule) => Rule.required(),
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Human-readable title for Studio (e.g., "Distillery Key Facts")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'site',
      title: 'Site',
      type: 'string',
      options: {
        list: [
          { title: 'PBI (Portbahn Islay)', value: 'pbi' },
          { title: 'BJR (Bothan Jura Retreat)', value: 'bjr' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'pbi',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Travel', value: 'travel' },
          { title: 'Distilleries', value: 'distilleries' },
          { title: 'Beaches', value: 'beaches' },
          { title: 'Wildlife', value: 'wildlife' },
          { title: 'Food & Drink', value: 'food' },
          { title: 'Walking', value: 'walking' },
          { title: 'Villages', value: 'villages' },
          { title: 'Heritage', value: 'heritage' },
          { title: 'Geology', value: 'geology' },
          { title: 'Accommodation', value: 'accommodation' },
          { title: 'Planning', value: 'planning' },
          { title: 'General', value: 'general' },
        ],
        layout: 'dropdown',
      },
      description: 'For filtering in Studio',
    }),
    defineField({
      name: 'tags',
      title: 'Topic Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Travel', value: 'travel' },
          { title: 'Ferry', value: 'ferry' },
          { title: 'Planning', value: 'planning' },
          { title: 'Walking', value: 'walking' },
          { title: 'Swimming', value: 'swimming' },
          { title: 'Wildlife', value: 'wildlife' },
          { title: 'Distilleries', value: 'distilleries' },
          { title: 'Food & Drink', value: 'food' },
          { title: 'Beaches', value: 'beaches' },
          { title: 'Events', value: 'events' },
          { title: 'Wellness', value: 'wellness' },
          { title: 'Dog Friendly', value: 'dog-friendly' },
          { title: 'Dark Skies', value: 'dark-skies' },
          { title: 'Photography', value: 'photography' },
          { title: 'Heritage', value: 'heritage' },
          { title: 'Geology', value: 'geology' },
          { title: 'Villages', value: 'villages' },
          { title: 'Accommodation', value: 'accommodation' },
        ],
      },
      description: 'Topic tags for cross-page querying. A key fact set can appear on any page matching its tags.',
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            placeholder: 'Distilleries',
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'value',
            title: 'Value',
            type: 'string',
            placeholder: '10',
            description: 'Free text — include units inline (e.g. "£10–15", "5 min walk")',
            validation: (Rule) => Rule.required(),
          }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'value' },
        },
      }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Editorial notes (not displayed publicly)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      factSetId: 'factSetId.current',
    },
    prepare({ title, category, factSetId }) {
      return {
        title: title || 'Untitled Fact Set',
        subtitle: `${category || 'general'} • ${factSetId || 'No ID'}`,
      }
    },
  },
})
