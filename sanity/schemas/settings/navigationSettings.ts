import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'navigationSettings',
  title: 'Navigation Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'mainNavigation',
      title: 'Main Navigation',
      type: 'array',
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
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'Internal path (e.g., /accommodation) or external URL',
            },
            {
              name: 'external',
              title: 'External Link',
              type: 'boolean',
              initialValue: false,
              description: 'Check if this is an external URL',
            },
            {
              name: 'children',
              title: 'Sub-menu Items',
              type: 'array',
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
                      name: 'url',
                      title: 'URL',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'external',
                      title: 'External Link',
                      type: 'boolean',
                      initialValue: false,
                    },
                  ],
                  preview: {
                    select: {
                      title: 'label',
                      subtitle: 'url',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        },
      ],
      description: 'Main site navigation menu items',
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'array',
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
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'external',
              title: 'External Link',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        },
      ],
      description: 'Links displayed in the footer',
    }),
  ],
  preview: {
    select: {
      title: '_type',
    },
    prepare() {
      return {
        title: 'Navigation Settings',
      };
    },
  },
});


