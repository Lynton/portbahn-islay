# Tools and Platforms for AI Search Optimization
*(Practical recommendations for implementation)*

## TL;DR
Strategic frameworks require tactical tools.

This is a curated list of platforms that support relevance engineering workflows, passage optimization, and query fan-out analysis.

**Philosophy:** Tools amplify good strategy. They don't fix bad strategy.

---

## 1. Query Fan-Out Analysis Tools

### QFOria (iPullRank)
**URL:** https://ipullrank.com/tools/qforia  
**Purpose:** Google AI Mode query fan-out tracking  
**Key features:**
- Reveals synthetic queries AI systems generate
- Shows which queries drive citations
- Tracks query variations over time
- Free tool from iPullRank

**Use case:** Discover what fan-out queries your content should naturally cover

**Status:** Production-ready, actively maintained

---

### Profound
**URL:** https://profound.com (tool details TBD)  
**Purpose:** Most comprehensive ChatGPT query fan-out tracking  
**Key features:**
- Query variants with share metrics
- Historical query diff tracking (compare versions over time)
- Synthetic query execution monitoring (day-over-day)
- Domain saturation analysis
- Citation probability scoring

**Use case:** Deep analysis of ChatGPT retrieval patterns for specific prompts

**Status:** Production-ready, commercial tool

---

### PromptWatch
**URL:** https://promptwatch.io (verify current URL)  
**Purpose:** Query fan-out tracking with prompt-level detail  
**Key features:**
- Tracks queries generated from specific prompts
- Provides prompt construction insights
- Shows query variation patterns

**Use case:** Understanding how prompt phrasing influences fan-out behavior

**Status:** Production-ready

---

### DemandSphere
**URL:** https://demandsphere.com  
**Purpose:** First platform to track ChatGPT query fan-out  
**Key features:**
- ChatGPT-specific query tracking
- Early mover in QFO analysis space

**Use case:** ChatGPT optimization, audience research

**Status:** Production-ready, commercial platform

---

### MarketBrew
**URL:** https://marketbrew.ai  
**Purpose:** Google-focused QFO tool with simulation capabilities  
**Key features:**
- Generates synthetic queries with Gemini
- Reverse intersects rankings across fan-out set
- **Content Booster:** Automates content generation to close semantic gaps
- Simulates ranking changes before publishing
- RAG pipeline testing

**Use case:** Google AI Mode optimization, predictive content strategy

**Status:** Production-ready, enterprise platform

---

## 2. Screaming Frog v22+ Vector Embedding Workflows

Screaming Frog SEO Spider v22 (July 2025) introduced native vector embedding support that operationalises several core playbook principles without requiring custom code.

**Licence requirement:** Paid licence required for embedding features.

### Setup (one-time configuration)

**Step 1: Connect an AI provider**
- `Config > API Access > AI`
- Supported: **Gemini** (recommended), OpenAI, Ollama (free/local)
- You need an API key for Gemini or OpenAI; Ollama runs locally

**Step 2: Configure embedding extraction**
- `Prompt Configuration > Add from Library`
- Select: **"Extract Semantic Embeddings from Page"** (Gemini) or equivalent
- This uses the `SEMANTIC_SIMILARITY` task type, optimised for content analysis

**Step 3: Enable content storage**
- `Config > Spider > Extraction > Enable "Store HTML" and "Store Rendered HTML"`
- This ensures page text is available for embedding generation

**Step 4: Enable embedding analysis**
- `Config > Content > Embeddings > Enable Embedding Functionality`
- Check: **Semantic Similarity** (finds related/duplicate pages)
- Check: **Low Relevance** (finds centroid outliers)

**Step 5: Crawl as normal**
- Embeddings are generated automatically during the crawl
- Results appear in the AI tab and Content tab after crawl analysis

### Workflow A: Site Centroid & Low-Relevance Detection

**Purpose:** Identify pages that dilute your site's topical authority.

**What it does:** SF averages all page embeddings to calculate a site centroid, then measures each page's distance from it. Pages furthest from the centroid are flagged as low-relevance outliers.

**How to use:**
1. After crawl + analysis, go to `Content tab > Low Relevance Content` filter
2. Review flagged pages — these are semantically distant from your site's core topic
3. For each outlier, decide: improve, redirect, consolidate, or remove

**Playbook alignment:** This operationalises Module 04-04 (Avoiding Semantic Noise, Section 6: Site-Level Vector Coherence).

