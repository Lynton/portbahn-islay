# Project Status
Updated: 2026-02-20

## Current Phase
Cowork fully restructured. Outbox staged with 11 PBI implementation files. Design materials consolidated into site-specific folders. Next: audit /dev and transfer outbox contents.

## Active Sites
- **PBI (Portbahn Islay):** Content blocks finalised (V3-CORRECTED), Sanity schema spec ready, FAQ strategy complete (35 FAQs). Claude Code handoff doc exists. Awaiting schema implementation in /dev.
- **BJR (Bothan Jura Retreat):** Design system documented (typography, colour, brand philosophy). SEO research in place. Content not started. Previous recommendation: start BJR first due to completeness of design inputs — decision pending.
- **IoJ (Isle of Jura / isleofjura.scot):** Placeholder only. Primary DMO authority site in the ecosystem.

## Last 5 Decisions
1. 2026-02-20 — Cowork confirmed as strategic home; /dev receives handoff files for Claude Code
2. 2026-02-20 — temp_intake kept as permanent intake folder for non-Cowork sessions (mobile, Projects)
3. 2026-02-20 — PROJECT-STATUS.md adopted as cross-environment sync file
4. 2026-02-20 — Droid/Factory still under consideration; strategy doc moved to docs/strategy/
5. 2026-02-20 — Cowork folder restructured per project-ops-architecture.md

## Next Actions
- Audit /dev repo structure (mount in next session) — Cowork
- Establish CLAUDE.md and .cursorrules alignment — Cowork → /dev
- Confirm BJR vs PBI build priority — Lynton decision
- Create playbook essence markdown from PDF — Cowork
- Begin schema implementation for whichever site is prioritised — Claude Code

## Blockers
- /dev not yet audited from Cowork (single-folder mount limitation)
- BJR vs PBI build order undecided

## File Flow
- `temp_intake/` → inbox (non-Cowork sessions save here)
- `sites/`, `docs/`, etc. → canonical homes (reviewed and placed)
- `outbox/` → staged for transfer to /dev
- `archive/` → superseded files

## Key Files (canonical locations)
- Playbook (full): `playbook-v1.4.0/`
- Playbook essence: `docs/ops/playbook-essence-v1_4.pdf` (convert to .md pending)
- PBI content specs: `sites/pbi/content/`
- PBI design: `sites/pbi/design/`
- PBI schemas (reference): `sites/pbi/schemas/`
- PBI reviews: `sites/pbi/reviews/`
- PBI nuance brief: `sites/pbi/nuance-brief.md`
- BJR design system: `sites/bjr/design/` (incl. fonts, layouts, typography rules, page spec)
- BJR design research: `sites/bjr/design-research/` (Shallish, Makgill, Kieran)
- BJR SEO research: `sites/bjr/seo-research/`
- FAQ strategy: `docs/strategy/FAQ-STRATEGY-PORTBAHN-ISLAY.md`
- Droid strategy: `docs/strategy/droid-v0-strategy.txt`
- Architecture doc: `docs/ops/project-ops-architecture.md`
- /dev handoff: `temp_intake/HANDOFF-DEV-AUDIT-2026-02-20.md`
- This file: `PROJECT-STATUS.md` (root)

## Environment Map
| Environment | Role | Status |
|---|---|---|
| Cowork | Strategic home | Active — restructured 2026-02-20 |
| Claude Code /dev | Implementation | Needs audit |
| Claude Project | Research/playbook | Needs essence + status file upload |
| Mobile | Quick capture | Saves to temp_intake |
| Cursor | Code refinement | Operates on /dev |
| v0 | UI prototyping | As needed |
| GitHub | Version control | Linked to /dev |
