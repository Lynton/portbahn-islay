# Vercel Baseline Status - 2026-01-25
**Verified:** 2026-01-25 by Claude (Cowork session)
**Site:** https://portbahn-islay.vercel.app
**Deployment:** `dpl_2ZMkgfi42TCPYyz1ukkJdSevH3Ru` (READY)

---

## Executive Summary

The current Vercel deployment has **property pages largely complete** with key schema fields rendering correctly. The main gaps are:
1. Guide pages (Getting Here, Explore Islay) return 404
2. Several content enhancements from implementation brief not yet applied
3. FAQ/commonQuestions sections not visible on property pages

---

## Homepage Status

**URL:** https://portbahn-islay.vercel.app/

| Element | Status | Notes |
|---------|--------|-------|
| Title/Meta | ✅ Working | "Portbahn Islay \| Holiday Homes Bruichladdich, Isle of Islay" |
| Hero section | ✅ Working | Image loads |
| Property cards | ✅ Working | All 3 properties displaying |
| Curlew "Coming Soon" | ✅ Fixed | No longer shows Coming Soon |
| Intro content | ✅ Present | Basic intro about 3 properties |
| Getting Here section | ✅ Present | Inline content (not separate page) |
| Pi & Lynton intro | ❌ Missing | From V2-FINAL not yet implemented |
| Trust signals section | ❌ Missing | "Our Track Record" not yet added |
| Comparison table | ❌ Missing | Nice-to-have from brief |

---

## Property Pages Status

### Portbahn House
**URL:** https://portbahn-islay.vercel.app/accommodation/portbahn-house

| Component | Status | Details |
|-----------|--------|---------|
| Title/Meta | ✅ | "Portbahn House \| Family Whisky Retreat, Isle of Islay" |
| Basic info | ✅ | HOUSE, Bruichladdich, Sleeps 8, 3 bed, 4 bath |
| Trust signals header | ✅ | "Welcoming guests since 2017 • Family-owned" |
| Platform badges | ✅ | AirBnB Superhost, Guest Favourite 4.97, 5★ Google |
| Ideal For | ✅ | Families, Whisky enthusiasts, Dog owners, Groups |
| Magic Moments | ✅ | 4 moments with review counts (30+, 50+, 25+, 20+) |
| Perfect For | ✅ | 4 guest profiles with descriptions |
| Honest Friction | ✅ | "Things to Know" with 4 items |
| Review Scores | ✅ | Airbnb 5.0/5 (156), Booking.com 9.5/10 (33), Google 5.0/5 (37) |
| What Guests Love | ✅ | 7 superlative tags |
| Review Highlights | ✅ | 4 quotes with sources/ratings |
| Google Reviews carousel | ✅ | Working |
| Location/Directions | ✅ | Present |
| House Rules | ✅ | Check-in 16:00, Check-out 10:00 |
| Cancellation Policy | ✅ | Full policy displayed |
| **commonQuestions/FAQ** | ❌ Missing | Not rendering on page |
| **whatsIncluded** | ❌ Missing | Schema field not populated |
| **STL License** | ❌ Missing | AR01981F not displayed |

### Shorefield Eco House
**URL:** https://portbahn-islay.vercel.app/accommodation/shorefield-eco-house

| Component | Status | Details |
|-----------|--------|---------|
| Title/Meta | ✅ | "Shorefield Eco-House \| Bird Reserve & Nature Walks, Isle of Islay" |
| Basic info | ✅ | HOUSE, Bruichladdich, Sleeps 6, 3 bed, 2 bath |
| Ideal For | ✅ | Present |
| Magic Moments | ✅ | 4 moments with review counts (10+, 15+, 8+, 12+) |
| Perfect For | ✅ | Nature lovers and bird watchers profile |
| Honest Friction | ✅ | "No dishwasher", "House is quirky", "Woodland muddy", "Worn carpets" |
| About the Property | ✅ | Jacksons' story present |
| Review Scores | ✅ | Airbnb 5.0/5 (86), Booking.com 9.2/10 (57), Google 5.0/5 (13) |
| What Guests Love | ✅ | 7 tags including "Dog Friendly" |
| Review Highlights | ✅ | Quotes present |
| **commonQuestions/FAQ** | ❌ Missing | Not rendering |
| **whatsIncluded** | ❌ Missing | Not populated |
| **STL License** | ❌ Missing | AR02246F not displayed |

### Curlew Cottage
**URL:** https://portbahn-islay.vercel.app/accommodation/curlew-cottage

