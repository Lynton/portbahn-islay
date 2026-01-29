# Comprehensive Audit Summary: Hub-and-Spoke Architecture
**Date:** 2026-01-29
**Auditor:** Claude Sonnet 4.5
**Scope:** Playbook validation, schema.org markup, codebase efficiency

---

## EXECUTIVE SUMMARY

The hub-and-spoke architecture implementation is **fundamentally solid** with **excellent passage design** on spoke pages. Three main areas need attention:

1. **Entity clarity** on hub pages (HIGH priority)
2. **Schema.org accuracy** for hub pages (HIGH priority)
3. **Query efficiency** and code duplication (MEDIUM priority)

**Overall Grade:** 7.5/10 (Good foundation with fixable issues)

---

## 1. PLAYBOOK V1.3.1 VALIDATION

### ✅ STRENGTHS

| Category | Status | Evidence |
|----------|--------|----------|
| Hub-Spoke Architecture | EXCELLENT | Clean separation: hubs show teasers, spokes have full content |
| Passage Quality (Spokes) | GOOD | BlockRenderer pattern creates 3-6 sentence extractable passages |
| Crawlability | EXCELLENT | All pages use SSG, content in initial HTML |
| No Accordions | GOOD | FAQs fully visible (playbook compliant) |

### ❌ ISSUES FOUND

**HIGH Priority:**

1. **Hub pages lack explicit entity definitions** (playbook-validation-report.md:68-98)
   - Problem: Intro paragraphs don't state what THE PAGE is
   - Example: `/explore-islay` defines Islay but not the guide
   - Fix: Add "This guide covers..." statements

2. **Hub pages lack section headings** (playbook-validation-report.md:140-169)
   - Problem: Card grids have no descriptive H2 headings
   - Impact: Reduces passage extractability
   - Fix: Add headings like "Islay Activities and Attractions"

**MEDIUM Priority:**

3. **Entity naming inconsistency** (playbook-validation-report.md:183-201)
   - Needs audit: "Isle of Islay" vs "Islay" usage
   - Fix: Establish first-mention vs subsequent rules

**SCORE:** Hub Pages 6.5/10, Spoke Pages 8.5/10

Full report: `_analysis/playbook-validation-report.md`

---

## 2. SCHEMA.ORG MARKUP AUDIT

### ❌ CRITICAL ISSUES

**Hub pages use wrong schema types:**

| Page | Current Schema | Problem | Should Be |
|------|---------------|---------|-----------|
| `/explore-islay` | `TouristAttraction` + `Place` | Describes Islay, not the page | `CollectionPage` |
| `/getting-here` | `HowTo` + `Place` | Describes process, not page | `CollectionPage` |
| `/accommodation` | `Accommodation` | Too vague for collection | `CollectionPage` |

**Example problem:**
```typescript
// CURRENT (WRONG)
{
  '@type': 'TouristAttraction',
  name: 'Isle of Islay'  // ← Describes TOPIC not PAGE
}

// CORRECT
{
  '@type': 'CollectionPage',
  name: 'Islay Activities Guide',
  about: { '@type': 'Place', name: 'Isle of Islay' }  // ← Correct relationship
}
```

### ✅ WORKING WELL

- Property page `Accommodation` schema is **excellent**
- No FAQPage schema (correctly per playbook)
- Amenity mapping comprehensive

### 🔧 FIXES NEEDED

1. Add `WebPage` + `CollectionPage` types to lib/schema-markup.tsx
2. Create `generateCollectionPage()` function
3. Update all hub page schema calls
4. Add schema to `/guides/[slug]` pages (currently missing)

**SCORE:** 6/10 (Property pages 9/10, Hub pages 3/10)

Full report: `_analysis/schema-markup-audit.md`

---

## 3. CODEBASE EFFICIENCY AUDIT

### 🚨 HIGH IMPACT ISSUES

**1. Duplicate hub page code** (~700 lines duplicated)
- Files: `/app/accommodation/page.tsx`, `/explore-islay/page.tsx`, `/getting-here/page.tsx`
- Impact: Maintainability, bundle size
- Fix: Extract to reusable hub page factory

**2. Property query fragmentation** (4 different query patterns)
- Files: Homepage, accommodation hub, property pages, map component
- Impact: Inconsistent data, harder to maintain
- Fix: Create centralized query builder

**3. Over-fetching on property pages** (125+ fields fetched, ~50% unused)
- File: `/app/accommodation/[slug]/page.tsx`
- Impact: Sanity API costs, load time
- Fix: Split primary/secondary queries, lazy-load below-fold

**4. Unused count() queries**
- Files: Hub pages
- Code: `"contentBlockCount": count(contentBlocks)` ← fetched but never displayed
- Impact: Unnecessary GROQ operations
- Fix: Remove unused counts

### ⚠️ MEDIUM IMPACT ISSUES

**5. Schema field duplication**
- Double glazing in 2 categories with different values
- Parallel "notes" fields inconsistently applied
- Manual `totalReviewCount` vs auto-calculated

**6. Missing lazy loading**
- `MultiPropertyCalendar` (753 lines, 30-50KB) not dynamically imported
- Potential savings: Faster initial page load

**7. Inconsistent revalidation strategy**
- Some pages: 60s, others: default (3600s or infinite)
- Impact: Unpredictable cache behavior

