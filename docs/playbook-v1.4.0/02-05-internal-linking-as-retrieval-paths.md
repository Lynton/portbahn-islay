# Internal Linking as Retrieval Paths
*(Why links are semantic infrastructure, not just authority flow)*

## TL;DR
Internal links no longer just pass authority.

They:
- Surface content for retrieval
- Define relationships between topics and entities
- Reduce discovery cost for AI systems

Internal linking is now **retrieval infrastructure**.

---

## 1. The outdated view of internal links

Historically, internal linking was framed as:
- PageRank distribution
- Crawl facilitation
- UX navigation

While still relevant, this framing is incomplete.

In AI search systems, internal links act as:
> **Contextual signals that help models infer meaning and importance.**

This reframing appears across:
- *Search Matrix series* (internal links as semantic glue)
- *iPullRank* technical guidance
- Practitioner analysis of AI crawler behaviour

---

## 2. How AI systems use internal links

AI crawlers:
- Follow links to discover content
- Use anchor text as contextual signals
- Infer topical adjacency from link graphs
- Identify hubs, authorities, and supporting content

Internal links help answer:
- What is this page about?
- What concepts belong together?
- Which content is primary vs supporting?

From the systemâ€™s perspective:
> Links are signals of relationship, not just pathways.

---

## 3. Retrieval cost and link efficiency

AI systems optimise for efficiency.

Content that is:
- Shallowly linked
- Frequently referenced
- Contextually reinforced

â€¦has a lower retrieval cost.

Deeply buried or weakly linked content:
- Appears less important
- Costs more to discover
- Is retrieved less often

Internal linking directly influences:
> **Retrieval probability.**

---

## 4. Anchor text as meaning, not decoration

Anchor text matters more than ever.

Effective anchor text:
- Describes the destination clearly
- Uses consistent terminology
- Reinforces entity names and concepts

Ineffective anchor text:
- â€œClick hereâ€
- â€œRead moreâ€
- Vague or generic phrases

For AI systems:
> Anchor text is semantic input.

---

## 5. Hierarchy vs adjacency

Internal linking works on two dimensions:

### Vertical (hierarchical)
- Parent â†’ child relationships
- Category â†’ subtopic â†’ detail
- Reinforces structure and scope

### Horizontal (adjacent)
- Related concepts
- Supporting topics
- Contextual reinforcement

Strong sites use both.

Over-reliance on hierarchy:
- Limits contextual richness

Over-reliance on adjacency:
- Weakens structure

Balance is key.

---

## 6. Internal links as entity reinforcement

When internal links:
- Consistently reference entities
- Connect related topics
- Point back to canonical hubs

They:
- Strengthen entity associations
- Improve interpretability
- Reduce ambiguity

This becomes critical in:
- Multi-topic sites
- Multi-domain ecosystems
- Brand authority builds

---

## 7. Common internal linking failures

Typical issues:
- Orphaned content
- Inconsistent anchor language
- Over-linking without context
- Navigation-only linking
- Faceted URLs diluting link signals

Each increases:
- Retrieval friction
- Semantic confusion
- Crawl inefficiency

---

## 8. Vector-Based Internal Link Discovery

Once your site's content is vectorised, finding optimal internal linking targets becomes a nearest-neighbour query rather than a manual editorial judgment.

### How it works

Every page is represented as an embedding. Pages with high cosine similarity are semantically related — and therefore strong candidates for internal linking.

### Practical workflow (Screaming Frog v22+)

**Method 1: Semantic Search tab**
1. Crawl your site with embeddings enabled (`Config > Content > Embeddings`)
2. Open the right-hand "Semantic Search" tab
3. Enter a target query or paste a page's core topic
4. SF ranks all crawled pages by cosine similarity to that query
5. The top-N results = pages that should link to each other

**Method 2: Semantically Similar filter**
1. After crawl, check `Content tab > Semantically Similar`
2. Each page shows its closest semantic neighbour + similarity score
3. Pages with high similarity (0.7-0.9) that don't currently link to each other = linking opportunities
4. Pages with very high similarity (0.95+) = potential cannibalisation requiring consolidation, not linking

**Method 3: Export and cross-reference**
1. Export SF embeddings + existing internal link data
2. In Python/Colab: calculate pairwise cosine similarity across all pages
3. Cross-reference with actual internal links
4. High semantic similarity + no existing link = gap to fill
5. Optionally overlay GA/GSC data to prioritise by traffic or conversion value

### Why this is better than manual link building

Manual internal linking relies on editorial memory and keyword matching. Vector-based discovery:
- Finds semantic relationships that keyword matching misses
- Scales to any site size
- Is objective and repeatable
- Surfaces unexpected connections between related content

### Thresholds (practical guidance)

- **0.7-0.9 cosine similarity:** Strong linking candidates — semantically related but distinct
- **0.6-0.7:** Consider linking if topically adjacent and useful for users
- **Below 0.6:** Generally too distant to justify a contextual link
- **Above 0.95:** Investigate for cannibalisation before linking

*(See Module 07-02 for full Screaming Frog setup and tool configuration.)*

---

## 9. Practical guidance for this project

For our sites, we will:

- Design clear topic and entity hubs
- Link intentionally from supporting content
- Use descriptive, consistent anchors
- Ensure key pages are well-surfaced
- Treat links as meaning signals, not filler

Before adding a link, ask:
> â€œWhat relationship does this assert?â€

---

## 10. Mental shortcut

If a page matters:
- It should be easy to reach
- It should be referenced often
- It should be described clearly by links

If it isnâ€™t:
- AI systems will treat it as marginal

---

## 11. Working definition

**Internal Linking (for AI search)**  
> The intentional use of links to surface content, define relationships, and reinforce meaning within an information system.

---

**Status:** Applied Â· Closes the Retrieval Engineering module
