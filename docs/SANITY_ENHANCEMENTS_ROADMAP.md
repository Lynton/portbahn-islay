# Sanity Studio Enhancement Roadmap

## Current Status ✅

**Already Configured:**
- ✅ Vision Tool (GROQ query playground) - `/studio/vision`
- ✅ Media Plugin (sanity-plugin-media) - Asset management with search/tags
- ✅ Custom Studio Structure - Well-organized sidebar with Pages/Guides/Settings
- ✅ Unsplash Integration - Free stock images for guides content

**Sanity Version:** 5.5.0 (Studio v3)

---

## Phase 1: Immediate Wins (1-2 hours)

### 1.1 Enable Presentation Tool ⭐⭐⭐⭐⭐
**Impact:** Very High | **Effort:** 1 hour

Live preview of properties while editing in Studio. See exactly how content will appear on the frontend.

**Installation:**
```bash
npm install @sanity/presentation
```

**Implementation Steps:**
1. Add presentation plugin to `sanity.config.ts`
2. Configure preview URL pattern: `/properties/[slug]`, `/beaches/[slug]`, etc.
3. Create custom preview components for each content type
4. Enable side-by-side editing view

**Benefits:**
- Catch content formatting issues instantly
- Preview personality fields in context
- Test review highlights appearance
- Compare properties side-by-side

**Priority:** Do this first after data import is complete

---

### 1.2 Configure Image Hotspots & Focal Points ⭐⭐⭐⭐⭐
**Impact:** Very High | **Effort:** 30 minutes

Ensure hero images maintain focal points (sea views, building features) across responsive sizes.

**Implementation Steps:**
1. Already available in schema (Sanity image type includes hotspot)
2. Go to each property in Studio
3. Click hero image → "Edit" → Set hotspot on focal point
4. Test responsive crops in presentation view

**Benefits:**
- Loch Indaal views stay centered on mobile
- Property features don't get cropped out
- Professional image presentation across devices
- Automatic responsive image optimization

**Priority:** Do immediately (5 min per property)

---

### 1.3 Test GROQ Queries in Vision Tool ⭐⭐⭐⭐
**Impact:** High for development | **Effort:** 30 minutes

Learn to query your content efficiently. Already installed!

**Access:** `http://localhost:3333/vision` (standalone) or `http://localhost:3000/studio/vision` (embedded)

**Example Queries to Test:**
```groq
// Get all bookable properties with 200+ reviews
*[_type == "property" && availabilityStatus == "bookable" && totalReviewCount > 200]{
  name,
  propertyNickname,
  totalReviewCount,
  reviewScores,
  slug
}

// Get properties by licensing status
*[_type == "property" && licensingStatus == "approved"]{
  name,
  licenseNumber,
  availabilityStatus
}

// Properties perfect for whisky enthusiasts
*[_type == "property"]{
  name,
  "whiskyMatch": perfectFor[guestType match "*whisky*"]
}

// Get homepage featured properties with review badges
*[_type == "property" && "guest-favourite" in reviewScores.airbnbBadges]{
  name,
  propertyNickname,
  reviewScores.airbnbScore,
  reviewScores.airbnbBadges
}
```

**Benefits:**
- Debug frontend queries
- Build dynamic homepage displays
- Filter properties for comparison pages
- Understand your data structure

**Priority:** Learn this now, use throughout development

---

## Phase 2: Studio UX Enhancements (1 day)

### 2.1 Custom Property Preview Card ⭐⭐⭐⭐⭐
**Impact:** Very High | **Effort:** 2-3 hours

Replace default property list view with custom cards showing key info at a glance.

**Implementation:**
Create `sanity/components/PropertyPreview.tsx`:
```tsx
// Show in property list:
- Hero image
- Property nickname + name
- Review scores (Airbnb ⭐ 4.97 | Booking 9.5)
- Licensing status badge (✅ Approved | ⏳ Pending)
- Availability status (🟢 Bookable | 🟡 Enquiries)
- Total review count
```

**Benefits:**
- See property status at a glance
- No need to open each property to check reviews
- Visual licensing indicators
- Professional Studio experience

**Files to create:**
- `sanity/components/PropertyPreview.tsx`
- `sanity/components/LicenseStatusBadge.tsx`
- Update `sanity.config.ts` to use custom preview

---

### 2.2 Custom Document Actions ⭐⭐⭐⭐
**Impact:** High | **Effort:** 2-3 hours

Add helpful action buttons to property editor.

