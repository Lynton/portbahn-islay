# Handoff: Content Strategy → Page Implementation
**Date:** 2026-01-23 (Evening Session)
**From:** Sonnet session (content strategy & Curlew updates)
**To:** Next Sonnet session (page-by-page implementation)
**Project:** Portbahn Islay - AI Search Playbook Implementation

---

## What We Accomplished Today

### ✅ Session 1 Completed Tasks

1. **Working Sitemap Created** (`SITEMAP-WORKING.md`)
   - 11 MVP pages fully specified
   - FAQ distribution strategy mapped
   - Entity ownership documented
   - Schema requirements per page

2. **Curlew Cottage Content Updated** (In Live Sanity)
   - ✅ `description`: Rewrote first 3 paragraphs
     - "Converted stone steading" entity clarity
     - "Owner's retreat, first time letting" positioning
     - Superhost credentials prominent
     - Pet-free differentiator upfront
   - ✅ `reviewHighlights`: Added 4 host-focused reviews
     - Trust transfer from Portbahn House & Shorefield
     - Property references in source field
   - ✅ `ownerContext`: Already populated correctly (from yesterday)
   - ⚠️ `overviewIntro`: Kept original (one-sentence pattern)

3. **Trust Transfer Strategy Documented**
   - Review curation methodology
   - Frontend component spec (optional - not yet implemented)
   - "Some Reviews from Our Neighbouring Properties" framing

4. **Content Analysis Completed**
   - Before/after comparisons
   - Playbook compliance review
   - Implementation checklists

---

## Files Created (All in `_www_claude/_session-work/pbi-content-strategy-2026-01-23/`)

### Primary Reference Documents

| File | Size | Purpose |
|------|------|---------|
| **SESSION-README.md** | 3.2K | Session tracking & context |
| **SITEMAP-WORKING.md** | 18.3K | **CRITICAL** - Complete site structure, all 11 pages |
| **CURLEW-CONTENT-ANALYSIS.md** | 13K | Before/after, recommendations |
| **CURLEW-TRUST-TRANSFER-SPEC.md** | 13K | Full strategy document |
| **CURLEW-HOST-REVIEWS-SELECTION.md** | 11K | Review curation rationale |
| **CURLEW-CONTENT-UPDATE-REVISED.json** | 4.8K | Content updates (reference) |
| **CURSOR-PROMPT-CURLEW-SIMPLE.md** | 8.5K | Implementation guide (if frontend needed) |
| **HANDOFF-NEXT-SESSION.md** | This file | Next session prompt |

### Also Copied to `/dev/portbahn-islay/docs/`
- `CURSOR-PROMPT-CURLEW-SIMPLE.md`
- `CURLEW-CONTENT-UPDATE-REVISED.json`

---

## Current Site Status

### Pages in Sanity (From Live Export 2026-01-23)

**Properties:**
- ✅ Portbahn House - Complete, has reviews
- ✅ Shorefield - Complete, has reviews
- ✅ **Curlew Cottage** - **JUST UPDATED** - Trust transfer ready

**Singleton Pages:**
- Homepage
- About Page
- Getting Here Page
- Contact Page
- FAQ Page
- Islay Guides Index Page
- Beaches Hub Page
- Distilleries Hub Page
- Walks Hub Page
- Villages Hub Page
- Privacy Page
- Terms Page

---

## Next Session Priority Order

### 1. Review & Update Existing Guide/Info Pages

**Pages to Review:**
- Getting Here (`/getting-here`)
- Explore Islay / Islay Guides Index (`/explore` or `/guides`)
- About Us (`/about`)
- Contact (`/contact`)
- FAQs (`/faqs`)

**For Each Page, Check:**
- [ ] Current content in Sanity
- [ ] Compare to `OTHER-PAGES-PLAYBOOK-SPECS.md` (in `/dev/docs/`)
- [ ] Entity definition clear in first 200 words?
- [ ] Sections extractable as passages?
- [ ] FAQ distribution per `SITEMAP-WORKING.md`
- [ ] Schema requirements met?

**Reference Document:**
- `/dev/portbahn-islay/docs/OTHER-PAGES-PLAYBOOK-SPECS.md`
- `SITEMAP-WORKING.md` (Section: Page Specifications)

---

### 2. FAQ Plan - Which Pages Need Updating?

**Strategy from SITEMAP-WORKING.md:**

| FAQ Type | Destination | Status |
|----------|-------------|--------|
| Property-specific (3-5 each) | Property pages | ⚠️ Need to add |
| Travel Q&As | Getting Here page | ⚠️ Need to verify |
| Area Q&As | Explore Islay page | ⚠️ Need to verify |
| Booking/logistics (8-12) | Site-level /faqs page | ⚠️ Need to create/update |

