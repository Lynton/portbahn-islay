# Canonical Blocks - Quick Start Guide

## What's Done ✅

1. **Sanity schemas created** → Blocks can be created in Studio
2. **Frontend components ready** → Blocks can be rendered on pages
3. **Import script ready** → Can automate block creation
4. **Backup created** → Safe to proceed

## What's Next 🎯

### Step 1: Fix Port Issues (If Needed)

```bash
# Kill conflicting processes
killall -9 node

# Clean lock files
cd /Users/lynton/dev/portbahn-islay
rm -rf .next/cache .next/dev/lock
```

### Step 2: Start Sanity Studio

```bash
cd sanity
npm run dev
# Opens at http://localhost:3333
```

### Step 3: Verify Schemas Work

In Studio:
1. Click "+ Create"
2. Look for "Canonical Content Block"
3. Try creating a test block
4. Check Homepage → "Content Blocks" field appears

### Step 4: Populate Content

**Option A: Automated (Fast)**

1. Get API token from: https://sanity.io/manage/project/t25lpmnm/api
2. Look for "claude-code" token OR create new "Editor" token
3. Update `.env.local`:
   ```
   SANITY_API_TOKEN=sk...your-token...
   ```
4. Run:
   ```bash
   npx tsx scripts/import-canonical-blocks.ts
   ```

**Option B: Manual (Slower but safer for first time)**

1. Open Studio
2. Create blocks one by one from `_claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md`
3. Start with: travel-to-islay, distilleries-overview, families-children

### Step 5: Test Rendering

1. Add a block reference to Homepage in Studio
2. Update `app/page.tsx` query to fetch contentBlocks
3. Add `<BlockRenderer blocks={page.contentBlocks} />` to JSX
4. Run `npm run dev` and view homepage

## Quick Commands

```bash
# Start Sanity Studio
cd sanity && npm run dev

# Start Next.js
npm run dev

# Run import script
npx tsx scripts/import-canonical-blocks.ts

# Open Sanity management
cd sanity && npx sanity manage
```

## File Locations

- **Schemas:** `sanity/schemas/documents/canonicalBlock.ts`
- **Components:** `components/CanonicalBlock.tsx`
- **Import Script:** `scripts/import-canonical-blocks.ts`
- **Content Source:** `_claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md`
- **Full Docs:** `docs/CANONICAL-BLOCKS-IMPLEMENTATION-STATUS.md`

## Troubleshooting

**"Block type not found"**
→ Restart Studio, hard refresh browser

**"Permission denied" on import**
→ Check API token has "Editor" role

**Port 3000/3333 in use**
→ Kill node processes, clean .next cache

**Changes not showing in Studio**
→ Hard refresh (Cmd+Shift+R)

## Need Help?

See full documentation: `docs/CANONICAL-BLOCKS-IMPLEMENTATION-STATUS.md`
