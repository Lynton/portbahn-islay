import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { PortableText } from '@portabletext/react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import BookingCalendar from '@/components/BookingCalendar';
import SchemaMarkup from '@/components/SchemaMarkup';
import Breadcrumbs from '@/components/Breadcrumbs';
import PropertyCard from '@/components/PropertyCard';

async function getProperty(slug: string) {
  // Fetch ALL fields from new v1.1 schema
  const query = `*[_type == "property" && slug.current == $slug] | order(_id desc)[0]{
    _id,
    name,
    slug,
    heroImage,
    images[],
    // Entity Framing (NEW)
    entityFraming{
      whatItIs,
      whatItIsNot[],
      primaryDifferentiator,
      category
    },
    // Content
    overviewIntro,
    overview,
    description,
    idealFor[],
    // Details
    sleeps,
    bedrooms,
    bathrooms,
    sleepingIntro,
    sleepingArrangements,
    facilitiesIntro,
    facilities[],
    outdoorIntro,
    outdoorSpaces,
    includedIntro,
    includedInStay[],
    // Common Questions (ENHANCED)
    commonQuestions[]{
      question,
      answer
    },
    // Location (can be string or object - handle both)
    location,
    locationDetails{
      address,
      coordinates,
      nearestTown
    },
    locationIntro,
    locationDescription,
    localArea,
    nearbyAttractions[],
    whatToDoNearby[],
    gettingHereIntro,
    gettingHere,
    postcode,
    latitude,
    longitude,
    directions,
    ferryInfo,
    airportDistance,
    portDistance,
    // Policies
    petFriendly,
    petPolicyIntro,
    petPolicyDetails[],
    petPolicy{
      allowed,
      fee,
      conditions
    },
    policiesIntro,
    policies,
    checkInTime,
    checkOutTime,
    minimumStay,
    cancellationPolicy,
    paymentTerms,
    securityDeposit,
    licensingInfo,
    importantInfo[],
    dailyRate,
    weeklyRate,
    // Trust Signals (NEW)
    trustSignals{
      ownership,
      established,
      guestExperience,
      localCredentials[]
    },
    // Booking Integration
    lodgifyPropertyId,
    lodgifyRoomId,
    lodgifyRoomTypeId,
    icsUrl,
    // SEO
    seoTitle,
    seoDescription,
    metaTitle,
    metaDescription,
    googleBusinessUrl,
    googlePlaceId,
    // Additional Details
    beds,
    bedroomDetails[],
    bathroomDetails[],
    facilitiesIntro,
    kitchenDining[],
    kitchenDiningNotes[],
    livingAreas[],
    livingAreasNotes[],
    heatingCooling[],
    heatingCoolingNotes[],
    entertainment[],
    entertainmentNotes[],
    laundryFacilities[],
    safetyFeatures[],
    outdoorFeatures[],
    outdoorFeaturesNotes[],
    parkingInfo,
    included[],
    notIncluded[],
    propertyType
  }`;
  
  return await client.fetch(query, { slug });
}

