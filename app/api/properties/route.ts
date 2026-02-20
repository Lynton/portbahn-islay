import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { lodgifyProperties } from '@/lib/lodgify-config';

async function fetchLodgifyMaxGuests(propertyId: number, roomTypeId: number): Promise<number | null> {
  try {
    const apiKey = process.env.LODGIFY_API_KEY;
    if (!apiKey) {
      console.warn('[fetchLodgifyMaxGuests] LODGIFY_API_KEY not configured');
      return null;
    }

    const url = `https://api.lodgify.com/v1/properties/${propertyId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-ApiKey': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[fetchLodgifyMaxGuests] Lodgify API error for property ${propertyId}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText.substring(0, 500),
      });
      return null;
    }

    const data = await response.json();

    // Check roomTypes array for the specific room type
    const roomTypes = data.roomTypes || data.room_types || [];
    
    const roomType = roomTypes.find((rt: any) =>
      rt.id === roomTypeId || rt.roomTypeId === roomTypeId || rt.room_type_id === roomTypeId
    );
    
    if (roomType) {
      // Try various possible fields for max guests
      const maxGuests = roomType.maxGuests || roomType.max_guests || roomType.capacity || roomType.maxCapacity || roomType.max_occupancy || roomType.occupancy || roomType.maxOccupancy || null;
      if (maxGuests) {
        return maxGuests;
      } else {
        console.warn(`[fetchLodgifyMaxGuests] Room type found but no maxGuests field available. Room type data:`, JSON.stringify(roomType, null, 2));
      }
    } else {
      console.warn(`[fetchLodgifyMaxGuests] Room type ${roomTypeId} not found. Available room types:`, roomTypes.map((rt: any) => ({
        id: rt.id,
        roomTypeId: rt.roomTypeId,
        room_type_id: rt.room_type_id,
        name: rt.name || rt.roomTypeName,
      })));
    }
    
    // Fallback to property-level capacity
    const propertyMaxGuests = data.maxGuests || data.max_guests || data.capacity || data.maxCapacity || data.max_occupancy || data.occupancy || data.maxOccupancy || null;
    if (propertyMaxGuests) {
      return propertyMaxGuests;
    }
    
    console.warn(`[fetchLodgifyMaxGuests] ❌ No maxGuests found in Lodgify for property ${propertyId}, roomType ${roomTypeId}. Full response keys:`, Object.keys(data));
    return null;
  } catch (error: any) {
    console.error('[fetchLodgifyMaxGuests] Error fetching Lodgify max guests:', {
      error: error.message,
      stack: error.stack,
    });
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const propertyId = searchParams.get('propertyId');

    if (slug) {
      // Fetch single property by slug
      const query = `*[_type == "property" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        sleeps,
        lodgifyPropertyId,
        lodgifyRoomId
      }`;
      
      const property = await client.fetch(query, { slug });
      
      if (!property) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }

      // Use sleeps from Sanity
      return NextResponse.json({
        ...property,
        sleeps: property.sleeps,
        sleepsSource: 'sanity',
      });
    } else if (propertyId) {
      // Fetch single property by lodgifyPropertyId
      const propertyIdNum = parseInt(propertyId, 10);
      const query = `*[_type == "property" && lodgifyPropertyId == $propertyId][0]`;
      const property = await client.fetch(query, { propertyId: propertyIdNum });
      
      if (!property) {
        console.warn('Property not found in Sanity for propertyId:', propertyIdNum);
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }

      // Use sleeps from Sanity
      return NextResponse.json({
        ...property,
        sleeps: property.sleeps,
        sleepsSource: 'sanity',
      });
    } else {
      // Fetch all properties
      const query = `*[_type == "property"]{
        _id,
        name,
        slug,
        sleeps,
        lodgifyPropertyId,
        lodgifyRoomId
      }`;
      
      const properties = await client.fetch(query);
      
      // Use sleeps from Sanity
      return NextResponse.json(
        properties.map((property: any) => ({
          ...property,
          sleeps: property.sleeps,
          sleepsSource: 'sanity',
        }))
      );
    }
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

