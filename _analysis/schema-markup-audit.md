# Schema.org Markup Audit & Recommendations

**Date:** 2026-01-29
**Scope:** Hub pages + new guide pages

---

## CURRENT STATE

### Hub Pages Schema Usage

| Page | Current Schema | Entity Described | Status |
|------|---------------|------------------|---------|
| `/explore-islay` | `TouristAttraction` + `Place` | Isle of Islay | ❌ INCORRECT |
| `/getting-here` | `HowTo` + `Place` | Getting to Islay process | ⚠️ PARTIAL |
| `/accommodation` | `Accommodation` | Portbahn Islay Accommodation | ❌ VAGUE |

### Spoke Pages Schema Usage

| Page | Current Schema | Status |
|------|---------------|---------|
| `/guides/[slug]` | NONE | ❌ MISSING |
| `/accommodation/[slug]` | `Accommodation` | ✓ CORRECT |

---

## ❌ PROBLEMS IDENTIFIED

### 1. Hub Pages Describe Topics, Not Pages

**Problem:** Current schema describes the TOPICS the pages are about, not the PAGES themselves.

**Example `/explore-islay`:**
```typescript
{
  '@type': 'TouristAttraction',
  name: 'Isle of Islay',
  description: 'Scottish island renowned for...'
}
```

**Issue:** This describes **Islay** (the island), not the **page** (a navigation hub).

**Playbook:** "Schema reinforces visible content (no new claims)" - The page doesn't claim to BE Islay, it's a guide TO Islay.

---

### 2. Missing WebPage/CollectionPage Schema

**Problem:** Hub pages are navigation pages but don't use page-level schema.

**Recommendation:** Add `WebPage` or `CollectionPage` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://portbahnislay.com/explore-islay",
  "name": "Islay Activities and Attractions",
  "description": "Guide to activities, attractions and experiences on the Isle of Islay",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://portbahnislay.com"
  },
  "about": {
    "@type": "Place",
    "name": "Isle of Islay"
  }
}
```

**Key difference:**
- `CollectionPage.about` → Islay (correct relationship)
- Not `TouristAttraction` claiming to BE Islay

---

### 3. Guide Pages Have No Schema

**Problem:** New spoke pages (`/guides/[slug]`) have no schema markup at all.

**Recommendation:** Add `Article` or `Guide` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://portbahnislay.com/guides/ferry-to-islay",
  "headline": "Ferry to Islay",
  "description": "Complete guide to taking the CalMac ferry to Islay",
  "author": {
    "@type": "Organization",
    "name": "Portbahn Islay"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Portbahn Islay"
  },
  "about": {
    "@type": "Trip",
    "name": "Ferry to Isle of Islay"
  }
}
```

**Alternative:** Use `HowTo` for actionable guides (e.g., "How to get to Islay by ferry")

---

### 4. Accommodation Hub Page Uses Wrong Type

**Problem:** `/accommodation` uses `type="Accommodation"` which is for individual properties, not collections.

**Current:**
```typescript
<SchemaMarkup type="Accommodation" data={schemaData} />
```

**Issue:** This generates Accommodation schema for "Portbahn Islay Accommodation" - too vague.

