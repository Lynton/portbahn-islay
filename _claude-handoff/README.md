# Claude Code Handoff - Portbahn Islay Content Upgrade
**Created:** 2026-01-25
**Task:** Implement 10/10 playbook-compliant content across all pages
**Vercel:** https://portbahn-islay.vercel.app

---

## QUICK START

### Step 1: Understand Current State
Read `VERCEL-BASELINE-STATUS-2026-01-25.md` first.

**Summary of what's live:**
- ✅ All 3 property pages rendering with schema fields (magicMoments, reviewScores, honestFriction, etc.)
- ✅ Trust transfer working on Curlew (shows sister property reviews)
- ✅ Curlew no longer shows "Coming Soon"
- ❌ Guide pages return 404 (/getting-here, /explore-islay)
- ❌ commonQuestions/FAQ sections not rendering on property pages
- ❌ whatsIncluded, STL licenses not displaying

### Step 2: Review Technical Requirements
Read `FINAL-IMPLEMENTATION-BRIEF-10-10.md` for:
- Schema field definitions (whatsIncluded, faqCrossLinks, stlLicenseNumber, reviewStats)
- Keyword integration checklist
- Technical pre-launch checklist
- Enhanced local content (Bruichladdich B Corp story, whisky bars, seafood)

### Step 3: Implement Content
Use these content files:
- `GETTING-HERE-PAGE-V2-FINAL.md` → Create /getting-here page
- `EXPLORE-ISLAY-PAGE-V2-FINAL.md` → Create /explore-islay page
- `HOMEPAGE-V2-FINAL.md` → Enhance homepage
- `PROPERTY-FAQ-DISTRIBUTION-FINAL.md` → Add FAQs to all 3 properties

---

## FILES IN THIS FOLDER

| File | Purpose | Priority |
|------|---------|----------|
| `VERCEL-BASELINE-STATUS-2026-01-25.md` | Current live state verification | READ FIRST |
| `FINAL-IMPLEMENTATION-BRIEF-10-10.md` | Complete technical spec (28KB) | READ SECOND |
| `CLAUDE-CODE-IMPLEMENTATION-BRIEF.md` | Step-by-step guide | Reference |
| `GETTING-HERE-PAGE-V2-FINAL.md` | Full page content | Implement |
| `EXPLORE-ISLAY-PAGE-V2-FINAL.md` | Full page content | Implement |
| `HOMEPAGE-V2-FINAL.md` | Homepage enhancements | Implement |
| `PROPERTY-FAQ-DISTRIBUTION-FINAL.md` | FAQ content × 3 properties | Implement |
| `PORTBAHN-TONE-OF-VOICE-SKILL.md` | Voice/tone reference | Reference |
| `FAQ-STRATEGY-DECISION-SUMMARY.md` | Why FAQs are structured this way | Reference |
| `PLAYBOOK-COMPLIANCE-ANALYSIS.md` | Playbook v1.3.1 requirements | Reference |

---

## IMPLEMENTATION PRIORITY

### HIGH PRIORITY (Guide Pages 404)
1. Create `/getting-here` page from `GETTING-HERE-PAGE-V2-FINAL.md`
2. Create `/explore-islay` page from `EXPLORE-ISLAY-PAGE-V2-FINAL.md`

### MEDIUM PRIORITY (Property Enhancements)
3. Add `commonQuestions` array to each property (5 FAQs each)
   - Content in `PROPERTY-FAQ-DISTRIBUTION-FINAL.md`
4. Add `whatsIncluded` schema field and populate
   - Definition in `FINAL-IMPLEMENTATION-BRIEF-10-10.md` Section 1
5. Add `stlLicenseNumber` to properties:
   - Portbahn House: AR01981F
   - Shorefield: AR02246F
   - Curlew Cottage: AR02532F

### LOWER PRIORITY (Nice-to-Have)
6. Homepage comparison table
7. Seasonal booking guidance
8. FAQ aggregation page

---

## KEY CONSTRAINTS

- **GitHub schema is canonical** - don't duplicate from temp_intake
- **NO FAQPage schema anywhere** - per playbook v1.3.1
- **Pi's first-person voice throughout** - see PORTBAHN-TONE-OF-VOICE-SKILL.md
- **Curlew is LIVE** - all "Coming Soon" already removed
- **H3 for FAQ questions** - not "Q:" format, just plain headings

---

## VERIFICATION CHECKLIST

After implementation, verify:
- [ ] /getting-here loads (not 404)
- [ ] /explore-islay loads (not 404)
- [ ] Property pages show "Common Questions" section
- [ ] Anchor links work: /accommodation/portbahn-house#common-questions
- [ ] No FAQPage schema in source
- [ ] STL license numbers display on property pages
- [ ] robots.txt allows AI bots (GPTBot, ClaudeBot, PerplexityBot)

---

## QUESTIONS?

- Voice/tone → `PORTBAHN-TONE-OF-VOICE-SKILL.md`
- FAQ strategy → `FAQ-STRATEGY-DECISION-SUMMARY.md`
- Playbook compliance → `PLAYBOOK-COMPLIANCE-ANALYSIS.md`
- Full technical spec → `FINAL-IMPLEMENTATION-BRIEF-10-10.md`
