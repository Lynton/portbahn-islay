# Enhanced Property Schema Specification

**Project:** Portbahn Islay (PBI) & Bothan Jura Rooms (BJR)
**Date:** 2026-01-21
**Purpose:** Complete Sanity schema specification for property content type with personality, review, and licensing enhancements

**Dev Location:** `/Users/lynton/dev/portbahn-islay/sanity/schemas/property.ts`
**Current Schema:** 889 lines, 10 AI-optimized content blocks, comprehensive structure
**Enhancement:** Add 14 fields (personality + reviews + licensing) for AI-first search optimization

---

## OVERVIEW

### What This Spec Covers

1. **New Fields** (14 total): Personality, reviews, licensing enhancements
2. **Group Organization** (15 groups): Including 2 new groups (Personality, Reviews)
3. **Field Definitions**: Complete TypeScript structure with validation
4. **Import Mapping**: How to populate from existing data + Enhanced Brief + reviews
5. **Editor Guidance**: Descriptions with import hints
6. **Implementation Notes**: For Claude Code handoff

### What Stays Unchanged

✅ **All existing fields preserved** (name, slug, sleeps, beds, amenities, facilities, location, policies, lodgify, AI search, SEO)
✅ **Current group structure** (content, details, location, policies, lodgify, ai-search, seo)
✅ **Validation rules** (existing patterns maintained)
✅ **AI optimization structure** (entity framing, trust signals, common questions)

### Philosophy

**This schema serves:**
- **AEO (AI Engine Optimization)**: Passage-level extraction, entity framing, trust signals
- **GEO (Generative Engine Optimization)**: Geographic markers, location entities, distance data
- **SEO (Traditional Search)**: Meta fields, Schema.org, structured data
- **Bulk import workflow**: Automated content generation from source material
- **Editorial efficiency**: Experienced editors focus on polish, not manual entry

---

## ENHANCED GROUP STRUCTURE

### Current Groups (Unchanged)
```typescript
groups: [
  { name: 'content', title: 'Content', default: true },
  { name: 'details', title: 'Property Details' },
  { name: 'location', title: 'Location & Directions' },
  { name: 'policies', title: 'Policies & Rules' },
  { name: 'lodgify', title: 'Lodgify Integration' },
  { name: 'ai-search', title: 'AI & Search Optimization' },
  { name: 'seo', title: 'SEO' },
]
```

### New Groups (Add)
```typescript
// Add these to existing groups array:
{ name: 'personality', title: '👥 Personality & Guest Experience' },
{ name: 'reviews', title: '⭐ Reviews & Social Proof' },
```

### Final Group Order (15 groups)
```
1. content (default open)
2. personality (collapsed by default) [NEW]
3. reviews (collapsed by default) [NEW]
4. details (expandable)
5. location (expandable)
6. policies (expandable)
7. lodgify (collapsed)
8. ai-search (collapsed)
9. seo (collapsed)
```

**Rationale:** Personality and reviews are bulk-imported once, rarely edited, so collapsed by default. Core editing (content, details, location, policies) stays accessible.

---

## NEW FIELDS: PERSONALITY GROUP

### Field 1: Property Nickname

```typescript
defineField({
  name: 'propertyNickname',
  title: 'Property Nickname (Optional)',
  type: 'string',
  group: 'personality',
  description: `Guest-resonant shorthand that captures personality.

🟡 OPTIONAL: Use if guests consistently use this language in reviews.

✓ DO: "The View House", "The Character House"
✗ DON'T: Make up marketing nicknames

IMPORT: Generated from Enhanced Brief "Property Personalities" section
- Portbahn: "The View House"
- Shorefield: "The Character House"
- Curlew: TBD (pending guest reviews)`,

  placeholder: 'The View House',
  validation: (Rule) => Rule.max(50).warning('Keep nickname short and memorable')
})
```

**Import Source:** `PBI-NUANCE-BRIEF-ENHANCED.md` → Property Personalities section

---

### Field 2: Guest Superlatives

```typescript
defineField({
  name: 'guestSuperlatives',
  title: 'Guest Superlatives (Real Review Quotes)',
  type: 'array',
  of: [{ type: 'string' }],
  group: 'personality',
  description: `Direct quotes from reviews that capture guest delight (3-5 max).

🟢 HELPFUL: Builds authenticity and social proof for AI extraction.

✓ DO: "Better than the pictures" - Airbnb guest, Dec 2024
✗ DON'T: Paraphrase or embellish - must be exact quotes

IMPORT: Extracted from review working files + raw reviews
- Source: Reviews_AirBnB_*.md, Reviews_Bookingcom_*.md, Reviews_Google_*.md
- Select top 3-5 most repeated/impactful phrases
- Include attribution (platform + approximate date)`,

  placeholder: '"Better than the pictures" - Airbnb guest',
  validation: (Rule) => Rule.max(5).warning('Use only the most impactful quotes - quality over quantity')
})
```

**Import Source:**
- `PB-Reviews-Working.md` → Language Bank + raw reviews
- `SHF-Reviews-Working.md` → Language Bank + raw reviews
- Select quotes appearing 5+ times or with strong emotional resonance

