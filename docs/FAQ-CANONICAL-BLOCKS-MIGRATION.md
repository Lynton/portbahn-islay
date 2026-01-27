# FAQ Canonical Blocks Migration Plan

## Overview

Migrate from inline FAQ items to entity-based FAQ canonical blocks with category-based organization. This enables:
- **Reusability**: Same FAQ appears on multiple pages
- **Long-tail SEO**: Track keywords and search volume per question
- **Category filtering**: Show relevant FAQs on relevant pages
- **Related questions**: Link FAQs for user journey mapping
- **No FAQ page**: Follows AI Search Playbook 1.3.1 guidance

## Current FAQ Implementation

### Property Pages
Properties currently use `commonQuestions` field:
- Array of inline FAQ objects
- Question + Answer format
- 3-6 questions per property
- Property-specific content

### FAQ Page (Singleton)
- `faqPage` singleton exists (may have FAQs)
- To be deprecated per playbook guidance

### FAQ Items Collection
- `faqItem` collection exists
- May contain general FAQs

## New FAQ Canonical Blocks System

### Schema
- **faqCanonicalBlock** (document type)
  - Question (string, max 200 chars)
  - Answer (portable text with lists, links)
  - Primary category (required)
  - Secondary categories (optional)
  - Property-specific reference (for property-specific FAQs)
  - SEO keywords (array)
  - Search volume (low/medium/high/unknown)
  - Related questions (references)
  - Display priority (sort order)

### Categories
1. **property-general**: Accommodation questions (any property)
2. **property-specific**: Questions about specific properties
3. **travel**: Getting to Islay (ferry, flights, driving)
4. **distillery**: Whisky distillery visits
5. **wildlife**: Birds, seals, nature watching
6. **family**: Family-friendly activities
7. **food**: Restaurants, dining, local produce
8. **beaches**: Beach access, activities
9. **ferry**: CalMac ferry specific
10. **booking**: Reservations, policies, payments

### Pages with FAQ Blocks
All pages now support `faqBlocks` field:
- Homepage (via baseSingletonFields)
- Explore Islay (via baseSingletonFields)
- Getting Here (via baseSingletonFields)
- About Page (via baseSingletonFields)
- Properties (via property schema)

## Migration Strategy

### Phase 1: Parallel Systems (Safe Migration)

**Keep existing FAQs during transition**:
- `commonQuestions` remains on property pages
- `faqItem` collection remains
- Add new `faqBlocks` field alongside

**Benefits**:
- Zero downtime
- Gradual migration
- Easy rollback

### Phase 2: Create Initial FAQ Blocks

**Property FAQs** (from `commonQuestions`):
1. Review existing property `commonQuestions`
2. Identify common questions across properties
3. Create FAQ canonical blocks:
   - Common → `property-general` category
   - Property-specific → `property-specific` category with property reference
4. Add keywords for long-tail SEO research

**General FAQs** (from `faqItem` collection):
1. Review existing `faqItem` documents
2. Categorize each FAQ
3. Create FAQ canonical blocks with appropriate categories

**Recommended Initial FAQs**:
- 5-8 property-general FAQs (WiFi, pets, parking, check-in, heating, etc.)
- 3-5 property-specific FAQs per property
- 5-8 travel FAQs (ferry times, flights, driving, what3words, etc.)
- 3-5 distillery FAQs (booking tours, driving between distilleries, etc.)
- 3-5 booking FAQs (payment, cancellation, damages, etc.)

### Phase 3: Frontend Integration

**Component creation**:
1. Create `FAQBlock.tsx` component
   - Renders question/answer
   - Supports portable text in answers
   - Collapsible/expandable UI
   - Schema.org FAQPage markup per question

2. Create `FAQBlockRenderer.tsx` component
   - Maps array of FAQ block references
   - Renders FAQ blocks
   - Includes Schema.org structured data

**GROQ query pattern**:
```typescript
faqBlocks[]{
  overrideQuestion,
  faqBlock->{
    _id,
    question,
    answer,
    category,
    relatedQuestions[]->{
      _id,
      question
    }
  }
}
```

**Page integration**:
- Add FAQ section to property pages after main content
- Add relevant FAQs to homepage
- Add travel FAQs to Getting Here page
- Add activity FAQs to Explore Islay page

### Phase 4: Enhance with SEO Data

**Research phase**:
1. Use Google Search Console to identify long-tail searches
2. Use AnswerThePublic for question variations
3. Use keyword research tools for search volume

**Enhance existing FAQs**:
1. Add keywords field to each FAQ
2. Add search volume estimates
3. Add related questions links
4. Set display priority based on search volume

### Phase 5: Gradual Deprecation (Optional)

