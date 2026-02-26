/**
 * fix-lochindaal.ts
 *
 * Two operations:
 * 1. Fix lochindaal-seafood-kitchen — remove wrong Jack/Iain attribution
 * 2. Create lochindaal-hotel-port-charlotte — the correct entity for the
 *    Lochindaal Hotel run by Jack and Iain: highly-rated food, great
 *    atmosphere, best seafood platter on the island.
 */

import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function run() {
  console.log('=== fix-lochindaal.ts ===\n');

  // 1. Fix Lochindaal Seafood Kitchen — remove Jack/Iain attribution
  console.log('1. Fixing Lochindaal Seafood Kitchen description...');
  const sfk = await client.fetch(
    `*[_type=="siteEntity" && entityId.current=="lochindaal-seafood-kitchen"][0]{_id}`
  );
  if (sfk?._id) {
    await client.patch(sfk._id).set({
      shortDescription:
        'Lochindaal Seafood Kitchen is a small seafood restaurant in Port Charlotte, Islay, serving local shellfish including langoustines, crab, oysters, and mussels. Booking recommended.',
      editorialNote: null,
    }).commit();
    console.log('  ✓ shortDescription corrected (Jack/Iain attribution removed)');
  } else {
    console.log('  ⚠ lochindaal-seafood-kitchen not found');
  }

  // 2. Create Lochindaal Hotel entity
  console.log('\n2. Creating Lochindaal Hotel entity...');
  const existing = await client.fetch(
    `*[_type=="siteEntity" && entityId.current=="lochindaal-hotel-port-charlotte"][0]{_id}`
  );
  if (existing?._id) {
    console.log('  Entity already exists — patching instead');
    await client.patch(existing._id).set({
      name: 'Lochindaal Hotel',
      category: 'restaurant',
      schemaOrgType: 'BarOrPub',
      island: 'islay',
      status: 'active',
      shortDescription:
        'The Lochindaal Hotel is a pub and restaurant on the harbourfront in Port Charlotte, Isle of Islay, run by Jack and his father Iain. Known for exceptional fresh seafood — langoustines, crab, oysters, mussels from the local catch — an extensive whisky selection, and a genuinely warm welcome. The seafood platter is the best on the island. Family-friendly.',
      editorialNote:
        "Our top recommendation in Port Charlotte. Jack and Iain's passion for what they do comes through in every plate. The full seafood platter needs 24 hours' notice — worth every bit of the planning.",
      contact: {
        website: 'https://www.lochindaalhotel.co.uk/restaurant.html',
        phone: '01496 850202',
      },
      location: {
        address: 'Main St, Port Charlotte, Isle of Islay PA48 7TX',
        village: 'Port Charlotte',
        googleMapsUrl: 'https://maps.app.goo.gl/ZdBrUqtwVZNpQSbt5',
        distanceFromBruichladdich: '5-minute drive',
      },
      attributes: {
        requiresBooking: true,
        bookingAdvice: "Book ahead, especially for the seafood platter which requires 24 hours' notice.",
      },
    }).commit();
    console.log('  ✓ patched existing document');
  } else {
    await client.create({
      _type: 'siteEntity',
      _id: 'siteEntity.lochindaal-hotel-port-charlotte',
      entityId: { _type: 'slug', current: 'lochindaal-hotel-port-charlotte' },
      name: 'Lochindaal Hotel',
      category: 'restaurant',
      schemaOrgType: 'BarOrPub',
      island: 'islay',
      status: 'active',
      shortDescription:
        'The Lochindaal Hotel is a pub and restaurant on the harbourfront in Port Charlotte, Isle of Islay, run by Jack and his father Iain. Known for exceptional fresh seafood — langoustines, crab, oysters, mussels from the local catch — an extensive whisky selection, and a genuinely warm welcome. The seafood platter is the best on the island. Family-friendly.',
      editorialNote:
        "Our top recommendation in Port Charlotte. Jack and Iain's passion for what they do comes through in every plate. The full seafood platter needs 24 hours' notice — worth every bit of the planning.",
      contact: {
        website: 'https://www.lochindaalhotel.co.uk/restaurant.html',
        phone: '01496 850202',
      },
      location: {
        address: 'Main St, Port Charlotte, Isle of Islay PA48 7TX',
        village: 'Port Charlotte',
        googleMapsUrl: 'https://maps.app.goo.gl/ZdBrUqtwVZNpQSbt5',
        distanceFromBruichladdich: '5-minute drive',
      },
      attributes: {
        requiresBooking: true,
        bookingAdvice: "Book ahead, especially for the seafood platter which requires 24 hours' notice.",
      },
    });
    console.log('  ✓ created siteEntity.lochindaal-hotel-port-charlotte');
  }

  // Verify
  console.log('\n=== Verification ===');
  const results = await client.fetch(
    `*[_type=="siteEntity" && entityId.current in ["lochindaal-seafood-kitchen","lochindaal-hotel-port-charlotte"]]{name, 'eid': entityId.current, 'website': contact.website, 'phone': contact.phone, shortDescription}`
  );
  for (const r of results) {
    console.log(`\n  ${r.name} (${r.eid})`);
    console.log(`    website: ${r.website || 'null'}`);
    console.log(`    phone:   ${r.phone || 'null'}`);
    console.log(`    desc:    ${r.shortDescription?.substring(0, 80)}...`);
  }

  console.log('\n=== Done ===');
  console.log('\nNext: add lochindaal-hotel-port-charlotte to the food-and-drink guide');
  console.log('page featuredEntities[] in Studio, positioned before Lochindaal Seafood Kitchen.');
}

run().catch(console.error);
