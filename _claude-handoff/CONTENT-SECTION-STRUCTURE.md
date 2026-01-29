# Content Section Structure - Implementation Guide

**Date:** 2026-01-28
**Status:** ✅ Schema implemented, ready for content migration

---

## Overview

We've implemented a **content section structure** that groups content blocks and FAQ blocks together semantically. This aligns with AI Search Playbook 1.3.1 - creating clear entity boundaries for AI retrieval.

---

## Why Content Sections?

### The Problem
Previously, pages had separate arrays:
```
contentBlocks: [block1, block2, block3]
faqBlocks: [faq1, faq2, faq3]
```

This made it unclear **which FAQs relate to which content**.

### The Solution
Pages now use `contentSection` objects:
```
pageSections: [
  {
    sectionTitle: "Ferry to Islay",
    contentBlocks: [travel-to-islay, ferry-support],
    faqBlocks: [How long is ferry?, Do you help with disruptions?]
  },
  {
    sectionTitle: "Flights to Islay",
    contentBlocks: [flight-info],
    faqBlocks: [Can you fly to Islay?]
  }
]
```

---

## Schema Structure

### Content Section Object

```typescript
{
  _type: 'contentSection',
  sectionTitle: string (required, max 80 chars),
  sectionId: slug (auto-generated from title),
  contentBlocks: [canonicalBlockReference] (optional),
  faqBlocks: [faqBlockReference] (optional),
  description: text (internal notes, optional)
}
```

### Flexibility

✅ **1 content block + multiple FAQs**
✅ **Multiple content blocks + 1 FAQ**
✅ **Multiple content + multiple FAQs**
✅ **Content only (no FAQs)**
✅ **FAQs only (no content)**

---

## H-Tag Strategy for SEO/AEO

### Page Hierarchy

```html
<h1>Travel to Islay</h1>  <!-- Page title -->

<section id="ferry-to-islay">
  <h2>Ferry to Islay</h2>  <!-- Section title -->

  <!-- Content blocks render with H3s -->
  <h3>Ferry Routes and Booking</h3>
  <p>Content from travel-to-islay block...</p>

  <!-- FAQs render as H3 questions -->
  <h3>How long is the ferry to Islay?</h3>
  <p>CalMac ferries take 2 hours...</p>

  <h3>Do you help with ferry disruptions?</h3>
  <p>Absolutely - we hold a 5.0/5...</p>
</section>

<section id="flights-to-islay">
  <h2>Flights to Islay</h2>  <!-- Section title -->

  <h3>Can you fly to Islay from Glasgow?</h3>
  <p>Yes, Loganair operates...</p>
</section>
```

### SEO/AEO Best Practices

1. **Section Titles (H2):**
   - Be specific for search (e.g., "Ferry to Islay" not "Getting Here")
   - Target long-tail keywords
   - Keep under 80 characters
   - Examples:
     - ✅ "Ferry to Islay - CalMac Routes & Booking"
     - ✅ "Whisky Distilleries on Islay"
     - ✅ "Beaches and Swimming on Islay"
     - ❌ "Getting Here" (too vague)
     - ❌ "Things to Do" (too generic)

2. **Content Block H3s:**
   - Use for sub-sections within content blocks
   - Keep hierarchy: H1 → H2 → H3
   - Never skip levels

3. **FAQ Questions (H3):**
   - Use natural question format
   - Match how users search
   - Include location keywords where relevant

---

## Pages Using Content Sections

### ✅ Implemented

**Travel to Islay Page** (formerly "Getting Here")
- Uses: `baseSingletonFieldsWithSections`
- Schema: `gettingHerePage.ts`
- Field: `pageSections[]`

**Explore Islay Page**
- Uses: `baseSingletonFieldsWithSections`
- Schema: `exploreIslayPage.ts`
- Field: `pageSections[]`

### 🔄 Still Using Old Structure

**Homepage, About, Contact, Property Pages**
- Uses: `baseSingletonFields`
- Fields: `contentBlocks[]` + `faqBlocks[]` (separate)
- **Decision needed:** Keep simpler structure or migrate to sections?

---

## Migration Guide

### Option A: Fresh Start (Recommended for Travel/Explore)
1. Open page in Sanity Studio
2. Create new sections in `pageSections` field
3. Add content blocks + FAQs to each section
4. Give each section an SEO-optimized title
5. Leave old `contentBlocks` and `faqBlocks` fields empty
6. Test frontend rendering
7. Once verified, can remove old fields from schema

