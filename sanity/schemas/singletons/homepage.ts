import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'ai-search', title: 'AI & Search Optimization' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Visual Fields
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Content Fields
    defineField({
      name: 'title',
      title: 'Title (H1 Heading)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (Subtitle)',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
      ],
      description: '2-3 intro paragraphs',
    }),
    defineField({
      name: 'whyStayTitle',
      title: 'Why Stay Section - Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'whyStayText',
      title: 'Why Stay Section - Text',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'gettingHereTitle',
      title: 'Getting Here Section - Title',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'gettingHereText',
      title: 'Getting Here Section - Text',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
      ],
    }),

    // Canonical Content Blocks
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'array',
      group: 'content',
      of: [{ type: 'blockReference' }],
      description: 'Canonical content blocks for this page. Each block can be displayed as full or teaser version.',
    }),

    // AI & SEARCH OPTIMIZATION
    defineField({
      name: 'entityFraming',
      title: 'Entity Framing',
      type: 'object',
      group: 'ai-search',
      description: `Define what this page IS (and is NOT) for AI systems.

🔴 CRITICAL: Helps AI correctly categorize and cite this page.

✓ DO: Be factual, specific, boring
✗ DON'T: Use marketing language or vague adjectives`,
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'whatItIs',
          type: 'string',
          title: 'What It Is',
          description: `One factual sentence: [Category] + [Topic] + [Location]

✓ DO: "Homepage for Portbahn Islay, featuring 3 self-catering holiday homes in Bruichladdich, Isle of Islay"
✗ DON'T: "Your gateway to the ultimate Islay experience"`,
          placeholder: 'A homepage for [business/service]',
          validation: (Rule) => Rule.max(150).warning('Keep to one factual sentence')
        },
        {
          name: 'whatItIsNot',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'What It Is NOT',
          description: `Prevent common misconceptions (max 3).

✓ DO: "Not a booking platform", "Not a hotel chain"
✗ DON'T: "Not for everyone"`,
          validation: (Rule) => Rule.max(3)
        },
        {
          name: 'primaryDifferentiator',
          type: 'string',
          title: 'Primary Differentiator',
          description: `ONE unique factual characteristic.

✓ DO: "Only accommodation provider in Bruichladdich with 600+ guests since 2017 and 5-minute walk to distillery"
✗ DON'T: "The best place to stay with amazing service"`,
          placeholder: 'One unique factual characteristic',
          validation: (Rule) => Rule.max(150)
        }
      ]
    }),

    defineField({
      name: 'trustSignals',
      title: 'Trust Signals',
      type: 'object',
      group: 'ai-search',
      description: `Credibility information for AI systems.

🟡 OPTIONAL: Adds authority signals to search results.

✓ DO: Use quantifiable facts ("Since 2017", "600+ guests")
✗ DON'T: Use vague claims ("Highly experienced", "Very popular")`,
      options: {
        collapsible: true,
        collapsed: true
      },
      fields: [
        {
          name: 'ownership',
          type: 'string',
          title: 'Ownership Type',
          placeholder: 'Family-owned',
          description: 'How the business is owned/managed'
        },
        {
          name: 'established',
          type: 'string',
          title: 'Established',
          placeholder: 'Hosting guests since 2017',
          description: 'When started operating'
        },
        {
          name: 'guestExperience',
          type: 'string',
          title: 'Guest Experience',
          placeholder: '600+ guests welcomed',
          description: 'Quantifiable experience'
        },
        {
          name: 'localCredentials',
          type: 'array',
          of: [{ type: 'string' }],
          title: 'Credentials',
          description: 'Awards, memberships, certifications',
          validation: (Rule) => Rule.max(5).warning('Keep to 3-5 credentials')
        }
      ]
    }),

    // SEO Fields
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: `Page title for search results (optional - auto-generated if blank).

🔴 CRITICAL: Appears in search results and AI answers.

✓ DO: "Portbahn Islay | Holiday Homes Bruichladdich, Isle of Islay"
✗ DON'T: "Book Your Perfect Island Escape Today!"`,
      placeholder: 'Portbahn Islay | Holiday Homes Bruichladdich',
      validation: (Rule) => Rule.max(255).warning('Optimal: 50-60 chars for Google, up to 255 for AI search'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: `Meta description for search results (optional - auto-generated if blank).

🔴 CRITICAL: Appears in search snippets and AI summaries.

✓ DO: "Three self-catering holiday homes in Bruichladdich, Isle of Islay. Walk to Bruichladdich Distillery, beaches and coastal paths. Modern, eco-friendly and family properties sleeping 6-8 guests."
✗ DON'T: "Amazing property! Book now for unforgettable memories!"`,
      placeholder: 'Factual description of the homepage content',
      validation: (Rule) => Rule.max(320).warning('Optimal: 120-160 chars for Google, up to 320 for AI search'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'tagline',
      media: 'heroImage',
    },
  },
});