**Action Items:**
- [ ] Review current FAQ page in Sanity
- [ ] Check which FAQs from `FAQ-RESEARCH.md` are missing
- [ ] Distribute contextual Q&As to relevant pages
- [ ] Update site-level FAQ page (booking/logistics only)

**Reference Documents:**
- `/dev/portbahn-islay/docs/FAQ-RESEARCH.md` (40+ FAQs compiled)
- `SITEMAP-WORKING.md` (Section: FAQ Distribution Summary)

---

### 3. BJR/Jura Cross-Promotion Page

**Page:** `/jura/` or `/visit-jura/`
**Status:** New page needed
**Purpose:** Multi-island holiday positioning + BJR cross-promotion

**Specification Needed:**
- Entity definition: "Multi-island Islay + Jura holiday"
- Why combine Islay + Jura (2-3 paragraphs)
- Getting to Jura from Islay (Port Askaig ferry)
- Bothán Jura Retreat summary + trust signals
- CTA: External link to bothanjura.co.uk

**Playbook Rationale:**
- Creates extractable passage for "multi-island Islay Jura holiday" queries
- Supports domain saturation across ecosystem
- "Go light on adjacent topics" - clear link to stronger authority

**Reference:**
- Original handoff: `/dev/portbahn-islay/docs/HANDOFF-SONNET-2026-01-23.md` (Lines 38-45)

---

### 4. Any Other Pages

**Compare Properties Page:**
- Status: Exists in Sanity
- Check if content matches spec in `SITEMAP-WORKING.md`

**Hub Pages (Post-MVP):**
- Beaches Hub
- Distilleries Hub
- Walks Hub
- Villages Hub

These are lower priority but check if they need basic content or can remain minimal for now.

---

## Key Resources for Next Session

### Must-Read Files

1. **`SITEMAP-WORKING.md`** ← Your Bible
   - All page specs
   - FAQ distribution
   - Content sources

2. **`FAQ-RESEARCH.md`** (in `/dev/docs/`)
   - 40+ FAQs organized by category
   - Section A: Property Questions
   - Section B: Travel & Logistics
   - Section C: Islay & Activities
   - Section D: Booking & Policies

3. **`OTHER-PAGES-PLAYBOOK-SPECS.md`** (in `/dev/docs/`)
   - Getting Here spec
   - Explore Islay spec
   - About Us spec
   - Contact spec

### Supporting Files

4. **`HANDOFF-SONNET-2026-01-23.md`** (in `/dev/docs/`)
   - Original strategic decisions from Opus
   - Context on all 4 priorities

5. **AI Search Playbook v1.3.1**
   - Available via skill: `@ai-search-playbook`
   - Core principles:
     - Passages over pages
     - Entity-first
     - Fixed spine, flexible skin
     - Recall before precision

---

## Data Sources Available

### Live Sanity Export
- Location: `/sessions/.../production-export-2026-01-23t14-41-16-159z/`
- File: `data.ndjson`
- All current page content as of 2026-01-23 14:41

### Property Data
- Portbahn House: `data/imports/portbahn-house-enhanced.json`
- Shorefield: `data/imports/shorefield-enhanced.json`
- Curlew Cottage: `data/imports/curlew-cottage-enhanced.json` (pre-update)

### Review Data
- Location: `/sessions/.../property_reviews/`
- Files:
  - `Reviews_AirBnB_PB.md` (58K)
  - `Reviews_AirBnB_SHF.md` (33K)
  - `Reviews_Bookingcom_PB.md` (15K)
  - `Reviews_Bookingcom_SHF.md` (27K)
  - `Reviews_Google_PB.md` (12K)
  - `Reviews_Google_SHF.md` (3.6K)

---

## Recommended Workflow for Next Session

### Phase 1: Audit Current State (30 mins)

```
For each existing page (Getting Here, Explore, About, Contact, FAQs):

1. Query live Sanity to get current content
2. Compare to spec in SITEMAP-WORKING.md
3. Note what's missing or needs updating
4. Create update checklist
```

**Tools:**
- Sanity Studio (localhost:3333)
- Or query via export: `grep '"_type":"[pageType]"' data.ndjson`

---

### Phase 2: FAQ Distribution (45 mins)

```
1. Read FAQ-RESEARCH.md Sections A-D
2. Open SITEMAP-WORKING.md FAQ Distribution Summary
3. For each FAQ:
   - Determine destination page
   - Draft answer (or verify existing)
   - Note if requires new content
4. Create implementation priority list
```

**Output:** FAQ distribution checklist by page

---

### Phase 3: Content Updates (60-90 mins)

```
Priority order:
1. Getting Here (travel is critical for Islay)
2. Site-level FAQs (booking logistics)
3. Explore Islay (area context)
4. About Us (trust building)
5. Contact (low complexity)
```