**For our ecosystem:** Run this separately per site. Each site should have a tight centroid:
- IoJ pages should cluster around Jura destination topics
- BJR pages should cluster around Jura accommodation
- PBI pages should cluster around Islay accommodation

Pages that appear as outliers on one site may belong on another site in the ecosystem.

### Workflow B: Semantically Similar Page Detection

**Purpose:** Find content cannibalisation and consolidation opportunities.

**How to use:**
1. After crawl, go to `Content tab > Semantically Similar` filter
2. Default threshold: 0.95 cosine similarity (adjustable down to 0.5)
3. Each page shows its closest semantic neighbour + similarity score
4. Pages above 0.95: investigate for consolidation
5. Pages 0.7-0.9: strong internal linking candidates

**Playbook alignment:** Supports Module 02-05 (Internal Linking, Section 8: Vector-Based Link Discovery) and Module 03-05 (Entity Consistency — detecting drift via duplicate coverage).

### Workflow C: Semantic Search Against Target Queries

**Purpose:** Score all pages against specific queries. Find the best page for a keyword. Identify content gaps.

**How to use:**
1. Open the right-hand **"Semantic Search"** tab
2. Enter a target query (e.g. "self catering cottage Isle of Jura pet friendly")
3. SF ranks all crawled pages by cosine similarity to the query
4. Review: Is the right page ranking highest? Are there gaps?

**Use cases:**
- **Keyword mapping:** Which page best matches each target query?
- **Internal link discovery:** Top-N results for a query = pages that should link to each other
- **Fan-out coverage check:** Test multiple synthetic queries (from Module 01-05) to verify coverage breadth
- **Competitive analysis:** Crawl a competitor site, run the same queries, compare which pages score highest

**Playbook alignment:** Directly validates Module 01-05 (Query Fan-Out) coverage. Test 10+ fan-out query variants and check whether your site has content scoring well for each.

### Workflow D: Content Cluster Visualisation

**Purpose:** Visualise how your content groups semantically. Identify gaps and orphaned topics.

**How to use:**
1. After crawl with embeddings, SF generates a visual cluster diagram
2. Semantically similar content clusters together
3. Outliers appear isolated

**Use cases:**
- Validate your information architecture matches semantic reality
- Identify topic clusters that need more supporting content
- Spot pages that are semantically orphaned

### Workflow E: Paragraph-Level Competitive Scoring (Advanced)

