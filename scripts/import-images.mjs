/**
 * Sanity Image Import — Portbahn Islay
 * Uploads 120 property images (3 properties) and patches property documents.
 *
 * Run with: node scripts/import-images.mjs
 * Options:
 *   --upload-only     Skip document patching
 *   --patch-only      Skip uploads, patch from existing manifests
 *   --property <slug> Only process one property (portbahn-house | shorefield-eco-house | curlew-cottage)
 *   --dry-run         Log what would happen, no API calls
 */

import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, existsSync, createReadStream, statSync } from 'node:fs';
import { join, extname } from 'node:path';

// ── Config ──────────────────────────────────────────────────────────────────

const PROJECT_ID = 't25lpmnm';
const DATASET = 'production';
const API_VERSION = '2024-01-01';

// Token: set SANITY_API_TOKEN env var, or paste token directly from
// sanity.io/manage → project → API → Tokens
const TOKEN = process.env.SANITY_API_TOKEN || '';

const BASE_IMAGES_DIR = '/Users/lynton/dev/cw/pbi/assets/www_images';
const METADATA_DIR    = '/Users/lynton/dev/cw/pbi/assets';
const MANIFEST_DIR    = '/Users/lynton/dev/cw/pbi/assets';

const UPLOAD_ENDPOINT = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}`;

// NOTE: The schema field is `images` (not `gallery`). The brief says `gallery`
// but the actual property.ts schema uses `images`.
const GALLERY_FIELD = 'images';

const PROPERTIES = [
  {
    slug:         'portbahn-house',
    metadataFile: 'portbahn-image-metadata.json',
    manifestFile: 'portbahn-upload-manifest.json',
  },
  {
    slug:         'shorefield-eco-house',
    metadataFile: 'shorefield-image-metadata.json',
    manifestFile: 'shorefield-upload-manifest.json',
  },
  {
    slug:         'curlew-cottage',
    metadataFile: 'curlew-image-metadata.json',
    manifestFile: 'curlew-upload-manifest.json',
  },
];

// ── Arg parsing ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN     = args.includes('--dry-run');
const UPLOAD_ONLY = args.includes('--upload-only');
const PATCH_ONLY  = args.includes('--patch-only');
const propArg     = args.indexOf('--property');
const ONLY_PROP   = propArg !== -1 ? args[propArg + 1] : null;

// ── Sanity client (for queries + mutations) ──────────────────────────────────

const client = createClient({
  projectId:  PROJECT_ID,
  dataset:    DATASET,
  apiVersion: API_VERSION,
  token:      TOKEN,
  useCdn:     false,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(msg)  { console.log(msg); }
function info(msg) { console.log(`  ✓ ${msg}`); }
function warn(msg) { console.warn(`  ⚠ ${msg}`); }
function err(msg)  { console.error(`  ✗ ${msg}`); }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function contentTypeFor(filename) {
  const ext = extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png')  return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

/** Resolve filesystem path from JSON entry */
function resolveImagePath(entry) {
  // folder field is relative to BASE_IMAGES_DIR
  return join(BASE_IMAGES_DIR, entry.folder, entry.seo_filename);
}

/** Pad index to 3 digits for _key */
function makeKey(idx) {
  return `img-${String(idx + 1).padStart(3, '0')}`;
}

// ── Step 1: Upload images ────────────────────────────────────────────────────

async function uploadImage(imagePath, seoFilename) {
  const buffer = readFileSync(imagePath);
  const ct = contentTypeFor(seoFilename);

  const response = await fetch(UPLOAD_ENDPOINT, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type':  ct,
      'X-Sanity-Label': seoFilename,
    },
    body: buffer,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.document._id; // e.g. "image-abc123..."
}

async function uploadProperty(property) {
  const metadataPath = join(METADATA_DIR, property.metadataFile);
  const manifestPath = join(MANIFEST_DIR, property.manifestFile);

  log(`\n── ${property.slug} ──────────────────────────────`);

  // Load metadata
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
  const images = metadata.images;

  // Load existing manifest (for resume support)
  let manifest = [];
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    log(`  Resuming — ${manifest.length} previously uploaded`);
  }
  const uploaded = new Set(manifest.map(m => m.seo_filename));

  const toUpload = images.filter(img =>
    !img.exclude &&
    img.seo_filename &&
    !uploaded.has(img.seo_filename)
  );

  const alreadyExcluded = images.filter(img => img.exclude).length;
  log(`  Total entries: ${images.length} | Excluded: ${alreadyExcluded} | To upload: ${toUpload.length} | Already done: ${uploaded.size}`);

  for (let i = 0; i < toUpload.length; i++) {
    const entry = toUpload[i];
    const imagePath = resolveImagePath(entry);

    if (!existsSync(imagePath)) {
      warn(`File not found, skipping: ${imagePath}`);
      continue;
    }

    const fileSize = statSync(imagePath).size;
    const sizekB = Math.round(fileSize / 1024);

    if (DRY_RUN) {
      info(`[DRY RUN] Would upload: ${entry.seo_filename} (${sizekB}kB) → ${entry.sanity_field}`);
      continue;
    }

    process.stdout.write(`  [${i + 1}/${toUpload.length}] ${entry.seo_filename} (${sizekB}kB)... `);

    try {
      const assetId = await uploadImage(imagePath, entry.seo_filename);
      process.stdout.write(`✓ ${assetId}\n`);

      manifest.push({
        seo_filename: entry.seo_filename,
        sanity_field: entry.sanity_field,
        alt_text:     entry.alt_text || '',
        caption:      entry.caption  || '',
        asset_id:     assetId,
      });

      // Save after every upload (safe resume)
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

      // Brief says: run sequentially, avoid rate limiting
      await sleep(300);

    } catch (e) {
      process.stdout.write(`✗ ERROR\n`);
      err(e.message);
      err(`Stopping — fix error and re-run (manifest saved, will resume)`);
      process.exit(1);
    }
  }

  if (!DRY_RUN) {
    log(`  Upload complete. Manifest: ${manifestPath}`);
    const total = manifest.length;
    const heroes = manifest.filter(m => m.sanity_field === 'heroImage').length;
    const gallery = manifest.filter(m => m.sanity_field === 'gallery').length;
    log(`  ${total} total — ${heroes} hero, ${gallery} gallery`);
  }

  return manifest;
}

// ── Step 2: Query property document IDs ─────────────────────────────────────

async function getPropertyIds() {
  log('\n── Querying property document IDs ──────────────');
  const results = await client.fetch(
    `*[_type == "property"]{ _id, name, "slug": slug.current }`
  );
  const map = {};
  for (const p of results) {
    map[p.slug] = p._id;
    info(`${p.slug} → ${p._id}`);
  }
  return map;
}

// ── Step 3: Patch property documents ────────────────────────────────────────

async function patchProperty(propertyId, manifest, slug) {
  log(`\n── Patching: ${slug} (${propertyId}) ──`);

  const heroEntry = manifest.find(m => m.sanity_field === 'heroImage');
  const galleryEntries = manifest.filter(m => m.sanity_field === 'gallery');

  if (!heroEntry) {
    warn(`No heroImage entry in manifest for ${slug} — skipping hero patch`);
  }

  // ── heroImage patch ──
  if (heroEntry) {
    const heroPatch = {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroEntry.asset_id,
      },
      alt: heroEntry.alt_text,
      hotspot: { x: 0.5, y: 0.5, width: 1.0, height: 1.0 },
      crop:    { top: 0, bottom: 0, left: 0, right: 0 },
    };

    if (DRY_RUN) {
      info(`[DRY RUN] Would patch heroImage → ${heroEntry.asset_id}`);
    } else {
      await client
        .patch(propertyId)
        .set({ heroImage: heroPatch })
        .commit();
      info(`heroImage → ${heroEntry.asset_id}`);
    }
  }

  // ── images[] (gallery) patch ──
  if (galleryEntries.length === 0) {
    warn(`No gallery entries for ${slug} — skipping gallery patch`);
    return;
  }

  const galleryArray = galleryEntries.map((entry, idx) => {
    const item = {
      _type:  'image',
      _key:   makeKey(idx),
      asset: {
        _type: 'reference',
        _ref:  entry.asset_id,
      },
      alt: entry.alt_text,
    };
    if (entry.caption) {
      item.caption = entry.caption;
    }
    return item;
  });

  if (DRY_RUN) {
    info(`[DRY RUN] Would patch ${GALLERY_FIELD}[] with ${galleryArray.length} images`);
  } else {
    await client
      .patch(propertyId)
      .set({ [GALLERY_FIELD]: galleryArray })
      .commit();
    info(`${GALLERY_FIELD}[] → ${galleryArray.length} images patched`);
  }
}

// ── Step 4: Verify ───────────────────────────────────────────────────────────

async function verifyProperty(slug) {
  const result = await client.fetch(
    `*[_type == "property" && slug.current == $slug][0]{
      name,
      heroImage,
      "galleryCount": count(${GALLERY_FIELD})
    }`,
    { slug }
  );

  if (!result) {
    warn(`No property found for slug: ${slug}`);
    return;
  }

  const heroOk = result.heroImage?.asset?._ref ? '✓' : '✗ MISSING';
  const heroAlt = result.heroImage?.alt ? '✓' : '✗ NO ALT';
  log(`  ${result.name}: hero ${heroOk}, hero alt ${heroAlt}, gallery count: ${result.galleryCount ?? 0}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!TOKEN && !DRY_RUN) {
    err('SANITY_API_TOKEN is not set.');
    err('Set it in your shell: export SANITY_API_TOKEN=your_token');
    err('Or edit this script and add the token directly (see import-guide-pages.mjs for reference).');
    process.exit(1);
  }

  if (DRY_RUN) {
    log('\n🔍 DRY RUN MODE — no API calls will be made\n');
  }

  const properties = ONLY_PROP
    ? PROPERTIES.filter(p => p.slug === ONLY_PROP)
    : PROPERTIES;

  if (ONLY_PROP && properties.length === 0) {
    err(`Unknown property slug: ${ONLY_PROP}`);
    err(`Valid slugs: ${PROPERTIES.map(p => p.slug).join(', ')}`);
    process.exit(1);
  }

  // ── Uploads ──
  const manifests = {};

  if (!PATCH_ONLY) {
    for (const property of properties) {
      manifests[property.slug] = await uploadProperty(property);
    }
  } else {
    // Load existing manifests for patch-only mode
    for (const property of properties) {
      const manifestPath = join(MANIFEST_DIR, property.manifestFile);
      if (!existsSync(manifestPath)) {
        err(`Manifest not found for ${property.slug}: ${manifestPath}`);
        err('Run without --patch-only first to generate manifests.');
        process.exit(1);
      }
      manifests[property.slug] = JSON.parse(readFileSync(manifestPath, 'utf8'));
      log(`\nLoaded manifest for ${property.slug}: ${manifests[property.slug].length} images`);
    }
  }

  if (DRY_RUN || UPLOAD_ONLY) {
    if (UPLOAD_ONLY) log('\n--upload-only set, skipping document patches.');
    log('\nDone.');
    return;
  }

  // ── Get property IDs ──
  const propertyIds = await getPropertyIds();

  // ── Patch documents ──
  log('\n── Patching property documents ─────────────────');
  for (const property of properties) {
    const docId = propertyIds[property.slug];
    if (!docId) {
      err(`No document found for slug: ${property.slug}`);
      continue;
    }
    const manifest = manifests[property.slug];
    if (!manifest || manifest.length === 0) {
      warn(`Empty manifest for ${property.slug} — nothing to patch`);
      continue;
    }
    await patchProperty(docId, manifest, property.slug);
  }

  // ── Verify ──
  log('\n── Verification ─────────────────────────────────');
  for (const property of properties) {
    await verifyProperty(property.slug);
  }

  log('\n✅ Import complete.\n');
  log('Expected counts:');
  log('  Portbahn House   : 1 hero + 55 gallery = 56');
  log('  Shorefield       : 1 hero + 42 gallery = 43');
  log('  Curlew Cottage   : 1 hero + 20 gallery = 21');
  log('\nVerify in Sanity Studio: open each property → hero image + gallery should be populated.');
}

main().catch(e => {
  err(e.message);
  process.exit(1);
});
