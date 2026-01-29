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

// Map from wrong IDs to correct IDs
const REFERENCE_FIXES: { [key: string]: string } = {
  'canonical-block-content-about-us': 'canonical-block-about-us',
  'canonical-block-content-beaches-overview': 'canonical-block-beaches-overview',
  'canonical-block-content-bruichladdich-proximity': 'canonical-block-bruichladdich-proximity',
  'canonical-block-content-distilleries-overview': 'canonical-block-distilleries-overview',
  'canonical-block-content-families-children': 'canonical-block-families-children',
  'canonical-block-content-ferry-support': 'canonical-block-ferry-support',
  'canonical-block-content-food-drink-islay': 'canonical-block-food-drink-islay',
  'canonical-block-content-jura-day-trip': 'canonical-block-jura-day-trip',
  'canonical-block-content-portbahn-beach': 'canonical-block-portbahn-beach',
  'canonical-block-content-travel-to-islay': 'canonical-block-travel-to-islay',
  'canonical-block-content-trust-signals': 'canonical-block-trust-signals',
  'canonical-block-content-wildlife-geese': 'canonical-block-wildlife-geese',
};

async function fixReferences() {
  console.log('🔧 Fixing block references in pages...\n');

  const pages = await client.fetch(`
    *[_type in ["gettingHerePage", "exploreIslayPage"]] {
      _id,
      _type,
      pageSections
    }
  `);

  let totalFixed = 0;

  for (const page of pages) {
    console.log(`📄 Processing ${page._type}...`);
    let pageFixed = 0;

    if (!page.pageSections) {
      console.log('   No pageSections found\n');
      continue;
    }

    const updatedSections = page.pageSections.map((section: any) => {
      if (!section.contentBlocks) return section;

      const updatedBlocks = section.contentBlocks.map((cb: any) => {
        const refId = cb.block?._ref;
        if (!refId) return cb;

        if (REFERENCE_FIXES[refId]) {
          const newRef = REFERENCE_FIXES[refId];
          console.log(`   ✏️  Fixing: ${refId} → ${newRef}`);
          pageFixed++;
          totalFixed++;

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

    if (pageFixed > 0) {
      try {
        await client
          .patch(page._id)
          .set({ pageSections: updatedSections })
          .commit();

        console.log(`   ✅ Fixed ${pageFixed} reference(s) in ${page._type}\n`);
      } catch (error) {
        console.log(`   ❌ Error updating ${page._type}:`, error);
      }
    } else {
      console.log('   ✓ No fixes needed\n');
    }
  }

  console.log('='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Total references fixed: ${totalFixed}`);
  console.log('='.repeat(60));

  // Now delete the empty duplicate blocks
  console.log('\n🗑️  Deleting empty duplicate blocks...\n');

  const emptyBlockIds = Object.keys(REFERENCE_FIXES);
  let deletedCount = 0;

  for (const blockId of emptyBlockIds) {
    try {
      await client.delete(blockId);
      console.log(`   ✅ Deleted: ${blockId}`);
      deletedCount++;
    } catch (error) {
      console.log(`   ❌ Error deleting ${blockId}:`, error);
    }
  }

  console.log(`\n✨ Deleted ${deletedCount} empty duplicate blocks\n`);
}

fixReferences().catch(console.error);
