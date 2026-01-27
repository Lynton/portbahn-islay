## 2.3 Content Chunk Model
Each page must be broken into extractable, meaningful chunks.

Each chunk includes:
- Heading (H2/H3)
- 1â€“3 short paragraphs
- Optional bullet list
- Optional definition block

Typical chunk types:
- Overview / Introduction
- Key Features
- Location
- What to Expect
- Practical Info
- FAQs
- Highlights
- Related Content

### Optional: Q&A Content Blocks

For entity pages (properties, guides, locations), consider adding a Q&A block:

**Purpose:** Reframe entity attributes in natural language to improve query matching

**Structure:**
- Heading: "Common Questions About [Entity]"
- 4-6 Q&As maximum
- Each Q&A = one extractable chunk
- Fully visible (no accordions)

**Content Rules:**
- Questions match how users actually search
- Answers are 2-3 sentences max
- Q&As extend/reframe existing content (don't duplicate)
- Each answer can stand alone if extracted

**Example:**
```
H2: Common Questions About Portbahn House

Q: Does Portbahn House have WiFi?
A: Yes, reliable WiFi is available throughout the property.

Q: Is Portbahn suitable for remote work?
A: Yes, with reliable WiFi, large dining table seating 8, 
and quiet location away from main road.
```

**Schema Note:** Do NOT use FAQPage schema on entity pages. Q&As enhance entity schema, don't replace it.

**When to Use:**
- Property pages: Property-specific questions
- Guide pages: Visitor/practical questions
- Hub pages: Inline within sections (e.g., "Common Ferry Questions")

**When NOT to Use:**
- If questions would just duplicate existing list content
- If you don't have 3+ meaningful questions
- On pages where Q&A format doesn't fit context

These become **AI citation units** alongside other content chunks.
```

---

# Part B: Cursor Prompts for Phase 1

Run these 4 prompts sequentially in Cursor:

---

## **PROMPT 1: Revert Property Page Headings**
```
Revert property page headings back to entity-focused format (not all questions).

## Background
We over-applied question-based headings. Entity keywords like "Facilities" 
and "Sleeping Arrangements" are valuable search terms and should be preserved. 
Questions are better for FAQ sections, not entity attribute headings.

## Changes Needed

In app/accommodation/[slug]/page.tsx:

### Keep These (good as-is):
- "What Makes {property.name} Special?" âœ“ (was vague "Overview")
- "Ideal For" âœ“ (already good)
- "Gallery" âœ“ (already good)
- "Can I Bring Pets?" âœ“ (question matches exact query)

### Revert These (back to entity keywords):

1. "Where Will You Sleep?" â†’ **"Sleeping Arrangements"**
   Reason: "Sleeping arrangements" is searchable keyword phrase

2. "What's Included in Your Stay?" â†’ **"Facilities"**
   Reason: "Facilities" is strong entity keyword, more precise

3. "What's Outside?" â†’ **"Outdoor Spaces"**
   Reason: "Outdoor spaces" is descriptive and searchable

4. "Where is {property.name} Located?" â†’ **"Location"**
   Reason: Simpler, still clear, keyword-focused

5. "What Can You Do Nearby?" â†’ **"What To Do Nearby"**
   Reason: Original was already question-format, new version wordier

6. "How Do You Get Here?" â†’ **"Getting Here"**
   Reason: Keep it simple, still clear

7. "What Are the House Rules?" â†’ **"House Rules"**
   Reason: Keep "rules" keyword, already descriptive

### Result: Mixed Approach
- Entity attributes use keyword headings (Facilities, Location, Sleeping Arrangements)
- User queries use question format (Can I Bring Pets?, What Makes X Special?)
- This matches AEO best practice: entity pages = keyword-focused

After changes, show me the complete heading structure for verification.
```

---

## **PROMPT 2: Add Q&A Schema to Property**
```
Add Q&A content block field to property schema for contextual FAQ sections.

## What We're Adding
A field for property-specific common questions that will display 
after the Facilities section on property pages.

## Schema Update

In sanity/schemas/collections/property.ts, add this field in an appropriate group 
(suggest after Policies Group or create new "Content Enhancements" group):
```typescript
// Content Enhancements Group
defineField({
  name: 'commonQuestions',
  title: 'Common Questions',
  type: 'array',
  description: 'Common questions visitors have about this property (4-6 recommended). These appear after Facilities section.',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'question',
          type: 'string',
          title: 'Question',
          placeholder: 'e.g., Does Portbahn House have WiFi?',
          validation: Rule => Rule.required(),
          description: 'Natural language question matching how users search'
        },
        {
          name: 'answer',
          type: 'text',
          title: 'Answer',
          rows: 3,
          placeholder: 'Brief answer (2-3 sentences max)',
          validation: Rule => Rule.required().max(400).warning('Keep under 400 characters for best display and AI extraction'),
          description: 'Concise answer that can stand alone if extracted'
        }
      ],
      preview: {
        select: {
          title: 'question',
          subtitle: 'answer'
        },
        prepare({ title, subtitle }) {
          return {
            title,
            subtitle: subtitle ? subtitle.substring(0, 60) + '...' : ''
          }
        }
      }
    }
  ],
  validation: Rule => Rule.max(6).warning('Recommend 4-6 questions for optimal readability')
}),
```

## Important Notes
- This is NOT a standalone FAQ page
- Q&As should reframe/extend existing property info, not duplicate it
- Maximum 6 questions to keep scannable
- Questions should match natural language queries
- All content will be fully visible (no accordions)

After adding, show me:
- Confirmation field added
- Which group it's in
- Any linting issues
```

---

## **PROMPT 3: Update Query & Add Display Component**
```
Add Q&A display to property pages - query update and component.

## Part 1: Update Query

In app/accommodation/[slug]/page.tsx, add to the property detail query:
```typescript
commonQuestions[] {
  question,
  answer
}
```

## Part 2: Add Display Section

Add this section in the property page component AFTER the Facilities section 
and BEFORE the Location section:
```typescript
{/* Common Questions Section */}
{property.commonQuestions && property.commonQuestions.length > 0 && (
  <section className="my-16 max-w-4xl">
    <h2 className="text-3xl font-bold mb-8">
      Common Questions About {property.name}
    </h2>
    <div className="space-y-8">
      {property.commonQuestions.map((qa, index) => (
        <div 
          key={index} 
          className="border-l-4 border-gray-300 pl-6 py-2"
        >
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            {qa.question}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {qa.answer}
          </p>
        </div>
      ))}
    </div>
  </section>
)}
```

## Design Requirements
- Fully visible (no accordions/collapsing)
- Semantic HTML (h2 > h3 + p structure)
- Left border for visual separation
- Consistent spacing with other sections
- Mobile responsive

## Placement
Insert between:
- AFTER: Facilities section
- BEFORE: Location section

This puts Q&As after factual details but before directional info.

After making changes:
- Show me the section order
- Confirm query includes commonQuestions
- Confirm TypeScript types are correct
```

---

## **PROMPT 4: Trust Signals Schema** (Original Prompt 3)
```
Add trust and authority signals to property schema for AEO credibility.

## Part 1: Update Schema

In sanity/schemas/collections/property.ts, add this field in an appropriate group 
(suggest after "Property Details Group" or create new "Trust & Authority" group):
```typescript
// Trust & Authority Group
defineField({
  name: 'trustSignals',
  title: 'Trust & Authority',
  type: 'object',
  description: 'Information that builds credibility with AI systems and users',
  options: {
    collapsible: true,
    collapsed: false
  },
  fields: [
    {
      name: 'ownership',
      type: 'string',
      title: 'Ownership Type',
      placeholder: 'e.g., Family-owned, Locally-managed',
      description: 'How the property is owned/managed'
    },
    {
      name: 'established',
      type: 'string',
      title: 'Established',
      placeholder: 'e.g., Welcoming guests since 2015',
      description: 'When the property started welcoming guests'
    },
    {
      name: 'guestExperience',
      type: 'string',
      title: 'Guest Experience',
      placeholder: 'e.g., Over 500 guests welcomed, 10 years hosting',
      description: 'Quantifiable guest/hosting experience'
    },
    {
      name: 'localCredentials',
      type: 'array',
      of: [{type: 'string'}],
      title: 'Local Credentials',
      placeholder: 'e.g., VisitScotland approved, RSPB supporter',
      description: 'Awards, memberships, certifications'
    }
  ]
}),
```

## Part 2: Update Query

In app/accommodation/[slug]/page.tsx, add trustSignals to the property detail query:
```typescript
trustSignals {
  ownership,
  established,
  guestExperience,
  localCredentials
}
```

## Part 3: Display Trust Signals

In the property page component, add trust signals to the Overview section, 
AFTER the main description:
```typescript
{property.trustSignals && (property.trustSignals.established || property.trustSignals.ownership || property.trustSignals.guestExperience) && (
  <p className="text-sm text-gray-600 mt-4 flex flex-wrap gap-2">
    {property.trustSignals.established && (
      <span>{property.trustSignals.established}</span>
    )}
    {property.trustSignals.ownership && (
      <>
        {property.trustSignals.established && <span className="text-gray-400">â€¢</span>}
        <span>{property.trustSignals.ownership}</span>
      </>
    )}
    {property.trustSignals.guestExperience && (
      <>
        {(property.trustSignals.established || property.trustSignals.ownership) && <span className="text-gray-400">â€¢</span>}
        <span>{property.trustSignals.guestExperience}</span>
      </>
    )}
  </p>
)}

{property.trustSignals?.localCredentials && property.trustSignals.localCredentials.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-2">
    {property.trustSignals.localCredentials.map((credential, i) => (
      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
        {credential}
      </span>
    ))}
  </div>
)}
```

## Display Goals
- Subtle and natural (not marketing-heavy)
- Displayed after main property description
- Separated with bullet points
- Credentials as small badges
- Optional (only shows if data exists)

## Part 4: Update Schema Markup (Optional Enhancement)

In lib/schema-markup.tsx, if trustSignals.established exists and contains a year, 
try to extract it and add as foundingDate to Organization or Accommodation schema.

This is a minor enhancement - focus on Parts 1-3 first.

After making changes, show me:
- Confirmation schema field added
- Query updated
- Display component location
- Any TypeScript issues