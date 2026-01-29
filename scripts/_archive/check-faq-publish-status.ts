import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
});

async function checkFaqStatus() {
  console.log('Checking FAQ publish status...\n');

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

  // Collect all FAQ reference IDs
  const faqRefs: string[] = [];
  page.pageSections?.forEach((section: any) => {
    section.faqBlocks?.forEach((fb: any) => {
      if (fb.faqBlock?._ref) {
        faqRefs.push(fb.faqBlock._ref);
      }
    });
  });

  console.log(`Found ${faqRefs.length} FAQ references\n`);

  // Check each FAQ document
  const faqStatus = await Promise.all(
    faqRefs.map(async (refId) => {
      // Check both draft and published versions
      const [draft, published] = await Promise.all([
        client.fetch(`*[_id == $id][0]{_id, question, _rev}`, { id: `drafts.${refId}` }),
        client.fetch(`*[_id == $id][0]{_id, question, _rev}`, { id: refId }),
      ]);

      return {
        refId,
        hasDraft: !!draft,
        hasPublished: !!published,
        draftQuestion: draft?.question,
        publishedQuestion: published?.question,
      };
    })
  );

  console.log('FAQ Status Report:\n');
  faqStatus.forEach((status, idx) => {
    console.log(`FAQ ${idx + 1} (${status.refId}):`);
    console.log(`  Draft: ${status.hasDraft ? '✓' : '✗'} ${status.draftQuestion || ''}`);
    console.log(`  Published: ${status.hasPublished ? '✓' : '✗'} ${status.publishedQuestion || ''}`);
    if (!status.hasPublished) {
      console.log(`  ⚠️  NEEDS PUBLISHING`);
    }
    console.log('');
  });

  const needsPublishing = faqStatus.filter((s) => !s.hasPublished).length;
  if (needsPublishing > 0) {
    console.log(`\n⚠️  ${needsPublishing} FAQ document(s) need to be published in Sanity Studio`);
  } else {
    console.log('\n✓ All FAQ documents are published');
  }
}

checkFaqStatus().catch(console.error);
