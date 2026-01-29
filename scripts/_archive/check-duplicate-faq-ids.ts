import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-19',
  useCdn: false,
});

async function checkDuplicateFaqIds() {
  console.log('Checking for duplicate FAQ IDs and mismatched references...\n');

  // Get all FAQ documents (both published and drafts)
  const publishedFaqs = await client.fetch(`
    *[_type == "faqCanonicalBlock" && !(_id in path("drafts.**"))]{
      _id,
      question,
      category
    }
  `);

  const draftFaqs = await client.fetch(`
    *[_type == "faqCanonicalBlock" && _id in path("drafts.**")]{
      _id,
      question,
      category
    }
  `);

  const allFaqs = [...publishedFaqs, ...draftFaqs];

  console.log(`Total FAQ documents: ${allFaqs.length}`);
  console.log(`  Published: ${publishedFaqs.length}`);
  console.log(`  Drafts: ${draftFaqs.length}\n`);

  // Group by base ID (without faq- prefix)
  const idGroups = new Map<string, Array<{ _id: string; question: string }>>();

  for (const faq of allFaqs) {
    // Extract the base ID (remove "faqCanonicalBlock." prefix and optional "faq-" prefix)
    const baseId = faq._id
      .replace(/^faqCanonicalBlock\./, '')
      .replace(/^faq-/, '');
    
    if (!idGroups.has(baseId)) {
      idGroups.set(baseId, []);
    }
    idGroups.get(baseId)!.push({ _id: faq._id, question: faq.question });
  }

  // Find duplicates (same base ID but different full IDs)
  const duplicates: Array<{
    baseId: string;
    variants: Array<{ _id: string; question: string }>;
  }> = [];

  for (const [baseId, variants] of idGroups.entries()) {
    if (variants.length > 1) {
      duplicates.push({ baseId, variants });
    }
  }

  if (duplicates.length > 0) {
    console.log(`⚠️  Found ${duplicates.length} duplicate FAQ ID group(s):\n`);
    duplicates.forEach((dup, idx) => {
      console.log(`${idx + 1}. Base ID: ${dup.baseId}`);
      dup.variants.forEach((v) => {
        console.log(`   - ${v._id}: ${v.question}`);
      });
      console.log('');
    });
  } else {
    console.log('✓ No duplicate IDs found\n');
  }

  // Now check what the page is referencing
  console.log('Checking page references...\n');
  const page = await client.fetch(`
    *[_type == "gettingHerePage"][0]{
      pageSections[]{
        sectionTitle,
        faqBlocks[]{
          "refId": faqBlock._ref
        }
      }
    }
  `);

  if (page) {
    const referencedIds = new Set<string>();
    page.pageSections?.forEach((section: any) => {
      section.faqBlocks?.forEach((fb: any) => {
        if (fb.refId) {
          referencedIds.add(fb.refId);
        }
      });
    });

    console.log(`Page references ${referencedIds.size} FAQ document(s):\n`);

    const missing: string[] = [];
    const found: string[] = [];

    for (const refId of referencedIds) {
      const exists = allFaqs.some((f) => f._id === refId);
      if (exists) {
        found.push(refId);
        console.log(`✓ ${refId}`);
      } else {
        missing.push(refId);
        console.log(`✗ ${refId} - NOT FOUND`);

        // Try to find similar IDs
        const baseId = refId.replace(/^faqCanonicalBlock\./, '').replace(/^faq-/, '');
        const similar = allFaqs.filter((f) => {
          const fBaseId = f._id.replace(/^faqCanonicalBlock\./, '').replace(/^faq-/, '');
          return fBaseId === baseId;
        });

        if (similar.length > 0) {
          console.log(`  → Found similar ID(s):`);
          similar.forEach((s) => {
            console.log(`    - ${s._id}: ${s.question}`);
          });
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  Referenced: ${referencedIds.size}`);
    console.log(`  Found: ${found.length}`);
    console.log(`  Missing: ${missing.length}`);

    if (missing.length > 0 && duplicates.length > 0) {
      console.log(`\n⚠️  ISSUE DETECTED: Page references missing IDs, but duplicates exist!`);
      console.log(`  This suggests the page is referencing IDs with/without "faq-" prefix mismatch.`);
      console.log(`  Solution: Update page references to match the actual document IDs.`);
    }
  }
}

checkDuplicateFaqIds().catch(console.error);