**Recommendation:** Use `CollectionPage` with references to individual properties:

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://portbahnislay.com/accommodation",
  "name": "Portbahn Islay Holiday Properties",
  "description": "Three unique self-catering holiday properties in Bruichladdich, Islay",
  "hasPart": [
    {
      "@type": "Accommodation",
      "@id": "https://portbahnislay.com/accommodation/portbahn-house",
      "name": "Portbahn House"
    },
    {
      "@type": "Accommodation",
      "@id": "https://portbahnislay.com/accommodation/shorefield-eco-house",
      "name": "Shorefield Eco House"
    },
    {
      "@type": "Accommodation",
      "@id": "https://portbahnislay.com/accommodation/curlew-cottage",
      "name": "Curlew Cottage"
    }
  ]
}
```

---

## ✅ WHAT'S WORKING WELL

### 1. Property Page Schema ✓

Individual property pages use `Accommodation` schema correctly:
- Maps amenities to `amenityFeature`
- Includes `aggregateRating` from review scores
- Uses `occupancy` and `numberOfRooms`
- Correctly uses `license` for STL licensing

**Example** (app/lib/schema-markup.tsx:222-338):
```typescript
{
  '@type': 'Accommodation',
  name: property.name,
  description: property.description,
  occupancy: { value: property.sleeps },
  numberOfRooms: { value: property.bedrooms },
  amenityFeature: [...],
  aggregateRating: {...}
}
```

This is **excellent** and playbook-aligned.

---

### 2. No FAQPage Schema ✓

**Observation:** The code explicitly avoids FAQPage schema (line 575-577):
```typescript
// NOTE: Per playbook v1.3.1, we do NOT add FAQPage schema.
// Q&A blocks on entity pages enhance the page but don't warrant FAQPage schema.
```

**Status:** CORRECT per playbook. FAQs are part of entity pages, not separate FAQ entities.

---

### 3. Structured Amenity Mapping ✓

**Observation:** Amenities are mapped from Sanity fields to schema.org types (lines 32-88).

**Example:**
```typescript
const amenityMap: Record<string, string> = {
  'wifi': 'InternetAccess',
  'dishwasher': 'Dishwasher',
  'sea_views': 'OceanView',
  ...
}
```

**Status:** Good practice for consistency.

---

## 🔧 IMPLEMENTATION RECOMMENDATIONS

### Priority 1: Add WebPage/CollectionPage Schema Types

**Action:** Extend `SchemaType` union in lib/schema-markup.tsx:

```typescript
export type SchemaType =
  | 'Organization'
  | 'LocalBusiness'
  | 'VacationRental'
  | 'Place'
  | 'Accommodation'
  | 'Product'
  | 'Offer'
  | 'Article'
  | 'BreadcrumbList'
  | 'TouristAttraction'
  | 'HowTo'
  | 'WebPage'          // ADD THIS
  | 'CollectionPage';  // ADD THIS
```

---

### Priority 2: Create CollectionPage Generator

**Action:** Add to lib/schema-markup.tsx:

```typescript
// Generate CollectionPage schema for hub pages
function generateCollectionPage(data: any, siteUrl: string, childPages?: any[]) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': siteUrl,
    name: data.name,
    description: data.description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': BASE_URL
    }
  };

  // Add about entity if provided
  if (data.about) {
    schema.about = data.about;
  }

  // Add child pages if provided
  if (childPages && childPages.length > 0) {
    schema.hasPart = childPages.map(page => ({
      '@type': page.type || 'WebPage',
      '@id': `${BASE_URL}${page.url}`,
      name: page.name
    }));
  }

  return schema;
}
```

---

### Priority 3: Update Hub Pages

**Action 1: Update `/explore-islay`**

```typescript
// OLD
<SchemaMarkup type={['TouristAttraction', 'Place']} data={schemaData} />

// NEW
<SchemaMarkup
  type="CollectionPage"
  data={{
    name: 'Islay Activities and Attractions',
    description: page?.seoDescription || 'Guide to activities and attractions on the Isle of Islay',
    about: {
      '@type': 'Place',
      name: 'Isle of Islay'
    }
  }}
/>
```

**Action 2: Update `/getting-here`**

```typescript
// OLD
<SchemaMarkup type={['HowTo', 'Place']} data={schemaData} />

// NEW
<SchemaMarkup
  type="CollectionPage"
  data={{
    name: 'Travel to Islay',
    description: page?.seoDescription || 'Complete guide to reaching Islay by ferry and flight',
    about: {
      '@type': 'Trip',
      name: 'Travel to Isle of Islay'
    }
  }}
/>
```

**Action 3: Update `/accommodation`**

```typescript
// OLD
<SchemaMarkup type="Accommodation" data={schemaData} />

// NEW
<SchemaMarkup
  type="CollectionPage"
  data={{
    name: 'Portbahn Islay Holiday Properties',
    description: page?.seoDescription || 'Three unique holiday properties in Bruichladdich',
    childPages: properties.map(p => ({
      type: 'Accommodation',
      url: `/accommodation/${p.slug.current}`,
      name: p.name
    }))
  }}