**Examples:**
```json
// Portbahn
"guestSuperlatives": [
  "\"Better than the pictures\" - Airbnb, 2024-2025",
  "\"One of my favorite stays in all of Scotland\" - Airbnb guest",
  "\"Hard to leave\" - repeated across platforms",
  "\"This is exactly what you'd want from Islay\" - Airbnb guest",
  "\"The sunrise from the bedroom window was stunning\" - Booking.com"
]

// Shorefield
"guestSuperlatives": [
  "\"Shorefield is like a big hug\" - Airbnb guest",
  "\"Feels like home, not a rental\" - repeated theme",
  "\"The house has a story\" - Airbnb guest",
  "\"Like visiting a favourite aunt's house\" - Booking.com",
  "\"One of the loveliest houses I've had the pleasure to stay in\" - Google"
]
```

---

### Field 3: Magic Moments

```typescript
defineField({
  name: 'magicMoments',
  title: 'Magic Moments',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      {
        name: 'moment',
        type: 'string',
        title: 'Moment Description',
        description: 'Specific experience pattern guests mention repeatedly',
        placeholder: 'Sunrise from the king bedroom with coffee overlooking Loch Indaal',
        validation: (Rule) => Rule.required().max(150).warning('Keep concise and specific')
      },
      {
        name: 'frequency',
        type: 'string',
        title: 'Frequency (Optional)',
        description: 'How often mentioned in reviews (helps validate authenticity)',
        placeholder: 'Mentioned in 15+ reviews',
        validation: (Rule) => Rule.max(50)
      }
    ],
    preview: {
      select: {
        title: 'moment',
        subtitle: 'frequency'
      }
    }
  }],
  group: 'personality',
  description: `Specific guest experience patterns repeated in reviews (3-5 max).

🟢 HELPFUL: Captures what guests actually do/love at this property.

✓ DO: "Sunrise from king bedroom with coffee" (mentioned 15+ reviews)
✗ DON'T: Generic activities - must be property-specific patterns

IMPORT: Generated from review analysis in Enhanced Brief
- Look for repeated activity/experience patterns (5+ mentions)
- Focus on sensory/emotional moments, not generic "beach walks"
- Must be specific to this property (not true of all Islay properties)`,

  validation: (Rule) => Rule.max(5).warning('Focus on top 3-5 repeated patterns')
})
```

**Import Source:**
- `PBI-NUANCE-BRIEF-ENHANCED.md` → Property Personalities → Magic Moments
- Review deep-dive (look for activity patterns mentioned 5+ times)

**Examples:**
```json
// Portbahn
"magicMoments": [
  {
    "moment": "Waking to sunrise over Loch Indaal with coffee in the king bedroom",
    "frequency": "Mentioned in 15+ reviews"
  },
  {
    "moment": "Kids on the sunken trampoline while adults cook dinner with sea views",
    "frequency": "Trampoline mentioned in 20+ reviews as 'massive hit'"
  },
  {
    "moment": "Walking home from Bruichladdich Distillery tour (10 minutes)",
    "frequency": "Walk-to-distillery mentioned in 60% of reviews"
  },
  {
    "moment": "Cosy evenings by the log fire with views across to Bowmore lights",
    "frequency": "Fire + views combination mentioned in 50+ reviews"
  }
]

// Shorefield
"magicMoments": [
  {
    "moment": "Breakfast at kitchen table by sliding doors watching birds in the garden",
    "frequency": "Bird watching mentioned in 10+ reviews"
  },
  {
    "moment": "Reading in the den with tea by the wood stove on rainy afternoons",
    "frequency": "Den + fire combination mentioned frequently"
  },
  {
    "moment": "Discovering owner's bird books and sketches throughout the house",
    "frequency": "Owner's collections mentioned in 15+ reviews"
  }
]
```

---

### Field 4: Perfect For (Guest Types)

```typescript
defineField({
  name: 'perfectFor',
  title: 'Perfect For (Guest Types)',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      {
        name: 'guestType',
        type: 'string',
        title: 'Guest Type',
        description: 'Who actually stays here (from review evidence)',
        placeholder: 'Whisky groups',
        validation: (Rule) => Rule.required().max(50)
      },
      {
        name: 'why',
        type: 'text',
        title: 'Why Perfect For Them',
        description: 'Specific reasons this property suits this guest type',
        placeholder: 'Modern bright base where you can walk home from Bruichladdich tour',
        rows: 2,
        validation: (Rule) => Rule.required().max(300)
      },
      {
        name: 'reviewEvidence',
        type: 'string',
        title: 'Review Evidence (Optional)',
        description: 'Quantify if possible (e.g., "40% of reviews")',
        placeholder: '40% of reviews mention distillery tours',
        validation: (Rule) => Rule.max(100)
      }
    ],
    preview: {
      select: {
        title: 'guestType',
        subtitle: 'why'
      },
      prepare({ title, subtitle }) {
        return {
          title,
          subtitle: subtitle ? subtitle.substring(0, 60) + '...' : ''
        }
      }
    }
  }],
  group: 'personality',
  description: `Who actually stays here, with evidence from reviews (3-5 max).

🟢 HELPFUL: Helps guests self-select, improves conversion.

✓ DO: "Whisky groups - modern base, walk to distillery" (40% of reviews)
✗ DON'T: "Everyone!" - be specific about who this suits

IMPORT: Generated from Enhanced Brief "Perfect For" section
- Review evidence percentages from review analysis
- Map guest types to property features + review themes`,

  validation: (Rule) => Rule.max(5).warning('List top 3-5 guest types with evidence')
})
```

**Import Source:**
- `PBI-NUANCE-BRIEF-ENHANCED.md` → Property Personalities → Perfect For (Review Evidence)
- Review theme analysis (who mentions what)

