# Cowork Handoff: Canonical Blocks Editorial Merge
**Date:** 2026-02-20
**From:** /dev (Claude Code session 5b1c176)
**For:** Cowork (editorial review + merged spec production)
**Priority:** High — content in Sanity is good but needs one more editorial pass

---

## What's Been Done (Don't Redo)

All 16 canonical blocks are now live in Sanity production, populated from V2
(`CANONICAL-BLOCKS-FINAL-V2_LL2.md` — Pi's copy-edited Jan 26 version).

The hub pages (`/travel-to-islay`, `/explore-islay`) are wired up and rendering
blocks. Hub page SEO fields, scopeIntro, entityFraming, trustSignals are all
populated from `HUB-PAGE-CONTENT-DRAFT.md`.

**Git state:** `main` at `5b1c176`, pushed, Vercel deploying.

---

## Your Task

Produce a single merged markdown file:

**Output:** `docs/content/CANONICAL-BLOCKS-MERGED.md`

This becomes the new canonical source of truth, replacing both V2 and V3 files.
Once it lands in `/dev`, I run a fresh import and it's done.

---

## The Core Problem

Two versions of the canonical blocks exist with different strengths:

| | V2 (`CANONICAL-BLOCKS-FINAL-V2_LL2.md`) | V3 (`CANONICAL-BLOCKS-FINAL.md`) |
|---|---|---|
| **Date** | Jan 26 | Feb 20 |
| **Voice** | ✅ Rich, personal, Pi's edits | ❌ Generic, condensed |
| **Local detail** | ✅ Full — named people, anecdotes | ❌ Stripped |
| **Structure** | Reasonable but not playbook-aligned | Cleaner headings |
| **Completeness** | Mostly complete | Some V3-only additions |
| **Currently in Sanity** | ✅ Yes (just restored) | Was in Sanity before today |

**Rule:** V2 = baseline. Add genuine V3 additions. Don't lose V2 voice.

---

## Block-by-Block Instructions

Work through all 16 blocks. For each one:
1. Start with V2 as the draft
2. Check V3 — does it add anything V2 genuinely lacks?
3. Check the corrected source files (listed below) for any detail neither version captured
4. Apply playbook alignment (see Playbook Rules section below)
5. Write the merged version into `CANONICAL-BLOCKS-MERGED.md`

### Blocks That Need Careful Attention

These had the biggest losses in V3 — V2 is already restored in Sanity, but worth
a careful editorial pass to ensure nothing was missed:

**`ferry-basics`** (V2: `travel-to-islay`)
- V2 is rich and good. Check: does V3's `GETTING-HERE-V3-CORRECTED.md` add anything?
- V3 gave Loganair flight info a cleaner subheading structure — worth adopting
- Keep all of: journey narrative, Kirsty's pies, seals/dolphins/jellyfish,
  motion sickness tips, Loch Fyne lunch stop, Inveraray, "part of the holiday" framing

**`ferry-support`**
- V2 has the full version with: flexible tickets section, travel insurance recommendation,
  "8+ years never had a booking collapse" commitment, cancellation steps
- V3 stripped the flexible tickets and insurance sections — keep V2's fuller version

**`trust-signals`**
- V2 has three named guest quotes (Sarah, James & Emma, Louise), "Real family homes"
  section, "raised two children here" — all essential, keep all of it
- V3 stripped to bare stats — V2 is clearly better

**`families-children`**
- V2 is substantially better. Keep everything: Persabus Pottery anecdote ("our house
  has plenty of treasured mugs"), Islay's Plaice + The Cottage in family eating,
  Atlantic beach safety warning (Machir Bay, Saligo NOT safe), "kids didn't want
  screens all week" closing guest quote
- Check `EXPLORE-ISLAY-V3-CORRECTED.md` for any additions

**`distilleries-overview`**
- V2 has: "how many distilleries per day" guidance (2 comfortable, 3 rushed),
  cluster planning, drink-driving/driver's drams advice, whisky group anecdote
- V3 stripped all of this — keep V2's fuller version

**`wildlife-geese`**
- V2 has: eagle ID tip ("does it look like a barn door?"), seals from breakfast table,
  otters, dolphins/porpoises/minke whales/basking sharks, RSPB Oa
- V3 stripped to just geese + bare eagle mention — keep V2's fuller version

**`food-drink-islay`**
- V2 already has: Islay's Plaice, The Cottage Bowmore, The Copper Still Port Ellen,
  SeaSalt Bistro Port Ellen, Aileen's Mini-Market (and "Debbie's"), Port Charlotte
  Stores, Port Ellen Co-op, Jean's Fresh Fish Van — verify all survived the restore

**`bothan-jura-teaser`**
- V2 has unit character descriptions: Rusty Hut (Southport Pier boards), Black Hut
  (Shaun the Welsh joiner), Mrs Leonard's Cottage (century-old cotters' cottage),
  Jura Passenger Ferry Tayvallich route (March–Sept)
- These are important distinguishing details — keep all of them

### Blocks That Are Probably Fine (Spot-Check Only)

- `bruichladdich-proximity` — V2 has geological detail (gneiss, South America, earthquakes, Bridgend Woods)
- `portbahn-beach` — Short block, V2 is good
- `shorefield-character` — V2 has Jackson family story, "big hug" quote, bird hides detail
- `port-charlotte-village` — V2 has Grahame & Isabelle, Jack & Iain named, full platter description
- `beaches-overview` — V2 has safety warnings, water temp, wetsuit recommendation
- `jura-day-trip` — V2 has full day itinerary, Lussa Gin, one-road/one-pub context
- `jura-longer-stay` — V2 has Barnhill, Corryvreckan, Paps climb, K Foundation
- `about-us` — V2 has Pi, Lynton and Amba sign-off, Curlew/Shorefield ownership context

---

## Source Files to Read

| File | What it contains |
|------|-----------------|
| `_claude-handoff/CANONICAL-BLOCKS-FINAL-V2_LL2.md` | V2 baseline — start here |
| `docs/content/CANONICAL-BLOCKS-FINAL.md` | V3 — check for genuine additions only |
| `docs/content/EXPLORE-ISLAY-V3-CORRECTED.md` | Source for Explore Islay content — check for anything not in either block version |
| `docs/content/GETTING-HERE-V3-CORRECTED.md` | Source for ferry content — check against ferry-basics and ferry-support |
| `docs/content/PORTBAHN-TONE-OF-VOICE-SKILL.md` | Tone guide — reference for voice alignment |

---

## Output Format

The merged file must use V3's heading format (not V2's) because the import
script targets V3 format:

