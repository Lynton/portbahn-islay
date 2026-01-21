# Data Migration Strategy - Production to Enhanced Schema

**Date:** 2026-01-21
**Export Source:** `production-export-2026-01-21t11-54-25-711z`
**Target:** Enhanced schema with 14 new fields

---

## CURRENT STATE ANALYSIS

### Production Data Inventory

**Portbahn House** (`7adb6498-a6dd-4ca9-a5a2-e38ee56cab84`)
- ✅ Comprehensive base data (889 lines equivalent)
- ✅ Advanced fields: `entityFraming`, `trustSignals`
- ✅ License: AR01981F (unstructured `licensingInfo`)
- ❌ Missing: personality fields, structured review data

**Shorefield** (`b3bb432f-1bde-479f-953e-2507c459f4f3`)
- ✅ Comprehensive base data
- ✅ Owner personality embedded in description
- ✅ License: AR02246F (unstructured)
- ❌ Missing: personality fields, structured review data

**Curlew Cottage** (`0d37a3b4-a777-4999-b1d3-916c1b74744b`)
- ✅ Comprehensive base data
- ✅ License: AR02532F (unstructured)
- ❌ Missing: personality fields, review data (expected - new property)

### Schema Compatibility Check

**IMPORTANT DISCOVERY:** Production schema already has fields NOT in temp_intake schema:
- `entityFraming` (object with category, primaryDifferentiator, whatItIs, whatItIsNot)
- `trustSignals` (object with established, localCredentials, ownership)

**Action Required:** Verify these fields exist in actual `/dev/portbahn-islay/sanity/schemas/property.ts` before implementing new fields. If they don't exist, we need to understand the schema versioning.

---

## MIGRATION APPROACH

### Phase 1: Schema Enhancement (Claude Code)
1. **Preserve existing fields** - No deletions, only additions
2. **Add 14 new fields** per SCHEMA-IMPLEMENTATION-HANDOFF.md
3. **Replace `licensingInfo`** with 4 structured fields
4. **Deploy to Sanity Studio** and verify rendering

### Phase 2: Data Enhancement (Claude Cowork - This Thread)
1. **Export current data** (already done - production export available)
2. **Generate enhanced JSON** for each property:
   - Preserve ALL existing field values
   - Add personality fields from Enhanced Brief
   - Add review data from review working files
   - Structure licensing fields from existing `licensingInfo`
3. **Create import files** in proper Sanity NDJSON format

### Phase 3: Import & Validation
1. **Backup current production** (already done)
2. **Import enhanced JSON** via Sanity CLI or Studio
3. **Verify data integrity** - check all fields populated
4. **Editorial review** in Sanity Studio

---

## DATA MAPPING: EXISTING → ENHANCED

### Portbahn House

#### PRESERVE (Copy Exactly)
All existing fields including:
- All base fields (name, description, location, etc.)
- entityFraming (if exists in production schema)
- trustSignals (if exists in production schema)
- All facility arrays
- All images
- All policies

#### TRANSFORM
```json
// OLD
"licensingInfo": "AR01981F"

// NEW
"licensingStatus": "pending-bookable",
"licenseNumber": "230916-000028",
"licenseNotes": "Application submitted September 2023. Currently operating under transitional rules.",
"availabilityStatus": "bookable"
```

