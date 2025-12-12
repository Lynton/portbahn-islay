export interface LodgifyProperty {
  name: string;
  slug: string;
  propertyId: number;
  unitId: number;
  icsUrl: string;
}

export const lodgifyProperties: Record<string, LodgifyProperty> = {
  'portbahn-house': {
    name: 'Portbahn House',
    slug: 'portbahn-house',
    propertyId: 360238,
    unitId: 425830,
    icsUrl: 'https://www.lodgify.com/65a57bc4-bff6-491b-8ff5-1b823735c3d9.ics',
  },
  'shorefield-house': {
    name: 'Shorefield House',
    slug: 'shorefield-house',
    propertyId: 360241,
    unitId: 425833,
    icsUrl: 'https://www.lodgify.com/5d637e81-39ad-47a3-9abe-29a0fa1699c8.ics',
  },
  'curlew-cottage': {
    name: 'Curlew Cottage',
    slug: 'curlew-cottage',
    propertyId: 629317,
    unitId: 696265,
    icsUrl: 'https://www.lodgify.com/e43d9860-fa74-4044-b4b5-24281cbe5496.ics',
  },
};

export const LODGIFY_WEBSITE_ID = 518944;
export const LODGIFY_API_BASE = 'https://api.lodgify.com/v2';

