# Sanity Schema — Final Implementation
**Date:** 2026-01-26
**Status:** Ready for Claude Code implementation
**Version:** 1.0

---

## Overview

This document defines the Sanity CMS schema required to implement the canonical block architecture for Portbahn Islay. The schema supports:

1. **Canonical content blocks** — Single source of truth for repeated content
2. **Page documents** — Structured pages that reference blocks
3. **Property documents** — Accommodation listings with FAQs
4. **Reusable components** — Property cards, FAQ items

---

## Schema: Canonical Block

The core document type for all reusable content blocks.

```typescript
// schemas/documents/canonicalBlock.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'canonicalBlock',
  title: 'Canonical Block',
  type: 'document',
  fields: [
    defineField({
      name: 'blockId',
      title: 'Block ID',
      type: 'string',
      description: 'Unique identifier (e.g., ferry-basics, trust-signals)',
      validation: Rule => Rule.required().regex(/^[a-z0-9-]+$/, {
        name: 'slug format',
        invert: false
      })
    }),
    defineField({
      name: 'title',
      title: 'Display Title',
      type: 'string',
      description: 'Human-readable title for CMS display'
    }),
    defineField({
      name: 'entityType',
      title: 'Entity Type',
      type: 'string',
      options: {
        list: [
          { title: 'Travel', value: 'travel' },
          { title: 'Trust/Service', value: 'trust' },
          { title: 'Credibility', value: 'credibility' },
          { title: 'Location', value: 'location' },
          { title: 'Place', value: 'place' },
          { title: 'Property', value: 'property' },
          { title: 'Activity', value: 'activity' },
          { title: 'Nature', value: 'nature' }
        ]
      }
    }),
    defineField({
      name: 'canonicalHome',
      title: 'Canonical Home',
      type: 'string',
      description: 'Page slug where full version lives (e.g., /getting-here)'
    }),
    defineField({
      name: 'fullContent',
      title: 'Full Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL'
                  }
                ]
              }
            ]
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' }
          ]
        }
      ],
      description: 'Complete content for canonical home page'
    }),
    defineField({
      name: 'teaserContent',
      title: 'Teaser Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'string',
                    title: 'URL'
                  }
                ]
              }
            ]
          }
        }
      ],
      description: 'Abbreviated content with link to canonical home'
    }),
    defineField({
      name: 'teaserLink',
      title: 'Teaser Link',
      type: 'object',
      fields: [
        { name: 'text', type: 'string', title: 'Link Text' },
        { name: 'href', type: 'string', title: 'URL' }
      ],
      description: 'CTA link appended to teaser (e.g., "Full guide →")'
    }),
    defineField({
      name: 'image',
      title: 'Block Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
        { name: 'caption', type: 'string', title: 'Caption' }
      ],
      description: 'Single image with hotspot — frontend handles sizing for full/teaser contexts'
    }),
    defineField({
      name: 'keyFacts',
      title: 'Key Facts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'fact', type: 'string', title: 'Fact' },
            { name: 'value', type: 'string', title: 'Value' }
          ]
        }
      ],
      description: 'Immutable data points for consistency validation'
    })
  ],
  preview: {
    select: {
      title: 'title',
      blockId: 'blockId',
      entityType: 'entityType'
    },
    prepare({ title, blockId, entityType }) {
      return {
        title: title || blockId,
        subtitle: `${entityType} • ${blockId}`
      }
    }
  }
})
```

---

## Schema: Block Reference

Object type for referencing blocks within pages.

```typescript
// schemas/objects/blockReference.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blockReference',
  title: 'Block Reference',
  type: 'object',
  fields: [
    defineField({
      name: 'block',
      title: 'Block',
      type: 'reference',
      to: [{ type: 'canonicalBlock' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'renderAs',
      title: 'Render As',
      type: 'string',
      options: {
        list: [
          { title: 'Full', value: 'full' },
          { title: 'Teaser', value: 'teaser' }
        ],
        layout: 'radio'
      },
      initialValue: 'teaser',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'sectionHeading',
      title: 'Section Heading Override',
      type: 'string',
      description: 'Optional: Override the default heading when rendered'
    })
  ],
  preview: {
    select: {
      blockTitle: 'block.title',
      blockId: 'block.blockId',
      renderAs: 'renderAs'
    },
    prepare({ blockTitle, blockId, renderAs }) {
      return {
        title: blockTitle || blockId,
        subtitle: renderAs === 'full' ? '📄 Full' : '📝 Teaser'
      }
    }
  }
})
```

