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
    location,
    description,
    sleeps,
    bedrooms,
    mainImage,
    images[],
    lodgifyPropertyId,
    lodgifyRoomId,
    icsUrl
  }`;
  
  return await client.fetch(query, { slug });
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
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

  return (
    <main className="min-h-screen bg-sea-spray">
      {/* Hero Image */}
      {property.mainImage && (
        <div className="w-full h-[60vh] relative overflow-hidden">
          <Image
            src={urlFor(property.mainImage).width(1600).height(960).url()}
            alt={property.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Property Name */}
        <h1 className="font-serif text-5xl text-harbour-stone mb-4">
          {property.name}
        </h1>

        {/* Location + Sleeps Info */}
        <div className="font-mono text-sm text-harbour-stone mb-8 space-y-1">
          <p>{property.location}</p>
          <p>Sleeps {property.sleeps} • {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</p>
        </div>

        {/* Description Section */}
        <section className="mb-12">
          <h2 className="font-serif text-3xl text-harbour-stone mb-4">Overview</h2>
          <p className="font-mono text-base text-harbour-stone leading-relaxed">
            {property.description}
          </p>
        </section>

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

        {/* Booking Calendar */}
        {property.lodgifyPropertyId && property.lodgifyRoomId && property.slug?.current && (
          <section className="mb-12">
            <BookingCalendar
              propertySlug={property.slug.current}
              propertyId={property.lodgifyPropertyId}
              propertyName={property.name}
            />
          </section>
        )}
      </div>
    </main>
  );
}