**For each page:**
- Draft updated content
- Follow Playbook patterns (entity-first, passage-extractable)
- Create Sanity update instructions

---

### Phase 4: BJR/Jura Page Spec (30 mins)

```
1. Review handoff rationale
2. Draft page structure
3. Write entity definition
4. Specify sections + word counts
5. Identify schema requirements
```

**Output:** Complete page specification ready for content creation

---

### Phase 5: Implementation Plan (15 mins)

```
Create master checklist:
- What needs Sanity updates
- What needs schema changes
- What needs frontend work
- What's ready for immediate implementation
```

---

## Important Notes

### Playbook Compliance Reminders

**Every page must:**
- [ ] Primary entity unambiguous in first 200 words
- [ ] Entity definition uses "is" statements, not "offers/provides"
- [ ] Sections answer one clear question each
- [ ] Sections can stand alone if extracted
- [ ] Headings descriptive and scoped
- [ ] No FAQPage schema (use question-format headings instead)

### Multi-Site Coordination

**PBI Role:** Secondary Authority
- Reference CalMac for ferry info
- Link to visitislay.com (DMO)
- Link to individual distillery sites
- "Go light" on adjacent topics

**Cross-Promotion:**
- BJR link in About Us + dedicated /jura/ page
- Maintain clear boundaries (Islay = PBI, Jura = BJR)

### Content Principles

1. **Fixed Spine (Facts):**
   - Ferry times, distances, property specs
   - Distillery locations, opening hours
   - Practical logistics

2. **Flexible Skin (Emotion):**
   - "Quiet retreat", "family-friendly"
   - Guest experiences, magic moments
   - Evocative descriptions

3. **Recall Before Precision:**
   - "Walking distance to Bruichladdich" > "750 meters"
   - "Pet-free for allergy sufferers" > "No animals permitted"

---

## Current Token Status

**This Session:** 119,775 / 200,000 (60% used, 40% remaining)

**For Next Session:**
- Start fresh with new thread
- Full context window available
- Reference documents all written

---

## Folder Structure Reference

```
_www_claude/
├── _session-work/
│   └── pbi-content-strategy-2026-01-23/    ← All today's work
│       ├── SESSION-README.md
│       ├── SITEMAP-WORKING.md              ← KEY
│       ├── CURLEW-* files
│       ├── CURSOR-PROMPT-CURLEW-SIMPLE.md
│       └── HANDOFF-NEXT-SESSION.md         ← You are here

portbahn-islay/                              ← Canonical /dev folder
├── docs/
│   ├── HANDOFF-SONNET-2026-01-23.md        ← Strategic decisions
│   ├── FAQ-RESEARCH.md                      ← 40+ FAQs
│   ├── OTHER-PAGES-PLAYBOOK-SPECS.md       ← Page specs
│   ├── CURSOR-PROMPT-CURLEW-SIMPLE.md      ← Copied from session
│   └── CURLEW-CONTENT-UPDATE-REVISED.json  ← Copied from session
├── data/
│   ├── imports/                             ← Property JSON files
│   └── exports/production-2026-01-23/       ← Fresh export available

property_reviews/                            ← Review source data
├── Reviews_AirBnB_PB.md
├── Reviews_AirBnB_SHF.md
└── [other review files]
```

---

## Session Handoff Checklist

- [x] Curlew Cottage content updated in Sanity
- [x] Working sitemap created with all 11 pages
- [x] Trust transfer strategy documented
- [x] Review data curated
- [x] Session files organized
- [x] Key files copied to /dev for easy access
- [x] Next session workflow defined
- [x] Handoff document complete

---

## Prompt for Next Session

```
I'm continuing the Portbahn Islay content strategy implementation.

Previous session completed:
- ✅ Working sitemap (11 MVP pages)
- ✅ Curlew Cottage content updated with trust transfer strategy
- ✅ Host review curation from Portbahn/Shorefield

Next priorities (in order):
1. Review & update existing guide/info pages (Getting Here, Explore, About, Contact, FAQs)
2. FAQ distribution plan - which pages need which Q&As
3. BJR/Jura cross-promotion page specification
4. Any other pages needing updates

Key reference:
- Read SITEMAP-WORKING.md in _www_claude/_session-work/pbi-content-strategy-2026-01-23/
- Read FAQ-RESEARCH.md in /dev/portbahn-islay/docs/
- Read OTHER-PAGES-PLAYBOOK-SPECS.md in /dev/portbahn-islay/docs/
- Read HANDOFF-NEXT-SESSION.md for full context

Please start by auditing the current state of the existing guide pages in Sanity
and comparing them to the specs in SITEMAP-WORKING.md. Let's work through them
systematically.
```

---

**Ready for next session!** 🚀

All context preserved, clear priorities defined, comprehensive handoff complete.
