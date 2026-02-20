# Schema File Reference

## Property Schema Location

**Active file:** `sanity/schemas/collections/property.ts`

This is the ONLY property schema file. It is imported in `sanity/schemas/index.ts` at line 2.

## Recent Changes (Jan 21-22, 2026)

### Schema Enhancement v1.2.0
Added 2 new groups and 14 new fields:

**New Groups:**
- `personality` - 👥 Personality & Guest Experience
- `reviews` - ⭐ Reviews & Social Proof

**New Fields:**
1. `propertyNickname` (string) - personality group
2. `guestSuperlatives` (array of strings) - personality group
3. `magicMoments` (array of objects) - personality group
4. `perfectFor` (array of objects) - personality group
5. `honestFriction` (array of objects) - personality group
6. `ownerContext` (text) - personality group
7. `reviewScores` (object with platform scores) - reviews group
8. `reviewThemes` (array of strings) - reviews group
9. `reviewHighlights` (array of objects) - reviews group
10. `totalReviewCount` (number) - reviews group
11. `licensingStatus` (string with options) - policies group
12. `licenseNumber` (string) - policies group
13. `licenseNotes` (text) - policies group
14. `availabilityStatus` (string with options) - policies group

**Replaced field:**
- Old: `licensingInfo` (unstructured string) - REMOVED from data
- New: Four structured licensing fields (11-14 above)

### Additional Cursor Improvements
- Added `category` field to `entityFraming` object
- Enhanced validation rules and descriptions

## File History

- `sanity/schemas/property.ts` - **ORPHANED** - moved to schemas-backup on Jan 22
  - This file was not imported in the schema index
  - All changes were duplicated to the correct file by Cursor
  - Kept in backup for reference only

## Data Import Files

**Location:** `data/imports/`

Import-ready files (cleaned, no deprecated fields):
- `portbahn-house-enhanced.json` - Portbahn House with all new fields
- `shorefield-enhanced.json` - Shorefield with all new fields
- `curlew-cottage-enhanced.json` - Curlew Cottage with all new fields
- `enhanced-properties.ndjson` - Combined NDJSON for Sanity CLI import

All files have the deprecated `licensingInfo` field removed as of commit `d11de30`.

## Version Control

See `.clauderc` for complete version control policies.

**Key commits:**
- `c41bcac` - Fix invalid placeholder from array field
- `3d27d2b` - Add Q&A blocks, trust signals
- `d11de30` - Remove deprecated licensingInfo field
- `a2d7999` - Remove orphaned property schema file

**Tagged versions:**
- `v1.2.0-schema-enhanced` - Schema enhancement milestone
