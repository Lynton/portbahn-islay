import { NextRequest, NextResponse } from 'next/server';
import { lodgifyProperties } from '@/lib/lodgify-config';

async function fetchPropertyDetails(propertyId: number): Promise<any> {
  const apiKey = process.env.LODGIFY_API_KEY;
  
  if (!apiKey) {
    throw new Error('LODGIFY_API_KEY is not configured');
  }

  const url = `https://api.lodgify.com/v1/properties/${propertyId}`;
  
  console.log('Fetching property details from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-ApiKey': apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lodgify API error:', {
      url,
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(`Lodgify API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

async function fetchRatesCalendar(
  propertyId: number,
  roomTypeId: number,
  startDate: string = '2026-01-01',
  endDate: string = '2026-12-31'
): Promise<any> {
  const apiKey = process.env.LODGIFY_API_KEY;
  
  if (!apiKey) {
    throw new Error('LODGIFY_API_KEY is not configured');
  }

  const url = new URL('https://api.lodgify.com/v2/rates/calendar');
  url.searchParams.set('HouseId', propertyId.toString());
  url.searchParams.set('RoomTypeId', roomTypeId.toString());
  url.searchParams.set('StartDate', startDate);
  url.searchParams.set('EndDate', endDate);
  
  console.log('Fetching rates calendar from:', url.toString());
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-ApiKey': apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lodgify Rates API error:', {
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(`Lodgify Rates API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.LODGIFY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'LODGIFY_API_KEY is not configured in .env.local' },
        { status: 500 }
      );
    }

    const results: Record<string, any> = {};

    // Fetch details for each property
    for (const [slug, property] of Object.entries(lodgifyProperties)) {
      try {
        console.log(`Fetching details for ${property.name} (ID: ${property.propertyId})`);
        const details = await fetchPropertyDetails(property.propertyId);
        
        // Also fetch rates calendar to check if pricing is configured
        let ratesData = null;
        let ratesError = null;
        try {
          ratesData = await fetchRatesCalendar(
            property.propertyId,
            property.unitId,
            '2026-01-01',
            '2026-12-31'
          );
        } catch (error: any) {
          ratesError = error.message || 'Failed to fetch rates calendar';
          console.error(`Rates fetch error for ${property.name}:`, error);
        }
        
        results[slug] = {
          configured: {
            name: property.name,
            propertyId: property.propertyId,
            unitId: property.unitId,
            slug: property.slug,
          },
          lodgify: {
            propertyId: details.id || details.propertyId,
            name: details.name,
            roomTypes: details.roomTypes || details.room_types || [],
            // Include other relevant fields from Lodgify response
            ...details,
          },
          rates: ratesData ? {
            hasPricing: true,
            dateRange: '2026-01-01 to 2026-12-31',
            dataPoints: Array.isArray(ratesData) ? ratesData.length : Object.keys(ratesData || {}).length,
            sample: Array.isArray(ratesData) ? ratesData.slice(0, 5) : ratesData,
          } : {
            hasPricing: false,
            error: ratesError || 'No rates data available',
          },
        };
      } catch (error: any) {
        results[slug] = {
          configured: {
            name: property.name,
            propertyId: property.propertyId,
            unitId: property.unitId,
            slug: property.slug,
          },
          error: error.message || 'Failed to fetch property details',
        };
      }
    }

    return NextResponse.json({
      success: true,
      properties: results,
      notes: [
        'Check roomTypes array to verify RoomTypeId values match configured unitId',
        'Check rates.hasPricing to verify if pricing is configured for 2026',
      ],
    });
  } catch (error: any) {
    console.error('Error in test-lodgify endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test Lodgify configuration',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

