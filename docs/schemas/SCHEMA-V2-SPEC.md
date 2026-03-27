# Sanity Schema v2 Spec — PBI / BJR / IoJ
**Version:** 2.0
**Date:** 2026-03-23
**Status:** Signed off
**Supersedes:** `sites/pbi/docs/schemas/SANITY-SCHEMA-FINAL.md` (v1)
**Applies to:** PBI (now), BJR and IoJ (future — same schema patterns)

---

## Design Principles

1. **Entity → Block → Page.** Entity is the canonical source for structured data. Blocks provide editorial prose. Pages compose both — pure structure, no embedded content.
2. **Restricted PortableText everywhere.** Text + links only. No headings, lists, bold/italic, or blockquotes in stored content. Formatting is a template concern.
3. **Fixed template composition, not page builder.** Pages have layout hints, not section ordering UI.
4. **Multi-site from day one.** `island`, `ecosystemSite`, and `canonicalExternalUrl` fields handle cross-site entity sharing.
5. **Sparse fields pattern.** Populate only what applies per entity category. Null is fine.

---

## Document Type Overview

| Type | Role | Status in v2 |
|------|------|-------------|
| `siteEntity` | Structured facts about real-world things | Enhanced — new infographic attributes |
| `canonicalBlock` | Reusable editorial prose (teaser + full) | Simplified — restricted PT, remove keyFacts/lists |
| `faqCanonicalBlock` | Single Q&A pair | Restricted PT answer, allow bullet lists |
| `keyFactSet` | **NEW** — group of label/value summary stats | New document type |
| `guidePage` | Page composition: entities + blocks + key facts + FAQs + gallery | Redesigned — remove extendedEditorial, add keyFactSets, layoutHints |
| `property` | Accommodation listing | Unchanged in v2 |
| Singletons | Homepage, about, contact, etc. | Unchanged in v2 |

---

## Restricted PortableText Definition

Used by `canonicalBlock`, `faqCanonicalBlock`, and `guidePage.introduction`. Implemented as a shared schema helper.

```
styles: [{ title: 'Normal', value: 'normal' }]
marks.decorators: []
marks.annotations: [
  { name: 'link', type: 'object', fields: [
    { name: 'href', type: 'url', validation: required }
  ]}
]
lists: []
```

**FAQ exception:** `faqCanonicalBlock.answer` also allows `lists: [{ title: 'Bullet', value: 'bullet' }]` for short inline lists. No numbered lists.

---

## 1. `siteEntity` (Enhanced)

### Unchanged
Core identity, ecosystem, descriptions, location, contact, openingHours, tags, images, relatedEntities.

### Changes

**Remove:**
- `guidePages[]` — computable via GROQ reverse query. Manual maintenance is error-prone.

**Add to `attributes` object:**

#### Distillery attributes (new)
```
peatExpressions[]: array of {
  name: string           // "Octomore", "Port Charlotte", "The Laddie"
  peatLevel: enum        // unpeated | light | medium | heavy | extreme
  ppmRange: string       // "0" | "40–50" | "80–300+"
  description: string    // one-liner for spectrum display
}
```
Replaces the single `peatLevel` field. Handles Bruichladdich's three brands. Most distilleries have one expression.

```
tourPriceStandard: string    // "£10–15"
tourPricePremium: string     // "£40–80+"
tourDuration: string         // "45–60 minutes"
```

#### Beach attributes (new)
```
surfSuitable: boolean
dogsAllowed: boolean
dogsSeasonalRestriction: string   // "May–Sep on-lead" or null
sheltered: boolean
rockPools: boolean
sandType: string                  // "golden" | "white" | "shingle" | "mixed"
```
Existing: `safeForSwimming`, `familyFriendly`.

#### Village attributes (new)
```
hasShop: boolean
hasPub: boolean
hasFuel: boolean
hasATM: boolean
hasPostOffice: boolean
population: string          // "~300" — approximate, for context
```

#### Food & Drink attributes (new)
```
cuisineType: string          // "seafood" | "pub" | "café" | "takeaway" | "distillery café"
reservationRequired: boolean
dogFriendlyVenue: boolean
```
Existing: `priceRange`, `requiresBooking`.

