import { urlFor } from '@/sanity/lib/image';

// Base URL for the site
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portbahnislay.co.uk';

function getCanonicalUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return BASE_URL;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${BASE_URL}${path}`;
}

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
  | 'BreadcrumbList'
  | 'TouristAttraction'
  | 'HowTo'
  | 'WebPage'
  | 'CollectionPage';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SchemaMarkupProps {
  type: SchemaType | SchemaType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  breadcrumbs?: BreadcrumbItem[];
}

// Helper to map Sanity amenities to schema.org amenityFeature
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAmenitiesToSchema(property: any): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  void data;
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Generate AggregateRating from review scores
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateAggregateRating(reviewScores: any): any {
  if (!reviewScores) return undefined;

  let totalWeightedRating = 0;
  let totalReviews = 0;

  // Collect all ratings and counts, calculate weighted average
  if (reviewScores.airbnbScore && reviewScores.airbnbCount) {
    // Airbnb uses 5-point scale
    totalWeightedRating += reviewScores.airbnbScore * reviewScores.airbnbCount;
    totalReviews += reviewScores.airbnbCount;
  }
  if (reviewScores.bookingScore && reviewScores.bookingCount) {
    // Booking.com uses 10-point scale, convert to 5-point (divide by 2)
    const normalizedScore = reviewScores.bookingScore / 2;
    totalWeightedRating += normalizedScore * reviewScores.bookingCount;
    totalReviews += reviewScores.bookingCount;
  }
  if (reviewScores.googleScore && reviewScores.googleCount) {
    // Google uses 5-point scale
    totalWeightedRating += reviewScores.googleScore * reviewScores.googleCount;
    totalReviews += reviewScores.googleCount;
  }

  if (totalReviews === 0) return undefined;

  // Calculate weighted average
  const averageRating = totalWeightedRating / totalReviews;

  return {
    '@type': 'AggregateRating',
    ratingValue: parseFloat(averageRating.toFixed(1)),
    bestRating: 5,
    worstRating: 1,
    ratingCount: totalReviews,
  };
}

// Generate Review schema from review highlights
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateReviews(reviewHighlights: any[]): any[] {
  if (!reviewHighlights || reviewHighlights.length === 0) return [];

  return reviewHighlights.map((highlight) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: highlight.source || 'Guest',
    },
    reviewRating: highlight.rating ? {
      '@type': 'Rating',
      ratingValue: highlight.rating,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    reviewBody: highlight.quote,
  }));
}

// Generate Accommodation schema for property pages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateAccommodation(property: any) {
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

  // Add idealFor target audience as amenity features
  if (property.idealFor && Array.isArray(property.idealFor)) {
    property.idealFor.forEach((audience: string) => {
      if (audience && audience.trim()) {
        amenityFeatures.push({
          '@type': 'LocationFeatureSpecification',
          name: `Ideal for ${audience}`,
          value: true,
        });
      }
    });
  }

  // Generate aggregate rating from review scores
  const aggregateRating = generateAggregateRating(property.reviewScores);

  // Generate individual reviews from review highlights
  const reviews = generateReviews(property.reviewHighlights || []);

  const accommodation: any = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    '@id': getCanonicalUrl(`/accommodation/${property.slug?.current || property.slug}`),
    name: property.name,
    // Use entityFraming.whatItIs for description priority if available
    description: property.entityFraming?.whatItIs || property.description || property.overviewIntro,
    url: getCanonicalUrl(`/accommodation/${property.slug?.current || property.slug}`),
    isPartOf: {
      '@type': 'WebSite',
      '@id': BASE_URL,
    },
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
    // Add knowsAbout if primaryDifferentiator exists
    ...(property.entityFraming?.primaryDifferentiator && {
      knowsAbout: property.entityFraming.primaryDifferentiator
    }),
    // Add aggregate rating if available
    ...(aggregateRating && { aggregateRating }),
    // Add individual reviews if available
    ...(reviews.length > 0 && { review: reviews }),
    // Add license information if available
    ...(property.licenseNumber && {
      license: {
        '@type': 'CreativeWork',
        name: 'Short Term Let License',
        identifier: property.licenseNumber,
        ...(property.licensingStatus && {
          licenseStatus: property.licensingStatus === 'approved' ? 'Valid' : 'Pending'
        }),
      },
    }),
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generatePropertyPlace(property: any) {
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
    '@id': getCanonicalUrl(`/accommodation/${property.slug?.current || property.slug}#place`),
    name: property.name,
    description: property.description || property.overviewIntro,
    url: getCanonicalUrl(`/accommodation/${property.slug?.current || property.slug}`),
    isPartOf: {
      '@type': 'WebSite',
      '@id': BASE_URL,
    },
    address,
    geo,
  };
}