```markdown
### Block N: `block-id`

**Entity Type:** X
**Canonical Home:** /route

#### Full Version

[content]

#### Teaser Version

[content]

#### Key Facts (immutable)

| Fact | Value |
|------|-------|
| ... | ... |

---
```

V3 block order and IDs (these are what's in Sanity — do not change blockIds):

1. `ferry-basics`
2. `ferry-support`
3. `trust-signals`
4. `bruichladdich-proximity`
5. `portbahn-beach`
6. `shorefield-character`
7. `port-charlotte-village`
8. `distilleries-overview`
9. `wildlife-geese`
10. `food-drink-islay`
11. `beaches-overview`
12. `families-children`
13. `jura-day-trip`
14. `jura-longer-stay`
15. `bothan-jura-teaser`
16. `about-us`

Note: V2 called `ferry-basics` by the name `travel-to-islay` — they are the
same block. Use `ferry-basics` as the blockId in the merged file.

---

## Playbook Alignment Rules

Apply these to every block during the merge pass:

**1. Entity density**
Each full version should name specific places, people, and facts. No vague
generalities. "Bruichladdich Distillery, 5-minute walk" not "a nearby distillery".

**2. Passage extraction**
AI surfaces extract self-contained passages. Each major subsection should make
sense as a standalone paragraph. Avoid dangling references like "as mentioned
above".

**3. Voice**
Warm, personal, first-person where appropriate. "We've raised our two children
here" is correct. "Families will enjoy" is not.

**4. Teasers**
Each teaser should: (a) give the single most compelling fact, (b) end with a
specific `[Link text →](/route#anchor)` call to action. Max ~60 words.

**5. Key Facts**
Immutable figures only. If a number is in the facts table it must exactly match
the CLAUDE.md critical facts table. Do not approximate or round.

**Critical facts (must be consistent):**
- Walk to Bruichladdich Distillery: **5 minutes**
- Ferry to Port Askaig: **2 hours**
- Ferry to Port Ellen: **2 hours 20 minutes**
- Ferry booking window: **12 weeks**
- Guests hosted: **600+**
- Average rating: **4.97/5**
- Communication rating: **5.0/5**
- Distilleries on Islay: **10**
- Barnacle geese: **30,000+**
- Portbahn Beach walk: **5 minutes** via war memorial path
- Port Charlotte drive: **5 minutes**
- Port Charlotte walk: **40 minutes**
- Owner name: **Alan** (not Allan) — Curlew Cottage

---

## What Happens After

Once `docs/content/CANONICAL-BLOCKS-MERGED.md` is in `/dev`:

1. I update `scripts/import-canonical-blocks.ts` to point to the merged file
2. Run the import — all 16 blocks updated in Sanity via `createOrReplace`
3. Commit as `chore: reimport canonical blocks from merged V2+V3 source`
4. Sanity Studio shows updated content; frontend reflects immediately

---

## What NOT to Do

- Do not change blockIds — they're referenced by Sanity document IDs
- Do not edit `HUB-PAGE-CONTENT-DRAFT.md` — that's already been imported
- Do not produce a new hub page spec — hub pages are done
- Do not restructure the Sanity schema — schema is stable
- Do not touch `ferry-basics` canonical home — it maps to `/travel-to-islay`
  (even though V3 called the route `/getting-here` — `/travel-to-islay` is correct)
