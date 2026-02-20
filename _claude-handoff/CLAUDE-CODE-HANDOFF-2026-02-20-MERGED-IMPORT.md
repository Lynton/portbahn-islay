# Claude Code Handoff: Import Merged Canonical Blocks
**Date:** 2026-02-20
**Git state:** `838cdb4` on `main` — clean, pushed, up to date with origin
**Session goal:** Update `import-canonical-blocks.ts` to target merged file, run import, commit

---

## Context in One Paragraph

This project (Portbahn Islay — Next.js + Sanity CMS v3 + Vercel) uses a canonical
content block system: 16 `canonicalBlock` documents in Sanity, each with `fullContent`,
`teaserContent`, and `keyFacts` (all PortableText). Hub pages reference blocks via
`blockReference` objects. The blocks went through two draft rounds (V2 = Pi's personal
voice; V3 = condensed but stripped voice). Both are now merged into a single authoritative
file. This session's job is to import it.

---

## Exactly What to Do

### Step 1 — Orient

```bash
git pull
git log --oneline -5   # should show 838cdb4 at top
git status             # should be clean
```

The new file is already committed to the repo at:
```
docs/content/CANONICAL-BLOCKS-MERGED.md
```
Wait — it is NOT yet committed. It arrived from Cowork as an untracked file.
Commit it first:

```bash
git add docs/content/CANONICAL-BLOCKS-MERGED.md
git commit -m "docs: add merged canonical blocks (V2 voice + V3 structure) — ready for import"
```

### Step 2 — Update the import script

File: `scripts/import-canonical-blocks.ts`

**One change only** — update the `mdPath` variable (around line 322):

```typescript
// BEFORE:
const mdPath = path.join(process.cwd(), 'docs', 'content', 'CANONICAL-BLOCKS-FINAL.md');

// AFTER:
const mdPath = path.join(process.cwd(), 'docs', 'content', 'CANONICAL-BLOCKS-MERGED.md');
```

Also update the console log on the line below it (around line 319):
```typescript
// BEFORE:
console.log('  Canonical Blocks Import — V3 (CANONICAL-BLOCKS-FINAL.md)');

// AFTER:
console.log('  Canonical Blocks Import — V3.1 Merged (CANONICAL-BLOCKS-MERGED.md)');
```

No other changes to the script needed. The merged file uses identical V3 heading
format (`### Block N: \`block-id\`` and `#### Full Version` / `#### Teaser Version` /
`#### Key Facts (immutable)`), so the parser works without modification.

### Step 3 — Run the import

```bash
npx tsx scripts/import-canonical-blocks.ts
```

Expected output:
```
✓ Loaded: .../docs/content/CANONICAL-BLOCKS-MERGED.md
  Project: t25lpmnm
  Dataset: production

Creating/updating blocks in Sanity...

  ✓ ferry-basics — [N] content blocks, [N] key facts
  ✓ ferry-support — ...
  ✓ trust-signals — ...
  [... 16 lines total ...]

Complete: 16 succeeded, 0 failed
```

If any block shows 0 content blocks or fails, stop and investigate before proceeding.
Do not commit a partial import.

### Step 4 — Verify spot-check (key blocks)

After the import, check these four blocks in Sanity Studio at `/studio`:
→ Canonical Content Blocks → [block name]

| Block | What to confirm is present |
|-------|---------------------------|
| `ferry-basics` | "Kirsty's pies", "Lion's Mane jellyfish", motion sickness tips, Loch Fyne stop |
| `families-children` | "raised our two children here", Persabus Pottery anecdote, "kids didn't want screens" quote, Islay's Plaice |
| `trust-signals` | Three named guest quotes (Sarah, James & Emma, Louise), "Real family homes" section |
| `food-drink-islay` | Islay's Plaice, The Copper Still Port Ellen, SeaSalt Bistro, Jean's Fresh Fish Van, Aileen's Mini-Market |

If any of these are missing, the content didn't import correctly — check the markdown
parsing section below.

### Step 5 — Commit and push

```bash
git add scripts/import-canonical-blocks.ts
git commit -m "chore: reimport canonical blocks from merged V2+V3 source (v3.1)"
git push origin main
```

---

## File Map (What Exists Where)