**Actions to Add:**

1. **"Preview on Frontend"** - Opens property page in new tab
2. **"View in Lodgify"** - Opens property in Lodgify dashboard
3. **"Copy Property URL"** - Copies public URL to clipboard
4. **"Export for Review"** - Downloads property JSON for partner review

**Implementation:**
Create `sanity/actions/` folder with custom actions:
- `PreviewAction.tsx`
- `OpenLodgifyAction.tsx`
- `CopyUrlAction.tsx`

Update `sanity.config.ts`:
```ts
import { previewAction, openLodgifyAction, copyUrlAction } from './sanity/actions'

document: {
  actions: (prev, { schemaType }) => {
    if (schemaType === 'property') {
      return [...prev, previewAction, openLodgifyAction, copyUrlAction]
    }
    return prev
  }
}
```

---

### 2.3 Enhanced Validation Rules ⭐⭐⭐⭐
**Impact:** High | **Effort:** 1 hour

Add helpful validations to catch content issues before publish.

**Validations to Add:**

```ts
// In property schema:

// Ensure review counts match
totalReviewCount: {
  validation: Rule => Rule.custom((total, context) => {
    const scores = context.document.reviewScores
    const sum = (scores?.airbnbCount || 0) +
                (scores?.bookingCount || 0) +
                (scores?.googleCount || 0)

    if (total !== sum) {
      return `Total should be ${sum} (${scores?.airbnbCount || 0} Airbnb + ${scores?.bookingCount || 0} Booking + ${scores?.googleCount || 0} Google)`
    }
    return true
  })
}

// Require review evidence if reviewThemes selected
reviewThemes: {
  validation: Rule => Rule.custom((themes, context) => {
    const highlights = context.document.reviewHighlights
    if (themes?.length > 0 && (!highlights || highlights.length === 0)) {
      return 'Add review highlights to support selected themes'
    }
    return true
  })
}

// Ensure license number format
licenseNumber: {
  validation: Rule => Rule.regex(/^\d{6}-\d{6}$/).error('Format: 230916-000028')
}
```

**Benefits:**
- Catch data inconsistencies
- Helpful inline error messages
- Prevent incomplete publishes
- Guide content entry

---

### 2.4 Field Descriptions & Help Text ⭐⭐⭐⭐
**Impact:** High for partner editing | **Effort:** 1 hour

Review all field descriptions and add helpful context. Make Studio self-documenting.

**Areas to Enhance:**
- Personality fields: Add examples from Portbahn House
- Review fields: Explain how to calculate scores
- Licensing: Clarify status transitions
- Entity framing: Examples of good vs bad differentiators

**Example Enhancement:**
```ts
// BEFORE
propertyNickname: {
  title: 'Property Nickname',
  type: 'string',
}

// AFTER
propertyNickname: {
  title: 'Property Nickname',
  type: 'string',
  description: 'Internal nickname capturing property personality',
  placeholder: 'e.g., "The View House", "The Character House"',
  validation: Rule => Rule.max(50).warning('Keep under 50 characters for consistency')
}
```

---

## Phase 3: Advanced Features (2-3 days)

### 3.1 Scheduled Publishing ⭐⭐⭐⭐
**Impact:** High | **Effort:** 30 minutes

Schedule content to go live at specific times.

**Installation:**
```bash
npm install @sanity/scheduled-publishing
```

**Use Cases:**
- Schedule Curlew Cottage launch when license approved
- Time property updates with booking availability changes
- Seasonal description swaps (winter vs summer)
- Coordinate with marketing campaigns

**Configuration:**
```ts
// sanity.config.ts
import { scheduledPublishing } from '@sanity/scheduled-publishing'

plugins: [
  scheduledPublishing({
    tool: true,
    types: ['property', 'beach', 'distillery', 'walk', 'village']
  })
]
```

---

### 3.2 Sanity AI Assist (Experimental) ⭐⭐⭐
**Impact:** Medium | **Effort:** 1 hour

AI-powered content suggestions in Studio.

**Installation:**
```bash
npm install @sanity/assist
```

**Potential Uses:**
- Generate SEO descriptions from property content
- Suggest review themes from highlights
- Draft social media snippets
- Alternative headline options

**Note:** You've already done comprehensive review analysis, so this might be redundant. Try it and see if it adds value.

---

### 3.3 Custom Input Components ⭐⭐⭐⭐
**Impact:** Medium-High | **Effort:** 3-4 hours

Create specialized field inputs for better UX.

