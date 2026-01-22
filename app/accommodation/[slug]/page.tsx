import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import BookingCalendar from '@/components/BookingCalendar';
import SchemaMarkup from '@/components/SchemaMarkup';
import Breadcrumbs from '@/components/Breadcrumbs';
import PropertyCard from '@/components/PropertyCard';
import GoogleMap from '@/components/GoogleMap';
import GoogleReviews from '@/components/GoogleReviews';

// TypeScript types for AI-optimized fields
interface EntityFraming {
  whatItIs?: string;
  whatItIsNot?: string[];
  primaryDifferentiator?: string;
  category?: string;
}

interface TrustSignals {
  ownership?: string;
  established?: string;
  guestExperience?: string;
  localCredentials?: string[];
}

interface CommonQuestion {
  question: string;
  answer: string;
}

async function getProperty(slug: string) {
  // Fetch ALL fields explicitly to ensure everything is returned
  // Try to get draft first, then fall back to published
  const query = `*[_type == "property" && slug.current == $slug] | order(_id desc)[0]{
    _id,
    name,
    slug,
    propertyType,
    heroImage,
    images[],
    overviewIntro,
    description,
    idealFor[],
    entityFraming {
      whatItIs,
      whatItIsNot,
      primaryDifferentiator,
      category
    },
    commonQuestions[] {
      question,
      answer
    },
    trustSignals {
      ownership,
      established,
      guestExperience,
      localCredentials
    },
    sleeps,
    bedrooms,
    beds,
    bathrooms,
    sleepingIntro,
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
    outdoorIntro,
    outdoorFeatures[],
    outdoorFeaturesNotes[],
    parkingInfo,
    petFriendly,
    petPolicyIntro,
    petPolicyDetails[],
    locationIntro,
    location,
    nearbyAttractions[],
    whatToDoNearby[],
    gettingHereIntro,
    postcode,
    latitude,
    longitude,
    directions,
    ferryInfo,
    airportDistance,
    portDistance,
    policiesIntro,
    checkInTime,
    checkOutTime,
    minimumStay,
    cancellationPolicy,
    paymentTerms,
    securityDeposit,
    licensingInfo,
    includedIntro,
    included[],
    notIncluded[],
    importantInfo[],
    dailyRate,
    weeklyRate,
    lodgifyPropertyId,
    lodgifyRoomId,
    icsUrl,
    seoTitle,
    seoDescription,
    googleBusinessUrl,
    googlePlaceId
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
        description,
        sleeps,
        bedrooms,
        heroImage
      }`
    : `*[_type == "property"] | order(name asc){
        _id,
        name,
        slug,
        location,
        description,
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

// Helper component to render checkbox arrays
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
    { name: 'Accommodation', url: '/' },
    { name: property.name, url: `/accommodation/${property.slug?.current || property.slug}` },
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
        {/* Property Name & Type */}
        <div className="mb-4">
          <h1 className="font-serif text-5xl text-harbour-stone mb-2">
            {property.name}
          </h1>
          {property.propertyType && (
            <p className="font-mono text-sm text-harbour-stone opacity-60 uppercase">
              {property.propertyType}
            </p>
          )}
        </div>

        {/* Location + Capacity Info */}
        <div className="font-mono text-sm text-harbour-stone mb-8 space-y-1">
          {property.location && <p>{property.location}</p>}
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
          {(property.trustSignals?.established || property.trustSignals?.ownership || property.trustSignals?.guestExperience) && (
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

        {/* What Makes {property.name} Special? Section */}
        {property.description && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">What Makes {property.name} Special?</h2>
            <div className="font-mono text-base text-harbour-stone leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </section>
        )}

        {/* Google Reviews */}
        {(property.googleBusinessUrl || property.googlePlaceId) && (
          <GoogleReviews
            googleBusinessUrl={property.googleBusinessUrl}
            googlePlaceId={property.googlePlaceId}
            propertyName={property.name}
          />
        )}

        {/* Sleeping Arrangements */}
        <section className="mb-12">
          <h2 className="font-serif text-3xl text-harbour-stone mb-4">Sleeping Arrangements</h2>
          {property.sleepingIntro ? (
            <p className="font-mono text-base text-harbour-stone mb-4">{property.sleepingIntro}</p>
          ) : (
            <p className="font-mono text-sm text-harbour-stone opacity-50 italic mb-4">[sleepingIntro not set]</p>
          )}
          {property.bedroomDetails && property.bedroomDetails.length > 0 ? (
            <div className="mb-4">
              <h3 className="font-serif text-xl text-harbour-stone mb-2">Bedrooms</h3>
              <ArrayField items={property.bedroomDetails} />
            </div>
          ) : (
            <p className="font-mono text-sm text-harbour-stone opacity-50 italic mb-4">[bedroomDetails not set]</p>
          )}
          {property.bathroomDetails && property.bathroomDetails.length > 0 ? (
            <div>
              <h3 className="font-serif text-xl text-harbour-stone mb-2">Bathrooms</h3>
              <ArrayField items={property.bathroomDetails} />
            </div>
          ) : (
            <p className="font-mono text-sm text-harbour-stone opacity-50 italic">[bathroomDetails not set]</p>
          )}
        </section>

        {/* Accommodation Facilities */}
        {(property.facilitiesIntro || property.kitchenDining?.length || property.livingAreas?.length || 
          property.heatingCooling?.length || property.entertainment?.length || property.laundryFacilities?.length || 
          property.safetyFeatures?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Facilities</h2>
            {property.facilitiesIntro && (
              <p className="font-mono text-base text-harbour-stone mb-6">{property.facilitiesIntro}</p>
            )}
            
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

        {/* Common Questions - natural language query matching */}
        {property.commonQuestions && property.commonQuestions.length > 0 && (
          <section className="my-16 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">
              Common Questions About {property.name}
            </h2>
            <div className="space-y-8">
              {property.commonQuestions.map((qa: { question: string; answer: string }, index: number) => (
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

        {/* Outdoor Spaces */}
        {(property.outdoorIntro || property.outdoorFeatures?.length || property.parkingInfo) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Outdoor Spaces</h2>
            {property.outdoorIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.outdoorIntro}</p>
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
        {(property.includedIntro || property.included?.length || property.notIncluded?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">What's Included</h2>
            {property.includedIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.includedIntro}</p>
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

        {/* Location & Nearby */}
        {(property.locationIntro || property.nearbyAttractions?.length || property.whatToDoNearby?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Location</h2>
            {property.locationIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.locationIntro}</p>
            )}
            {property.nearbyAttractions && property.nearbyAttractions.length > 0 && (
              <div className="mb-4">
                <h3 className="font-serif text-xl text-harbour-stone mb-2">What's Nearby?</h3>
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
        {(property.gettingHereIntro || property.postcode || property.directions || 
          property.ferryInfo || property.airportDistance || property.portDistance || 
          property.latitude || property.longitude || property.location) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Getting Here</h2>
            {property.gettingHereIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.gettingHereIntro}</p>
            )}
            
            {/* Google Map */}
            {(property.latitude || property.longitude || property.postcode || property.location) && (
              <div className="mb-6">
                <GoogleMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  postcode={property.postcode}
                  location={property.location}
                  name={property.name}
                  height="450px"
                />
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

        {/* House Rules & Policies */}
        {(property.policiesIntro || property.checkInTime || property.checkOutTime || property.minimumStay ||
          property.cancellationPolicy || property.paymentTerms || property.securityDeposit || 
          property.licensingInfo || property.importantInfo?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">House Rules</h2>
            {property.policiesIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.policiesIntro}</p>
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

        {/* Pet Policy */}
        {(property.petFriendly !== undefined || property.petPolicyIntro || property.petPolicyDetails?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Can I Bring Pets?</h2>
            <p className="font-mono text-base text-harbour-stone mb-2">
              <strong>Pet Friendly:</strong> {property.petFriendly ? 'Yes' : 'No'}
            </p>
            {property.petPolicyIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.petPolicyIntro}</p>
            )}
            {property.petPolicyDetails && property.petPolicyDetails.length > 0 && (
              <ArrayField items={property.petPolicyDetails} />
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

        {/* Booking Calendar */}
        {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
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

        {/* Other Accommodation */}
        {otherProperties.length > 0 && (
          <section className="mb-12 mt-16 pt-12 border-t-2 border-[#C8C6BF]">
            <h2 className="font-serif text-3xl text-harbour-stone mb-8">Our Other Accommodation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherProperties.map((otherProperty: any) => {
                const imageUrl = otherProperty.heroImage 
                  ? urlFor(otherProperty.heroImage).width(800).height(1200).url() 
                  : '';
                
                return (
                  <PropertyCard
                    key={otherProperty._id}
                    name={otherProperty.name}
                    location={otherProperty.location}
                    description={otherProperty.description}
                    sleeps={otherProperty.sleeps}
                    bedrooms={otherProperty.bedrooms}
                    imageUrl={imageUrl}
                    href={`/accommodation/${otherProperty.slug?.current || otherProperty.slug}`}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Show ALL schema fields for preview - even if empty */}
        <section className="mb-12 mt-12 pt-12 border-t-2 border-[#C8C6BF]">
          <h2 className="font-serif text-3xl text-harbour-stone mb-6">All Schema Fields (Preview)</h2>
          
          <div className="space-y-6 font-mono text-sm">
            {/* Content Group */}
            <div className="bg-[#F3F1E7] p-4 rounded">
              <h3 className="font-serif text-xl text-harbour-stone mb-3">Content Group</h3>
              <div className="space-y-2 text-harbour-stone">
                <div><strong>name:</strong> {property.name || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>slug:</strong> {property.slug?.current || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>propertyType:</strong> {property.propertyType || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>heroImage:</strong> {property.heroImage ? '✓' : <span className="text-red-500">(empty)</span>}</div>
                <div><strong>images:</strong> {property.images?.length || 0} images</div>
                <div><strong>overviewIntro:</strong> {property.overviewIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>description:</strong> {property.description ? '✓' : <span className="text-red-500">(empty)</span>}</div>
              </div>
            </div>

            {/* Details Group */}
            <div className="bg-[#F3F1E7] p-4 rounded">
              <h3 className="font-serif text-xl text-harbour-stone mb-3">Property Details Group</h3>
              <div className="space-y-2 text-harbour-stone">
                <div><strong>sleeps:</strong> {property.sleeps || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>bedrooms:</strong> {property.bedrooms || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>beds:</strong> {property.beds || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>bathrooms:</strong> {property.bathrooms || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>sleepingIntro:</strong> {property.sleepingIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>bedroomDetails:</strong> {property.bedroomDetails?.length || 0} items</div>
                <div><strong>bathroomDetails:</strong> {property.bathroomDetails?.length || 0} items</div>
                <div><strong>facilitiesIntro:</strong> {property.facilitiesIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>kitchenDining:</strong> {property.kitchenDining?.length || 0} items</div>
                <div><strong>kitchenDiningNotes:</strong> {property.kitchenDiningNotes?.length || 0} items</div>
                <div><strong>livingAreas:</strong> {property.livingAreas?.length || 0} items</div>
                <div><strong>livingAreasNotes:</strong> {property.livingAreasNotes?.length || 0} items</div>
                <div><strong>heatingCooling:</strong> {property.heatingCooling?.length || 0} items</div>
                <div><strong>heatingCoolingNotes:</strong> {property.heatingCoolingNotes?.length || 0} items</div>
                <div><strong>entertainment:</strong> {property.entertainment?.length || 0} items</div>
                <div><strong>entertainmentNotes:</strong> {property.entertainmentNotes?.length || 0} items</div>
                <div><strong>laundryFacilities:</strong> {property.laundryFacilities?.length || 0} items</div>
                <div><strong>safetyFeatures:</strong> {property.safetyFeatures?.length || 0} items</div>
                <div><strong>outdoorIntro:</strong> {property.outdoorIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>outdoorFeatures:</strong> {property.outdoorFeatures?.length || 0} items</div>
                <div><strong>outdoorFeaturesNotes:</strong> {property.outdoorFeaturesNotes?.length || 0} items</div>
                <div><strong>parkingInfo:</strong> {property.parkingInfo || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>includedIntro:</strong> {property.includedIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>included:</strong> {property.included?.length || 0} items</div>
                <div><strong>notIncluded:</strong> {property.notIncluded?.length || 0} items</div>
              </div>
            </div>

            {/* Location Group */}
            <div className="bg-[#F3F1E7] p-4 rounded">
              <h3 className="font-serif text-xl text-harbour-stone mb-3">Location Group</h3>
              <div className="space-y-2 text-harbour-stone">
                <div><strong>locationIntro:</strong> {property.locationIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>location:</strong> {property.location || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>nearbyAttractions:</strong> {property.nearbyAttractions?.length || 0} items</div>
                <div><strong>whatToDoNearby:</strong> {property.whatToDoNearby?.length || 0} items</div>
                <div><strong>gettingHereIntro:</strong> {property.gettingHereIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>postcode:</strong> {property.postcode || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>directions:</strong> {property.directions ? '✓' : <span className="text-red-500">(empty)</span>}</div>
                <div><strong>ferryInfo:</strong> {property.ferryInfo ? '✓' : <span className="text-red-500">(empty)</span>}</div>
                <div><strong>airportDistance:</strong> {property.airportDistance || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>portDistance:</strong> {property.portDistance || <span className="text-red-500">(empty)</span>}</div>
              </div>
            </div>

            {/* Policies Group */}
            <div className="bg-[#F3F1E7] p-4 rounded">
              <h3 className="font-serif text-xl text-harbour-stone mb-3">Policies Group</h3>
              <div className="space-y-2 text-harbour-stone">
                <div><strong>petFriendly:</strong> {property.petFriendly !== undefined ? String(property.petFriendly) : <span className="text-red-500">(empty)</span>}</div>
                <div><strong>petPolicyIntro:</strong> {property.petPolicyIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>petPolicyDetails:</strong> {property.petPolicyDetails?.length || 0} items</div>
                <div><strong>policiesIntro:</strong> {property.policiesIntro || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>checkInTime:</strong> {property.checkInTime || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>checkOutTime:</strong> {property.checkOutTime || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>minimumStay:</strong> {property.minimumStay || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>cancellationPolicy:</strong> {property.cancellationPolicy ? '✓' : <span className="text-red-500">(empty)</span>}</div>
                <div><strong>paymentTerms:</strong> {property.paymentTerms ? '✓' : <span className="text-red-500">(empty)</span>}</div>
                <div><strong>securityDeposit:</strong> {property.securityDeposit || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>licensingInfo:</strong> {property.licensingInfo || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>importantInfo:</strong> {property.importantInfo?.length || 0} items</div>
                <div><strong>dailyRate:</strong> {property.dailyRate || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>weeklyRate:</strong> {property.weeklyRate || <span className="text-red-500">(empty)</span>}</div>
              </div>
            </div>

            {/* Lodgify Group */}
            <div className="bg-[#F3F1E7] p-4 rounded">
              <h3 className="font-serif text-xl text-harbour-stone mb-3">Lodgify Integration</h3>
              <div className="space-y-2 text-harbour-stone">
                <div><strong>lodgifyPropertyId:</strong> {property.lodgifyPropertyId || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>lodgifyRoomId:</strong> {property.lodgifyRoomId || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>icsUrl:</strong> {property.icsUrl ? '✓' : <span className="text-red-500">(empty)</span>}</div>
              </div>
            </div>

            {/* SEO Group */}
            <div className="bg-[#F3F1E7] p-4 rounded">
              <h3 className="font-serif text-xl text-harbour-stone mb-3">SEO Group</h3>
              <div className="space-y-2 text-harbour-stone">
                <div><strong>seoTitle:</strong> {property.seoTitle || <span className="text-red-500">(empty)</span>}</div>
                <div><strong>seoDescription:</strong> {property.seoDescription ? '✓' : <span className="text-red-500">(empty)</span>}</div>
              </div>
            </div>

          </div>

          {/* Raw JSON Debug */}
          <details className="mt-6 font-mono text-xs text-harbour-stone">
            <summary className="cursor-pointer mb-4">Raw JSON (Click to expand)</summary>
            <pre className="bg-[#F3F1E7] p-4 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(property, null, 2)}
            </pre>
          </details>
        </section>
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
    title: property.seoTitle || property.name,
    description: property.seoDescription || property.description || property.overviewIntro,
    openGraph: {
      title: property.seoTitle || property.name,
      description: property.seoDescription || property.description || property.overviewIntro,
      images: property.heroImage ? [urlFor(property.heroImage).width(1200).height(630).url()] : [],
    },
  };
}
