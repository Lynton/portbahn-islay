# Cowork Folder Audit — Handoff from /dev
**Date:** 2026-02-22
**Prepared by:** Cowork session (reading /dev state)
**For:** Cowork — audit and update Cowork folder to match current /dev reality
**Last Cowork sync:** 2026-02-20 (canonical blocks merge task)

---

## Purpose

This document bridges what's been done in /dev since the last Cowork sync, so
you can check Cowork files are accurate, up to date, and ready for the next phase.

The /dev folder is not accessible from a Cowork session directly. Use this doc
to orient yourself before auditing Cowork files.

---

## Current /dev State (as of 2026-02-22)

**Branch:** `main` (all changes merged and pushed)
**Vercel:** Up to date

### Build Status: ✅ All 12 pages live and functional

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ Built | Homepage with canonical blocks |
| `/accommodation` | ✅ Built | Hub page, contentBlocks fetched |
| `/accommodation/portbahn-house` | ✅ Built | Full detail, reviews |
| `/accommodation/shorefield-eco-house` | ✅ Built | Full detail, reviews |
| `/accommodation/curlew-cottage` | ✅ Built | Trust transfer wired (new property) |
| `/about-us` | ✅ Built | Canonical home for `about-us` block |
| `/about` | ✅ Redirect | → `/about-us` |
| `/contact` | ✅ Built | Email/phone from Sanity, 5.0 rating |
| `/travel-to-islay` | ✅ Built | Hub + guide cards |
| `/getting-here` | ✅ Redirect | → `/travel-to-islay` |
| `/explore-islay` | ✅ Built | Hub + guide cards |
| `/guides/[slug]` | ✅ Routing built | **No guide page content yet** |
| `/availability` | ✅ Built | Multi-property calendar |
| `/studio` | ✅ Built | Sanity Studio embedded |

### Property Data Completeness

| Property | Completeness |
|----------|-------------|
| Portbahn House | 99% |
| Shorefield Eco House | 100% |
| Curlew Cottage | 100% (trust transfer from host reviews, no guest reviews yet) |

### Canonical Blocks: 16/16 live in Sanity

All blocks imported and rendering via BlockRenderer on correct pages.
Final source file: `docs/content/CANONICAL-BLOCKS-MERGED.md` (1,104 lines, v3.1)

---

## What Changed Since Last Cowork Sync (2026-02-20)

These were implemented in /dev Sessions 2–3. Cowork may not have specs for all of these.

### Session 3 additions (2026-02-21)

| What | Where in /dev | Cowork spec exists? |
|------|--------------|---------------------|
| About Us page (`/about-us`) | `app/about-us/page.tsx` | ❓ Check |
| Contact page (`/contact`) | `app/contact/page.tsx` | ❓ Check |
| Guest quotes section on About page | Built from property reviews in Sanity | ❓ Check |
| Shorefield data gaps patched | Via `scripts/patch-property-gaps.ts` | ❓ Check |
| Curlew data gaps patched + trust transfer | Via `scripts/patch-property-gaps.ts` | ✅ (`CURLEW-TRUST-TRANSFER-SPEC.md` existed) |
| Accommodation hub contentBlocks fix | GROQ query fix | — (bug fix, no spec needed) |
| Review count updated to 600+ | `PropertyHostTrustTransfer` component | ✅ (confirmed in CLAUDE.md) |

### Canonical blocks task (from 2026-02-20 handoff): ✅ COMPLETE

The merge task assigned to Cowork in `COWORK-HANDOFF-CANONICAL-BLOCKS-MERGE-2026-02-20.md`
is done. The merged file exists and has been imported to Sanity.

**Action for Cowork:** Confirm `CANONICAL-BLOCKS-MERGED.md` is in your Cowork folder.
If not, copy it from `/dev/docs/content/CANONICAL-BLOCKS-MERGED.md`. This is now the
single source of truth — the old V2 and V3 files are superseded.

---

## Files to Audit in Cowork

Go through each of these in your Cowork folder and check against the current /dev state:

### 1. PROJECT-STATUS equivalent
**What to check:** Does Cowork have a status doc? If so, update it to reflect:
- All 12 pages built ✅
- 16 canonical blocks live ✅
- Property data 99-100% complete ✅
- Next phase: UI redesign (v0) + guide page content

### 2. Canonical blocks — CANONICAL-BLOCKS-MERGED.md
**What to check:** Is this file in Cowork? It should be — it originated from Cowork's
editorial merge task. If it exists, confirm it matches `/dev/docs/content/CANONICAL-BLOCKS-MERGED.md`
(v3.1, dated 2026-02-20, 1104 lines).

**The old files (`CANONICAL-BLOCKS-FINAL-V2_LL2.md`, `CANONICAL-BLOCKS-FINAL.md`) are
superseded.** You can archive them but don't use them as a basis for future edits.
All future block edits go to `CANONICAL-BLOCKS-MERGED.md` first, then /dev imports.