**Examples:**
```json
// Portbahn
"perfectFor": [
  {
    "guestType": "Whisky groups",
    "why": "Modern bright base for distillery tours. Walk home from Bruichladdich in 10 minutes. Open-plan kitchen/dining for group meals and tasting notes.",
    "reviewEvidence": "40% of reviews mention distillery tours and walking to Bruichladdich"
  },
  {
    "guestType": "Multi-generational families",
    "why": "Sleeps 8 across 3 bedrooms. Garden with sunken trampoline and swings keeps kids entertained. Underfloor heating and space for all ages (1-70+ mentioned in reviews).",
    "reviewEvidence": "30% of reviews are families with kids; trampoline mentioned 20+ times"
  },
  {
    "guestType": "Couples celebrating anniversaries/honeymoons",
    "why": "King bedroom with sunrise views over Loch Indaal. Peaceful location. Romantic walks along coast to Port Charlotte.",
    "reviewEvidence": "15% of reviews mention anniversaries or celebrations"
  },
  {
    "guestType": "International travelers",
    "why": "Pi's legendary ferry crisis support (CalMac cancellations). Clear logistics guidance. International guests (US, Germany, France, Japan) frequently mention host responsiveness.",
    "reviewEvidence": "High proportion of international reviews; ferry support mentioned 30+ times"
  }
]

// Shorefield
"perfectFor": [
  {
    "guestType": "Couples and friend groups who value character over modern finishes",
    "why": "Quirky charm with owner's personality visible (bird books, paintings, world travel mementos). Cosy wood stove and den for rainy evenings. Adults appreciate the story of the house.",
    "reviewEvidence": "40% of reviews emphasize 'home from home' and 'character'; couples/friends more than families"
  },
  {
    "guestType": "Birders and nature lovers",
    "why": "Owners created bird hides, woodlands, and wetlands behind house. Bird books and binoculars throughout. Morning bird watching from kitchen is a repeated guest ritual.",
    "reviewEvidence": "15% of reviews specifically mention birding; nature themes in 40%+"
  },
  {
    "guestType": "Readers and game-players seeking rainy-day sanctuary",
    "why": "Extensive book collection, board games, DVDs. Wood stove creates cosy atmosphere. Den is perfect for reading with tea. Scottish weather becomes part of the charm.",
    "reviewEvidence": "Books and games mentioned in 40% of reviews; rainy days described positively"
  }
]
```

---

### Field 5: Honest Friction

```typescript
defineField({
  name: 'honestFriction',
  title: 'Honest Friction (Transparency)',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      {
        name: 'issue',
        type: 'string',
        title: 'Friction Point',
        description: 'Known tradeoff or limitation',
        placeholder: 'Small twin bedroom',
        validation: (Rule) => Rule.required().max(100)
      },
      {
        name: 'context',
        type: 'text',
        title: 'Context / Mitigation',
        description: 'Explain the reality without apologizing excessively',
        placeholder: 'The twin room is compact—fine for kids or singles, tight for adults with luggage. Most guests use it for overflow sleeping rather than as a primary bedroom.',
        rows: 3,
        validation: (Rule) => Rule.required().max(400)
      }
    ],
    preview: {
      select: {
        title: 'issue',
        subtitle: 'context'
      },
      prepare({ title, subtitle }) {
        return {
          title,
          subtitle: subtitle ? subtitle.substring(0, 60) + '...' : ''
        }
      }
    }
  }],
  group: 'personality',
  description: `Known tradeoffs/limitations mentioned in reviews (3-5 max).

🟡 OPTIONAL: Builds trust through honesty, helps guests self-select.

✓ DO: "Small twin room - tight for adults with luggage but fine for kids"
✗ DON'T: Apologize excessively - just state facts + context

IMPORT: Extracted from review critiques in Enhanced Brief
- Look for repeated friction points (mentioned 2-3+ times)
- Include Pi's honest responses from reviews (e.g., Shorefield "a bit tired")
- Focus on genuine tradeoffs, not fixable issues`,

  validation: (Rule) => Rule.max(5).warning('Major tradeoffs only - be honest but not overwhelming')
})
```

**Import Source:**
- `PBI-NUANCE-BRIEF-ENHANCED.md` → Property Personalities → Honest Friction
- Review critiques (2+ mentions = pattern)
- Pi's responses to reviews (transparency examples)

**Examples:**
```json
// Portbahn
"honestFriction": [
  {
    "issue": "Small twin bedroom",
    "context": "The twin room is compact—barely room to open a bag, as a couple of reviews note. It's manageable for kids or singles, but tight for adults. Most guests use it for overflow sleeping rather than as a primary bedroom."
  },
  {
    "issue": "Front door entry logistics",
    "context": "The front door is locked; guests enter via the back conservatory. Clear instructions provided but can be momentarily confusing on arrival. Once inside, it's straightforward."
  },
  {
    "issue": "Island WiFi speed",
    "context": "WiFi works for streaming (Netflix/iPlayer) but isn't ultra-fast (rated 7.5/10 by Booking.com guests). Sufficient for emails and browsing, but not ideal for large file uploads or heavy video calls."
  }
]

// Shorefield
"honestFriction": [
  {
    "issue": "Property is 'a bit tired' (owner's words)",
    "context": "Shorefield isn't modern. Carpets are worn, furniture isn't new-build. As Pi says in responses: 'We make no bones about the tired condition...reflected in nightly price.' Guests who book Shorefield know this and value the quirky charm over polish. If you want modern, book Portbahn instead."
  },
  {
    "issue": "No dishwasher",
    "context": "Shorefield explicitly has no dishwasher (intentional, part of character). Pi steers dishwasher-needing guests to Portbahn. Guests who book Shorefield accept this tradeoff."
  },
  {
    "issue": "Low seating furniture",
    "context": "Some furniture is low to the ground (accessibility note for taller guests or those with joint issues). Mentioned by 2-3 guests but not a dealbreaker for most."
  },
  {
    "issue": "Small shower sizes",
    "context": "Showers are compact (mentioned 5 times in reviews). Functional but snug. Not unusual for traditional Scottish cottages."
  }
]

// Curlew (example - will populate after reviews available)
"honestFriction": [
  {
    "issue": "Separate stair access to one twin bedroom",
    "context": "One of the twin bedrooms has a quirky separate stair access (former farm steading layout). Adds character but may not suit guests with mobility concerns."
  }
]
```

