# FAQ Deduplication Analysis
**Date:** 2026-01-28
**Purpose:** Compare existing 15 FAQs + canonical block questions against 35 new FAQs

---

## Summary

### Sources Analyzed
1. **Canonical Content Blocks** (16 blocks) - Very few actual questions embedded
2. **Existing FAQ Blocks** (15 total) - Property-specific focus
3. **New FAQs** (35 total) - Comprehensive site-wide coverage

### Key Findings
- **Minimal overlap** between existing 15 FAQs and new 35 FAQs
- Existing FAQs are **property-specific** (parking, facilities, specific features)
- New FAQs are **broader** (travel, planning, island info, property categories)
- **Only 3-4 duplicates/overlaps** identified
- Most canonical block headings are **statements, not questions**

---

## Detailed Comparison

### EXISTING FAQ BLOCKS (15 total)

#### Property-General (4)
1. Can we check in early or have late checkout?
2. What makes Shorefield different from the other properties?
3. Does Shorefield have a dishwasher?
4. Is Shorefield in good condition?

#### Property-Specific (11)
**Portbahn House:**
5. Is there parking at Portbahn House?
6. How many bedrooms does Portbahn House have?
7. Does Portbahn House have synthetic bedding?
8. Which distillery should we visit first?

**Shorefield:**
9. What are the bird hides at Shorefield?
10. How far is Shorefield from the beach?

**Curlew Cottage:**
11. What reviews does Curlew have?
12. Is Curlew Cottage pet-free?
13. Is the walled garden safe for children?
14. What makes Curlew special?
15. Does Curlew have character?

---

## NEW FAQS (35 total)

