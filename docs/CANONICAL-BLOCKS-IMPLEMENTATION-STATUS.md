# Canonical Content Blocks - Implementation Status

**Date:** 2026-01-27
**Status:** Phase 1 Complete - Ready for Content Population

---

## ✅ Completed

### 1. Database Backup
- ✅ Sanity dataset exported to: `backups/sanity-pre-canonical-blocks-20260127-132332.tar.gz`
- ✅ Rollback safety in place

### 2. Sanity Schema Infrastructure

**New Schema Files Created:**

1. **`sanity/schemas/documents/canonicalBlock.ts`**
   - Core document type for canonical blocks
   - Fields: blockId (slug), title, entityType, canonicalHome
   - Full/teaser content (portable text with image support)
   - Key facts (array of fact/value objects)
   - Metadata fields (usedOn, notes)
   - Preview shows: title, entity type, block ID

2. **`sanity/schemas/objects/blockReference.ts`**
   - Reusable object type for referencing blocks
   - Fields: block (reference), version (full/teaser), showKeyFacts, customHeading
   - Preview shows: block title, version icon, block ID

**Schema Updates:**

3. **`sanity/schemas/index.ts`**
   - ✅ Added canonicalBlock to exports
   - ✅ Added blockReference to exports

4. **`sanity/schemas/_base/baseSingletonFields.ts`**
   - ✅ Added contentBlocks field (applies to all singleton pages using base)
   - Automatically adds to: Getting Here, Explore Islay, About, all hub pages

5. **`sanity/schemas/singletons/homepage.ts`**
   - ✅ Added contentBlocks field

### 3. Frontend Components

**New Components Created:**

1. **`components/CanonicalBlock.tsx`** (97 lines)
   - Renders individual canonical blocks
   - Version-aware (full/teaser)
   - Auto-appends "Read more →" link for teasers
   - Optional key facts table display
   - Matches existing design system (harbour-stone, emerald-accent, font-serif/mono)

2. **`components/BlockRenderer.tsx`** (38 lines)
   - Container component for multiple blocks
   - Maps array of block references to CanonicalBlock components

### 4. Import Tooling

**Scripts Created:**

1. **`scripts/import-canonical-blocks.ts`** (305 lines)
   - Automated parser for CANONICAL-BLOCKS-FINAL-V2_LL2.md
   - Converts markdown to Sanity portable text format
   - Extracts full/teaser/key facts for all 16 blocks
   - Ready to run (requires write-enabled API token)

2. **`scripts/import-blocks-via-cli.sh`**
   - Fallback manual entry guide
   - Lists all 16 block IDs to create

---

## 🔄 Next Steps

### IMMEDIATE: Populate Content

**Option A: Automated Import (Recommended)**

1. Get write-enabled API token:
   - Go to https://sanity.io/manage/project/t25lpmnm/api
   - Find the "claude-code" token OR create new "Editor" token
   - Update `.env.local`: `SANITY_API_TOKEN=sk...`

2. Run import script:
   ```bash
   npx tsx scripts/import-canonical-blocks.ts
   ```

3. Verify in Studio:
   ```bash
   cd sanity && npm run dev
   # Open http://localhost:3333
   # Check: Content → Canonical Content Block
   ```

**Option B: Manual Entry**

1. Start Sanity Studio:
   ```bash
   cd sanity && npm run dev
   # Open http://localhost:3333
   ```

2. For each of the 16 blocks:
   - Click "+ Create" → "Canonical Content Block"
   - Fill fields from `_claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md`
   - Block IDs: travel-to-islay, distilleries-overview, families-children, etc.

### PHASE 2: Test Schema in Studio

1. **Verify Block Creation:**
   - [ ] Can create canonical blocks
   - [ ] Block ID generates from title
   - [ ] Entity type dropdown works
   - [ ] Portable text editors work (full/teaser)
   - [ ] Key facts table accepts entries
   - [ ] Preview shows correctly

2. **Verify Block References:**
   - [ ] Open Homepage in Studio
   - [ ] Find "Content Blocks" field
   - [ ] Can add block reference
   - [ ] Version toggle (full/teaser) works
   - [ ] Custom heading optional field works

### PHASE 3: Frontend Integration

**Update Page Queries:**

Example for homepage (`app/page.tsx`):

```typescript
const query = `*[_type == "homepage"][0]{
  _id,
  heroImage,
  title,
  tagline,
  introText,

  // NEW: Fetch canonical blocks
  contentBlocks[]{
    version,
    showKeyFacts,
    customHeading,
    block->{
      _id,
      blockId,
      title,
      entityType,
      canonicalHome,
      fullContent,
      teaserContent,
      keyFacts[]{ fact, value }
    }
  },

  seoTitle,
  seoDescription
}`;
```

**Render Blocks:**