---

## Schema: Page (Generic)

Base page document for content pages (Homepage, Getting Here, Explore Islay, etc.).

```typescript
// schemas/documents/page.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'SEO Title' },
        { name: 'description', type: 'text', title: 'Meta Description', rows: 3 }
      ]
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'heading', type: 'string', title: 'H1 Heading' },
        { name: 'tagline', type: 'string', title: 'Tagline' },
        { name: 'image', type: 'image', title: 'Hero Image', options: { hotspot: true } }
      ]
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        { type: 'pageSection' },
        { type: 'blockReference' }
      ]
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{ type: 'faqItem' }]
    }),
    defineField({
      name: 'schemaOrg',
      title: 'Schema.org Markup',
      type: 'text',
      description: 'JSON-LD structured data'
    })
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current'
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug}`
      }
    }
  }
})
```

---

## Schema: Page Section

Custom content sections within pages.

```typescript
// schemas/objects/pageSection.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pageSection',
  title: 'Page Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string'
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading Level',
      type: 'string',
      options: {
        list: [
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' }
        ]
      },
      initialValue: 'h2'
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      description: 'For in-page linking (e.g., #whisky-distilleries)'
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'string', title: 'URL' }]
              }
            ]
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' }
          ]
        },
        { type: 'image', options: { hotspot: true } },
        { type: 'blockReference' }
      ]
    })
  ],
  preview: {
    select: {
      heading: 'heading'
    },
    prepare({ heading }) {
      return {
        title: heading || 'Untitled Section'
      }
    }
  }
})
```

---

## Schema: FAQ Item

Reusable FAQ question/answer pairs.

```typescript
// schemas/objects/faqItem.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'string', title: 'URL' }]
              }
            ]
          }
        }
      ],
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: {
      question: 'question'
    },
    prepare({ question }) {
      return {
        title: question
      }
    }
  }
})
```

---

## Schema: Property

Accommodation property document.

```typescript
// schemas/documents/property.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Property Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short description (e.g., "Our family home — modern comfort for 8 guests")'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'SEO Title' },
        { name: 'description', type: 'text', title: 'Meta Description', rows: 3 }
      ]
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' }
          ]
        }
      ]
    }),
    defineField({
      name: 'details',
      title: 'Property Details',
      type: 'object',
      fields: [
        { name: 'sleeps', type: 'number', title: 'Sleeps' },
        { name: 'bedrooms', type: 'number', title: 'Bedrooms' },
        { name: 'bathrooms', type: 'number', title: 'Bathrooms' },
        { name: 'petsAllowed', type: 'boolean', title: 'Pets Allowed' },
        { name: 'petFee', type: 'string', title: 'Pet Fee' },
        { name: 'parking', type: 'boolean', title: 'Parking Available' }
      ]
    }),
    defineField({
      name: 'bedroomDetails',
      title: 'Bedroom Details',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Room Name' },
            { name: 'beds', type: 'string', title: 'Bed Configuration' },
            { name: 'sleeps', type: 'number', title: 'Sleeps' },
            { name: 'ensuite', type: 'boolean', title: 'Has Ensuite' },
            { name: 'floor', type: 'string', title: 'Floor' }
          ]
        }
      ]
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' }
          ]
        }
      ]
    }),
    defineField({
      name: 'facilities',
      title: 'Facilities',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'highlights',
      title: 'Key Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points for property card display'
    }),
    defineField({
      name: 'locationBlocks',
      title: 'Location Content',
      type: 'array',
      of: [{ type: 'blockReference' }],
      description: 'Canonical blocks for location info'
    }),
    defineField({
      name: 'faqs',
      title: 'Property FAQs',
      type: 'array',
      of: [{ type: 'faqItem' }]
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'url'
    }),
    defineField({
      name: 'schemaOrg',
      title: 'Schema.org Markup',
      type: 'text',
      description: 'JSON-LD structured data for this property'
    })
  ],
  preview: {
    select: {
      title: 'name',
      sleeps: 'details.sleeps',
      media: 'heroImage'
    },
    prepare({ title, sleeps, media }) {
      return {
        title,
        subtitle: sleeps ? `Sleeps ${sleeps}` : '',
        media
      }
    }
  }
})
```

---

## Schema: Property Card

Component for displaying property summaries.

```typescript
// schemas/objects/propertyCard.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'propertyCard',
  title: 'Property Card',
  type: 'object',
  fields: [
    defineField({
      name: 'property',
      title: 'Property',
      type: 'reference',
      to: [{ type: 'property' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'displayStyle',
      title: 'Display Style',
      type: 'string',
      options: {
        list: [
          { title: 'Full Card', value: 'full' },
          { title: 'Compact', value: 'compact' }
        ]
      },
      initialValue: 'full'
    })
  ],
  preview: {
    select: {
      propertyName: 'property.name',
      media: 'property.heroImage'
    },
    prepare({ propertyName, media }) {
      return {
        title: propertyName || 'Select property',
        media
      }
    }
  }
})
```

---

## Schema: Property Card Grid

Container for displaying multiple property cards.

```typescript
// schemas/objects/propertyCardGrid.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'propertyCardGrid',
  title: 'Property Card Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string'
    }),
    defineField({
      name: 'properties',
      title: 'Properties',
      type: 'array',
      of: [{ type: 'propertyCard' }],
      validation: Rule => Rule.max(4)
    })
  ],
  preview: {
    select: {
      heading: 'heading',
      count: 'properties.length'
    },
    prepare({ heading, count }) {
      return {
        title: heading || 'Property Grid',
        subtitle: `${count || 0} properties`
      }
    }
  }
})
```

---

## Schema Index

Export all schemas:

```typescript
// schemas/index.ts