#### Heritage attributes (enhance existing)
```
centuryDate: string          // "8th century" | "1779" | "1983–2024" — for timeline display
significanceNote: string     // one-line: "Best-preserved Celtic cross in Scotland"
```
Existing: `heritagePeriod`.

#### Wildlife / Nature Reserve attributes (new)
```
bestMonths: string[]         // ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"] — for seasonal calendar
keySpecies: string[]         // ["barnacle geese", "golden eagle", "otter"] — for species listing
habitatType: string          // "wetland" | "coastal" | "moorland" | "woodland"
```

#### Route / Walking attributes (enhance existing)
```
terrainType: string          // "coastal" | "moorland" | "woodland" | "mixed"
dogFriendlyRoute: boolean
```
Existing: `distanceKm`, `distanceMiles`, `durationMinutes`, `difficulty`, `circular`, `startPointParking`, `routeHighlights`.

#### Transport attributes (new)
```
transportMode: string       // "ferry" | "bus" | "taxi" | "bike-hire" | "flight" | "car-hire"
operator: string             // "CalMac" | "Loganair" | "Islay Coaches"
frequency: string            // "hourly" | "2× daily" | "seasonal"
routeSummary: string         // "Kennacraig → Port Askaig (2 hours)"
```

---

## 2. `canonicalBlock` (Simplified)

### Keep
- `blockId` (slug) — canonical identifier
- `title` (string)
- `canonicalHome` (reference → `guidePage`) — validates in Studio, survives slug changes, enables reverse queries
- `fullContent` (PortableText → **restricted PT**)
- `teaserContent` (PortableText → **restricted PT**)
- `teaserLink` (object: href + text)
- `notes` (text — internal editorial)

### Remove
- `keyFacts[]` — migrated to standalone `keyFactSet` documents
- `entityType` — blocks don't need entity classification; pages handle context kickers
- `usedOn` — computable via GROQ

### Restricted PT applied to
- `fullContent` — text + links only. No h2/h3, no lists, no bold/italic
- `teaserContent` — same restriction

### Content migration
Existing blocks contain lists (distillery list, walking routes, food venues) and formatted text (bold, headings). Migration:
1. Remove list content — this data lives on entities, rendered by template
2. Strip formatting — convert bold/headings to plain text, keep links
3. If any block is pure list content with no editorial value, archive it

---

## 3. `faqCanonicalBlock` (Restricted PT)

### Keep
- `question` (string)
- `answer` (PortableText → **restricted PT + bullet lists**)
- `category` (string)
- `priority` (number)
- `notes` (text)

### Remove
- `secondaryCategories` — not used in rendering
- `keywords` — SEO metadata not being used
- `searchVolume` — same
- `relatedQuestions[]` — not used in rendering

### PT restriction for `answer`
Same as standard restricted PT but with bullet lists allowed:
```
styles: [normal]
marks.decorators: []
marks.annotations: [link]
lists: [bullet]    // ← FAQ exception
```

---

## 4. `keyFactSet` (NEW)

Standalone document type for grouped label/value summary stats. Reusable across pages.

```
keyFactSet {
  factSetId: slug              // e.g. "distillery-stats", "ferry-times"
  title: string                // "Distillery Key Facts" — for Studio
  category: string             // enum: travel, distilleries, beaches, wildlife,
                               //   food, walking, villages, heritage, geology,
                               //   accommodation, planning, general
  facts[]: array of {
    _key: string
    label: string              // "Distilleries"
    value: string              // "10" — free text, include units inline (e.g. "£10–15", "5 min walk")
  }
  notes: text                  // internal editorial
}
```

### Migration
Extract existing `keyFacts[]` from all canonical blocks into standalone keyFactSet documents. Map each to its canonical guide page.

---

## 5. `guidePage` (Redesigned)

### Keep
- `title`, `slug`, `seoTitle`, `seoDescription`, `schemaType`
- `heroImage` (image with alt text)
- `galleryImages[]` (array of images — **the image pool**)
- `pullQuote` (string — for 60:40 image spread)
- `faqBlocks[]` (references to faqCanonicalBlock)
- `featuredEntities[]` (references to siteEntity)

