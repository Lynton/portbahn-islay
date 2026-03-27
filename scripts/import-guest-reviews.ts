/**
 * Import guest reviews to Sanity
 *
 * Merges raw review data (full text, dates, host responses) with
 * LLM-tagged data (tags, pullQuotes, featured flags).
 *
 * Usage: npx tsx scripts/import-guest-reviews.ts --site bjr --dry-run
 *        npx tsx scripts/import-guest-reviews.ts --site bjr
 *        npx tsx scripts/import-guest-reviews.ts --site pbi
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || '',
})

// Property code → slug mapping (for property references)
const PROPERTY_SLUGS: Record<string, Record<string, string>> = {
  bjr: {
    'ML': 'mrs-leonards-cottage',
    'BH': 'the-black-hut',
    'RH': 'the-rusty-hut',
    'SH': 'the-shepherds-hut',
    // Full names from raw data
    'Mrs Leonards Cottage': 'mrs-leonards-cottage',
    "Mrs Leonard's Cottage": 'mrs-leonards-cottage',
    'The Black Hut': 'the-black-hut',
    'The Rusty Hut': 'the-rusty-hut',
    "The Shepherd's Hut": 'the-shepherds-hut',
  },
  pbi: {
    'PB': 'portbahn-house',
    'SHF': 'shorefield-eco-house',
    'CC': 'curlew-cottage',
    'Portbahn House': 'portbahn-house',
    'Shorefield Eco House': 'shorefield-eco-house',
    'Curlew Cottage': 'curlew-cottage',
  },
}

interface RawReview {
  platform: string
  property: string
  propertyCode: string
  reviewer: string
  rating: number
  ratingOutOf: number
  date: string
  text: string
  hostResponse?: string
}

interface TaggedReview {
  reviewer: string
  property: string
  platform: string
  rating: number
  tags: string[]
  pullQuote: string | null
  featured: boolean
  featuredOn: string[]
  sentiment: string
  negativeFeedback: string | null
}

function parseDate(dateStr: string): string | undefined {
  // Format: "September 2025", "March 2026", "2 months ago", etc.
  const monthYear = dateStr.match(/^(\w+)\s+(\d{4})$/)
  if (monthYear) {
    const months: Record<string, string> = {
      January: '01', February: '02', March: '03', April: '04',
      May: '05', June: '06', July: '07', August: '08',
      September: '09', October: '10', November: '11', December: '12',
    }
    const month = months[monthYear[1]]
    if (month) return `${monthYear[2]}-${month}-15` // mid-month approximation
  }
  return undefined
}

function inferSeason(dateStr: string): string | undefined {
  const month = dateStr.match(/^(\w+)/)
  if (!month) return undefined
  const m = month[1].toLowerCase()
  if (['march', 'april', 'may'].includes(m)) return 'spring'
  if (['june', 'july', 'august'].includes(m)) return 'summer'
  if (['september', 'october', 'november'].includes(m)) return 'autumn'
  if (['december', 'january', 'february'].includes(m)) return 'winter'
  return undefined
}

async function main() {
  const args = process.argv.slice(2)
  const siteIdx = args.indexOf('--site')
  const site = siteIdx >= 0 ? args[siteIdx + 1] : 'bjr'
  const dryRun = args.includes('--dry-run')

  if (!['bjr', 'pbi'].includes(site)) {
    console.error('Invalid site. Use --site bjr or --site pbi')
    process.exit(1)
  }

  const basePath = site === 'bjr'
    ? path.resolve(__dirname, '../../../_work/bjr/specs/reviews')
    : path.resolve(__dirname, '../../../_work/pbi/specs/reviews')

  const rawPath = path.join(basePath, 'all-reviews.json')
  const taggedPath = path.join(basePath, 'all-reviews-llm-tagged.json')

  if (!fs.existsSync(rawPath)) {
    console.error(`Raw reviews not found: ${rawPath}`)
    process.exit(1)
  }
  if (!fs.existsSync(taggedPath)) {
    console.error(`Tagged reviews not found: ${taggedPath}`)
    process.exit(1)
  }

  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf-8'))
  const rawReviews: RawReview[] = rawData.reviews || rawData
  const taggedReviews: TaggedReview[] = JSON.parse(fs.readFileSync(taggedPath, 'utf-8'))

  console.log(`Site: ${site.toUpperCase()}`)
  console.log(`Raw reviews: ${rawReviews.length}`)
  console.log(`Tagged reviews: ${taggedReviews.length}`)
  console.log(`Dry run: ${dryRun}`)
  console.log()

  // Look up property _id by slug
  const propertyMap = new Map<string, string>()
  const slugMap = PROPERTY_SLUGS[site] || {}

  if (!dryRun) {
    const properties = await client.fetch(
      `*[_type == "property" && site == $site]{ _id, slug }`,
      { site }
    )
    for (const p of properties) {
      if (p.slug?.current) {
        propertyMap.set(p.slug.current, p._id)
      }
    }
    console.log(`Found ${propertyMap.size} ${site.toUpperCase()} properties in Sanity`)
  }

  // Match tagged reviews to raw reviews by reviewer + property + platform
  const documents: any[] = []
  let matched = 0
  let unmatched = 0

  for (let i = 0; i < taggedReviews.length; i++) {
    const tagged = taggedReviews[i]

    // Find matching raw review
    // Tagged Google reviews use 'site-wide' as property; raw uses 'BJR'/'PBI' code
    const raw = rawReviews.find(r =>
      r.reviewer === tagged.reviewer &&
      r.platform === tagged.platform &&
      (r.propertyCode === tagged.property ||
       r.property === tagged.property ||
       tagged.property === 'site-wide')
    )

    if (!raw) {
      unmatched++
      continue
    }
    matched++

    // Resolve property reference
    const propSlug = slugMap[tagged.property] || slugMap[raw.property]
    const propId = propSlug ? propertyMap.get(propSlug) : undefined

    const doc: any = {
      _type: 'guestReview',
      text: raw.text,
      pullQuote: tagged.pullQuote || undefined,
      reviewer: raw.reviewer,
      platform: raw.platform,
      site,
      rating: raw.rating,
      ratingOutOf: raw.ratingOutOf || 5,
      date: parseDate(raw.date),
      tags: tagged.tags?.length ? tagged.tags : undefined,
      featured: tagged.featured || false,
      featuredOn: tagged.featured && tagged.featuredOn?.length ? tagged.featuredOn : undefined,
      hostResponse: raw.hostResponse || undefined,
      stayDetails: {
        season: inferSeason(raw.date),
      },
    }

    // Only add property reference if we found the property in Sanity
    if (propId) {
      doc.property = { _type: 'reference', _ref: propId }
    }

    // Clean undefined values
    Object.keys(doc).forEach(key => {
      if (doc[key] === undefined) delete doc[key]
    })
    if (doc.stayDetails && !doc.stayDetails.season) delete doc.stayDetails

    documents.push(doc)
  }

  console.log(`Matched: ${matched} | Unmatched: ${unmatched}`)
  console.log(`Documents to create: ${documents.length}`)

  if (dryRun) {
    console.log('\nSample documents (first 3):')
    for (const doc of documents.slice(0, 3)) {
      console.log(JSON.stringify(doc, null, 2))
      console.log()
    }
    console.log('Dry run complete. Run without --dry-run to import.')
    return
  }

  // Batch import using transactions
  const BATCH_SIZE = 50
  let created = 0

  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE)
    const tx = client.transaction()
    for (const doc of batch) {
      tx.create(doc)
    }
    await tx.commit()
    created += batch.length
    console.log(`Created ${created}/${documents.length} reviews`)
  }

  console.log(`\nImport complete: ${created} guest reviews created for ${site.toUpperCase()}`)
}

main().catch(console.error)
