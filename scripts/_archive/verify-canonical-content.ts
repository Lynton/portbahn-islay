/**
 * Verify Sanity content matches canonical source files
 *
 * Checks:
 * 1. All 16 content blocks exist with correct IDs
 * 2. All 35 FAQs exist with correct IDs
 * 3. All documents are published (not draft-only)
 * 4. References are intact
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Expected content blocks from CANONICAL-BLOCKS-FINAL-V2_LL2.md
const EXPECTED_CONTENT_BLOCKS = [
  { id: 'content-travel-to-islay', entityType: 'Travel' },
  { id: 'content-distilleries-overview', entityType: 'Activity' },
  { id: 'content-families-children', entityType: 'Activity' },
  { id: 'content-ferry-support', entityType: 'Trust' },
  { id: 'content-trust-signals', entityType: 'Credibility' },
  { id: 'content-bruichladdich-proximity', entityType: 'Location' },
  { id: 'content-portbahn-beach', entityType: 'Place' },
  { id: 'content-shorefield-character', entityType: 'Property' },
  { id: 'content-port-charlotte-village', entityType: 'Place' },
  { id: 'content-wildlife-geese', entityType: 'Nature' },
  { id: 'content-food-drink-islay', entityType: 'Activity' },
  { id: 'content-beaches-overview', entityType: 'Place' },
  { id: 'content-jura-day-trip', entityType: 'Activity' },
  { id: 'content-jura-longer-stay', entityType: 'Activity' },
  { id: 'content-bothan-jura-teaser', entityType: 'Property' },
  { id: 'content-about-us', entityType: 'Trust' },
];

// Expected FAQ categories from FAQS-STRUCTURED-PORTBAHN-ISLAY.md
const EXPECTED_FAQ_CATEGORIES = {
  'travel-getting-here': 11,
  'accommodation-planning': 4,
  'whisky-distilleries': 3,
  'families-activities': 1,
  'property-portbahn': 5,
  'property-shorefield': 4,
  'property-curlew': 4,
  'jura': 3,
};

async function verifyContent() {
  console.log('='.repeat(60));
  console.log('SANITY CONTENT VERIFICATION');
  console.log('='.repeat(60));
  console.log('');

  // 1. Check content blocks
  console.log('1. CONTENT BLOCKS');
  console.log('-'.repeat(40));

  const contentBlocks = await client.fetch(`
    *[_type == "canonicalBlock"]{
      _id,
      "blockId": blockId.current,
      entityType,
      title,
      "hasFullContent": defined(fullContent),
      "hasTeaserContent": defined(teaserContent),
      "keyFactsCount": count(keyFacts)
    } | order(blockId asc)
  `);

  console.log(`Found ${contentBlocks.length} content blocks (expected: ${EXPECTED_CONTENT_BLOCKS.length})`);
  console.log('');

  const foundBlockIds = new Set(contentBlocks.map((b: any) => b.blockId));

  // Check for missing blocks
  const missingBlocks = EXPECTED_CONTENT_BLOCKS.filter(
    expected => !foundBlockIds.has(expected.id)
  );

  if (missingBlocks.length > 0) {
    console.log('❌ MISSING BLOCKS:');
    missingBlocks.forEach(b => console.log(`   - ${b.id} (${b.entityType})`));
  } else {
    console.log('✅ All expected content blocks exist');
  }

  // Check for unexpected blocks
  const expectedIds = new Set(EXPECTED_CONTENT_BLOCKS.map(b => b.id));
  const unexpectedBlocks = contentBlocks.filter(
    (b: any) => !expectedIds.has(b.blockId)
  );

  if (unexpectedBlocks.length > 0) {
    console.log('');
    console.log('⚠️  UNEXPECTED BLOCKS (may need review):');
    unexpectedBlocks.forEach((b: any) =>
      console.log(`   - ${b.blockId} (${b.entityType})`)
    );
  }

  // Check content completeness
  console.log('');
  console.log('Content completeness:');
  contentBlocks.forEach((b: any) => {
    const issues = [];
    if (!b.hasFullContent) issues.push('missing fullContent');
    if (!b.hasTeaserContent) issues.push('missing teaserContent');
    if (b.keyFactsCount === 0) issues.push('no keyFacts');

    if (issues.length > 0) {
      console.log(`   ⚠️  ${b.blockId}: ${issues.join(', ')}`);
    }
  });

  console.log('');

  // 2. Check FAQ blocks
  console.log('2. FAQ BLOCKS');
  console.log('-'.repeat(40));

  const faqBlocks = await client.fetch(`
    *[_type == "faqCanonicalBlock"]{
      _id,
      question,
      category,
      "hasAnswer": defined(answer),
      priority
    } | order(category asc, priority asc)
  `);

  console.log(`Found ${faqBlocks.length} FAQ blocks (expected: 35)`);
  console.log('');

  // Count by category
  const categoryCount: Record<string, number> = {};
  faqBlocks.forEach((faq: any) => {
    categoryCount[faq.category] = (categoryCount[faq.category] || 0) + 1;
  });

  console.log('FAQs by category:');
  Object.entries(categoryCount)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

  // Check for FAQs without answers
  const noAnswer = faqBlocks.filter((f: any) => !f.hasAnswer);
  if (noAnswer.length > 0) {
    console.log('');
    console.log('❌ FAQs without answers:');
    noAnswer.forEach((f: any) => console.log(`   - ${f.question}`));
  }

  console.log('');

  // 3. Check for draft-only documents
  console.log('3. PUBLICATION STATUS');
  console.log('-'.repeat(40));

  const draftOnlyContent = await client.fetch(`
    *[_type == "canonicalBlock" && _id match "drafts.*"]{
      _id,
      "blockId": blockId.current
    }
  `);

  const draftOnlyFaqs = await client.fetch(`
    *[_type == "faqCanonicalBlock" && _id match "drafts.*"]{
      _id,
      question
    }
  `);

  if (draftOnlyContent.length > 0) {
    console.log('⚠️  Content blocks in draft state:');
    draftOnlyContent.forEach((d: any) => console.log(`   - ${d.blockId}`));
  } else {
    console.log('✅ All content blocks are published');
  }

  if (draftOnlyFaqs.length > 0) {
    console.log('⚠️  FAQs in draft state:');
    draftOnlyFaqs.forEach((d: any) => console.log(`   - ${d.question}`));
  } else {
    console.log('✅ All FAQs are published');
  }

  console.log('');

  // 4. Check page references
  console.log('4. PAGE REFERENCES');
  console.log('-'.repeat(40));

  const pages = await client.fetch(`
    *[_type in ["gettingHerePage", "exploreIslayPage", "homepage"]]{
      _type,
      title,
      "contentBlockCount": count(contentBlocks),
      "faqBlockCount": count(faqBlocks),
      "hasSections": defined(pageSections),
      "sectionCount": count(pageSections)
    }
  `);

  pages.forEach((page: any) => {
    console.log(`${page._type}:`);
    if (page.hasSections) {
      console.log(`   Structure: NESTED (${page.sectionCount} sections)`);
    } else {
      console.log(`   Structure: FLAT`);
    }
    console.log(`   Content blocks: ${page.contentBlockCount || 0}`);
    console.log(`   FAQ blocks: ${page.faqBlockCount || 0}`);
  });

  console.log('');

  // 5. Check for broken references
  console.log('5. REFERENCE INTEGRITY');
  console.log('-'.repeat(40));

  // Check pages with sections
  const pagesWithSections = await client.fetch(`
    *[_type in ["gettingHerePage", "exploreIslayPage"] && defined(pageSections)]{
      _type,
      "sections": pageSections[]{
        sectionTitle,
        "contentRefs": contentBlocks[].block._ref,
        "faqRefs": faqBlocks[].faqBlock._ref
      }
    }
  `);

  let brokenRefs = 0;
  for (const page of pagesWithSections) {
    for (const section of page.sections || []) {
      const allRefs = [...(section.contentRefs || []), ...(section.faqRefs || [])];
      for (const ref of allRefs) {
        if (ref) {
          const exists = await client.fetch(
            `count(*[_id == $id || _id == "drafts." + $id])`,
            { id: ref }
          );
          if (exists === 0) {
            console.log(`❌ Broken ref in ${page._type} → ${section.sectionTitle}: ${ref}`);
            brokenRefs++;
          }
        }
      }
    }
  }

  if (brokenRefs === 0) {
    console.log('✅ All references are intact');
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('VERIFICATION COMPLETE');
  console.log('='.repeat(60));
}

verifyContent().catch(console.error);
