/**
 * migrate-description-to-portabletext.ts
 *
 * One-time migration: converts property `description` (text) and
 * `locationIntro` (string) fields to PortableText array format.
 *
 * - description: splits on double newlines to preserve paragraphs
 * - locationIntro: wraps single string in one block
 *
 * Safe to re-run — skips documents where field is already an array.
 */

import { createClient } from 'next-sanity';
import { randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

function key(): string {
  return randomBytes(5).toString('hex');
}

function textToBlocks(text: string): any[] {
  // Split on double newlines to preserve paragraphs; trim each chunk
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: key(),
        text: paragraph,
        marks: [],
      },
    ],
  }));
}

async function run() {
  console.log('=== migrate-description-to-portabletext.ts ===\n');

  // Fetch all properties
  const properties = await client.fetch(
    `*[_type == "property"]{_id, name, description, locationIntro}`
  );

  console.log(`Found ${properties.length} properties.\n`);

  for (const prop of properties) {
    const patches: Record<string, any> = {};
    const skipped: string[] = [];
    const migrated: string[] = [];

    // description: migrate if it's a string (old text type)
    if (typeof prop.description === 'string' && prop.description.trim()) {
      patches.description = textToBlocks(prop.description);
      migrated.push(`description (${patches.description.length} block${patches.description.length > 1 ? 's' : ''})`);
    } else if (Array.isArray(prop.description)) {
      skipped.push('description (already PortableText)');
    } else if (!prop.description) {
      skipped.push('description (empty)');
    }

    // locationIntro: migrate if it's a string
    if (typeof prop.locationIntro === 'string' && prop.locationIntro.trim()) {
      patches.locationIntro = textToBlocks(prop.locationIntro);
      migrated.push(`locationIntro (${patches.locationIntro.length} block${patches.locationIntro.length > 1 ? 's' : ''})`);
    } else if (Array.isArray(prop.locationIntro)) {
      skipped.push('locationIntro (already PortableText)');
    } else if (!prop.locationIntro) {
      skipped.push('locationIntro (empty)');
    }

    if (Object.keys(patches).length > 0) {
      await client.patch(prop._id).set(patches).commit();
      console.log(`✓ ${prop.name} — migrated: ${migrated.join(', ')}`);
    } else {
      console.log(`  ${prop.name} — skipped: ${skipped.join(', ')}`);
    }
  }

  console.log('\n=== Migration complete ===');
}

run().catch(console.error);
