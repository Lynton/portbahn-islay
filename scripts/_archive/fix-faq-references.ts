import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_STUDIO_API_TOKEN || '',
});

async function fixFaqReferences() {
  if (!client.config().token) {
    console.error('❌ Error: SANITY_API_TOKEN not found in .env.local');
    process.exit(1);
  }

  console.log('Fetching page with FAQ references...\n');

  // Get the page
  const page = await client.fetch(`
    *[_type == "gettingHerePage"][0]{
      _id,
      title,
      pageSections[]{
        _key,
        sectionTitle,
        faqBlocks[]{
          _key,
          faqBlock
        }
      }
    }
  `);

  if (!page) {
    console.log('Page not found');
    return;
  }

  console.log(`Page: ${page.title}\n`);

  let needsUpdate = false;
  const updates: any[] = [];

  // Check each section
  for (const section of page.pageSections || []) {
    if (!section.faqBlocks || section.faqBlocks.length === 0) continue;

    for (const fb of section.faqBlocks) {
      const refId = fb.faqBlock?._ref;
      if (!refId) {
        console.log(`⚠️  Section "${section.sectionTitle}" has FAQ block ${fb._key} with no reference`);
        continue;
      }

      // Check if the referenced document exists
      const refExists = await client.fetch(`*[_id == $id][0]{_id}`, { id: refId });
      const draftExists = await client.fetch(`*[_id == $id][0]{_id}`, { id: `drafts.${refId}` });

      if (!refExists && !draftExists) {
        console.log(`✗ Reference ${refId} does not exist (needs fixing)`);
        
        // Try to find the document by searching for FAQs with similar IDs
        // Extract the slug part from the ID (e.g., "faq-trvl-ferries-how-long-is-the-ferry-to-islay")
        const slugMatch = refId.match(/faqCanonicalBlock\.(.+)$/);
        if (slugMatch) {
          const slug = slugMatch[1];
          // Search for any FAQ with this slug pattern
          const found = await client.fetch(
            `*[_type == "faqCanonicalBlock" && (_id == $slug || _id == $draftSlug || _id match $pattern)][0]{_id}`,
            {
              slug: `faqCanonicalBlock.${slug}`,
              draftSlug: `drafts.faqCanonicalBlock.${slug}`,
              pattern: `*${slug}*`,
            }
          );

          if (found) {
            console.log(`  → Found alternative ID: ${found._id}`);
            // We'd need to update the reference, but that requires patching the page
            updates.push({
              sectionKey: section._key,
              faqBlockKey: fb._key,
              oldRef: refId,
              newRef: found._id,
            });
            needsUpdate = true;
          } else {
            console.log(`  → No alternative found for ${refId}`);
          }
        }
      } else if (draftExists && !refExists) {
        console.log(`⚠️  Reference ${refId} exists only as draft - needs publishing`);
      } else if (refExists) {
        console.log(`✓ Reference ${refId} exists and is published`);
      }
    }
  }

  if (needsUpdate && updates.length > 0) {
    console.log(`\n⚠️  Found ${updates.length} reference(s) that need fixing.`);
    console.log('To fix these, you would need to update the references in Sanity Studio manually,');
    console.log('or we can create a script to patch them. The broken references are:');
    updates.forEach((u) => {
      console.log(`  - Section ${u.sectionKey}, FAQ ${u.faqBlockKey}: ${u.oldRef} → ${u.newRef}`);
    });
  } else {
    console.log('\n✓ All references point to existing documents');
    console.log('\nIf references still aren\'t resolving, the issue might be:');
    console.log('  1. The documents are drafts (need publishing)');
    console.log('  2. There\'s a query/caching issue');
    console.log('  3. The page itself needs to be republished');
  }

  // Check if page is published
  const pagePublished = await client.fetch(`*[_id == $id && !(_id in path("drafts.**"))][0]{_id}`, {
    id: page._id.replace(/^drafts\./, ''),
  });
  
  if (!pagePublished) {
    console.log('\n⚠️  The page itself might be a draft. Make sure "Getting Here" page is published in Sanity Studio.');
  }
}

fixFaqReferences().catch(console.error);
