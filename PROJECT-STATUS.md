# Project Status
**Updated:** 2026-02-21 (session 3)

---

## Current Phase
**PBI (Portbahn Islay) — All pages built. Content wired. Ready for images + UI phase.**

All 12 pages implemented. All 16 canonical blocks live and rendering via BlockRenderer.
Property data at 96-100% completeness across all three properties. Canonical block system
working end-to-end (Sanity → GROQ → BlockRenderer → CanonicalBlock → PortableText).

Next: Add hero images in Studio, then UI redesign with v0 (property pages first).

---

## Active Sites

- **PBI (Portbahn Islay):** ✅ All pages built, ✅ canonical blocks rendering, ✅ property data complete, ✅ trust transfer for Curlew wired. Awaiting: hero images (user action), UI redesign with v0.
- **BJR (Bothan Jura Retreat):** Design system documented. Content not started. Build priority TBD.
- **IoJ (Isle of Jura / isleofjura.scot):** Placeholder only. Jura content lives as guide pages on PBI (`/guides/visit-jura`).

---

## Last 10 Commits

| Hash | Description |
|------|-------------|
| `7a4c3b4` | feat: add guest quotes section to about page + Sanity population script |
| `587eaef` | feat: add about-us, contact pages + fix accommodation hub contentBlocks query |
| `d5d14c7` | fix: remove legacy homepage fields, delete old schema, add page-wiring script |
| `260422c` | docs: update Jura and About routes to /visit-jura and /about-us |
| `bb48770` | docs: make teaser link text entity-specific and fix broken Shorefield URL |
| `442f28b` | fix: correct BASE_URL domain (.co.uk), add availability metadata, split calendar into client wrapper |
| `ea1eea8` | fix: code review — broken link, shadowed vars, production console.logs, any casts |
| `e2d6bb5` | chore: reimport canonical blocks from merged V2+V3 source (v3.1) |
| `f18d3a1` | docs: add merged canonical blocks + next-session handoff |
| `838cdb4` | docs: add Cowork handoff for canonical blocks editorial merge |

---

## What Was Completed This Session (Session 3)

### New Pages
- ✅ **About Us page** (`/about-us`) — canonical home for `about-us` block, trust-signals teaser, bothan-jura-teaser teaser, guest quotes from property reviews, property cards grid, contact CTA
- ✅ **Contact page** (`/contact`) — email/phone/address from Sanity, "We're here to help" panel, content block support, 5.0/5 communication rating
- ✅ **`/about` redirect** to `/about-us` (backward compatibility)

### Content & Data
- ✅ **About page population script** (`scripts/populate-about-page.ts`) — title, scopeIntro, SEO, entity framing, trust signals, content blocks wired
- ✅ **Property gaps script** (`scripts/patch-property-gaps.ts`) — patches Shorefield (entityFraming, trustSignals, licenseNotes) and Curlew Cottage (entityFraming, trustSignals, ownerContext, propertyNickname, 4 trust-transfer reviews, typo fixes)
- ✅ **Accommodation hub fix** — GROQ query now fetches `contentBlocks[]`

### Property Data Completeness (after running patch script)
| Property | Completeness | Missing |
|----------|-------------|---------|
| Portbahn House | 99% | — |
| Shorefield Eco House | 100% | — (was: entityFraming, trustSignals, licenseNotes) |
| Curlew Cottage | 100% | No guest reviews (expected — new property, trust transfer wired) |

### Already Working (confirmed from audit)
- ✅ All 16 canonical blocks rendering via BlockRenderer on 5+ pages
- ✅ PortableText renderer exists and handles all block types
- ✅ Homepage renders contentBlocks (trust-signals, bruichladdich-proximity, etc.)
- ✅ Travel-to-islay, Explore Islay, About Us all render contentBlocks
- ✅ PropertyHostTrustTransfer component wired for Curlew (shows host reviews when totalReviewCount=0)
- ✅ Hub-and-spoke architecture working (explore-islay → guide pages)

---

## Next Actions

