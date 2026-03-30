/**
 * Import BJR content from markdown files to Sanity.
 *
 * Phase 1: Enrich existing property documents with descriptions, facilities, SEO, etc.
 * Phase 2: Create guidePage documents + canonicalBlock documents from guide content.
 *
 * Usage: npx tsx scripts/import-bjr-content.ts --dry-run
 *        npx tsx scripts/import-bjr-content.ts
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

const CONTENT_DIR = path.resolve(__dirname, '../../../_work/bjr/content')

// ── Helpers ──

function textToPortableText(text: string): any[] {
  return text.split('\n\n').filter(Boolean).map(para => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2, 10), text: para.trim(), marks: [] }],
  }))
}

function parseMarkdownFile(filename: string): Record<string, string> {
  const content = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')
  return { _raw: content, _filename: filename }
}

function extractSection(raw: string, heading: string): string {
  // Split on ## headings, find matching section
  const sections = raw.split(/\n(?=## )/);
  for (const section of sections) {
    if (section.startsWith(`## ${heading}`) || section.startsWith(`## ${heading}\n`)) {
      // Return everything after the heading line
      const lines = section.split('\n')
      return lines.slice(1).join('\n').trim()
    }
  }
  return ''
}

function extractSubSection(raw: string, heading: string): string {
  const regex = new RegExp(`^### ${heading}\\s*\\n([\\s\\S]*?)(?=\\n### |\\n## |\\n---|\$)`, 'm')
  const match = raw.match(regex)
  return match ? match[1].trim() : ''
}

function extractBulletList(section: string): string[] {
  return section.split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.replace(/^-\s+/, '').trim())
}

function extractTableValue(raw: string, field: string): string {
  const regex = new RegExp(`\\|\\s*${field}\\s*\\|\\s*(.+?)\\s*\\|`, 'i')
  const match = raw.match(regex)
  return match ? match[1].trim() : ''
}

function extractSEO(raw: string): { seoTitle?: string; seoDescription?: string } {
  const section = extractSection(raw, 'SEO')
  const titleMatch = section.match(/\*\*title:\*\*\s*(.+)/i)
  const descMatch = section.match(/\*\*description:\*\*\s*(.+)/i)
  return {
    seoTitle: titleMatch?.[1].trim(),
    seoDescription: descMatch?.[1].trim(),
  }
}

// ── Phase 1: Enrich Properties ──

async function enrichProperties(dryRun: boolean) {
  console.log('\n=== Phase 1: Enrich BJR Properties ===\n')

  const propertyFiles = [
    'property-mrs-leonards-cottage.md',
    'property-the-black-hut.md',
    'property-the-rusty-hut.md',
    'property-the-shepherds-hut.md',
  ]

  for (const filename of propertyFiles) {
    const data = parseMarkdownFile(filename)
    const raw = data._raw
    const slug = extractTableValue(raw, 'slug') || filename.replace('property-', '').replace('.md', '')

    console.log(`Processing: ${slug}`)

    // Find existing property doc
    const existing = await client.fetch(
      `*[_type == "property" && slug.current == $slug][0]{ _id }`,
      { slug }
    )
    if (!existing) {
      console.log(`  ⚠ Not found in Sanity, skipping`)
      continue
    }

    const seo = extractSEO(raw)
    const descSection = extractSection(raw, 'Description')
    const facilitiesSection = extractSection(raw, 'Facilities')
    const highlightsSection = extractSection(raw, 'Highlights')
    const sharedSection = extractSection(raw, 'Shared Facilities')
    const commonQsRaw = extractSection(raw, 'Common Questions')

    // Parse common questions
    const commonQuestions: any[] = []
    const qBlocks = commonQsRaw.split(/\n### /).filter(Boolean)
    for (const block of qBlocks) {
      const lines = block.trim().split('\n')
      const question = lines[0].replace(/^#+\s*/, '').trim()
      const answer = lines.slice(1).join('\n').trim()
      if (question && answer && question.endsWith('?')) {
        commonQuestions.push({
          _key: Math.random().toString(36).slice(2, 10),
          question,
          answer,
        })
      }
    }

    const patch: any = {
      ...(seo.seoTitle && { seoTitle: seo.seoTitle }),
      ...(seo.seoDescription && { seoDescription: seo.seoDescription }),
      ...(descSection && { description: textToPortableText(descSection) }),
      ...(facilitiesSection && { facilities: extractBulletList(facilitiesSection) }),
      ...(highlightsSection && { highlights: extractBulletList(highlightsSection).map((h, i) => ({
        _key: Math.random().toString(36).slice(2, 10),
        text: h,
      })) }),
      ...(commonQuestions.length > 0 && { commonQuestions }),
      bookingUrl: extractTableValue(raw, 'bookingUrl') || undefined,
      overviewIntro: extractSection(raw, 'Description').split('\n')[0] || undefined,
    }

    // Add lodgify fields
    const lodgifyPropertyId = extractTableValue(raw, 'lodgifyPropertyId')
    const lodgifyRoomTypeId = extractTableValue(raw, 'lodgifyRoomTypeId')
    if (lodgifyPropertyId) {
      patch.lodgifyPropertyId = parseInt(lodgifyPropertyId)
      patch.lodgifyRoomTypeId = parseInt(lodgifyRoomTypeId)
    }

    // Clean undefined
    Object.keys(patch).forEach(k => { if (patch[k] === undefined) delete patch[k] })

    console.log(`  Fields: ${Object.keys(patch).join(', ')}`)
    console.log(`  Common Qs: ${commonQuestions.length}`)

    if (!dryRun) {
      await client.patch(existing._id).set(patch).commit()
      console.log(`  ✓ Patched`)
    }
  }
}

