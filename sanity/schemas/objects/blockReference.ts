import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'blockReference',
  title: 'Content Block Reference',
  type: 'object',
  fields: [
    defineField({
      name: 'block',
      title: 'Canonical Block',
      type: 'reference',
      to: [{ type: 'canonicalBlock' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Version to Display',
      type: 'string',
      options: {
        list: [
          { title: 'Full Content', value: 'full' },
          { title: 'Teaser Content', value: 'teaser' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showKeyFacts',
      title: 'Show Key Facts Table',
      type: 'boolean',
      initialValue: false,
      description: 'Display the key facts table alongside content',
    }),
    defineField({
      name: 'customHeading',
      title: 'Custom Section Heading (Optional)',
      type: 'string',
      description: 'Override the block title with a custom heading for this page',
      placeholder: 'e.g., "How to Get to Islay"',
    }),
    defineField({
      name: 'customKicker',
      title: 'Custom Kicker Label (Optional)',
      type: 'string',
      description: 'Override the kicker label for this block on this page (e.g., "Our Recommendation", "Practical")',
      placeholder: 'e.g., "Our Recommendation"',
    }),
    defineField({
      name: 'displayStyle',
      title: 'Display Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Callout — Teal', value: 'callout-teal' },
          { title: 'Callout — Sand', value: 'callout-sand' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      description: 'Visual treatment for this block section',
    }),
  ],
  preview: {
    select: {
      blockTitle: 'block.title',
      version: 'version',
      blockId: 'block.blockId.current',
    },
    prepare({ blockTitle, version, blockId }) {
      return {
        title: blockTitle || 'Block Reference',
        subtitle: `${version === 'full' ? '📄 Full' : '✂️ Teaser'} • ${blockId || 'No ID'}`,
      };
    },
  },
});
