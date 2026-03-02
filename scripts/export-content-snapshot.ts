#!/usr/bin/env tsx
/**
 * Export a full Sanity content snapshot to local dated files
 *
 * Usage:
 *   npx tsx scripts/export-content-snapshot.ts
 *   npx tsx scripts/export-content-snapshot.ts --date 2026-03-01
 *
 * Output: exports/content-snapshots/YYYY-MM-DD/
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

// --- Date ---
const rawArgs = process.argv.slice(2);
const dateIdx = rawArgs.indexOf('--date');
const exportDate =
  dateIdx !== -1 && rawArgs[dateIdx + 1]
    ? rawArgs[dateIdx + 1]
    : new Date().toISOString().slice(0, 10);

const SNAPSHOT_DIR = path.join(
  process.cwd(),
  'exports',
  'content-snapshots',
  exportDate
);

const DIRS = {
  pages: path.join(SNAPSHOT_DIR, 'pages'),
  canonicalBlocks: path.join(SNAPSHOT_DIR, 'canonical-blocks'),
  guidePages: path.join(SNAPSHOT_DIR, 'guide-pages'),
  faqBlocks: path.join(SNAPSHOT_DIR, 'faq-blocks'),
  siteEntities: path.join(SNAPSHOT_DIR, 'site-entities'),
  properties: path.join(SNAPSHOT_DIR, 'properties'),
};

// Singleton hub and static pages
const SINGLETON_PAGES = [
  { type: 'homepage',          route: '/',              file: 'homepage' },
  { type: 'exploreIslayPage',  route: '/explore-islay', file: 'explore-islay-page' },
  { type: 'accommodationPage', route: '/accommodation',  file: 'accommodation-page' },
  { type: 'gettingHerePage',   route: '/islay-travel',  file: 'islay-travel-page' },
  { type: 'aboutPage',         route: '/about-us',      file: 'about-page' },
  { type: 'contactPage',       route: '/contact',       file: 'contact-page' },
  { type: 'termsPage',         route: '/terms',         file: 'terms-page' },
  { type: 'privacyPage',       route: '/privacy',       file: 'privacy-page' },
];

// --- Helpers ---

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filepath: string, content: string): void {
  fs.writeFileSync(filepath, content, 'utf-8');
}

/** PortableText array → plain text with paragraph breaks */
function extractText(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => (b.children || []).map((c: any) => c.text || '').join(''))
    .join('\n\n');
}

/** Accept PortableText array, plain string, or null */
function toText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return extractText(value);
  return String(value);
}

