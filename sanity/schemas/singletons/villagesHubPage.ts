import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

export default defineType({
  name: 'villagesHubPage',
  title: 'Villages Hub Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...baseSingletonFields,
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
});


