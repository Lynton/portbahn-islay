import { defineField } from 'sanity';

// Shared fields for singleton pages (homepage, about, getting-here, etc.)
export const baseSingletonFields = [
  defineField({
    name: 'title',
    title: 'Title (H1 Heading)',
    type: 'string',
    group: 'content',
    validation: (Rule) => Rule.required(),
  }),
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
  }),
  // Canonical Content Blocks (single source of truth for all page content)
  defineField({
    name: 'contentBlocks',
    title: 'Content Blocks',
    type: 'array',
    group: 'content',
    of: [{ type: 'blockReference' }],
    description: 'Canonical content blocks for this page. Each block can be displayed as full or teaser version.',
  }),
  defineField({
    name: 'faqBlocks',
    title: 'FAQ Blocks',
    type: 'array',
    group: 'content',
    of: [{ type: 'faqBlockReference' }],
    description: 'FAQ canonical blocks for this page. Filter by category to show relevant FAQs.',
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

✓ DO: "A travel guide to Isle of Islay, Scotland, covering ferry routes and flight options"
✗ DON'T: "Your ultimate island adventure resource"`,
        placeholder: 'A comprehensive guide to [topic] on Isle of Islay',
        validation: (Rule: any) => Rule.max(150).warning('Keep to one factual sentence')
      },
      {
        name: 'whatItIsNot',
        type: 'array',
        of: [{ type: 'string' }],
        title: 'What It Is NOT',
        description: `Prevent common misconceptions (max 3).

✓ DO: "Not a booking platform", "Not real-time ferry schedules"
✗ DON'T: "Not for everyone"`,
        validation: (Rule: any) => Rule.max(3)
      },
      {
        name: 'primaryDifferentiator',
        type: 'string',
        title: 'Primary Differentiator',
        description: `ONE unique factual characteristic.

✓ DO: "Only guide covering all 10 Islay distilleries with local host insights"
✗ DON'T: "The best guide with amazing tips"`,
        placeholder: 'One unique factual characteristic',
        validation: (Rule: any) => Rule.max(150)
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
        validation: (Rule: any) => Rule.max(5).warning('Keep to 3-5 credentials')
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

✓ DO: "Travel to Islay - Ferry Routes, Flights & Tips | Portbahn Islay"
✗ DON'T: "Plan Your Dream Island Escape Today!"`,
    placeholder: 'Page Title - Topic | Portbahn Islay',
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

✓ DO: "Complete guide to reaching Isle of Islay: CalMac ferry from Kennacraig (2hrs), Loganair flights from Glasgow (25min). Local host tips since 2017."
✗ DON'T: "Amazing travel info! Book now for unforgettable memories!"`,
    placeholder: 'Factual description with specific details',
    validation: (Rule) => Rule.max(320).warning('Optimal: 120-160 chars for Google, up to 320 for AI search'),
  }),
];


