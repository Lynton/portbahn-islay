import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import PropertyCalendar from '@/components/PropertyCalendar';
import SchemaMarkup from '@/components/SchemaMarkup';
import Breadcrumbs from '@/components/Breadcrumbs';
import PropertyCard from '@/components/PropertyCard';
import GoogleMap from '@/components/GoogleMap';
import GoogleReviewsClient from '@/components/GoogleReviewsClient';
import PropertyHostTrustTransfer from '@/components/PropertyHostTrustTransfer';

// TypeScript types for AI-optimized fields
// (Types kept inline where used)

interface MagicMoment {
  moment: string;
  frequency?: string;
}

interface PerfectFor {
  guestType: string;
  why: string;
  reviewEvidence?: string;
}

interface HonestFriction {
  issue: string;
  context: string;
}

// (Types kept inline where used)

interface ReviewHighlight {
  quote: string;
  source: string;
  rating?: number;
}

// Cached fetches - dedupe calls between generateMetadata and page component
const getProperty = cache(async (slug: string) => {
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
    // Personality & Guest Experience
    propertyNickname,
    guestSuperlatives[],
    magicMoments[] {
      moment,
      frequency
    },
    perfectFor[] {
      guestType,
      why,
      reviewEvidence
    },
    honestFriction[] {
      issue,
      context
    },
    ownerContext,
    // Reviews & Social Proof
    reviewScores {
      airbnbScore,
      airbnbCount,
      airbnbBadges[],
      bookingScore,
      bookingCount,
      bookingCategory,
      googleScore,
      googleCount
    },
    reviewThemes[],
    reviewHighlights[] {
      quote,
      source,
      rating
    },
    totalReviewCount,
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
    licensingStatus,
    licenseNumber,
    licenseNotes,
    availabilityStatus,
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
});

