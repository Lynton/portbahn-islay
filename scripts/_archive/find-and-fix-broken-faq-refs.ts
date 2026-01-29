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

async function findAndFixBrokenRefs() {
  if (!client.config().token) {
    console.error('❌ Error: SANITY_API_TOKEN not found in .env.local');
    process.exit(1);
  }

  console.log('Finding broken FAQ references...\n');

  // Get the page with all FAQ references
  const page = await client.fetch(`
    *[_type == "gettingHerePage"][0]{
      _id,
      title,
      pageSections[]{
        _key,
        sectionTitle,
        faqBlocks[]{
          _key,
          "refId": faqBlock._ref
        }
      }
    }
  `);

  if (!page) {
    console.log('Page not found');
    return;
  }

  console.log(`Checking page: ${page.title}\n`);

  const brokenRefs: Array<{
    sectionKey: string;
    sectionTitle: string;
    faqBlockKey: string;
    refId: string;
    suggestions: string[];
  }> = [];

  // Check each reference
  for (const section of page.pageSections || []) {
    if (!section.faqBlocks) continue;

    for (const fb of section.faqBlocks) {
      if (!fb.refId) continue;

      // Check if document exists
      const exists = await client.fetch(`*[_id == $id][0]{_id}`, { id: fb.refId });
      
      if (!exists) {
        console.log(`✗ Broken reference: ${fb.refId}`);
        console.log(`  Section: ${section.sectionTitle}`);
        console.log(`  FAQ Block Key: ${fb._key}`);

        // Try to find similar FAQs
        const slugMatch = fb.refId.match(/faqCanonicalBlock\.(.+)$/);
        const suggestions: string[] = [];

        if (slugMatch) {
          const slug = slugMatch[1];
          
          // Search for FAQs with similar slugs or keywords
          const keywords = slug.split('-').filter((w: string) => w.length > 3);
          
          // Try exact slug match first
          const exactMatch = await client.fetch(
            `*[_type == "faqCanonicalBlock" && (_id == $id1 || _id == $id2)][0]{_id, question}`,
            {
              id1: `faqCanonicalBlock.${slug}`,
              id2: `drafts.faqCanonicalBlock.${slug}`,
            }
          );

          if (exactMatch) {
            suggestions.push(exactMatch._id);
            console.log(`  → Found exact match: ${exactMatch._id}`);
            console.log(`    Question: ${exactMatch.question}`);
          } else {
            // Search by keywords in question
            if (keywords.length > 0) {
              const keywordSearch = await client.fetch(
                `*[_type == "faqCanonicalBlock" && (question match $pattern1 || question match $pattern2)][0..5]{_id, question}`,
                {
                  pattern1: `*${keywords[0]}*`,
                  pattern2: keywords.length > 1 ? `*${keywords[1]}*` : `*${keywords[0]}*`,
                }
              );

              if (keywordSearch && keywordSearch.length > 0) {
                console.log(`  → Found ${keywordSearch.length} similar FAQ(s):`);
                keywordSearch.forEach((faq: any) => {
                  suggestions.push(faq._id);
                  console.log(`    - ${faq._id}: ${faq.question}`);
                });
              }
            }
          }

          // Also search all FAQs in the same category
          const categoryMatch = slug.match(/^faq-(.+?)-/);
          if (categoryMatch) {
            const category = categoryMatch[1];
            const categoryFaqs = await client.fetch(
              `*[_type == "faqCanonicalBlock" && category == $cat][0..10]{_id, question, category}`,
              { cat: category }
            );
            
            if (categoryFaqs && categoryFaqs.length > 0) {
              console.log(`  → Found ${categoryFaqs.length} FAQ(s) in category "${category}":`);
              categoryFaqs.slice(0, 3).forEach((faq: any) => {
                if (!suggestions.includes(faq._id)) {
                  suggestions.push(faq._id);
                  console.log(`    - ${faq._id}: ${faq.question}`);
                }
              });
            }
          }
        }

        brokenRefs.push({
          sectionKey: section._key,
          sectionTitle: section.sectionTitle,
          faqBlockKey: fb._key,
          refId: fb.refId,
          suggestions,
        });

        console.log('');
      } else {
        console.log(`✓ Reference OK: ${fb.refId}`);
      }
    }
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log(`  Total FAQ blocks checked: ${page.pageSections?.flatMap((s: any) => s.faqBlocks || []).length || 0}`);
  console.log(`  Broken references: ${brokenRefs.length}`);

  if (brokenRefs.length > 0) {
    console.log('\n❌ Broken References Found:');
    brokenRefs.forEach((br, idx) => {
      console.log(`\n${idx + 1}. Section: "${br.sectionTitle}"`);
      console.log(`   Broken Reference: ${br.refId}`);
      if (br.suggestions.length > 0) {
        console.log(`   Suggested replacements:`);
        br.suggestions.forEach((sug) => console.log(`     - ${sug}`));
      } else {
        console.log(`   ⚠️  No suggestions found. You may need to:`);
        console.log(`      - Create a new FAQ document with this ID`);
        console.log(`      - Or remove this reference from the page`);
      }
    });

    console.log('\n📝 To fix these references:');
    console.log('1. Open Sanity Studio');
    console.log('2. Go to Pages → Getting Here');
    console.log('3. For each broken reference:');
    console.log('   - Remove the broken FAQ reference');
    console.log('   - Add the correct FAQ reference (use suggestions above if available)');
    console.log('4. Publish the page');
  } else {
    console.log('\n✓ All references are valid!');
  }
}

findAndFixBrokenRefs().catch(console.error);
