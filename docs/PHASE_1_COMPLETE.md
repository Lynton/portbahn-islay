# Phase 1 Studio Enhancements - Complete ✅

## What Was Installed & Configured

### 1. Presentation Tool ✅
**Status:** Installed and configured
**Package:** `@sanity/presentation`
**What it does:** Live preview of content while editing in Studio

**Files created/modified:**
- `sanity.config.ts` - Added presentationTool plugin
- `app/api/draft/route.ts` - Draft mode API endpoint for previews

**How to use:**
1. Open Studio: `npm run sanity` → http://localhost:3333
2. Open a property document
3. Click "Presentation" tab in top menu
4. You'll see live preview side-by-side with editor
5. Changes update in real-time as you type

**Preview URLs configured for:**
- Properties: `/properties/[slug]`
- Beaches: `/beaches/[slug]`
- Distilleries: `/distilleries/[slug]`
- Walks: `/walks/[slug]`
- Villages: `/villages/[slug]`

---

### 2. Scheduled Publishing ✅
**Status:** Enabled (built into Sanity v5+)
**What it does:** Schedule content to publish at specific dates/times

**Files modified:**
- `sanity.config.ts` - Enabled `scheduledPublishing: { enabled: true }`

**How to use:**
1. Open any document in Studio
2. Click the "Publish" dropdown (next to Publish button)
3. Select "Schedule..."
4. Choose date and time for publication
5. Document will auto-publish at scheduled time

**Use cases:**
- Schedule Curlew Cottage launch for license approval date
- Time property updates with booking availability
- Coordinate seasonal content changes
- Launch new guide content on specific dates

---

### 3. Enhanced Validations ✅
**Status:** Added to property schema
**What it does:** Catches content errors before publish

**Files modified:**
- `sanity/schemas/collections/property.ts`

**Validations added:**

#### 3.1 Total Review Count Math Check
```
totalReviewCount must equal:
  airbnbCount + bookingCount + googleCount
```
**Error message:** "Total should be 226 (Airbnb: 156 + Booking: 33 + Google: 37)"

**Why:** Catches manual entry errors, ensures trust signals are accurate

---

#### 3.2 Review Themes Require Highlights
```
If reviewThemes.length > 0
  Then reviewHighlights.length must also be > 0
```
**Error message:** "Add review highlights to support selected themes"

**Why:** Prevents claiming themes without evidence, ensures content completeness

---

#### 3.3 License Number Format Validation
```
Format: YYMMDD-NNNNNN
Example: 230916-000028
Regex: /^\d{6}-\d{6}$/
```
**Error message:** "License number must be in format: YYMMDD-NNNNNN (e.g., 230916-000028)"

**Why:** Ensures consistent license number format, catches typos

---

## What You Need To Do (Manual Steps)

