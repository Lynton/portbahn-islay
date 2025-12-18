import { urlFor } from '@/sanity/lib/image';

// Base URL for the site
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.com';

// Schema type definitions
export type SchemaType = 
  | 'Organization'
  | 'LocalBusiness'
  | 'VacationRental'
  | 'Place'
  | 'Accommodation'
  | 'Product'
  | 'Offer'
  | 'Article'
  | 'FAQPage'
  | 'BreadcrumbList';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SchemaMarkupProps {
  type: SchemaType | SchemaType[];
  data: any;
  breadcrumbs?: BreadcrumbItem[];
}

// Helper to map Sanity amenities to schema.org amenityFeature
function mapAmenitiesToSchema(property: any): any[] {
  const amenities: any[] = [];
  
  // Schema.org amenity types
  const amenityMap: Record<string, string> = {
    'wifi': 'InternetAccess',
    'wifi_ent': 'InternetAccess',
    'wood_stove': 'Fireplace',
    'fireplace': 'Fireplace',
    'dishwasher': 'Dishwasher',
    'washing_machine': 'WashingMachine',
    'tumble_dryer': 'Dryer',
    'tv_cable': 'Television',
    'tv_antenna': 'Television',
    'bbq_grill': 'BarbecueGrills',
    'bbq_area': 'BarbecueGrills',
    'parking': 'Parking',
    'private_garden': 'Garden',
    'sea_views': 'OceanView',
    'sea_views_outdoor': 'OceanView',
  };

  // Collect all amenities from various fields
  const allAmenities = [
    ...(property.kitchenDining || []),
    ...(property.livingAreas || []),
    ...(property.heatingCooling || []),
    ...(property.entertainment || []),
    ...(property.laundryFacilities || []),
    ...(property.safetyFeatures || []),
    ...(property.outdoorFeatures || []),
  ];

  allAmenities.forEach((amenity: string) => {
    const schemaType = amenityMap[amenity];
    if (schemaType) {
      amenities.push({
        '@type': 'LocationFeatureSpecification',
        name: schemaType,
        value: true,
      });
    }
  });

  // Add custom amenities from notes
  if (property.kitchenDiningNotes?.length) {
    property.kitchenDiningNotes.forEach((note: string) => {
      amenities.push({
        '@type': 'LocationFeatureSpecification',
        name: note,
        value: true,
      });
    });
  }

  return amenities;
}

// Generate Organization schema
function generateOrganization(data?: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Portbahn Islay',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`, // Update with actual logo URL
    description: 'Self-catering holiday rental properties on the Isle of Islay, Scotland',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Scotland',
      addressCountry: 'GB',
    },
    sameAs: [
      // Add social media URLs here when available
      // 'https://www.facebook.com/portbahnislay',
      // 'https://www.instagram.com/portbahnislay',
    ],
  };
}

// Generate LocalBusiness/VacationRental schema
function generateVacationRental(data: any) {
  const geo = data.latitude && data.longitude ? {
    '@type': 'GeoCoordinates',
    latitude: data.latitude,
    longitude: data.longitude,
  } : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}#business`,
    name: 'Portbahn Islay',
    description: data.tagline || 'Self-catering holiday rental properties on the Isle of Islay, Scotland',
    url: BASE_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Isle of Islay',
      addressRegion: 'Scotland',
      postalCode: 'PA42', // General Islay postcode
      addressCountry: 'GB',
    },
    geo,
    areaServed: {
      '@type': 'Place',
      name: 'Isle of Islay, Scotland',
    },
  };
}

// Generate Place schema for Isle of Islay
function generateIslayPlace() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: 'Isle of Islay',
    description: 'The Isle of Islay is the southernmost island of the Inner Hebrides of Scotland',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Isle of Islay',
      addressRegion: 'Scotland',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 55.7857,
      longitude: -6.3619,
    },
  };
}

// Generate Accommodation schema for property pages
function generateAccommodation(property: any, siteUrl: string) {
  const geo = property.latitude && property.longitude ? {
    '@type': 'GeoCoordinates',
    latitude: property.latitude,
    longitude: property.longitude,
  } : undefined;

  const address: any = {
    '@type': 'PostalAddress',
    addressLocality: property.location || 'Isle of Islay',
    addressRegion: 'Scotland',
    addressCountry: 'GB',
  };

  if (property.postcode) {
    address.postalCode = property.postcode;
  }

  const amenityFeatures = mapAmenitiesToSchema(property);

  const accommodation: any = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: property.name,
    description: property.description || property.overviewIntro,
    url: `${siteUrl}/accommodation/${property.slug?.current || property.slug}`,
    address,
    geo,
    numberOfRooms: property.bedrooms ? {
      '@type': 'QuantitativeValue',
      value: property.bedrooms,
    } : undefined,
    occupancy: property.sleeps ? {
      '@type': 'QuantitativeValue',
      value: property.sleeps,
    } : undefined,
    amenityFeature: amenityFeatures.length > 0 ? amenityFeatures : undefined,
    petAllowed: property.petFriendly === true ? true : false,
  };

  // Add images
  const images: string[] = [];
  if (property.heroImage) {
    const heroUrl = urlFor(property.heroImage).width(1200).height(630).url();
    images.push(heroUrl);
  }
  if (property.images?.length) {
    property.images.slice(0, 4).forEach((img: any) => {
      if (img.asset) {
        images.push(urlFor(img).width(800).height(600).url());
      }
    });
  }
  if (images.length > 0) {
    accommodation.image = images;
  }

  return accommodation;
}

