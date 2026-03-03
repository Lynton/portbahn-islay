# Claude Code — Custom Operations for Portbahn Islay
**Updated:** 2026-03-03
**Intended home:** `~/dev/ecosystem/ops/cc-custom-operations.md`

---

## Project Status Snapshot

**Phase:** Final content audit & semantic consistency revision
**Last deploy branch:** `main` (Vercel auto-deploys)
**Working branch:** `claude/setup-sanity-mcp-server-7SmW2`

### What's Built

| Layer | Status | Notes |
|-------|--------|-------|
| **Sanity schemas** | Complete | canonicalBlock, faqCanonicalBlock, guidePage, siteEntity, property, 8 singleton pages |
| **Pages (12)** | All built | Homepage, About, Accommodation, Getting Here (→ islay-travel), Explore Islay, Contact, Privacy, Terms + 4 travel spokes + dog-friendly + geology spoke shell |
| **Canonical block system** | Live end-to-end | Full/teaser rendering from Sanity |
| **FAQ system** | Live | faqCanonicalBlock with category filtering, SEO keywords, related questions |
| **Site entities** | 31+ entities | Distilleries, beaches, restaurants, activities — siteEntity schema |
| **Guide pages** | Live | Dynamic spoke pages under explore-islay |
| **Property data** | 3 properties enriched | reviewScores, magicMoments, perfectFor, honestFriction, guestSuperlatives |
| **Revalidation** | On-demand API endpoint | All paths covered |

### Current Activity (2026-03-03)

- Block structure audit complete (8 Sanity patches applied)
- Content routing rename: getting-here → islay-travel
- 5 new travel spokes added to nav/sitemap
- Dog-friendly Islay page wired to property pages
- Geology spoke shell created
- **Sanity MCP server configured** (`.mcp.json` with `https://mcp.sanity.io`)

### Next Phase

- Hero images in Studio
- UI redesign with v0 (property pages first)
- Content audit against playbook semantic consistency

---

## Sanity Tooling Stack

### Configured

| Tool | Config | Scope | Status |
|------|--------|-------|--------|
| **Sanity MCP Server** | `.mcp.json` → `https://mcp.sanity.io` | Project (version controlled) | Configured, needs OAuth auth |
| **Sanity Studio** | `sanity.config.ts` | Local dev | Working |
| **Sanity CLI** | `sanity.cli.ts` | Local dev | Working |

### Available (Not Yet Installed)

| Tool | What It Does | Install | When to Add |
|------|-------------|---------|-------------|
| **Agent Skills** | 25+ best-practice rules for Sanity dev. Lives in repo as static files. Covers content modelling, SEO/AEO, schema patterns. | `npx skills add sanity-io/agent-toolkit` | UI redesign phase |
| **AGENTS.md** | Knowledge router file from sanity-io/agent-toolkit. Points AI to relevant skills by task. | Copy from GitHub repo | Low-effort, add any time |
| **@sanity/assist** | AI-powered field assistance inside Sanity Studio (content generation, alt text) | npm package + Studio plugin | Content population phase |
| **Claude Code Plugin** | MCP + skills + slash commands bundled for Claude Code | Via agent-toolkit | When starting heavy CC dev work |

### Recommendation

For **content audit phase**: MCP server alone is sufficient. Use GROQ queries via MCP to:
- Verify canonical block consistency across pages
- Audit keyFacts against critical facts table
- Check entity data completeness (31+ siteEntities)
- Validate FAQ category coverage

For **UI redesign phase**: Add Agent Skills (`npx skills add sanity-io/agent-toolkit`) + AGENTS.md. These provide schema-aware best practices that prevent common mistakes during component development.

---

## Custom Operations

### Op: Content Consistency Audit via MCP

Once MCP OAuth is authenticated, run these GROQ queries to audit live data:

```groq
// All canonical blocks — check completeness
*[_type == "canonicalBlock"] | order(entityType asc) {
  blockId, title, entityType, canonicalHome,
  "hasFullContent": defined(fullContent),
  "hasTeaserContent": defined(teaserContent),
  "factCount": count(keyFacts)
}
```

```groq
// All FAQ blocks — check category coverage
*[_type == "faqCanonicalBlock"] | order(category asc) {
  question, category, secondaryCategories,
  "hasKeywords": count(keywords) > 0,
  priority
}
```