### Step 1: Test Presentation Tool (10 minutes)
1. Restart dev server if running: `npm run dev`
2. Open Studio: `npm run sanity` (or http://localhost:3333)
3. Open Portbahn House property
4. Click "Presentation" tab
5. Verify you see property page preview
6. Edit a field (e.g., change a review highlight)
7. Watch it update in real-time in preview

**If preview doesn't load:**
- Check that Next.js dev server is running on http://localhost:3000
- Check console for errors
- Verify `/api/draft/route.ts` was created
- Add `SANITY_PREVIEW_SECRET` to `.env.local` (any random string)

---

### Step 2: Set Image Hotspots (15 minutes)
**Why:** Ensures hero images maintain focal points across responsive sizes

1. Open each property in Studio (3 properties = 15 min)
2. Click the hero image field
3. Click "Edit" button on image
4. Click "Set hotspot" button
5. Click the focal point you want to preserve (e.g., Loch Indaal view, building feature)
6. Click "Select" to save
7. Repeat for all 3 properties

**Properties:**
- Portbahn House - Focus on sea view from conservatory
- Shorefield - Focus on character features
- Curlew Cottage - Focus on best angle

---

### Step 3: Test GROQ Queries in Vision Tool (30 minutes)
**Why:** Learn to query your content efficiently for frontend development

1. Open Vision tool: http://localhost:3333/vision
2. Try these queries:

**Query 1: Bookable properties with 200+ reviews**
```groq
*[_type == "property" && availabilityStatus == "bookable" && totalReviewCount > 200]{
  name,
  propertyNickname,
  totalReviewCount,
  reviewScores,
  slug
}
```

**Query 2: Properties by licensing status**
```groq
*[_type == "property" && licensingStatus == "approved"]{
  name,
  licenseNumber,
  availabilityStatus
}
```

**Query 3: Properties perfect for whisky enthusiasts**
```groq
*[_type == "property"]{
  name,
  "whiskyMatch": perfectFor[guestType match "*whisky*"]
}
```

**Query 4: Featured properties with review badges**
```groq
*[_type == "property" && "guest-favourite" in reviewScores.airbnbBadges]{
  name,
  propertyNickname,
  reviewScores.airbnbScore,
  reviewScores.airbnbBadges
}
```

3. Experiment with filtering, sorting, and projections
4. Save useful queries for frontend work

---

### Step 4: Test Validations (5 minutes)
1. Open Portbahn House in Studio
2. Go to "Reviews & Social Proof" group
3. Change `totalReviewCount` to wrong number (e.g., 100)
4. Try to publish → Should see validation error
5. Fix the number → Error should disappear
6. Test license number format:
   - Change to invalid format (e.g., "12345") → Error
   - Change back to valid (e.g., "230916-000028") → Error clears

---

### Step 5: Test Scheduled Publishing (5 minutes)
1. Open any property or guide in Studio
2. Make a small change (e.g., add a note to description)
3. Click "Publish" dropdown → Select "Schedule..."
4. Set date to tomorrow at 10:00 AM
5. Save the schedule
6. Check "Scheduled" tab in Studio sidebar to see pending publishes

---

## Environment Variables

Add to `.env.local` if not already present:

```bash
# For Presentation Tool preview security (optional but recommended)
SANITY_PREVIEW_SECRET=your-random-secret-here-make-it-long-and-random

# Should already have these:
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

---

## Troubleshooting

### Presentation preview shows 404
**Fix:**
- Ensure Next.js dev server is running (`npm run dev`)
- Verify property has valid slug
- Check that `/api/draft/route.ts` exists
- Add SANITY_PREVIEW_SECRET to .env.local

### Validations not appearing
**Fix:**
- Restart Sanity Studio (`npm run sanity`)
- Clear browser cache
- Check that property.ts schema was saved

### Scheduled publishing not visible
**Fix:**
- Check Sanity Studio version (`npm list sanity`) - should be 3.39.0+
- Restart Studio
- Check sanity.config.ts has `scheduledPublishing: { enabled: true }`

---

## What's Next

After completing the manual steps above, you can proceed with:

**Phase 2: Studio UX Enhancements** (see `SANITY_ENHANCEMENTS_ROADMAP.md`)
- Custom property preview cards
- Document actions (Preview Frontend, Open Lodgify, Copy URL)
- Enhanced field descriptions

**Estimated time for Phase 2:** 3-4 hours of autonomous work

---

## Success Criteria ✅

Phase 1 is complete when:
- [x] Presentation Tool installed and configured
- [x] Scheduled Publishing enabled
- [x] Enhanced validations added to schema
- [ ] You've tested Presentation Tool and see live previews
- [ ] Image hotspots set on all 3 property hero images
- [ ] You've run at least 2-3 GROQ queries in Vision tool
- [ ] Validations catch errors as expected
- [ ] You've scheduled at least one test publication

---

**Commit:** `51797fe` - feat: Phase 1 Studio enhancements
**Date:** 2026-01-22
**Session tokens used:** ~93k/200k (46%)
