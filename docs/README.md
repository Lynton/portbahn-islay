# Portbahn Islay — Code Documentation
**Updated:** 2026-02-23 (post dev-restructure)

---

## What's Here

This `docs/` folder contains **code-adjacent documentation only** — schema specs, data architecture, and the build specification. All content strategy, design docs, and CW working files have moved to the `cw/` environment.

```
docs/
├── README.md                         # This file
├── architecture/                     # Schema and data architecture
│   ├── ENHANCED-SCHEMA-SPECIFICATION.md
│   ├── DATA-MIGRATION-STRATEGY.md
│   └── SCHEMA-IMPLEMENTATION-HANDOFF.md
├── content/
│   └── SANITY-BUILD-SPEC.md          # Sanity build reference (CC only)
└── schemas/
    └── SANITY-SCHEMA-FINAL.md        # Canonical schema spec
```

---

## Architecture Docs

### ENHANCED-SCHEMA-SPECIFICATION.md
Complete Sanity schema specification with fields for personality-driven, AI-optimized content.

### DATA-MIGRATION-STRATEGY.md
Strategy for migrating from production data to enhanced schema. Field-by-field mapping, import/export procedures, rollback plan.

### SCHEMA-IMPLEMENTATION-HANDOFF.md
Step-by-step schema implementation guide with TypeScript code, testing requirements, and known issues.

---

## Content & Design Docs

Content strategy, design briefs, canonical blocks, and tone of voice have moved to the Cowork environment:

```
~/dev/cw/pbi/
├── content/                          ← canonical content docs
│   ├── CANONICAL-BLOCKS-MERGED-v4.md
│   ├── CONTENT-ARCHITECTURE-MVP.md
│   ├── guides/                       ← guide page content
│   └── ...
├── design/                           ← design assets and briefs
├── nuance/                           ← nuance brief and property details
└── reviews/                          ← property review files

~/dev/ecosystem/
└── PROJECT-STATUS.md                 ← cross-environment status
```

---

## Sanity Notes

- Dataset: **production** — treat all data operations with care
- Always export before schema changes: `sanity documents export --types page,property --out data/exports/backup-YYYY-MM-DD.ndjson`
- Schema canonical location: `sanity/schemas/`
- Schema spec (reference, not code): `docs/schemas/SANITY-SCHEMA-FINAL.md`
