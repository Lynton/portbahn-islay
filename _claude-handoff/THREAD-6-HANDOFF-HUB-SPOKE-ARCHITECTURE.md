# Thread 6 Handoff: Hub-and-Spoke Architecture Implementation

## Session Summary

This session addressed the "recursive wall of bug fixing" with a deep code and Sanity review, resulting in a significant architectural simplification aligned with AI Search Playbook v1.3.1.

## Key Problems Solved

### 1. Duplicate Content Sources
**Problem**: Pages had both a `content` field (inline rich text) AND `contentBlocks[]` (canonical block references), causing stale "nine distilleries" content to appear.

**Solution**: Removed `content` field from `baseSingletonFields.ts`. All page content now flows from canonical blocks only (single source of truth).

### 2. FAQ References Not Resolving
**Problem**: FAQs showed `raw: 11` but `resolved: 0` - the `faqCanonicalBlock` references returned `null`.

**Solution**: Added `token: process.env.SANITY_API_TOKEN` to `sanity/lib/client.ts`. The Sanity client needs authentication to resolve references to certain document types.

### 3. Long Multi-Topic Pages (Playbook Violation)
**Problem**: `/explore-islay` was a long page with all content + all FAQs at the end. Playbook says:
- "Monolithic sections create 1 retrievable passage when they should be 5"
- "Questions separated from entity descriptions reduce retrieval quality"
- "Ideal passage length: 3-6 sentences"

**Solution**: Implemented hub-and-spoke architecture:
- `/explore-islay` is now a HUB page with teaser cards
- Spoke pages (`/guides/[slug]`) contain focused content + contextual FAQs

## Current Architecture

```
/explore-islay (HUB)
├── Teaser card → /guides/islay-distilleries
├── Teaser card → /guides/islay-beaches
├── Teaser card → /guides/islay-wildlife
├── Teaser card → /guides/family-holidays
├── Teaser card → /guides/food-and-drink
└── Jura section → /jura

Each SPOKE page has:
├── Full content blocks (3-6 sentences per passage)
├── Contextual FAQs (related to that topic only)
└── Clean passage extraction for AI retrieval
```

## Files Changed

### New Files
- `sanity/schemas/documents/guidePage.ts` - Reusable schema for spoke pages
- `app/guides/[slug]/page.tsx` - Dynamic route for guide pages
- `scripts/create-guide-pages.ts` - Script that created initial guide pages in Sanity

### Modified Files
- `sanity/lib/client.ts` - Added token for reference resolution
- `sanity/schemas/_base/baseSingletonFields.ts` - Removed duplicate `content` field
- `sanity/schemas/index.ts` - Registered guidePage schema
- `sanity.config.ts` - Added Guide Pages to Sanity structure
- `app/explore-islay/page.tsx` - Converted to hub page with teaser cards
- `app/getting-here/page.tsx` - Removed `content` field query, kept structure simple
- `package.json` - Added date-fns-tz dependency, changed dev script to use webpack

## Guide Pages Created in Sanity

| Page | Slug | Content Blocks | FAQs |
|------|------|----------------|------|
| Islay's Whisky Distilleries | islay-distilleries | distilleries-overview | 3 |
| Islay's Beaches | islay-beaches | beaches-overview, portbahn-beach | 3 |
| Islay Wildlife & Birdwatching | islay-wildlife | wildlife-geese | 0 |
| Family Holidays on Islay | family-holidays | families-children | 1 |
| Food & Drink on Islay | food-and-drink | food-drink-islay | 0 |

## Next Session Tasks

### 1. Navigation Submenus
Add dropdown/submenu support to main navigation:
- "Explore Islay" → shows guide page links
- "Accommodation" → shows property links (already exists?)

Check `components/Header.tsx` or similar for navigation implementation.

### 2. Travel to Islay Hub-and-Spoke
Apply same pattern to `/getting-here`:
- Create spoke pages for: Ferry, Flights, Planning
- Convert `/getting-here` to hub with teasers
- Move travel FAQs to appropriate spoke pages

### 3. Accommodation Hub Page
Create `/accommodation` route as hub page:
- Show 3 property teaser cards
- Link to individual property pages
- Add intro content block

### 4. Optional Cleanup
- Add hero images to guide pages in Sanity Studio
- Review FAQ distribution across spoke pages
- Consider creating `/jura` as a guide page (currently separate)

## Technical Notes

### Dev Server
Use `npm run dev` which now uses `--webpack` flag (Turbopack had cache corruption issues).

### Sanity Token
The client requires `SANITY_API_TOKEN` env var to resolve references. This is a server-side only concern (token not exposed to client).

### Guide Page Schema
The `guidePage` schema is a document type (not singleton) allowing multiple guide pages. Each has:
- title, slug, heroImage, introduction
- contentBlocks[] (blockReference)
- faqBlocks[] (faqBlockReference)
- SEO fields

## Verification Commands

```bash
# Check guide pages exist in Sanity
npx tsx -e "
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});
client.fetch('*[_type==\"guidePage\"]{title, \"slug\": slug.current}')
  .then(console.log);
"

# Test build
npm run build
```

## Commit Reference
```
dee4230 feat: implement hub-and-spoke architecture for Explore Islay
```
