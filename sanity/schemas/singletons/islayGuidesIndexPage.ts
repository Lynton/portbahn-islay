import { defineType } from 'sanity';
import { baseSingletonFields } from '../_base/baseSingletonFields';

export default defineType({
  name: 'islayGuidesIndexPage',
  title: 'Islay Guides Index Page',
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


