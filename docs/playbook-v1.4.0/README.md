# BJR-PBI AI Search Playbook v1.4.0

## About This Playbook

A comprehensive framework for building AI-search-optimized websites that work across modern discovery surfaces (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini) while maintaining human-first editorial quality.

Developed for the Isle of Jura & Islay accommodation ecosystem:
- **isleofjura.scot** - Primary authority / DMO site
- **bothanjuraretreat.co.uk** - Secondary accommodation site
- **portbahnislay.co.uk** - Secondary accommodation site

## What's New in v1.4

### Vector Embedding Workflows & Practical Tooling (February 2026)

**1. Screaming Frog v22+ Vector Workflows (07-02) ⭐ NEW**
- Five operational workflows: centroid analysis, semantic similarity, semantic search, content clusters, paragraph-level competitive scoring
- Step-by-step SF configuration for embedding analysis
- Model selection guide (Gemini, OpenAI, Ollama)
- Dimension reduction tips and cost guidance

**2. Site-Level Vector Coherence (04-04) ⭐ NEW**
- Centroid concept: how AI systems calculate aggregate site authority from embeddings
- Practical audit workflow using SF v22+ Low Relevance filter
- Decision rules for ecosystem content placement

**3. Vector-Based Internal Link Discovery (02-05) ⭐ NEW**
- Three methods: SF Semantic Search, Semantically Similar filter, export + cross-reference
- Cosine similarity thresholds for link vs cannibalisation decisions
- Integration with existing internal linking strategy

**4. Paragraph-Level Competitive Scoring (07-02) ⭐ NEW**
- Advanced workflow for scoring individual paragraphs against target queries
- Python/Colab methodology with tool references
- Passage-level retrieval (02-04) made auditable

### What's New in v1.3

### Four Strategic Additions (January 2026)

**1. Query Fan-Out Module (01-05) ⭐ NEW**
- Explicit explanation of synthetic query generation
- **Data:** 10-28 queries per prompt, 95% with no search volume
- **Domain saturation effect:** 1 appearance = 9.7%, 7+ = 80%+ citation rate
- Why multi-query coverage matters
- Integration with existing playbook modules

**2. Tools & Platforms Guide (07-02) ⭐ NEW**
- Curated tool recommendations for implementation
- Query fan-out analysis tools (QFOria, Profound, MarketBrew)
- Workflow automation (N8N, Crew.AI)
- Local AI infrastructure (Ollama)
- Integration patterns and selection strategy
- Privacy-first approach with open-source emphasis

**3. Technical Context Appendix (Appendix A) ⭐ NEW**
- Optional technical background on RAG, embeddings, vector databases
- Explains how AI agents implement retrieval strategies
- Maps playbook recommendations to technical implementation details
- Answers common technical questions
- **Not required for successful playbook implementation**

**4. Enhanced Semantic Guidance**
- **Semantic triples pattern** added to 03-02
- Practical triple writing guidance in 04-01
- Expanded query fan-out validation in 06-02 with research data
- Domain saturation strategy in 06-05 with ecosystem coordination examples

### Refinements
- Strengthened breadth vs depth rationale with iPullRank QFO data
- Added multi-site saturation coordination strategy
- Incorporated iPullRank research and tooling recommendations
- Validated approach against Mike King's chunking refutation article

---

## Playbook Structure

### Module 01: Mental Models (Foundation)
- 01-01: Relevance Engineering vs SEO
- 01-02: How AI Search Actually Works
- 01-03: Visibility vs Traffic
- 01-04: Ranking Is the Wrong Abstraction
- 01-05: Query Fan-Out and Synthetic Queries ⭐ NEW v1.3

### Module 02: Retrieval Engineering (Technical)
- 02-01: Retrieval vs Ranking
- 02-02: Crawlability for AI Bots
- 02-03: Rendering Strategies for AI Search
- 02-04: Passage-Level Retrieval
- 02-05: Internal Linking as Retrieval Paths

### Module 03: Meaning & Schema (Semantic)
- 03-01: Entity-First Site Architecture
- 03-02: How LLMs Build Entity Graphs ✏️ UPDATED v1.3
- 03-03: Schema as Meaning Transport
- 03-04: JSON-LD Graph Strategy
- 03-05: Entity Consistency and Drift

### Module 04: Content for Synthesis (Writing)
- 04-01: Writing for Passage Extraction ✏️ UPDATED v1.3
- 04-02: Chunking and Section Design ✏️ UPDATED v1.2
- 04-03: Question-Led Content Structures
- 04-04: Avoiding Semantic Noise
- 04-05: Good vs Bad Examples

### Module 05: Zero-Click Visibility (Strategy)
- 05-01: Zero-Click Visibility
- 05-02: Mentions vs Citations
- 05-03: Brand Narrative Control
- 05-04: Community and External Surfaces
- 05-05: Measuring Visibility Without Clicks

