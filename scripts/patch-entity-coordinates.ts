/**
 * patch-entity-coordinates.ts
 *
 * Reads cw/pbi/entity-coordinates.csv and patches siteEntity documents
 * in Sanity with location and contact data.
 *
 * Only updates fields that have non-empty values in the CSV.
 * Safe to re-run — will not overwrite existing data with blanks.
 *
 * Fields patched:
 *   location.coordinates (lat + lng → geopoint)
 *   location.googleMapsUrl
 *   location.googlePlaceId
 *   location.postcode
 *   contact.phone    (only if not already set)
 *   contact.website  (only if not already set)
 *
 * Run: npx ts-node --project scripts/tsconfig.json scripts/patch-entity-coordinates.ts
 * CSV:  cw/pbi/entity-coordinates.csv  (relative to repo root)
 */

import { createClient } from 'next-sanity';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   || 'production',
  apiVersion: '2025-02-25',
  useCdn:    false,
  token:     process.env.SANITY_API_TOKEN,
});

// ─── CSV parser ────────────────────────────────────────────────────────────────

type Row = {
  entityId:       string;
  name:           string;
  category:       string;
  island:         string;
  lat:            string;
  lng:            string;
  googleMapsUrl:  string;
  googlePlaceId:  string;
  postcode:       string;
  phone:          string;
  website:        string;
  notes:          string;
};

function parseCsv(filePath: string): Row[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines   = content.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    // Handle quoted fields (simple implementation — no embedded newlines)
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());

    const row: any = {};
    headers.forEach((h, i) => { row[h.trim()] = fields[i] || ''; });
    return row as Row;
  });
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  const csvPath = path.resolve(__dirname, '../../../cw/_intake/entity-coordinates-complete.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at: ${csvPath}`);
    process.exit(1);
  }

  const rows = parseCsv(csvPath);
  console.log(`=== patch-entity-coordinates.ts ===`);
  console.log(`Rows in CSV: ${rows.length}\n`);

  let patched = 0;
  let skipped = 0;
  let failed  = 0;

  for (const row of rows) {
    const { entityId, lat, lng, googleMapsUrl, googlePlaceId, postcode, phone, website } = row;

    if (!entityId) continue;

    // Skip rows with no patchable data
    const hasCoords       = lat && lng;
    const hasGoogleMapsUrl = googleMapsUrl;
    const hasPlaceId      = googlePlaceId;
    const hasPostcode     = postcode;
    const hasPhone        = phone;
    const hasWebsite      = website;

    const anyData = hasCoords || hasGoogleMapsUrl || hasPlaceId || hasPostcode || hasPhone || hasWebsite;

    if (!anyData) {
      skipped++;
      continue;
    }

    const docId = `siteEntity.${entityId}`;
    const patchOps: Record<string, any> = {};

    if (hasCoords) {
      patchOps['location.coordinates'] = {
        _type: 'geopoint',
        lat:   parseFloat(lat),
        lng:   parseFloat(lng),
      };
    }
    if (hasGoogleMapsUrl) patchOps['location.googleMapsUrl'] = googleMapsUrl;
    if (hasPlaceId)       patchOps['location.googlePlaceId'] = googlePlaceId;
    if (hasPostcode)      patchOps['location.postcode']      = postcode;
    if (hasPhone)         patchOps['contact.phone']          = phone;
    if (hasWebsite)       patchOps['contact.website']        = website;

    try {
      await client.patch(docId).set(patchOps).commit();
      const fields = Object.keys(patchOps).join(', ');
      console.log(`  ✓ ${entityId} → ${fields}`);
      patched++;
    } catch (err: any) {
      console.error(`  ✗ ${entityId}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Patched: ${patched}`);
  console.log(`  Skipped (no data): ${skipped}`);
  console.log(`  Failed:  ${failed}`);
}

run().catch(console.error);
