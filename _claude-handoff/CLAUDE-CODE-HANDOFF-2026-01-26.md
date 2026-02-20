# Claude Code Handoff — Portbahn Islay Website
**Date:** 2026-01-26
**Status:** Ready for implementation
**Version:** 1.0

---

## Project Overview

This document provides everything needed for Claude Code to implement the Portbahn Islay website content architecture in Sanity CMS and the Next.js frontend.

**Goal:** Implement a canonical content block system where repeated content has a single source of truth, with full and teaser versions that render appropriately across different pages.

---

## Source Documents

| Document | Location | Purpose |
|----------|----------|---------|
| `CANONICAL-BLOCKS-FINAL.md` | `docs/content/` | All 16 content blocks with full + teaser content |
| `SANITY-SCHEMA-FINAL.md` | `docs/schemas/` | Complete Sanity schema definitions |
| `CONTENT-ARCHITECTURE-MVP.md` | `docs/content/` | Site structure and page-by-page content mapping |
| `HOMEPAGE-V3-CORRECTED.md` | `docs/content/` | Homepage content (ready) |
| `GETTING-HERE-V3-CORRECTED.md` | `docs/content/` | Getting Here page content (ready) |
| `EXPLORE-ISLAY-V3-CORRECTED.md` | `docs/content/` | Explore Islay page content (ready) |
| `PROPERTY-FAQ-V3-CORRECTED.md` | `docs/content/` | Property FAQ content (ready) |
| `PORTBAHN-TONE-OF-VOICE-SKILL.md` | `docs/content/` | Editorial voice guide for content validation |

---

## Pre-Migration: Archive Existing Pages

**CRITICAL:** Before modifying any documents, archive them for rollback capability.

**Option A — CLI Export:**
```bash
sanity documents export --types page,property --out backup-2026-01-26.ndjson
```

**Option B — Studio Duplicates:**
1. For each existing page, duplicate it
2. Rename with `-ARCHIVE-2026-01-26` suffix
3. Keep archived versions as drafts (unpublished)

Do NOT delete originals until new structure is stable (1-2 weeks minimum).

---

## Implementation Tasks

### Task 1: Create Sanity Schema Types

**Files to create/update:**

```
sanity/
├── schemas/
│   ├── documents/
│   │   ├── canonicalBlock.ts    # NEW
│   │   ├── page.ts              # UPDATE
│   │   └── property.ts          # UPDATE
│   ├── objects/
│   │   ├── blockReference.ts    # NEW
│   │   ├── pageSection.ts       # NEW or UPDATE
│   │   ├── faqItem.ts           # NEW or UPDATE
│   │   ├── propertyCard.ts      # NEW
│   │   └── propertyCardGrid.ts  # NEW
│   └── index.ts                 # UPDATE
```

**Schema definitions:** See `SANITY-SCHEMA-FINAL.md` for complete TypeScript schemas.

**Validation rules:**
- `blockId` must be lowercase with hyphens only
- `renderAs` must be 'full' or 'teaser'
- Block references must resolve to existing canonical blocks

---

### Task 2: Create Canonical Block Documents

Create 16 canonical block documents in Sanity:

| # | blockId | entityType | Source Section |
|---|---------|------------|----------------|
| 1 | `ferry-basics` | travel | CANONICAL-BLOCKS-FINAL.md, Block 1 |
| 2 | `ferry-support` | trust | CANONICAL-BLOCKS-FINAL.md, Block 2 |
| 3 | `trust-signals` | credibility | CANONICAL-BLOCKS-FINAL.md, Block 3 |
| 4 | `bruichladdich-proximity` | location | CANONICAL-BLOCKS-FINAL.md, Block 4 |
| 5 | `portbahn-beach` | place | CANONICAL-BLOCKS-FINAL.md, Block 5 |
| 6 | `shorefield-character` | property | CANONICAL-BLOCKS-FINAL.md, Block 6 |
| 7 | `port-charlotte-village` | place | CANONICAL-BLOCKS-FINAL.md, Block 7 |
| 8 | `distilleries-overview` | activity | CANONICAL-BLOCKS-FINAL.md, Block 8 |
| 9 | `wildlife-geese` | nature | CANONICAL-BLOCKS-FINAL.md, Block 9 |
| 10 | `food-drink-islay` | activity | CANONICAL-BLOCKS-FINAL.md, Block 10 |
| 11 | `beaches-overview` | place | CANONICAL-BLOCKS-FINAL.md, Block 11 |
| 12 | `families-children` | activity | CANONICAL-BLOCKS-FINAL.md, Block 12 |
| 13 | `jura-day-trip` | activity | CANONICAL-BLOCKS-FINAL.md, Block 13 |
| 14 | `jura-longer-stay` | activity | CANONICAL-BLOCKS-FINAL.md, Block 14 |
| 15 | `bothan-jura-teaser` | property | CANONICAL-BLOCKS-FINAL.md, Block 15 |
| 16 | `about-us` | trust | CANONICAL-BLOCKS-FINAL.md, Block 16 |