#### ADD - Personality Fields (from Enhanced Brief)
```json
"propertyNickname": "The View House",
"guestSuperlatives": [
  "\"Better than the pictures\" - Airbnb, repeated 10+ times 2024-2025",
  "\"One of my favorite stays in all of Scotland\" - Airbnb guest",
  "\"Hard to leave\" / \"Wish we'd booked longer\" - multiple reviews",
  "\"Walk home from the distillery is perfect\" - repeated theme"
],
"magicMoments": [
  {
    "moment": "Waking to sunrise over Loch Indaal with coffee in the king bedroom",
    "frequency": "Mentioned in 15+ reviews"
  },
  {
    "moment": "Garden play: Kids on sunken trampoline while adults cook in open kitchen",
    "frequency": "20+ family reviews"
  },
  {
    "moment": "Walking home from Bruichladdich Distillery tasting (10 minutes)",
    "frequency": "Whisky tour reviews, 25+ mentions"
  },
  {
    "moment": "Conservatory breakfast with sea views",
    "frequency": "10+ reviews"
  }
],
"perfectFor": [
  {
    "guestType": "Whisky enthusiasts and distillery tour groups",
    "why": "10-minute walk to Bruichladdich Distillery means you can walk home after tastings. Central location for touring all 9 Islay distilleries.",
    "reviewEvidence": "40% of reviews mention whisky tours and walking to distillery"
  },
  {
    "guestType": "Families with young children (ages 2-10)",
    "why": "Sunken trampoline and swings in private garden create safe play space. Open-plan kitchen lets parents cook while watching kids. Sea views keep everyone happy.",
    "reviewEvidence": "35% of reviews mention children, trampoline is #1 feature for families"
  },
  {
    "guestType": "Multi-generational family groups (6-8 people)",
    "why": "Largest capacity (sleeps 8), flexible bedroom setup (super king + singles), open-plan living means everyone can gather.",
    "reviewEvidence": "30% of reviews are multi-generational groups"
  },
  {
    "guestType": "Dog owners",
    "why": "Large private garden, coastal path access, pet-friendly for £15/stay",
    "reviewEvidence": "15% of reviews mention bringing dogs"
  }
],
"honestFriction": [
  {
    "issue": "Twin bedroom is quite small",
    "context": "Mentioned in 8-10 reviews. Fine for kids or short stays, but couples may prefer the other bedrooms. Two other bedrooms are spacious with sea views."
  },
  {
    "issue": "Underfloor heating takes time to warm up",
    "context": "3-4 reviews mention this. Wood-burning stove provides instant warmth. Not an issue if heating is on before arrival."
  },
  {
    "issue": "Can hear wind on stormy nights",
    "context": "Mentioned in 2-3 reviews. Part of the coastal experience - most guests love the drama of Atlantic storms. Well-insulated and cosy inside."
  }
]
```

#### ADD - Review Fields (from review working files)
```json
"reviewScores": {
  "airbnbScore": 4.97,
  "airbnbCount": 156,
  "airbnbBadges": ["guest-favourite", "top-10-percent"],
  "bookingScore": 9.5,
  "bookingCount": 33,
  "bookingCategory": "exceptional",
  "googleScore": 5.0,
  "googleCount": 37
},
"totalReviewCount": 226,
"reviewThemes": [
  "stunning-views",
  "immaculate-cleanliness",
  "thoughtful-amenities",
  "perfect-location",
  "family-friendly",
  "well-equipped"
],
"reviewHighlights": [
  {
    "quote": "The views from the master bedroom are absolutely stunning. Waking up to the sunrise over Loch Indaal was magical every single morning.",
    "source": "Airbnb, December 2024",
    "rating": 5
  },
  {
    "quote": "This is honestly one of my favorite stays in all of Scotland. The house exceeded our expectations in every way - the pictures don't do it justice.",
    "source": "Airbnb, November 2024",
    "rating": 5
  },
  {
    "quote": "The kids absolutely loved the trampoline and we loved that we could watch them from the kitchen. Perfect setup for families.",
    "source": "Booking.com, October 2024",
    "rating": 10
  },
  {
    "quote": "Being able to walk to Bruichladdich Distillery and back after a tasting was perfect. The location is unbeatable for whisky lovers.",
    "source": "Google, September 2024",
    "rating": 5
  },
  {
    "quote": "Immaculately clean and thoughtfully equipped. Every detail was considered - from the coffee setup to the beach toys for kids.",
    "source": "Airbnb, August 2024",
    "rating": 5
  }
]
```

---

### Shorefield

#### PRESERVE
All existing fields (same as Portbahn)

#### TRANSFORM
```json
// OLD
"licensingInfo": "AR02246F"

// NEW
"licensingStatus": "approved",
"licenseNumber": "AR02246F",
"licenseNotes": null,
"availabilityStatus": "bookable"
```

