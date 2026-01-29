import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'canonicalBlock',
  title: 'Canonical Content Block',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Block Identity', default: true },
    { name: 'content', title: 'Content Versions' },
    { name: 'facts', title: 'Key Facts' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    // IDENTITY
    defineField({
      name: 'blockId',
      title: 'Block ID',
      type: 'slug',
      group: 'identity',
      description: 'Unique identifier (e.g., travel-to-islay)',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'title',
      title: 'Block Title',
      type: 'string',
      group: 'identity',
      description: 'Human-readable title for Studio (e.g., "Travel to Islay")',
      validation: (Rule) => Rule.required(),
      placeholder: 'Travel to Islay',
    }),
    defineField({
      name: 'entityType',
      title: 'Entity Type',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          { title: 'Travel', value: 'travel' },
          { title: 'Activity', value: 'activity' },
          { title: 'Trust/Service', value: 'trust' },
          { title: 'Credibility', value: 'credibility' },
          { title: 'Location', value: 'location' },
          { title: 'Place', value: 'place' },
          { title: 'Property', value: 'property' },
          { title: 'Nature', value: 'nature' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'canonicalHome',
      title: 'Canonical Home (Page Slug)',
      type: 'string',
      group: 'identity',
      description: 'Where the FULL version lives (e.g., /travel-to-islay or /explore-islay)',
      placeholder: '/travel-to-islay',
      validation: (Rule) => Rule.required(),
    }),

    // CONTENT VERSIONS
    defineField({
      name: 'fullContent',
      title: 'Full Content',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
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
              title: 'Caption (optional)',
            },
          ],
        },
      ],
      description: 'Complete content for canonical home page (preserves full personality)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teaserContent',
      title: 'Teaser Content',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
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
      description: 'Abbreviated version - link to canonical will be auto-appended by frontend',
      validation: (Rule) => Rule.required(),
    }),

    // KEY FACTS (immutable data)
    defineField({
      name: 'keyFacts',
      title: 'Key Facts',
      type: 'array',
      group: 'facts',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'fact',
              title: 'Fact Label',
              type: 'string',
              placeholder: 'Port Askaig crossing',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              placeholder: '2 hours',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'fact',
              subtitle: 'value',
            },
          },
        },
      ],
      description: 'Immutable facts that must remain consistent (e.g., "Port Askaig crossing: 2 hours")',
    }),

    // METADATA
    defineField({
      name: 'usedOn',
      title: 'Used On (Pages)',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      description: 'Pages that reference this block (for tracking). Examples: "Homepage (teaser)", "Getting Here (full)"',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      group: 'meta',
      rows: 3,
      description: 'Editorial notes about this block, content decisions, etc.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'entityType',
      blockId: 'blockId.current',
    },
    prepare({ title, subtitle, blockId }) {
      return {
        title: title || 'Untitled Block',
        subtitle: `${subtitle || 'Unknown'} • ${blockId || 'No ID'}`,
      };
    },
  },
});
