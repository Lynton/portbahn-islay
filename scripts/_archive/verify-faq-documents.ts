import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
});

async function verifyFaqDocuments() {
  console.log('Verifying FAQ documents exist...\n');

  // Get the referenced IDs from the page
  const page = await client.fetch(`
    *[_type == "gettingHerePage" && !(_id in path("drafts.**"))][0]{
      pageSections[]{
        sectionTitle,
        faqBlocks[]{
          "refId": faqBlock._ref
        }
      }
    }
  `);

  if (!page) {
    console.log('Page not found');
    return;
  }

  // Collect all unique reference IDs
  const refIds = new Set<string>();
  page.pageSections?.forEach((section: any) => {
    section.faqBlocks?.forEach((fb: any) => {
      if (fb.refId) {
        refIds.add(fb.refId);
      }
    });
  });

  console.log(`Found ${refIds.size} unique FAQ reference(s) to check:\n`);

  const results: Array<{
    refId: string;
    publishedExists: boolean;
    draftExists: boolean;
    publishedId?: string;
    draftId?: string;
  }> = [];

  // Check each reference
  for (const refId of refIds) {
    // Check published version
    const published = await client.fetch(`*[_id == $id][0]{_id, question}`, { id: refId });
    
    // Check draft version
    const draft = await client.fetch(`*[_id == $id][0]{_id, question}`, { id: `drafts.${refId}` });

    // Also try searching by the slug part of the ID
    const slugMatch = refId.match(/faqCanonicalBlock\.(.+)$/);
    let foundBySlug: any = null;
    if (slugMatch) {
      const slug = slugMatch[1];
      // Search for any FAQ with this slug
      foundBySlug = await client.fetch(
        `*[_type == "faqCanonicalBlock" && (_id == $id1 || _id == $id2 || _id match $pattern)][0]{_id, question}`,
        {
          id1: `faqCanonicalBlock.${slug}`,
          id2: `drafts.faqCanonicalBlock.${slug}`,
          pattern: `*${slug}*`,
        }
      );
    }

    const result = {
      refId,
      publishedExists: !!published,
      draftExists: !!draft,
      publishedId: published?._id,
      draftId: draft?._id,
      foundBySlug: foundBySlug?._id,
    };

    results.push(result);

    console.log(`Reference: ${refId}`);
    console.log(`  Published exists: ${result.publishedExists ? '✓' : '✗'}`);
    if (result.publishedExists) {
      console.log(`    ID: ${result.publishedId}`);
      console.log(`    Question: ${published?.question}`);
    }
    console.log(`  Draft exists: ${result.draftExists ? '✓' : '✗'}`);
    if (result.draftExists) {
      console.log(`    ID: ${result.draftId}`);
      console.log(`    Question: ${draft?.question}`);
    }
    if (foundBySlug && foundBySlug._id !== refId && foundBySlug._id !== `drafts.${refId}`) {
      console.log(`  ⚠️  Found similar document: ${foundBySlug._id}`);
      console.log(`    Question: ${foundBySlug.question}`);
    }
    console.log('');
  }

  // Summary
  const missing = results.filter((r) => !r.publishedExists && !r.draftExists);
  const onlyDraft = results.filter((r) => !r.publishedExists && r.draftExists);
  const published = results.filter((r) => r.publishedExists);

  console.log('\n📊 Summary:');
  console.log(`  Total references: ${results.length}`);
  console.log(`  Published: ${published.length}`);
  console.log(`  Only drafts: ${onlyDraft.length}`);
  console.log(`  Missing: ${missing.length}`);

  if (onlyDraft.length > 0) {
    console.log('\n⚠️  Some FAQs are still drafts and need publishing:');
    onlyDraft.forEach((r) => console.log(`  - ${r.refId}`));
  }

  if (missing.length > 0) {
    console.log('\n❌ Some referenced FAQs don\'t exist:');
    missing.forEach((r) => console.log(`  - ${r.refId}`));
    console.log('\nThese references need to be fixed in Sanity Studio.');
  }

  if (published.length === results.length) {
    console.log('\n✓ All referenced FAQs exist and are published!');
    console.log('If they\'re still not resolving, try:');
    console.log('  1. Hard refresh the browser (Cmd+Shift+R / Ctrl+Shift+R)');
    console.log('  2. Clear Next.js cache and restart dev server');
    console.log('  3. Check browser console for other errors');
  }
}

verifyFaqDocuments().catch(console.error);