**For each block, populate:**
- `blockId` — Exact ID from table
- `title` — Human-readable name
- `entityType` — From table
- `canonicalHome` — Page slug where full version lives
- `fullContent` — PortableText from "Full Version" section
- `teaserContent` — PortableText from "Teaser Version" section
- `teaserLink` — Link text and href from teaser
- `image` — Single image with hotspot enabled (frontend handles sizing)
- `keyFacts` — Array from "Key Facts" table

**Image approach:** Each block has one image field with hotspot. Frontend renders at appropriate size based on `renderAs` context. No separate thumbnail field — if needed later, can add.

---

### Task 3: Rebuild Page Documents

**Migration sequence for each page:**
1. Archive existing (duplicate → rename with `-ARCHIVE-2026-01-26` → save as draft)
2. On original: clear `sections` array
3. Rebuild sections per structure below
4. Add block references with correct `renderAs` values
5. Preview → verify renders correctly
6. Publish

---

#### Homepage `/`

**Source:** `HOMEPAGE-V3-CORRECTED.md`

**Structure:**
```
sections:
  - pageSection: "Welcome to Portbahn Islay" (custom content)
  - propertyCardGrid: 3 properties
  - blockReference: trust-signals (FULL)
  - pageSection: "Why We Love Bruichladdich" (custom + blocks)
    - blockReference: bruichladdich-proximity (FULL)
    - blockReference: port-charlotte-village (FULL)
  - blockReference: ferry-basics (TEASER)
  - pageSection: "Plan Your Islay Stay" (custom CTA)
```

#### Getting Here `/getting-here`

**Source:** `GETTING-HERE-V3-CORRECTED.md`

**Structure:**
```
sections:
  - pageSection: "Pi's Welcome" (custom)
  - blockReference: ferry-basics (FULL) ← canonical home
  - pageSection: "How to Book Your Ferry Crossing" (custom)
  - pageSection: "What to Expect on the Crossing" (custom)
  - blockReference: ferry-support (FULL) ← canonical home
  - pageSection: "Flying from Glasgow" (custom)
  - pageSection: "Do You Need a Car on Islay?" (custom)
  - pageSection: "Planning Your Journey" (custom)
faqs: [5 FAQ items from source]
```

#### Explore Islay `/explore-islay`

**Source:** `EXPLORE-ISLAY-V3-CORRECTED.md`

**Structure:**
```
sections:
  - pageSection: "Pi's Introduction" (custom)
  - blockReference: distilleries-overview (FULL) ← canonical home
  - blockReference: beaches-overview (FULL) ← canonical home
  - blockReference: wildlife-geese (FULL) ← canonical home
  - blockReference: food-drink-islay (FULL) ← canonical home
  - blockReference: families-children (FULL) ← canonical home
  - pageSection: "Planning Your Islay Days" (custom)
  - blockReference: jura-day-trip (TEASER)
faqs: [5 FAQ items from source]
```

#### Jura `/jura` — NEW PAGE

**Source:** `CONTENT-ARCHITECTURE-MVP.md`, `CANONICAL-BLOCKS-FINAL.md`

**Structure:**
```
sections:
  - pageSection: "Intro to Jura" (custom)
  - blockReference: jura-day-trip (FULL) ← canonical home
  - blockReference: jura-longer-stay (FULL) ← canonical home
  - blockReference: bothan-jura-teaser (FULL) ← canonical home
faqs: [TBD - Jura-specific FAQs]
```

#### About `/about` — NEW PAGE

**Source:** `CONTENT-ARCHITECTURE-MVP.md`, `CANONICAL-BLOCKS-FINAL.md`

**Structure:**
```
sections:
  - blockReference: about-us (FULL) ← canonical home
  - pageSection: "Our Philosophy" (custom)
  - propertyCardGrid: 3 Islay properties
  - blockReference: bothan-jura-teaser (TEASER)
```

---

### Task 4: Rebuild Property Documents

**Migration sequence for each property:**
1. Archive existing (duplicate → rename with `-ARCHIVE-2026-01-26`)
2. On original: update `locationBlocks` with block references
3. Add/update FAQs from source document
4. Preview → Publish

---

#### Portbahn House `/accommodation/portbahn-house`

**Details:**
- Sleeps: 8
- Bedrooms: 3
- Pets: Yes (£15/dog/stay)
- Key feature: Ground floor bedrooms, accessible

**Location blocks:**
- `bruichladdich-proximity` (TEASER)
- `port-charlotte-village` (TEASER)
- `portbahn-beach` (TEASER)

**FAQs:** From `PROPERTY-FAQ-V3-CORRECTED.md`, Portbahn House section (5 questions)

#### Shorefield `/accommodation/shorefield-eco-house`

