# AI Search Playbook v1.3.1 Validation Report

**Date:** 2026-01-29
**Pages Reviewed:** Hub pages (/explore-islay, /getting-here, /accommodation) + Spoke pages (/guides/[slug])

---

## ✅ STRENGTHS (Playbook-Aligned)

### 1. Hub-and-Spoke Architecture ✓

**Status:** EXCELLENT

All three hub pages follow the correct pattern:
- **Hub pages** show teasers with minimal content
- **Spoke pages** contain full canonical blocks (3-6 sentence passages)
- Clear navigation paths from hub → spoke

**Evidence:**
- `/explore-islay` → links to 5 guide pages
- `/getting-here` → links to 3 travel guide pages
- `/accommodation` → links to 3 property pages

**Playbook alignment:** "One primary entity per page" ✓

---

### 2. Passage Quality on Spoke Pages ✓

**Status:** GOOD

Guide pages use `BlockRenderer` → `CanonicalBlock` pattern:
- Content broken into discrete sections with descriptive headings
- Each block can stand alone if extracted
- FAQs placed contextually after related content

**Evidence from `/guides/[slug]/page.tsx`:**
```typescript
{page.contentBlocks && page.contentBlocks.length > 0 && (
  <div className="space-y-12 mb-16">
    <BlockRenderer blocks={page.contentBlocks} />
  </div>
)}
```

**Playbook alignment:** "Passages over pages" ✓

---

### 3. Crawlability & Initial HTML ✓

**Status:** EXCELLENT

- All pages use Next.js SSG (Static Site Generation)
- Content in initial HTML (no JS dependency)
- `revalidate: 60` ensures fresh content

**Evidence:**
```typescript
export const revalidate = 60;
```

**Playbook alignment:** "Content crawlable by AI bots" ✓

---

### 4. Semantic Triple Pattern ✓

**Status:** GOOD (on hub pages)

Example from `/explore-islay`:
> "Islay is one of the Inner Hebrides islands of Scotland, renowned for its ten working whisky distilleries, dramatic Atlantic coastline, and abundant wildlife."

**Playbook alignment:** Subject → Predicate → Object pattern ✓

---

## ⚠️ ISSUES FOUND (Need Fixing)

### 1. Entity Ambiguity on Hub Pages ❌

**Severity:** HIGH
**Playbook violation:** "One primary entity per page"

**Problem:**

**`/explore-islay`:**
- Schema entity: `'Isle of Islay'`
- H1 title: `'Explore the Isle of Islay'`
- **Ambiguity:** Is this page ABOUT Islay (destination entity) or ABOUT exploring Islay (activity entity)?

**`/getting-here`:**
- Schema entity: `'Getting to the Isle of Islay'`
- **Ambiguity:** Is this a process/guide entity or a collection entity?

**`/accommodation`:**
- Schema entity: `'Portbahn Islay Accommodation'`
- **Better:** Should be `'Portbahn Islay'` (organization) not accommodation (which is an attribute)

