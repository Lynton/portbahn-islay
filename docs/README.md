# Portbahn Islay - Documentation Structure

**Project:** Portbahn Islay Self-Catering Properties
**Updated:** 2026-01-23

---

## Quick Start for New Sessions

**READ FIRST:** [`WORKING-NOTES.md`](./WORKING-NOTES.md) - Contains current status, key decisions, pending work, and UI/UX notes for session continuity.

---

## Directory Structure

```
docs/
├── README.md                    # This file
├── WORKING-NOTES.md             # Session-to-session context (READ FIRST)
├── architecture/                # Schema, data, and system architecture
│   ├── ENHANCED-SCHEMA-SPECIFICATION.md
│   ├── DATA-MIGRATION-STRATEGY.md
│   └── SCHEMA-IMPLEMENTATION-HANDOFF.md
├── content/                     # Content strategy and briefs
│   ├── PBI-NUANCE-BRIEF-ENHANCED.md
│   ├── PB-Reviews-Working.md
│   └── SHF-Reviews-Working.md
└── design/                      # Visual design and UI specs
    ├── bjr_design_system_brief_v_1.md
    ├── bjr_typography_interaction_rules.md
    ├── pbi_cms_schema_v_1.md
    ├── pbi_internal_linking_map_v_1.md
    ├── pbi_page_layout_briefs_v_1.md
    └── pbi_sitemap_ia_v_2.md
```

---

## Architecture Docs

### ENHANCED-SCHEMA-SPECIFICATION.md
Complete Sanity schema specification with 14 new fields for personality-driven, AI-optimized content.

**Contains:**
- Field definitions with TypeScript types
- Validation rules
- Import mapping examples
- AI optimization strategy

**Use for:** Schema implementation, understanding data model

---

### DATA-MIGRATION-STRATEGY.md
Strategy for migrating from current production data to enhanced schema.

**Contains:**
- Current state analysis
- Field-by-field mapping (existing → enhanced)
- Portbahn, Shorefield, and Curlew data transformations
- Import/export procedures
- Rollback plan

**Use for:** Data migration, understanding what's changing

---

### SCHEMA-IMPLEMENTATION-HANDOFF.md
Step-by-step implementation guide for adding 14 new fields to Sanity schema.

**Contains:**
- Implementation checklist
- Copy-paste TypeScript code
- Testing requirements
- Known issues and gotchas

**Use for:** Schema implementation (Claude Code handoff)

---

## Content Docs

### PBI-NUANCE-BRIEF-ENHANCED.md
Complete site nuance brief integrating 600+ guest reviews into property personalities.

**Contains:**
- Property personalities ("The View House", "The Character House")
- Guest superlatives and magic moments
- Review-validated positioning
- Target audiences and perfect-for profiles
- 20 FAQ questions
- Voice/tone guidelines
- SEO/AEO/GEO strategy

**Use for:** Content creation, understanding brand voice, copywriting

---

### PB-Reviews-Working.md
Synthesis of 226 reviews for Portbahn House across Airbnb, Booking.com, and Google.

**Contains:**
- Core experience pillars
- Language patterns from guests
- Friction points and how guests frame them
- Review themes and frequency

**Use for:** Understanding Portbahn's personality, writing copy

---

### SHF-Reviews-Working.md
Synthesis of 156 reviews for Shorefield across all platforms.

**Contains:**
- "Real home" positioning
- Owner context and character
- Nature/eco themes
- Review language bank

**Use for:** Understanding Shorefield's personality, writing copy

---

## Design Docs

Visual design system, page layouts, and UI specifications for the frontend.

**Use for:** Frontend implementation, Figma design, component building

---

## Related Directories

### `/data/`
```
data/
├── exports/
│   └── production-2026-01-21/    # Full Sanity export (backup)
│       ├── data.ndjson
│       ├── assets.json
│       └── images/
└── imports/                       # Enhanced data ready for import (to be generated)
```

### `/sanity/`
Sanity CMS schemas, studio configuration, and plugins.

---

## Workflow

### Current Phase: Schema Enhancement & Data Migration

**1. Schema Implementation** (Next - Claude Code)
- Read: `architecture/SCHEMA-IMPLEMENTATION-HANDOFF.md`
- Edit: `/sanity/schemas/property.ts`
- Deploy to Sanity Studio

**2. Enhanced Data Generation** (Claude Code)
- Read: `architecture/DATA-MIGRATION-STRATEGY.md`
- Source: `/data/exports/production-2026-01-21/data.ndjson`
- Reference: `content/PBI-NUANCE-BRIEF-ENHANCED.md`
- Output: `/data/imports/` (3 enhanced JSON files)

**3. Import Enhanced Data**
- Via Sanity CLI or Studio
- Verify in Sanity Studio

**4. Frontend Implementation** (Later - Cursor)
- Reference: `design/` folder
- Build NextJS components
- Schema.org markup

---

## Key Principles

**Entity-First Architecture**
- One primary entity per page
- Clear identity, consistent representation
- Relationships explicit

**AI-First Optimization (AEO/GEO/SEO)**
- Passage-level content design
- Entity framing in schema
- Trust signals embedded
- Review data structured for AI extraction

**Personality-Driven Content**
- Guest superlatives from 600+ reviews
- Magic moments (experiential patterns)
- Honest friction (transparency)
- Review-validated positioning

---

## Document Versions

All documents are living and versioned via git. Check commit history for changes.

**Major Updates:**
- 2026-01-23: Property page optimised for AI search playbook (10/10), working notes established
- 2026-01-21: Enhanced schema specification and migration strategy created
- Earlier: Design system and initial CMS schema

---

## Questions?

For architecture/schema questions: See `architecture/` docs
For content strategy: See `content/` docs
For design system: See `design/` docs