**Purpose:** Identify which specific paragraphs on your page (or a competitor's) perform best against a target query.

**Note:** This goes beyond SF's native page-level analysis and requires a Python/Colab step.

**Workflow:**
1. Crawl your site + competitor site with SF, extracting embeddings
2. Export page content (use `View Source > Visible Content` to see what text SF analysed)
3. In Python/Google Colab:
   - Split each page into paragraphs
   - Embed each paragraph separately (using same model as SF, e.g. Gemini or Ollama `mxbai-embed-large`)
   - Embed your target query
   - Calculate cosine similarity: each paragraph vs query
4. Compare: your best paragraph vs competitor's best paragraph per query
5. Identify which specific paragraphs to rewrite, strengthen, or replace

**Tools:**
- Gus Pelogia's [Related Pages Script](https://www.guspelogia.com/map-related-pages-embeddings) (Google Colab) — adaptable for paragraph-level analysis
- Python: Pandas, NumPy, Scikit-learn for cosine similarity calculation
- iPullRank's Relevance Doctor for pre-built passage scoring

**Relevance thresholds (paragraph-level):**
- **0.7+:** Strong paragraph — well-aligned with query intent
- **0.5-0.7:** Moderate — covers the topic but could be tighter
- **Below 0.5:** Weak — paragraph is off-topic for this query, needs rewriting or removal

**Playbook alignment:** This is Module 02-04 (Passage-Level Retrieval) and Module 04-02 (Chunking) made auditable. Each paragraph is a candidate passage — now you can score them.

### Configuration Tips

**Content area refinement:**
- `Config > Content > Area` — customise which HTML elements are included in embeddings
- Exclude: nav, footer, cookie notices, repeated boilerplate
- This produces cleaner embeddings and more accurate similarity scores

**Dimension reduction (performance):**
- Validated by Dejan SEO: reducing embedding dimensions from 1024 to 256 has minimal accuracy impact
- For Gemini: add parameter `outputDimensionality` = 256
- For OpenAI: add parameter `dimensions` = 256
- ~30% faster crawl analysis, significantly faster cluster visualisation

**Model selection:**
- **Gemini** (recommended for SF): Best balance of speed, cost, and accuracy. Native `SEMANTIC_SIMILARITY` task type
- **OpenAI** (`text-embedding-3-small`): Good quality, API costs apply
- **Ollama + embeddinggemma** (free, local): Zero API cost, runs on local GPU. Pull with `ollama pull embeddinggemma`
- **Ollama + mxbai-embed-large** (free, local): Recommended by iPullRank for content pruning work

**Cost guidance:**
- Gemini API: Generous free tier, then very low cost
- OpenAI: ~$5 per 50,000 URLs (embedding extraction)
- Ollama: Free (local compute only)

---

## 3. Passage Optimization Tools
**URL:** https://ipullrank.com/tools/relevance-doctor  
**Purpose:** Scores passage relevance in layout-aware format  
**Key features:**
- Analyzes passage-level extractability
- Layout-aware (respects heading hierarchy)
- Identifies weak semantic signals
- Provides specific improvement recommendations

**Use case:** Pre-publish passage quality check

**Status:** Production-ready, free tool

---

### BubbaChunk (iPullRank - Private/Internal)
**Status:** Not publicly available  
**Purpose:** Advanced vector similarity analysis  
**Key features:**
- Cosine similarity scoring
- Chamfer distance measurement
- Multi-aspect embedding analysis (MUVERA-style)
- Passage-level relevance scoring

**Note:** Mentioned here for reference. Similar functionality may become available in future iPullRank tools or open-source projects.

---

## 4. Workflow Automation Platforms

### N8N (Open Source - Recommended)
**URL:** https://n8n.io  
**License:** Open source (fair-code)  
**Purpose:** Visual workflow automation with 1,100+ integrations

**Key features:**
- Self-hosted or cloud deployment
- Human-in-the-loop workflows
- Webhook triggers and API calls
- Database connections
- LLM integrations (OpenAI, Anthropic, Ollama, etc.)
- Template library: https://n8n.io/workflows

**Quick start:**
```bash
# Install Node.js first, then:
npx n8n
n8n start
```

**Recommended templates:**
- #4822: Extract and analyze Google AI Overviews with LLM
- Custom: Automated passage scoring workflows
- Custom: Content gap analysis pipelines

**Use cases:**
- Automate content analysis during crawls
- Schedule passage quality checks
- Integrate QFO data with content workflows
- Build custom RAG testing pipelines

**Why we recommend N8N:**
- Privacy: Self-hosted option for sensitive data
- Flexibility: Build exactly what you need
- Cost: Free for self-hosted (no per-execution fees)
- Extensibility: Custom nodes and JavaScript functions

**Status:** Production-ready, active community

---

### Crew.AI (Open Source)
**URL:** https://www.crewai.com  
**License:** Open source  
**Purpose:** Build multi-agent AI systems

**Key features:**
- Chat-driven agent creation (no coding required)
- Code-based agent definition (Python)
- Cloud-hosted or self-hosted
- Agent orchestration and task delegation
- Memory and context management

**Use cases:**
- Multi-step content analysis workflows
- Automated research and synthesis
- Content generation with review loops
- Complex RAG pipeline orchestration

**Status:** Production-ready, rapidly evolving

---

## 5. Local AI Infrastructure

### Ollama (Open Source - Recommended)
**URL:** https://ollama.com  
**License:** Open source  
**Purpose:** Run open-source LLMs locally

**Key features:**
- Privacy-first (all processing local)
- Chat interface with web search mode
- Automatic model downloads
- API for integrations
- Fast on decent GPU (even mid-range works)
- Support for Llama, Mistral, Gemma, and many others

**Why we recommend Ollama:**
> "I prefer open source options so I can customize them to my needs and I don't have to worry about data privacy."  
> — Mike King, CEO, iPullRank

**Recommended embedding models:**
- **embeddinggemma** (Google): Best for Screaming Frog semantic similarity. Pull: `ollama pull embeddinggemma`
- **mxbai-embed-large**: Recommended by iPullRank for content pruning and relevance engineering. Pull: `ollama pull mxbai-embed-large`
- Both are free, run locally, and integrate directly with SF v22+

**Integration examples:**

**Screaming Frog v22 + Ollama (native integration):**
- `Config > API Access > AI > Ollama`
- Select embedding model (embeddinggemma or mxbai-embed-large)
- Generate embeddings during crawls — zero API cost
- Full semantic similarity, low relevance detection, and semantic search
- All processing happens locally on your GPU
- See Section 2 (Screaming Frog v22+ Vector Workflows) for detailed setup

**N8N + Ollama:**
- Build automated content analysis workflows
- No API costs, no rate limits
- Full control over model and prompts
- Privacy-compliant for client data

**Quick start:**
```bash
# Install Ollama, then:
ollama run llama3.2

# Or with web search:
# Use the chat interface at http://localhost:11434
```

**Status:** Production-ready, active development

---

## 6. Simulation & Testing Platforms

### MarketBrew (mentioned above)
**Simulation features:**
- RAG pipeline simulation
- Predicts ranking changes before publishing
- Content recommendations based on retrievability
- "What-if" scenario testing

---

### iPullRank Custom Tools
**Status:** Some public, some client-only  
**Capabilities:**
- AI Overview simulator (RAG pipeline testing)
- Retrieval probability analysis
- Passage extraction success prediction

**Note:** iPullRank builds custom tools for client needs. Public tools released occasionally.

---

## 7. Platform Selection Strategy

### Key decision factors

**1. Data privacy requirements**
- Client data → Self-hosted open source (N8N + Ollama)
- Internal data → Cloud tools acceptable
- Public data → Any tool

**2. Technical capability**
- High: Open source, customizable (N8N, Crew.AI, Ollama)
- Medium: Commercial tools with APIs (MarketBrew, Profound)
- Low: SaaS tools with UI (QFOria, Relevance Doctor)

**3. Budget constraints**
- Free tier: N8N self-hosted, Ollama, QFOria, Relevance Doctor
- Paid tier: Commercial QFO tools, cloud N8N
- Enterprise: MarketBrew, Profound, custom tooling

**4. Integration needs**
- Existing stack: Check N8N integrations list (1,100+)
- Custom workflows: Open source required
- Standard workflows: Commercial tools work

---

## 8. Recommended Tool Stacks

### Starter Stack (Free/Low-Cost)
```
1. Screaming Frog v22 (paid licence) → Crawl + vector embeddings + semantic analysis
2. Ollama + embeddinggemma → Free local embeddings for SF
3. QFOria → Query fan-out discovery
4. Relevance Doctor → Passage scoring
```

**Total cost:** SF licence only (~£199/year). Embeddings via Ollama are free.  
**Capability:** Full vector audit, centroid analysis, semantic search, internal link discovery, passage optimization, query research

---

### Intermediate Stack (Mixed)
```
1. N8N (self-hosted) → Workflow automation
2. Ollama → Local LLM processing
3. QFOria → QFO tracking
4. Relevance Doctor → Passage scoring
5. Profound OR MarketBrew → Deep QFO analysis (paid)
```

**Total cost:** $0-500/month (depending on QFO tool choice)  
**Capability:** Automated workflows, deep QFO insights, production testing

---

### Advanced Stack (Privacy-First)
```
1. N8N (self-hosted) → Orchestration
2. Ollama (multiple models) → LLM processing
3. Crew.AI (self-hosted) → Multi-agent systems
4. Screaming Frog + Ollama → Crawl analysis
5. Custom RAG pipelines → Simulation & testing
6. QFOria + Profound → QFO monitoring
```

**Total cost:** $500-1000/month (QFO tools + infrastructure)  
**Capability:** Full relevance engineering pipeline, complete privacy control

---

## 9. Tool Integration Patterns

### Pattern 1: SF Vector Audit (Recommended Starting Point)
```
Screaming Frog v22 + Gemini/Ollama → Crawl with embeddings
    ↓
Low Relevance filter → Identify centroid outliers
    ↓
Semantically Similar filter → Find cannibalisation
    ↓
Semantic Search tab → Score pages against target queries
    ↓
Export → Cross-reference with internal links for gap analysis
    ↓
Action → Prune, consolidate, link, or improve
```

### Pattern 2: Automated Crawl Analysis
```
Screaming Frog → Extract pages
    ↓
Ollama → Generate embeddings
    ↓
N8N → Score passages
    ↓
Relevance Doctor → Validate scores
    ↓
Report → Identify weak passages
```

---

### Pattern 3: QFO-Driven Content Strategy
```
QFOria/Profound → Discover fan-out queries
    ↓
N8N → Fetch current rankings
    ↓
Ollama → Analyze content gaps
    ↓
Crew.AI agents → Generate content recommendations
    ↓
Human review → Approve & implement
```

---

### Pattern 4: Pre-Launch Validation
```
Draft content → N8N workflow
    ↓
Ollama → Passage scoring
    ↓
Relevance Doctor → Validate extractability
    ↓
MarketBrew → Simulate RAG performance
    ↓
Approve/Revise → Publish
```

---

## 10. When NOT to Use Tools

Tools don't fix fundamental problems:

❌ **Poor content strategy**
- Tools can't invent missing entities
- Tools can't fix inconsistent terminology
- Tools can't create authority

❌ **Weak information architecture**
- Tools can't restructure a broken site
- Tools can't design entity relationships
- Tools can't decide content ownership

❌ **Unclear intent**
- Tools can't define your audience
- Tools can't clarify positioning
- Tools can't resolve multi-site conflicts

**Fix strategy first. Tools amplify good decisions.**

---

## 11. Emerging Tool Categories

### Categories to watch (2025-2026)

**1. Cross-platform citation tracking**
- Currently: Separate tools per platform
- Future: Unified tracking across ChatGPT, Gemini, Perplexity, Claude

**2. Passage-level analytics**
- Currently: Manual extraction and analysis
- Future: Automated passage performance tracking

**3. Entity graph visualization**
- Currently: Conceptual only
- Future: Visual tools showing entity relationships across sites

**4. RAG pipeline simulation**
- Currently: Limited availability
- Future: Standard feature in SEO platforms

**5. Synthetic query generation**
- Currently: Reactive (track what AI systems generate)
- Future: Proactive (predict fan-out queries pre-publish)

---

## 12. Tool Evaluation Checklist

Before committing to any tool, validate:

- [ ] Does it solve a real workflow bottleneck?
- [ ] Can we integrate it with existing tools?
- [ ] Does it require sensitive data sharing?
- [ ] Is there an open-source alternative?
- [ ] What happens if the vendor disappears?
- [ ] Can we export our data?
- [ ] Does it align with our privacy requirements?
- [ ] What's the learning curve for the team?
- [ ] Can we achieve the same result manually (if necessary)?

---

## 13. Privacy & Security Guidelines

### Self-hosted tools (N8N, Ollama, Crew.AI)
✅ Full data control  
✅ No external API calls (optional)  
✅ Client data never leaves infrastructure  
⚠️ Requires infrastructure management  
⚠️ Team responsible for updates/security  

### Cloud tools (QFOria, Relevance Doctor)
✅ No setup required  
✅ Always up-to-date  
⚠️ Data processed externally  
⚠️ Subject to vendor terms  

### Commercial platforms (Profound, MarketBrew)
✅ Enterprise features  
✅ Support and training  
⚠️ Higher cost  
⚠️ Vendor lock-in risk  
⚠️ Data processing terms vary  

**Default guideline:**
- Public data → Any tool
- Internal strategy → Self-hosted preferred
- Client data → Self-hosted required

---

## 14. Maintenance & Updates

**This tool list reflects state-of-the-art as of February 2026.**

Tools evolve rapidly in the AI search space.

**Before relying on any tool:**
1. Verify it still exists and is maintained
2. Check current capabilities (features change)
3. Review pricing (models evolve)
4. Test with your actual use case
5. Validate data accuracy

**Review schedule:**
- Quarterly: Check for new tools in each category
- Biannually: Re-evaluate primary tool stack
- Annually: Major review and strategy adjustment

**Next planned review:** July 2026

---

## 15. Contributing to This List

**Criteria for inclusion:**
- Must support relevance engineering workflows
- Must be production-ready (not beta/concept)
- Must have demonstrated value in real projects
- Preference for open source and privacy-respecting tools

**Not included:**
- Generic SEO platforms (unless AI search-specific features)
- Experimental/research tools without practical application
- Tools with poor privacy practices
- Vaporware and hype-driven "AI SEO tools"

---

## 16. Final Reminder

> "We've learned a lot of internal details about how Google works over the past two years and nothing meaningful in our popular software has changed."  
> — Mike King, CEO, iPullRank

Most traditional SEO tools are not adapting fast enough.

**This is why custom workflows and open-source tools are essential.**

Build your own capabilities. Don't wait for vendors.

---

**Status:** Operational · Living Document · Review Q3 2026
