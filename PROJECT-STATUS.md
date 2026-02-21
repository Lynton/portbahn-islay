# Project Status
**Updated:** 2026-02-21 (end of session 3)

---

## Current Phase
**PBI (Portbahn Islay) — Pre-UI checks complete. Ready for UI phase.**

Code review done. SEO/SF issues resolved. Canonical blocks reimported from merged V2+V3 source.
All 16 blocks published in Sanity production. Git clean on `main` at `442f28b`.

Next: UI design and build with v0.

---

## Active Sites

- **PBI (Portbahn Islay):** ✅ Sanity schema done, ✅ 16 canonical blocks live (v3.1 merged), ✅ code review complete, ✅ SEO/SF fixes complete. Ready for UI phase.
- **BJR (Bothan Jura Retreat):** Design system documented. Content not started. Build priority TBD.
- **IoJ (Isle of Jura / isleofjura.scot):** Placeholder only.

---

## Last 10 Commits (this session)

| Hash | Description |
|------|-------------|
| `442f28b` | fix: correct BASE_URL domain (.co.uk), add availability metadata, split calendar into client wrapper |
| `ea1eea8` | fix: code review — broken link, shadowed vars, production console.logs, any casts |
| `e2d6bb5` | chore: reimport canonical blocks from merged V2+V3 source (v3.1) |
| `f18d3a1` | docs: add merged canonical blocks + next-session handoff |
| `838cdb4` | docs: add Cowork handoff for canonical blocks editorial merge |
| `5b1c176` | chore: add V2 content restore script; patch all 16 canonical blocks |
| `d0e750e` | chore: patch hub page singletons from HUB-PAGE-CONTENT-DRAFT.md spec |
| `0c22694` | chore: remove beach/distillery/walk/village collection schemas + clean Sanity data |
| `f4c54b3` | feat: wire canonical contentBlocks rendering on hub pages |
| `bf82a6d` | docs: update PROJECT-STATUS.md with session 2 completion state |

---

## What Was Completed This Session

### Canonical blocks
- ✅ Merged V2 (Pi's voice) + V3 (condensed structure) into `docs/content/CANONICAL-BLOCKS-MERGED.md`
- ✅ Updated import script to target merged file (v3.1)
- ✅ Reimported all 16 canonical blocks to Sanity production — 16/16 succeeded, 0 failed
- ✅ Deleted stale `drafts.faqPage` ghost document from Sanity

### Code review
- ✅ Fixed broken link: `PropertyHostTrustTransfer.tsx` `/accommodation/shorefield` → `/accommodation/shorefield-eco-house`
- ✅ Fixed shadowed variables: `quote_preview/route.ts` `checkInDate`/`checkOutDate` renamed in inner scope
- ✅ Removed production `console.log` calls: `properties/route.ts` (8 removed), `quote_preview/route.ts` (2), `avail_ics/route.ts` (1)
- ✅ Gated 30+ debug logs in `google-reviews/route.ts` behind `devLog` (dev-only helper)
- ✅ Replaced `property as any` pattern in `app/page.tsx` with typed `Property` interface
- ✅ Build confirmed clean after all changes

### SEO / Screaming Frog pre-work
- ✅ Fixed `BASE_URL` fallback in `lib/schema-markup.tsx`: `portbahnislay.com` → `portbahnislay.co.uk`
- ✅ Added missing metadata to `/availability` page (`generateMetadata` — was falling back to layout defaults)
- ✅ Refactored `availability/page.tsx`: removed `'use client'`, extracted calendar into `CalendarClient.tsx` wrapper, page is now a proper server component
- ✅ Fixed "Shorefield House" → "Shorefield Eco House" on availability page
- ✅ Replaced hardcoded hex colours with Tailwind design tokens on availability page
- ✅ Build confirmed clean after all changes

---

## Next Actions

### UI phase (next)
- **Start with v0** — UI redesign. Decision needed: property pages first (currently "bullet soup") or hub pages?
- **Hero images** — hub pages and property pages need real photography added in Studio before or alongside UI work

### Content / playbook review (still to do)
- Audit each page against AI search playbook — entity definition, passage extractability, key facts, scope statements
- Requires Studio content to be populated first (scopeIntro, seoTitle, seoDescription on hub page singletons)

### Studio (Pi/Lynton — do before or during UI phase)
- **Populate `gettingHerePage` singleton** — scopeIntro, seoTitle, seoDescription, contentBlocks (ferry-basics full, ferry-support full, jura-day-trip teaser)
- **Populate `exploreIslayPage` singleton** — scopeIntro, seoTitle, seoDescription, contentBlocks per HUB-PAGE-CONTENT-DRAFT.md
- **Fix `exploreIslayPage` seoDescription** — currently says "nine distilleries", update to "ten"
- **Trim over-length titles/descriptions** — 7 titles and 7 meta descriptions exceed SF limits (Studio edits)
- **Add hero images** to hub pages and property pages

### Screaming Frog (defer until after UI + images)
- Run full SF audit after real images are in place and Studio content is populated
- Skip image-related issues until then (expected: missing alt on placeholders, OG image 404s)
- Focus on: semantic clustering, title/meta lengths, schema structure

### Decisions needed
- **UI priority**: Property pages or hub pages first with v0?
- **BJR vs PBI**: PBI ready for UI. BJR build timing still unresolved.

---

## Blockers
- None blocking. Studio content population is user-side.

---

## Key Files

| What | Where |
|------|-------|
| Authoritative build spec | `docs/content/SANITY-BUILD-SPEC.md` |
| Canonical blocks (current source of truth) | `docs/content/CANONICAL-BLOCKS-MERGED.md` |
| Hub page content drafts | `docs/content/HUB-PAGE-CONTENT-DRAFT.md` |
| Explore Islay content | `docs/content/EXPLORE-ISLAY-V3-CORRECTED.md` |
| Getting Here content | `docs/content/GETTING-HERE-V3-CORRECTED.md` |
| Homepage content | `docs/content/HOMEPAGE-V3-CORRECTED.md` |
| Import script | `scripts/import-canonical-blocks.ts` |
| Sanity schemas | `sanity/schemas/` |
| Page components | `app/` |

---

## Environment Map

| Environment | Role | Status |
|---|---|---|
| /dev (here) | Implementation | ✅ Active — clean on `main` at `442f28b` |
| GitHub/Vercel | Version control + deploy | ✅ Up to date, deploying |
| Sanity Studio | CMS | ✅ 16 canonical blocks live in production (v3.1 merged) |
| Cowork | Strategy + specs | Active |
| v0 | UI prototyping | **Next phase** |
| Cursor | Code refinement | Available |
