import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 't25lpmnm',
  dataset: 'production',
  apiVersion: '2025-02-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  // 1. All canonical blocks
  const blocks = await client.fetch(`
    *[_type in ['canonicalBlock','faqCanonicalBlock']] | order(_type, blockId.current) {
      _type,
      "blockId": blockId.current,
      title,
      "fullLinks": count(fullContent[].markDefs[_type == 'link']),
      "teaserLinks": count(teaserContent[].markDefs[_type == 'link']),
      "fullLen": length(pt::text(fullContent)),
      "teaserLen": length(pt::text(teaserContent))
    }
  `);

  console.log('\n=== CANONICAL BLOCKS ===');
  console.log('type'.padEnd(22) + 'blockId'.padEnd(42) + 'fullLinks'.padEnd(12) + 'teaserLinks'.padEnd(14) + 'fullLen');
  for (const b of blocks) {
    const fl = String(b.fullLinks ?? 0).padEnd(12);
    const tl = String(b.teaserLinks ?? 0).padEnd(14);
    const warn = (!b.fullLinks || b.fullLinks === 0) ? ' ⚠' : '';
    console.log(`${(b._type || '').padEnd(22)}${(b.blockId || 'UNKNOWN').padEnd(42)}${fl}${tl}${b.fullLen ?? 0}${warn}`);
  }

  // 2. Guide pages
  const pages = await client.fetch(`
    *[_type == 'guidePage'] | order(slug.current) {
      "slug": slug.current,
      "editLinks": count(extendedEditorial[].markDefs[_type == 'link']),
      "editLen": length(pt::text(extendedEditorial)),
      "blockCount": count(contentBlocks),
      "faqCount": count(faqBlocks),
      "entityCount": count(featuredEntities)
    }
  `);
  console.log('\n=== GUIDE PAGES (extendedEditorial) ===');
  console.log('slug'.padEnd(42) + 'editLinks'.padEnd(12) + 'editLen'.padEnd(10) + 'blocks'.padEnd(8) + 'faqs'.padEnd(6) + 'entities');
  for (const p of pages) {
    const warn = (!p.editLinks || p.editLinks === 0) ? ' ⚠' : '';
    console.log(`${(p.slug || '').padEnd(42)}${String(p.editLinks ?? 0).padEnd(12)}${String(p.editLen ?? 0).padEnd(10)}${String(p.blockCount ?? 0).padEnd(8)}${String(p.faqCount ?? 0).padEnd(6)}${p.entityCount ?? 0}${warn}`);
  }

  // 3. Entities — website + map coverage
  const entities = await client.fetch(`
    *[_type == 'siteEntity'] | order(category, entityId.current) {
      "entityId": entityId.current,
      name,
      category,
      "hasWebsite": defined(contact.website) && contact.website != '',
      "hasMapUrl": defined(location.googleMapsUrl) && location.googleMapsUrl != '',
      "hasCoords": defined(location.coordinates),
      "hasPostcode": defined(location.postcode) && location.postcode != ''
    }
  `);
  console.log('\n=== ENTITIES — contact/map coverage ===');
  console.log('category'.padEnd(18) + 'entityId'.padEnd(40) + 'website'.padEnd(10) + 'mapUrl'.padEnd(10) + 'coords'.padEnd(10) + 'postcode');
  let stats = { total: 0, noWeb: 0, noMap: 0, noCoords: 0 };
  for (const e of entities) {
    stats.total++;
    const w = e.hasWebsite ? '✅' : '❌';
    const m = e.hasMapUrl ? '✅' : '❌';
    const c = e.hasCoords ? '✅' : '❌';
    const p = e.hasPostcode ? '✅' : '❌';
    if (!e.hasWebsite) stats.noWeb++;
    if (!e.hasMapUrl) stats.noMap++;
    if (!e.hasCoords) stats.noCoords++;
    console.log(`${(e.category || '').padEnd(18)}${(e.entityId || '').padEnd(40)}${w.padEnd(10)}${m.padEnd(10)}${c.padEnd(10)}${p}`);
  }
  console.log(`\nEntities: ${stats.total}  no-website: ${stats.noWeb}  no-mapUrl: ${stats.noMap}  no-coords: ${stats.noCoords}`);

  // 4. Properties
  const props = await client.fetch(`
    *[_type == 'property'] {
      "slug": slug.current,
      name,
      "descLinks": count(description[].markDefs[_type == 'link']),
      "locLinks": count(locationIntro[].markDefs[_type == 'link']),
      "descLen": length(pt::text(description)),
      "locLen": length(pt::text(locationIntro))
    }
  `);
  console.log('\n=== PROPERTY PAGES ===');
  for (const p of props) {
    const warn = ((!p.descLinks || p.descLinks === 0) && (!p.locLinks || p.locLinks === 0)) ? ' ⚠' : '';
    console.log(`${(p.slug || '').padEnd(32)} descLinks:${String(p.descLinks ?? 0).padStart(3)}  locLinks:${String(p.locLinks ?? 0).padStart(3)}  descLen:${p.descLen ?? 0}  locLen:${p.locLen ?? 0}${warn}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