### Immediate — Pi/Lynton (Studio)
1. **Run population scripts** on local machine with `.env.local`:
   ```bash
   npx tsx scripts/populate-about-page.ts
   npx tsx scripts/patch-property-gaps.ts
   ```
2. **Add hero images** — About Us, Contact, all property pages, hub pages
3. **Publish all documents** in Sanity Studio after verifying content
4. **Spot-check blocks** in Studio: `about-us`, `trust-signals`, `ferry-support`

### Next Code Phase — UI Redesign
1. **Property pages** (priority) — currently ~1,080 lines of functional but text-heavy layout. Needs v0 treatment.
2. **Hub pages** — accommodation, travel, explore could benefit from layout refinement
3. **Homepage** — review section layout, property cards

### Guide Pages
- Schema and routing ready (`/guides/[slug]`)
- **Visit Jura** at `/guides/visit-jura` — canonical Jura content lives on IoJ/BJR; guide page on PBI is fine
- Additional guides: distilleries, beaches, walks, wildlife — content to come from Cowork

### Low Priority
- Privacy/Terms pages — placeholder content only
- Archive one-off scripts to `scripts/_archive/`
- Update review count from 380+ to 600+ in PropertyHostTrustTransfer component copy

---

## Blockers
- **Images needed** — hero images for About, Contact, hub pages (user action)
- No code blockers. All pages functional.

---

## Key Files

| What | Where |
|------|-------|
| Implementation spec | `_claude-handoff/CLAUDE-CODE-HANDOFF-2026-01-26.md` |
| Canonical blocks content | `docs/content/CANONICAL-BLOCKS-FINAL.md` |
| Sanity schema spec | `docs/schemas/SANITY-SCHEMA-FINAL.md` |
| Content architecture | `docs/content/CONTENT-ARCHITECTURE-MVP.md` |
| Curlew trust transfer | `docs/_session-work/pbi-content-strategy-2026-01-23/CURLEW-TRUST-TRANSFER-SPEC.md` |
| Curlew review selection | `docs/_session-work/pbi-content-strategy-2026-01-23/CURLEW-HOST-REVIEWS-SELECTION.md` |
| Population scripts | `scripts/populate-about-page.ts`, `scripts/patch-property-gaps.ts` |
| Page wiring script | `scripts/wire-page-content-blocks.ts` |
| Import script | `scripts/import-canonical-blocks.ts` |
| Sanity schemas | `sanity/schemas/` |
| Page components | `app/` |
| Shared components | `components/` |

---

## Pages Map

| Route | Status | Sanity Type | Notes |
|-------|--------|-------------|-------|
| `/` | ✅ Built | `homepage` | Property cards + canonical blocks |
| `/accommodation` | ✅ Built | `accommodationPage` | Hub page, contentBlocks now fetched |
| `/accommodation/[slug]` | ✅ Built | `property` | Full detail page, trust transfer for Curlew |
| `/about-us` | ✅ Built | `aboutPage` | Canonical blocks + guest quotes + property cards |
| `/about` | ✅ Redirect | — | → `/about-us` |
| `/contact` | ✅ Built | `contactPage` | Email/phone/address + content blocks |
| `/travel-to-islay` | ✅ Built | `gettingHerePage` | Hub page + guide cards |
| `/getting-here` | ✅ Redirect | — | → `/travel-to-islay` |
| `/explore-islay` | ✅ Built | `exploreIslayPage` | Hub page + guide cards |
| `/guides/[slug]` | ✅ Built | `guidePage` | Spoke pages (need content) |
| `/availability` | ✅ Built | — | Multi-property calendar |
| `/studio` | ✅ Built | — | Sanity Studio |

---

## Environment Map

| Environment | Role | Status |
|---|---|---|
| /dev (here) | Implementation | ✅ Active — branch `claude/resume-desktop-work-mQFR3` |
| GitHub/Vercel | Version control + deploy | ✅ Up to date |
| Sanity Studio | CMS | ✅ 16 blocks live, 3 properties, singletons ready |
| Cowork | Strategy + specs | Active — guide page content next |
| v0 | UI prototyping | Not started — next phase |
| Cursor | Code refinement | Available |