// Documents
import canonicalBlock from './documents/canonicalBlock'
import page from './documents/page'
import property from './documents/property'

// Objects
import blockReference from './objects/blockReference'
import pageSection from './objects/pageSection'
import faqItem from './objects/faqItem'
import propertyCard from './objects/propertyCard'
import propertyCardGrid from './objects/propertyCardGrid'

export const schemaTypes = [
  // Documents
  canonicalBlock,
  page,
  property,

  // Objects
  blockReference,
  pageSection,
  faqItem,
  propertyCard,
  propertyCardGrid
]
```

---

## GROQ Queries

### Get page with resolved blocks

```groq
*[_type == "page" && slug.current == $slug][0] {
  title,
  seo,
  hero,
  sections[] {
    _type,
    _type == "pageSection" => {
      heading,
      headingLevel,
      anchorId,
      content[] {
        ...,
        _type == "blockReference" => {
          renderAs,
          sectionHeading,
          "block": block-> {
            blockId,
            fullContent,
            teaserContent,
            teaserLink
          }
        }
      }
    },
    _type == "blockReference" => {
      renderAs,
      sectionHeading,
      "block": block-> {
        blockId,
        fullContent,
        teaserContent,
        teaserLink
      }
    }
  },
  faqs
}
```

### Get all canonical blocks

```groq
*[_type == "canonicalBlock"] | order(entityType asc, title asc) {
  blockId,
  title,
  entityType,
  canonicalHome,
  keyFacts
}
```

### Get property with resolved location blocks

```groq
*[_type == "property" && slug.current == $slug][0] {
  name,
  slug,
  tagline,
  seo,
  heroImage,
  gallery,
  details,
  bedroomDetails,
  description,
  facilities,
  highlights,
  locationBlocks[] {
    renderAs,
    "block": block-> {
      blockId,
      fullContent,
      teaserContent,
      teaserLink
    }
  },
  faqs,
  bookingUrl
}
```

### Generate FAQ schema markup

```groq
*[_type == "page" && slug.current == $slug][0] {
  "faqSchema": {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs[] {
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": pt::text(answer)
      }
    }
  }
}
```

---

## Migration Strategy

### Pre-Migration: Archive Existing Pages

**CRITICAL:** Before modifying any page documents, archive them:

```bash
# In Sanity Studio or via CLI, export existing documents
sanity documents export --types page,property --out backup-2026-01-26.ndjson
```

Or in Sanity Studio:
1. For each existing page, duplicate it
2. Rename duplicate with `-ARCHIVE-2026-01-26` suffix
3. Set archived pages to draft (unpublished)

This preserves rollback capability if issues arise.

---

### Phase 1: Create Schema Types (Day 1)

**Sequence matters — create in this order:**

1. Create `canonicalBlock.ts` document type
2. Create `blockReference.ts` object type
3. Create `faqItem.ts` object type
4. Create `pageSection.ts` object type
5. Create `propertyCard.ts` and `propertyCardGrid.ts` object types
6. Update `page.ts` to accept new section types
7. Update `property.ts` to accept locationBlocks
8. Update `schemas/index.ts` to export all types
9. Run `sanity deploy` to update Studio

**Verification:** Open Sanity Studio, confirm all new types appear in schema.

---

### Phase 2: Create Canonical Block Documents (Day 1-2)

Create all 16 blocks before touching pages:

1. Create each block document from CANONICAL-BLOCKS-FINAL.md
2. Populate: blockId, title, entityType, canonicalHome
3. Populate: fullContent, teaserContent, teaserLink
4. Populate: keyFacts array
5. Add image with hotspot (can be placeholder initially)
6. **Publish** each block

**Verification:** Query `*[_type == "canonicalBlock"]` returns 16 documents with correct blockIds.

---

### Phase 3: Rebuild Page Documents (Day 2-3)

**For each page, follow this sequence:**

#### 3a. Homepage `/`
1. Open existing Homepage document
2. Archive: Duplicate → rename `homepage-ARCHIVE-2026-01-26` → save as draft
3. On original: Clear `sections` array
4. Rebuild sections per CLAUDE-CODE-HANDOFF.md structure
5. Add block references with correct `renderAs` values
6. Preview → verify renders correctly
7. Publish

#### 3b. Getting Here `/getting-here`
1. Archive existing (duplicate + rename)
2. Clear and rebuild sections
3. Add `ferry-basics` block (renderAs: full)
4. Add `ferry-support` block (renderAs: full)
5. Add custom pageSections for remaining content
6. Add FAQs from source document
7. Preview → Publish

#### 3c. Explore Islay `/explore-islay`
1. Archive existing
2. Clear and rebuild sections
3. Add blocks: distilleries-overview, beaches-overview, wildlife-geese, food-drink-islay, families-children (all renderAs: full)
4. Add jura-day-trip (renderAs: teaser)
5. Add FAQs
6. Preview → Publish

#### 3d. Jura `/jura` — NEW
1. Create new page document
2. Add blocks: jura-day-trip, jura-longer-stay, bothan-jura-teaser (all renderAs: full)
3. Preview → Publish

#### 3e. About `/about` — NEW
1. Create new page document
2. Add about-us block (renderAs: full)
3. Add propertyCardGrid
4. Add bothan-jura-teaser (renderAs: teaser)
5. Preview → Publish

---

### Phase 4: Rebuild Property Documents (Day 3)

For each property:

1. Archive existing (duplicate + rename)
2. Update `locationBlocks` array with block references
3. Add/update FAQs from PROPERTY-FAQ-V3-CORRECTED.md
4. Verify all fields populated
5. Preview → Publish

---

### Phase 5: Frontend Integration (Day 3-4)

1. Create `CanonicalBlock.tsx` component
2. Update GROQ queries to resolve block references
3. Update page templates to render blockReference types
4. Handle image sizing (full context vs teaser context)
5. Test all pages render correctly

---

### Phase 6: Cleanup (Day 5+)

After 1-2 weeks of stable operation:

1. Review archived pages — confirm no issues
2. Delete archived documents (or keep indefinitely, low cost)
3. Document any schema refinements needed

---

## Validation Checklist

Before deployment, verify:

- [ ] All 16 blocks created with correct blockIds
- [ ] Key Facts tables match source document
- [ ] Teaser links resolve correctly
- [ ] FAQ schema.org markup generates correctly
- [ ] Property cards display all required fields
- [ ] Block references resolve in all page types

---

**Document Status:** ✅ Ready for Claude Code implementation
**Token count:** ~3,200
