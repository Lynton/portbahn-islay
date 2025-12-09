import Image from 'next/image';
import Link from 'next/link';

// Property data - matching homepage
const properties = {
  'portbahn-house': {
    name: 'Portbahn House',
    location: 'East coast views',
    sleeps: 8,
    bedrooms: 4,
    description: 'Spacious family house with stunning views across the Sound of Islay. Perfect for larger groups seeking comfort and tranquility. This beautifully appointed property offers modern amenities while maintaining the authentic character of Islay.',
    features: [
      'WiFi throughout',
      'Wood-burning stove',
      'Fully equipped kitchen',
      'Dining area for 8',
      'Sea views from living room',
      'Private parking',
      'Garden with outdoor seating',
      'Washing machine and dryer',
    ],
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=960&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    ],
  },
  'shorefield-house': {
    name: 'Shorefield House',
    location: 'Port Ellen',
    sleeps: 6,
    bedrooms: 3,
    description: 'Coastal retreat in the heart of Port Ellen. Modern amenities meet traditional Scottish charm in this beautifully restored property.',
    features: [
      'WiFi throughout',
      'Wood-burning stove',
      'Fully equipped kitchen',
      'Dining area for 6',
      'Coastal views',
      'Private parking',
      'Garden',
      'Washing machine',
    ],
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=960&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    ],
  },
  'curlew-cottage': {
    name: 'Curlew Cottage',
    location: 'Village location',
    sleeps: 4,
    bedrooms: 2,
    description: 'Cosy cottage nestled in a quiet village setting. Ideal for couples or small families looking for a peaceful island escape.',
    features: [
      'WiFi throughout',
      'Wood-burning stove',
      'Fully equipped kitchen',
      'Dining area for 4',
      'Village location',
      'Private parking',
      'Small garden',
      'Washing machine',
    ],
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=960&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    ],
  },
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = properties[slug as keyof typeof properties];

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

  return (
    <main className="min-h-screen bg-sea-spray">
      {/* Hero Image */}
      <div className="w-full h-[60vh] relative overflow-hidden">
        <Image
          src={property.heroImage}
          alt={property.name}
          fill
          className="object-cover"
          priority
        />
      </div>

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

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="font-serif text-3xl text-harbour-stone mb-4">Features</h2>
          <ul className="font-mono text-base text-harbour-stone space-y-2">
            {property.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </section>

        {/* Image Gallery Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-2 gap-4">
            {property.galleryImages.map((imageUrl, index) => (
              <div key={index} className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={`${property.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Book Now Button */}
        <div className="mb-12">
          <Link
            href="#"
            className="inline-block font-mono text-base text-sea-spray bg-emerald-accent px-8 py-4 transition-colors hover:bg-opacity-90"
          >
            Book Now
          </Link>
        </div>
      </div>
    </main>
  );
}

