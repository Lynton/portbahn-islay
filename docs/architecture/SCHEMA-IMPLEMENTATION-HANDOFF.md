# Schema Implementation Handoff for Claude Code

**Date:** 2026-01-21
**Project:** Portbahn Islay (PBI) - Sanity Schema Enhancement
**Target File:** `/sessions/zen-laughing-bohr/mnt/dev/portbahn-islay/sanity/schemas/property.ts`

---

## CONTEXT

You are implementing schema enhancements for a luxury self-catering property portfolio on Islay, Scotland. The existing schema (889 lines) is comprehensive and well-structured. We're adding 14 new fields to support AI-first search optimization (AEO/GEO/SEO) and personality-driven content.

**Key Requirements:**
- All new fields are **optional** (backwards-compatible)
- Maintain existing field structure and validation
- Add 2 new groups: `personality` and `reviews`
- Follow existing schema patterns for consistency

**Reference Document:** `/sessions/zen-laughing-bohr/mnt/_www_Claude_CoWork/ENHANCED-SCHEMA-SPECIFICATION.md` (complete field definitions)

---

## IMPLEMENTATION CHECKLIST

### 1. Add New Groups to Schema Groups Array

Location: Near top of `property.ts` (around existing groups definition)

```typescript
// ADD THESE TWO NEW GROUPS
{
  name: 'personality',
  title: '👥 Personality & Guest Experience',
  options: { collapsible: true, collapsed: true }
},
{
  name: 'reviews',
  title: '⭐ Reviews & Social Proof',
  options: { collapsible: true, collapsed: true }
},
```

### 2. Add Personality Fields (6 fields)

**Add to schema fields array, assign to `personality` group:**

#### Field 1: propertyNickname
```typescript
{
  name: 'propertyNickname',
  title: 'Property Nickname',
  type: 'string',
  description: 'Optional internal nickname that captures property personality (e.g., "The View House", "The Character House"). Used for editorial reference and potential subtle branding.',
  group: 'personality',
  validation: Rule => Rule.max(50),
}
```

#### Field 2: guestSuperlatives
```typescript
{
  name: 'guestSuperlatives',
  title: 'Guest Superlatives',
  type: 'array',
  of: [{ type: 'string' }],
  description: 'Short, powerful quotes from reviews that capture what guests say most often. Include source/date. Import from Enhanced Brief. Examples: "Better than the pictures", "One of my favorite stays in Scotland".',
  group: 'personality',
  validation: Rule => Rule.max(10),
}
```

#### Field 3: magicMoments
```typescript
{
  name: 'magicMoments',
  title: 'Magic Moments',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'moment',
          title: 'Moment Description',
          type: 'text',
          rows: 2,
          validation: Rule => Rule.required().max(200),
        },
        {
          name: 'frequency',
          title: 'Frequency Note',
          type: 'string',
          description: 'Optional note about how often mentioned (e.g., "15+ reviews", "Most common arrival ritual")',
        },
      ],
      preview: {
        select: {
          title: 'moment',
          subtitle: 'frequency',
        },
      },
    },
  ],
  description: 'Experiential patterns mentioned 5+ times in reviews. Real moments guests repeatedly describe. Import from Enhanced Brief.',
  group: 'personality',
  validation: Rule => Rule.max(8),
}
```

#### Field 4: perfectFor
```typescript
{
  name: 'perfectFor',
  title: 'Perfect For',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'guestType',
          title: 'Guest Type',
          type: 'string',
          description: 'e.g., "Whisky enthusiasts", "Families with young children"',
          validation: Rule => Rule.required().max(100),
        },
        {
          name: 'why',
          title: 'Why Perfect For Them',
          type: 'text',
          rows: 3,
          description: 'Concise explanation (2-3 sentences)',
          validation: Rule => Rule.required().max(300),
        },
        {
          name: 'reviewEvidence',
          title: 'Review Evidence',
          type: 'string',
          description: 'Optional percentage/count (e.g., "40% of reviews mention whisky tours")',
        },
      ],
      preview: {
        select: {
          title: 'guestType',
          subtitle: 'reviewEvidence',
        },
      },
    },
  ],
  description: 'Guest types that consistently love this property, backed by review evidence. Import from Enhanced Brief.',
  group: 'personality',
  validation: Rule => Rule.max(5),
}
```

#### Field 5: honestFriction
```typescript
{
  name: 'honestFriction',
  title: 'Honest Friction',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'issue',
          title: 'Issue',
          type: 'string',
          description: 'Brief description of limitation (e.g., "Small twin bedroom")',
          validation: Rule => Rule.required().max(100),
        },
        {
          name: 'context',
          title: 'Context',
          type: 'text',
          rows: 2,
          description: 'Why it exists, who it matters for, why it might not matter',
          validation: Rule => Rule.required().max(300),
        },
      ],
      preview: {
        select: {
          title: 'issue',
        },
      },
    },
  ],
  description: 'Transparent acknowledgment of repeated friction points from reviews. Builds trust through honesty. Import from Enhanced Brief.',
  group: 'personality',
  validation: Rule => Rule.max(5),
}
```

