# Portbahn Islay — Sanity CMS Build Specification

**For:** Claude Code
**Version:** 1.0
**Date:** 2026-02-20
**Status:** Ready for implementation

---

## Overview

The Portbahn Islay CMS uses a two-layer content architecture:

1. **Canonical blocks** — 16 reusable content units, each with a full version, teaser version, and immutable key facts. These are defined in `CANONICAL-BLOCKS-FINAL.md` and map to the `canonicalBlock` document type in Sanity.

2. **Pages** — Page documents that combine canonical block references with page-specific editorial content. Each V3 page file in this folder defines one page. Block text has been removed from page files and replaced with `BLOCK REF` markers (see convention below). Everything else is editorial `portableText`.

The block content itself lives **only** in `CANONICAL-BLOCKS-FINAL.md` / Sanity `canonicalBlock` documents. It is never duplicated into page documents.

---

## Source Files

| File | Purpose |
|------|---------|
| `CANONICAL-BLOCKS-FINAL.md` | Source for all 16 `canonicalBlock` documents |
| `HOMEPAGE-V3-CORRECTED.md` | Page spec for `/` |
| `GETTING-HERE-V3-CORRECTED.md` | Page spec for `/getting-here` |
| `EXPLORE-ISLAY-V3-CORRECTED.md` | Page spec for `/explore-islay` |
| `PROPERTY-FAQ-V3-CORRECTED.md` | FAQ content for property pages (property pages themselves TBD — do not build yet) |

---

## Sanity Document Types

### 1. `canonicalBlock`

One document per block (16 total). Build from `CANONICAL-BLOCKS-FINAL.md`.

```javascript
{
  _type: 'canonicalBlock',
  blockId: string,           // e.g. 'ferry-basics' — unique, slug format, immutable
  entityType: string,        // e.g. 'Travel', 'Place', 'Activity', 'Trust'
  canonicalHome: string,     // page slug where full version lives, e.g. '/getting-here'
  fullContent: portableText,
  teaserContent: portableText,
  keyFacts: [{ fact: string, value: string }]
}
```

Seed all 16 documents from `CANONICAL-BLOCKS-FINAL.md`. `blockId` values are defined there and must not change — they are referenced by page documents.

---

### 2. `blockReference` (inline object, used inside page section content arrays)

```javascript
{
  _type: 'blockReference',
  block: Reference,          // → canonicalBlock document
  renderAs: 'full' | 'teaser'
}
```

---

### 3. Page document types

Each page shares a common structure. Create dedicated document types for each page.

```javascript
{
  _type: 'pageName',         // e.g. 'homePage', 'gettingHerePage', 'exploreIslayPage'
  seo: {
    title: string,
    description: string
  },
  pageTitle: string,         // H1
  sections: [{
    heading: string,         // H2
    subsections: [{
      heading: string,       // H3
      content: portableText | blockReference
                             // content arrays may mix both types
    }]
  }],
  faqs: [{
    question: string,
    answer: portableText
  }],
  schema: text               // JSON-LD stored as raw string, injected in <script type="application/ld+json">
}
```

---

### 4. Pages to build

| Page | Document type | Source file | Status |
|------|--------------|-------------|--------|
| `/` | `homePage` | `HOMEPAGE-V3-CORRECTED.md` | ✅ Ready |
| `/getting-here` | `gettingHerePage` | `GETTING-HERE-V3-CORRECTED.md` | ✅ Ready |
| `/explore-islay` | `exploreIslayPage` | `EXPLORE-ISLAY-V3-CORRECTED.md` | ✅ Ready |
| `/accommodation/portbahn-house` | `propertyPage` | FAQs in `PROPERTY-FAQ-V3-CORRECTED.md` | ⚠️ FAQs ready, property page content TBD — build as stub |
| `/accommodation/shorefield-eco-house` | `propertyPage` | FAQs in `PROPERTY-FAQ-V3-CORRECTED.md` | ⚠️ FAQs ready, property page content TBD — build as stub |
| `/accommodation/curlew-cottage` | `propertyPage` | FAQs in `PROPERTY-FAQ-V3-CORRECTED.md` | ⚠️ FAQs ready, property page content TBD — build as stub |
| `/jura` | `juraPage` | Blocks 13, 14, 15 in `CANONICAL-BLOCKS-FINAL.md` | ⚠️ Block content ready, page structure TBD — build as stub |
| `/about` | `aboutPage` | Block 16 in `CANONICAL-BLOCKS-FINAL.md` | ⚠️ Block content ready, page structure TBD — build as stub |

---

## Block Reference Convention in V3 Page Files

Wherever a V3 page file contains this marker:

```
> **BLOCK REF:** `block-id` — `renderAs: full|teaser`
```