---

### Field 6: Owner Context

```typescript
defineField({
  name: 'ownerContext',
  title: 'Owner Context (Optional)',
  type: 'text',
  rows: 4,
  group: 'personality',
  description: `Background about owners that shows in property personality.

🟡 OPTIONAL: Use ONLY if owner personality is visible in the property.

✓ DO: "Shorefield is the owners' own home. They are well-travelled bird watchers and painters. The house is full of their bird books, binoculars, sketches, and furniture collected from Africa and Asia."

✗ DON'T: Generic "lovingly maintained" language or use for properties with no owner personality visible

IMPORT: From Enhanced Brief if applicable
- Shorefield: YES (owner personality central to brand)
- Portbahn: NO (was your family home but personality is YOU, not separate owners)
- Curlew: TBD`,

  placeholder: 'Shorefield is the owners\' home. They are bird watchers and world travelers...',
  validation: (Rule) => Rule.max(500).warning('Keep concise - 2-3 sentences max')
})
```

**Import Source:**
- `PBI-NUANCE-BRIEF-ENHANCED.md` → Shorefield → Owner Context section
- Only populate if owner personality is core to property differentiation

**Examples:**
```json
// Shorefield (YES - owner personality visible)
"ownerContext": "Shorefield is the owners' own family home. They are well-travelled bird watchers and painters, and the house reflects their passions: bird books and binoculars by the windows, sketches and watercolours on the walls, furniture collected from Africa and Asia. Behind the house are bird hides, woodlands, and wetlands the owners created. The property runs on renewables (wind turbine + solar panels powering an Everhot stove). It's intentionally quirky and layered with real life."

// Portbahn (NO - leave blank)
// Owner personality = you (Pi/Lynton), not separate context needed

// Curlew (TBD - wait for guest reviews to see if owner context emerges)
```

---

## NEW FIELDS: REVIEWS GROUP

### Field 7: Review Scores

```typescript
defineField({
  name: 'reviewScores',
  title: 'Review Scores',
  type: 'object',
  group: 'reviews',
  description: `Aggregate review scores from major platforms.

🟢 HELPFUL: Trust signals for AI systems and social proof modules.

IMPORT: Manually entered from platform dashboards (or API if available)
- Update quarterly or when significant score changes occur
- Include badges (Guest Favourite, Superhost, Exceptional)`,

  options: {
    collapsible: true,
    collapsed: false
  },

  fields: [
    // Airbnb
    {
      name: 'airbnbScore',
      type: 'number',
      title: 'Airbnb Score (out of 5)',
      description: 'Overall rating from Airbnb',
      validation: (Rule) => Rule.min(0).max(5).precision(2)
    },
    {
      name: 'airbnbCount',
      type: 'number',
      title: 'Airbnb Review Count',
      validation: (Rule) => Rule.min(0).integer()
    },
    {
      name: 'airbnbBadges',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Airbnb Badges',
      description: 'e.g., "Guest Favourite", "Superhost"',
      options: {
        list: [
          { title: 'Guest Favourite', value: 'guest-favourite' },
          { title: 'Superhost', value: 'superhost' },
          { title: 'Top 10% of Eligible Listings', value: 'top-10-percent' }
        ]
      }
    },

    // Booking.com
    {
      name: 'bookingScore',
      type: 'number',
      title: 'Booking.com Score (out of 10)',
      description: 'Overall rating from Booking.com',
      validation: (Rule) => Rule.min(0).max(10).precision(1)
    },
    {
      name: 'bookingCount',
      type: 'number',
      title: 'Booking.com Review Count',
      validation: (Rule) => Rule.min(0).integer()
    },
    {
      name: 'bookingCategory',
      type: 'string',
      title: 'Booking.com Category',
      description: 'Category label (e.g., "Exceptional", "Superb")',
      options: {
        list: [
          { title: 'Exceptional (9+)', value: 'exceptional' },
          { title: 'Superb (8-8.9)', value: 'superb' },
          { title: 'Very Good (7-7.9)', value: 'very-good' },
          { title: 'Good (6-6.9)', value: 'good' }
        ]
      }
    },

    // Google
    {
      name: 'googleScore',
      type: 'number',
      title: 'Google Score (out of 5)',
      description: 'Overall rating from Google Business',
      validation: (Rule) => Rule.min(0).max(5).precision(1)
    },
    {
      name: 'googleCount',
      type: 'number',
      title: 'Google Review Count',
      validation: (Rule) => Rule.min(0).integer()
    }
  ]
})
```

**Import Source:**
- Platform dashboards (Airbnb, Booking.com, Google Business)
- `PB-Reviews-Working.md` → Quantitative Signals section
- `SHF-Reviews-Working.md` → Quantitative Signals section

