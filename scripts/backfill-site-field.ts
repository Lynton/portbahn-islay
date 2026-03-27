/**
 * Backfill `site` field on existing PBI documents and create BJR properties.
 *
 * Usage: npx tsx scripts/backfill-site-field.ts --dry-run
 *        npx tsx scripts/backfill-site-field.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || '',
})

const BJR_PROPERTIES = [
  {
    name: "Mrs Leonard's Cottage",
    slug: 'mrs-leonards-cottage',
    propertyType: 'cottage',
    site: 'bjr',
    tagline: 'Stone Cottage with Private Garden, Hot Tub & Sauna',
    details: {
      sleeps: 2,
      bedrooms: 1,
      bathrooms: 1,
      petsAllowed: true,
    },
  },
  {
    name: 'The Black Hut',
    slug: 'the-black-hut',
    propertyType: 'cabin',
    site: 'bjr',
    tagline: 'Timber Cabin with Hot Tub, Skylight & Corran Sands Views',
    details: {
      sleeps: 2,
      bedrooms: 1,
      bathrooms: 1,
      petsAllowed: true,
    },
  },
  {
    name: 'The Rusty Hut',
    slug: 'the-rusty-hut',
    propertyType: 'cabin',
    site: 'bjr',
    tagline: 'Corten-Steel Lodge with Hot Tub & Enclosed Garden',
    details: {
      sleeps: 2,
      bedrooms: 1,
      bathrooms: 1,
      petsAllowed: true,
    },
  },
  {
    name: "The Shepherd's Hut",
    slug: 'the-shepherds-hut',
    propertyType: 'hut',
    site: 'bjr',
    tagline: 'Off-Grid Glamping with Wood Stove',
    details: {
      sleeps: 2,
      bedrooms: 1,
      bathrooms: 0,
      petsAllowed: true,
    },
  },
]

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  console.log(`Dry run: ${dryRun}\n`)

  // 1. Backfill site: 'pbi' on documents without site field
  const docTypes = ['property', 'guidePage', 'faqCanonicalBlock', 'keyFactSet']
  for (const type of docTypes) {
    const docs = await client.fetch(
      `*[_type == $type && !defined(site)]{ _id }`,
      { type }
    )
    console.log(`${type}: ${docs.length} docs need site:'pbi'`)

    if (!dryRun && docs.length > 0) {
      const tx = client.transaction()
      for (const doc of docs) {
        tx.patch(doc._id, { set: { site: 'pbi' } })
      }
      await tx.commit()
      console.log(`  → Patched ${docs.length} documents`)
    }
  }

  // 2. Backfill sites: ['pbi'] on canonicalBlocks without sites field
  const blocks = await client.fetch(
    `*[_type == "canonicalBlock" && !defined(sites)]{ _id }`
  )
  console.log(`canonicalBlock: ${blocks.length} docs need sites:['pbi']`)

  if (!dryRun && blocks.length > 0) {
    const tx = client.transaction()
    for (const block of blocks) {
      tx.patch(block._id, { set: { sites: ['pbi'] } })
    }
    await tx.commit()
    console.log(`  → Patched ${blocks.length} blocks`)
  }

  // 3. Backfill site on singletons
  const singletonIds = [
    'homepage', 'aboutPage', 'accommodationPage', 'gettingHerePage',
    'contactPage', 'exploreIslayPage', 'privacyPage', 'termsPage',
  ]
  for (const id of singletonIds) {
    const doc = await client.fetch(
      `*[_id == $id && !defined(site)][0]{ _id }`,
      { id }
    )
    if (doc) {
      console.log(`singleton ${id}: needs site:'pbi'`)
      if (!dryRun) {
        await client.patch(doc._id).set({ site: 'pbi' }).commit()
        console.log(`  → Patched`)
      }
    }
  }

  // 4. Create BJR property documents
  console.log(`\nBJR Properties:`)
  for (const prop of BJR_PROPERTIES) {
    const existing = await client.fetch(
      `*[_type == "property" && slug.current == $slug][0]{ _id }`,
      { slug: prop.slug }
    )
    if (existing) {
      console.log(`  ${prop.name}: already exists (${existing._id})`)
      continue
    }

    console.log(`  ${prop.name}: creating...`)
    if (!dryRun) {
      const doc = await client.create({
        _type: 'property',
        name: prop.name,
        slug: { _type: 'slug', current: prop.slug },
        propertyType: prop.propertyType,
        site: prop.site,
        tagline: prop.tagline,
        details: prop.details,
      })
      console.log(`  → Created: ${doc._id}`)
    }
  }

  console.log(`\n${dryRun ? 'Dry run complete.' : 'Backfill complete.'}`)
}

main().catch(console.error)
