// ─── Shared types for siteEntity and guide page data ──────────────────────

export interface OpeningHoursEntry {
  label: string;
  opens?: string;
  closes?: string;
  notes?: string;
}

export interface PeatExpression {
  _key: string;
  name: string;
  peatLevel: 'unpeated' | 'light' | 'medium' | 'heavy' | 'extreme';
  ppmRange?: string;
  description?: string;
}

export interface SiteEntity {
  _id: string;
  entityId: { current: string };
  name: string;
  category: string;
  schemaOrgType?: string;
  island?: string;
  status?: string;
  shortDescription?: string;
  editorialNote?: string;
  importantNote?: string;
  canonicalExternalUrl?: string;
  ecosystemSite?: string;
  location?: {
    address?: string;
    village?: string;
    postcode?: string;
    distanceFromBruichladdich?: string;
    googleMapsUrl?: string;
    googlePlaceId?: string;
    coordinates?: { lat: number; lng: number };
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    bookingUrl?: string;
    instagram?: string;
    facebook?: string;
  };
  openingHours?: OpeningHoursEntry[];
  peatExpressions?: PeatExpression[];
  attributes?: {
    // Common
    requiresBooking?: boolean;
    bookingAdvice?: string;
    priceRange?: string;
    familyFriendly?: boolean;
    // Distillery
    peatLevel?: string;
    yearFounded?: number;
    yearReopened?: number;
    hasCafe?: boolean;
    tourPriceStandard?: string;
    tourPricePremium?: string;
    tourDuration?: string;
    // Beach
    safeForSwimming?: boolean;
    surfSuitable?: boolean;
    dogsAllowed?: boolean;
    dogsSeasonalRestriction?: string;
    sheltered?: boolean;
    rockPools?: boolean;
    sandType?: string;
    // Village
    hasShop?: boolean;
    hasPub?: boolean;
    hasFuel?: boolean;
    hasATM?: boolean;
    hasPostOffice?: boolean;
    population?: string;
    // Food & Drink
    cuisineType?: string;
    reservationRequired?: boolean;
    dogFriendlyVenue?: boolean;
    // Heritage
    heritagePeriod?: string;
    centuryDate?: string;
    significanceNote?: string;
    accessRestrictions?: string;
    // Wildlife
    bestMonths?: string[];
    keySpecies?: string[];
    habitatType?: string;
    // Route
    distanceKm?: number;
    distanceMiles?: number;
    durationMinutes?: number;
    difficulty?: string;
    circular?: boolean;
    terrainType?: string;
    dogFriendlyRoute?: boolean;
    accessibilityNotes?: string;
    startPointParking?: string;
    routeHighlights?: string;
    // Transport
    transportMode?: string;
    operator?: string;
    frequency?: string;
    routeSummary?: string;
    // Event
    eventMonth?: string;
    eventDuration?: string;
  };
  tags?: string[];
}

export type EntityDisplayStyle = 'grid' | 'spectrum' | 'matrix' | 'timeline' | 'calendar';

export interface LayoutHints {
  entityDisplayStyle?: EntityDisplayStyle;
  entityGridColumns?: number;
  showMap?: boolean;
  showPropertyCards?: boolean;
  showBjrCard?: boolean;
}

export interface KeyFact {
  _key: string;
  label: string;
  value: string;
}

export interface KeyFactSet {
  _id: string;
  factSetId?: { current: string };
  title: string;
  category?: string;
  facts: KeyFact[];
}