```tsx
import BlockRenderer from '@/components/BlockRenderer';

export default async function HomePage() {
  const page = await getHomepage();

  return (
    <div>
      {/* Existing hero/intro */}

      {/* NEW: Canonical blocks */}
      {page.contentBlocks && (
        <BlockRenderer blocks={page.contentBlocks} />
      )}

      {/* Keep existing inline content during migration */}
    </div>
  );
}
```

### PHASE 4: SEO/GEO/AEO Review

Once blocks are populated, review against playbook:

- [ ] Block titles optimized for entity clarity
- [ ] Canonical home URLs follow SEO structure
- [ ] Entity types properly categorized
- [ ] Internal linking patterns established
- [ ] External links to authoritative sources (distilleries, CalMac, VisitScotland)

### PHASE 5: Content Migration

**Safe Parallel Approach:**

1. Keep existing inline fields (introText, whyStayText, etc.)
2. Add block references alongside
3. Verify visual parity
4. Monitor for 2-4 weeks
5. Remove old inline fields (optional)

---

## 📋 The 16 Canonical Blocks

| # | Block ID | Entity Type | Canonical Home |
|---|----------|-------------|----------------|
| 1 | travel-to-islay | Travel | /travel-to-islay |
| 2 | distilleries-overview | Activity | /explore-islay#whisky |
| 3 | families-children | Activity | /explore-islay#families |
| 4 | ferry-support | Trust | /travel-to-islay#ferry |
| 5 | trust-signals | Credibility | /#our-track-record |
| 6 | bruichladdich-proximity | Location | /#why-bruichladdich |
| 7 | portbahn-beach | Place | /explore-islay#beaches |
| 8 | shorefield-character | Property | /properties/shorefield |
| 9 | port-charlotte-village | Place | /#port-charlotte |
| 10 | wildlife-geese | Nature | /explore-islay#wildlife |
| 11 | food-drink-islay | Activity | /explore-islay#food |
| 12 | beaches-overview | Place | /explore-islay#beaches |
| 13 | jura-day-trip | Activity | /jura |
| 14 | jura-longer-stay | Activity | /jura |
| 15 | bothan-jura-teaser | Property | /jura |
| 16 | about-us | Trust | /about |

---

## 🔧 Troubleshooting

### Port 3000/3333 Conflicts

If Studio won't start:

```bash
# Kill all node processes
killall -9 node

# Clean Next.js cache
rm -rf .next/cache .next/dev/lock

# Try alternative port
cd sanity && PORT=3334 npm run dev
```

### Import Script Permissions Error

If you get "Insufficient permissions; permission 'create' required":

1. Check current token permissions at: https://sanity.io/manage/project/t25lpmnm/api
2. Ensure token has "Editor" or "Administrator" role
3. Update `.env.local` with correct token
4. Re-run import script

### Schema Not Appearing in Studio

1. Ensure schemas are exported in `sanity/schemas/index.ts`
2. Restart Studio: `cd sanity && npm run dev`
3. Hard refresh browser (Cmd+Shift+R)
4. Check browser console for errors

---

## 📖 Key Concepts

**Canonical Block:**
- Single source of truth for a content chunk
- Has FULL and TEASER versions
- Contains immutable KEY FACTS
- Can be referenced by multiple pages

**Block Reference:**
- Page-specific configuration
- Chooses full or teaser version
- Can override heading
- Can show/hide key facts

**Content Flow:**
1. Create block once in Sanity
2. Reference block from pages
3. Choose full/teaser per page
4. Edit block → changes appear everywhere

---

## 🎯 Success Criteria

- [ ] All 16 blocks created in Sanity
- [ ] Blocks visible in Studio
- [ ] Can reference blocks from pages
- [ ] Full/teaser toggle works
- [ ] "Read more" links to canonical home
- [ ] Key facts display correctly
- [ ] Visual parity with existing design
- [ ] Single source of truth proven (edit once, update everywhere)

---

## 📁 File Manifest

**Created:**
- `sanity/schemas/documents/canonicalBlock.ts`
- `sanity/schemas/objects/blockReference.ts`
- `components/CanonicalBlock.tsx`
- `components/BlockRenderer.tsx`
- `scripts/import-canonical-blocks.ts`
- `scripts/import-blocks-via-cli.sh`
- `backups/sanity-pre-canonical-blocks-20260127-132332.tar.gz`

**Modified:**
- `sanity/schemas/index.ts`
- `sanity/schemas/_base/baseSingletonFields.ts`
- `sanity/schemas/singletons/homepage.ts`

---

## 🔗 Reference Documents

- Content Source: `_claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md`
- Implementation Plan: `.claude/plans/snug-dazzling-yeti.md`
- Voice Guide: `_claude-handoff/PORTBAHN-TONE-OF-VOICE-SKILL-V1.2.md`

---

**Last Updated:** 2026-01-27
**Next Action:** Populate content via import script or manual Studio entry
