// app/api/lodgify-debug/route.ts
// Diagnostic endpoint to inspect Lodgify API responses

import { NextResponse } from 'next/server';

const LODGIFY_API_KEY = process.env.LODGIFY_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('propertyId');

  if (!propertyId) {
    return NextResponse.json({ error: 'propertyId required' }, { status: 400 });
  }

  if (!LODGIFY_API_KEY) {
    return NextResponse.json({ error: 'LODGIFY_API_KEY not configured' }, { status: 500 });
  }

  try {
    console.log(`[lodgify-debug] Fetching property ${propertyId}`);

    // Try the properties endpoint
    const propertiesUrl = `https://api.lodgify.com/v2/properties/${propertyId}`;
    const propertiesRes = await fetch(propertiesUrl, {
      headers: {
        'X-ApiKey': LODGIFY_API_KEY,
      },
    });

    const propertiesData = await propertiesRes.json();
    console.log('[lodgify-debug] Properties endpoint response:', JSON.stringify(propertiesData, null, 2));

    // Try the availability endpoint
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const availUrl = `https://api.lodgify.com/v2/availability/${propertyId}?periodStart=${today}&periodEnd=${nextMonth}`;
    
    const availRes = await fetch(availUrl, {
      headers: {
        'X-ApiKey': LODGIFY_API_KEY,
      },
    });

    const availData = await availRes.json();
    console.log('[lodgify-debug] Availability endpoint response:', JSON.stringify(availData, null, 2));

    return NextResponse.json({
      propertyId,
      propertiesEndpoint: {
        url: propertiesUrl,
        status: propertiesRes.status,
        data: propertiesData,
      },
      availabilityEndpoint: {
        url: availUrl,
        status: availRes.status,
        data: availData,
      },
      analysis: {
        hasRoomTypes: Array.isArray(propertiesData?.room_types),
        roomTypeCount: propertiesData?.room_types?.length || 0,
        roomTypes: propertiesData?.room_types?.map((rt: any) => ({
          id: rt.id,
          name: rt.name,
          maxGuests: rt.max_guests || rt.maxGuests || rt.people || rt.occupancy || rt.max_occupancy,
          allFields: Object.keys(rt),
        })),
        propertyMaxGuests: propertiesData?.max_guests || propertiesData?.people,
        availabilityMaxGuests: availData?.[0]?.max_guests || availData?.[0]?.people,
      },
    });

  } catch (error: any) {
    console.error('[lodgify-debug] Error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