### Change
- `introduction` — change from plain `text` to **restricted PT** (text + links). Links in intro are useful.
- `contentBlocks[]` — keep as array of `blockReference` objects, but update `blockReference` (see below)

### Add
- `keyFactSets[]` — array of references to `keyFactSet` documents. Template renders after lead block.
- `layoutHints` — object for template configuration:

```
layoutHints: {
  entityDisplayStyle: enum     // "grid" | "spectrum" | "matrix" | "timeline" | "calendar"
                               // Default: "grid" (standard EntityCard grid)
  entityGridColumns: number    // 2 or 3. Default: 2
  showMap: boolean             // Render Leaflet map with entity pins. Default: true
  showPropertyCards: boolean   // Render Stay on Islay section. Default: true
  showBjrCard: boolean         // Render BJR cross-promo card. Default: true
}
```

### Remove
- `extendedEditorial` — all editorial prose moves into canonical blocks. Pages with page-specific editorial get dedicated blocks with `canonicalHome` pointing to that page.

### Updated `blockReference` object
```
blockReference {
  _key: string
  block: reference → canonicalBlock
  version: enum                // "full" | "teaser"
  customHeading: string        // override block title for this page context
  customKicker: string         // override kicker label (e.g. "Our Recommendation")
  displayStyle: enum           // "default" | "callout-teal" | "callout-sand"
                               // Default: "default"
}
```
- Removed: `showKeyFacts` — key facts are now separate `keyFactSet` references
- Added: `customKicker` — so each block reference can have a contextual label
- Added: `displayStyle` — teal callout, sand highlight, or default treatment

---

## 6. Template Composition Order

The template renders sections in this fixed order. Each section is visible only if data exists.

```
1. Hero image (from heroImage or galleryImages[0])
2. Caption bar (breadcrumb)
3. Title frame (title + introduction)
4. Mobile nav (quick nav from all headings)
5. 2-col grid:
   a. Content column (LHC):
      - Content blocks (in array order)
        - Each block: kicker + heading + restricted PT body
        - Gallery images inserted between blocks from pool
        - Blocks with displayStyle "callout-teal" render with dark bg
      - Key fact sets (after content blocks)
      - Entity presentation (style from layoutHints.entityDisplayStyle):
        - "grid" → EntityCard 2-col/3-col grid
        - "spectrum" → PeatSpectrum component (distilleries)
        - "matrix" → AttributeMatrix component (beaches, villages, dog-friendly)
        - "timeline" → HistoryTimeline component (archaeology, geology)
        - "calendar" → SeasonalCalendar component (wildlife, planning)
      - FAQs (from faqBlocks[])
   b. Sidebar (RHC):
      - Quick nav
      - Related guides
6. Stay on Islay (property cards + BJR)
7. Related guides footer
8. Back to top
```

---

## 7. Infographic Components per Guide Page

| Page | `entityDisplayStyle` | Component | Entity data source |
|------|---------------------|-----------|-------------------|
| Distilleries | `spectrum` | `PeatSpectrum` | `peatExpressions[]` on distillery entities |
| Beaches | `matrix` | `AttributeMatrix` | `safeForSwimming`, `surfSuitable`, `dogsAllowed`, `sheltered`, `familyFriendly` |
| Walking | `matrix` | `AttributeMatrix` | `difficulty`, `distanceKm`, `durationMinutes`, `circular`, `terrainType` |
| Wildlife | `calendar` | `SeasonalCalendar` | `bestMonths[]`, `keySpecies[]` on nature reserve entities |
| Archaeology | `timeline` | `HistoryTimeline` | `heritagePeriod`, `centuryDate` on heritage entities |
| Villages | `matrix` | `AttributeMatrix` | `hasShop`, `hasPub`, `hasFuel`, `hasATM`, `hasPostOffice` |
| Food & Drink | `grid` | Standard EntityCard | Existing entity data + `cuisineType`, `reservationRequired` |
| Family | `grid` | Standard EntityCard | Existing + `familyFriendly` flag highlighting |
| Dog-Friendly | `matrix` | `AttributeMatrix` | `dogFriendlyVenue`, `dogFriendlyRoute`, `dogsAllowed` |
| Visit Jura | `grid` | Standard EntityCard | Grid for v2 — timeline itinerary deferred until component proven on archaeology |
| Geology | `timeline` | `HistoryTimeline` | `centuryDate` reused for geological ages |
| Ferry | `matrix` | `AttributeMatrix` | `routeSummary`, `frequency` on transport entities |
| Flights | `grid` | Standard EntityCard | Minimal entities |
| Getting Around | `matrix` | `AttributeMatrix` | `transportMode`, `operator`, `frequency` |
| Without a Car | `grid` | Standard EntityCard | Route/transport entities |
| Arriving | `grid` | Standard EntityCard | Port/transport entities |
| Planning | `calendar` | `SeasonalCalendar` | Month-by-month guide driven by keyFactSet (months as labels) |

