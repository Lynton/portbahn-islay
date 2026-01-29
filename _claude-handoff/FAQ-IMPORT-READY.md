# FAQ Import Ready - Summary

**Date:** 2026-01-28
**Status:** ✅ Ready to execute

---

## What's Been Done

### 1. Schema Updated ✅
- Added new categories to `faqCanonicalBlock.ts`:
  - `travel-planning` (trip duration, best time to visit)
  - `travel-ferries` (CalMac specifics)
  - `travel-flights` (Loganair, airport)
  - `jura` (Jura island info)
- Updated both primary and secondary category lists

### 2. Import Data Prepared ✅
- Created `scripts/faq-import-data.json` with 33 FAQs
- Removed duplicates:
  - 3 exact duplicates flagged for replacement
  - 3 Jura ferry questions consolidated into 1
- Categories properly mapped for all FAQs

### 3. Import Script Created ✅
- Created `scripts/import-new-faqs.ts`
- Features:
  - Reads from faq-import-data.json
  - Checks for existing FAQs
  - Updates FAQs marked with "REPLACES" note
  - Skips duplicates
  - Reports summary (created, updated, skipped, errors)

---

## Import Breakdown

### FAQs to be Created: 30 NEW
### FAQs to be Updated: 3 REPLACEMENTS

**Replacements (will update existing):**
1. "Is there parking at Portbahn House?" (better wording)
2. "What makes Shorefield different from your other properties?" (better wording)
3. "How close is Shorefield to the beach?" (better wording)

**New FAQs by Category:**
- `travel-planning`: 7 FAQs
- `travel-ferries`: 2 FAQs
- `travel-flights`: 1 FAQ
- `distilleries`: 3 FAQs
- `wildlife`: 1 FAQ (via secondary category)
- `family`: 1 FAQ
- `property-general`: 1 FAQ
- `property-portbahn`: 5 FAQs
- `property-shorefield`: 4 FAQs
- `property-curlew`: 4 FAQs
- `jura`: 3 FAQs
- `food-drink`: 0 FAQs (via secondary categories)
- `beaches`: 0 FAQs (via secondary categories)

**Total after import: ~45 FAQ blocks**
- Existing: 15
- New: 30
- Updated: 3

---

## Final Category Structure

### Property Categories
- `property-general` - Policies, where to stay advice
- `property-portbahn` - Portbahn House specific
- `property-shorefield` - Shorefield specific
- `property-curlew` - Curlew Cottage specific

### Topic Categories
- `travel-planning` - Trip planning, duration, timing
- `travel-ferries` - CalMac ferry specifics
- `travel-flights` - Loganair flights, airport
- `distilleries` - Whisky tours
- `wildlife` - Nature watching
- `family` - Family activities
- `food-drink` - Dining, restaurants
- `beaches` - Beach information
- `jura` - Jura island information
- `booking` - Reservations
- `policies` - Rules, cancellations

---

## How to Run Import

### Prerequisites
- Sanity token in `.env.local`
- Node.js and dependencies installed

### Command
```bash
npx tsx scripts/import-new-faqs.ts
```

### What Will Happen
1. Script reads `scripts/faq-import-data.json`
2. For each FAQ:
   - Checks if it already exists (by question text)
   - If marked "REPLACES" → updates existing
   - If new → creates new FAQ block
   - If duplicate → skips
3. Prints summary report

### Expected Output
```
✅ Created: 30 new FAQs
🔄 Updated: 3 existing FAQs
⏭️  Skipped: 0 FAQs
❌ Errors: 0
```

---

## After Import - Next Steps

### 1. Verify in Sanity Studio
- Open Sanity Studio
- Navigate to "FAQ Canonical Blocks"
- Check new FAQs imported correctly
- Verify categories assigned properly

### 2. Add FAQs to Pages
- **Getting Here page:** Add `travel-planning`, `travel-ferries`, `travel-flights`
- **Explore Islay page:** Add `distilleries`, `wildlife`, `family`, `beaches`
- **Homepage:** Add `property-general`, high-priority `travel-planning`
- **Property pages:** Add relevant property-specific FAQs

### 3. Review Existing 15 FAQs
- Check if any need category updates
- Review priority ordering
- Consider adding secondary categories

### 4. Future Enhancements
- Add keywords for SEO research
- Link related questions
- Add search volume estimates
- Build frontend FAQ rendering components

---

## Files Created/Modified

### Created
- `scripts/faq-import-data.json` - 33 FAQs ready to import
- `scripts/import-new-faqs.ts` - Import script
- `_claude-handoff/FAQ-DEDUPLICATION-ANALYSIS.md` - Full analysis
- `_claude-handoff/FAQ-IMPORT-READY.md` - This file

### Modified
- `sanity/schemas/documents/faqCanonicalBlock.ts` - Added new categories

---

## Rollback Plan

If issues occur:
1. FAQs are additive - no data deleted
2. Can delete new FAQs by category filter in Sanity
3. Schema changes are backward compatible
4. Old `commonQuestions` fields still intact

---

**Status:** ✅ Ready to execute import
**Estimated time:** 1-2 minutes
**Risk:** Low (additive changes only)