**Only after full verification**:
1. Verify all FAQs migrated
2. Verify frontend rendering correct
3. Verify Schema.org markup working
4. Remove `commonQuestions` from property schema
5. Archive `faqItem` collection
6. Archive `faqPage` singleton

**Recommended**: Keep old fields for 2-3 months, monitor production, then remove.

## Implementation Checklist

### Schema (Completed ✓)
- [x] Create `faqCanonicalBlock` document schema
- [x] Create `faqBlockReference` object schema
- [x] Add to schema index
- [x] Add to Sanity Studio navigation
- [x] Add `faqBlocks` field to baseSingletonFields
- [x] Add `faqBlocks` field to property schema
- [x] Add `faqBlocks` field to homepage

### Content Migration
- [ ] Audit existing `commonQuestions` across all properties
- [ ] Audit existing `faqItem` collection
- [ ] Create initial property-general FAQ blocks (5-8)
- [ ] Create property-specific FAQ blocks (3-5 per property)
- [ ] Create travel FAQ blocks (5-8)
- [ ] Create booking FAQ blocks (3-5)
- [ ] Create distillery FAQ blocks (3-5)

### Frontend Components
- [ ] Create `FAQBlock.tsx` component
- [ ] Create `FAQBlockRenderer.tsx` component
- [ ] Add Schema.org structured data
- [ ] Update property page template to render faqBlocks
- [ ] Update homepage to render faqBlocks
- [ ] Update Getting Here page to render faqBlocks
- [ ] Update Explore Islay page to render faqBlocks

### SEO Enhancement
- [ ] Research long-tail keywords per FAQ
- [ ] Add keywords to FAQ blocks
- [ ] Estimate search volume
- [ ] Link related questions
- [ ] Set display priorities

### Testing & Verification
- [ ] Test FAQ blocks appear in Studio
- [ ] Test adding FAQs to property pages
- [ ] Test adding FAQs to content pages
- [ ] Test overrideQuestion feature
- [ ] Test frontend rendering
- [ ] Verify Schema.org markup
- [ ] Test on localhost
- [ ] Deploy to production

### Cleanup (Future - After 2-3 Months)
- [ ] Remove `commonQuestions` from property schema
- [ ] Remove `faqItem` collection
- [ ] Archive `faqPage` singleton
- [ ] Update frontend to remove old FAQ rendering

## Example FAQ Blocks to Create

### Property General
1. "Does Portbahn have WiFi?" → property-general
2. "Are dogs allowed at your properties?" → property-general
3. "What time is check-in and check-out?" → property-general
4. "Is parking available?" → property-general
5. "How is the property heated?" → property-general

### Property Specific (Portbahn House)
1. "How far is Portbahn House from Bruichladdich Distillery?" → property-specific
2. "Does Portbahn House have sea views?" → property-specific
3. "Is there a private beach at Portbahn House?" → property-specific

### Travel
1. "How do I get to Islay?" → travel
2. "How long is the ferry from Kennacraig to Port Ellen?" → ferry, travel
3. "Are there flights to Islay?" → travel
4. "Should I bring a car or rent one on Islay?" → travel

### Distillery
1. "How many distilleries are on Islay?" → distillery
2. "Do I need to book distillery tours in advance?" → distillery
3. "Can I walk between Bruichladdich and Port Charlotte?" → distillery, travel

### Booking
1. "What is your cancellation policy?" → booking
2. "How do I pay for my booking?" → booking
3. "What happens if the ferry is cancelled?" → booking, ferry

## GROQ Query Examples

### Get all FAQs for a specific category
```groq
*[_type == "faqCanonicalBlock" && category == "property-general"] | order(priority asc) {
  _id,
  question,
  answer,
  category,
  keywords
}
```

### Get all FAQs for a specific property
```groq
*[_type == "faqCanonicalBlock" &&
  (category == "property-specific" && references($propertyId)) ||
  category == "property-general"
] | order(priority asc)
```

### Get FAQs for homepage (multiple categories)
```groq
*[_type == "faqCanonicalBlock" &&
  category in ["property-general", "travel", "booking"]
] | order(priority asc)[0...8]
```

## Success Criteria

- All existing FAQs migrated to canonical blocks
- FAQs display correctly on all pages
- Schema.org markup validates
- No duplicate content (single source of truth)
- Keywords tracked for long-tail SEO
- Easy to add new FAQs via Studio
- Categories enable smart filtering
- Related questions enhance user journey

## Rollback Strategy

If issues arise:
1. Keep rendering `commonQuestions` on property pages
2. Hide `faqBlocks` rendering on frontend
3. Content remains in Sanity (no data loss)
4. Re-enable when issues resolved

## Next Steps

1. Start content migration: audit existing FAQs
2. Create initial FAQ canonical blocks in Studio
3. Build FAQ rendering components
4. Test on localhost
5. Deploy to production with parallel systems
6. Gradually deprecate old FAQ fields