// Generate Place schema for specific property
function generatePropertyPlace(property: any, siteUrl: string) {
  const geo = property.latitude && property.longitude ? {
    '@type': 'GeoCoordinates',
    latitude: property.latitude,
    longitude: property.longitude,
  } : undefined;

  const address: any = {
    '@type': 'PostalAddress',
    addressLocality: property.location || 'Isle of Islay',
    addressRegion: 'Scotland',
    addressCountry: 'GB',
  };

  if (property.postcode) {
    address.postalCode = property.postcode;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: property.name,
    description: property.description || property.overviewIntro,
    url: `${siteUrl}/accommodation/${property.slug?.current || property.slug}`,
    address,
    geo,
  };
}

// Generate Product/Offer schema for booking
function generateProductOffer(property: any, siteUrl: string) {
  const offers: any[] = [];

  if (property.dailyRate) {
    offers.push({
      '@type': 'Offer',
      price: property.dailyRate,
      priceCurrency: 'GBP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: property.dailyRate,
        priceCurrency: 'GBP',
        unitCode: 'DAY',
      },
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/accommodation/${property.slug?.current || property.slug}`,
    });
  }

  if (property.weeklyRate) {
    offers.push({
      '@type': 'Offer',
      price: property.weeklyRate,
      priceCurrency: 'GBP',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: property.weeklyRate,
        priceCurrency: 'GBP',
        unitCode: 'WEE',
      },
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/accommodation/${property.slug?.current || property.slug}`,
    });
  }

  if (offers.length === 0) {
    // Default offer if no pricing
    offers.push({
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/accommodation/${property.slug?.current || property.slug}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.name,
    description: property.description || property.overviewIntro,
    image: property.heroImage ? urlFor(property.heroImage).width(1200).height(630).url() : undefined,
    offers: offers.length === 1 ? offers[0] : offers,
  };
}

// Generate BreadcrumbList schema
function generateBreadcrumbList(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate Article schema (for future guide pages)
function generateArticle(article: any, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription || article.summary,
    author: {
      '@type': 'Organization',
      name: 'Portbahn Islay',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Portbahn Islay',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    image: article.heroImage ? urlFor(article.heroImage).width(1200).height(630).url() : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}${article.slug?.current || article.slug}`,
    },
  };
}

// Generate FAQPage schema (for future FAQ pages)
function generateFAQPage(faqs: any[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.shortAnswer || faq.fullAnswer,
      },
    })),
  };
}

// Main schema generator function
export function generateSchemaMarkup(
  type: SchemaType | SchemaType[],
  data: any,
  breadcrumbs?: BreadcrumbItem[]
): object[] {
  const types = Array.isArray(type) ? type : [type];
  const schemas: object[] = [];

  types.forEach((schemaType) => {
    switch (schemaType) {
      case 'Organization':
        schemas.push(generateOrganization(data));
        break;
      case 'LocalBusiness':
      case 'VacationRental':
        schemas.push(generateVacationRental(data));
        break;
      case 'Place':
        if (data?.name && data?.location) {
          // Property-specific place
          schemas.push(generatePropertyPlace(data, BASE_URL));
        } else {
          // Isle of Islay place
          schemas.push(generateIslayPlace());
        }
        break;
      case 'Accommodation':
        schemas.push(generateAccommodation(data, BASE_URL));
        break;
      case 'Product':
      case 'Offer':
        schemas.push(generateProductOffer(data, BASE_URL));
        break;
      case 'BreadcrumbList':
        if (breadcrumbs && breadcrumbs.length > 0) {
          schemas.push(generateBreadcrumbList(breadcrumbs));
        }
        break;
      case 'Article':
        schemas.push(generateArticle(data, BASE_URL));
        break;
      case 'FAQPage':
        schemas.push(generateFAQPage(data, BASE_URL));
        break;
    }
  });

  return schemas;
}

// React component for rendering schema markup
export default function SchemaMarkup({ type, data, breadcrumbs }: SchemaMarkupProps) {
  const schemas = generateSchemaMarkup(type, data, breadcrumbs);

  if (schemas.length === 0) {
    return null;
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
}