Generate a `blockReference` object in the page document's content array, referencing the named `canonicalBlock` document with the specified `renderAs` mode.

The block body text is **not** present in the page file — it lives entirely in the `canonicalBlock` document. Do not copy block content into page documents.

Everything else in the page file (Pi's editorial paragraphs, H2/H3 section headings, FAQs, schema JSON) is page-specific content — populate it directly into the page document as `portableText` or in its appropriate dedicated field.

---

## Block Reference Map (all pages)

For reference, the complete list of block references by page:

### Homepage (`/`)

| Section | Block ID | renderAs |
|---------|----------|----------|
| Section 3: Our Numbers | `trust-signals` | full |
| Section 4: Perfect Location | `bruichladdich-proximity` | full |
| Section 4: Port Charlotte Village | `port-charlotte-village` | full |
| Section 4: Also on Jura | `bothan-jura-teaser` | teaser |
| Section 5: How to Get Here | `ferry-basics` | teaser |
| Section 5: How to Get Here | `ferry-support` | teaser |

### Getting Here (`/getting-here`)

| Section | Block ID | renderAs |
|---------|----------|----------|
| Section 2: By Ferry | `ferry-basics` | full |
| Section 5: Our Ferry Chaos Track Record + What to Do | `ferry-support` | full |
| Section 7: Day Trip to Jura from Port Askaig | `jura-day-trip` | teaser |

### Explore Islay (`/explore-islay`)

| Section | Block ID | renderAs |
|---------|----------|----------|
| Section 2: Intro + Ten Distilleries list + Start at Bruichladdich | `distilleries-overview` | full |
| Section 3: Portbahn Beach — Our Hidden Gem | `portbahn-beach` | full |
| Section 4: Barnacle Geese | `wildlife-geese` | full |
| Section 5: (entire food & restaurants section) | `food-drink-islay` | full |
| Section 6: (entire families & children section) | `families-children` | full |
| Section 7: Day Trip to Jura | `jura-day-trip` | teaser |
| Section 7: Also on Jura (Bothan Jura) | `bothan-jura-teaser` | teaser |

---

## Reading the V3 Page Files

Each V3 page file is structured as follows. Map each element to Sanity as indicated:

| Page file element | Maps to |
|-------------------|---------|
| `### SEO Fields` → title, description | `seo.title`, `seo.description` |
| `**Page Title (H1):**` | `pageTitle` |
| `#### Heading (H2)` under a section | `sections[n].heading` |
| `#### Heading (H3)` under a subsection | `sections[n].subsections[m].heading` |
| `> **BLOCK REF:** ...` | `blockReference` object in content array |
| All other body text | `portableText` in `sections[n].subsections[m].content` |
| `## Embedded FAQs` → `### Question` + answer | `faqs[]` array |
| `## Schema.org Markup` → JSON blocks | `schema` field (raw string) |
| `## Changes Made` table | Ignore — documentation only |

---

## Property Pages (Stub Spec)

The three property pages do not yet have full page spec files, but their FAQ content is ready in `PROPERTY-FAQ-V3-CORRECTED.md`. Build them as stubs with the following structure:

```javascript
{
  _type: 'propertyPage',
  slug: string,              // e.g. 'portbahn-house'
  propertyName: string,
  seo: { title: string, description: string },
  pageTitle: string,
  heroContent: portableText, // TBD — leave empty
  facilities: [],            // TBD — leave empty
  sections: [],              // TBD — leave empty
  faqs: [{                   // Populate from PROPERTY-FAQ-V3-CORRECTED.md
    question: string,
    answer: portableText
  }],
  schema: text               // TBD — leave empty
}
```

Each property page references block teasers as follows:

| Property page | Block references (teaser) |
|---------------|--------------------------|
| All property pages | `ferry-basics`, `ferry-support`, `distilleries-overview` |
| Portbahn House | `portbahn-beach`, `bruichladdich-proximity` |
| Shorefield | `shorefield-character`, `portbahn-beach` |
| Curlew Cottage | `portbahn-beach` |

---

## Internal Link Routes

All internal links in content use these slugs. Do not modify:

| Page | Route |
|------|-------|
| Homepage | `/` |
| Getting Here | `/getting-here` |
| Explore Islay | `/explore-islay` |
| Jura | `/jura` |
| About | `/about` |
| Portbahn House | `/accommodation/portbahn-house` |
| Shorefield | `/accommodation/shorefield-eco-house` |
| Curlew Cottage | `/accommodation/curlew-cottage` |
| Contact | `/contact` |

---

**Build order recommendation:** canonicalBlock documents first (seed all 16), then homePage, then gettingHerePage, then exploreIslayPage, then property page stubs.
