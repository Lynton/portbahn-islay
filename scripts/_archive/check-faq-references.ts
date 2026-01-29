import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
});

async function checkFaqReferences() {
  console.log('Checking FAQ references and their resolution...\n');

  // Get the page with FAQ references
  const page = await client.fetch(`
    *[_type == "gettingHerePage"][0]{
      _id,
      title,
      pageSections[]{
        _key,
        sectionTitle,
        faqBlocks[]{
          _key,
          "faqBlockRef": faqBlock._ref,
          faqBlock->{
            _id,
            question
          }
        }
      }
    }
  `);

  if (!page) {
    console.log('Page not found');
    return;
  }

  console.log(`Page: ${page.title}\n`);

  // Check each section
  for (const section of page.pageSections || []) {
    if (!section.faqBlocks || section.faqBlocks.length === 0) continue;

    console.log(`\nSection: "${section.sectionTitle}"`);
    console.log(`  Has ${section.faqBlocks.length} FAQ block(s)\n`);

    for (const fb of section.faqBlocks) {
      console.log(`  FAQ Block (_key: ${fb._key}):`);
      console.log(`    Reference ID: ${fb.faqBlockRef}`);
      
      // Check if the referenced document exists
      const refExists = await client.fetch(`*[_id == $id][0]{_id, question}`, {
        id: fb.faqBlockRef,
      });
      
      // Also check draft version
      const draftExists = await client.fetch(`*[_id == $id][0]{_id, question}`, {
        id: `drafts.${fb.faqBlockRef}`,
      });

      console.log(`    Published version exists: ${refExists ? '✓' : '✗'}`);
      if (refExists) {
        console.log(`      Question: ${refExists.question}`);
      }
      
      console.log(`    Draft version exists: ${draftExists ? '✓' : '✗'}`);
      if (draftExists) {
        console.log(`      Question: ${draftExists.question}`);
      }

      console.log(`    Resolved in query: ${fb.faqBlock ? '✓' : '✗'}`);
      if (fb.faqBlock) {
        console.log(`      Resolved question: ${fb.faqBlock.question}`);
      } else {
        console.log(`      ⚠️  Reference not resolving!`);
      }
      console.log('');
    }
  }

  // Summary
  const allFaqs = page.pageSections?.flatMap((s: any) => s.faqBlocks || []) || [];
  const resolved = allFaqs.filter((fb: any) => fb.faqBlock).length;
  const unresolved = allFaqs.filter((fb: any) => !fb.faqBlock).length;

  console.log('\n📊 Summary:');
  console.log(`  Total FAQ blocks: ${allFaqs.length}`);
  console.log(`  Resolved: ${resolved}`);
  console.log(`  Unresolved: ${unresolved}`);

  if (unresolved > 0) {
    console.log('\n⚠️  Some references are not resolving. This could mean:');
    console.log('  1. The referenced documents are drafts (not published)');
    console.log('  2. The document IDs have changed');
    console.log('  3. There\'s a query issue');
  }
}

checkFaqReferences().catch(console.error);
