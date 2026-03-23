/**
 * Restricted PortableText — text + links only.
 * No headings, lists, bold/italic, blockquotes, or images.
 * Used by canonicalBlock, guidePage.introduction, and (with bullet exception) faqCanonicalBlock.
 *
 * Schema v2: formatting is a template concern, not a content concern.
 */

/** Standard restricted PT: normal blocks + link annotations only */
export const restrictedBlock = {
  type: 'block' as const,
  styles: [{ title: 'Normal', value: 'normal' as const }],
  lists: [] as [],
  marks: {
    decorators: [] as [],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          {
            name: 'href',
            type: 'url',
            title: 'URL',
            validation: (Rule: any) =>
              Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }).required(),
          },
        ],
      },
    ],
  },
}

/** FAQ-specific restricted PT: normal blocks + links + bullet lists */
export const restrictedBlockWithBullets = {
  ...restrictedBlock,
  lists: [{ title: 'Bullet', value: 'bullet' as const }],
}
