import { defineType, defineField } from 'sanity';

/**
 * FAQ Category Settings
 *
 * Centralized management of FAQ categories.
 * These categories can be used for FAQs and potentially other content types.
 */
export default defineType({
  name: 'faqCategorySettings',
  title: 'FAQ Categories',
  type: 'document',
  groups: [
    {
      name: 'categories',
      title: 'Categories',
      default: true,
    },
  ],
  fields: [
    defineField({
      name: 'categories',
      title: 'FAQ Categories',
      type: 'array',
      group: 'categories',
      description: 'Manage FAQ categories. These can also be used for content tagging across the site.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'Category ID',
              type: 'slug',
              description: 'Unique identifier (e.g., "distilleries", "food-drink", "portbahn-house")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Display Label',
              type: 'string',
              description: 'Human-readable label (e.g., "Distilleries", "Food & Drink")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Optional description of what this category covers',
            },
            {
              name: 'categoryType',
              title: 'Category Type',
              type: 'string',
              options: {
                list: [
                  { title: 'General Topic', value: 'general' },
                  { title: 'Property (General)', value: 'property-general' },
                  { title: 'Property (Specific)', value: 'property-specific' },
                  { title: 'Activity', value: 'activity' },
                  { title: 'Travel & Logistics', value: 'travel' },
                ],
              },
              description: 'Type of category for organizational purposes',
            },
            {
              name: 'sortOrder',
              title: 'Sort Order',
              type: 'number',
              description: 'Display order (lower numbers first)',
              initialValue: 100,
            },
          ],
          preview: {
            select: {
              title: 'label',
              slug: 'id.current',
              type: 'categoryType',
            },
            prepare({ title, slug, type }) {
              return {
                title: title || 'Untitled Category',
                subtitle: `${slug || 'no-id'} (${type || 'uncategorized'})`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.custom((categories) => {
        if (!categories || !Array.isArray(categories)) return true;

        // Check for duplicate IDs
        const ids = categories.map((cat: any) => cat.id?.current).filter(Boolean);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

        if (duplicates.length > 0) {
          return `Duplicate category IDs found: ${duplicates.join(', ')}`;
        }

        return true;
      }),
    }),
    defineField({
      name: 'defaultCategories',
      title: 'Default Categories (Read Only)',
      type: 'text',
      rows: 10,
      readOnly: true,
      initialValue: `Suggested categories to create:

General Topics:
- distilleries (Distilleries)
- wildlife (Wildlife)
- beaches (Beaches)
- food-drink (Food & Drink)
- family (Family Activities)

Travel & Logistics:
- travel (Getting to Islay)
- ferry (Ferry Information)
- flights (Flights)

Property:
- property-general (All Properties)
- portbahn-house (Portbahn House)
- shorefield (Shorefield)
- curlew (Curlew)

Booking:
- booking (Booking & Payments)
- policies (Policies & Rules)`,
      description: 'Reference guide for setting up categories',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'FAQ Categories',
      };
    },
  },
});
