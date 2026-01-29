import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function updatePageBlockRefs() {
  console.log('🔧 Updating page block references to use correctly-named blocks...\n');

  const pages = await client.fetch(`
    *[_type in ["gettingHerePage", "exploreIslayPage"]] {
      _id,
      _type,
      pageSections
    }
  `);

  let totalUpdated = 0;

  for (const page of pages) {
    console.log(`📄 Processing ${page._type}...`);
    let pageUpdated = 0;

    if (!page.pageSections) {
      console.log('   No pageSections found\n');
      continue;
    }

    const updatedSections = page.pageSections.map((section: any) => {
      if (!section.contentBlocks) return section;

      const updatedBlocks = section.contentBlocks.map((cb: any) => {
        const refId = cb.block?._ref;
        if (!refId) return cb;

        // If the ref doesn't already have "content-" in it, add it
        if (!refId.includes('-content-')) {
          const newRef = refId.replace('canonical-block-', 'canonical-block-content-');
          console.log(`   ✏️  Updating: ${refId} → ${newRef}`);
          pageUpdated++;
          totalUpdated++;

          return {
            ...cb,
            block: {
              _type: 'reference',
              _ref: newRef,
            },
          };
        }

        return cb;
      });

      return {
        ...section,
        contentBlocks: updatedBlocks,
      };
    });

    if (pageUpdated > 0) {
      try {
        await client
          .patch(page._id)
          .set({ pageSections: updatedSections })
          .commit();

        console.log(`   ✅ Updated ${pageUpdated} reference(s) in ${page._type}\n`);
      } catch (error: any) {
        console.log(`   ❌ Error updating ${page._type}:`, error.message);
      }
    } else {
      console.log('   ✓ No updates needed\n');
    }
  }

  console.log('='.repeat(60));
  console.log(`✅ Total references updated: ${totalUpdated}`);
  console.log('='.repeat(60));
}

updatePageBlockRefs().catch(console.error);
