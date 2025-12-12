import PropertyCard from '@/components/PropertyCard';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

async function getProperties() {
  const query = `*[_type == "property"]{
    _id,
    name,
    slug,
    location,
    description,
    sleeps,
    bedrooms,
    mainImage
  }`;
  
  return await client.fetch(query);
}

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen bg-sea-spray">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="font-serif text-6xl mb-4">
          Portbahn Islay
        </h1>
        <p className="font-mono text-base text-harbour-stone mb-12">
          Self-catering accommodation on the Isle of Islay
        </p>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property: any) => (
              <PropertyCard
                key={property._id}
                name={property.name}
                location={property.location}
                description={property.description}
                sleeps={property.sleeps}
                bedrooms={property.bedrooms}
                imageUrl={urlFor(property.mainImage).width(800).height(1200).url()}
                href={`/properties/${property.slug.current}`}
              />
            ))}
          </section>
        ) : (
          <p className="font-mono text-base text-harbour-stone">
            No properties available at this time.
          </p>
        )}
      </div>
    </main>
  );
}