**Recommendation:**
Hub pages should represent **organizational/navigational entities**, not destination/topic entities:
- `/explore-islay` → Entity: `'Islay Activities Guide'` or remove entity entirely (it's navigation)
- `/getting-here` → Entity: `'Islay Travel Guide'` or make it part of organization schema
- `/accommodation` → Entity: `'Portbahn Islay Properties'` (collection, not type)

---

### 2. Missing Explicit Entity Definitions ❌

**Severity:** MEDIUM
**Playbook violation:** "State facts plainly first"

**Problem:**

Hub page intro paragraphs are descriptive but don't explicitly define the page's scope:

**`/explore-islay`:**
```typescript
Islay is one of the Inner Hebrides islands of Scotland, renowned for its ten working whisky
distilleries, dramatic Atlantic coastline, and abundant wildlife. From our Bruichladdich
properties, you're perfectly positioned to explore everything the island offers.
```
- ✓ Defines Islay
- ❌ Doesn't define what THIS PAGE is

**Better:**
> "This guide covers activities, attractions, and experiences on the Isle of Islay. Islay is one of the Inner Hebrides islands of Scotland, renowned for..."

**Recommendation:**
Add explicit page scope definitions following pattern:
```
This [page type] covers [scope]. [Entity definition]. [Context].
```

---

### 3. Breadcrumbs Missing Entity Names ⚠️

**Severity:** LOW
**Playbook violation:** "Use entity names (not just pronouns)"

**Problem:**

Current breadcrumb on spoke pages:
```typescript
Home → Explore Islay → Islay's Whisky Distilleries
```

**Issue:** "Explore Islay" is vague - it's a verb phrase, not an entity

**Recommendation:**
Either:
1. Keep current pattern (it's functional for navigation)
2. Or change to: `Home → Islay Guides → Islay's Whisky Distilleries`

This is LOW severity because breadcrumbs are primarily navigational.

---

### 4. Hub Pages Lack Descriptive Headings ❌

**Severity:** MEDIUM
**Playbook violation:** "Vague headings ('Overview')" → "Make descriptive"

**Problem:**

Hub pages have minimal structure:
- H1: Page title
- Intro paragraph
- Card grid (no heading)

**Missing:** Section headings that aid passage extraction

**Recommendation:**

Add descriptive H2 headings before card grids:

**`/explore-islay`:**
```html
<h2>Islay Activities and Attractions</h2>
<!-- card grid -->
```

**`/getting-here`:**
```html
<h2>Ways to Reach Islay</h2>
<!-- card grid -->
```

**`/accommodation`:**
```html
<h2>Self-Catering Holiday Properties</h2>
<!-- card grid -->
```

---

### 5. Intro Paragraphs Too Long ⚠️

**Severity:** LOW
**Playbook guideline:** "3-6 sentences per passage (typically)"

**Problem:**

Most hub page intros are 3 sentences, which is good. But `/getting-here` has context that could be broken:

```typescript
Reaching Islay is part of the adventure. Whether you choose the scenic ferry crossing
or a quick flight from Glasgow, we're here to help make your journey smooth.
Our comprehensive ferry support service ensures you never miss a sailing.
```

This is fine (3 sentences), but the last sentence introduces a NEW concept (ferry support) that might deserve its own passage.

**Recommendation:**
Consider breaking into:
1. Main intro (2 sentences)
2. H2: "Ferry Support Service" (separate passage)

---

### 6. Missing Schema for Hub Pages ⚠️

**Severity:** MEDIUM
**Playbook:** "Schema reinforces visible content"

**Problem:**

Hub pages have minimal schema:
- `/explore-islay`: `TouristAttraction` + `Place` → Entity: 'Isle of Islay'
- `/getting-here`: `HowTo` + `Place` → Describes a process, not the page
- `/accommodation`: `Accommodation` → Too vague

**Issue:** Schema describes the TOPICS, not the PAGE ENTITY

**Recommendation:**

Hub pages should use **CollectionPage** or **WebPage** schema with:
- `name`: The page's purpose
- `description`: What's on this page
- `hasPart`: Links to spoke pages (optional)

Example for `/explore-islay`:
```json
{
  "@type": "CollectionPage",
  "name": "Islay Activities and Attractions Guide",
  "description": "Comprehensive guide to activities on Islay including distilleries, beaches, wildlife, and family activities",
  "hasPart": [
    {"@type": "WebPage", "url": "/guides/islay-distilleries"},
    {"@type": "WebPage", "url": "/guides/islay-beaches"}
  ]
}
```

---

## 🔧 OPTIMIZATION OPPORTUNITIES

### 1. Add Introduction Sections to Spoke Pages

**Current:** Guide pages jump straight to content blocks
**Better:** Add explicit scope definition

Example for `/guides/ferry-to-islay`:
```
This guide covers everything you need to know about taking the CalMac ferry
to Islay from Kennacraig. The CalMac ferry is the main way to reach Islay,
operating daily sailings to Port Ellen and Port Askaig.
```

---

### 2. Entity Consistency Across Pages

**Check:** Are entity names consistent?

Example:
- Hub: "Isle of Islay"
- Spoke: "Islay"
- Property pages: "the Isle of Islay"

**Recommendation:** Audit all pages for consistent entity naming:
- First mention: "Isle of Islay"
- Subsequent: "Islay" (acceptable variation)
- Never: "the island" without context

---

### 3. Add Contextual Links in Content Blocks

**Current:** Content blocks are standalone
**Better:** Add semantic links between related entities

Example in distilleries block:
> "Islay has ten working whisky distilleries, including Ardbeg, Laphroaig, and Lagavulin. From Portbahn House in Bruichladdich, you can walk to Bruichladdich Distillery in five minutes."

This creates entity relationships: Property → Distillery

---

## 📊 PLAYBOOK CHECKLIST RESULTS

### Entity & Intent
- [ ] **Primary entity unambiguous** - FAIL (hub pages have entity confusion)
- [x] Only one primary entity per page - PASS (spoke pages)
- [ ] **Entity named consistently** - NEEDS AUDIT
- [x] Entity type/category clear - PASS (spoke pages)
- [x] Intent ownership correct - PASS

### Retrieval & Access
- [x] Content crawlable by AI bots - PASS
- [x] Core meaning in initial HTML - PASS
- [x] Page shallowly linked from hubs - PASS
- [x] Canonicals intentional - PASS (assumed)

### Passage & Structure
- [x] Each section answers one clear question - PASS (spoke pages)
- [x] Sections can stand alone - PASS (canonical blocks)
- [ ] **Headings descriptive and scoped** - FAIL (hub pages lack section headings)
- [x] Passages concise (3-6 sentences) - PASS
- [x] Important content not hidden - PASS

### Writing Quality
- [ ] **Clear factual spine** - PARTIAL (spoke pages good, hub pages vague)
- [x] Emotional language layered after clarity - PASS
- [x] Removing adjectives still leaves correct definition - PASS

### Entity Relationships
- [ ] **Relationships explicitly stated** - PARTIAL (needs more linking)
- [x] Internal links reinforce meaning - PASS
- [x] Anchor text descriptive - PASS

### Schema
- [ ] **Schema reinforces visible content** - FAIL (hub pages have wrong schema type)
- [x] Schema solves real ambiguity - PASS (spoke pages)
- [ ] **Entity @id values stable** - NEEDS CHECK
- [x] Schema minimal and intentional - PASS

---

## 🎯 PRIORITY FIXES

### HIGH Priority (Do First)

1. **Fix Hub Page Entity Definitions**
   - Add explicit scope statements to intro paragraphs
   - Example: "This guide covers..." or "This page shows..."

2. **Update Hub Page Schema**
   - Change from entity schemas to `CollectionPage` or `WebPage`
   - Schema should describe the PAGE, not the topics

3. **Add Section Headings to Hub Pages**
   - Add H2 before card grids
   - Makes content more extractable

### MEDIUM Priority

4. **Entity Name Consistency Audit**
   - Search all pages for "Isle of Islay" vs "Islay"
   - Establish first-mention vs subsequent rules

5. **Add Contextual Internal Links**
   - Link entities within content blocks
   - Example: property names → property pages

### LOW Priority

6. **Breadcrumb Entity Names**
   - Consider changing "Explore Islay" → "Islay Guides"
   - Low impact, functional as-is

---

## 📈 OVERALL SCORE

**Hub Pages:** 6.5/10 (Good structure, needs entity clarity)
**Spoke Pages:** 8.5/10 (Excellent passage design)
**Overall:** 7.5/10 (Strong foundation, fixable issues)

**Main takeaway:** The hub-and-spoke ARCHITECTURE is excellent and playbook-aligned. The main issues are around entity definition clarity and schema accuracy on hub pages.

---

## ✅ NEXT STEPS

1. Fix hub page intro paragraphs (add explicit scope)
2. Update schema.org markup (Task 2)
3. Add section headings to hub pages
4. Run entity consistency audit
5. Re-validate after fixes
