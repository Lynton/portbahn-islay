# CLAUDE.md — Portbahn Islay
**Updated:** 2026-02-20
**Supersedes:** .clauderc

---

## Project Overview

Portbahn Islay is a holiday rental website for three properties in Bruichladdich, Isle of Islay, Scotland, managed by Pi & Lynton.

**Tech stack:** Next.js 16 (App Router) + TypeScript + Sanity CMS v3 + Tailwind CSS v4 + Vercel
**Sanity dataset:** production
**Tailwind:** v4 — configured via `@theme` in `globals.css`, NOT `tailwind.config.ts` (deleted)

**Properties:**
- Portbahn House — sleeps 8, 3 bedrooms, dogs welcome, ground floor bedrooms
- Shorefield Eco House — sleeps 6, 3 bedrooms, dogs welcome, bird hides, eco-house
- Curlew Cottage — sleeps 6, 3 bedrooms, pet-free, walled garden

---

## Environment Architecture

| Path | Role |
|------|------|
| **sites/pbi/** (`~/dev/sites/pbi/`) | **This repo** — code, schemas, git history |
| **ecosystem/** (`~/dev/ecosystem/`) | Shared authority — playbook, ops, strategy |
| **reference/** (`~/dev/reference/`) | Canonical content — brand, tone, content specs (read-only) |
| **_work/** (`~/dev/_work/`) | Working files — specs, drafts, intake |
| **GitHub/Vercel** | Version control + deployment pipeline |

```
~/dev/
├── ecosystem/          ← playbook, ops, strategy
├── sites/
│   └── pbi/           ← this repo (code)
├── reference/
│   └── pbi/           ← canonical content (read-only)
│       ├── brand/     ← tone of voice, critical facts
│       ├── content/   ← canonical blocks, guides
│       └── ...
└── _work/
    └── pbi/           ← working files, specs, intake
```

---

## Current State (2026-03-20)

**Active build: PBI (Portbahn Islay)**

All pages built. Canonical block system live. Guide pages redesigned with Phaidon/Taschen editorial layouts. CSS fully migrated to Tailwind v4 with design system tokens and typography presets. UI is designed and built iteratively in CC — v0 is not used.

**Start here:**
1. Read `~/dev/ecosystem/PROJECT-STATUS.md` — cross-environment status
2. Check git log to orient on recent work
3. Check `~/dev/reference/pbi/content/` for content specs

---

## Key Files

### In this repo
| What | Where |
|------|-------|
| **CSS / design system** | `app/globals.css` — `@theme` tokens, typography presets, hover system |
| **Shared data queries** | `lib/queries.ts` — `getProperties()` etc. |
| **PortableText config** | `lib/portable-text.tsx` |
| **Hub template** | `app/_components/HubPage.tsx` |
| **Spoke template** | `app/_components/GuideSpokeLayout.tsx` |
| **Sanity schemas (code)** | `sanity/schemas/` |

### Reference (read-only)
| What | Where |
|------|-------|
| **Project status** | `~/dev/ecosystem/PROJECT-STATUS.md` |
| **AI Search Playbook** | `~/dev/ecosystem/ai-search-playbook/` |
| **Canonical blocks** | `~/dev/reference/pbi/content/CANONICAL-BLOCKS-MERGED-v4.md` |
| **Tone of voice** | `~/dev/reference/pbi/brand/PORTBAHN-TONE-OF-VOICE-SKILL.md` |
| **Critical facts** | `~/dev/reference/pbi/brand/CRITICAL-FACTS.md` |
| **Guide page content** | `~/dev/reference/pbi/content/guides/` |

---

## CSS & Tailwind System

**Tailwind v4** — all configuration lives in `@theme` block in `app/globals.css`. There is NO `tailwind.config.ts`. Tailwind v4 auto-generates utility classes from `@theme` tokens.

### Design tokens (`@theme`)
- **7 colours** — `--color-kelp-edge`, `--color-sound-of-islay`, `--color-harbour-stone`, `--color-machair-sand`, `--color-sea-spray`, `--color-washed-timber`, `--color-emerald-accent`
- **2 font families** — `--font-serif` (The Seasons), `--font-mono` (IBM Plex Mono)
- **10 font sizes** — `--text-2xs` (8px) through `--text-3xl` (16px)
- **9 letter-spacings** — `--tracking-tight` through `--tracking-ultra`
- **10 line-heights** — `--leading-none` through `--leading-wide`

### Typography presets (`globals.css`)
23 presets covering all recurring patterns. Use these instead of inline styles:
- `typo-kicker` — mono/9px/uppercase/kelp-edge (section labels)
- `typo-label` — mono/10px/uppercase (property page labels)
- `typo-h1`, `typo-h2`, `typo-h3` — serif headings at three scales
- `typo-body`, `typo-body-sm` — mono body text
- `typo-cta`, `typo-btn` — CTA text and button styles
- `typo-h2-light`, `typo-h3-light`, `typo-body-light`, `typo-kicker-light` — light-on-dark variants for teal backgrounds
- `typo-spread-heading`, `typo-card-title`, `typo-pull-quote`, `typo-offset-quote` — specific layout contexts
- `typo-score`, `typo-review-quote`, `typo-caption-serif`, `typo-fact-label`, `typo-fact-value` — property page specifics

### Hover system
Four patterns, defined in `globals.css`:
- `hover-link` — text links: emerald + underline
- `hover-card` — cards/blocks: shadow appears
- `hover-btn` — CTA buttons: slight dim
- `hover-light` — links on dark backgrounds: brightens to white

### Rules
- **Never use inline `style={{}}` for typography** — use a `typo-*` preset or Tailwind utilities
- **Inline styles are only for**: gradients, `clamp()` sizes, `aspectRatio`, `vh` heights, `rgba` overrides, interactive state transforms
- **Never create a new `tailwind.config.ts`** — all config is in `@theme`
- **Colours auto-generate utilities** — `bg-kelp-edge`, `text-sea-spray`, `border-washed-timber` all work from `@theme` tokens

---

## Page Architecture

### Shared templates (single source of truth)
| Template | File | Used by |
|----------|------|---------|
| **HubPage** | `app/_components/HubPage.tsx` | `/explore-islay`, `/islay-travel`, `/accommodation` |
| **GuideSpokeLayout** | `app/_components/GuideSpokeLayout.tsx` | `/explore-islay/[slug]`, `/islay-travel/[slug]` |

### Page files are config-only
Hub and spoke page files (~90 lines each) contain ONLY:
- Data fetching (GROQ queries)
- Config object (breadcrumbs, labels, fallback images, related guides)
- `return <SharedTemplate config={config} />`

**Never duplicate rendering logic in page files.** All rendering lives in the shared templates.

### Shared data
| Query | File | Used by |
|-------|------|---------|
| `getProperties()` | `lib/queries.ts` | Homepage, guide spokes, accommodation hub, about page |

### Shared components
| Component | File | Purpose |
|-----------|------|---------|
| `PropertyCardGrid` | `components/PropertyCardGrid.tsx` | Property cards with image, bullets, highlights |
| `EntityCard` | `components/EntityCard.tsx` | Entity listing cards (sand variant for guide pages) |
| `CanonicalBlock` | `components/CanonicalBlock.tsx` | Canonical content block (full/teaser/compact) |
| `BlockRenderer` | `components/BlockRenderer.tsx` | Maps block references to CanonicalBlock |

### URL structure
```
/                           ← Homepage
/accommodation              ← Hub (HubPage)
/accommodation/[slug]       ← Property page (unique template)
/explore-islay              ← Hub (HubPage)
/explore-islay/[slug]       ← Guide spoke (GuideSpokeLayout)
/islay-travel               ← Hub (HubPage)
/islay-travel/[slug]        ← Travel spoke (GuideSpokeLayout)
```

The two spoke paths (`/explore-islay/[slug]` and `/islay-travel/[slug]`) exist as separate Next.js routes because the URL structure matters for SEO/AI retrieval — travel intent vs explore intent as distinct hub-and-spoke clusters. Both use the same `GuideSpokeLayout` template with different config.

### Guide page features
- **Two layout variants**: Overview (first block, 3-col with vertical label + sticky RHC nav) → Spread (all others, heading left + body right)
- **Gallery image pool**: `galleryImages` array on `guidePage` schema — template picks by index at fixed insertion points
- **Pull quote**: `pullQuote` field — dedicated editorial sentence, auto-extracted if not set
- **Quick nav**: RHC sticky nav built from all heading sources (content blocks, editorial, entities, FAQs)
- **Anchor navigation**: all h2/h3 headings rendered with `id` attributes, `scroll-padding-top: 80px` for fixed header

---

## Canonical Block System

The site uses a canonical content block architecture. Core principle: repeated content has a single source of truth in Sanity, rendered as either `full` or `teaser` depending on page context.

**22 canonical blocks** are defined — each with:
- `blockId` — lowercase-with-hyphens identifier
- `fullContent` — PortableText (rendered on the block's canonical home page)
- `teaserContent` — PortableText (rendered as a summary on other pages)
- `teaserLink` — link back to canonical home

**Rule:** Never edit repeated content inline on a page. Edit the canonical block in Sanity Studio — all pages referencing it update automatically.

Full block list: `~/dev/reference/pbi/content/CANONICAL-BLOCKS-MERGED-v4.md` (22 blocks, incl. blocks 17–22 guide FAQs)
Schema: `docs/schemas/SANITY-SCHEMA-FINAL.md`

---

## Critical Facts

These must be consistent across all content. Do not approximate.

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

## Naming Conventions

**Properties — always use full names:**
- ✅ Portbahn House (not "Portbahn")
- ✅ Shorefield Eco House (in titles) / Shorefield (in running copy)
- ✅ Curlew Cottage (not "Curlew")

**Routes:**
- `/accommodation/portbahn-house`
- `/accommodation/shorefield-eco-house`
- `/accommodation/curlew-cottage`

**blockIds:** lowercase with hyphens only — e.g. `ferry-basics`, `trust-signals`, `about-us`

---

## Development Commands

```bash
npm run dev       # Start Next.js dev server
npm run build     # Production build
npm run lint      # Run ESLint
```

```bash
npx sanity dev    # Start Sanity Studio (localhost:3333)
npx sanity deploy # Deploy Sanity Studio
```

---

## Git Policy

### Before starting work
- `git status` — confirm clean working directory
- For significant work (>1 file or breaking changes): create a feature branch
  ```bash
  git checkout -b feature/descriptive-name
  ```

### During work
- Commit after each logical unit — not just at the end
- Conventional commits format:
  ```
  feat: add canonicalBlock schema type
  fix: resolve GROQ query for block references
  docs: update implementation brief
  chore: move stale handoff files to _claude-handoff/
  ```

### Before committing — ask first for:
- Changes to `sanity/schemas/`
- Database migrations or data imports
- `package.json`, `tsconfig.json`, configuration files
- Anything that could break production

### Auto-commit permitted for:
- Documentation updates
- New component files
- Test files
- Minor bug fixes with clear description

### Rollback strategy
- Preserve rollback capability — never force push to `main` without explicit permission
- For Sanity data: keep exports in `data/exports/` with timestamps before schema changes
- Sanity backup command: `sanity documents export --types page,property --out data/exports/backup-YYYY-MM-DD.ndjson`

### Branch strategy
- `main` — production (deploys to Vercel automatically)
- `dev` — working branch
- Feature branches for larger pieces of work

---

## Token Management

- **Every ~25k tokens:** Provide checkpoint summary (work done, remaining tasks, suggested commit point)
- **At ~150k tokens (75%):** Commit all work, produce session handoff doc, stop
- **Large operations** (data generation, bulk imports): use Task tool to spawn sub-agents
- **Session end:** Update `~/dev/_work/pbi/_context.md`, then update `~/dev/ecosystem/PROJECT-STATUS.md` (cross-site status — lives in a separate repo, easy to forget)

### Session handoff format
```markdown
## Session Summary

### Completed:
- [task] — commit [hash]

### In Progress:
- [task] — [% complete, what's needed to finish]

### Next Session:
1. Continue from commit [hash]
2. [specific next tasks]
```

---

## Sanity Notes

- Dataset: **production** — treat all data operations with care
- Always export before schema changes: `sanity documents export --types page,property --out data/exports/backup-YYYY-MM-DD.ndjson`
- Keep backups in `data/exports/` with ISO timestamps
- Schema canonical location: `sanity/schemas/`
- Schema spec (reference, not code): `docs/schemas/SANITY-SCHEMA-FINAL.md`
