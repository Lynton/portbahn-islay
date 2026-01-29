# Thread 5 Handoff: FAQ Import + Content Section Structure

**Date:** 2026-01-28
**Status:** ✅ Complete - Ready for content population and frontend work

---

## What Was Accomplished

### 1. FAQ Import ✅
- **Imported 33 new FAQs** into Sanity (32 created, 1 updated)
- **Added 4 new categories**: `travel-planning`, `travel-ferries`, `travel-flights`, `jura`
- **Total FAQ blocks now: ~47** (15 original + 32 new)
- All FAQs properly categorized and prioritized

### 2. Content Section Structure ✅
- **Created `contentSection` schema** - groups content blocks + FAQ blocks together
- **Updated Travel to Islay page** - now uses section structure
- **Updated Explore Islay page** - now uses section structure
- **Designed H-tag strategy** for SEO/AEO optimization

---

## FAQ Categories (Final)

### Property Categories
- `property-general` - Policies, where to stay advice (1 FAQ)
- `property-portbahn` - Portbahn House specific (5 FAQs)
- `property-shorefield` - Shorefield specific (4 FAQs)
- `property-curlew` - Curlew Cottage specific (4 FAQs)

### Topic Categories
- `travel-planning` - Trip planning, duration, timing (7 FAQs)
- `travel-ferries` - CalMac ferry specifics (2 FAQs)
- `travel-flights` - Loganair flights, airport (1 FAQ)
- `distilleries` - Whisky tours (3 FAQs)
- `wildlife` - Nature watching (via secondary categories)
- `family` - Family activities (1 FAQ + secondary categories)
- `food-drink` - Dining, restaurants (via secondary categories)
- `beaches` - Beach information (via secondary categories)
- `jura` - Jura island information (3 FAQs)
- `booking` - Reservations (0 FAQs currently)
- `policies` - Rules, cancellations (0 FAQs currently)

---

## Content Section Structure

### What It Is
Pages now organize content using **sections** instead of separate content/FAQ arrays:

```typescript
pageSections: [
  {
    sectionTitle: "Ferry to Islay",  // H2 heading
    sectionId: "ferry-to-islay",     // URL anchor
    contentBlocks: [travel-to-islay, ferry-support],
    faqBlocks: [FAQ1, FAQ2, FAQ3]
  },
  // ... more sections
]
```

### Benefits
- ✅ Content + FAQs stay together (better for AI retrieval)
- ✅ Clear entity boundaries (AI Search Playbook 1.3.1)
- ✅ Proper H-tag hierarchy (H1 → H2 → H3)
- ✅ Drag/drop sections as units
- ✅ SEO-optimized section titles

### Pages Using Sections
- ✅ Travel to Islay (formerly "Getting Here")
- ✅ Explore Islay

### Pages Using Old Structure (Simple)
- Homepage, About, Contact, Property pages
- Still use: `contentBlocks[]` + `faqBlocks[]` separately
- **Decision needed:** Keep simple or migrate to sections?

---

## H-Tag Strategy

```html
<h1>Travel to Islay</h1>  <!-- Page title -->

<section id="ferry-to-islay">
  <h2>Ferry to Islay</h2>  <!-- Section title - SEO optimized -->

  <!-- Content blocks use H3 for subsections -->
  <h3>Ferry Routes and Booking</h3>
  <p>Content...</p>

  <!-- FAQ questions as H3 -->
  <h3>How long is the ferry to Islay?</h3>
  <p>CalMac ferries take 2 hours...</p>

  <h3>Do you help with ferry disruptions?</h3>
  <p>Absolutely - we hold a 5.0/5...</p>
</section>

<section id="flights-to-islay">
  <h2>Flights to Islay</h2>
  <!-- More content + FAQs -->
</section>
```

**Key principle:** Section titles should be specific for search (not vague like "Getting Here").

---

## Files Created

### FAQ Import
- `scripts/faq-import-data.json` - 33 FAQs ready for import (USED)
- `scripts/import-new-faqs.ts` - Import script (EXECUTED)
- `_claude-handoff/FAQ-DEDUPLICATION-ANALYSIS.md` - Full comparison analysis
- `_claude-handoff/FAQ-IMPORT-READY.md` - Pre-import summary

### Content Sections
- `sanity/schemas/objects/contentSection.ts` - Section schema object
- `sanity/schemas/_base/baseSingletonFieldsWithSections.ts` - Base fields for sectioned pages
- `_claude-handoff/CONTENT-SECTION-STRUCTURE.md` - Complete implementation guide

### Documentation
- `_claude-handoff/THREAD-5-HANDOFF-FAQ-SECTIONS-COMPLETE.md` - This file

