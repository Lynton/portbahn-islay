# Thread 3 Handoff: Canonical Content Blocks

**Date:** 2026-01-27
**From:** Cowork (content restoration)
**To:** Claude Code (Sanity implementation)

---

## Summary

Thread 2 restored personality and voice to all 16 canonical content blocks. Content has been copy-edited by Lynton and is ready for Sanity implementation.

---

## Files in This Handoff

| File | Description |
|------|-------------|
| `CANONICAL-BLOCKS-FINAL-V2_LL2.md` | 16 content blocks with Full Version, Teaser Version, Key Facts |
| `PORTBAHN-TONE-OF-VOICE-SKILL-V1.2.md` | Updated voice guide (added spaced hyphen convention) |

---

## Task for Claude Code

### 1. Create Sanity Schema

Create `sanity/schemas/documents/canonicalBlock.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'canonicalBlock',
  title: 'Canonical Content Block',
  type: 'document',
  fields: [
    defineField({
      name: 'blockId',
      title: 'Block ID',
      type: 'string',
      description: 'Unique identifier (e.g., travel-to-islay)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'entityType',
      title: 'Entity Type',
      type: 'string',
      options: {
        list: ['Travel', 'Activity', 'Trust', 'Credibility', 'Location', 'Place', 'Property', 'Nature']
      }
    }),
    defineField({
      name: 'canonicalHome',
      title: 'Canonical Home',
      type: 'string',
      description: 'Page slug where full version lives'
    }),
    defineField({
      name: 'fullContent',
      title: 'Full Version',
      type: 'portableText'  // or 'array' of block content
    }),
    defineField({
      name: 'teaserContent',
      title: 'Teaser Version',
      type: 'portableText'
    }),
    defineField({
      name: 'keyFacts',
      title: 'Key Facts',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'fact', type: 'string', title: 'Fact' },
          { name: 'value', type: 'string', title: 'Value' }
        ]
      }]
    })
  ],
  preview: {
    select: { title: 'blockId', subtitle: 'entityType' }
  }
})
```

### 2. Import 16 Blocks

Parse `CANONICAL-BLOCKS-FINAL-V2_LL2.md` and create Sanity documents for each block:

| Block ID | Entity Type |
|----------|-------------|
| `travel-to-islay` | Travel |
| `distilleries-overview` | Activity |
| `families-children` | Activity |
| `ferry-support` | Trust |
| `trust-signals` | Credibility |
| `bruichladdich-proximity` | Location |
| `portbahn-beach` | Place |
| `shorefield-character` | Property |
| `port-charlotte-village` | Place |
| `wildlife-geese` | Nature |
| `food-drink-islay` | Activity |
| `beaches-overview` | Place |
| `jura-day-trip` | Activity |
| `jura-longer-stay` | Activity |
| `bothan-jura-teaser` | Property |
| `about-us` | Trust |

### 3. Add Block References to Pages

Create a reusable object type for referencing blocks:

```typescript
defineField({
  name: 'contentBlocks',
  title: 'Content Blocks',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      {
        name: 'block',
        type: 'reference',
        to: [{ type: 'canonicalBlock' }]
      },
      {
        name: 'renderAs',
        type: 'string',
        options: { list: ['full', 'teaser'] }
      }
    ]
  }]
})
```

### 4. Interlinking (Second Pass)

After import, add links within content:

**Internal links** - Match final URL structure:
- `/travel-to-islay`
- `/explore-islay`
- `/explore-islay#whisky-distilleries-on-islay`
- `/explore-islay#families-children`
- `/explore-islay#islays-beaches`
- `/explore-islay#wildlife-on-islay`
- `/explore-islay#where-to-eat-on-islay`
- `/properties/shorefield`
- `/jura`

**External canonical sources** - Distillery websites, CalMac, VisitScotland, etc.

---

## Key Facts Reference

These must remain consistent across all blocks:

| Fact | Value |
|------|-------|
| Walk to Bruichladdich Distillery | 5 minutes |
| Walk to Portbahn Beach | 5 minutes |
| Drive to Port Charlotte | 5 minutes |
| Ferry to Port Askaig | 2 hours |
| Ferry to Port Ellen | 2 hours 20 minutes |
| Ferry booking window | 12 weeks |
| Guests hosted | 600+ |
| Hosting since | 2017 |
| Average rating | 4.97/5 |
| Communication rating | 5.0/5 |
| Distilleries on Islay | 10 |

---

## Editorial Note

**Hyphen convention:** Use spaced hyphens ( - ) not em dashes (—) for breaks in sentences. Hyphenated compound words (well-loved, 5-minute) have no spaces.

---

## Status

- [x] Content blocks restored with personality
- [x] Copy-edited by Lynton
- [x] Typos corrected
- [x] Tone of voice skill updated to v1.2
- [ ] Sanity schema created
- [ ] Blocks imported to Sanity
- [ ] Pages connected to blocks
- [ ] Interlinking added
