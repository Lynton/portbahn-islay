# Handoff: PBI Content Strategy → Implementation

**Date:** 2026-01-23
**From:** Opus session (strategic decisions)
**To:** Sonnet session (implementation)
**Playbook:** AI Search Playbook v1.3.1

---

## Context

This session resolved strategic decisions from the previous Claude Code handoff and established the content approach for Portbahn Islay site optimization.

**Key documents read:**
- `docs/HANDOFF-COWORK-2026-01-23.md` — Previous session context
- `docs/FAQ-RESEARCH.md` — 40+ FAQs compiled from reviews + research
- `docs/OTHER-PAGES-PLAYBOOK-SPECS.md` — Page specs for all non-property pages
- AI Search Playbook v1.3.1 (skill file)
- `data/imports/curlew-cottage-enhanced.json` — Current Curlew data

**Folders available:**
- `/portbahn-islay/` — Main dev project (Sanity + Next.js)
- `/_www_claude/` — Strategy docs, research, toolkit (mount may need retry)

---

## Strategic Decisions Made

### 1. BJR Cross-Promotion ✅ DECIDED

**Decision:** Create dedicated page on PBI site + keep main nav + footer links

**Rationale (Playbook-aligned):**
- Creates extractable passage for "multi-island Islay Jura holiday" queries
- Supports domain saturation across ecosystem
- Follows "go light on adjacent topics" with clear link to stronger authority

**Page spec needed:** `/jura/` or `/visit-jura/`
- Entity: "Multi-island holiday opportunity"
- Brief Jura intro (2-3 paragraphs)
- "Why combine Islay + Jura" section
- BJR property summary + trust signals
- "Getting to Jura from Islay" practical info
- CTA: External link to bothanjura.co.uk

---

### 2. Curlew Cottage Positioning ✅ DECIDED

**Decision:** "Owner's retreat, first time letting" + Superhost trust transfer

**Current issue:** `ownerContext` field is `null`, description says generic "characterful cottage"

**Corrected entity definition:**
```
Curlew Cottage is the owner's own Islay retreat, a converted steading being
let for the first time in 2026. The property sleeps 6 guests in 3 bedrooms
with a private walled garden—ideal for families with children. Unlike
Portbahn and Shorefield, Curlew is pet-free, making it suitable for guests
with allergies.

Managed by Pi and Lynton, Airbnb Superhosts with a 4.97/5 rating across
380+ reviews at their other Islay properties: Portbahn House and Shorefield.
```

**Fields to update in Sanity:**
- `ownerContext`: "Curlew is the owner's own retreat on Islay—a converted steading that Lynton and Pi have kept for personal use until now. First available for guest bookings in 2026."
- `overviewIntro`: Revise to include "converted steading" and "first time letting"
- `description`: Revise opening paragraph

**Trust transfer approach:**
- Add "Reviews from our other Islay properties" section
- Pull 2-3 host-focused reviews from Portbahn/Shorefield
- Focus on Pi's responsiveness, local knowledge, property quality

---

### 3. FAQ Structure ✅ DECIDED

**Decision:** Hybrid — distributed contextual Q&As + site-level booking FAQs

**Playbook rationale:**
- "FAQPage schema: Low value / Skip. Use contextual Q&As instead."
- Contextual Q&As pass extractable passage test
- Avoids thin pages while maintaining scannability

**Distribution plan:**

| Location | FAQ Type | Example Questions |
|----------|----------|-------------------|
| **Property pages** | Property-specific (3-5 each) | Dog policy, dishwasher, heating, WiFi, what's supplied |
| **Getting Here** | Travel Q&As embedded | Ferry booking, cancellations, car hire |
| **Explore Islay** | Area Q&As embedded | Distilleries, beaches, restaurants |
| **Site-level /faqs** | Booking/logistics only | Check-in times, payment, late checkout, general policies |

**Schema approach:** No FAQPage schema site-wide. Use question-style headings where they match exact user queries.

---

### 4. MVP Scope ✅ DECIDED

**Decision:** Enhanced current content (not new pages), with easy additions included

