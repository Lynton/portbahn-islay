interface GoogleMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  postcode?: string;
  location?: string;
  name?: string;
  height?: string;
  className?: string;
}

export default function GoogleMap({
  latitude,
  longitude,
  address,
  postcode,
  location,
  name,
  height = '450px',
  className = '',
}: GoogleMapProps) {
  // Build query string for Google Maps embed
  let query = '';
  
  if (latitude && longitude) {
    // Use coordinates if available (most accurate)
    query = `${latitude},${longitude}`;
  } else {
    // Fall back to address/postcode/location
    const addressParts = [
      name,
      address,
      postcode,
      location,
      'Isle of Islay',
      'Scotland',
    ].filter(Boolean);
    
    query = encodeURIComponent(addressParts.join(', '));
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${query}&zoom=15&maptype=satellite`;

  // If no API key, use a simple iframe with the search query (satellite view)
  const fallbackUrl = `https://www.google.com/maps?q=${query}&t=k&output=embed`;

  return (
    <div className={`w-full overflow-hidden rounded ${className}`} style={{ height }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? mapUrl : fallbackUrl}
        title={name ? `Map showing location of ${name}` : 'Property location map'}
      />
    </div>
  );
}

