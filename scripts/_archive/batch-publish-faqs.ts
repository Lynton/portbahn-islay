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

async function batchPublishFaqs() {
  if (!client.config().token) {
    console.error('❌ Error: SANITY_API_TOKEN or SANITY_STUDIO_API_TOKEN not found in .env.local');
    console.log('\nTo get a token:');
    console.log('1. Go to https://www.sanity.io/manage');
    console.log('2. Select your project');
    console.log('3. Go to API > Tokens');
    console.log('4. Create a token with Editor permissions');
    console.log('5. Add it to .env.local as SANITY_API_TOKEN=your-token-here');
    process.exit(1);
  }

  console.log('Fetching draft FAQ documents...\n');

  // Get all draft FAQ documents
  const draftFaqs = await client.fetch(`
    *[_id match "drafts.faqCanonicalBlock.*"]{
      _id,
      _rev,
      question
    }
  `);

  // Process draft IDs to extract published IDs (remove "drafts." prefix)
  const processedFaqs = draftFaqs.map((faq: any) => ({
    ...faq,
    publishedId: faq._id.replace(/^drafts\./, ''), // Remove "drafts." prefix
  }));

  if (processedFaqs.length === 0) {
    console.log('✓ No draft FAQ documents found. All FAQs are already published.');
    return;
  }

  console.log(`Found ${processedFaqs.length} draft FAQ document(s):\n`);
  processedFaqs.forEach((faq: any, idx: number) => {
    console.log(`${idx + 1}. ${faq.question || 'Untitled'} (${faq._id} → ${faq.publishedId})`);
  });

  console.log(`\n⚠️  This will publish ${processedFaqs.length} FAQ document(s).`);
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

  // Wait 5 seconds for user to cancel
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log('Publishing FAQ documents...\n');

  const results = {
    success: 0,
    failed: 0,
    errors: [] as Array<{ id: string; error: string }>,
  };

  // Publish each draft using Sanity's transaction API
  for (const draft of processedFaqs) {
    try {
      // Fetch the full draft document
      const draftDoc = await client.fetch(`*[_id == $id][0]`, { id: draft._id });
      
      if (!draftDoc) {
        throw new Error('Draft document not found');
      }

      // Check if published version exists
      const published = await client.fetch(`*[_id == $id][0]`, {
        id: draft.publishedId,
      });

      // Prepare document data (remove _id, _rev, _type for update)
      const { _id, _rev, _type, ...docData } = draftDoc;

      if (published) {
        // Update existing published document
        await client
          .patch(draft.publishedId)
          .set(docData)
          .commit();
      } else {
        // Create new published document
        await client.create({
          ...docData,
          _id: draft.publishedId,
          _type: 'faqCanonicalBlock',
        });
      }

      // Delete the draft after successful publish
      await client.delete(draft._id);

      console.log(`✓ Published: ${draft.question || draft._id}`);
      results.success++;
    } catch (error: any) {
      console.error(`✗ Failed to publish ${draft.question || draft._id}:`, error.message);
      results.failed++;
      results.errors.push({
        id: draft._id,
        error: error.message,
      });
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`  ✓ Successfully published: ${results.success}`);
  console.log(`  ✗ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach((err) => {
      console.log(`  - ${err.id}: ${err.error}`);
    });
  }

  if (results.success > 0) {
    console.log('\n✓ FAQ documents published! Refresh your front-end page to see them.');
  }
}

batchPublishFaqs().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