// ── Phase 2: Create Guide Pages + Canonical Blocks ──

async function importGuides(dryRun: boolean) {
  console.log('\n=== Phase 2: Create Guide Pages + Canonical Blocks ===\n')

  const guideFiles = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.startsWith('guide-') && !f.includes('-LL') && f.endsWith('.md'))

  let guidesCreated = 0
  let blocksCreated = 0

  for (const filename of guideFiles) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8')

    // Extract metadata from header
    const titleMatch = raw.match(/^# (.+)/m)
    const slugMatch = raw.match(/^slug:\s*(.+)/m)
    const title = titleMatch?.[1].trim() || filename.replace('guide-', '').replace('.md', '')
    const rawSlug = slugMatch?.[1].trim() || ''
    const slug = rawSlug.includes('/') ? rawSlug.split('/').pop()! : rawSlug

    if (!slug) {
      console.log(`  ⚠ No slug for ${filename}, skipping`)
      continue
    }

    console.log(`Guide: ${title} (${slug})`)

    const seo = extractSEO(raw)
    const introSection = extractSection(raw, 'Introduction')
    // Strip markdown emphasis from intro
    const intro = introSection.replace(/^\*(.+)\*\n\n/, '').trim()

    // Check if guidePage already exists
    const existing = await client.fetch(
      `*[_type == "guidePage" && slug.current == $slug && site == "bjr"][0]{ _id }`,
      { slug }
    )

    if (existing) {
      console.log(`  Already exists, skipping`)
      continue
    }

    // Extract canonical block content
    const blocksSection = extractSection(raw, 'Content Blocks')
    const blockMatches = blocksSection.split(/\n### /).filter(Boolean)
    const blockRefs: any[] = []

    for (const blockRaw of blockMatches) {
      const lines = blockRaw.trim().split('\n')
      const blockId = lines[0].trim()
      if (!blockId || blockId.startsWith('#')) continue

      const fullMatch = blockRaw.match(/\*\*Full content:\*\*\s*\n([\s\S]*?)(?=\*\*Teaser content:\*\*|---|\n### |$)/i)
      const teaserMatch = blockRaw.match(/\*\*Teaser content:\*\*\s*\n([\s\S]*?)(?=\*\*Teaser link:\*\*|---|\n### |$)/i)

      const fullContent = fullMatch?.[1]?.trim()
      const teaserContent = teaserMatch?.[1]?.trim()

      if (!fullContent) continue

      // Check if block already exists
      const existingBlock = await client.fetch(
        `*[_type == "canonicalBlock" && blockId.current == $blockId][0]{ _id }`,
        { blockId }
      )

      let blockDocId: string

      if (existingBlock) {
        blockDocId = existingBlock._id
        console.log(`  Block ${blockId}: exists`)
      } else {
        const blockTitle = blockId.replace(/^bjr-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

        if (!dryRun) {
          const doc = await client.create({
            _type: 'canonicalBlock',
            blockId: { _type: 'slug', current: blockId },
            title: blockTitle,
            sites: ['bjr'],
            entityType: 'place',
            canonicalHome: `/explore-jura/${slug}`,
            fullContent: textToPortableText(fullContent),
            ...(teaserContent && { teaserContent: textToPortableText(teaserContent) }),
          })
          blockDocId = doc._id
          blocksCreated++
          console.log(`  Block ${blockId}: created`)
        } else {
          blockDocId = `dry-run-${blockId}`
          blocksCreated++
          console.log(`  Block ${blockId}: would create`)
        }
      }

      blockRefs.push({
        _key: Math.random().toString(36).slice(2, 10),
        _type: 'blockReference',
        block: { _type: 'reference', _ref: blockDocId },
        version: 'full',
      })
    }

    // Create the guidePage
    const guideDoc: any = {
      _type: 'guidePage',
      title,
      slug: { _type: 'slug', current: slug },
      site: 'bjr',
      ...(intro && { introduction: intro }),
      ...(seo.seoTitle && { seoTitle: seo.seoTitle }),
      ...(seo.seoDescription && { seoDescription: seo.seoDescription }),
      ...(blockRefs.length > 0 && { contentBlocks: blockRefs }),
      schemaType: 'Article',
    }

    if (!dryRun) {
      const created = await client.create(guideDoc)
      guidesCreated++
      console.log(`  ✓ Guide created: ${created._id} (${blockRefs.length} blocks)`)
    } else {
      guidesCreated++
      console.log(`  Would create guide (${blockRefs.length} blocks)`)
    }
  }

  console.log(`\nGuides: ${guidesCreated} | Blocks: ${blocksCreated}`)
}

// ── Main ──

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  console.log(`BJR Content Import | Dry run: ${dryRun}`)

  await enrichProperties(dryRun)
  await importGuides(dryRun)

  console.log(`\n${dryRun ? 'Dry run complete.' : 'Import complete.'}`)
}

main().catch(console.error)
