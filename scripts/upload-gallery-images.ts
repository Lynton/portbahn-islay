#!/usr/bin/env tsx
/**
 * Upload gallery images to Sanity and patch guidePage documents.
 *
 * Usage:
 *   npx tsx scripts/upload-gallery-images.ts                    # all guides
 *   npx tsx scripts/upload-gallery-images.ts islay-distilleries # single guide
 *
 * Images source: ~/dev/_work/pbi/images/gallery/{slug}/
 * Max 6 images per guide page (schema limit).
 */

import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const GALLERY_ROOT = path.resolve(__dirname, '../../../_work/pbi/images/gallery');
const MAX_IMAGES = 6;

function filenameToAlt(filename: string): string {
  return filename
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/geograph\.org\.uk\s+\d+/gi, '')
    .replace(/panoramio\s*\(\d+\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function uploadForGuide(slug: string): Promise<void> {
  const docId = `guide-${slug}`;
  const dir = path.join(GALLERY_ROOT, slug);

  if (!fs.existsSync(dir)) {
    console.log(`  ⏭  No image directory for ${slug}`);
    return;
  }

  const files = fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .slice(0, MAX_IMAGES);

  if (files.length === 0) {
    console.log(`  ⏭  No images in ${slug}/`);
    return;
  }

  console.log(`  📸 ${slug}: uploading ${files.length} images...`);

  const imageRefs: any[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(file).slice(1);

    const asset = await client.assets.upload('image', buffer, {
      filename: file,
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    });

    imageRefs.push({
      _type: 'image',
      _key: asset._id.replace('image-', '').slice(0, 12),
      alt: filenameToAlt(file),
      asset: { _type: 'reference', _ref: asset._id },
    });

    console.log(`    ✓ ${file} → ${asset._id}`);
  }

  await client
    .patch(docId)
    .set({ galleryImages: imageRefs })
    .commit();

  console.log(`  ✅ ${slug}: patched with ${imageRefs.length} gallery images`);
}

async function main(): Promise<void> {
  const targetSlug = process.argv[2];

  if (targetSlug) {
    console.log(`Uploading gallery images for: ${targetSlug}`);
    await uploadForGuide(targetSlug);
  } else {
    const dirs = fs.readdirSync(GALLERY_ROOT)
      .filter(d => fs.statSync(path.join(GALLERY_ROOT, d)).isDirectory());

    console.log(`Uploading gallery images for ${dirs.length} guides...\n`);

    for (const slug of dirs.sort()) {
      await uploadForGuide(slug);
    }
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