**Examples:**
```json
// Portbahn
"reviewScores": {
  "airbnbScore": 4.97,
  "airbnbCount": 156,
  "airbnbBadges": ["guest-favourite", "top-10-percent"],
  "bookingScore": 9.5,
  "bookingCount": 33,
  "bookingCategory": "exceptional",
  "googleScore": 5.0,
  "googleCount": 37
}

// Shorefield
"reviewScores": {
  "airbnbScore": 4.97,
  "airbnbCount": 86,
  "airbnbBadges": ["guest-favourite", "top-10-percent"],
  "bookingScore": 9.2,
  "bookingCount": 57,
  "bookingCategory": "superb",
  "googleScore": 5.0,
  "googleCount": 13
}
```

---

### Field 8: Review Themes

```typescript
defineField({
  name: 'reviewThemes',
  title: 'Review Themes',
  type: 'array',
  of: [{ type: 'string' }],
  group: 'reviews',
  description: `Common themes across reviews (select 3-7).

🟢 HELPFUL: Shows what guests consistently value for AI extraction.

IMPORT: From review working files "Core Experience Pillars"
- Select themes that appear in 30%+ of reviews
- Map to predefined list for consistency`,

  options: {
    list: [
      { title: 'Home from home', value: 'home-from-home' },
      { title: 'Views & light', value: 'views-light' },
      { title: 'Host responsiveness (Pi/team)', value: 'host-responsive' },
      { title: 'Comfortable beds', value: 'comfortable-beds' },
      { title: 'Well-equipped kitchen', value: 'kitchen-equipped' },
      { title: 'Family-friendly', value: 'family-friendly' },
      { title: 'Dog-friendly', value: 'dog-friendly' },
      { title: 'Walk to distillery', value: 'walk-distillery' },
      { title: 'Peaceful/quiet', value: 'peaceful' },
      { title: 'Clean', value: 'clean' },
      { title: 'Warm/cosy', value: 'warm-cosy' },
      { title: 'Garden/outdoor space', value: 'garden' },
      { title: 'Character/quirky', value: 'character' },
      { title: 'Spacious', value: 'spacious' },
      { title: 'Ferry support', value: 'ferry-support' }
    ],
    layout: 'grid'
  },

  validation: (Rule) => Rule.min(3).max(7).warning('Select 3-7 themes for optimal clarity')
})
```

**Import Source:**
- `PB-Reviews-Working.md` → Core Experience Pillars
- `SHF-Reviews-Working.md` → Core Experience Pillars
- Theme frequency analysis (30%+ mentions)

**Examples:**
```json
// Portbahn
"reviewThemes": [
  "home-from-home",
  "views-light",
  "family-friendly",
  "walk-distillery",
  "host-responsive",
  "comfortable-beds",
  "garden"
]

// Shorefield
"reviewThemes": [
  "home-from-home",
  "character",
  "host-responsive",
  "spacious",
  "walk-distillery",
  "comfortable-beds",
  "warm-cosy"
]
```

---

### Field 9: Review Highlights

```typescript
defineField({
  name: 'reviewHighlights',
  title: 'Review Highlights (Curated Quotes)',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      {
        name: 'quote',
        type: 'text',
        title: 'Quote',
        description: 'Exact quote from review (keep under 200 chars for display)',
        rows: 3,
        validation: (Rule) => Rule.required().max(200).warning('Keep quotes under 200 chars for optimal display')
      },
      {
        name: 'source',
        type: 'string',
        title: 'Source',
        description: 'Platform and approximate date',
        placeholder: 'Airbnb guest, Dec 2024',
        validation: (Rule) => Rule.required().max(100)
      },
      {
        name: 'rating',
        type: 'number',
        title: 'Rating (Optional)',
        description: 'Star rating given with this review',
        validation: (Rule) => Rule.min(1).max(5).integer()
      }
    ],
    preview: {
      select: {
        title: 'quote',
        subtitle: 'source'
      },
      prepare({ title, subtitle }) {
        return {
          title: title ? (title.length > 60 ? title.substring(0, 60) + '...' : title) : 'No quote',
          subtitle
        }
      }
    }
  }],
  group: 'reviews',
  description: `Hand-picked quotes for social proof (5-8 recommended).

🟢 HELPFUL: Diverse, authentic guest voices for conversion + AI extraction.

✓ DO: Select quotes that show different aspects (views, host, kids, cosy)
✗ DON'T: Only pick superlatives - include specific details too

IMPORT: Curated from raw review files
- Mix platforms (Airbnb, Booking, Google)
- Mix themes (not all "stunning views" - show variety)
- Prioritize specificity over generic praise`,

  validation: (Rule) => Rule.min(5).max(8).warning('5-8 curated quotes optimal for display modules')
})
```

**Import Source:**
- Raw review files (Reviews_*.md)
- Select quotes that:
  - Show variety (views, host, family, cosy, location)
  - Are specific (not just "amazing!")
  - Represent different guest types
  - Mix platforms

