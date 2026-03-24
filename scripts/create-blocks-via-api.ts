/**
 * Create migration blocks via Sanity Mutations API.
 * Uses createIfNotExists to be idempotent.
 *
 * Run: npx tsx scripts/create-blocks-via-api.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const PROJECT_ID = 't25lpmnm'
const DATASET = 'production'
const TOKEN = process.env.SANITY_API_TOKEN!

const MIGRATION_DIR = path.join(__dirname, 'migration-output')

async function main() {
  const files = fs.readdirSync(MIGRATION_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_page'))
  console.log(`Found ${files.length} block files to create\n`)

  // Batch mutations — Sanity supports up to 100 mutations per request
  const mutations: any[] = []

  for (const file of files) {
    const blockData = JSON.parse(fs.readFileSync(path.join(MIGRATION_DIR, file), 'utf-8'))
    mutations.push({
      createIfNotExists: blockData,
    })
  }

  console.log(`Sending ${mutations.length} mutations...`)

  const response = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    }
  )

  const result = await response.json()

  if (response.ok) {
    console.log(`✅ ${result.results?.length || 0} mutations applied`)

    // Now apply page updates
    const pageFiles = fs.readdirSync(MIGRATION_DIR).filter(f => f.startsWith('_page'))
    console.log(`\nApplying ${pageFiles.length} page updates...`)

    for (const pageFile of pageFiles) {
      const pageUpdate = JSON.parse(fs.readFileSync(path.join(MIGRATION_DIR, pageFile), 'utf-8'))

      const pageMutations = [
        {
          patch: {
            id: pageUpdate.pageId,
            setIfMissing: { contentBlocks: [] },
          }
        },
        ...pageUpdate.newBlockRefs.map((ref: any) => ({
          patch: {
            id: pageUpdate.pageId,
            insert: {
              after: 'contentBlocks[-1]',
              items: [ref],
            },
          },
        })),
        {
          patch: {
            id: pageUpdate.pageId,
            unset: ['extendedEditorial'],
          },
        },
      ]

      const pageResponse = await fetch(
        `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({ mutations: pageMutations }),
        }
      )

      const pageResult = await pageResponse.json()
      if (pageResponse.ok) {
        console.log(`  ✅ ${pageUpdate.slug}: +${pageUpdate.newBlockRefs.length} blocks, editorial cleared`)
      } else {
        console.log(`  ❌ ${pageUpdate.slug}: ${JSON.stringify(pageResult)}`)
      }
    }
  } else {
    console.log(`❌ Mutation failed: ${JSON.stringify(result)}`)
  }

  console.log('\n── Done ──')
}

main().catch(console.error)
