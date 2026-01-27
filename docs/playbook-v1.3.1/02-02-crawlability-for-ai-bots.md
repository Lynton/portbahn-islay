# Crawlability for AI Bots
*(Ensuring AI systems can actually access your content)*

## TL;DR
If AI crawlers cannot **reach**, **fetch**, or **process** your content efficiently,
it will not be retrieved â€” regardless of quality or authority.

Crawlability is no longer just about Googlebot.

---

## 1. Crawlability in the AI era

Classic crawlability focused almost entirely on:
- Googlebot
- Bingbot
- Traditional search indexing

AI-first discovery expands this surface.

Modern retrieval systems include:
- Google (AI Overviews, AI Mode)
- OpenAI (GPTBot)
- PerplexityBot
- Anthropic / Claude-related crawlers
- Other emerging AI agents

Each has:
- Different crawl behaviour
- Different tolerances
- Different defaults

**Assumption to drop:**  
> â€œIf Google can crawl it, AI can too.â€

---

## 2. Why AI crawlers are more fragile

AI crawlers tend to be:
- More conservative
- More cost-sensitive
- Less tolerant of inefficiency

Common constraints:
- Tight timeouts
- Limited rendering budgets
- Lower tolerance for errors
- Preference for static, clean HTML

From an AI systemâ€™s perspective:
> Retrieval is a cost-benefit calculation.

If your site is slow, complex, or noisy:
- It is deprioritised
- Or skipped entirely

---

## 3. Robots.txt: control vs invisibility

Robots.txt remains a primary control surface.

Key realities:
- AI crawlers generally respect robots.txt
- Many CDNs block AI bots by default
- Overly restrictive rules silently remove you from AI answers

Common failure modes:
- Blanket `Disallow: /`
- Blocking user agents you donâ€™t recognise
- Relying on CDN defaults without review

**Strategic trade-off:**  
Blocking AI crawlers = privacy and control  
Allowing AI crawlers = visibility and influence

There is no neutral position.

---

## 4. Crawl depth and discovery efficiency

AI crawlers prioritise:
- Shallow paths
- Clearly surfaced content
- Internally reinforced pages

Deeply buried pages suffer because:
- Crawl budgets are limited
- Discovery cost increases
- Confidence in importance decreases

Practical implications:
- Key pages should be reachable within a few hops
- Internal links matter more than XML sitemaps
- Faceted navigation and pagination can silently hide value

---

## 5. XML sitemaps: supportive, not primary

XML sitemaps:
- Signal existence
- Reinforce canonical confidence
- Provide freshness hints

But they do **not**:
- Replace internal linking
- Guarantee retrieval
- Override crawl inefficiency

AI systems:
- Prefer contextual discovery
- Use sitemaps as secondary reinforcement

---

## 6. Canonicalisation and crawl waste

Poor canonical hygiene causes:
- Fragmented retrieval
- Confused attribution
- Wasted crawl budget

For AI systems, this is worse than for classic SEO:
- Duplicate URLs can split embedding signals
- Meaning becomes diluted across variants

Canonical clarity helps:
- Consolidate retrieval signals
- Strengthen entity association
- Improve citation consistency

---

## 7. CDN and hosting defaults (hidden risk)

Many modern platforms:
- Block AI crawlers by default
- Throttle unknown user agents
- Serve incomplete responses

Common examples:
- Aggressive bot mitigation
- JavaScript challenges
- Region-based blocking

These issues are:
- Often invisible in SEO tools
- Rarely flagged by analytics
- Discovered only after visibility loss

Regular audits are required.

---

## 8. Crawlability checklist (AI-focused)

Before launch or rebuild, verify:

- AI crawlers are allowed in robots.txt
- CDN settings do not block or challenge bots
- Key content is available without JS execution
- Important pages are shallowly linked
- Canonicals are consistent and intentional
- Error rates and timeouts are minimal

---

## 9. Practical guidance for this project

For our sites:

We will:
- Explicitly review AI crawler access
- Treat crawlability as a visibility decision
- Avoid accidental exclusion via defaults
- Design IA for efficient discovery

Crawlability is not hygiene â€” it is strategy.

---

## 10. Working definition

**Crawlability**  
> The degree to which automated systems can efficiently discover, access, and fetch content within their operational constraints.

---

**Status:** Applied Â· Core infrastructure requirement