| File | Purpose |
|------|---------|
| `docs/content/CANONICAL-BLOCKS-MERGED.md` | **New source of truth** — 16 blocks, 1,104 lines |
| `docs/content/CANONICAL-BLOCKS-FINAL.md` | V3 (old, superseded — do not import from) |
| `_claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md` | V2 (old, superseded — do not import from) |
| `scripts/import-canonical-blocks.ts` | Import script — only change the file path |
| `scripts/restore-blocks-from-v2.ts` | Previous session script — archived, do not re-run |
| `sanity/schemas/` | Schema definitions — do not touch |
| `app/travel-to-islay/page.tsx` | Hub page — already wired, do not touch |
| `app/explore-islay/page.tsx` | Hub page — already wired, do not touch |

---

## Sanity Environment

- **Dataset:** `production` — every write is live
- **Project ID:** `t25lpmnm`
- **API token:** in `.env.local` as `SANITY_API_TOKEN`
- **Document IDs:** `canonical-block-{blockId}` — e.g. `canonical-block-ferry-basics`
- **Import method:** `createOrReplace` — safe to re-run, always overwrites

The 16 Sanity document IDs (must match blockIds exactly):
```
canonical-block-ferry-basics
canonical-block-ferry-support
canonical-block-trust-signals
canonical-block-bruichladdich-proximity
canonical-block-portbahn-beach
canonical-block-shorefield-character
canonical-block-port-charlotte-village
canonical-block-distilleries-overview
canonical-block-wildlife-geese
canonical-block-food-drink-islay
canonical-block-beaches-overview
canonical-block-families-children
canonical-block-jura-day-trip
canonical-block-jura-longer-stay
canonical-block-bothan-jura-teaser
canonical-block-about-us
```

---

## Merged File Structure (for reference)

The merged file uses V3 heading format — this is what the parser expects:

```
### Block 1: `ferry-basics`

**Entity Type:** Travel
**Canonical Home:** `/travel-to-islay`
**Teaser Used On:** Homepage, Property pages

#### Full Version

[content paragraphs]

---

#### Teaser Version

[single paragraph, ~60 words, ends with link]

---

#### Key Facts (immutable)

| Fact | Value |
|------|-------|
| ... | ... |

---

### Block 2: `ferry-support`
...
```

The parser regex in `extractBlock()` matches `### Block ${blockNumber}: \`${blockId}\``
and extracts content between `#### Full Version` and `#### Teaser Version`, and between
`#### Teaser Version` and `#### Key Facts (immutable)`.

**Important:** The merged file has `---` separators between Full/Teaser/KeyFacts sections
(same as V3). If the import produces 0-block results for any section, check the regex
match around these separators in the parser.

---

## If Something Goes Wrong

**"Block N not found in markdown"**
→ The regex didn't match. Check the exact heading format in the merged file matches
`### Block N: \`block-id\`` (backticks, colon, space — exact).

**"0 content blocks" for a block**
→ The Full Version content wasn't captured. Check the `---` separator between Full
and Teaser sections — the regex expects `\n\n#### Teaser Version` immediately after
the content. Extra blank lines or missing separators can break this.

**Sanity write error / 403**
→ Check `SANITY_API_TOKEN` in `.env.local` has write + read permissions on `production`.

**Script runs but Sanity Studio shows old content**
→ The documents update as drafts if token lacks `content.publish` permission. Check
Studio for unpublished drafts and publish manually, or use a token with full permissions.

---

## What This Session Does NOT Include

These are intentionally out of scope — do not touch:

- Hub page `contentBlocks` configuration (already done, correct)
- Hub page `scopeIntro`, `entityFraming`, `trustSignals` (already done)
- FAQ canonical blocks (separate schema/workflow, untouched)
- Guide pages (7 guide pages exist, content already wired)
- Property pages (`/accommodation/*`) — not part of this build phase
- Homepage canonical block references — not yet configured (future task)
- Any Sanity schema changes

---

## After This Session — Next Up

Once import is confirmed and pushed, the remaining build tasks (from PROJECT-STATUS.md):
1. Homepage `contentBlocks` — configure which blocks appear on `/` (not yet done)
2. Property page `contentBlocks` — teaser blocks on each property page (not yet done)
3. Hero images — hub pages need hero images added in Studio
4. About page content — `aboutPage` singleton content
5. Contact page — form integration
