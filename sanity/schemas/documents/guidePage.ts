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
      name: 'site',
      title: 'Site',
      type: 'string',
      group: 'content',
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
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'string',
      group: 'content',
      description: 'Short, punchy sentence for the editorial pull quote section. 60-120 chars. If empty, auto-extracted from content.',
      validation: (Rule) => Rule.max(200).warning('Keep under 120 chars for visual balance'),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      group: 'content',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          { name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule: any) => Rule.required() },
          { name: 'caption', type: 'string', title: 'Caption (optional)' },
        ],
      }],
      description: '2-4 images for inline breaks between content sections. First image = full-bleed with caption bar. Remaining = image pair.',
      validation: (Rule) => Rule.max(6),
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
      name: 'featuredEntities',
      title: 'Featured Entities',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'siteEntity' }] }],
      description: 'Entities featured on this guide page. Used to render entity cards and the page map.',
    }),
    defineField({
      name: 'extendedEditorial',
      title: 'Extended Editorial',
      description: 'Guide-level editorial voice. Renders between contentBlocks and faqBlocks. Page-specific — not a reusable block.',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'keyFactSets',
      title: 'Key Fact Sets',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'keyFactSet' }] }],
      description: 'Reusable key fact sets for this page. Rendered as summary stats grid.',
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
      name: 'layoutHints',
      title: 'Layout Hints',
      type: 'object',
      group: 'content',
      description: 'Template configuration — controls how entities and sections are rendered.',
      fields: [
        defineField({
          name: 'entityDisplayStyle',
          title: 'Entity Display Style',
          type: 'string',
          options: {
            list: [
              { title: 'Grid (default)', value: 'grid' },
              { title: 'Peat Spectrum', value: 'spectrum' },
              { title: 'Attribute Matrix', value: 'matrix' },
              { title: 'History Timeline', value: 'timeline' },
              { title: 'Seasonal Calendar', value: 'calendar' },
            ],
          },
          initialValue: 'grid',
        }),
        defineField({
          name: 'entityGridColumns',
          title: 'Entity Grid Columns',
          type: 'number',
          options: { list: [2, 3] },
          initialValue: 2,
        }),
        defineField({
          name: 'showMap',
          title: 'Show Map',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showPropertyCards',
          title: 'Show Property Cards (Stay on Islay)',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showBjrCard',
          title: 'Show BJR Cross-Promo Card',
          type: 'boolean',
          initialValue: true,
        }),
      ],
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
