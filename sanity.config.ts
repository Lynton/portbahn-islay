import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './sanity/schemas';
import {media} from 'sanity-plugin-media';

export default defineConfig({
  name: 'default',
  title: 'Portbahn Islay',

  // Use SANITY_STUDIO_ prefix for standalone mode, NEXT_PUBLIC_ for Next.js integration
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  // basePath is used when embedded in Next.js (http://localhost:3000/studio)
  // When running standalone (npm run sanity), access at http://localhost:3333/
  basePath: '/studio',

  // Enable scheduled publishing (built into Sanity v3.39.0+)
  scheduledPublishing: {
    enabled: true,
  },

  plugins: [
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft',
        },
      },
    }),
    structureTool({
      structure: (S: any) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('Homepage')
                      .id('homepage')
                      .child(
                        S.document()
                          .schemaType('homepage')
                          .documentId('homepage')
                      ),
                    S.listItem()
                      .title('About')
                      .id('aboutPage')
                      .child(
                        S.document()
                          .schemaType('aboutPage')
                          .documentId('aboutPage')
                      ),
                    S.listItem()
                      .title('Accommodation (Hub)')
                      .id('accommodationPage')
                      .child(
                        S.document()
                          .schemaType('accommodationPage')
                          .documentId('accommodationPage')
                      ),
                    S.listItem()
                      .title('Getting Here')
                      .id('gettingHerePage')
                      .child(
                        S.document()
                          .schemaType('gettingHerePage')
                          .documentId('gettingHerePage')
                      ),
                    S.listItem()
                      .title('Contact')
                      .id('contactPage')
                      .child(
                        S.document()
                          .schemaType('contactPage')
                          .documentId('contactPage')
                      ),
                    S.listItem()
                      .title('Privacy')
                      .id('privacyPage')
                      .child(
                        S.document()
                          .schemaType('privacyPage')
                          .documentId('privacyPage')
                      ),
                    S.listItem()
                      .title('Terms')
                      .id('termsPage')
                      .child(
                        S.document()
                          .schemaType('termsPage')
                          .documentId('termsPage')
                      ),
                    S.listItem()
                      .title('Explore Islay (Hub)')
                      .id('exploreIslayPage')
                      .child(
                        S.document()
                          .schemaType('exploreIslayPage')
                          .documentId('exploreIslayPage')
                      ),
                  ])
              ),
            // Guide Pages (spoke pages for hub-and-spoke architecture)
            S.listItem()
              .title('Guide Pages')
              .child(
                S.documentTypeList('guidePage')
                  .title('Guide Pages')
              ),
            // Divider
            S.divider(),
            // Collections
            S.listItem()
              .title('Accommodation')
              .child(
                S.documentTypeList('property')
                  .title('Properties')
              ),
            S.listItem()
              .title('Guides')
              .child(
                S.list()
                  .title('Guides')
                  .items([
                    S.listItem()
                      .title('Beaches')
                      .child(S.documentTypeList('beach').title('Beaches')),
                    S.listItem()
                      .title('Distilleries')
                      .child(S.documentTypeList('distillery').title('Distilleries')),
                    S.listItem()
                      .title('Walks')
                      .child(S.documentTypeList('walk').title('Walks')),
                    S.listItem()
                      .title('Villages')
                      .child(S.documentTypeList('village').title('Villages')),
                  ])
              ),
            S.listItem()
              .title('Canonical Content Blocks')
              .child(
                S.documentTypeList('canonicalBlock')
                  .title('Canonical Content Blocks')
              ),
            S.listItem()
              .title('FAQ Canonical Blocks')
              .child(
                S.documentTypeList('faqCanonicalBlock')
                  .title('FAQ Canonical Blocks')
                  .defaultOrdering([{ field: 'question', direction: 'asc' }])
                  // Batch operations are available by default in Sanity Studio v3
                  // Users can select items by clicking the checkbox area on the left of each item
                  // Or use Cmd/Ctrl+A to select all, then use the bulk actions menu
              ),
            // Divider
            S.divider(),
            // Settings
            S.listItem()
              .title('Settings')
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    S.listItem()
                      .title('Site Settings')
                      .id('siteSettings')
                      .child(
                        S.document()
                          .schemaType('siteSettings')
                          .documentId('siteSettings')
                      ),
                  ])
              ),
          ]),
    }),
    visionTool(),
    media(),
  ],

  // Add an explicit "Duplicate" action for canonical blocks, since Studio's default
  // duplicate action isn't available in this build.
  document: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: (prev: any[], context: any) => {
      if (context?.schemaType !== 'canonicalBlock') return prev;
      const hasAction = prev.some((a) => a?.action === 'duplicateCanonicalBlock');
      if (hasAction) return prev;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return [...prev, duplicateCanonicalBlockAction];
    },
  },

  schema: {
    types: schemaTypes,
  },
});

function duplicateCanonicalBlockAction(props: any) {
  const { draft, published, onComplete } = props;
  const source = draft || published;

  return {
    label: 'Duplicate',
    action: 'duplicateCanonicalBlock',
    onHandle: async () => {
      if (!source) {
        onComplete();
        return;
      }

      // Sanity document actions are not React components, so we avoid hooks here.
      const { createClient } = await import('@sanity/client');
      const client = createClient({
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
        dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2025-02-19',
        useCdn: false,
        token: process.env.SANITY_API_TOKEN,
      });

      const newDoc: any = {
        ...source,
        _id: undefined,
        _rev: undefined,
        _createdAt: undefined,
        _updatedAt: undefined,
      };

      // Ensure blockId uniqueness by clearing it; editor can set a new one.
      if (newDoc.blockId) newDoc.blockId = `${newDoc.blockId}-copy`;
      if (newDoc.title) newDoc.title = `${newDoc.title} (Copy)`;

      await client.create(newDoc);
      onComplete();
    },
  };
}