**Examples:**
```json
// Portbahn (curated selection showing variety)
"reviewHighlights": [
  {
    "quote": "One of my favorite stays in all of Scotland. The sunrise from the king bedroom with coffee overlooking Loch Indaal is something I'll never forget.",
    "source": "Airbnb guest, Sept 2024",
    "rating": 5
  },
  {
    "quote": "Better than the pictures—guests say it every time. The kids loved the trampoline so much we couldn't get them inside for dinner.",
    "source": "Airbnb guest, Aug 2024",
    "rating": 5
  },
  {
    "quote": "Pi was legendary when CalMac cancelled our ferry. She helped us navigate rebooking and even offered flexible arrival. We felt looked after like family.",
    "source": "Booking.com guest, Oct 2024",
    "rating": 10
  },
  {
    "quote": "Walking home from Bruichladdich Distillery after a tour is perfect—10 minutes along the coast. No driving, no stress.",
    "source": "Google review, June 2024",
    "rating": 5
  },
  {
    "quote": "The house felt like home from the minute we stepped in. Open-plan living meant everyone could hang out together, and the views never got old.",
    "source": "Airbnb guest, May 2024",
    "rating": 5
  },
  {
    "quote": "Comfortable beds (Emma mattresses praised), warm underfloor heating, and space for three families to spread out without tripping over each other.",
    "source": "Booking.com guest, Dec 2024",
    "rating": 10
  }
]

// Shorefield (showing character + quirk + host)
"reviewHighlights": [
  {
    "quote": "Shorefield is like a big hug. Cosy, full of stories, and filled with the owners' bird books and paintings. It's not modern, but that's exactly what we loved.",
    "source": "Airbnb guest, Sept 2024",
    "rating": 5
  },
  {
    "quote": "Like visiting a favourite aunt's house—quirky, warm, and layered with personality. The wood stove and den made rainy days feel like a gift.",
    "source": "Booking.com guest, Nov 2024",
    "rating": 9
  },
  {
    "quote": "We watched birds every morning from the kitchen table by the sliding doors. The owners created bird hides and woodlands behind the house—nature lover's paradise.",
    "source": "Airbnb guest, May 2024",
    "rating": 5
  },
  {
    "quote": "Pi was honest about Shorefield being 'a bit tired,' but we loved the character. If you want modern, book Portbahn. If you want a real home, this is it.",
    "source": "Airbnb guest, Aug 2024",
    "rating": 5
  },
  {
    "quote": "The house has a story. Furniture from world travels, books on every surface, art everywhere. Not a carefully choreographed rental—it's a family home.",
    "source": "Google review, July 2024",
    "rating": 5
  }
]
```

---

### Field 10: Total Review Count

```typescript
defineField({
  name: 'totalReviewCount',
  title: 'Total Review Count (All Platforms)',
  type: 'number',
  group: 'reviews',
  description: `Sum of reviews across Airbnb, Booking.com, Google.

🟢 HELPFUL: "600+ guests say..." social proof copy.

IMPORT: Auto-calculated from reviewScores (airbnbCount + bookingCount + googleCount)
- Or manually entered if using other platforms (VRBO, etc.)`,

  validation: (Rule) => Rule.min(0).integer()
})
```

**Import Source:**
- Calculate: `airbnbCount + bookingCount + googleCount`
- Or manually sum if using additional platforms

**Examples:**
```json
// Portbahn
"totalReviewCount": 226  // 156 (Airbnb) + 33 (Booking) + 37 (Google)

// Shorefield
"totalReviewCount": 156  // 86 (Airbnb) + 57 (Booking) + 13 (Google)
```

---

## ENHANCED FIELDS: POLICIES GROUP

### Field 11-14: Licensing & Availability (Replace `licensingInfo`)

**Current field to replace:**
```typescript
// OLD (unstructured string)
licensingInfo: {
  type: 'string',
  title: 'Short Term Let License Info',
  group: 'policies'
}
```

**New structured fields:**

```typescript
// Field 11: Licensing Status
defineField({
  name: 'licensingStatus',
  title: 'Licensing Status',
  type: 'string',
  group: 'policies',
  description: `Short Term Let licensing status.

🟢 HELPFUL: Informs booking availability and page display logic.

IMPORT: Known facts per property
- Portbahn: "pending-bookable" (230916-000028)
- Shorefield: "pending-bookable" (230916-000017)
- Curlew: "pending-enquiries" (AR02532F)`,

  options: {
    list: [
      { title: 'Approved - Bookable', value: 'approved' },
      { title: 'Pending - Bookable', value: 'pending-bookable' },
      { title: 'Pending - Enquiries Only', value: 'pending-enquiries' },
      { title: 'Coming Soon', value: 'coming-soon' }
    ],
    layout: 'radio'
  },

  initialValue: 'approved',
  validation: (Rule) => Rule.required()
}),

// Field 12: License Number
defineField({
  name: 'licenseNumber',
  title: 'License Number',
  type: 'string',
  group: 'policies',
  description: `Short Term Let License reference number.

IMPORT: Known per property
- Portbahn: 230916-000028
- Shorefield: 230916-000017
- Curlew: AR02532F`,

  placeholder: '230916-000028',
  validation: (Rule) => Rule.required()
}),

// Field 13: License Notes
defineField({
  name: 'licenseNotes',
  title: 'License Notes (Optional)',
  type: 'text',
  rows: 2,
  group: 'policies',
  description: `Additional context about licensing status (optional).

Example: "Licence applied for 8 people sharing" or "Pending renewal, expected approval Feb 2026"`,

  placeholder: 'Licence applied for 8 people sharing',
  validation: (Rule) => Rule.max(300)
}),

// Field 14: Availability Status
defineField({
  name: 'availabilityStatus',
  title: 'Availability Status',
  type: 'string',
  group: 'policies',
  description: `Booking availability (separate from licensing).

🔴 CRITICAL: Controls booking CTA on frontend.