### 3. About Us page
**What to check:** Is there a content spec for the About Us page in Cowork?
If not, this was built from general project knowledge + Sanity data. The page includes:
- Canonical `about-us` block (full version)
- Trust signals teaser
- Guest quotes (from property reviews — 3 per property)
- Property cards grid
- Contact CTA
- Bothan Jura teaser

If Cowork wants an authoritative content record, create one from the live page.

### 4. Contact page
**What to check:** Is there a content spec for the Contact page in Cowork?
If not, the page was built from Sanity data (email, phone, address) plus static copy.
Simple page — may not need a Cowork spec, but worth noting it exists.

### 5. Guide page content — ⚠️ THIS IS THE NEXT COWORK TASK
**What to check:** Does Cowork have guide page content ready for any of these?

The routing exists at `/guides/[slug]`. The schema (`guidePage`) is live in Sanity.
No guide pages have content yet. These need to be produced and populated:

| Guide | Slug | Priority | Notes |
|-------|------|----------|-------|
| Distilleries of Islay | `/guides/distilleries` | High | 10 distilleries, tasting notes, visiting tips |
| Beaches of Islay | `/guides/beaches` | High | Safety warnings essential (Machir Bay, Saligo) |
| Wildlife & Nature | `/guides/wildlife` | High | Geese, eagles, otters, marine |
| Walking & Outdoors | `/guides/walking` | Medium | Coastal walks, Paps of Jura |
| Visit Jura | `/guides/visit-jura` | Medium | Already partly specified in canonical blocks |
| Eating & Drinking | `/guides/eating-drinking` | Medium | Sourced partly from `food-drink-islay` block |

If Cowork has started any of these, flag to /dev for implementation.
If not, this is the primary content task for Cowork now.

### 6. UI redesign brief — NOT YET STARTED
**What to check:** Has Cowork started a UI brief for v0?

The next code phase is UI redesign. Property pages are ~1,080 lines of functional
but text-heavy layout. Priority order: property pages → hub pages → homepage.

If Cowork wants to drive this, a design brief or v0 prompt would be the output.
If not, /dev will handle it directly with v0.

### 7. Tone of voice
**What to check:** `PORTBAHN-TONE-OF-VOICE-SKILL.md` — is the Cowork version
current? `/dev` has this at `docs/content/PORTBAHN-TONE-OF-VOICE-SKILL.md`.
Versions should match. If Cowork has been editing the tone doc, reconcile before
guide page writing begins — the guide pages will need to follow it.

### 8. CLAUDE.md critical facts table
**What to check:** Does Cowork have a copy of the critical facts? These are in
`/dev/CLAUDE.md` under "Critical Facts". They must be used consistently in all
new guide page content.

| Fact | Correct Value |
|------|---------------|
| Walk to Bruichladdich Distillery | 5 minutes |
| Ferry to Port Askaig | 2 hours |
| Ferry to Port Ellen | 2 hours 20 minutes |
| Ferry booking window | 12 weeks |
| Guests hosted | 600+ |
| Average rating | 4.97/5 |
| Communication rating | 5.0/5 |
| Distilleries on Islay | 10 |
| Barnacle geese | 30,000+ |
| Owner name spelling | Alan (not Allan) |
| Portbahn Beach walk | 5 minutes via war memorial path |
| Port Charlotte drive | 5 minutes |
| Port Charlotte walk | 40 minutes |

---

## Next Phase Summary

**Cowork's immediate priorities:**

1. **Confirm canonical blocks merge file is in Cowork and up to date**
   — If not, copy from /dev. Archive old V2/V3 files.

2. **Audit Cowork status doc**
   — Update to reflect: all pages built, 16 blocks live, property data complete.

3. **Start guide page content**
   — This is the biggest content gap. The routing and schema are ready; /dev is
   waiting on content. Priority: Distilleries, Beaches, Wildlife.

4. **Optional: Draft UI brief for v0**
   — Property pages first. Could include: layout preferences, section order,
   image treatment, colour system, typography intent.

**What /dev is waiting for:**
- Hero images (Pi/Lynton add in Studio — not a Cowork task)
- Guide page content (Cowork → /dev)
- UI brief or v0 direction (Cowork or direct)

---

## Key /dev Files for Reference

| File | What it is |
|------|-----------|
| `PROJECT-STATUS.md` | Authoritative /dev status — read this first |
| `docs/content/CANONICAL-BLOCKS-MERGED.md` | Final canonical blocks source (v3.1) |
| `docs/content/CONTENT-ARCHITECTURE-MVP.md` | Site structure and page map |
| `docs/content/PORTBAHN-TONE-OF-VOICE-SKILL.md` | Tone guide |
| `CLAUDE.md` | Critical facts, naming conventions, architecture |
| `_claude-handoff/CLAUDE-CODE-HANDOFF-2026-01-26.md` | Full implementation spec (historical) |

---

## Environment Reminder

```
Cowork → specs/content → /dev implements → GitHub → Vercel deploys
```

Cowork does not write code. /dev does not create content strategy.
If Cowork produces guide content, format it as a Markdown spec file
and commit to `/dev/docs/content/`. /dev then imports to Sanity.