### Option B: Script Migration (If needed later)
Create a script to automatically:
- Read existing `contentBlocks` and `faqBlocks`
- Group by category
- Create `contentSection` objects
- Migrate to `pageSections`

---

## Example Section Setups

### Travel to Islay Page

```
Section 1: "Ferry to Islay"
├─ Content: travel-to-islay (full)
└─ FAQs:
   ├─ How long is the ferry to Islay?
   ├─ Do you help with ferry disruptions?
   └─ How far in advance should I book?

Section 2: "Flights to Islay"
├─ Content: (none - just FAQs)
└─ FAQs:
   ├─ Can you fly to Islay from Glasgow?
   └─ How long is the flight?

Section 3: "Ferry Support & Disruptions"
├─ Content: ferry-support (full)
└─ FAQs:
   └─ What happens if my ferry is cancelled?

Section 4: "Planning Your Journey"
├─ Content: (none)
└─ FAQs:
   ├─ How many days do I need on Islay?
   ├─ When is the best time to visit?
   └─ What's the weather like?
```

### Explore Islay Page

```
Section 1: "Whisky Distilleries on Islay"
├─ Content: distilleries-overview (full)
└─ FAQs:
   ├─ How many distilleries are on Islay?
   ├─ What is Islay famous for?
   └─ Can I walk to Bruichladdich Distillery?

Section 2: "Beaches and Swimming"
├─ Content:
│  ├─ beaches-overview (full)
│  └─ portbahn-beach (teaser)
└─ FAQs:
   ├─ Which beaches are safe for swimming?
   ├─ How close is Portbahn House to the beach?
   └─ How close is Shorefield to the beach?

Section 3: "Wildlife and Nature"
├─ Content: wildlife-geese (full)
└─ FAQs:
   └─ When can I see the barnacle geese?

Section 4: "Family Activities"
├─ Content: families-children (full)
└─ FAQs:
   ├─ Is Islay good for families?
   └─ Is Portbahn House suitable for families with young children?

Section 5: "Food and Drink"
├─ Content: food-drink-islay (full)
└─ FAQs: (none - content is sufficient)
```

---

## Benefits

### For Content Management
- ✅ Clear relationship between content and FAQs
- ✅ Drag/drop entire sections to reorder
- ✅ Easy to see page structure at a glance
- ✅ Add/remove sections without affecting others

### For AI Retrieval (Playbook 1.3.1)
- ✅ Clear entity boundaries (each section = 1 passage)
- ✅ Content + FAQs stay together when retrieved
- ✅ Section titles provide semantic context
- ✅ Better citation accuracy for AI systems

### For SEO
- ✅ Proper H-tag hierarchy (H1 → H2 → H3)
- ✅ Keyword-optimized section titles
- ✅ Better passage indexing by Google
- ✅ Improved featured snippet opportunities

---

## Next Steps

### 1. Content Migration (Manual)
- Open Travel to Islay page in Sanity Studio
- Create sections with titles
- Add content blocks + FAQs to each section
- Repeat for Explore Islay page

### 2. Frontend Rendering
Build React components:
- `PageSectionRenderer.tsx` - Renders array of sections
- `ContentSection.tsx` - Renders one section (title + content + FAQs)
- Update page templates to use `pageSections` field

### 3. Decide on Homepage
Should Homepage use sections or keep simpler structure?
- Simpler: `contentBlocks[]` + `faqBlocks[]` (current)
- Sections: `pageSections[]` (new)

---

## Files Created/Modified

### Created
- `sanity/schemas/objects/contentSection.ts` - Section schema
- `sanity/schemas/_base/baseSingletonFieldsWithSections.ts` - Base fields with sections
- `_claude-handoff/CONTENT-SECTION-STRUCTURE.md` - This document

### Modified
- `sanity/schemas/singletons/gettingHerePage.ts` - Now uses sections
- `sanity/schemas/singletons/exploreIslayPage.ts` - Now uses sections
- `sanity/schemas/index.ts` - Registered contentSection schema

---

## Questions to Decide

1. **Homepage structure:**
   - Keep simple (contentBlocks + faqBlocks separate)?
   - OR migrate to sections?

2. **Property pages:**
   - Keep simple?
   - OR use sections for better FAQ organization?

3. **Section title format:**
   - Descriptive phrases ("Ferry to Islay")?
   - OR keyword-focused ("Islay Ferry - CalMac Routes")?

4. **Frontend rendering:**
   - Render section titles as H2?
   - OR allow H2/H3 flexibility based on page hierarchy?

---

**Status:** ✅ Schema complete, ready for content migration and frontend development
**Next:** Manually populate Travel to Islay + Explore Islay pages with sections