- "bookable" → Show "Check Availability" button → Lodgify booking flow
- "enquiries" → Show "Enquire" button → Contact form
- "coming-soon" → Show "Coming Soon" notice
- "unavailable" → Show "Currently Unavailable"

IMPORT: Per property
- Portbahn: "bookable"
- Shorefield: "bookable"
- Curlew: "enquiries" (until licensed)`,

  options: {
    list: [
      { title: 'Bookable Now', value: 'bookable' },
      { title: 'Enquiries Only', value: 'enquiries' },
      { title: 'Coming Soon', value: 'coming-soon' },
      { title: 'Temporarily Unavailable', value: 'unavailable' }
    ],
    layout: 'radio'
  },

  initialValue: 'bookable',
  validation: (Rule) => Rule.required()
})
```

**Import Source:**
- Known facts from Enhanced Brief
- Licensing status documented in property descriptions

**Examples:**
```json
// Portbahn
"licensingStatus": "pending-bookable",
"licenseNumber": "230916-000028",
"licenseNotes": "Licence applied for 8 people sharing. Property is bookable while pending approval.",
"availabilityStatus": "bookable"

// Shorefield
"licensingStatus": "pending-bookable",
"licenseNumber": "230916-000017",
"licenseNotes": "Licence applied for 6 people sharing. Property is bookable while pending approval.",
"availabilityStatus": "bookable"

// Curlew
"licensingStatus": "pending-enquiries",
"licenseNumber": "AR02532F",
"licenseNotes": "Licence applied for 6 people sharing. Taking enquiries for future bookings.",
"availabilityStatus": "enquiries"
```

---

## IMPLEMENTATION NOTES

### For Claude Code (Schema Implementation)

**File to update:**
```
/Users/lynton/dev/portbahn-islay/sanity/schemas/property.ts
```

**Steps:**
1. Add 2 new groups to `groups` array: `personality` and `reviews`
2. Add 6 personality fields in `personality` group (after existing `commonQuestions` field)
3. Add 4 review fields in new `reviews` group
4. Replace `licensingInfo` with 4 new licensing fields in `policies` group
5. Update imports if needed (no new imports required—all existing Sanity types)
6. Test schema in Sanity Studio (deploy and verify field rendering)

**Validation:**
- All new fields are optional (backwards compatible)
- Existing properties won't break (graceful degradation if fields empty)
- All validation rules are warnings, not errors (editor-friendly)

---

### For Content Generation (Claude Pro)

**Workflow:**
1. Export existing property data from Sanity (3 properties → JSON)
2. For each property, generate enhanced content:
   - Personality fields from Enhanced Brief + review working files
   - Review fields from review platform data
   - Licensing fields from known facts
3. Merge existing data + new data = complete property JSON
4. Import to Sanity
5. Editorial review (verify authenticity, polish voice)

**Token efficiency:**
- Generate 1 property at a time (review quality before batch)
- Or generate all 3 in parallel (faster, systematic)

---

## IMPORT MAPPING REFERENCE

### Source → Schema Field Map

| Field | Source | Import Method |
|-------|--------|---------------|
| `propertyNickname` | Enhanced Brief → Property Personalities | Copy directly |
| `guestSuperlatives` | Review working files → Language Bank + raw reviews | Extract top 5 repeated quotes |
| `magicMoments` | Enhanced Brief → Magic Moments section | Copy + add frequency from review analysis |
| `perfectFor` | Enhanced Brief → Perfect For section | Copy guest types + why + evidence |
| `honestFriction` | Enhanced Brief → Honest Friction section | Copy issue + context |
| `ownerContext` | Enhanced Brief → Owner Context (Shorefield only) | Copy directly |
| `reviewScores` | Review working files → Quantitative Signals | Manual entry from platform dashboards |
| `reviewThemes` | Review working files → Core Experience Pillars | Select 3-7 from predefined list |
| `reviewHighlights` | Raw review files → curated selection | Select 5-8 diverse quotes |
| `totalReviewCount` | Calculate from review counts | Sum: airbnb + booking + google |
| `licensingStatus` | Enhanced Brief → property-specific facts | Set per property (pending-bookable / pending-enquiries) |
| `licenseNumber` | Enhanced Brief → licensing section | Copy license reference number |
| `licenseNotes` | Enhanced Brief → licensing notes | Copy if additional context needed |
| `availabilityStatus` | Current booking status | Set: bookable (PB, SHF) / enquiries (Curlew) |

---

## VALIDATION CHECKLIST

Before deploying enhanced schema:

- [ ] All 14 new fields defined with correct types
- [ ] 2 new groups added (`personality`, `reviews`)
- [ ] All validation rules are warnings (not hard errors)
- [ ] Field descriptions include import hints
- [ ] Preview configurations set for array objects
- [ ] Licensing fields replace old `licensingInfo` string
- [ ] Test in Sanity Studio (fields render correctly)
- [ ] Existing data intact (no breaking changes)

---

## FRONTEND USAGE NOTES

### Component Queries (GROQ)

**Property page query (enhanced):**
```groq
*[_type == "property" && slug.current == $slug][0] {
  // Existing fields
  name,
  slug,
  sleeps,
  bedrooms,
  description,
  images,
  // ... all other existing fields

  // NEW personality fields
  propertyNickname,
  guestSuperlatives,
  magicMoments,
  perfectFor,
  honestFriction,
  ownerContext,

  // NEW review fields
  reviewScores,
  reviewThemes,
  reviewHighlights,
  totalReviewCount,

  // NEW licensing fields
  licensingStatus,
  licenseNumber,
  licenseNotes,
  availabilityStatus
}
```