const getAllProperties = cache(async (excludeSlug?: string) => {
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
});

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
        type={['Accommodation', 'Place', 'Product', 'BreadcrumbList']}
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

      {/* Two-column layout: main content + sticky calendar */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2">
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


        {/* Sleeping Arrangements */}
        {(property.sleepingIntro || property.bedroomDetails?.length || property.bathroomDetails?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Sleeping Arrangements</h2>
            {property.sleepingIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.sleepingIntro}</p>
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
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">What&apos;s Included</h2>
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

        {/* Trust Transfer - only shows for zero-review properties */}
        <PropertyHostTrustTransfer
          reviews={property.reviewHighlights || []}
          totalReviewCount={property.totalReviewCount || 0}
        />

        {/* Common Questions - natural language query matching */}
        {property.commonQuestions && property.commonQuestions.length > 0 && (
          <section id="common-questions" className="my-16 max-w-4xl">
            <h2 className="font-serif text-3xl text-harbour-stone mb-8">
              Common Questions About {property.name}
            </h2>
            <div className="space-y-8">
              {property.commonQuestions.map((qa: { question: string; answer: string }, index: number) => (
                <div
                  key={index}
                  className="border-l-4 border-emerald-accent pl-6 py-2"
                >
                  <h3 className="font-serif text-xl text-harbour-stone mb-3">
                    {qa.question}
                  </h3>
                  <p className="font-mono text-base text-harbour-stone leading-relaxed">
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Cross-links to other property FAQs */}
            {property.faqCrossLinks && property.faqCrossLinks.length > 0 && (
              <div className="mt-8 pt-6 border-t border-washed-timber">
                <p className="font-mono text-sm text-harbour-stone/70">
                  {property.faqCrossLinks.map((link: { text: string; property: { slug: { current: string } } }, i: number) => (
                    <span key={i}>
                      {i > 0 && ' · '}
                      <Link
                        href={`/accommodation/${link.property?.slug?.current}#common-questions`}
                        className="text-emerald-accent hover:underline"
                      >
                        {link.text}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Personality & Guest Experience */}
        {(property.propertyNickname || property.guestSuperlatives?.length || property.magicMoments?.length || 
          property.perfectFor?.length || property.honestFriction?.length || property.ownerContext) && (
          <section className="mb-12 max-w-4xl">
            <h2 className="font-serif text-3xl text-harbour-stone mb-6">Guest Experience</h2>
            
            {/* Property Nickname */}
            {property.propertyNickname && (
              <p className="font-serif text-xl text-harbour-stone italic mb-6">
                {property.propertyNickname}
              </p>
            )}

            {/* Guest Superlatives */}
            {property.guestSuperlatives && property.guestSuperlatives.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-harbour-stone mb-4">What Guests Say</h3>
                <div className="space-y-3">
                  {property.guestSuperlatives.map((quote: string, i: number) => (
                    <p key={i} className="font-mono text-base text-harbour-stone italic border-l-4 border-emerald-accent pl-4 py-2">
                      &quot;{quote}&quot;
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Magic Moments */}
            {property.magicMoments && property.magicMoments.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-harbour-stone mb-4">Magic Moments</h3>
                <div className="space-y-4">
                  {property.magicMoments.map((moment: MagicMoment, i: number) => (
                    <div key={i} className="border-l-4 border-gray-300 pl-6 py-2">
                      <p className="font-mono text-base text-harbour-stone">{moment.moment}</p>
                      {moment.frequency && (
                        <p className="font-mono text-sm text-harbour-stone opacity-60 mt-1">{moment.frequency}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perfect For */}
            {property.perfectFor && property.perfectFor.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-harbour-stone mb-4">Perfect For</h3>
                <div className="space-y-6">
                  {property.perfectFor.map((item: PerfectFor, i: number) => (
                    <div key={i} className="border-l-4 border-emerald-accent pl-6 py-3">
                      <h4 className="font-serif text-lg text-harbour-stone mb-2">{item.guestType}</h4>
                      <p className="font-mono text-base text-harbour-stone mb-2">{item.why}</p>
                      {item.reviewEvidence && (
                        <p className="font-mono text-sm text-harbour-stone opacity-60">{item.reviewEvidence}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Honest Friction */}
            {property.honestFriction && property.honestFriction.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-harbour-stone mb-4">Things to Know</h3>
                <div className="space-y-4">
                  {property.honestFriction.map((friction: HonestFriction, i: number) => (
                    <div key={i} className="border-l-4 border-gray-400 pl-6 py-3 bg-gray-50">
                      <h4 className="font-serif text-lg text-harbour-stone mb-2">{friction.issue}</h4>
                      <p className="font-mono text-base text-harbour-stone">{friction.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Context */}
            {property.ownerContext && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-harbour-stone mb-4">About the Property</h3>
                <p className="font-mono text-base text-harbour-stone leading-relaxed whitespace-pre-line">
                  {property.ownerContext}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Reviews & Social Proof */}
        {(property.reviewScores || property.reviewThemes?.length || property.reviewHighlights?.length || property.totalReviewCount) && (
          <section className="mb-12 max-w-4xl">
            <h2 className="font-serif text-3xl text-harbour-stone mb-6">Guest Reviews</h2>
            
            {/* Review Scores */}
            {property.reviewScores && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-serif text-xl text-harbour-stone mb-4">Review Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {property.reviewScores.airbnbScore && (
                    <div>
                      <p className="font-mono text-sm text-harbour-stone opacity-60 mb-1">Airbnb</p>
                      <p className="font-serif text-3xl text-harbour-stone">
                        {property.reviewScores.airbnbScore.toFixed(1)}
                        <span className="text-lg">/5</span>
                      </p>
                      {property.reviewScores.airbnbCount && (
                        <p className="font-mono text-sm text-harbour-stone opacity-60 mt-1">
                          {property.reviewScores.airbnbCount} reviews
                        </p>
                      )}
                      {property.reviewScores.airbnbBadges && property.reviewScores.airbnbBadges.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {property.reviewScores.airbnbBadges.map((badge: string, i: number) => (
                            <span key={i} className="text-xs bg-emerald-accent text-white px-2 py-1 rounded">
                              {badge.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {property.reviewScores.bookingScore && (
                    <div>
                      <p className="font-mono text-sm text-harbour-stone opacity-60 mb-1">Booking.com</p>
                      <p className="font-serif text-3xl text-harbour-stone">
                        {property.reviewScores.bookingScore.toFixed(1)}
                        <span className="text-lg">/10</span>
                      </p>
                      {property.reviewScores.bookingCount && (
                        <p className="font-mono text-sm text-harbour-stone opacity-60 mt-1">
                          {property.reviewScores.bookingCount} reviews
                        </p>
                      )}
                      {property.reviewScores.bookingCategory && (
                        <p className="font-mono text-sm text-emerald-accent mt-1 capitalize">
                          {property.reviewScores.bookingCategory.replace(/-/g, ' ')}
                        </p>
                      )}
                    </div>
                  )}
                  {property.reviewScores.googleScore && (
                    <div>
                      <p className="font-mono text-sm text-harbour-stone opacity-60 mb-1">Google</p>
                      <p className="font-serif text-3xl text-harbour-stone">
                        {property.reviewScores.googleScore.toFixed(1)}
                        <span className="text-lg">/5</span>
                      </p>
                      {property.reviewScores.googleCount && (
                        <p className="font-mono text-sm text-harbour-stone opacity-60 mt-1">
                          {property.reviewScores.googleCount} reviews
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {property.totalReviewCount && (
                  <p className="font-mono text-base text-harbour-stone mt-4 pt-4 border-t border-gray-300">
                    <strong>Total Reviews:</strong> {property.totalReviewCount} across all platforms
                  </p>
                )}
              </div>
            )}

            {/* Review Themes */}
            {property.reviewThemes && property.reviewThemes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-harbour-stone mb-4">What Guests Love</h3>
                <div className="flex flex-wrap gap-2">
                  {property.reviewThemes.map((theme: string, i: number) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-emerald-accent text-white rounded-full font-mono text-sm"
                    >
                      {theme.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Review Highlights */}
            {property.reviewHighlights && property.reviewHighlights.length > 0 && (
              <div className="mb-8">
                <h3 className="font-serif text-xl text-harbour-stone mb-4">Review Highlights</h3>
                <div className="space-y-6">
                  {property.reviewHighlights.map((highlight: ReviewHighlight, i: number) => (
                    <div key={i} className="border-l-4 border-emerald-accent pl-6 py-3">
                      <p className="font-mono text-base text-harbour-stone italic mb-2">
                        &quot;{highlight.quote}&quot;
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-sm text-harbour-stone opacity-60">
                          — {highlight.source}
                        </p>
                        {highlight.rating && (
                          <span className="font-mono text-sm text-emerald-accent">
                            {highlight.rating}/5
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Google Reviews */}
        {(property.googleBusinessUrl || property.googlePlaceId) && (
          <GoogleReviewsClient
            googleBusinessUrl={property.googleBusinessUrl}
            googlePlaceId={property.googlePlaceId}
            propertyName={property.name}
          />
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
                <h3 className="font-serif text-xl text-harbour-stone mb-2">What&apos;s Nearby?</h3>
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

        {/* House Rules & Policies */}
        {(property.policiesIntro || property.checkInTime || property.checkOutTime || property.minimumStay ||
          property.cancellationPolicy || property.paymentTerms || property.securityDeposit ||
          property.licensingStatus || property.licenseNumber || property.licenseNotes || property.availabilityStatus || property.importantInfo?.length) && (
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
              {property.availabilityStatus && (
                <p className="mt-4">
                  <strong>Availability:</strong>{' '}
                  <span className={property.availabilityStatus === 'bookable' ? 'text-emerald-accent' : 'text-gray-600'}>
                    {property.availabilityStatus === 'bookable' && 'Bookable'}
                    {property.availabilityStatus === 'enquiries' && 'Enquiries Only'}
                    {property.availabilityStatus === 'coming-soon' && 'Coming Soon'}
                    {property.availabilityStatus === 'unavailable' && 'Unavailable'}
                  </span>
                </p>
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
              {(property.licensingStatus || property.licenseNumber) && (
                <div className="mt-4">
                  <h3 className="font-serif text-xl text-harbour-stone mb-2">Short Term Let License</h3>
                  {property.licensingStatus && (
                    <p>
                      <strong>Status:</strong>{' '}
                      {property.licensingStatus === 'approved' && 'Approved'}
                      {property.licensingStatus === 'pending-bookable' && 'Pending - Bookable'}
                      {property.licensingStatus === 'pending-enquiries' && 'Pending - Enquiries Only'}
                      {property.licensingStatus === 'coming-soon' && 'Coming Soon'}
                    </p>
                  )}
                  {property.licenseNumber && (
                    <p className="mt-2"><strong>License Number:</strong> {property.licenseNumber}</p>
                  )}
                  {property.licenseNotes && (
                    <p className="mt-2 font-mono text-sm text-harbour-stone opacity-75 whitespace-pre-line">
                      {property.licenseNotes}
                    </p>
                  )}
                </div>
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


        {/* Image Gallery Grid */}
        {galleryImages.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Gallery</h2>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((image: unknown, index: number) => (
                <div key={index} className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={urlFor(image as any).width(800).height(600).url()}
                    alt={(image as any)?.alt || `${property.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {(image as any)?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-sea-spray font-mono text-sm px-4 py-2">
                      {(image as any).caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other Accommodation */}
        {otherProperties.length > 0 && (
          <section className="mb-12 mt-16 pt-12 border-t-2 border-[#C8C6BF]">
            <h2 className="font-serif text-3xl text-harbour-stone mb-8">Our Other Accommodation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherProperties.map((otherProperty: unknown) => {
                const p = otherProperty as any;
                const imageUrl = p.heroImage
                  ? urlFor(p.heroImage).width(800).height(1200).url()
                  : '';

                return (
                  <PropertyCard
                    key={p._id}
                    name={p.name}
                    location={p.location}
                    description={p.description}
                    sleeps={p.sleeps}
                    bedrooms={p.bedrooms}
                    imageUrl={imageUrl}
                    href={`/accommodation/${p.slug?.current || p.slug}`}
                  />
                );
              })}
            </div>
          </section>
        )}
        {/* Explore Islay guides */}
        <section className="mb-12 mt-16 pt-12 border-t-2 border-[#C8C6BF]">
          <h2 className="font-serif text-3xl text-harbour-stone mb-6">Explore Islay</h2>
          <ul className="font-mono text-base space-y-3">
            <li>
              <Link href="/explore-islay/islay-distilleries" className="text-emerald-accent hover:underline">
                Islay&apos;s Whisky Distilleries — all 10, including Bruichladdich a 5-minute walk away
              </Link>
            </li>
            <li>
              <Link href="/explore-islay/islay-beaches" className="text-emerald-accent hover:underline">
                Beaches of Islay — Portbahn Beach, Machir Bay, Singing Sands and more
              </Link>
            </li>
            <li>
              <Link href="/explore-islay/islay-wildlife" className="text-emerald-accent hover:underline">
                Wildlife &amp; Nature — barnacle geese, eagles, seals, RSPB reserves
              </Link>
            </li>
            <li>
              <Link href="/explore-islay/food-and-drink" className="text-emerald-accent hover:underline">
                Food &amp; Drink on Islay — restaurants, distillery cafés, local seafood
              </Link>
            </li>
            <li>
              <Link href="/explore-islay/visit-jura" className="text-emerald-accent hover:underline">
                Visiting Jura — day trips and longer stays on Islay&apos;s wilder neighbour
              </Link>
            </li>
            <li>
              <Link href="/travel-to-islay" className="text-emerald-accent hover:underline">
                Getting to Islay — ferry from Kennacraig, flights from Glasgow
              </Link>
            </li>
          </ul>
        </section>

        </div>
        {/* End main content column */}

        {/* Sticky calendar sidebar */}
        <div className="lg:col-span-1">
          {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
            <PropertyCalendar
              propertySlug={property.slug.current}
              propertyId={property.lodgifyPropertyId}
              propertyName={property.name}
              sleeps={property.sleeps}
            />
          )}
        </div>
        {/* End calendar sidebar */}
      </div>
      {/* End grid */}
      </div>
      {/* End container */}
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