### Travel & Getting Here (11)
1. How do I pronounce Islay?
2. Where is Islay located?
3. How long is the ferry to Islay?
4. Can you fly to Islay from Glasgow?
5. How do I get from Islay to Jura?
6. Is Islay worth visiting?
7. How big is Islay?
8. Can you get around Islay without a car?
9. How do I get to Jura from Islay? (DUPLICATE of #5)
10. Do you help with ferry disruptions? ✅ **MATCHES CANONICAL BLOCK 4 CONTENT**
11. What's the weather like on Islay?

### Accommodation & Planning (4)
12. Where should I stay on Islay?
13. How many days do I need on Islay?
14. When is the best time to visit Islay?
15. Is Jura worth visiting?

### Whisky & Distilleries (3)
16. What is Islay famous for?
17. What is Islay whisky?
18. How many distilleries are on Islay?

### Families & Activities (1)
19. Is Islay good for families? ✅ **OVERLAPS WITH CANONICAL BLOCK 3 CONTENT**

### Portbahn House (5)
20. Is Portbahn House suitable for families with young children? ✅ **REFINEMENT OF EXISTING FAQ**
21. Is Portbahn House good for remote work?
22. Can I walk to Bruichladdich Distillery from Portbahn House? ✅ **MATCHES CANONICAL BLOCK 6 CONTENT**
23. Is there parking at Portbahn House? ⚠️ **DUPLICATE OF EXISTING FAQ #5**
24. How close is Portbahn House to the beach? ✅ **MATCHES CANONICAL BLOCK 7 CONTENT**

### Shorefield (4)
25. Is Shorefield suitable for birdwatchers? ✅ **REFINEMENT OF EXISTING FAQ #9**
26. What makes Shorefield different from your other properties? ⚠️ **DUPLICATE OF EXISTING FAQ #2**
27. Is Shorefield good for children?
28. How close is Shorefield to the beach? ⚠️ **DUPLICATE OF EXISTING FAQ #10**

### Curlew Cottage (4)
29. Is Curlew Cottage suitable for young families? ✅ **REFINEMENT OF EXISTING FAQ #13**
30. How many does Curlew Cottage sleep?
31. Can I walk to restaurants from Curlew Cottage?
32. How close is Curlew Cottage to the beach?

### Jura (3)
33. How do I get to Jura? (DUPLICATE of #5 and #9)
34. Is Jura worth a day trip from Islay?
35. Can I stay on Jura? ✅ **MATCHES CANONICAL BLOCK 15 CONTENT**

---

## DUPLICATES & OVERLAPS IDENTIFIED

### Exact Duplicates (Existing vs New)
1. **"Is there parking at Portbahn House?"**
   - Existing FAQ #5
   - New FAQ #23
   - **ACTION:** Keep existing FAQ block, don't create duplicate

2. **"What makes Shorefield different from your other properties?"**
   - Existing FAQ #2
   - New FAQ #26
   - **ACTION:** Compare wording, merge if needed, keep best version

3. **"How far is Shorefield from the beach?"**
   - Existing FAQ #10
   - New FAQ #28
   - **ACTION:** Keep existing FAQ block

### Internal Duplicates (Within New 35)
4. **Jura ferry questions - 3 versions:**
   - #5: "How do I get from Islay to Jura?"
   - #9: "How do I get to Jura from Islay?"
   - #33: "How do I get to Jura?"
   - **ACTION:** Create ONE FAQ block, choose best wording

### Refinements (Similar but Different Angle)
5. **Shorefield bird hides:**
   - Existing: "What are the bird hides at Shorefield?" (existing FAQ #9)
   - New: "Is Shorefield suitable for birdwatchers?" (new FAQ #25)
   - **ACTION:** Keep both - different angles (what vs suitability)

6. **Curlew garden safety:**
   - Existing: "Is the walled garden safe for children?" (existing FAQ #13)
   - New: "Is Curlew Cottage suitable for young families?" (new FAQ #29)
   - **ACTION:** Keep both - different angles (garden vs whole property)

7. **Portbahn family suitability:**
   - New: "Is Portbahn House suitable for families with young children?" (new FAQ #20)
   - Related to canonical block 3 content (families-children)
   - **ACTION:** Create FAQ block - specific property question

---

## QUESTIONS IN CANONICAL BLOCKS (To Extract or Not)

### Questions That Should Become FAQ Blocks (REUSABLE)

1. **"Do you help with ferry disruptions?"** (Block 4: ferry-support)
   - ✅ Covered by new FAQ #10
   - **ACTION:** Create FAQ block from new FAQ #10

2. **"How Many Distilleries Per Day?"** (Block 2: distilleries-overview)
   - Not in new 35 FAQs
   - **ACTION:** Consider extracting - could be reused on property pages

3. **Ferry cancellation process** (Block 4 content)
   - Covered in new FAQ #10
   - **ACTION:** Already addressed

### Questions That Should STAY IN CANONICAL BLOCKS (CONTEXTUAL)

1. **"Why Cancellations Occur"** (Block 4)
   - Contextual H3 within ferry-support block
   - Not standalone reusable
   - **ACTION:** Leave embedded

2. **"What to Do If Your Ferry is Cancelled"** (Block 4)
   - Contextual H3 within ferry-support block
   - Part of instructional flow
   - **ACTION:** Leave embedded

3. **"What Makes Us Different"** (Block 5: trust-signals)
   - Not a question format
   - Contextual to trust/credibility block
   - **ACTION:** Leave embedded

---

## RECOMMENDED ACTIONS

### 1. Keep Existing 15 FAQ Blocks
- All remain relevant
- No deletion needed
- Update 2-3 for better wording if needed

### 2. Create NEW FAQ Blocks from 35 FAQs
**Total new blocks to create: ~30**

- Remove 3 exact duplicates (#23, #26, #28)
- Consolidate 3 Jura ferry questions into 1
- Create remaining ~30 new FAQ blocks

### 3. Extract from Canonical Blocks
**Optional:** Extract "How Many Distilleries Per Day?" as reusable FAQ

### 4. Total FAQ Blocks After Import
- Existing: 15
- New: ~30
- **Total: ~45 FAQ canonical blocks**

---

## CATEGORY MAPPING

### Current Categories (Existing System)
- `property-general`
- `property-portbahn` (or `portbahn-house`)
- `property-shorefield` (or `shorefield`)
- `property-curlew` (or `curlew`)
- Topic tags: `travel`, `distilleries`, `wildlife`, `family`, `food-drink`, `beaches`, `ferry`, `flights`, `booking`, `policies`

### New FAQ Categories (From 35 FAQs)
- Travel & Getting Here (11)
- Accommodation & Planning (4)
- Whisky & Distilleries (3)
- Families & Activities (1)
- Portbahn House (5)
- Shorefield (4)
- Curlew Cottage (4)
- Jura (3)

### Proposed Unified Category Structure

#### **Property Categories** (for property-specific FAQs)
- `property-general` - Applies to all properties
- `property-portbahn` - Portbahn House specific
- `property-shorefield` - Shorefield specific
- `property-curlew` - Curlew Cottage specific

#### **Topic Categories** (for general/reusable FAQs)
- `travel` - Getting to/around Islay
- `planning` - Trip planning, timing, duration (**NEW**)
- `accommodation` - Where to stay (**NEW** or merge with planning)
- `distilleries` - Whisky tours and distillery visits
- `wildlife` - Nature, birds, geese
- `family` - Family activities and suitability
- `food-drink` - Dining, restaurants, groceries
- `beaches` - Beach info and safety
- `ferry` - CalMac ferry specifics
- `flights` - Air travel
- `jura` - Jura island information (**NEW**)
- `booking` - Reservations, payments
- `policies` - Cancellation, rules

#### **Action on Categories:**
- Add `planning` as new category
- Add `jura` as new category
- Consider merging `accommodation` into `planning` OR keep separate
- All others already exist or map cleanly

---

## REUSABILITY ASSESSMENT

### Questions to EXTRACT from Canonical Blocks (Multi-purpose)
- "How Many Distilleries Per Day?" - Could be reused on homepage, property pages, Explore Islay

### Questions to LEAVE in Canonical Blocks (Single-purpose/Contextual)
- All others - they're contextual H3s within narrative flow

---

## NEXT STEPS

1. ✅ **User Review:** Present this analysis to Lynton for confirmation
2. **Category Decisions:** Confirm category structure (add `planning`, `jura`, `accommodation`?)
3. **Import Script:** Create script to import 35 new FAQs (excluding duplicates)
4. **Update Existing:** Review 2-3 existing FAQs for wording improvements
5. **Page Mapping:** Add FAQ block references to relevant pages

---

**Status:** Ready for user review and decisions
**Duplicates Found:** 3 exact, 3 internal
**New FAQ Blocks to Create:** ~30
**Categories to Add:** 2-3 new categories
