# AI Search Playbook - Changelog

## Version 1.4.0 (February 17, 2026)

**Type:** Major update  
**Focus:** Vector embedding workflows, practical tooling, site-level coherence

### Added
- Module 04-04: Site-Level Vector Coherence section (centroid concept, ecosystem application, audit workflow)
- Module 02-05: Vector-Based Internal Link Discovery section (three methods, thresholds, SF workflow)
- Module 07-02: Screaming Frog v22+ Vector Embedding Workflows (5 workflows: centroid analysis, semantic similarity, semantic search, content clusters, paragraph-level competitive scoring)
- Module 07-02: New Pattern 1 — SF Vector Audit integration pattern
- Module 07-02: Paragraph-Level Competitive Scoring advanced workflow (Python/Colab methodology)
- Appendix A: Site-level centroid and authority concept

### Enhanced
- Module 07-02: Ollama section updated with SF v22 native integration, specific model recommendations (embeddinggemma, mxbai-embed-large)
- Module 07-02: Starter Stack updated to reflect SF v22 embedding capabilities as primary tool
- Module 07-02: Configuration tips for dimension reduction, content area refinement, model selection, cost guidance

### Validation
- Assessed against Mike King / Wix AI Search Lab vector embedding article (Feb 2026)
- Validated against Screaming Frog v22 release documentation and tutorials
- Incorporated iPullRank relevance engineering at scale methodology
- Cross-referenced Gus Pelogia (Indeed) embedding mapping workflows
- Confirmed Dejan SEO dimension reduction research (1024→256, minimal accuracy loss)

### Key Insight
Screaming Frog v22 natively operationalises several core playbook principles (passage-level retrieval, entity coherence, centroid-based authority, internal link discovery) that previously required custom tooling or manual processes. SF paid licence is now a recommended baseline tool for the ecosystem.

---

## Version 1.3.1 (January 23, 2026)

**Type:** Minor update  
**Focus:** Technical context documentation

### Added
- Appendix A: Technical Context (RAG, embeddings, vector databases)
- Optional background for stakeholders wanting implementation details
- Maps playbook strategies to technical realities

### Changed
- Updated README.md to reference Appendix A
- Added "For Technical Stakeholders" usage guideline
- Updated "Last Updated" date across documentation

### Skill-Specific Changes
- Created SKILL.md (condensed strategic guide, ~25KB)
- Created quick-reference.md (operational guide, ~8KB)
- Established skill structure for multi-context availability

---

## Version 1.3.0 (January 16, 2026)

**Type:** Major update  
**Focus:** Query fan-out research and tooling

### Added
- Module 01-05: Query Fan-Out and Synthetic Queries
- iPullRank research data (10-28 queries per prompt, 95% no volume)
- Domain saturation effect documentation (7+ appearances = 80%+ citation rate)
- Module 07-02: Tools and Platforms operational guide
- QFOria, Profound, MarketBrew tool recommendations
- N8N, Ollama, Crew.AI workflow automation guidance

### Enhanced
- Module 03-02: Added semantic triples pattern
- Module 04-01: Practical triple writing guidance
- Module 06-02: Expanded breadth vs depth rationale with research data
- Module 06-05: Domain saturation strategy with ecosystem examples

### Validation
- Aligned with Mike King's "Programmatic Legibility" framework
- Incorporated iPullRank QFO research
- Validated against chunking defense article

---

## Version 1.2.0 (January 14, 2025)

**Type:** Major update  
**Focus:** Query fan-out strategy and anti-fragmentation

### Added
- Module 06-02: Breadth vs Depth section
- Strategic guidance on multi-query coverage
- Anti-fragmentation guidance in Module 04-02

### Enhanced
- Clarified proper chunking approach (sections within pages, not separate pages)
- Aligned with Google guidance on content structure
- Strengthened passage extraction rationale

---

## Version 1.1.0 (December 2024)

**Type:** Minor update  
**Focus:** Content synthesis and conversational flow

### Added
- Conversational flow section in Module 04-02
- Latent follow-up intent guidance in Module 04-03
- Enhanced practical examples throughout

### Enhanced
- Expanded content synthesis module
- Added section ordering guidance
- Improved query-led content patterns

---

## Version 1.0.0 (December 2024)

**Type:** Initial release  
**Focus:** Complete framework foundation

### Added
- Module 01: Mental Models (4 files)
- Module 02: Retrieval Engineering (5 files)
- Module 03: Meaning & Schema (5 files)
- Module 04: Content for Synthesis (5 files)
- Module 05: Zero-Click Visibility (5 files)
- Module 06: Application Playbooks (5 files)
- Module 07: Checklists & Patterns (1 file)
- Module 08: PBI-BJR Specific Notes (3 files)

### Established
- Entity-first architecture principles
- Passage-level retrieval framework
- Fixed spine, flexible skin writing pattern
- Multi-site ecosystem coordination strategy
- Zero-click visibility approach
- Practical implementation checklists

---

## Upcoming (Planned)

### Version 1.5.0 (Q3 2026)
**Potential additions:**
- Enhanced multi-platform citation tracking guidance
- Passage-level analytics patterns
- Entity graph visualization examples
- Additional tool integrations
- Case studies and validation data from ecosystem sites

**Review scheduled:** July 2026

---

## Version History Summary

| Version | Date | Focus | Files Added/Updated |
|---------|------|-------|---------------------|
| 1.4.0 | Feb 17, 2026 | Vector workflows + SF v22 | 5 updated (04-04, 02-05, 07-02, Appendix A, changelog) |
| 1.3.1 | Jan 23, 2026 | Technical appendix + skill | +3 (Appendix A, SKILL.md, quick-ref) |
| 1.3.0 | Jan 16, 2026 | Query fan-out + tools | +2 (01-05, 07-02), ~4 updated |
| 1.2.0 | Jan 14, 2025 | Anti-fragmentation | ~2 updated (04-02, 06-02) |
| 1.1.0 | Dec 2024 | Content synthesis | ~3 updated |
| 1.0.0 | Dec 2024 | Initial release | 34 files |

---

## Maintenance Notes

**Skill file updates required when:**
- Core principles change
- New decision trees emerge
- Tool recommendations shift
- Project file structure changes

**Full playbook updates required when:**
- New research validates/challenges approach
- AI system behavior changes significantly
- Major platform updates affect strategy

**Current status:** Stable, validated, production-ready

---

## Contributing

This playbook is maintained for the Isle of Jura & Islay accommodation ecosystem but principles apply broadly.

**Feedback welcome on:**
- Tool recommendations and integration patterns
- Additional decision trees or quick checks
- Validation data from other implementations
- Emerging best practices

**Maintained by:** Lynton Davidson  
**Contact:** Via project discussions  
**Next review:** April 2026
