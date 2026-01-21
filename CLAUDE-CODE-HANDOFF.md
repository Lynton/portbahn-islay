# Claude Code Handoff - PBI Schema Enhancement & Data Migration

**Date:** 2026-01-21
**Project:** Portbahn Islay - Sanity CMS Enhancement
**Access Required:** `~/dev/portbahn-islay/` (you should already have this)

---

## Mission

Implement 14 new Sanity schema fields and generate enhanced property data for 3 properties, preserving all existing content while adding personality-driven, review-backed fields optimized for AI search.

---

## Your Tasks

### Task 1: Verify Current Schema
**File:** `/sanity/schemas/property.ts`

**Check for:**
- Does `entityFraming` field exist? (It's in production data but might not be in schema)
- Does `trustSignals` field exist? (Same issue)
- What's the current structure?

**Why:** Production data has fields that may not be in the schema file. We need to know what exists before adding new fields.

### Task 2: Implement 14 New Schema Fields
**Reference:** `/docs/architecture/SCHEMA-IMPLEMENTATION-HANDOFF.md`

**Add:**
- 6 personality fields (propertyNickname, guestSuperlatives, magicMoments, perfectFor, honestFriction, ownerContext)
- 4 review fields (reviewScores, reviewThemes, reviewHighlights, totalReviewCount)
- 4 licensing fields (replace old `licensingInfo` with licensingStatus, licenseNumber, licenseNotes, availabilityStatus)

**Action:** Copy-paste field definitions from handoff doc, add to schema, deploy to Sanity Studio.

### Task 3: Generate Enhanced Property JSON
**Reference:** `/docs/architecture/DATA-MIGRATION-STRATEGY.md`

**Source Data:**
- Current production: `/data/exports/production-2026-01-21/data.ndjson`
- Content source: `/docs/content/PBI-NUANCE-BRIEF-ENHANCED.md`
- Review data: `/docs/content/PB-Reviews-Working.md`, `/docs/content/SHF-Reviews-Working.md`

**Generate 3 files:**
1. `portbahn-house-enhanced.json` - Preserve all existing + add personality/review fields
2. `shorefield-enhanced.json` - Same + add ownerContext
3. `curlew-cottage-enhanced.json` - Factual only (no reviews yet)

**Output to:** `/data/imports/`

**Critical:** Preserve EVERY existing field. Only ADD new fields.

### Task 4: Create Import-Ready NDJSON
Combine the 3 enhanced JSON files into Sanity import format:
- One line per document
- Preserve document IDs
- Include _type, _id, _createdAt, _updatedAt, _rev

**Output:** `/data/imports/enhanced-properties.ndjson`

---

## Quick File Reference

### You Need to Read:
1. `/docs/architecture/SCHEMA-IMPLEMENTATION-HANDOFF.md` - Step-by-step schema implementation
2. `/docs/architecture/DATA-MIGRATION-STRATEGY.md` - Field mappings and data transformations
3. `/docs/content/PBI-NUANCE-BRIEF-ENHANCED.md` - Source for personality fields

### You Need to Edit:
- `/sanity/schemas/property.ts` - Add 14 new fields

### You Need to Read (Data):
- `/data/exports/production-2026-01-21/data.ndjson` - Current production data

### You Need to Create:
- `/data/imports/portbahn-house-enhanced.json`
- `/data/imports/shorefield-enhanced.json`
- `/data/imports/curlew-cottage-enhanced.json`
- `/data/imports/enhanced-properties.ndjson`

---

## Key Principles

### Data Preservation
**CRITICAL:** All existing field values must be preserved exactly. This is NOT a migration that changes data - it's an enhancement that ADDS data.

### Backwards Compatibility
All new fields are optional. Existing documents should load without errors even before new fields are populated.

### Review Data Accuracy
Use the exact quotes, frequencies, and data from the content docs. Don't paraphrase or synthesize - copy directly from source.

### Curlew Graceful Degradation
Curlew has no reviews yet. Leave review arrays empty, scores null. Perfect-for profiles are factual only (no reviewEvidence).

---

## Testing Checklist

After implementation:

### Schema Testing
- [ ] TypeScript compiles without errors
- [ ] `sanity schema extract` succeeds
- [ ] Sanity Studio loads without errors
- [ ] All 14 new fields visible in Studio
- [ ] New groups (personality, reviews) display correctly
- [ ] Existing property documents load without errors

### Data Testing
- [ ] Enhanced JSON files are valid JSON
- [ ] All existing fields preserved
- [ ] New fields populated per migration strategy
- [ ] Document IDs match production export
- [ ] Portbahn has 226 totalReviewCount
- [ ] Shorefield has 156 totalReviewCount
- [ ] Curlew has 0 totalReviewCount

---

## Expected Output

When you're done, I should have:

1. **Updated schema** at `/sanity/schemas/property.ts` with 14 new fields
2. **3 enhanced JSON files** in `/data/imports/` ready to import
3. **1 NDJSON file** ready for Sanity CLI import
4. **Confirmation** that schema compiles and Studio loads

---

## Data Mapping Quick Reference

### Portbahn House
- **Nickname:** "The View House"
- **Reviews:** 226 total (Airbnb 4.97/156, Booking 9.5/33, Google 5.0/37)
- **Key themes:** stunning-views, immaculate-cleanliness, family-friendly
- **License:** AR01981F, pending-bookable
- **Superlatives:** "Better than the pictures" (10+ mentions), "Hard to leave"
- **Magic moments:** Sunrise in master bedroom, kids on trampoline, walk to distillery

### Shorefield
- **Nickname:** "The Character House"
- **Reviews:** 156 total (Airbnb 4.97/86, Booking 9.2/57, Google 5.0/13)
- **Key themes:** character-charm, cozy-atmosphere, peaceful-quiet
- **License:** AR02246F, approved
- **Superlatives:** "Like a big hug", "Feels like home", "The house has a story"
- **Magic moments:** Coffee on terrace with birds, discovering owner's paintings
- **Owner context:** Bird watchers, painters, world travelers - house reflects their passions

### Curlew Cottage
- **Nickname:** null
- **Reviews:** 0 (coming soon)
- **License:** AR02532F, pending-enquiries
- **Perfect-for:** Families seeking safe environment, guests with pet allergies, quiet retreat seekers
- **No superlatives, magic moments, or review highlights yet**

---

## Common Pitfalls to Avoid

1. **Don't lose existing data** - Always read production export first, preserve everything
2. **Don't synthesize review quotes** - Use exact quotes from content docs
3. **Don't forget document IDs** - Must match production (_id field)
4. **Don't skip _rev and _updatedAt** - Sanity needs these for import
5. **Don't assume entityFraming/trustSignals exist** - Check schema first

---

## Success Criteria

✅ Schema compiles without TypeScript errors
✅ Sanity Studio loads and displays new fields
✅ All 3 enhanced JSON files generated
✅ All existing data preserved
✅ New fields populated accurately from source docs
✅ Import-ready NDJSON created
✅ Ready for import to production

---

## Next Steps (After You're Done)

1. **Report back** - Confirm completion and any issues
2. **Human reviews** enhanced JSON in editor
3. **Import to Sanity** via CLI: `sanity dataset import data/imports/enhanced-properties.ndjson production --replace`
4. **Editorial polish** in Sanity Studio
5. **Frontend implementation** (Cursor, later phase)

---

## Questions?

All detailed specs are in `/docs/architecture/`. If you're unclear on any mapping, the DATA-MIGRATION-STRATEGY.md has complete field-by-field transformations with examples.

---

**Token Budget Estimate:** ~15-20k tokens
**Time Estimate:** 30-45 minutes
**Priority:** High (blocks frontend work)

Good luck! 🚀