```groq
// Property data completeness
*[_type == "property"] {
  name,
  "hasReviews": defined(reviewScores),
  "hasMagicMoments": count(magicMoments) > 0,
  "hasPerfectFor": count(perfectFor) > 0,
  "hasFriction": count(honestFriction) > 0,
  availabilityStatus, licensingStatus
}
```

```groq
// Entity completeness check
*[_type == "siteEntity"] | order(category asc) {
  name, category, island, status,
  "hasDescription": defined(shortDescription),
  "hasLocation": defined(location.distanceFromBruichladdich),
  "hasContact": defined(contact.website),
  "tagCount": count(tags)
}
```

### Op: Critical Facts Validation

Cross-reference these immutable values against all content:

| Fact | Correct Value | Check Against |
|------|---------------|---------------|
| Walk to Bruichladdich Distillery | 5 minutes | property descriptions, canonical blocks, guide pages |
| Ferry to Port Askaig | 2 hours | travel blocks, FAQ answers |
| Ferry to Port Ellen | 2 hours 20 minutes | travel blocks, FAQ answers |
| Ferry booking window | 12 weeks | travel blocks, FAQ answers |
| Guests hosted | 600+ | trust-signals block, about page |
| Average rating | 4.97/5 | trust-signals block, property data |
| Communication rating | 5.0/5 | trust-signals block |
| Distilleries on Islay | 10 | explore blocks, guide pages |
| Barnacle geese | 30,000+ | wildlife content |
| Owner name | Alan (not Allan) | about block, all content |
| Portbahn Beach walk | 5 minutes via war memorial path | property descriptions |
| Port Charlotte drive | 5 minutes | property descriptions |
| Port Charlotte walk | 40 minutes | property descriptions |

### Op: Pre-Deploy Checklist

1. `npm run build` — clean production build
2. `npm run lint` — no lint errors
3. Check revalidation paths match sitemap (`app/sitemap.ts`)
4. Verify canonical blocks render full/teaser correctly
5. Confirm FAQ schema.org markup generates valid JSON-LD
6. Check property pages load with enriched data

### Op: Sanity Backup Before Schema Changes

```bash
# Always run before modifying sanity/schemas/
sanity documents export \
  --types page,property,canonicalBlock,faqCanonicalBlock,siteEntity,guidePage \
  --out data/exports/backup-$(date +%Y-%m-%d).ndjson
```

### Op: MCP Server Authentication

```bash
# First time setup (already configured in .mcp.json)
# 1. Start Claude Code
# 2. Run /mcp inside Claude Code
# 3. Follow browser OAuth flow
# 4. Sessions auto-refresh (~7 day expiry)

# To verify connection:
claude mcp list
claude mcp get Sanity
```

### Op: Revalidate After Content Changes

```bash
# Hit the on-demand revalidation endpoint after Sanity publishes
# The API route handles path-based revalidation
# See: app/api/ for the revalidation endpoint implementation
```

---

## Schema Summary (Current)

### Document Types
- `canonicalBlock` — reusable content blocks (full + teaser)
- `faqCanonicalBlock` — FAQ items with categories, SEO keywords, related questions
- `guidePage` — dynamic spoke/guide pages
- `siteEntity` — places, businesses, attractions (31+ entities)
- `property` — accommodation listings (3 properties)

### Singleton Pages (8)
homepage, aboutPage, accommodationPage, gettingHerePage, contactPage, exploreIslayPage, privacyPage, termsPage

### Object Types
- `blockReference` — references canonical blocks with renderAs (full/teaser)
- `faqBlockReference` — references FAQ blocks

### Data in Production (from export + recent work)
- 3 property documents (Portbahn House, Shorefield Eco House, Curlew Cottage)
- 1 homepage document
- 1 siteSettings document
- 22+ canonical blocks (per spec)
- 35+ FAQ items (per content spec)
- 31+ site entities
- Multiple guide pages

---

## File Locations Quick Reference

| Need | Path |
|------|------|
| Sanity schemas | `sanity/schemas/` |
| GROQ queries | `lib/queries.ts` |
| Page components | `app/` |
| Shared components | `components/` |
| Schema spec | `docs/schemas/SANITY-SCHEMA-FINAL.md` |
| MCP config | `.mcp.json` |
| Cursor rules | `.cursorrules` |
| Data exports | `data/exports/` |
| Data imports | `data/imports/` |