| Component | Status | Details |
|-----------|--------|---------|
| Title/Meta | ✅ | "Curlew Cottage \| Safe Family Holiday Home Bruichladdich, Isle Islay" |
| Basic info | ✅ | COTTAGE, Bruichladdich, Sleeps 6, 3 bed, 2 bath |
| Ideal For | ✅ | Families with children, Pet allergies, Couples, Groups |
| Trust Transfer | ✅ Working | "Some Reviews from Our Neighbouring Properties" section renders |
| Sister property reviews | ✅ | 4 reviews from Portbahn + Shorefield with links |
| What Guests Love | ✅ | Tags transferred from sister properties |
| Review Highlights | ✅ | Quotes from sister properties |
| Review Scores | ✅ | Shows "0" (correct for new listing) |
| About the Property | ✅ | "Family-owned cottage...opened up to visitors for first time in 2026" |
| What's Nearby | ✅ | Bruichladdich Distillery, Port Charlotte, Port Mor |
| House Rules | ✅ | Check-in 16:00, Check-out 10:00, Min 2 nights |
| Payment/Cancellation | ✅ | Full policies displayed |
| Pet policy | ✅ | "No pets, including dogs and cats" + allergy-friendly |
| **commonQuestions/FAQ** | ❌ Missing | Not rendering |
| **whatsIncluded** | ❌ Missing | Not populated |
| **STL License** | ❌ Missing | AR02532F not displayed |

---

## Guide Pages Status

| Page | URL Tested | Status |
|------|------------|--------|
| Getting Here | /getting-here | ❌ 404 |
| Explore Islay | /explore-islay | ❌ 404 |
| FAQ Aggregation | /faq | Not tested |

**Note:** Getting Here content exists inline on homepage, but dedicated page doesn't exist.

---

## Schema Fields Verified Rendering

These custom schema fields ARE rendering correctly on property pages:

| Field | Portbahn | Shorefield | Curlew |
|-------|----------|------------|--------|
| `magicMoments` | ✅ | ✅ | ✅ (trust transfer) |
| `perfectFor` | ✅ | ✅ | ✅ |
| `honestFriction` | ✅ | ✅ | N/A |
| `reviewScores` | ✅ | ✅ | ✅ (shows 0) |
| `guestSuperlatives` | ✅ | ✅ | ✅ (transferred) |
| `reviewHighlights` | ✅ | ✅ | ✅ (transferred) |
| `hostTrustTransfer` | N/A | N/A | ✅ |

---

## Implementation Brief Gaps

### Phase 1: Schema Updates (from FINAL-IMPLEMENTATION-BRIEF-10-10.md)
- [ ] `whatsIncluded` field - not rendering
- [ ] `faqCrossLinks` field - not present
- [ ] `stlLicenseNumber` field - not displaying
- [ ] `commonQuestions` validation enhancement (600 char)
- [ ] `faqPage` singleton aggregation model

### Phase 2: Property Content
- [ ] Portbahn: 5 FAQs + whatsIncluded
- [ ] Shorefield: 5 FAQs + whatsIncluded
- [ ] Curlew: 5 FAQs + whatsIncluded
- [ ] All: Review stats verification

### Phase 3: Guide Pages
- [ ] Getting Here: Create page from V2-FINAL
- [ ] Explore Islay: Create page from V2-FINAL
- [ ] Homepage: Add comparison table + seasonal guidance

### Phase 4: FAQ Aggregation
- [ ] faqPage schema update
- [ ] GROQ query implementation
- [ ] Aggregation component build

### Phase 5: Technical Verification
- [ ] robots.txt AI bot check
- [ ] Sitemap verification
- [ ] Schema validation (no FAQPage)
- [ ] Canonical tags

---

## Recommended Priority for Claude Code

1. **HIGH:** Create guide pages (Getting Here, Explore Islay) - currently 404
2. **HIGH:** Add commonQuestions to property pages
3. **MEDIUM:** Add whatsIncluded schema field and populate
4. **MEDIUM:** Add STL license numbers
5. **MEDIUM:** Homepage enhancements (comparison table, trust signals)
6. **LOW:** FAQ aggregation page

---

## Files Reference

**Content ready for implementation:**
- `GETTING-HERE-PAGE-V2-FINAL.md`
- `EXPLORE-ISLAY-PAGE-V2-FINAL.md`
- `HOMEPAGE-V2-FINAL.md`
- `PROPERTY-FAQ-DISTRIBUTION-FINAL.md`
- `FINAL-IMPLEMENTATION-BRIEF-10-10.md` (master reference)

**All in:** `_session-work/pbi-content-strategy-2026-01-23/`

---

**Status:** Baseline verified, ready for Claude Code implementation