**Property card query (listings page):**
```groq
*[_type == "property"] {
  name,
  slug,
  heroImage,
  sleeps,
  bedrooms,
  propertyNickname,  // NEW
  "topSuperlative": guestSuperlatives[0],  // NEW - first quote only
  "reviewScore": reviewScores.airbnbScore,  // NEW
  "reviewCount": totalReviewCount,  // NEW
  availabilityStatus  // NEW - for CTA logic
}
```

---

### Schema.org / JSON-LD Integration

**Add review data to existing Schema.org:**
```typescript
// Existing LodgingBusiness schema
{
  "@type": "LodgingBusiness",
  "name": property.name,
  // ... existing fields

  // ADD aggregate rating
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": property.reviewScores.airbnbScore,
    "reviewCount": property.totalReviewCount,
    "bestRating": 5
  },

  // ADD sample reviews
  "review": property.reviewHighlights.slice(0, 3).map(r => ({
    "@type": "Review",
    "reviewBody": r.quote,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": r.rating
    }
  }))
}
```

---

### Conditional Rendering Examples

**Booking CTA logic:**
```tsx
{property.availabilityStatus === 'bookable' && (
  <Button href={property.lodgifyBookingUrl}>
    Check Availability
  </Button>
)}

{property.availabilityStatus === 'enquiries' && (
  <Button href="/contact">
    Enquire About This Property
  </Button>
)}

{property.availabilityStatus === 'coming-soon' && (
  <Notice>Coming Soon - Sign up for updates</Notice>
)}
```

**Property nickname display:**
```tsx
{property.propertyNickname && (
  <Badge>{property.propertyNickname}</Badge>
)}
```

**Review social proof module:**
```tsx
<ReviewModule>
  <Score>{property.reviewScores.airbnbScore} / 5</Score>
  <Count>{property.totalReviewCount}+ guests say:</Count>
  <Theme>"Home from home"</Theme>
  <Highlights>
    {property.reviewHighlights.map(h => (
      <Quote key={h.quote}>
        "{h.quote}" - {h.source}
      </Quote>
    ))}
  </Highlights>
</ReviewModule>
```

---

## NEXT STEPS

### Immediate (Schema Implementation)
1. ✅ Claude Code: Implement enhanced schema in `property.ts`
2. ✅ Deploy to Sanity Studio
3. ✅ Test field rendering (no data yet, just structure)

### Next (Content Generation)
1. ✅ Export existing 3 properties from Sanity
2. ✅ Claude Pro: Generate enhanced content per property
3. ✅ Import to Sanity
4. ✅ Editorial review + polish

### Later (Frontend)
1. ⏳ Build components using new fields (Cursor)
2. ⏳ Implement Schema.org enhancements
3. ⏳ Test AI extraction (passage-level validation)

---

## APPENDIX: FULL FIELD LIST

### Enhanced Property Schema (Complete)

**Existing Fields (Unchanged):**
- name, slug, propertyType
- heroImage, images
- overviewIntro, description, idealFor, commonQuestions
- sleeps, bedrooms, beds, bathrooms, sleepingIntro, bedroomDetails, bathroomDetails
- facilitiesIntro, kitchenDining, kitchenDiningNotes, livingAreas, livingAreasNotes, heatingCooling, heatingCoolingNotes, entertainment, entertainmentNotes, laundryFacilities, safetyFeatures
- outdoorIntro, outdoorFeatures, outdoorFeaturesNotes, parkingInfo
- petFriendly, petPolicyIntro, petPolicyDetails
- locationIntro, location, nearbyAttractions, whatToDoNearby
- gettingHereIntro, postcode, latitude, longitude, directions, ferryInfo, airportDistance, portDistance
- policiesIntro, checkInTime, checkOutTime, minimumStay, cancellationPolicy, paymentTerms, securityDeposit
- includedIntro, included, notIncluded
- importantInfo
- dailyRate, weeklyRate
- lodgifyPropertyId, lodgifyRoomId, icsUrl
- googleBusinessUrl, googlePlaceId
- entityFraming (whatItIs, whatItIsNot, primaryDifferentiator)
- trustSignals (ownership, established, guestExperience, localCredentials)
- seoTitle, seoDescription

**New Fields (Added):**
1. propertyNickname (personality group)
2. guestSuperlatives (personality group)
3. magicMoments (personality group)
4. perfectFor (personality group)
5. honestFriction (personality group)
6. ownerContext (personality group)
7. reviewScores (reviews group)
8. reviewThemes (reviews group)
9. reviewHighlights (reviews group)
10. totalReviewCount (reviews group)
11. licensingStatus (policies group) - REPLACES licensingInfo
12. licenseNumber (policies group)
13. licenseNotes (policies group)
14. availabilityStatus (policies group)

**Total Fields:** ~90 (existing) + 14 (new) = ~104 fields

**Groups:** 15 (content, personality, reviews, details, location, policies, lodgify, ai-search, seo, + others)

---

**End of Enhanced Schema Specification**

---

## HANDOFF TO CLAUDE CODE

**File:** `/Users/lynton/dev/portbahn-islay/sanity/schemas/property.ts`

**Task:** Implement 14 new fields following this specification

**Key constraints:**
- All new fields optional (backwards compatible)
- Match existing code style (field descriptions, validation patterns)
- Test in Sanity Studio before committing

**Estimated time:** 1-2 hours (systematic implementation + testing)

**Handoff doc:** `SCHEMA-IMPLEMENTATION-HANDOFF.md` (to be created)