async function getAllProperties(excludeSlug?: string) {
  // Build query conditionally to exclude current property
  const query = excludeSlug
    ? `*[_type == "property" && slug.current != $excludeSlug] | order(name asc){
        _id,
        name,
        slug,
        location,
        overview,
        sleeps,
        bedrooms,
        heroImage
      }`
    : `*[_type == "property"] | order(name asc){
        _id,
        name,
        slug,
        location,
        overview,
        sleeps,
        bedrooms,
        heroImage
      }`;
  
  return excludeSlug 
    ? await client.fetch(query, { excludeSlug })
    : await client.fetch(query);
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// PortableText components for rendering block content
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => <p className="font-mono text-base text-harbour-stone mb-4 leading-relaxed">{children}</p>,
    h2: ({ children }: any) => <h2 className="font-serif text-3xl text-harbour-stone mb-4 mt-8">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-serif text-xl text-harbour-stone mb-2 mt-6">{children}</h3>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-1 mb-4 font-mono text-base text-harbour-stone">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside space-y-1 mb-4 font-mono text-base text-harbour-stone">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

// Helper component to render array fields
function ArrayField({ items, className = '' }: { items: string[] | undefined; className?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className={`list-disc list-inside space-y-1 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="font-mono text-base text-harbour-stone">{item}</li>
      ))}
    </ul>
  );
}

// Helper component to render facilities as badges
function FacilitiesList({ items, className = '' }: { items: string[] | undefined; className?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item, idx) => (
        <span key={idx} className="px-3 py-1 bg-[#F3F1E7] rounded font-mono text-sm text-harbour-stone">
          {item}
        </span>
      ))}
    </div>
  );
}

// Helper component to render checkbox arrays (formats snake_case to readable text)
function CheckboxArray({ items, className = '' }: { items: string[] | undefined; className?: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item, idx) => (
        <span key={idx} className="px-3 py-1 bg-[#F3F1E7] rounded font-mono text-sm text-harbour-stone">
          {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      ))}
    </div>
  );
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return (
      <main className="min-h-screen bg-sea-spray">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-serif text-4xl text-harbour-stone mb-4">Property not found</h1>
          <Link href="/" className="font-mono text-base text-emerald-accent hover:underline">
            Return to homepage
          </Link>
        </div>
      </main>
    );
  }

  const galleryImages = property.images || [];
  const heroImage = property.heroImage;

  // Fetch all other properties for navigation
  const otherProperties = await getAllProperties(property.slug?.current || property.slug);

  // Generate breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Properties', url: '/' },
    { name: property.name, url: `/properties/${property.slug?.current || property.slug}` },
  ];

  return (
    <>
      <SchemaMarkup
        type={['Accommodation', 'Place', 'Product']}
        data={property}
        breadcrumbs={breadcrumbs}
      />
      <main className="min-h-screen bg-sea-spray">
      {/* Hero Image */}
      {heroImage && (
        <div className="w-full h-[60vh] relative overflow-hidden">
          <Image
            src={urlFor(heroImage).width(1600).height(960).url()}
            alt={heroImage.alt || property.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Property Name */}
        <div className="mb-4">
          <h1 className="font-serif text-5xl text-harbour-stone mb-2">
            {property.name}
          </h1>
        </div>

        {/* Location + Capacity Info */}
        <div className="font-mono text-sm text-harbour-stone mb-8 space-y-1">
          {/* Handle both string (legacy) and object (new) location formats */}
          {typeof property.location === 'string' ? (
            <p>{property.location}</p>
          ) : property.locationDetails ? (
            <>
              {property.locationDetails?.address && <p>{property.locationDetails.address}</p>}
              {property.locationDetails?.nearestTown && !property.locationDetails?.address && (
                <p>{property.locationDetails.nearestTown}</p>
              )}
            </>
          ) : null}
          <div className="flex gap-4">
            {property.sleeps && <p>Sleeps {property.sleeps}</p>}
            {property.bedrooms && <p>• {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</p>}
            {property.beds && <p>• {property.beds} {property.beds === 1 ? 'bed' : 'beds'}</p>}
            {property.bathrooms && <p>• {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</p>}
          </div>
        </div>

        {/* Overview Section */}
        <section className="mb-12">
          {/* Overview Intro */}
          {property.overviewIntro && (
            <p className="font-serif text-xl text-harbour-stone mb-6 italic">
              {property.overviewIntro}
            </p>
          )}

          {/* Main Description */}
          {property.description && (
            <div className="font-mono text-base text-harbour-stone leading-relaxed whitespace-pre-line mb-8">
              {property.description}
            </div>
          )}

          {/* Entity Definition Block - AI extraction anchor */}
          {property.entityFraming?.whatItIs && (
            <div className="my-8 border-l-4 border-gray-300 pl-6 py-4 bg-gray-50">
              <p className="text-lg text-gray-900 leading-relaxed">
                {property.entityFraming.whatItIs}
              </p>
              
              {property.entityFraming.primaryDifferentiator && (
                <p className="mt-3 text-base text-gray-700">
                  {property.entityFraming.primaryDifferentiator}
                </p>
              )}
            </div>
          )}

          {/* Trust Signals - subtle credibility layer */}
          {property.trustSignals && (property.trustSignals.established || property.trustSignals.ownership || property.trustSignals.guestExperience) && (
            <div className="mt-6 text-sm text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
              {property.trustSignals.established && (
                <span>{property.trustSignals.established}</span>
              )}
              {property.trustSignals.ownership && (
                <>
                  {property.trustSignals.established && <span className="text-gray-400">•</span>}
                  <span>{property.trustSignals.ownership}</span>
                </>
              )}
              {property.trustSignals.guestExperience && (
                <>
                  {(property.trustSignals.established || property.trustSignals.ownership) && (
                    <span className="text-gray-400">•</span>
                  )}
                  <span>{property.trustSignals.guestExperience}</span>
                </>
              )}
            </div>
          )}

          {property.trustSignals?.localCredentials && property.trustSignals.localCredentials.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {property.trustSignals.localCredentials.map((credential: string, i: number) => (
                <span 
                  key={i} 
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {credential}
                </span>
              ))}
            </div>
          )}

          {/* Ideal For */}
          {property.idealFor && property.idealFor.length > 0 && (
            <div className="mt-8">
              <h3 className="font-serif text-2xl text-harbour-stone mb-4">Ideal For</h3>
              <ul className="list-disc list-inside space-y-2 font-mono text-base text-harbour-stone">
                {property.idealFor.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* What Makes {property.name} Special? Section - PortableText (if overview exists) */}
        {property.overview && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">What Makes {property.name} Special?</h2>
            <PortableText value={property.overview} components={portableTextComponents} />
          </section>
        )}

        {/* Ideal For (NEW) */}
        {property.idealFor && property.idealFor.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Ideal For</h2>
            <ArrayField items={property.idealFor} />
          </section>
        )}

        {/* Sleeping Arrangements */}
        {(property.sleepingIntro || property.sleepingArrangements || property.bedroomDetails?.length || property.bathroomDetails?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Sleeping Arrangements</h2>
            {property.sleepingIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.sleepingIntro}</p>
            )}
            {property.sleepingArrangements && (
              <div className="font-mono text-base text-harbour-stone whitespace-pre-line mb-4">
                {property.sleepingArrangements}
              </div>
            )}
            {property.bedroomDetails && property.bedroomDetails.length > 0 && (
              <div className="mb-4">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Bedrooms</h3>
                <ArrayField items={property.bedroomDetails} />
              </div>
            )}
            {property.bathroomDetails && property.bathroomDetails.length > 0 && (
              <div>
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Bathrooms</h3>
                <ArrayField items={property.bathroomDetails} />
              </div>
            )}
          </section>
        )}

        {/* Facilities & Amenities */}
        {(property.facilitiesIntro || property.facilities?.length || property.kitchenDining?.length || 
          property.livingAreas?.length || property.heatingCooling?.length || property.entertainment?.length || 
          property.laundryFacilities?.length || property.safetyFeatures?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Facilities & Amenities</h2>
            {property.facilitiesIntro && (
              <p className="font-mono text-base text-harbour-stone mb-6">{property.facilitiesIntro}</p>
            )}
            
            {/* Simplified facilities list (v1.1) */}
            {property.facilities && property.facilities.length > 0 && (
              <div className="mb-6">
                <FacilitiesList items={property.facilities} />
              </div>
            )}
            
            {/* Detailed facility checkboxes (Original) */}
            {property.kitchenDining && property.kitchenDining.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Kitchen & Dining</h3>
                <CheckboxArray items={property.kitchenDining} />
                {property.kitchenDiningNotes && property.kitchenDiningNotes.length > 0 && (
                  <ArrayField items={property.kitchenDiningNotes} className="mt-3" />
                )}
              </div>
            )}

            {property.livingAreas && property.livingAreas.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Living Areas</h3>
                <CheckboxArray items={property.livingAreas} />
                {property.livingAreasNotes && property.livingAreasNotes.length > 0 && (
                  <ArrayField items={property.livingAreasNotes} className="mt-3" />
                )}
              </div>
            )}

            {property.heatingCooling && property.heatingCooling.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Heating & Cooling</h3>
                <CheckboxArray items={property.heatingCooling} />
                {property.heatingCoolingNotes && property.heatingCoolingNotes.length > 0 && (
                  <ArrayField items={property.heatingCoolingNotes} className="mt-3" />
                )}
              </div>
            )}

            {property.entertainment && property.entertainment.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Entertainment</h3>
                <CheckboxArray items={property.entertainment} />
                {property.entertainmentNotes && property.entertainmentNotes.length > 0 && (
                  <ArrayField items={property.entertainmentNotes} className="mt-3" />
                )}
              </div>
            )}

            {property.laundryFacilities && property.laundryFacilities.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Laundry</h3>
                <CheckboxArray items={property.laundryFacilities} />
              </div>
            )}

            {property.safetyFeatures && property.safetyFeatures.length > 0 && (
              <div className="mb-6">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Safety Features</h3>
                <CheckboxArray items={property.safetyFeatures} />
              </div>
            )}
          </section>
        )}

        {/* Common Questions (ENHANCED) */}
        {property.commonQuestions && property.commonQuestions.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Common Questions</h2>
            <div className="space-y-6">
              {property.commonQuestions.map((qa: any, idx: number) => (
                <div key={idx} className="border-b border-washed-timber pb-4 last:border-b-0">
                  <h3 className="font-serif text-xl text-harbour-stone mb-2">{qa.question}</h3>
                  <p className="font-mono text-base text-harbour-stone">{qa.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Outdoor Spaces */}
        {(property.outdoorIntro || property.outdoorSpaces || property.outdoorFeatures?.length || property.parkingInfo) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Outdoor Spaces</h2>
            {property.outdoorIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.outdoorIntro}</p>
            )}
            {property.outdoorSpaces && (
              <div className="font-mono text-base text-harbour-stone whitespace-pre-line mb-4">
                {property.outdoorSpaces}
              </div>
            )}
            {property.outdoorFeatures && property.outdoorFeatures.length > 0 && (
              <div className="mb-4">
                <CheckboxArray items={property.outdoorFeatures} />
                {property.outdoorFeaturesNotes && property.outdoorFeaturesNotes.length > 0 && (
                  <ArrayField items={property.outdoorFeaturesNotes} className="mt-3" />
                )}
              </div>
            )}
            {property.parkingInfo && (
              <p className="font-mono text-base text-harbour-stone mt-4">{property.parkingInfo}</p>
            )}
          </section>
        )}

        {/* What's Included */}
        {(property.includedIntro || property.includedInStay?.length || property.included?.length || property.notIncluded?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">What's Included</h2>
            {property.includedIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.includedIntro}</p>
            )}
            {property.includedInStay && property.includedInStay.length > 0 && (
              <div className="mb-4">
                <ArrayField items={property.includedInStay} />
              </div>
            )}
            {property.included && property.included.length > 0 && (
              <div className="mb-4">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Included</h3>
                <ArrayField items={property.included} />
              </div>
            )}
            {property.notIncluded && property.notIncluded.length > 0 && (
              <div>
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Not Included</h3>
                <ArrayField items={property.notIncluded} />
              </div>
            )}
          </section>
        )}

        {/* Image Gallery Grid */}
        {galleryImages.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Gallery</h2>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((image: any, index: number) => (
                <div key={index} className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={urlFor(image).width(800).height(600).url()}
                    alt={image.alt || `${property.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-sea-spray font-mono text-sm px-4 py-2">
                      {image.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location & Surroundings */}
        {(property.locationIntro || property.locationDescription) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Location & Surroundings</h2>
            {property.locationIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.locationIntro}</p>
            )}
            {property.locationDescription && (
              <div className="font-mono text-base text-harbour-stone whitespace-pre-line">
                {property.locationDescription}
              </div>
            )}
          </section>
        )}

        {/* Local Area & Nearby */}
        {(property.localArea || property.nearbyAttractions?.length || property.whatToDoNearby?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Local Area & Nearby</h2>
            {property.localArea && (
              <div className="font-mono text-base text-harbour-stone whitespace-pre-line mb-4">
                {property.localArea}
              </div>
            )}
            {property.nearbyAttractions && property.nearbyAttractions.length > 0 && (
              <div className="mb-4">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Nearby Attractions</h3>
                <ArrayField items={property.nearbyAttractions} />
              </div>
            )}
            {property.whatToDoNearby && property.whatToDoNearby.length > 0 && (
              <div>
                <h3 className="font-serif text-xl text-harbour-stone mb-2">What To Do Nearby</h3>
                <ArrayField items={property.whatToDoNearby} />
              </div>
            )}
          </section>
        )}

        {/* Getting Here */}
        {(property.gettingHereIntro || property.gettingHere || property.postcode || property.directions || 
          property.ferryInfo || property.airportDistance || property.portDistance) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Getting Here</h2>
            {property.gettingHereIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.gettingHereIntro}</p>
            )}
            {property.gettingHere && (
              <div className="font-mono text-base text-harbour-stone whitespace-pre-line mb-4">
                {property.gettingHere}
              </div>
            )}
            {property.postcode && (
              <p className="font-mono text-base text-harbour-stone mb-2">
                <strong>Postcode:</strong> {property.postcode}
              </p>
            )}
            {property.directions && (
              <div className="mb-4">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Directions</h3>
                <div className="font-mono text-base text-harbour-stone whitespace-pre-line">
                  {property.directions}
                </div>
              </div>
            )}
            {property.ferryInfo && (
              <div className="mb-4">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">Ferry Information</h3>
                <div className="font-mono text-base text-harbour-stone whitespace-pre-line">
                  {property.ferryInfo}
                </div>
              </div>
            )}
            {property.airportDistance && (
              <p className="font-mono text-base text-harbour-stone mb-2">
                <strong>Airport:</strong> {property.airportDistance}
              </p>
            )}
            {property.portDistance && (
              <p className="font-mono text-base text-harbour-stone mb-2">
                <strong>Port:</strong> {property.portDistance}
              </p>
            )}
          </section>
        )}

        {/* Pet Policy */}
        {(property.petFriendly !== undefined || property.petPolicyIntro || property.petPolicyDetails?.length || property.petPolicy) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Pet Policy</h2>
            {property.petFriendly !== undefined && (
              <p className="font-mono text-base text-harbour-stone mb-2">
                <strong>Pet Friendly:</strong> {property.petFriendly ? 'Yes' : 'No'}
              </p>
            )}
            {property.petPolicyIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.petPolicyIntro}</p>
            )}
            {property.petPolicyDetails && property.petPolicyDetails.length > 0 && (
              <div className="mb-4">
                <ArrayField items={property.petPolicyDetails} />
              </div>
            )}
            {property.petPolicy && (
              <div className="font-mono text-base text-harbour-stone space-y-3">
                {property.petPolicy.allowed && (
                  <p>
                    <strong>Pets Allowed:</strong>{' '}
                    {property.petPolicy.allowed === 'dogs-welcome' && 'Dogs Welcome'}
                    {property.petPolicy.allowed === 'no-pets' && 'No Pets'}
                    {property.petPolicy.allowed === 'contact' && 'Contact to Discuss'}
                  </p>
                )}
                {property.petPolicy.fee && (
                  <p><strong>Pet Fee:</strong> {property.petPolicy.fee}</p>
                )}
                {property.petPolicy.conditions && (
                  <div className="whitespace-pre-line">{property.petPolicy.conditions}</div>
                )}
              </div>
            )}
          </section>
        )}

        {/* House Rules & Policies */}
        {(property.policiesIntro || property.policies || property.checkInTime || property.checkOutTime || property.minimumStay ||
          property.cancellationPolicy || property.paymentTerms || property.securityDeposit || 
          property.licensingInfo || property.importantInfo?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">House Rules & Policies</h2>
            {property.policiesIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.policiesIntro}</p>
            )}
            {property.policies && (
              <div className="font-mono text-base text-harbour-stone whitespace-pre-line mb-4">
                {property.policies}
              </div>
            )}
            <div className="space-y-3 font-mono text-base text-harbour-stone">
              {property.checkInTime && (
                <p><strong>Check-in:</strong> {property.checkInTime}</p>
              )}
              {property.checkOutTime && (
                <p><strong>Check-out:</strong> {property.checkOutTime}</p>
              )}
              {property.minimumStay && (
                <p><strong>Minimum Stay:</strong> {property.minimumStay} {property.minimumStay === 1 ? 'night' : 'nights'}</p>
              )}
              {property.cancellationPolicy && (
                <div className="mt-4">
                  <h3 className="font-serif text-xl text-harbour-stone mb-2">Cancellation Policy</h3>
                  <div className="whitespace-pre-line">{property.cancellationPolicy}</div>
                </div>
              )}
              {property.paymentTerms && (
                <div className="mt-4">
                  <h3 className="font-serif text-xl text-harbour-stone mb-2">Payment Terms</h3>
                  <div className="whitespace-pre-line">{property.paymentTerms}</div>
                </div>
              )}
              {property.securityDeposit && (
                <p className="mt-4"><strong>Security Deposit:</strong> {property.securityDeposit}</p>
              )}
              {property.licensingInfo && (
                <p className="mt-4"><strong>Short Term Let License:</strong> {property.licensingInfo}</p>
              )}
              {property.importantInfo && property.importantInfo.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-serif text-xl text-harbour-stone mb-2">Important Information</h3>
                  {property.importantInfo.map((info: string, idx: number) => (
                    <div key={idx} className="mb-2 whitespace-pre-line">{info}</div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Pricing */}
        {(property.dailyRate || property.weeklyRate) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Pricing</h2>
            <div className="font-mono text-base text-harbour-stone space-y-2">
              {property.dailyRate && (
                <p><strong>Daily Rate:</strong> £{property.dailyRate.toLocaleString()}</p>
              )}
              {property.weeklyRate && (
                <p><strong>Weekly Rate:</strong> £{property.weeklyRate.toLocaleString()}</p>
              )}
            </div>
          </section>
        )}

        {/* Trust Signals (NEW) */}
        {property.trustSignals && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">About This Property</h2>
            <div className="font-mono text-sm text-harbour-stone space-y-2 opacity-70">
              {property.trustSignals.ownership && (
                <p>{property.trustSignals.ownership}</p>
              )}
              {property.trustSignals.established && (
                <p>{property.trustSignals.established}</p>
              )}
              {property.trustSignals.guestExperience && (
                <p>{property.trustSignals.guestExperience}</p>
              )}
              {property.trustSignals.localCredentials && property.trustSignals.localCredentials.length > 0 && (
                <div>
                  {property.trustSignals.localCredentials.map((cred: string, idx: number) => (
                    <p key={idx}>{cred}</p>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Booking Calendar */}
        {property.lodgifyPropertyId && (property.lodgifyRoomId || property.lodgifyRoomTypeId) && property.slug?.current && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Book Your Stay</h2>
            <BookingCalendar
              propertySlug={property.slug.current}
              propertyId={property.lodgifyPropertyId}
              propertyName={property.name}
              icsUrl={property.icsUrl}
            />
          </section>
        )}

        {/* Other Properties */}
        {otherProperties.length > 0 && (
          <section className="mb-12 mt-16 pt-12 border-t-2 border-[#C8C6BF]">
            <h2 className="font-serif text-3xl text-harbour-stone mb-8">Our Other Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProperties.map((otherProperty: any) => {
                const imageUrl = otherProperty.heroImage 
                  ? urlFor(otherProperty.heroImage).width(800).height(1200).url() 
                  : '';
                
                // Extract description from overview PortableText or use fallback
                let description = '';
                if (otherProperty.overview && Array.isArray(otherProperty.overview)) {
                  // Extract text from first block
                  const firstBlock = otherProperty.overview.find((block: any) => block._type === 'block');
                  if (firstBlock && firstBlock.children) {
                    description = firstBlock.children
                      .map((child: any) => child.text || '')
                      .join(' ')
                      .substring(0, 150);
                  }
                }
                
                // Handle both string (legacy) and object (new) location formats
                const locationText = typeof otherProperty.location === 'string' 
                  ? otherProperty.location 
                  : (otherProperty.locationDetails?.address || otherProperty.locationDetails?.nearestTown || otherProperty.location?.address || otherProperty.location?.nearestTown || '');
                
                return (
                  <PropertyCard
                    key={otherProperty._id}
                    name={otherProperty.name}
                    location={locationText}
                    description={description || 'Self-catering holiday home on Islay'}
                    sleeps={otherProperty.sleeps}
                    bedrooms={otherProperty.bedrooms}
                    imageUrl={imageUrl}
                    href={`/properties/${otherProperty.slug?.current || otherProperty.slug}`}
                  />
                );
              })}
            </div>
          </section>
        )}

      </div>
    </main>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return {
      title: 'Property not found',
    };
  }

  return {
    title: property.metaTitle || property.seoTitle || property.name,
    description: property.metaDescription || property.seoDescription || property.entityFraming?.whatItIs || property.overviewIntro,
    openGraph: {
      title: property.metaTitle || property.seoTitle || property.name,
      description: property.metaDescription || property.seoDescription || property.entityFraming?.whatItIs || property.overviewIntro,
      images: property.heroImage ? [urlFor(property.heroImage).width(1200).height(630).url()] : [],
    },
  };
}