**Components to Build:**

1. **Review Score Gauge** - Visual review score display (4.97/5.0 ⭐⭐⭐⭐⭐)
2. **License Status Indicator** - Traffic light system (🟢 🟡 🔴)
3. **Magic Moments Counter** - Show frequency as you type
4. **Perfect For Badge Builder** - Visual guest type selector

**Example:**
```tsx
// sanity/components/ReviewScoreGauge.tsx
import { NumberInput } from 'sanity'

export function ReviewScoreGauge(props) {
  const { value } = props
  const stars = '⭐'.repeat(Math.round(value))
  const color = value >= 4.9 ? 'green' : value >= 4.5 ? 'orange' : 'red'

  return (
    <div>
      <NumberInput {...props} />
      <div style={{ color, fontSize: '1.5em' }}>
        {stars} {value?.toFixed(2)}
      </div>
    </div>
  )
}
```

---

### 3.4 Workflow / Content Approval (Team Plan) ⭐⭐⭐
**Impact:** Medium | **Effort:** 1 hour if on Team plan

Set up review workflow for multi-editor scenarios.

**Use Cases:**
- Partner reviews property changes before publish
- Approval required for review highlights
- Track who changed licensing status

**Note:** Only available on Sanity Team plan ($99/mo). Skip if solo editing.

---

## Phase 4: Optional / Future

### 4.1 Localization Plugin ⭐⭐
**Impact:** Low (niche) | **Effort:** 2-3 hours

Add Gaelic translations for authentic Scottish touch.

**Installation:**
```bash
npm install @sanity/document-internationalization
```

**Potential Use:**
- Gaelic property names (e.g., "Taigh Phortbahn")
- French/German for European whisky tourists
- Bilingual guide content

**Priority:** Only if brand strategy calls for it

---

### 4.2 Sanity Connect / Canvas ⚠️ SKIP
**Why:** Overkill for entity-focused content. You're not building marketing landing pages.

---

### 4.3 Custom Dashboard Widgets ⭐⭐⭐
**Impact:** Medium | **Effort:** 2-3 hours

Create dashboard showing property stats at a glance.

**Widgets:**
- Total review count across properties
- Average review scores
- Licensing status overview
- Recent property updates

**Implementation:**
```ts
// sanity.config.ts
import { dashboardTool } from '@sanity/dashboard'

plugins: [
  dashboardTool({
    widgets: [
      { name: 'project-info' },
      // Custom widgets here
    ]
  })
]
```

---

## Recommended Implementation Timeline

### Week 1: Quick Wins
- ✅ Day 1-2: Complete data import and verify
- 🎯 Day 3: Presentation Tool setup (1 hour)
- 🎯 Day 3: Configure image hotspots (30 min)
- 🎯 Day 3: Test GROQ queries in Vision (30 min)

### Week 2: Studio UX
- Day 1: Custom property preview card
- Day 2: Custom document actions
- Day 3: Enhanced validations + field descriptions

### Week 3: Advanced Features
- Day 1: Scheduled publishing setup
- Day 2-3: Custom input components (if desired)
- Day 3: Test AI Assist (evaluate usefulness)

---

## Installation Commands (Copy-Paste Ready)

```bash
# Phase 1: Immediate
npm install @sanity/presentation

# Phase 3: Advanced
npm install @sanity/scheduled-publishing
npm install @sanity/assist  # Optional - test first

# Phase 4: Future
npm install @sanity/document-internationalization  # Only if doing localization
npm install @sanity/dashboard  # Only if wanting custom dashboard
```

---

## Success Metrics

**After Phase 1:**
- [ ] Can preview properties live while editing
- [ ] Image focal points set on all hero images
- [ ] Can write GROQ queries to filter properties

**After Phase 2:**
- [ ] Property list shows review scores and status at a glance
- [ ] Custom actions streamline workflow
- [ ] Validations catch content issues before publish
- [ ] Partner can edit confidently with helpful descriptions

**After Phase 3:**
- [ ] Curlew launch scheduled for license approval date
- [ ] Custom inputs make editing more intuitive
- [ ] AI Assist evaluated (keep or remove)

---

## Notes

- All features respect the "entity-focused, not page-focused" content model
- Prioritizes developer experience and partner editing comfort
- Avoids complexity for complexity's sake
- Each enhancement has clear ROI for a 3-property site

---

**Next Step:** Start with Phase 1 after verifying data import is complete and Studio shows no unknown fields.