#### Field 6: ownerContext
```typescript
{
  name: 'ownerContext',
  title: 'Owner Context',
  type: 'text',
  rows: 4,
  description: 'Optional background on property owner/history that explains the character (e.g., Shorefield: bird watchers, painters, world travelers). Only fill if adds meaningful personality dimension.',
  group: 'personality',
}
```

---

### 3. Add Review Fields (4 fields)

**Add to schema fields array, assign to `reviews` group:**

#### Field 7: reviewScores
```typescript
{
  name: 'reviewScores',
  title: 'Review Scores',
  type: 'object',
  description: 'Aggregate review data from all platforms. Import from review platform exports.',
  group: 'reviews',
  fields: [
    {
      name: 'airbnbScore',
      title: 'Airbnb Score',
      type: 'number',
      validation: Rule => Rule.min(0).max(5).precision(2),
    },
    {
      name: 'airbnbCount',
      title: 'Airbnb Review Count',
      type: 'number',
      validation: Rule => Rule.min(0).integer(),
    },
    {
      name: 'airbnbBadges',
      title: 'Airbnb Badges',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Guest Favourite', value: 'guest-favourite' },
          { title: 'Top 10% of Homes', value: 'top-10-percent' },
          { title: 'Superhost', value: 'superhost' },
        ],
      },
    },
    {
      name: 'bookingScore',
      title: 'Booking.com Score',
      type: 'number',
      validation: Rule => Rule.min(0).max(10).precision(1),
    },
    {
      name: 'bookingCount',
      title: 'Booking.com Review Count',
      type: 'number',
      validation: Rule => Rule.min(0).integer(),
    },
    {
      name: 'bookingCategory',
      title: 'Booking.com Category',
      type: 'string',
      options: {
        list: [
          { title: 'Exceptional (9.0+)', value: 'exceptional' },
          { title: 'Superb (8.0-8.9)', value: 'superb' },
          { title: 'Very Good (7.0-7.9)', value: 'very-good' },
        ],
      },
    },
    {
      name: 'googleScore',
      title: 'Google Score',
      type: 'number',
      validation: Rule => Rule.min(0).max(5).precision(1),
    },
    {
      name: 'googleCount',
      title: 'Google Review Count',
      type: 'number',
      validation: Rule => Rule.min(0).integer(),
    },
  ],
}
```

#### Field 8: reviewThemes
```typescript
{
  name: 'reviewThemes',
  title: 'Review Themes',
  type: 'array',
  of: [{ type: 'string' }],
  description: 'Select 3-7 themes that appear most frequently in reviews. Helps AI understand property strengths.',
  group: 'reviews',
  options: {
    list: [
      { title: 'Stunning Views', value: 'stunning-views' },
      { title: 'Immaculate Cleanliness', value: 'immaculate-cleanliness' },
      { title: 'Thoughtful Amenities', value: 'thoughtful-amenities' },
      { title: 'Perfect Location', value: 'perfect-location' },
      { title: 'Character & Charm', value: 'character-charm' },
      { title: 'Family Friendly', value: 'family-friendly' },
      { title: 'Cozy Atmosphere', value: 'cozy-atmosphere' },
      { title: 'Well Equipped', value: 'well-equipped' },
      { title: 'Responsive Host', value: 'responsive-host' },
      { title: 'Great for Groups', value: 'great-for-groups' },
      { title: 'Peaceful & Quiet', value: 'peaceful-quiet' },
      { title: 'Dog Friendly', value: 'dog-friendly' },
    ],
  },
  validation: Rule => Rule.max(7),
}
```

#### Field 9: reviewHighlights
```typescript
{
  name: 'reviewHighlights',
  title: 'Review Highlights',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'quote',
          title: 'Quote',
          type: 'text',
          rows: 2,
          description: 'Short excerpt (1-2 sentences max)',
          validation: Rule => Rule.required().max(250),
        },
        {
          name: 'source',
          title: 'Source',
          type: 'string',
          description: 'Platform and date (e.g., "Airbnb, December 2024")',
          validation: Rule => Rule.required(),
        },
        {
          name: 'rating',
          title: 'Rating',
          type: 'number',
          description: 'Optional rating from this review',
        },
      ],
      preview: {
        select: {
          title: 'quote',
          subtitle: 'source',
        },
      },
    },
  ],
  description: 'Curated selection of best review quotes. Choose diverse themes. Import from review working files.',
  group: 'reviews',
  validation: Rule => Rule.max(10),
}
```

#### Field 10: totalReviewCount
```typescript
{
  name: 'totalReviewCount',
  title: 'Total Review Count',
  type: 'number',
  description: 'Sum of all reviews across platforms. Used for trust signals.',
  group: 'reviews',
  validation: Rule => Rule.min(0).integer(),
}
```

---

### 4. Enhance Licensing Fields (Replace Existing)

**Find and REPLACE the existing `licensingInfo` field with these 4 fields:**

Location: In the `policies` group