**MVP includes:**
- Property pages (×3) — Full specs + review insights + embedded Q&As
- Homepage — Entity definition, property cards, trust signals, location
- Compare Properties — Side-by-side table, decision guide
- Getting Here — Ferry survival guide with Pi's support narrative
- FAQs — Booking/logistics only (property Qs distributed)
- About Us — Real homes narrative, team intro, BJR cross-link
- Explore Islay — Consolidated guide (distilleries, beaches, food, wildlife)
- Contact — Pi intro + form
- **NEW:** /jura/ page (BJR cross-promotion)

**Post-launch (long-tail):**
- Individual distillery/beach guides
- Seasonal content (whisky festivals, birding seasons)
- Deep local guides (coordinate with isleofjura.scot)

---

## Immediate Tasks for Sonnet Session

### Priority 1: Working Sitemap
Create `docs/SITEMAP-WORKING.md` with:
- All pages + status (MVP / Post-launch)
- FAQ distribution mapping
- Entity ownership per page
- Content source reference
- Schema requirements

### Priority 2: Curlew Content Update
Update Sanity data files:
- `data/imports/curlew-cottage-enhanced.json`
- Add `ownerContext` field content
- Revise `overviewIntro` and `description`

### Priority 3: BJR Page Spec
Create page specification for `/jura/` following playbook patterns:
- Entity definition block
- Section structure
- Passage specifications
- Schema.org recommendation

### Priority 4: FAQ Distribution Document
Create detailed mapping of which FAQs go where:
- Cross-reference `FAQ-RESEARCH.md` sections A-D
- Assign each question to a page
- Note any gaps needing new content

---

## Tools Available

| Tool | Account Access | Best Use |
|------|---------------|----------|
| **Answer The Public** | Yes | FAQ validation — question patterns |
| **Ubersuggest** | Yes | Keyword difficulty, competitor gaps |
| **WriterZen** | Yes | Topic clusters, content briefs |

**Recommended ATP queries to run:**
- "Islay holiday cottage"
- "Islay ferry"
- "Islay distillery visit"
- "dog friendly cottage Scotland"
- "self catering Islay"

---

## Key File Locations

**In /portbahn-islay/:**
```
docs/
├── FAQ-RESEARCH.md                    # 40+ FAQs ready
├── OTHER-PAGES-PLAYBOOK-SPECS.md      # Page specs
├── HANDOFF-COWORK-2026-01-23.md       # Previous handoff
├── content/PBI-NUANCE-BRIEF-ENHANCED.md  # Site positioning
├── architecture/ENHANCED-SCHEMA-SPECIFICATION.md
└── design/pbi_sitemap_ia_v_2.md       # Current IA (needs updating)

data/imports/
├── curlew-cottage-enhanced.json       # Needs ownerContext update
├── portbahn-house-enhanced.json       # Complete
└── shorefield-enhanced.json           # Complete
```

**In /_www_claude/ (if mount works):**
```
docs/playbook/          # Full playbook modules
docs/toolkit/           # Tool documentation
sites/pbi/              # PBI-specific strategy
research/tools/         # Tool outputs
```

---

## Playbook Quick Reference

**Core principles to apply:**
1. **Passages over pages** — Each section extractable and standalone
2. **Entity-first** — One primary entity per page, explicit definitions
3. **Fixed spine, flexible skin** — Facts first, emotion layered
4. **Recall before precision** — Explicit over implicit

**Pre-publish checklist (every page):**
- [ ] Primary entity unambiguous
- [ ] Entity definition in first 200 words
- [ ] Each section answers one clear question
- [ ] Sections can stand alone if extracted
- [ ] Headings descriptive and scoped
- [ ] Schema reinforces visible content

---

## Notes

- Property pages (Portbahn, Shorefield) already have deep content via enhanced schema
- Curlew has structure but no review-based personality (correctly empty)
- The `/_www_claude/` folder showed empty on mount — may need retry in new session
- Multi-site coordination: PBI = Secondary Authority, references DMO + distilleries + CalMac

---

**Ready for Sonnet session to begin implementation.**
