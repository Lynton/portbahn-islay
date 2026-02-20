# Project Status
**Updated:** 2026-02-20 (end of session 2)

---

## Current Phase
**PBI (Portbahn Islay) — Sanity foundation complete. Ready for content review + UI phase.**

Full codebase audit done. Screaming Frog issues resolved. Canonical block system implemented.
All 16 canonical blocks imported to Sanity production. Schema cleaned up. Git is clean on `main`.

Next: review imported blocks in Studio, populate hub page singletons, then move to UI with v0.

---

## Active Sites

- **PBI (Portbahn Islay):** ✅ Sanity schema done, ✅ 16 canonical blocks imported, ✅ structural/SEO fixes complete. Awaiting: Studio content review, hub page wiring, UI redesign with v0.
- **BJR (Bothan Jura Retreat):** Design system documented. Content not started. Build priority TBD.
- **IoJ (Isle of Jura / isleofjura.scot):** Placeholder only.

---

## Last 10 Commits (this session)

| Hash | Description |
|------|-------------|
| `a40af1a` | chore: update import-canonical-blocks script to V3 source file |
| `0aaafd6` | docs: draft hub page scopeIntro content for travel-to-islay and explore-islay |
| `8726826` | chore: remove retired hub page and faqPage singletons from schema and Studio |
| `86766fc` | docs: commit V3 content specs and SANITY-BUILD-SPEC from Cowork |
| `1a375e3` | fix: wrap GoogleReviews in dynamic(ssr:false) via client wrapper component |
| `f326d14` | chore: remove debug API endpoints |
| `2ffe630` | chore: remove unused Sanity schemas and clean up Studio structure |
| `0645955` | fix: rebuild sitemap with correct routes and dynamic guide pages |
| `7a1f23c` | fix: structural route fixes — redirects, phantom 200, dead Jura link |
| `9eb621b` | fix: block search indexing on vercel.app staging environment |

---

## What Was Completed This Session

### Structural / SEO fixes
- ✅ noindex/disallow-all on all non-production environments (`app/robots.ts` + layout metadata)
- ✅ 301 redirect: `/accommodation/shorefield` → `/accommodation/shorefield-eco-house`
- ✅ 301 redirect: `/properties/:slug` → `/accommodation/:slug` (moved to next.config.ts)
- ✅ Deleted `app/properties/[slug]/page.tsx` (redirect now in next.config.ts)
- ✅ Removed dead `/jura` link from explore-islay page
- ✅ Sitemap rebuilt: added `/accommodation`, `/travel-to-islay`, `/availability`, dynamic `guidePage` entries; removed stale `/getting-here`
- ✅ Removed debug API routes (`/api/lodgify-debug`, `/api/test-lodgify`)
- ✅ GoogleReviews wrapped in `dynamic(ssr:false)` via `GoogleReviewsClient` wrapper

### Sanity schema cleanup
- ✅ Deleted: `faqItem`, `navigationSettings`, `islayGuidesIndexPage` (superseded)
- ✅ Deleted: `beachesHubPage`, `distilleriesHubPage`, `walksHubPage`, `villagesHubPage`, `faqPage` (no routes, future-use)
- ✅ Studio structure cleaned: removed all stale items from sidebar
- ✅ Removed `console.log` debug lines from sanity.config.ts

### Content & Sanity data
- ✅ V3 content specs committed: `CANONICAL-BLOCKS-FINAL.md`, `EXPLORE-ISLAY-V3-CORRECTED.md`, `GETTING-HERE-V3-CORRECTED.md`, `HOMEPAGE-V3-CORRECTED.md`
- ✅ `SANITY-BUILD-SPEC.md` added (authoritative operational build spec)
- ✅ **All 16 canonical blocks imported to Sanity production** (`createOrReplace`, idempotent)
- ✅ Hub page content draft created: `docs/content/HUB-PAGE-CONTENT-DRAFT.md`

---

## Next Actions

### Claude Code (next session)
1. **Render canonical blocks on frontend** — `app/travel-to-islay/page.tsx` and `app/explore-islay/page.tsx` need to fetch and render `contentBlocks` from their Sanity singleton documents. Currently these pages either have static content or don't render canonical blocks at all. This is the main code task remaining before UI work.
2. **Check `app/travel-to-islay/page.tsx`** — confirm it's fetching from `gettingHerePage` Sanity document and rendering `contentBlocks` via a PortableText renderer.
3. **Check `app/explore-islay/page.tsx`** — same audit. Currently renders guide page cards (hub pattern) but doesn't render canonical block content from the singleton.
4. **PortableText renderer** — check if a shared `PortableTextRenderer` component exists; if not, create one.
5. **Homepage canonical blocks** — `app/page.tsx` likely needs the same treatment.

### Pi/Lynton (Studio — do before next Claude Code session)
1. **Open `/studio` → Canonical Content Blocks** — 16 blocks should be visible. Spot-check formatting on: `ferry-support` (numbered list), `distilleries-overview` (10-item list), `food-drink-islay` (complex multi-section).
2. **Publish all blocks** if any show as drafts.
3. **Populate `gettingHerePage` singleton** in Studio — use `docs/content/HUB-PAGE-CONTENT-DRAFT.md` for scopeIntro, seoTitle, seoDescription, entityFraming, trustSignals. Add contentBlocks in order: `ferry-basics` (full), `ferry-support` (full), `jura-day-trip` (teaser).
4. **Populate `exploreIslayPage` singleton** — same doc. ContentBlocks: `distilleries-overview`, `portbahn-beach`, `wildlife-geese`, `food-drink-islay`, `families-children` (all full), `jura-day-trip`, `bothan-jura-teaser` (both teaser).
5. **Fix `exploreIslayPage` seoDescription** — currently says "nine distilleries" in the live Sanity document. Update to "ten".
6. **Trim over-length titles/descriptions** — SF report flagged 7 titles and 7 meta descriptions exceeding limits.

### Decisions Needed
- **UI priority**: Which page gets v0 treatment first? Property pages (currently "bullet soup") or hub pages?
- **BJR vs PBI**: Still unresolved. PBI is now in good shape for UI phase.

---

## Blockers
- None blocking. Studio content population is user-side.

---

## Key Files

| What | Where |
|------|-------|
| Authoritative build spec | `docs/content/SANITY-BUILD-SPEC.md` |
| Canonical blocks content | `docs/content/CANONICAL-BLOCKS-FINAL.md` |
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
| /dev (here) | Implementation | ✅ Active — clean on main |
| GitHub/Vercel | Version control + deploy | ✅ Up to date, deploying |
| Sanity Studio | CMS | ✅ 16 canonical blocks live in production |
| Cowork | Strategy + specs | Active |
| v0 | UI prototyping | Not started — next phase |
| Cursor | Code refinement | Available |