### Files Modified
- `sanity/schemas/documents/faqCanonicalBlock.ts` - Added 4 new categories
- `sanity/schemas/singletons/gettingHerePage.ts` - Now uses sections, renamed to "Travel to Islay Page"
- `sanity/schemas/singletons/exploreIslayPage.ts` - Now uses sections
- `sanity/schemas/index.ts` - Registered contentSection schema

---

## Next Steps

### 1. Populate Pages with Sections (Manual in Sanity Studio)

**Travel to Islay Page:**
```
Section 1: "Ferry to Islay"
├─ Content: travel-to-islay (full)
└─ FAQs: How long is ferry?, Do you help with disruptions?

Section 2: "Flights to Islay"
└─ FAQs: Can you fly to Islay?, etc.

Section 3: "Planning Your Journey"
└─ FAQs: How many days?, Best time to visit?, Weather?
```

**Explore Islay Page:**
```
Section 1: "Whisky Distilleries on Islay"
├─ Content: distilleries-overview (full)
└─ FAQs: How many distilleries?, What is Islay famous for?

Section 2: "Beaches and Swimming"
├─ Content: beaches-overview, portbahn-beach
└─ FAQs: Safe beaches?, Beach distances?

Section 3: "Wildlife and Nature"
├─ Content: wildlife-geese
└─ FAQs: Wildlife questions

Section 4: "Family Activities"
├─ Content: families-children
└─ FAQs: Family suitability questions

Section 5: "Food and Drink"
├─ Content: food-drink-islay
└─ FAQs: (optional)
```

### 2. Build Frontend Components

Need to create:
- `components/PageSectionRenderer.tsx` - Renders array of sections
- `components/ContentSection.tsx` - Renders one section (title + content + FAQs)
- `components/FAQBlock.tsx` - Renders individual FAQ
- `components/FAQBlockRenderer.tsx` - Renders array of FAQs

### 3. Update Page Templates

Modify:
- `app/travel-to-islay/page.tsx` - Use `pageSections` instead of `contentBlocks` + `faqBlocks`
- `app/explore-islay/page.tsx` - Same

Add GROQ queries:
```groq
*[_type == "gettingHerePage"][0]{
  title,
  heroImage,
  pageSections[]{
    sectionTitle,
    sectionId,
    contentBlocks[]{
      renderAs,
      block->{
        _id,
        blockId,
        fullContent,
        teaserContent
      }
    },
    faqBlocks[]{
      faqBlock->{
        _id,
        question,
        answer,
        category
      }
    }
  }
}
```

### 4. Add Schema.org Structured Data

Add FAQPage structured data for sections with FAQs:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long is the ferry to Islay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CalMac ferries take 2 hours..."
      }
    }
  ]
}
```

### 5. Decisions Needed

**Homepage Structure:**
- Keep simple (`contentBlocks[]` + `faqBlocks[]`)?
- OR use sections for consistency?

**Property Pages:**
- Keep simple?
- OR use sections for better FAQ organization?

**Section Title Format:**
- Current approach: "Ferry to Islay" (descriptive)
- Alternative: "Islay Ferry - CalMac Routes & Booking" (keyword-heavy)
- **Which do you prefer?**

---

## Import Summary

```
✅ Created: 32 new FAQs
🔄 Updated: 1 existing FAQ
⏭️ Skipped: 0 FAQs
❌ Errors: 0

Total FAQ Blocks: ~47
- Property-specific: 14
- Travel-planning: 7
- Travel-ferries: 2
- Travel-flights: 1
- Distilleries: 3
- Family: 1
- Jura: 3
- Other categories: via secondary tags
```

---

## Technical Notes

### Schema Compatibility
- **Backward compatible** - old pages still work with `baseSingletonFields`
- **New pages** use `baseSingletonFieldsWithSections`
- Can migrate pages incrementally
- No data loss

### Migration Strategy
- **Manual approach** (recommended): Rebuild sections in Sanity Studio
- **Script approach** (if needed): Write migration script to auto-convert

### Frontend Rendering
- Sections render as `<section>` with ID for anchor links
- Section titles render as `<h2>`
- Content blocks render with `<h3>` subsections
- FAQ questions render as `<h3>`
- Maintains proper H1 → H2 → H3 hierarchy

---

## Key Design Decisions Made

1. **Sections are flexible** - can contain 0-many content blocks and 0-many FAQs
2. **Section titles are SEO-critical** - specific, keyword-optimized (not generic)
3. **H-tag hierarchy enforced** - H1 (page) → H2 (section) → H3 (content/FAQs)
4. **Two base field configurations** - simple vs sections (choose per page type)
5. **Category expansion** - added travel sub-categories for future flexibility

---

**Status:** ✅ Schema complete, FAQs imported, ready for content population
**Next Thread:** Frontend components + page population in Sanity Studio
