import { defineType, defineField } from 'sanity';
import { BookIcon } from '@sanity/icons';

/**
 * Guide Page - Focused topic pages (spokes in hub-and-spoke architecture)
 *
 * Used for: /islay-distilleries, /islay-beaches, /islay-wildlife, /jura, etc.
 *
 * Each guide page focuses on ONE topic with:
 * - Full content blocks (3-6 sentences per passage)
 * - Related FAQs (contextually adjacent)
 * - SEO/AI optimization fields
 *
 * Playbook alignment:
 * - Shorter focused pages = better passage extraction
 * - FAQs adjacent to related content = better AI retrieval
 * - Each page = one retrievable entity
 */
export default defineType({
  name: 'guidePage',
  title: 'Guide Page',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO & AI' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title (H1)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
      description: 'Main heading for the page. Keep specific and keyword-rich.',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL path for this page (e.g., "islay-distilleries" → /islay-distilleries)',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Brief intro paragraph (2-3 sentences). Appears before content blocks.',
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'array',
      group: 'content',
      of: [{ type: 'blockReference' }],
      description: 'Editorial content blocks for this page (canonical blocks — ferry info, distilleries, beaches, etc.).',
    }),
    defineField({
      name: 'faqBlocks',
      title: 'FAQ Blocks',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'faqCanonicalBlock' }] }],
      description: 'Q&A blocks for this page. Each item is a question + answer from the FAQ library. Rendered after the content blocks.',
    }),
    defineField({
      name: 'schemaType',
      title: 'Schema Type',
      type: 'string',
      group: 'seo',
      initialValue: 'Article',
      options: {
        list: [
          { title: 'Article', value: 'Article' },
          { title: 'HowTo', value: 'HowTo' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description: 'Choose the schema type for this guide. Default is Article; use HowTo for step-by-step travel/process guides.',
    }),
    // SEO Fields
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Page title for search results. Optimal: 50-60 chars.',
      validation: (Rule) => Rule.max(70).warning('Keep under 60 chars for best display'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Meta description for search results. Optimal: 120-160 chars.',
      validation: (Rule) => Rule.max(320).warning('Keep under 160 chars for best display'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      media: 'heroImage',
    },
    prepare({ title, slug, media }) {
      return {
        title: title || 'Untitled Guide',
        subtitle: slug ? `/${slug}` : 'No slug set',
        media,
      };
    },
  },
});
