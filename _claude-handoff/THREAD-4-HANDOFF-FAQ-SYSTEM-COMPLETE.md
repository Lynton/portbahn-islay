# Thread 4 Handoff: FAQ Canonical Blocks System - Complete

## Current State

### ✅ What's Complete

**1. FAQ Canonical Blocks System**
- Schema created: `faqCanonicalBlock.ts` with full categorization
- Reference object: `faqBlockReference.ts` for adding FAQs to pages
- Added to all page schemas (via `baseSingletonFields.ts` and `property.ts`)
- Added to Sanity Studio navigation

**2. Category System (Simplified)**
```
Property Categories:
- property-general (3 FAQs)
- property-portbahn (4 FAQs)
- property-shorefield (3 FAQs)
- property-curlew (5 FAQs)

Topic Categories:
- travel, distilleries, wildlife, family, food-drink, beaches, ferry, flights, booking, policies
```

**3. Migration Completed**
- Migrated all 15 property FAQs from `commonQuestions` fields
- Auto-categorized intelligently (general vs property-specific)
- All FAQs now in Sanity as canonical blocks

**4. Pages Updated**
- Getting Here: 2 blocks added (travel-to-islay, ferry-support)
- Explore Islay: 5 blocks added (distilleries, families, beaches, wildlife, food)
- Homepage: 4 blocks added (bruichladdich-proximity, trust-signals, travel, about-us)

**5. Scripts Created**
- `scripts/migrate-property-faqs.ts` - Import FAQs from properties
- `scripts/delete-faq-blocks.ts` - Delete all FAQ blocks (for re-migration)
- `scripts/add-blocks-to-pages.ts` - Auto-populate pages with canonical blocks

### 📊 Current FAQ Count

**Total: 15 FAQs**
- Property General: 3
- Portbahn House: 4
- Shorefield: 3
- Curlew: 5

## Category Strategy Clarified

Use both general and specific strategically:

**property-general**: Comparative questions for homepage/overview
- "Do your houses allow dogs or pets?" → Compares all three properties
- "Which properties have dishwashers?" → Comprehensive answer

**property-specific**: Detailed questions for individual property pages
- "Does Shorefield allow dogs?" → Specific yes/no
- "Does Portbahn have a dishwasher?" → Specific answer

This gives users the right detail level based on context.

## What Still Needs Doing

### 1. Frontend Components (Not Built Yet)
Need to create:
- `components/FAQBlock.tsx` - Renders individual FAQ
- `components/FAQBlockRenderer.tsx` - Renders array of FAQs
- Add Schema.org structured data for FAQs
- Style FAQ accordions/collapse behavior

### 2. Add FAQs to Property Pages
In Sanity Studio, for each property:
- Add property-general FAQs (apply to all)
- Add property-specific FAQs (for that property)
- Consider adding topic FAQs (travel, distilleries, etc.)

### 3. Import Additional FAQs
User has more FAQs to import - **do this in a new thread**

### 4. SEO Enhancement (Future)
For each FAQ block:
- Add keywords (long-tail search phrases)
- Set search volume estimates
- Link related questions
- Set display priorities

### 5. Deprecate Old System (Optional - After 2-3 Months)
Once verified in production:
- Remove `commonQuestions` field from property schema
- Archive `faqItem` collection
- Archive `faqPage` singleton

## File Locations

### Schemas
```
sanity/schemas/documents/faqCanonicalBlock.ts
sanity/schemas/objects/faqBlockReference.ts
sanity/schemas/_base/baseSingletonFields.ts (includes faqBlocks field)
sanity/schemas/collections/property.ts (includes faqBlocks field)
sanity/schemas/singletons/homepage.ts (includes faqBlocks field)
```

### Scripts
```
scripts/migrate-property-faqs.ts
scripts/delete-faq-blocks.ts
scripts/add-blocks-to-pages.ts
```

### Documentation
```
docs/FAQ-CANONICAL-BLOCKS-MIGRATION.md (full migration plan)
docs/FAQ-MIGRATION-COMPLETE.md (migration results)
_claude-handoff/THREAD-4-HANDOFF-FAQ-SYSTEM-COMPLETE.md (this file)
```

## Key Design Decisions Made

1. **Removed `property-specific` generic category**
   - Replaced with: `property-portbahn`, `property-shorefield`, `property-curlew`
   - Category name directly indicates which property
   - Removed `propertySpecific` reference field (no longer needed)

2. **Strategic use of general vs specific**
   - General for comparisons (homepage)
   - Specific for detailed answers (property pages)

3. **Auto-categorization logic**
   - Mentions property name → property-specific
   - Contains location keywords (parking, bedroom, view) → property-specific
   - Contains policy keywords (check-in, pets, WiFi) → property-general

4. **Parallel migration approach**
   - Old `commonQuestions` fields still intact
   - Easy rollback if needed
   - Zero downtime

## GROQ Query Examples

### Get FAQs for a specific property page
```groq
*[_type == "faqCanonicalBlock" &&
  (category == "property-portbahn" || category == "property-general")
] | order(priority asc) {
  _id,
  question,
  answer,
  category,
  relatedQuestions[]->{ question }
}
```

### Get FAQs via faqBlocks field
```groq
*[_type == "property" && slug.current == $slug][0]{
  name,
  faqBlocks[]{
    overrideQuestion,
    faqBlock->{
      _id,
      question,
      answer,
      category
    }
  }
}
```

## Example FAQ Blocks Created

### Property General
1. "Can we check in early or have late checkout?"
2. "Does Shorefield have a dishwasher?"
3. "Is Shorefield in good condition?"

### Property Specific
- **Portbahn**: parking, bedrooms, synthetic bedding, distillery recommendations
- **Shorefield**: bird hides, beach distance, what makes it different
- **Curlew**: reviews, pet-free, walled garden safety, character

## Next Steps for New Thread

1. **Import new batch of FAQs**
   - User has more FAQs ready to import
   - Use `migrate-property-faqs.ts` as template
   - Or create new import script for different FAQ sources

2. **Build FAQ rendering components**
   - Create `FAQBlock.tsx`
   - Create `FAQBlockRenderer.tsx`
   - Add Schema.org markup
   - Style with accordions

3. **Add FAQs to property pages**
   - Script or manual in Sanity Studio
   - Test on localhost

## Important Notes

- **Canonical blocks ARE imported**: All 16 content blocks + 15 FAQ blocks exist in Sanity
- **Pages ARE configured**: Getting Here, Explore Islay, Homepage all have blocks added
- **Frontend IS integrated**: BlockRenderer components already exist and work
- **FAQs need frontend components**: FAQ rendering components don't exist yet

## Git Status

All changes committed:
- Latest commit: "feat: add script to populate pages with canonical blocks"
- Branch: main
- Ready to push to origin

## Questions to Address in New Thread

1. Where are the new FAQs coming from? (File? Manual entry? Different source?)
2. What categories do the new FAQs fall into?
3. Any new categories needed?
4. Should we build the FAQ frontend components first, or import more FAQs first?

---

**Thread Summary**: Successfully implemented complete FAQ canonical blocks system with smart categorization, migrated 15 existing FAQs, and populated pages with canonical blocks. System ready for additional FAQs and frontend component development.
