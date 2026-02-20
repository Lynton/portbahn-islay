# Property Schema Field Comparison

## Comparison Date
- Current File: `sanity/schemas/property.ts` (Hybrid v1.1)
- Backup File: `sanity/schemas-backup/property-backup-20260114.ts` (Original)

---

## Fields REMOVED from Backup (Not in Current)

### Basic Info
- ❌ `propertyType` (string: house/cottage/apartment)

### Images
- ❌ `heroImage.alt` field (alt text field removed from heroImage)
- ❌ `images[].alt` field (alt text field removed from images array)
- ❌ `images[].caption` field (caption field removed from images array)

### Content
- ❌ `description` (text) → **REPLACED by** `overview` (array of blocks)

### Property Details
- ❌ `beds` (number) - Number of beds field
- ❌ `bedroomDetails` (array of strings) → **REPLACED by** `sleepingArrangements` (text)
- ❌ `bathroomDetails` (array of strings) → **REPLACED by** `sleepingArrangements` (text)

### Facilities (Replaced by unified `facilities` array)
- ❌ `kitchenDining` (array with checkboxes)
- ❌ `kitchenDiningNotes` (array)
- ❌ `livingAreas` (array with checkboxes)
- ❌ `livingAreasNotes` (array)
- ❌ `heatingCooling` (array with checkboxes)
- ❌ `heatingCoolingNotes` (array)
- ❌ `entertainment` (array with checkboxes)
- ❌ `entertainmentNotes` (array)
- ❌ `laundryFacilities` (array with checkboxes)
- ❌ `safetyFeatures` (array with checkboxes)

### Outdoor Spaces
- ❌ `outdoorFeatures` (array with checkboxes) → **REPLACED by** `outdoorSpaces` (text)
- ❌ `outdoorFeaturesNotes` (array) → **REPLACED by** `outdoorSpaces` (text)
- ❌ `parkingInfo` (string) → **MERGED into** `outdoorSpaces` (text)

### Pet Policy
- ❌ `petFriendly` (boolean)
- ❌ `petPolicyDetails` (array) → **REPLACED by** `petPolicy` (structured object)

### Location
- ❌ `location` (string - town/village) → **REPLACED by** `location` (object with address/coordinates/nearestTown)
- ❌ `nearbyAttractions` (array) → **REPLACED by** `localArea` (text)
- ❌ `whatToDoNearby` (array) → **REPLACED by** `localArea` (text)
- ❌ `postcode` (string) → **MERGED into** `location.address`
- ❌ `latitude` (number) → **MERGED into** `location.coordinates` (geopoint)
- ❌ `longitude` (number) → **MERGED into** `location.coordinates` (geopoint)
- ❌ `directions` (text) → **REPLACED by** `gettingHere` (text)
- ❌ `ferryInfo` (text) → **MERGED into** `gettingHere` (text)
- ❌ `airportDistance` (string) → **MERGED into** `gettingHere` (text)
- ❌ `portDistance` (string) → **MERGED into** `gettingHere` (text)

### Policies
- ❌ `checkInTime` (string) → **MERGED into** `policies` (text)
- ❌ `checkOutTime` (string) → **MERGED into** `policies` (text)
- ❌ `cancellationPolicy` (text)
- ❌ `paymentTerms` (text)
- ❌ `securityDeposit` (string)
- ❌ `licensingInfo` (string)
- ❌ `importantInfo` (array of text)
- ❌ `dailyRate` (number)
- ❌ `weeklyRate` (number)

### What's Included
- ❌ `included` (array) → **REPLACED by** `includedInStay` (structured array with predefined options)
- ❌ `notIncluded` (array)

### Lodgify Integration
- ❌ `lodgifyRoomId` (number) → **RENAMED to** `lodgifyRoomTypeId`
- ❌ `icsUrl` (url)

### Google Reviews
- ❌ `googleBusinessUrl` (url)
- ❌ `googlePlaceId` (string)

### SEO
- ❌ `seoTitle` (string) → **RENAMED to** `metaTitle`
- ❌ `seoDescription` (text) → **RENAMED to** `metaDescription`

---

## Fields ADDED in Current (Not in Backup)

### Entity Framing (NEW)
- ✅ `entityFraming` (object)
  - `whatItIs` (string) - Explicit entity definition
  - `whatItIsNot` (array) - Common misconceptions
  - `primaryDifferentiator` (string) - Key distinguishing feature

### Content
- ✅ `overview` (array of blocks) - Rich text replacing `description`
- ✅ `locationDescription` (text) - Evocative location description
- ✅ `localArea` (text) - What's nearby (replaces arrays)

### Property Details
- ✅ `sleepingArrangements` (text) - Unified sleeping configuration
- ✅ `facilities` (unified array) - Single facilities array with predefined options
- ✅ `outdoorSpaces` (text) - Unified outdoor description
- ✅ `includedInStay` (structured array) - Predefined included items

### Location
- ✅ `location` (object) - Structured location data
  - `address` (string)
  - `coordinates` (geopoint)
  - `nearestTown` (string)
- ✅ `gettingHere` (text) - Unified travel directions

### Policies
- ✅ `petPolicy` (structured object) - Replaces boolean + array
  - `allowed` (string: dogs-welcome/no-pets/contact)
  - `fee` (string)
  - `conditions` (text)
- ✅ `policies` (text) - Unified house rules text

### Trust Signals
- ✅ `trustSignals` moved to `seo` group (was in `details`)

---

## Fields MODIFIED/CHANGED

### Field Type Changes
- `overviewIntro`: `string` → `text` (with rows: 2)
- `sleepingIntro`: `string` → `text` (with rows: 2)
- `facilitiesIntro`: `string` → `text` (with rows: 2)
- `outdoorIntro`: `string` → `text` (with rows: 2)
- `includedIntro`: `string` → `text` (with rows: 2)
- `locationIntro`: `string` → `text` (with rows: 2)
- `gettingHereIntro`: `string` → `text` (with rows: 2)
- `petPolicyIntro`: `string` → `text` (with rows: 2)
- `policiesIntro`: `string` → `text` (with rows: 2)

### Field Name Changes
- `description` → `overview`
- `lodgifyRoomId` → `lodgifyRoomTypeId`
- `seoTitle` → `metaTitle`
- `seoDescription` → `metaDescription`

### Group Changes
- `trustSignals`: `details` group → `seo` group
- `location` group: "Location & Directions" → "Location & Access"
- `policies` group: "Policies & Rules" → "Policies"
- Removed `lodgify` group (fields moved to `details`)

### Validation Changes
- Many fields now have enhanced validation rules
- Added descriptions with SEO/AEO guidance
- Added placeholder text
- Enhanced field descriptions with examples

---

## Summary Statistics

- **Total fields in backup**: ~70 fields
- **Total fields in current**: ~40 fields
- **Fields removed**: ~30 fields
- **Fields added**: ~10 new fields
- **Fields renamed**: 4 fields
- **Fields restructured**: Multiple (facilities, location, pet policy, etc.)

---

## Key Architectural Changes

1. **Consolidation**: Many separate checkbox arrays consolidated into unified text/array fields
2. **Structured Objects**: Location and pet policy moved to structured objects
3. **Rich Text**: Description changed from text to rich text blocks
4. **Entity Framing**: New explicit AI definition layer added
5. **Enhanced Guidance**: All fields now include SEO/AEO guidance and examples
6. **Simplified Groups**: Reduced from 6 groups to 5 groups