### 💡 QUICK WINS

Priority fixes (< 1 hour each):

1. Remove `count(contentBlocks)` from hub queries
2. Add `| [0:2]` limit to "other properties" query
3. Remove unused double_glazing from heatingCooling section
4. Dynamic import MultiPropertyCalendar

**SCORE:** 7/10 (Well-structured, moderate optimization needed)

Full analysis available in agent output above.

---

## 4. PRIORITY IMPLEMENTATION ROADMAP

### Phase 1: HIGH Priority (Do First) - 4-6 hours

**Playbook Fixes:**
- [ ] Add explicit scope statements to hub page intros
  - Example: "This guide covers activities, attractions and experiences on the Isle of Islay."
- [ ] Add H2 section headings before card grids
  - `/explore-islay`: "Islay Activities and Attractions"
  - `/getting-here`: "Ways to Reach Islay"
  - `/accommodation`: "Self-Catering Holiday Properties"

**Schema Fixes:**
- [ ] Add `WebPage` + `CollectionPage` to SchemaType union (lib/schema-markup.tsx:7)
- [ ] Create `generateCollectionPage()` function (lib/schema-markup.tsx:~545)
- [ ] Update hub page schema:
  - `/explore-islay`: Use CollectionPage
  - `/getting-here`: Use CollectionPage
  - `/accommodation`: Use CollectionPage with hasPart
- [ ] Add schema to `/guides/[slug]/page.tsx` (use Article type)

**Efficiency Fixes:**
- [ ] Remove unused count() queries from hub pages
- [ ] Add `| [0:2]` limit to getAllProperties() query

### Phase 2: MEDIUM Priority (Next) - 6-8 hours

**Code Consolidation:**
- [ ] Extract hub page duplication to shared factory pattern
- [ ] Create property query builder or shared fragments
- [ ] Dynamic import MultiPropertyCalendar

**Schema Cleanup:**
- [ ] Remove double_glazing from heatingCooling section
- [ ] Standardize "notes" fields pattern
- [ ] Consider auto-calculating totalReviewCount

### Phase 3: LOW Priority (Future) - 8+ hours

**Optimization:**
- [ ] Split property page into smaller components
- [ ] Implement primary/secondary query pattern for property pages
- [ ] Add BreadcrumbList schema to all pages
- [ ] Entity naming consistency audit

---

## 5. SUCCESS METRICS

After implementing Phase 1 fixes:

**Playbook Compliance:**
- Entity clarity: 3/10 → 9/10
- Section headings: 4/10 → 9/10
- Overall hub pages: 6.5/10 → 8.5/10

**Schema.org:**
- Hub page accuracy: 3/10 → 9/10
- Guide page coverage: 0/10 → 8/10
- Overall: 6/10 → 9/10

**Efficiency:**
- Query efficiency: +10% (remove counts, add limits)
- Code duplication: -700 lines (after Phase 2)
- Bundle size: -30-50KB (after Phase 2)

---

## 6. FILES REQUIRING CHANGES

### Phase 1 (HIGH)

**Frontend:**
- `app/explore-islay/page.tsx` (add intro scope, H2, update schema)
- `app/getting-here/page.tsx` (add intro scope, H2, update schema)
- `app/accommodation/page.tsx` (add intro scope, H2, update schema)
- `app/guides/[slug]/page.tsx` (add schema markup)

**Schema Library:**
- `lib/schema-markup.tsx` (add CollectionPage type and generator)

### Phase 2 (MEDIUM)

**Components:**
- Create `app/_components/HubPage.tsx` (new shared component)
- `components/MultiPropertyCalendar.tsx` (dynamic import usage)

**Sanity:**
- `sanity/schemas/collections/property.ts` (remove double_glazing duplicate)

**Queries:**
- Create `lib/queries/property.ts` (shared query fragments)

---

## 7. TESTING CHECKLIST

After Phase 1 implementation:

**Playbook:**
- [ ] Each hub page has explicit scope definition
- [ ] Each hub page has descriptive H2 before card grid
- [ ] Entity names used consistently

**Schema:**
- [ ] All schemas validate at schema.org validator
- [ ] Hub pages use CollectionPage type
- [ ] Guide pages have Article schema
- [ ] No conflicting @id values

**Functionality:**
- [ ] All pages render correctly
- [ ] Navigation works
- [ ] Build passes
- [ ] No console errors

**Performance:**
- [ ] Lighthouse score maintained or improved
- [ ] No additional API calls
- [ ] Page load times stable

---

## 8. CONCLUSION

The hub-and-spoke architecture is well-implemented with strong foundation. Main improvements needed:

1. **Clarity:** Make hub pages explicitly define their scope
2. **Schema accuracy:** Use correct types (CollectionPage not entity types)
3. **Efficiency:** Remove duplication and optimize queries

All issues are **fixable** without major refactoring. Phase 1 fixes address the most critical playbook and schema concerns.

---

## APPENDIX: Reference Documents

- Full playbook validation: `_analysis/playbook-validation-report.md`
- Full schema audit: `_analysis/schema-markup-audit.md`
- Codebase efficiency: Agent output above
- AI Search Playbook v1.3.1: `~/.claude/skills/ai-search-playbook/`

**Next Action:** Implement Phase 1 fixes (estimated 4-6 hours)