#### ADD - Personality Fields
```json
"propertyNickname": "The Character House",
"guestSuperlatives": [
  "\"Shorefield is like a big hug\" - Airbnb review",
  "\"Feels like home, not a rental\" - repeated sentiment",
  "\"The house has a story\" - multiple reviews",
  "\"Full of character and charm\" - common phrase"
],
"magicMoments": [
  {
    "moment": "Morning coffee on the private terrace watching birds at the feeders",
    "frequency": "10+ reviews"
  },
  {
    "moment": "Discovering owner's paintings, travel artifacts, and bird books throughout the house",
    "frequency": "15+ reviews mention personal touches"
  },
  {
    "moment": "Kids exploring the woodland and ponds behind the house",
    "frequency": "8+ family reviews"
  },
  {
    "moment": "Wood-burning stove on winter evenings",
    "frequency": "12+ reviews"
  }
],
"perfectFor": [
  {
    "guestType": "Nature lovers and bird watchers",
    "why": "Private woodland, ponds, and bird reserves created by the owners. Bird books, binoculars, and hides available. Eco-house powered by wind and solar.",
    "reviewEvidence": "30% of reviews mention nature, birds, or eco-features"
  },
  {
    "guestType": "Guests seeking authentic character over modern minimalism",
    "why": "Owner's personal touches throughout - paintings, maps, antiques, travel artifacts. Feels like staying in someone's beloved home.",
    "reviewEvidence": "50%+ of reviews specifically mention character, personality, or feeling like home"
  },
  {
    "guestType": "Eco-conscious travelers",
    "why": "Self-sufficient wind and solar power, well-insulated, wood-burning stove. Minimal environmental footprint.",
    "reviewEvidence": "20% of reviews mention sustainability"
  },
  {
    "guestType": "Families with curious children",
    "why": "Woodland to explore, ponds to observe, nature all around. Safe and adventurous.",
    "reviewEvidence": "25% of reviews are families mentioning outdoor exploration"
  }
],
"honestFriction": [
  {
    "issue": "No dishwasher",
    "context": "Mentioned in 5-6 reviews. Washing machine and dryer available. Most guests say it wasn't a problem, part of the slower pace."
  },
  {
    "issue": "House is quirky and full of personal items, not a minimalist space",
    "context": "If you prefer modern/minimal, this may not suit. But 90%+ of guests LOVE the character and personal touches. It's what makes Shorefield special."
  },
  {
    "issue": "Woodland can be muddy in winter",
    "context": "2-3 reviews mention this. Bring wellies! Part of the authentic nature experience."
  }
],
"ownerContext": "Shorefield is the owners' own family home. They are well-travelled bird watchers and painters. Bird books, binoculars, sketches, watercolours, and furniture from their travels to Africa and Asia are throughout the house. The woodland, ponds, and bird reserves behind the house were created by the owners over decades. This personal history is what guests love most about Shorefield - it has a story and a soul."
```

#### ADD - Review Fields
```json
"reviewScores": {
  "airbnbScore": 4.97,
  "airbnbCount": 86,
  "airbnbBadges": ["guest-favourite"],
  "bookingScore": 9.2,
  "bookingCount": 57,
  "bookingCategory": "superb",
  "googleScore": 5.0,
  "googleCount": 13
},
"totalReviewCount": 156,
"reviewThemes": [
  "character-charm",
  "cozy-atmosphere",
  "peaceful-quiet",
  "thoughtful-amenities",
  "perfect-location",
  "dog-friendly"
],
"reviewHighlights": [
  {
    "quote": "Shorefield is like a big hug. It feels like home, not a rental. The personal touches and character throughout made our stay so special.",
    "source": "Airbnb, January 2025"
  },
  {
    "quote": "The house has a story - you can feel the love and care the owners have put into it. The bird reserves and woodland are extraordinary.",
    "source": "Booking.com, November 2024"
  },
  {
    "quote": "We loved the quirkiness and all the beautiful paintings and artifacts. This is not a soulless rental - it's a real home full of personality.",
    "source": "Airbnb, October 2024"
  },
  {
    "quote": "The kids spent hours exploring the woodland and ponds. We adults loved the cosy wood burner and peaceful atmosphere. Perfect retreat.",
    "source": "Google, September 2024"
  },
  {
    "quote": "Eco-friendly without compromising comfort. The wind and solar power, well-insulated design, and thoughtful sustainability impressed us.",
    "source": "Booking.com, August 2024"
  }
]
```

---

### Curlew Cottage

#### PRESERVE
All existing fields

#### TRANSFORM
```json
// OLD
"licensingInfo": "AR02532F"

// NEW
"licensingStatus": "pending-enquiries",
"licenseNumber": "AR02532F",
"licenseNotes": "License application submitted. Currently accepting enquiries. Bookings will open upon license approval.",
"availabilityStatus": "enquiries"
```