#### Field 11: licensingStatus
```typescript
{
  name: 'licensingStatus',
  title: 'Licensing Status',
  type: 'string',
  description: 'Current STL licensing status. Affects availability status and CTA on frontend.',
  group: 'policies',
  options: {
    list: [
      { title: 'Approved', value: 'approved' },
      { title: 'Pending - Bookable', value: 'pending-bookable' },
      { title: 'Pending - Enquiries Only', value: 'pending-enquiries' },
      { title: 'Coming Soon', value: 'coming-soon' },
    ],
  },
  validation: Rule => Rule.required(),
}
```

#### Field 12: licenseNumber
```typescript
{
  name: 'licenseNumber',
  title: 'License Number',
  type: 'string',
  description: 'STL license number (required for display on site)',
  group: 'policies',
  validation: Rule => Rule.required(),
}
```

#### Field 13: licenseNotes
```typescript
{
  name: 'licenseNotes',
  title: 'License Notes',
  type: 'text',
  rows: 2,
  description: 'Optional internal notes about licensing status, application date, etc.',
  group: 'policies',
}
```

#### Field 14: availabilityStatus
```typescript
{
  name: 'availabilityStatus',
  title: 'Availability Status',
  type: 'string',
  description: 'Current booking availability. Determines CTA on frontend (Book Now vs Enquire vs Coming Soon).',
  group: 'policies',
  options: {
    list: [
      { title: 'Bookable', value: 'bookable' },
      { title: 'Enquiries Only', value: 'enquiries' },
      { title: 'Coming Soon', value: 'coming-soon' },
      { title: 'Unavailable', value: 'unavailable' },
    ],
  },
  validation: Rule => Rule.required(),
}
```

---

## IMPLEMENTATION NOTES

### Field Ordering
- Add personality fields after existing `description` field (in Overview/Content group)
- Add review fields after personality fields
- Replace `licensingInfo` with 4 new licensing fields in existing `policies` group
- Maintain alphabetical or logical ordering within groups

### Validation Strategy
- All new fields are **optional** except licensing fields (which replace existing required field)
- Max lengths are generous (allow editorial flexibility)
- Array max counts prevent bloat while allowing comprehensive content

### Preview Configs
- Object arrays include preview selects for better editor UX
- Shows key fields in collapsed view (guest type, moment, issue, quote)

### Import Hints in Descriptions
- Field descriptions include import source references
- Helps editors understand where data comes from
- Supports bulk import workflow

---

## TESTING CHECKLIST

After implementation, verify:

1. **Schema Compiles**
   - No TypeScript errors
   - Sanity CLI accepts schema (`sanity schema extract`)

2. **Studio Loads**
   - Deploy to Sanity Studio (`sanity deploy`)
   - Studio loads without errors
   - Two new groups visible: Personality, Reviews

3. **Field Rendering**
   - All 14 new fields visible in appropriate groups
   - Validation rules work (try exceeding max lengths)
   - Preview configs show correct fields in object arrays
   - Dropdown/select options render correctly

4. **Backwards Compatibility**
   - Existing property documents load without errors
   - No data loss on existing fields
   - Can save existing documents without filling new fields

5. **Group Collapsibility**
   - Personality group defaults to collapsed
   - Reviews group defaults to collapsed
   - Groups expand/collapse correctly

---

## KNOWN ISSUES & GOTCHAS

**Issue 1: Existing licensingInfo Field**
- Current schema has `licensingInfo` as unstructured text/string
- Must be REMOVED and replaced with 4 structured fields
- Data migration: Parse existing licensingInfo into licenseNumber field if possible

**Issue 2: Group Assignment**
- Ensure `group: 'personality'` and `group: 'reviews'` exactly match group names
- Typos will cause fields to appear in wrong group or not at all

**Issue 3: TypeScript Imports**
- Sanity schema uses `Rule` validation - ensure proper typing
- May need to import `Rule` type if not already present

---

## SUCCESS CRITERIA

✅ All 14 fields implemented
✅ 2 new groups added (personality, reviews)
✅ Schema compiles without errors
✅ Sanity Studio loads and displays new fields correctly
✅ Existing property documents unaffected
✅ Validation rules function as expected
✅ Preview configs show meaningful data

---

## NEXT STEPS AFTER IMPLEMENTATION

1. **Return to Claude Cowork** - Confirm implementation success
2. **Content Generation** - Generate enhanced JSON for 3 properties
3. **Data Import** - Bulk import enhanced content to Sanity
4. **Editorial Review** - Polish and verify in Studio
5. **Frontend Implementation** - Build NextJS components (Cursor)

---

## REFERENCE FILES

- Enhanced Schema Specification: `/sessions/zen-laughing-bohr/mnt/_www_Claude_CoWork/ENHANCED-SCHEMA-SPECIFICATION.md`
- Enhanced Nuance Brief: `/sessions/zen-laughing-bohr/mnt/_www_Claude_CoWork/PBI-NUANCE-BRIEF-ENHANCED.md`
- Current Schema: `/sessions/zen-laughing-bohr/mnt/dev/portbahn-islay/sanity/schemas/property.ts`

---

**Implementation Time Estimate:** 30-45 minutes
**Token Budget:** ~12-15k tokens
**Priority:** High (blocks content generation phase)
