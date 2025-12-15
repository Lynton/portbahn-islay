import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import BookingCalendar from '@/components/BookingCalendar';

async function getProperty(slug: string) {
  const query = `*[_type == "property" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    propertyType,
    heroImage,
    mainImage,
    images[],
    overviewIntro,
    description,
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
    seoDescription
  }`;
  
  return await client.fetch(query, { slug });
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
  const heroImage = property.heroImage || property.mainImage;

  return (
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

        {/* Overview Intro */}
        {property.overviewIntro && (
          <p className="font-serif text-xl text-harbour-stone mb-6 italic">
            {property.overviewIntro}
          </p>
        )}

        {/* Description Section */}
        {property.description && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Overview</h2>
            <div className="font-mono text-base text-harbour-stone leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </section>
        )}

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

        {/* Location & Nearby */}
        {(property.locationIntro || property.nearbyAttractions?.length || property.whatToDoNearby?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Location & Nearby</h2>
            {property.locationIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.locationIntro}</p>
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
        {(property.gettingHereIntro || property.postcode || property.directions || 
          property.ferryInfo || property.airportDistance || property.portDistance) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Getting Here</h2>
            {property.gettingHereIntro && (
              <p className="font-mono text-base text-harbour-stone mb-4">{property.gettingHereIntro}</p>
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
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">Pet Policy</h2>
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
          property.licensingInfo || property.importantInfo?.length) && (
          <section className="mb-12">
            <h2 className="font-serif text-3xl text-harbour-stone mb-4">House Rules & Policies</h2>
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
            />
          </section>
        )}

        {/* Debug: Show all fields for preview */}
        <section className="mb-12 mt-12 pt-12 border-t border-[#C8C6BF]">
          <details className="font-mono text-xs text-harbour-stone">
            <summary className="cursor-pointer mb-4">Debug: All Fields (Click to expand)</summary>
            <pre className="bg-[#F3F1E7] p-4 rounded overflow-auto text-xs">
              {JSON.stringify(property, null, 2)}
            </pre>
          </details>
        </section>
      </div>
    </main>
  );
}