**Four reusable components** cover all 17 pages:
1. `PeatSpectrum` — distilleries only (unique visual)
2. `AttributeMatrix` — any boolean/category comparison grid
3. `HistoryTimeline` — chronological entity data
4. `SeasonalCalendar` — month-based data

Plus the existing `EntityCard` grid as the default.

---

## 8. Migration Strategy

### Phase 1: Schema deployment
1. Create `keyFactSet` document type
2. Add new attribute fields to `siteEntity`
3. Create restricted PT helper
4. Update `canonicalBlock` schema (restrict PT, remove keyFacts/entityType)
5. Update `faqCanonicalBlock` schema (restrict PT + bullets, remove unused fields)
6. Update `guidePage` schema (add keyFactSets, layoutHints, restricted PT intro, remove extendedEditorial)
7. Update `blockReference` object (add customKicker, displayStyle, remove showKeyFacts)
8. Deploy schema: `npx sanity@latest schema deploy`

### Phase 2: Content migration
1. Extract keyFacts from canonical blocks → create keyFactSet documents
2. Wire keyFactSets to guide pages
3. Move extendedEditorial content into canonical blocks (one block per editorial section)
4. Strip formatting from canonical block PT (remove headings, lists, bold/italic; keep links)
5. Strip formatting from FAQ answers (keep links + bullet lists)
6. Remove list content from blocks where entities already contain the data
7. Populate new entity attribute fields (peatExpressions, beach flags, village services, etc.)
8. Set layoutHints on each guide page

### Phase 3: Template update
1. Build restricted PT renderer
2. Build infographic components (PeatSpectrum, AttributeMatrix, HistoryTimeline, SeasonalCalendar)
3. Update GuideSpokeLayout to use new composition model
4. Update EntityCard for attribute display
5. Build/update GuideMap (Leaflet with entity pins)

### Sanity backup before each phase
```bash
sanity documents export --types canonicalBlock,guidePage,faqCanonicalBlock,siteEntity \
  --out data/exports/backup-pre-v2-YYYY-MM-DD.ndjson
```

---

## 9. Multi-Site Considerations

- Schema types are **identical** across PBI, BJR, IoJ
- Dataset separation handles site boundaries (separate Sanity projects)
- `island` field on siteEntity supports Islay/Jura/mainland
- `ecosystemSite` controls canonical ownership
- `canonicalExternalUrl` handles cross-site entity linking
- `keyFactSet` has no island field — facts are topic-scoped, not geography-scoped
- Infographic components are site-agnostic — data drives the content

---

## 10. Ops Workflow Update

Add to prototype-first workflow in OPS.md:

> **Schema-aware prototyping:** Every visual element in the prototype must map to a named schema field or entity attribute. If it doesn't, add the field to the spec before signing off the prototype. The prototype is a design document; the schema spec is the contract for what the template can render.

---

## Resolved Decisions

1. **`canonicalHome`** → Reference to `guidePage` (not string URL). Validates in Studio, survives slug changes, enables reverse queries.
2. **Per-entity display config** → Page-level `entityDisplayStyle` only for v2. Per-entity overrides deferred — additive change, no retrofitting needed.
3. **`unit` field on keyFactSet** → Dropped. Label + value as free text strings. Units included inline in value (e.g. "£10–15", "5 min walk"). Simpler, more editorial control.
4. **Visit Jura** → `grid` for v2. Timeline itinerary deferred until component proven on archaeology. **Planning** → `calendar` driven by keyFactSet (months as labels, descriptions as values).
