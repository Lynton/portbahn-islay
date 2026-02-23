# CLAUDE.md — Portbahn Islay
**Updated:** 2026-02-20
**Supersedes:** .clauderc

---

## Project Overview

Portbahn Islay is a holiday rental website for three properties in Bruichladdich, Isle of Islay, Scotland, managed by Pi & Lynton.

**Tech stack:** Next.js (App Router) + TypeScript + Sanity CMS v3 + Tailwind CSS + Vercel
**Sanity dataset:** production

**Properties:**
- Portbahn House — sleeps 8, 3 bedrooms, dogs welcome, ground floor bedrooms
- Shorefield Eco House — sleeps 6, 3 bedrooms, dogs welcome, bird hides, eco-house
- Curlew Cottage — sleeps 6, 3 bedrooms, pet-free, walled garden

---

## Environment Architecture

This repo is part of a structured three-repo environment. Know where you sit:

| Environment | Path | Role |
|---|---|---|
| **sites/pbi/** | `~/dev/sites/pbi/` | **Here** — code, schemas, git history |
| **ecosystem/** | `~/dev/ecosystem/` | Shared authority — playbook, ops, strategy |
| **cw/** | `~/dev/cw/` | Cowork working files — content, design, research |
| **GitHub/Vercel** | Remote | Version control + deployment pipeline |
| **Cursor** | Tactical | Code refinement on this repo |

**Flow:** Cowork (cw/) produces content specs → sites/pbi/ implements → GitHub/Vercel deploys

**You receive specs via:** `~/dev/cw/pbi/content/` (post-restructure)
**You do not create content strategy** — implement what the specs say.

### Key paths (post-restructure)

```
~/dev/
├── ecosystem/          ← git repo A: playbook, ops, strategy
├── sites/
│   └── pbi/           ← git repo B: this repo (code)
└── cw/                ← git repo C: content, design, research
    └── pbi/
        ├── content/   ← canonical content docs live here
        ├── design/    ← design assets and briefs
        ├── reviews/   ← property review files
        └── nuance/    ← brief + property details
```

---

## Current Phase (2026-02-23)

**Active build: PBI (Portbahn Islay)**

All 12 pages built. Canonical block system live end-to-end. Next: hero images in Studio, then UI redesign with v0 (property pages first).

**Start here:**
1. Read `~/dev/ecosystem/PROJECT-STATUS.md` — cross-environment status, current blockers, next actions
2. Check git log to orient on what's already done
3. Check `~/dev/cw/pbi/content/` for latest content specs

---

## Key Files

### In this repo (code + schema)
| What | Where |
|------|-------|
| **Sanity schema spec** | `docs/schemas/SANITY-SCHEMA-FINAL.md` |
| **Sanity build spec** | `docs/content/SANITY-BUILD-SPEC.md` |
| **Sanity schemas (code)** | `sanity/schemas/` |
| **Page components** | `app/` |
| **Shared components** | `components/` |
| **Data architecture** | `docs/architecture/` |

### In ecosystem/ (shared authority)
| What | Where |
|------|-------|
| **Project status** | `~/dev/ecosystem/PROJECT-STATUS.md` |
| **AI Search Playbook** | `~/dev/ecosystem/playbook-v1.4.0/` |

### In cw/pbi/ (Cowork content files)
| What | Where |
|------|-------|
| **Canonical blocks** | `~/dev/cw/pbi/content/CANONICAL-BLOCKS-MERGED-v4.md` |
| **Tone of voice** | `~/dev/cw/pbi/PORTBAHN-TONE-OF-VOICE-SKILL.md` |
| **Content architecture** | `~/dev/cw/pbi/content/CONTENT-ARCHITECTURE-MVP.md` |
| **Homepage content** | `~/dev/cw/pbi/content/HOMEPAGE-V3-CORRECTED.md` |
| **Getting Here content** | `~/dev/cw/pbi/content/GETTING-HERE-V3-CORRECTED.md` |
| **Explore Islay content** | `~/dev/cw/pbi/content/EXPLORE-ISLAY-V3-CORRECTED.md` |
| **Property FAQs** | `~/dev/cw/pbi/content/PROPERTY-FAQ-V3-CORRECTED.md` |
| **FAQ data (35 Q&As)** | `~/dev/cw/pbi/content/FAQS-STRUCTURED-PORTBAHN-ISLAY.md` |
| **Guide page content** | `~/dev/cw/pbi/content/guides/` |
| **Nuance brief** | `~/dev/cw/pbi/nuance/PBI-NUANCE-BRIEF-ENHANCED.md` |

---

## Canonical Block System

The site uses a canonical content block architecture. Core principle: repeated content has a single source of truth in Sanity, rendered as either `full` or `teaser` depending on page context.

**22 canonical blocks** are defined — each with:
- `blockId` — lowercase-with-hyphens identifier
- `fullContent` — PortableText (rendered on the block's canonical home page)
- `teaserContent` — PortableText (rendered as a summary on other pages)
- `teaserLink` — link back to canonical home

**Rule:** Never edit repeated content inline on a page. Edit the canonical block in Sanity Studio — all pages referencing it update automatically.

Full block list: `~/dev/cw/pbi/content/CANONICAL-BLOCKS-MERGED-v4.md` (22 blocks, incl. blocks 17–22 guide FAQs)
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
