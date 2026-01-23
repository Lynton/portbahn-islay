# Portbahn Islay - Working Notes

**Purpose:** Session-to-session context for Claude Code threads. Check this file first for decisions, pending work, and UI/UX notes.

**Updated:** 2026-01-23

---

## Current Status

### Property Pages: COMPLETE (10/10)
- Schema: ✅ Complete with reviews, ratings, availability, license
- Frontend: ✅ Optimised for AI search playbook
- Content: ✅ Structure ready, awaiting final content entry

### Other Pages: PENDING
- Need to scrape, aggregate, restructure per playbook

---

## Key Decisions

### Content Display Rules
- **No content in Sanity = No section on frontend** (all sections conditional)
- **Placeholder text in Sanity** (to prompt editors) but never shown to users
- **Section order follows playbook conversational flow**

### Schema.org Implementation
- AggregateRating with weighted average across Airbnb, Booking.com (normalized), Google
- Individual Review schemas from reviewHighlights
- Availability mapping: bookable→InStock, enquiries→PreOrder, etc.
- License info included when licenseNumber exists
- FAQPage schema when 3+ commonQuestions

---

## UI/UX Notes (For Later)

### Property Page UX Pattern
Long page with lots of content - needs restructuring to avoid "bullet soup".

**Recommended hybrid approach:**

**Keep visible (for AI retrieval/citation):**
- Entity Definition Block
- Overview + Trust Signals
- Common Questions (high citation value)
- Review scores and key highlights
- Location summary
- Pricing + Booking CTA

**Can be tabbed/collapsed (lower citation priority, user utility):**
- Detailed sleeping arrangements
- Full facilities lists
- Outdoor features
- What's included/not included
- Full house rules
- Pet policy details
- Getting here directions
- Full gallery

**Layout concept:**
```
┌─────────────────────────────────────┐
│ HERO + NAME + CAPACITY              │
├─────────────────────────────────────┤
│ OVERVIEW (always visible)           │
│ Entity block + Trust + Ideal For    │
├─────────────────────────────────────┤
│ QUICK FACTS CARDS (always visible)  │
│ [Sleeps] [Bedrooms] [Reviews] [Pets]│
├─────────────────────────────────────┤
│ TABS: Details | Location | Reviews  │
│ ┌─────────────────────────────────┐ │
│ │ Tab content (expandable)        │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ COMMON QUESTIONS (always visible)   │
├─────────────────────────────────────┤
│ PRICING + BOOKING CTA               │
├─────────────────────────────────────┤
│ GALLERY                             │
└─────────────────────────────────────┘
```

**Playbook principle:** "Fixed spine, flexible skin" - entity-defining content stays visible; supporting details can be organised for UX.

---

## Pending Work

### Immediate: Other Pages Workflow
1. Scrape live site: portbahnislay.co.uk
2. Aggregate with docs/content/ (nuance, reviews)
3. Identify new pages from nuance docs
4. Apply playbook to restructure
5. Update Sanity schema as needed
6. Import content to Sanity

### Later: UI Phase
- Implement UX pattern above for property pages
- Apply consistent design system across all pages
- Mobile responsiveness
- Performance optimisation

---

## Reference Files

| Purpose | Location |
|---------|----------|
| AI Search Playbook | `docs/playbook-v1.3.1/` |
| Playbook Skill | `~/.claude/skills/ai-search-playbook/` |
| Nuance Brief | `docs/content/PBI-NUANCE-BRIEF-ENHANCED.md` |
| PB Reviews | `docs/content/PB-Reviews-Working.md` |
| SHF Reviews | `docs/content/SHF-Reviews-Working.md` |
| Design System | `docs/design/` |
| Schema Spec | `docs/architecture/ENHANCED-SCHEMA-SPECIFICATION.md` |

---

## Commit History (Key Milestones)

- `2364dd1` - refactor: optimise property page for AI search playbook
- `99b80f0` - feat: enhance schema.org with reviews, ratings, availability
- `fc6846d` - docs: add next session handoff for frontend integration

---

## Session Handoff Protocol

When starting a new session:
1. Read this file first
2. Check `git log --oneline -10` for recent commits
3. Check `git status` for uncommitted work
4. Review any TODO items above

When ending a session:
1. Update "Current Status" section
2. Add any new decisions to "Key Decisions"
3. Note any deferred work in "Pending Work"
4. Commit this file with changes