### Module 06: Application Playbooks (Tactical)
- 06-01: Site Rebuild Playbook
- 06-02: Page Design for AI Search ✏️ UPDATED v1.3
- 06-03: Entity Mapping Workflow
- 06-04: Schema Decision Tree
- 06-05: Multi-Site Coordination Rules ✏️ UPDATED v1.3

### Module 07: Checklists & Patterns (Operational)
- 07-01: AI Search Practical Checklist
- 07-02: Tools and Platforms ⭐ NEW v1.3

### Module 08: PBI-BJR Specific Notes (Project-Specific)
- 08-01: BJR AI-First Page Spec Framework
- 08-02: PBI AEO Content Standards
- 08-03: PBI FAQ Strategy

### Appendix
- Appendix A: How AI Agents Work (Technical Context) ⭐ NEW v1.3.1

---

## Core Principles

**Human-First, AI-Friendly**
- Content must serve human users first
- Structure should make meaning easily extractable by AI systems
- "Fixed spine, flexible skin" - clear facts wrapped in expressive language

**Entity-First Architecture**
- Pages are containers for entity representations
- One primary entity per page
- Consistent entity definitions across the ecosystem

**Passages Over Pages**
- AI systems retrieve passages, not pages
- Each section should be independently extractable
- But sections exist within coherent, comprehensive pages

**Query Fan-Out Reality**
- AI systems generate 10-28 synthetic queries per user prompt
- 95% have no traditional search volume
- Domain saturation (7+ appearances) = 80%+ citation rate
- Multi-query coverage beats narrow optimization

**Retrieval → Interpretation → Synthesis**
- Optimize for the full pipeline, not just ranking
- Technical accessibility + semantic clarity + trust signals

**Zero-Click Influence**
- Visibility precedes traffic
- Being cited > being clicked
- Brand narrative control across surfaces

---

## Sources & Influences

This playbook synthesizes insights from:
- **iPullRank / Mike King** - Relevance Engineering framework, AI Mode analysis, Query Fan-Out research
- **Search Matrix** - Technical foundations, retrieval mechanics
- **Semrush Zero-Click Research** - Zero-click visibility patterns
- **BrightonSEO AI Search Playbook** - Practical implementation guidance
- **Original research & testing** - Multi-site ecosystem application

### Recent Validation (January 2026)

**Mike King's "Misinformation About Chunking" article:**
- Directly refutes Google's Danny Sullivan on chunking tactics
- Validates passage-level optimization with vector similarity data
- Confirms structured content performs better across all paradigms
- Aligns completely with this playbook's approach

**Key quote:**
> "We are no longer just formatting for 'skimmability' or 'dwell time.' We are formatting for Programmatic Legibility."

Our playbook has been doing this from v1.0.

---

## Usage Guidelines

**For Strategy & Architecture**
- Read Modules 01-03 first to understand mental models
- Use Module 06 for tactical implementation planning
- Reference Module 07 checklists before publishing

**For Content Creation**
- Focus on Module 04 for writing guidance
- Use 08-02 and 08-03 for project-specific standards
- Apply 07-01 checklist to validate each page

**For Technical Implementation**
- Module 02 covers crawlability, rendering, linking
- Module 03 covers schema and entity modeling
- 06-01 provides complete rebuild workflow

**For Tool Selection**
- 07-02 provides curated recommendations
- Emphasizes open-source and privacy-first approaches
- Integration patterns for N8N, Ollama, and workflow automation

**For Technical Stakeholders**
- Appendix A provides optional background on RAG systems, embeddings, and vector databases
- Explains how AI agents implement the strategies this playbook recommends
- Not required for successful playbook implementation

---

## Version History

**v1.3** (January 2026)
- Added query fan-out / synthetic queries module (01-05)
- Added tools & platforms operational guide (07-02)
- Added technical context appendix (Appendix A)
- Enhanced semantic triple guidance (03-02, 04-01)
- Expanded multi-query coverage rationale with research data (06-02)
- Added domain saturation strategy (06-05)
- Incorporated iPullRank QFO research and tooling
- Validated against Mike King's chunking defense article

**v1.2** (January 2025)
- Added query fan-out / breadth vs depth strategy (06-02)
- Added anti-fragmentation guidance (04-02)
- Aligned with latest Google guidance on content structure

**v1.1** (December 2024)
- Expanded content synthesis module with conversational flow
- Added latent follow-up intent guidance
- Enhanced practical examples throughout

**v1.0** (December 2024)
- Initial release
- Complete framework covering mental models through application
- Project-specific guidance for PBI/BJR ecosystem

---

## Contact & Feedback

This is a living document. As AI search systems evolve, this playbook will be updated to reflect new learnings and validated approaches.

**Maintained by:** Lynton Davidson
**Project:** Isle of Jura & Islay Accommodation Ecosystem
**Last Updated:** February 17, 2026
**Next Review:** April 2026
