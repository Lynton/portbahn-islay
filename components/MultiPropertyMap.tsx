import { client } from '@/sanity/lib/client';

async function getAllPropertiesWithLocation() {
  const query = `*[_type == "property"] | order(name asc){
    _id,
    name,
    slug,
    location,
    postcode,
    latitude,
    longitude,
  }`;
  
  return await client.fetch(query);
}

export default async function MultiPropertyMap() {
  const properties = await getAllPropertiesWithLocation();

  if (!properties || properties.length === 0) {
    return null;
  }

  // Build query for multiple locations
  // Google Maps embed can show multiple markers using the query parameter
  const locations = properties
    .map((prop: any) => {
      if (prop.latitude && prop.longitude) {
        return `${prop.latitude},${prop.longitude}`;
      }
      const addressParts = [
        prop.name,
        prop.postcode,
        prop.location,
        'Isle of Islay',
        'Scotland',
      ].filter(Boolean);
      return encodeURIComponent(addressParts.join(', '));
    })
    .join('|');

  // For multiple locations, we can use a search query or create a custom map
  // Using a simple approach: show the area with all properties
  const query = encodeURIComponent('Portbahn Islay accommodation, Bruichladdich, Isle of Islay, Scotland');
  
  // Alternative: Use a custom map URL with markers (requires API key for best results)
  const mapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    ? `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=55.7857,-6.3619&zoom=12&maptype=satellite`
    : `https://www.google.com/maps?q=${query}&t=k&output=embed`;

  return (
    <div className="w-full overflow-hidden rounded" style={{ height: '500px' }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title="Map showing all Portbahn Islay accommodation locations"
      />
    </div>
  );
}

