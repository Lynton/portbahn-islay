# Handoff to Cowork Thread — 2026-01-23

**From:** Claude Code session
**To:** Cowork thread for content strategy + drafting
**Purpose:** Continue other pages workflow with strategic/content focus

---

## What Was Completed (Claude Code)

### 1. Live Site Scraped
All pages on portbahnislay.co.uk documented:
- Homepage (hero only, no content)
- Islay guide (~400 words, generic)
- Bruichladdich (~150 words, basic)
- Travel (~200 words, links only)
- FAQs (5 questions only)
- Bothan Jura Retreat (cross-promo)
- Contact (form only)
- All Properties (listing)
- Property pages (Lodgify templates)

### 2. Gap Analysis Created
**File:** `docs/OTHER-PAGES-INVENTORY.md`

Critical gaps identified:
- No homepage content (brand positioning missing)
- No About page (owner story missing)
- No property comparison (decision support missing)
- Thin ferry guide (no survival narrative)
- Only 5 FAQs (need 30+)

### 3. Playbook Specs Created
**File:** `docs/OTHER-PAGES-PLAYBOOK-SPECS.md`

Detailed page specs for 7 page types:
- Homepage, About Us, Compare Properties
- Getting Here (Ferry Survival Guide)
- Explore Islay, FAQs, Contact

Each spec includes:
- Entity definition block
- Section structure (conversational flow)
- Passage specifications
- Schema.org recommendations

### 4. FAQ Research Completed
**File:** `docs/FAQ-RESEARCH.md`

Comprehensive research from:
- Web sources (Islay Info, TripAdvisor, travel blogs)
- Guest reviews (600+ across both properties)
- Nuance brief

Organized into:
- **Section A:** Property-specific FAQs (15 questions)
- **Section B:** Islay & Travel FAQs (25+ questions)
- **Section C:** Multi-island FAQs (3 questions)
- **Section D:** Review patterns

---

## Decisions Needed (For Cowork Thread)

### 1. BJR Cross-Promotion Strategy
**Context:** Bothan Jura Retreat is sister property on Jura. Currently in main nav as "Bothan Jura Retreat".

**Options:**
a) Keep in main nav, rename to clearer intent ("Stay on Jura"?)
b) Move to About page section + footer
c) Dedicated cross-promo section on homepage
d) Getting Here page mention (Jura day trips → multi-night stays)

**Consider:** Multi-island stays as genuine differentiator. How prominent?

### 2. Curlew Cottage Content
**Status:** Fully licensed and bookable (not "enquiries only" as in old brief).
**Challenge:** No reviews yet.
**Question:** How to position "new for 2026" without guest quotes? Lighter content until reviews accumulate?

### 3. FAQ Structure
**Options:**
a) Single comprehensive FAQ page (40+ questions, FAQPage schema)
b) Distributed FAQs (property FAQs on comparison page, travel FAQs on Getting Here, etc.)
c) Hybrid (core FAQ page + contextual FAQs on relevant pages)

**Recommendation from research:** Hybrid approach

### 4. Content Depth vs MVP Speed
**Tension:** Nuance brief suggests rich content. Need to ship quickly.

**MVP scope:**
- Take live site content as base
- Augment with nuance + reviews
- Structure per playbook
- Skip deep local guides (Phase 2)

**Question:** What's minimum viable for each page?

---

## Files to Read First (Cowork Thread)

1. **`docs/OTHER-PAGES-INVENTORY.md`** — Gap analysis, current vs needed
2. **`docs/OTHER-PAGES-PLAYBOOK-SPECS.md`** — Detailed page specs
3. **`docs/FAQ-RESEARCH.md`** — 40+ researched questions with answers
4. **`docs/content/PBI-NUANCE-BRIEF-ENHANCED.md`** — Source content + voice

---

## Recommended Cowork Thread Workflow

### Phase 1: Strategic Decisions
- Resolve BJR positioning
- Confirm Curlew approach
- Finalize FAQ structure
- Define MVP content scope per page

### Phase 2: Content Drafting
For each page:
1. Start with live site content (where exists)
2. Augment with nuance brief content
3. Add review-derived language
4. Structure per playbook spec
5. Output as structured markdown

### Phase 3: Review & Handback
- Review drafted content
- Confirm Sanity schema needs
- Hand back to Claude Code for:
  - Schema updates
  - Page component builds
  - Content import

---

## Return to Claude Code When Ready For:

1. **Sanity schema updates** — New content types (Guide, FAQ groupings, About sections)
2. **Page components** — Build Next.js pages per specs
3. **Content import** — Populate Sanity with drafted content
4. **Property page updates** — If Curlew needs different treatment

---

## Quick Reference: Page Priority

| Page | Content Source | Effort |
|------|---------------|--------|
| FAQs | Research file ready | Medium |
| Getting Here | Live + nuance + research | Medium |
| Compare Properties | Nuance brief | Low |
| Homepage | Write fresh | Medium |
| About Us | Nuance brief | Low |
| Explore Islay | Live + expand | High |
| Contact | Add personality | Low |

---

## Git Status

```
Working tree: clean (docs committed)
Branch: main
```

New files created this session:
- `docs/OTHER-PAGES-INVENTORY.md`
- `docs/OTHER-PAGES-PLAYBOOK-SPECS.md`
- `docs/FAQ-RESEARCH.md`
- `docs/HANDOFF-COWORK-2026-01-23.md`

---

**End of Handoff**