// Generate Product/Offer schema for booking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateProductOffer(property: any) {
  const canonicalUrl = getCanonicalUrl(`/accommodation/${property.slug?.current || property.slug}`);
  const offers: any[] = [];

  // Determine availability based on availabilityStatus
  let availability: string = 'https://schema.org/InStock';
  if (property.availabilityStatus) {
    switch (property.availabilityStatus) {
      case 'bookable':
        availability = 'https://schema.org/InStock';
        break;
      case 'enquiries':
        availability = 'https://schema.org/PreOrder';
        break;
      case 'coming-soon':
        availability = 'https://schema.org/PreOrder';
        break;
      case 'unavailable':
        availability = 'https://schema.org/OutOfStock';
        break;
    }
  }

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
      availability,
      url: canonicalUrl,
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
      availability,
      url: canonicalUrl,
    });
  }

  if (offers.length === 0) {
    // Default offer if no pricing
    offers.push({
      '@type': 'Offer',
      availability,
      url: canonicalUrl,
    });
  }

  // Generate aggregate rating from review scores
  const aggregateRating = generateAggregateRating(property.reviewScores);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': getCanonicalUrl(`/accommodation/${property.slug?.current || property.slug}#product`),
    name: property.name,
    description: property.description || property.overviewIntro,
    image: property.heroImage ? urlFor(property.heroImage).width(1200).height(630).url() : undefined,
    offers: offers.length === 1 ? offers[0] : offers,
    url: getCanonicalUrl(`/accommodation/${property.slug?.current || property.slug}`),
    isPartOf: {
      '@type': 'WebSite',
      '@id': BASE_URL,
    },
    ...(aggregateRating && { aggregateRating }),
  };
}

// Generate BreadcrumbList schema
function generateBreadcrumbList(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': getCanonicalUrl('#breadcrumbs'),
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.url),
    })),
  };
}

// Generate Article schema (for future guide pages)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateArticle(article: any) {
  const path = article.slug?.current
    ? `/guides/${article.slug.current}`
    : (typeof article.slug === 'string' ? article.slug : undefined);
  const canonicalUrl = getCanonicalUrl(path);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': canonicalUrl,
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
      '@id': canonicalUrl,
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': BASE_URL,
    },
  };
}

// Generate TouristAttraction schema (for Explore Islay page)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateTouristAttraction(data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': data?.url ? getCanonicalUrl(data.url) : getCanonicalUrl('/explore-islay'),
    name: data?.name || 'Isle of Islay',
    description: data?.description || 'Scottish island renowned for nine whisky distilleries, pristine beaches, abundant wildlife, and dramatic coastal landscapes',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 55.7,
      longitude: -6.2,
    },
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Argyll and Bute',
      addressCountry: 'GB',
    },
  };
}

// Generate HowTo schema (for Getting Here page)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateHowTo(data: any) {
  const canonicalUrl = getCanonicalUrl(data?.url || '/travel-to-islay');
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': canonicalUrl,
    name: data?.name || 'How to Get to the Isle of Islay',
    description: data?.description || 'Complete guide to reaching Islay by CalMac ferry or Loganair flight',
    totalTime: 'PT6H',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Book CalMac Ferry',
        text: 'Book ferry from Kennacraig to Port Ellen or Port Askaig 12 weeks in advance',
        url: 'https://www.calmac.co.uk',
      },
      {
        '@type': 'HowToStep',
        name: 'Drive to Kennacraig',
        text: 'Drive 3 hours from Glasgow to Kennacraig ferry terminal on Kintyre Peninsula',
      },
      {
        '@type': 'HowToStep',
        name: 'Take Ferry Crossing',
        text: 'Board CalMac ferry for 2 hour 20 minute crossing to Islay',
      },
      {
        '@type': 'HowToStep',
        name: 'Drive to Bruichladdich',
        text: 'Drive 35-40 minutes from ferry port to Bruichladdich',
      },
    ],
    isPartOf: {
      '@type': 'WebSite',
      '@id': BASE_URL,
    },
  };
}

// Generate WebPage schema (for general pages)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateWebPage(data: any, siteUrl: string) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': getCanonicalUrl(data?.url || siteUrl),
    name: data.name,
    description: data.description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': BASE_URL
    }
  };

  // Add about entity if provided
  if (data.about) {
    schema.about = data.about;
  }

  return schema;
}

// Generate CollectionPage schema (for hub pages)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateCollectionPage(data: any, siteUrl: string) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': getCanonicalUrl(data?.url || siteUrl),
    name: data.name,
    description: data.description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': BASE_URL
    }
  };

  // Add about entity if provided
  if (data.about) {
    schema.about = data.about;
  }

  // Add child pages if provided
  if (data.hasPart && data.hasPart.length > 0) {
    schema.hasPart = data.hasPart.map((page: any) => ({
      '@type': page.type || 'WebPage',
      '@id': getCanonicalUrl(page.url),
      name: page.name
    }));
  }

  return schema;
}

// Main schema generator function
export function generateSchemaMarkup(
  type: SchemaType | SchemaType[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          schemas.push(generatePropertyPlace(data));
        } else {
          // Isle of Islay place
          schemas.push(generateIslayPlace());
        }
        break;
      case 'Accommodation':
        schemas.push(generateAccommodation(data));
        // NOTE: Per playbook v1.3.1, we do NOT add FAQPage schema.
        // Q&A blocks on entity pages enhance the page but don't warrant FAQPage schema.
        // Common questions are part of the Accommodation entity, not a separate FAQ entity.
        break;
      case 'Product':
      case 'Offer':
        schemas.push(generateProductOffer(data));
        break;
      case 'BreadcrumbList':
        if (breadcrumbs && breadcrumbs.length > 0) {
          schemas.push(generateBreadcrumbList(breadcrumbs));
        }
        break;
      case 'Article':
        schemas.push(generateArticle(data));
        break;
      case 'TouristAttraction':
        schemas.push(generateTouristAttraction(data));
        break;
      case 'HowTo':
        schemas.push(generateHowTo(data));
        break;
      case 'WebPage':
        schemas.push(generateWebPage(data, BASE_URL));
        break;
      case 'CollectionPage':
        schemas.push(generateCollectionPage(data, BASE_URL));
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