**Details:**
- Sleeps: 6
- Bedrooms: 3
- Pets: Yes (£15/dog/stay)
- Key feature: Bird hides, eco-house, character

**Location blocks:**
- `bruichladdich-proximity` (TEASER)
- `shorefield-character` (FULL) ← canonical home
- `portbahn-beach` (TEASER)

**FAQs:** From `PROPERTY-FAQ-V3-CORRECTED.md`, Shorefield section (5 questions)

#### Curlew Cottage `/accommodation/curlew-cottage`

**Details:**
- Sleeps: 6
- Bedrooms: 3
- Pets: No (pet-free)
- Key feature: Walled garden, pet-free, quiet

**Location blocks:**
- `bruichladdich-proximity` (TEASER)
- `port-charlotte-village` (TEASER)
- `portbahn-beach` (TEASER)

**FAQs:** From `PROPERTY-FAQ-V3-CORRECTED.md`, Curlew Cottage section (5 questions)

---

### Task 5: Frontend Block Rendering

Create a React component that renders blocks based on `renderAs` mode:

```tsx
// components/CanonicalBlock.tsx

import { PortableText } from '@portabletext/react'

interface BlockProps {
  block: {
    blockId: string
    fullContent: any[]
    teaserContent: any[]
    teaserLink?: {
      text: string
      href: string
    }
  }
  renderAs: 'full' | 'teaser'
  sectionHeading?: string
}

export function CanonicalBlock({ block, renderAs, sectionHeading }: BlockProps) {
  const content = renderAs === 'full' ? block.fullContent : block.teaserContent

  return (
    <section id={block.blockId} className="canonical-block">
      {sectionHeading && <h2>{sectionHeading}</h2>}
      <PortableText value={content} />
      {renderAs === 'teaser' && block.teaserLink && (
        <a href={block.teaserLink.href} className="teaser-link">
          {block.teaserLink.text}
        </a>
      )}
    </section>
  )
}
```

---

### Task 6: GROQ Query Updates

Update page queries to resolve block references:

```groq
// lib/queries.ts

export const pageQuery = groq`
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
    faqs[] {
      question,
      answer
    }
  }
`
```

---

## Key Facts Validation

When rendering content, these facts must be consistent across all pages:

| Fact | Correct Value |
|------|---------------|
| Walk to Bruichladdich Distillery | 5 minutes |
| Ferry to Port Askaig | 2 hours |
| Ferry to Port Ellen | 2 hours 20 minutes |
| Ferry booking window | 12 weeks |
| Guests hosted | 600+ |
| Average rating | 4.97/5 |
| Communication rating | 5.0/5 |
| Distilleries on Islay | 10 |
| Barnacle geese | 30,000+ |
| Alan's name spelling | Alan (not Allan) |
| Portbahn Beach walk | 5 minutes via war memorial path |
| Port Charlotte drive | 5 minutes |
| Port Charlotte walk | 40 minutes |

---

## Naming Conventions

**Property Names (always use full names):**
- ✅ Portbahn House (not "Portbahn")
- ✅ Shorefield (in copy) / Shorefield Eco House (in titles)
- ✅ Curlew Cottage (not "Curlew")

**Route patterns:**
- `/accommodation/portbahn-house`
- `/accommodation/shorefield-eco-house`
- `/accommodation/curlew-cottage`

---

## Testing Checklist

After implementation, verify:

**Schema:**
- [ ] All 16 canonical blocks created with correct blockIds
- [ ] Block references resolve in Sanity Studio
- [ ] Property documents display all fields

**Content:**
- [ ] Full versions render on canonical home pages
- [ ] Teaser versions render with correct links
- [ ] Key Facts match across all block usages
- [ ] FAQ schema.org markup generates correctly

**Pages:**
- [ ] Homepage loads with all sections
- [ ] Getting Here loads with resolved blocks
- [ ] Explore Islay loads with resolved blocks
- [ ] Jura page loads (new)
- [ ] About page loads (new)
- [ ] All three property pages load with FAQs

**Links:**
- [ ] Teaser links navigate to correct anchors
- [ ] Property links resolve correctly
- [ ] Internal navigation works

---

## Post-Migration Cleanup

After 1-2 weeks of stable operation:

1. Review archived pages — confirm no rollback needed
2. Delete `-ARCHIVE-` documents (or keep indefinitely, storage cost is minimal)
3. Document any schema refinements discovered during migration
4. Update this handoff document with lessons learned

---

## Post-Implementation Notes

**Future additions (post-MVP):**
- Individual distillery guide pages
- Individual beach guide pages
- Walking route guides
- Long-tail content from Answer the Public

**Content updates:**
- When updating repeated content, edit the canonical block only
- All pages referencing that block will update automatically
- Key Facts table ensures consistency

---

## Contact

Questions about this implementation should be directed to the content owner for clarification before proceeding.

---

**Document Status:** ✅ Ready for Claude Code implementation
**Token count:** ~2,100
