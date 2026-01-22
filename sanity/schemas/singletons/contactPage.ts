import { defineField, defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...baseSingletonFields,
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
});