/>
```

---

### Priority 4: Add Schema to Guide Pages

**Action:** Update `/guides/[slug]/page.tsx`:

```typescript
// Add after notFound() check
const schemaData = {
  name: page.title,
  description: page.seoDescription || page.introduction,
  about: {
    '@type': 'Place',
    name: 'Isle of Islay'
  }
};

return (
  <>
    <SchemaMarkup type="Article" data={schemaData} />
    <main className="min-h-screen bg-sea-spray">
      ...
```

---

## 📊 SCHEMA.ORG TYPES SUMMARY

### Currently Supported (lib/schema-markup.tsx)

| Type | Used For | Status |
|------|----------|--------|
| `Organization` | Site-level entity | ✓ Used on homepage |
| `LocalBusiness` | Business listing | ✓ Used on homepage |
| `VacationRental` | Alias for LocalBusiness | ✓ Supported |
| `Place` | Location entities | ✓ Used (sometimes incorrectly) |
| `Accommodation` | Individual properties | ✓ Correct usage |
| `Product` + `Offer` | Booking offers | ✓ Correct usage |
| `Article` | Guide content | ✓ Implemented but unused |
| `BreadcrumbList` | Navigation | ⚠️ Available but not used |
| `TouristAttraction` | Destinations | ❌ Misused on hub page |
| `HowTo` | Process guides | ❌ Misused on hub page |

### Needs Adding

| Type | Use Case | Priority |
|------|----------|----------|
| `WebPage` | Generic page entity | HIGH |
| `CollectionPage` | Hub/index pages | HIGH |
| `ItemList` | List of entities | MEDIUM |

---

## 🎯 IMPLEMENTATION PLAN

### Phase 1: Fix Hub Pages (HIGH PRIORITY)

1. Add `WebPage` and `CollectionPage` to SchemaType union
2. Create `generateCollectionPage()` function
3. Create `generateWebPage()` function
4. Update hub page schema calls
5. Test schema validation

### Phase 2: Add Guide Page Schema (MEDIUM PRIORITY)

6. Add schema to `/guides/[slug]/page.tsx`
7. Use `Article` type for all guide pages
8. Include proper `about` relationships

### Phase 3: Optional Enhancements (LOW PRIORITY)

9. Add `BreadcrumbList` schema to all pages
10. Consider `ItemList` for card grids
11. Add `datePublished` / `dateModified` to guide pages

---

## ✅ VALIDATION CHECKLIST

After implementation, validate:

- [ ] Schema validates at schema.org validator
- [ ] No conflicting entity @id values
- [ ] All schemas reference entities that exist on page
- [ ] No new entity claims in schema
- [ ] `about` relationships correctly express page-to-topic relationship
- [ ] Collection pages link to child pages
- [ ] Property pages remain unchanged (already correct)

---

## 📖 PLAYBOOK ALIGNMENT

**Current Score:** 6/10 (Property pages excellent, hub pages need work)

**After fixes:** 9/10

**Key improvements:**
- ✓ Schema describes pages, not topics
- ✓ Correct entity relationships
- ✓ No orphaned schema
- ✓ Validates correctly

---

## NOTES

### Why Not Keep TouristAttraction for /explore-islay?

**Argument for keeping:**
- The page IS about tourist attractions on Islay

**Argument against (playbook-aligned):**
- The page is not itself a tourist attraction
- The page is a GUIDE TO tourist attractions
- Schema should describe the PAGE entity, not the topic

**Decision:** Use `CollectionPage` with `about: Place` (Islay)

This correctly models the relationship:
- Page → is a collection page
- Page.about → Isle of Islay (tourist destination)
- Page.hasPart → Individual guide pages

---

## REFERENCES

- Playbook v1.3.1: "Schema reinforces visible content (no new claims)"
- Playbook v1.3.1: "Schema solves real ambiguity"
- Schema.org: CollectionPage documentation
- Schema.org: ItemList documentation