function fmtDate(iso: string): string {
  return iso ? iso.slice(0, 10) : '';
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getSlug(doc: any): string {
  return (
    doc.slug?.current ||
    doc.blockId ||
    slugify(doc.title || doc.name || doc._id)
  );
}

// --- Canonical Blocks ---

async function exportCanonicalBlocks(): Promise<any[]> {
  console.log('\n📄 Canonical blocks...');
  ensureDir(DIRS.canonicalBlocks);

  const docs = await client.fetch(`
    *[_type == "canonicalBlock"] | order(title asc) {
      _id, _updatedAt, title,
      "blockId": blockId.current,
      blockType, renderAs,
      intro, fullContent, closingCta
    }
  `);

  if (!docs?.length) {
    console.log('  ⚠️  None found');
    return [];
  }

  const allParts: string[] = [];
  let ok = 0, err = 0;

  for (const doc of docs) {
    try {
      const slug = doc.blockId || slugify(doc.title || doc._id);
      const md = [
        `# ${doc.title || '(untitled)'}`,
        `**Block ID:** ${doc.blockId || '—'}`,
        `**Type:** ${doc.blockType || '—'}`,
        `**Render as:** ${doc.renderAs || '—'}`,
        `**Last updated:** ${fmtDate(doc._updatedAt)}`,
        '',
        '## Intro',
        toText(doc.intro) || '—',
        '',
        '## Full Content',
        toText(doc.fullContent) || '—',
        '',
        '## Closing CTA',
        toText(doc.closingCta) || '—',
      ].join('\n');

      writeFile(path.join(DIRS.canonicalBlocks, `${slug}.md`), md);
      allParts.push(md, '\n\n---\n\n');
      console.log(`  ✓ ${doc.title}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${doc.title}:`, e);
      err++;
    }
  }

  writeFile(path.join(DIRS.canonicalBlocks, '_all-blocks.md'), allParts.join(''));
  console.log(`  → ${ok} exported${err ? `, ${err} errors` : ''}`);
  return docs;
}

// --- Guide Pages ---

async function exportGuidePages(): Promise<any[]> {
  console.log('\n📖 Guide pages...');
  ensureDir(DIRS.guidePages);

  const docs = await client.fetch(`
    *[_type == "guidePage"] | order(slug.current asc) {
      _id, _updatedAt, title, slug,
      seoTitle, seoDescription,
      contentBlocks[]->{ _id, title, "blockId": blockId.current },
      featuredEntities[]->{ _id, name, entityId, category },
      faqBlocks[]->{ _id, question, category }
    }
  `);

  if (!docs?.length) {
    console.log('  ⚠️  None found');
    return [];
  }

  const allParts: string[] = [];
  let ok = 0, err = 0;

  for (const doc of docs) {
    try {
      const slug = doc.slug?.current || slugify(doc.title || doc._id);

      // Filter nulls — some blocks may be deleted/broken references
      const blockLines = (doc.contentBlocks || [])
        .filter((b: any) => b !== null)
        .map((b: any, i: number) => `${i + 1}. ${b.blockId || b._id || '—'} — ${b.title || '—'}`)
        .join('\n') || '—';

      const entityLines = (doc.featuredEntities || [])
        .filter((e: any) => e !== null)
        .map((e: any) => `- ${e.name || '—'} [${e.category || '—'}] — ${e.entityId?.current || e._id || '—'}`)
        .join('\n') || '—';

      const faqLines = (doc.faqBlocks || [])
        .filter((f: any) => f !== null)
        .map((f: any, i: number) => `${i + 1}. ${f._id} — ${f.question || '—'}`)
        .join('\n') || '—';

      const md = [
        `# ${doc.title || '(untitled)'}`,
        `**Slug:** /explore-islay/${slug}`,
        `**Last updated:** ${fmtDate(doc._updatedAt)}`,
        `**SEO Title:** ${doc.seoTitle || '—'}`,
        `**SEO Description:** ${doc.seoDescription || '—'}`,
        '',
        '## Content Blocks (in order)',
        blockLines,
        '',
        '## Featured Entities',
        entityLines,
        '',
        '## FAQ Blocks',
        faqLines,
      ].join('\n');

      writeFile(path.join(DIRS.guidePages, `${slug}.md`), md);
      allParts.push(md, '\n\n---\n\n');
      console.log(`  ✓ ${doc.title}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${doc.title}:`, e);
      err++;
    }
  }

  writeFile(path.join(DIRS.guidePages, '_all-guides.md'), allParts.join(''));
  console.log(`  → ${ok} exported${err ? `, ${err} errors` : ''}`);
  return docs;
}

// --- FAQ Blocks ---

async function exportFaqBlocks(): Promise<any[]> {
  console.log('\n❓ FAQ blocks...');
  ensureDir(DIRS.faqBlocks);

  // Note: faqCanonicalBlock is a single Q&A per document (not a block with a faqs[] array)
  const docs = await client.fetch(`
    *[_type == "faqCanonicalBlock"] | order(category asc, priority asc) {
      _id, _updatedAt, question, answer, category, priority, searchVolume
    }
  `);

  if (!docs?.length) {
    console.log('  ⚠️  None found');
    return [];
  }

  const allParts: string[] = [];
  let ok = 0, err = 0;

  for (const doc of docs) {
    try {
      // _id is already human-readable (e.g. faq-guide-archaeology-american-monument)
      const slug = doc._id;

      const md = [
        `# ${doc.question || '(no question)'}`,
        `**ID:** ${doc._id}`,
        `**Category:** ${doc.category || '—'}`,
        `**Priority:** ${doc.priority ?? '—'}`,
        `**Last updated:** ${fmtDate(doc._updatedAt)}`,
        '',
        toText(doc.answer) || '—',
      ].join('\n');

      writeFile(path.join(DIRS.faqBlocks, `${slug}.md`), md);
      allParts.push(md, '\n\n---\n\n');
      console.log(`  ✓ ${doc._id}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${doc._id}:`, e);
      err++;
    }
  }

  writeFile(path.join(DIRS.faqBlocks, '_all-faqs.md'), allParts.join(''));
  console.log(`  → ${ok} exported${err ? `, ${err} errors` : ''}`);
  return docs;
}

// --- Site Entities ---

async function exportSiteEntities(): Promise<any[]> {
  console.log('\n📍 Site entities...');
  ensureDir(DIRS.siteEntities);

  // Note: siteEntity uses `name` (not `title`) and `entityId` (not `slug`)
  const docs = await client.fetch(`
    *[_type == "siteEntity"] | order(category asc, name asc) {
      _id, _updatedAt, name, entityId, category,
      shortDescription, editorialNote,
      location, contact, attributes,
      island, status, tags[], schemaOrgType
    }
  `);

  if (!docs?.length) {
    console.log('  ⚠️  None found');
    return [];
  }

  const allParts: string[] = [];
  let ok = 0, err = 0;

  for (const doc of docs) {
    try {
      const slug = doc.entityId?.current || slugify(doc.name || doc._id);

      // Location
      const village = doc.location?.village || '—';
      const distStr = doc.location?.distanceFromBruichladdich || '—';

      // Contact
      const website = doc.contact?.website || '—';
      const phone = doc.contact?.phone || null;
      const email = doc.contact?.email || null;
      const contactParts: string[] = [];
      if (website !== '—') contactParts.push(`🌐 ${website}`);
      if (phone) contactParts.push(`📞 ${phone}`);
      if (email) contactParts.push(`✉️ ${email}`);

      // Attributes — flatten to key: value pairs
      const attrStr = doc.attributes
        ? Object.entries(doc.attributes)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
        : '—';

      const md = [
        `# ${doc.name || '(unnamed)'}`,
        `**ID:** ${slug}`,
        `**Category:** ${doc.category || '—'}`,
        `**Schema.org:** ${doc.schemaOrgType || '—'}`,
        `**Island:** ${doc.island || '—'}`,
        `**Status:** ${doc.status || '—'}`,
        `**Last updated:** ${fmtDate(doc._updatedAt)}`,
        '',
        '## Description',
        doc.shortDescription || '—',
        '',
        '## Editorial Note',
        doc.editorialNote || '—',
        '',
        '## Location',
        `- **Village:** ${village}`,
        `- **Distance from Bruichladdich:** ${distStr}`,
        '',
        '## Contact',
        contactParts.length ? contactParts.join('\n') : '—',
        '',
        '## Attributes',
        attrStr,
        '',
        '## Tags',
        (doc.tags || []).join(', ') || '—',
      ].join('\n');

      writeFile(path.join(DIRS.siteEntities, `${slug}.md`), md);
      allParts.push(md, '\n\n---\n\n');
      console.log(`  ✓ ${doc.name}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${doc.name || doc._id}:`, e);
      err++;
    }
  }

  writeFile(path.join(DIRS.siteEntities, '_all-entities.md'), allParts.join(''));
  console.log(`  → ${ok} exported${err ? `, ${err} errors` : ''}`);
  return docs;
}

// --- Properties (mirrors export-properties-json.ts output) ---

async function exportProperties(): Promise<any[]> {
  console.log('\n🏠 Properties...');
  ensureDir(DIRS.properties);

  const properties = await client.fetch(`
    *[_type == "property"] | order(name asc) {
      _id, _createdAt, _updatedAt, _rev,
      name, slug, propertyType,
      heroImage, images[],
      overviewIntro, overview, description, idealFor[],
      entityFraming { whatItIs, whatItIsNot[], primaryDifferentiator, category },
      trustSignals { ownership, established, guestExperience, localCredentials[] },
      propertyNickname, guestSuperlatives[],
      magicMoments[]{ moment, frequency },
      perfectFor[]{ guestType, why, reviewEvidence },
      honestFriction[]{ issue, context },
      ownerContext,
      reviewScores {
        airbnbScore, airbnbCount, airbnbBadges[],
        bookingScore, bookingCount, bookingCategory,
        googleScore, googleCount
      },
      reviewThemes[],
      reviewHighlights[]{ quote, source, rating },
      totalReviewCount,
      commonQuestions[]{ question, answer },
      sleeps, bedrooms, beds, bathrooms,
      sleepingIntro, sleepingArrangements, bedroomDetails[], bathroomDetails[],
      facilitiesIntro, facilities[],
      kitchenDining[], kitchenDiningNotes[],
      livingAreas[], livingAreasNotes[],
      heatingCooling[], heatingCoolingNotes[],
      entertainment[], entertainmentNotes[],
      laundryFacilities[], safetyFeatures[],
      outdoorIntro, outdoorFeatures[], outdoorFeaturesNotes[], outdoorSpaces,
      parkingInfo,
      includedIntro, included[], notIncluded[], includedInStay[],
      location, locationDetails{ address, coordinates, nearestTown },
      locationIntro, locationDescription, localArea,
      nearbyAttractions[], whatToDoNearby[],
      gettingHereIntro, gettingHere,
      postcode, latitude, longitude, directions,
      ferryInfo, airportDistance, portDistance,
      petFriendly, petPolicyIntro, petPolicyDetails[],
      petPolicy{ allowed, fee, conditions },
      policiesIntro, policies,
      checkInTime, checkOutTime, minimumStay,
      cancellationPolicy, paymentTerms, securityDeposit,
      licensingStatus, licenseNumber, licenseNotes,
      availabilityStatus, importantInfo[],
      dailyRate, weeklyRate,
      lodgifyPropertyId, lodgifyRoomId, lodgifyRoomTypeId, icsUrl,
      seoTitle, seoDescription, metaTitle, metaDescription,
      focusKeyword, ogImage, googleBusinessUrl, googlePlaceId
    }
  `);

  if (!properties?.length) {
    console.log('  ⚠️  None found');
    return [];
  }

  let ok = 0, err = 0;

  for (const property of properties) {
    try {
      const slug =
        property.slug?.current ||
        property.slug ||
        property.name?.toLowerCase().replace(/\s+/g, '-');
      const filepath = path.join(DIRS.properties, `${slug}.json`);
      writeFile(filepath, JSON.stringify(property, null, 2));
      console.log(`  ✓ ${property.name} → ${slug}.json`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${property.name}:`, e);
      err++;
    }
  }

  // _summary.json — same as existing export-properties-json.ts
  const summary = {
    exportedAt: new Date().toISOString(),
    totalProperties: properties.length,
    properties: properties.map((p: any) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug?.current || p.slug,
      filename: `${p.slug?.current || p.slug || p.name?.toLowerCase().replace(/\s+/g, '-')}.json`,
    })),
  };
  writeFile(path.join(DIRS.properties, '_summary.json'), JSON.stringify(summary, null, 2));

  console.log(`  → ${ok} exported${err ? `, ${err} errors` : ''}`);
  return properties;
}

// --- Singleton Pages (hub + static) ---

async function exportSingletonPages(): Promise<any[]> {
  console.log('\n🏠 Singleton pages...');
  ensureDir(DIRS.pages);

  const results: any[] = [];
  let ok = 0, err = 0;

  for (const page of SINGLETON_PAGES) {
    try {
      // Broad query covering all base fields + type-specific extras
      const doc = await client.fetch(`
        *[_type == "${page.type}" && !(_id in path("drafts.**"))][0] {
          _id, _updatedAt, title,
          scopeIntro, introText, tagline,
          seoTitle, seoDescription,
          contentBlocks[]->{ _id, title, "blockId": blockId.current },
          faqBlocks[]->{ _id, question, category },
          email, phone, address
        }
      `);

      if (!doc) {
        console.log(`  ⚠️  ${page.type} — no document found`);
        results.push({ _type: page.type, route: page.route, file: page.file, _missing: true });
        continue;
      }

      const blockLines = (doc.contentBlocks || [])
        .filter((b: any) => b !== null)
        .map((b: any, i: number) => `${i + 1}. ${b.blockId || b._id || '—'} — ${b.title || '—'}`)
        .join('\n') || '—';

      const faqLines = (doc.faqBlocks || [])
        .filter((f: any) => f !== null)
        .map((f: any, i: number) => `${i + 1}. ${f._id} — ${f.question || '—'}`)
        .join('\n') || '—';

      const intro = toText(doc.scopeIntro) || toText(doc.introText) || '—';

      const mdParts = [
        `# ${doc.title || page.type}`,
        `**Type:** ${page.type}`,
        `**Route:** ${page.route}`,
        `**Last updated:** ${fmtDate(doc._updatedAt)}`,
        `**SEO Title:** ${doc.seoTitle || '—'}`,
        `**SEO Description:** ${doc.seoDescription || '—'}`,
      ];

      if (doc.tagline) mdParts.push(`**Tagline:** ${doc.tagline}`);

      mdParts.push(
        '',
        '## Intro / Scope',
        intro,
        '',
        '## Content Blocks (referenced)',
        blockLines,
        '',
        '## FAQ Questions (referenced)',
        faqLines,
      );

      // contactPage extras
      if (doc.email || doc.phone || doc.address) {
        mdParts.push(
          '',
          '## Contact Details',
          `- **Email:** ${doc.email || '—'}`,
          `- **Phone:** ${doc.phone || '—'}`,
          `- **Address:** ${doc.address || '—'}`,
        );
      }

      const md = mdParts.join('\n');
      writeFile(path.join(DIRS.pages, `${page.file}.md`), md);
      results.push({ ...doc, _type: page.type, route: page.route, file: page.file });
      console.log(`  ✓ ${page.type} → ${page.route}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${page.type}:`, e);
      err++;
      results.push({ _type: page.type, route: page.route, file: page.file, _error: true });
    }
  }

  console.log(`  → ${ok} exported${err ? `, ${err} errors` : ''}`);
  return results;
}

// --- INDEX.md ---

function writeIndex(
  singletonPages: any[],
  canonicalBlocks: any[],
  guidePages: any[],
  faqBlocks: any[],
  siteEntities: any[],
  properties: any[]
): void {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  const pageRows = singletonPages
    .map((p) => {
      const status = p._missing ? '⚠️ missing' : p._error ? '✗ error' : fmtDate(p._updatedAt);
      return `| ${p.route} | ${p._type} | ${p.title || '—'} | ${status} |`;
    })
    .join('\n');

  const blockRows = canonicalBlocks
    .map((b) => `| ${b.blockId || '—'} | ${b.title || '—'} | ${b.blockType || '—'} | ${fmtDate(b._updatedAt)} |`)
    .join('\n');

  const guideRows = guidePages
    .map((g) => {
      const slug = g.slug?.current || '—';
      const blockCount = (g.contentBlocks || []).length;
      return `| ${slug} | ${g.title || '—'} | ${blockCount} | ${fmtDate(g._updatedAt)} |`;
    })
    .join('\n');

  const faqRows = faqBlocks
    .map((f) => {
      const q = f.question ? f.question.slice(0, 60) + (f.question.length > 60 ? '…' : '') : '—';
      return `| ${f._id} | ${q} | ${f.category || '—'} | ${fmtDate(f._updatedAt)} |`;
    })
    .join('\n');

  const entityRows = siteEntities
    .map((e) => `| ${e.entityId?.current || '—'} | ${e.name || '—'} | ${e.category || '—'} | ${fmtDate(e._updatedAt)} |`)
    .join('\n');

  const propertyRows = properties
    .map((p) => `| ${p.slug?.current || p.slug || '—'} | ${p.name || '—'} | ${fmtDate(p._updatedAt)} |`)
    .join('\n');

  const index = [
    '# Sanity Content Snapshot',
    `**Exported:** ${now}`,
    `**Dataset:** production`,
    `**Date folder:** ${exportDate}`,
    '',
    `## Hub & Static Pages (${singletonPages.length})`,
    '| Route | Type | Title | Last Updated |',
    '|-------|------|-------|-------------|',
    pageRows || '| — | — | — | — |',
    '',
    `## Canonical Blocks (${canonicalBlocks.length})`,
    '| Block ID | Title | Type | Last Updated |',
    '|----------|-------|------|-------------|',
    blockRows || '| — | — | — | — |',
    '',
    `## Guide Pages (${guidePages.length})`,
    '| Slug | Title | Blocks | Last Updated |',
    '|------|-------|--------|-------------|',
    guideRows || '| — | — | — | — |',
    '',
    `## FAQ Items (${faqBlocks.length})`,
    '| ID | Question (truncated) | Category | Last Updated |',
    '|----|----------------------|----------|-------------|',
    faqRows || '| — | — | — | — |',
    '',
    `## Site Entities (${siteEntities.length})`,
    '| Entity ID | Name | Category | Last Updated |',
    '|-----------|------|----------|-------------|',
    entityRows || '| — | — | — | — |',
    '',
    `## Properties (${properties.length})`,
    '| Slug | Name | Last Updated |',
    '|------|------|-------------|',
    propertyRows || '| — | — | — |',
  ].join('\n');

  writeFile(path.join(SNAPSHOT_DIR, '_INDEX.md'), index);
  console.log('\n📋 _INDEX.md written');
}

// --- _snapshot.json ---

function writeSnapshotJson(
  singletonPages: any[],
  canonicalBlocks: any[],
  guidePages: any[],
  faqBlocks: any[],
  siteEntities: any[],
  properties: any[]
): void {
  const snapshot = {
    exportedAt: new Date().toISOString(),
    dataset: 'production',
    exportDate,
    singletonPages,
    canonicalBlocks,
    guidePages,
    faqBlocks,
    siteEntities,
    properties,
  };
  writeFile(path.join(SNAPSHOT_DIR, '_snapshot.json'), JSON.stringify(snapshot, null, 2));
  console.log('📦 _snapshot.json written');
}

// --- Main ---

async function main(): Promise<void> {
  console.log(`\n🗂️  Sanity content snapshot`);
  console.log(`   Date: ${exportDate}`);
  console.log(`   Output: exports/content-snapshots/${exportDate}/`);

  ensureDir(SNAPSHOT_DIR);

  // Singletons must be sequential (one fetch per type); collections run in parallel
  const singletonPages = await exportSingletonPages();

  const [canonicalBlocks, guidePages, faqBlocks, siteEntities, properties] =
    await Promise.all([
      exportCanonicalBlocks(),
      exportGuidePages(),
      exportFaqBlocks(),
      exportSiteEntities(),
      exportProperties(),
    ]);

  writeIndex(singletonPages, canonicalBlocks, guidePages, faqBlocks, siteEntities, properties);
  writeSnapshotJson(singletonPages, canonicalBlocks, guidePages, faqBlocks, siteEntities, properties);

  const total =
    singletonPages.length +
    canonicalBlocks.length +
    guidePages.length +
    faqBlocks.length +
    siteEntities.length +
    properties.length;

  console.log(`\n✅ Snapshot complete — ${total} documents`);
  console.log(`   ${singletonPages.length} hub/static pages`);
  console.log(`   ${canonicalBlocks.length} canonical blocks`);
  console.log(`   ${guidePages.length} guide pages`);
  console.log(`   ${faqBlocks.length} FAQ blocks`);
  console.log(`   ${siteEntities.length} site entities`);
  console.log(`   ${properties.length} properties`);
  console.log(`\n   Output: exports/content-snapshots/${exportDate}/\n`);
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err);
  process.exit(1);
});