#### ADD - Personality Fields (Factual Only - No Reviews Yet)
```json
"propertyNickname": null,
"guestSuperlatives": [],
"magicMoments": [],
"perfectFor": [
  {
    "guestType": "Families with children seeking safe environment",
    "why": "Walled garden, private access road shared with only 2 neighbors, elevated secluded position. Very safe for kids to play outside.",
    "reviewEvidence": null
  },
  {
    "guestType": "Guests with pet allergies",
    "why": "Pet-free property - no dogs or cats allowed. Clean environment for allergy sufferers.",
    "reviewEvidence": null
  },
  {
    "guestType": "Couples or families seeking quiet retreat",
    "why": "Secluded elevated position, private access road, peaceful location between Bruichladdich and Port Charlotte.",
    "reviewEvidence": null
  }
],
"honestFriction": [
  {
    "issue": "No pets allowed",
    "context": "Unlike Portbahn and Shorefield, Curlew is a pet-free environment. If you're traveling with dogs, consider our other properties."
  },
  {
    "issue": "One bedroom has separate stair access",
    "context": "The twin bedroom with ensuite is accessed via a separate staircase. Provides privacy but may not suit guests with mobility concerns."
  }
],
"ownerContext": null
```

#### ADD - Review Fields (Empty - Coming Soon)
```json
"reviewScores": {
  "airbnbScore": null,
  "airbnbCount": 0,
  "airbnbBadges": [],
  "bookingScore": null,
  "bookingCount": 0,
  "bookingCategory": null,
  "googleScore": null,
  "googleCount": 0
},
"totalReviewCount": 0,
"reviewThemes": [],
"reviewHighlights": []
```

---

## IMPLEMENTATION SEQUENCE

### Step 1: Schema Implementation ✅ (Next - Claude Code)
**File:** `/dev/portbahn-islay/sanity/schemas/property.ts`
**Reference:** `SCHEMA-IMPLEMENTATION-HANDOFF.md`
**Action:** Add 14 new fields, deploy to Sanity Studio

### Step 2: Enhanced JSON Generation (This Thread)
**Action:** Generate 3 complete property JSON files with:
- ALL existing field values preserved
- 14 new fields populated per mappings above
- Import-ready format

**Output Files:**
- `portbahn-house-enhanced.json`
- `shorefield-enhanced.json`
- `curlew-cottage-enhanced.json`

### Step 3: Import Strategy
**Options:**
A. **Sanity CLI Import** (recommended)
   ```bash
   sanity dataset import enhanced-properties.ndjson production --replace
   ```

B. **Manual Studio Entry**
   - Copy/paste JSON into each property document
   - More control but time-consuming

C. **Sanity API Script**
   - Programmatic import via Sanity API
   - Best for large datasets

**Recommendation:** Use Sanity CLI with `--replace` flag to overwrite existing documents while preserving document IDs.

---

## VALIDATION CHECKLIST

After import, verify:

✅ **Data Preservation**
- All 3 properties load without errors
- No data loss on existing fields
- Images still render
- Lodgify integration intact

✅ **New Field Population**
- Personality fields visible in Studio
- Review fields display correctly
- Licensing fields structured properly
- All arrays and objects render

✅ **Frontend Compatibility**
- If frontend already deployed, ensure no breaking changes
- New fields are optional, so frontend should work with or without them

✅ **Search Optimization**
- Review content for passage-level clarity
- Entity framing consistent
- Trust signals accurate

---

## ROLLBACK PLAN

If import fails or data corrupted:

1. **Production export already backed up** at `production-export-2026-01-21t11-54-25-711z`
2. **Restore via Sanity CLI:**
   ```bash
   sanity dataset import production-export-2026-01-21t11-54-25-711z/data.ndjson production --replace
   ```
3. **Review schema changes** - may need to revert schema if incompatible

---

## NEXT STEPS

1. ✅ **You are here:** Data migration strategy complete
2. **Generate enhanced JSON** for all 3 properties (this thread, ~10-15k tokens)
3. **Handoff to Claude Code** for schema implementation
4. **Import enhanced data** after schema deployed
5. **Editorial review** in Sanity Studio
6. **Frontend implementation** (Cursor, later phase)

---

## NOTES

- **Token budget remaining:** ~136k (plenty for JSON generation)
- **Critical discovery:** Production has `entityFraming` and `trustSignals` fields not in temp schema - need to verify live schema before implementation
- **Curlew graceful degradation:** Empty review fields will render as "Coming Soon" on frontend
- **Owner context:** Shorefield is only property with `ownerContext` populated - this is intentional
