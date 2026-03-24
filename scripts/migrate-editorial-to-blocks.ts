/**
 * Migration script: Move extendedEditorial from guide pages into canonical blocks.
 *
 * For each page with extendedEditorial:
 * 1. Splits content at h3 boundaries
 * 2. Groups related sections into blocks per the migration plan
 * 3. Creates canonical blocks with the grouped content
 * 4. Appends block references to the guide page's contentBlocks
 * 5. Clears extendedEditorial
 *
 * Run: npx tsx scripts/migrate-editorial-to-blocks.ts
 *
 * IMPORTANT: This creates drafts. Review in Studio before publishing.
 */

import { createClient } from '@sanity/client'
import { nanoid } from 'nanoid'

const client = createClient({
  projectId: 't25lpmnm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// ── Types ──────────────────────────────────────────────────────────────
interface PTBlock {
  _key: string
  _type: string
  style?: string
  children?: Array<{ _key: string; _type: string; text?: string; marks?: string[] }>
  markDefs?: Array<{ _key: string; _type: string; href?: string }>
  level?: number
  listItem?: string
}

interface SectionGroup {
  title: string        // Block title (from first h3, or custom)
  kicker: string       // customKicker for the block reference
  content: PTBlock[]   // All PT blocks in this group (h3 headings stripped)
}

// ── Migration plan ─────────────────────────────────────────────────────
// Maps slugs → how to group their h3 sections into blocks.
// Each entry: [title, kicker, ...h3 headings to include]
// If a heading starts with "*", it means "include this heading AS a h3 within the block content"
// (for sections that should keep their sub-headings visible)

const MIGRATION_PLAN: Record<string, Array<{ title: string; kicker: string; headings: string[] }>> = {
  'food-and-drink': [
    { title: 'Dining on Islay — Practical Notes', kicker: 'Practical', headings: ['Booking Ahead on Islay', 'Opening Hours: A Reality Check'] },
  ],
  'walking': [
    { title: 'Walking Practicalities', kicker: 'Practical', headings: ['What to Wear and Carry', 'When to Come for Walking', 'Combining Walks with Other Activities'] },
    { title: 'Walking with Dogs & Jura', kicker: 'Notes', headings: ['Walking with Dogs', 'A Note on Jura'] },
  ],
  'family-holidays': [
    { title: 'Planning Your Family Week', kicker: 'Planning', headings: ['Planning Your Family Week', 'What to Pack'] },
    { title: 'Family Activities', kicker: 'Activities', headings: ['Singing Sands — Worth the Walk', 'Wildlife by Age'] },
  ],
  'visit-jura': [
    { title: 'Planning Your Jura Visit', kicker: 'Planning', headings: ['Fitting Jura into an Islay Week', 'The Character Difference'] },
    { title: 'Jura Practical Notes', kicker: 'Practical', headings: ['Practical Notes for a Jura Stay', 'We Live Here'] },
  ],
  'islay-beaches': [
    { title: 'Beach Planning & Singing Sands', kicker: 'Planning', headings: ['How to Plan a Beach Day on Islay', 'Singing Sands'] },
    { title: 'Swimming & Coastal Walks', kicker: 'Activities', headings: ['Wild Swimming on Islay', 'Beach Walks Worth Planning For'] },
  ],
  'islay-wildlife': [
    { title: 'Seasonal Wildlife Guide', kicker: 'Seasonal Guide', headings: ['When to Visit for Wildlife', 'Watching the Barnacle Geese at Loch Gruinart', 'Watching for Otters'] },
    { title: 'The Oa & Staying for Wildlife', kicker: 'Reserves', headings: ['The RSPB Oa and the Choughs', 'Staying at Shorefield for Wildlife'] },
  ],
  'archaeology-history': [
    { title: 'Planning Your Heritage Day', kicker: 'Planning', headings: ['Planning an Archaeology and History Day on Islay'] },
    { title: 'Islay\'s Heritage Sites in Detail', kicker: 'Detail', headings: ['The Lords of the Isles: Why Finlaggan Matters', 'The Kildalton Cross: Context for Visitors', 'Islay Archaeology Week and Active Research', 'Access Practicalities'] },
  ],
  'islay-villages': [
    { title: 'Islay Villages — Getting Oriented', kicker: 'Orientation', headings: ['Getting Oriented: The Rhinns and the Rest of the Island', 'Port Charlotte: The Rhinns\' Best Village', 'Bowmore: Main Town, Main Services'] },
    { title: 'Further Afield — Portnahaven to Port Ellen', kicker: 'Further Afield', headings: ['Portnahaven and Port Wemyss: The End of the Road', 'Port Askaig and Port Ellen: Functional Ports Worth Knowing', 'What\'s Open When'] },
  ],
  'arriving-on-islay': [
    { title: 'Your First Steps on Islay', kicker: 'Arrival', headings: ['You Made It', 'Port Askaig or Port Ellen — Your First Steps', 'Arriving Late', 'Early Departures'] },
    { title: 'Contingencies & First Stops', kicker: 'Practical', headings: ['If Your Ferry Is Cancelled', 'Weather: What to Expect', 'Your First Stop'] },
  ],
  'getting-around-islay': [
    { title: 'Transport Options on Islay', kicker: 'Transport', headings: ['The Whisky Trail Without a Key', 'Taxis on Islay', 'Local Buses — Islay Coaches', 'Cycling Around Islay', 'Bike Hire'] },
    { title: 'Walking & The Jura Ferry', kicker: 'Local Access', headings: ['Walking from Our Properties', 'The Jura Passenger Ferry'] },
  ],
  'ferry-to-islay': [
    { title: 'Routes, Booking & the Crossing', kicker: 'Routes', headings: ['The Two Routes from Kennacraig', 'Booking Your Crossing', 'What to Expect on the Crossing', 'Port Askaig or Port Ellen — Which Is Right for You?'] },
    { title: 'Cancellations & Getting to Kennacraig', kicker: 'Practical', headings: ['CalMac Cancellations — What to Do', 'Getting to Kennacraig'] },
    { title: 'Continuing to Jura', kicker: 'Onward', headings: ['Continuing to Jura'] },
  ],
  'planning-your-trip': [
    { title: 'When & How Long to Stay', kicker: 'Timing', headings: ['When to Visit Islay', 'Fèis Ìle — The Islay Whisky Festival', 'How Long to Stay'] },
    { title: 'What to Pack & Book', kicker: 'Practical', headings: ['What to Pack', 'Booking Ahead', 'Getting Around the Island'] },
  ],
  'travelling-without-a-car': [
    { title: 'Getting to Islay Without a Car', kicker: 'Routes', headings: ['You Don\'t Need a Car to Get Here', 'By Bus: Glasgow to Kennacraig', 'By Bike: Glasgow to Islay via Arran (The Adventure Route)', 'By Bike: Year-Round Alternative via NCN Route 75', 'Bikes on CalMac Ferries'] },
    { title: 'Arriving & Continuing', kicker: 'Onward', headings: ['Arriving as a Foot Passenger', 'Continuing to Jura'] },
  ],
  'islay-geology': [
    { title: 'Islay\'s Ancient Rocks', kicker: 'Geology', headings: ['The Rhinns Complex — Islay\'s Ancient Foundation', 'The Fault in the Landscape'] },
    { title: 'Key Geological Sites', kicker: 'Sites', headings: ['Port Askaig Tillite — Ice Age in a Road Cut', 'Stromatolites at Bunnahabhain — The Oldest Life in Scotland'] },
    { title: 'Walks & Further Reading', kicker: 'Resources', headings: ['Guided Walks — islaygeology.org', 'Further Reading and Resources'] },
  ],
  'dog-friendly-islay': [
    { title: 'Dog Life on Islay', kicker: 'Guide', headings: ['Islay Is a Dog\'s Island', 'Dog-Friendly Beaches on Islay', 'Walks with Your Dog'] },
    { title: 'Dog-Friendly Venues & Practicalities', kicker: 'Practical', headings: ['Dog-Friendly Pubs and Cafés', 'Practical Notes for Dog Owners on Islay', 'Getting Here with Your Dog and Where to Stay'] },
  ],
}

// ── Helpers ────────────────────────────────────────────────────────────

/** Split a PortableText array at h3 boundaries */
function splitAtH3(blocks: PTBlock[]): Map<string, PTBlock[]> {
  const sections = new Map<string, PTBlock[]>()
  let currentHeading = '__intro__'
  let currentBlocks: PTBlock[] = []

  for (const block of blocks) {
    if (block._type === 'block' && block.style === 'h3') {
      if (currentBlocks.length > 0) {
        sections.set(currentHeading, currentBlocks)
      }
      currentHeading = (block.children || []).map(c => c.text || '').join('')
      currentBlocks = []
    } else {
      currentBlocks.push(block)
    }
  }
  if (currentBlocks.length > 0) {
    sections.set(currentHeading, currentBlocks)
  }
  return sections
}

/** Slugify a string */
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log('── Editorial → Blocks Migration ──\n')

  // Fetch all pages with extendedEditorial
  const pages = await client.fetch(`
    *[_type == "guidePage" && defined(extendedEditorial) && count(extendedEditorial) > 0]{
      _id, title, "slug": slug.current, extendedEditorial,
      "existingBlockCount": count(contentBlocks)
    } | order(slug asc)
  `)

  console.log(`Found ${pages.length} pages with extendedEditorial\n`)

  let totalBlocksCreated = 0
  let totalPagesProcessed = 0

  for (const page of pages) {
    const plan = MIGRATION_PLAN[page.slug]
    if (!plan) {
      console.log(`⏭  ${page.slug} — no migration plan, skipping`)
      continue
    }

    console.log(`\n── ${page.slug} (${page.existingBlockCount} existing blocks) ──`)

    // Split editorial at h3 boundaries
    const sections = splitAtH3(page.extendedEditorial)
    console.log(`   ${sections.size} h3 sections found: ${[...sections.keys()].filter(k => k !== '__intro__').join(', ')}`)

    // Create blocks per plan
    const newBlockRefs: any[] = []

    for (const group of plan) {
      // Collect content from matching sections
      const groupContent: PTBlock[] = []
      let firstHeadingFound = false

      for (const heading of group.headings) {
        const sectionContent = sections.get(heading)
        if (sectionContent) {
          // Add h3 heading back for sub-sections within a group (except the first — it becomes the block title)
          if (firstHeadingFound) {
            groupContent.push({
              _key: nanoid(12),
              _type: 'block',
              style: 'h3',
              children: [{ _key: nanoid(12), _type: 'span', text: heading }],
            })
          }
          firstHeadingFound = true
          groupContent.push(...sectionContent)
        } else {
          console.log(`   ⚠  Section "${heading}" not found in editorial`)
        }
      }

      if (groupContent.length === 0) {
        console.log(`   ⚠  No content for group "${group.title}", skipping`)
        continue
      }

      // Also include any intro content (before first h3) in the first group
      if (plan.indexOf(group) === 0) {
        const introContent = sections.get('__intro__')
        if (introContent && introContent.length > 0) {
          groupContent.unshift(...introContent)
        }
      }

      // Create canonical block
      const blockId = `${page.slug}-${slugify(group.title)}`
      const canonicalHome = page.slug.startsWith('arriving') || page.slug.startsWith('getting') || page.slug.startsWith('ferry') || page.slug.startsWith('flights') || page.slug.startsWith('planning') || page.slug.startsWith('travelling')
        ? `/islay-travel/${page.slug}`
        : `/explore-islay/${page.slug}`

      const block = {
        _id: `editorial-block-${blockId}`,
        _type: 'canonicalBlock',
        blockId: { _type: 'slug', current: blockId },
        title: group.title,
        canonicalHome,
        fullContent: groupContent,
        notes: `Migrated from ${page.slug} extendedEditorial`,
      }

      // Output block as JSON for MCP creation (API token lacks create permission)
      console.log(`   📦 Block ready: ${blockId} (${groupContent.length} PT blocks)`)
      const outputPath = `scripts/migration-output/${blockId}.json`
      const fs = await import('fs')
      fs.mkdirSync('scripts/migration-output', { recursive: true })
      fs.writeFileSync(outputPath, JSON.stringify(block, null, 2))
      totalBlocksCreated++

      // Prepare block reference
      newBlockRefs.push({
        _key: nanoid(12),
        _type: 'blockReference',
        block: { _type: 'reference', _ref: `editorial-block-${blockId}` },
        version: 'full',
        customKicker: group.kicker,
      })
    }

    // Output page update instructions
    if (newBlockRefs.length > 0) {
      const updatePath = `scripts/migration-output/_page-update-${page.slug}.json`
      const fs = await import('fs')
      fs.writeFileSync(updatePath, JSON.stringify({
        pageId: page._id,
        slug: page.slug,
        newBlockRefs,
      }, null, 2))
      console.log(`   📋 Page update saved: +${newBlockRefs.length} block refs`)
      totalPagesProcessed++
    }
  }

  console.log(`\n── Done ──`)
  console.log(`   ${totalBlocksCreated} blocks created`)
  console.log(`   ${totalPagesProcessed} pages updated`)
  console.log(`\n⚠  All changes are DRAFTS. Review in Studio and publish when ready.`)
}

main().catch(console.error)
