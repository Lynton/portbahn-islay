import { NextRequest, NextResponse } from 'next/server';
import ICAL from 'ical.js';
import { lodgifyProperties } from '@/lib/lodgify-config';

// 15-minute cache for ICS feeds
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const cache = new Map<string, { data: any; timestamp: number }>();

interface BookableDate {
  date: string;
  available: boolean;
}

async function fetchICSFeed(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/calendar',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.error('ICS fetch failed:', {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        errorText,
      });
      throw new Error(`Failed to fetch ICS feed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const icsData = await response.text();
    console.log('ICS feed fetched successfully:', {
      url,
      contentLength: icsData.length,
      firstChars: icsData.substring(0, 100),
    });

    return icsData;
  } catch (error: any) {
    console.error('Error in fetchICSFeed:', {
      url,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

function parseICSFeed(icsData: string): Set<string> {
  const blockedDates = new Set<string>();
  
  try {
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent);
      const startDate = event.startDate.toJSDate();
      const endDate = event.endDate.toJSDate();
      
      // Mark all dates in the range as blocked
      const currentDate = new Date(startDate);
      while (currentDate < endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        blockedDates.add(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  } catch (error) {
    console.error('Error parsing ICS feed:', error);
    throw error;
  }

  return blockedDates;
}

function generateDateGrid(startDate: Date, endDate: Date, blockedDates: Set<string>): BookableDate[] {
  const dates: BookableDate[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    dates.push({
      date: dateStr,
      available: !blockedDates.has(dateStr),
    });
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertySlug = searchParams.get('property');
    const startDateParam = searchParams.get('start');
    const endDateParam = searchParams.get('end');

    if (!propertySlug) {
      return NextResponse.json(
        { error: 'Property slug is required' },
        { status: 400 }
      );
    }

    const property = lodgifyProperties[propertySlug];
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Default to 6 months from now if no dates provided
    const startDate = startDateParam 
      ? new Date(startDateParam) 
      : new Date();
    const endDate = endDateParam 
      ? new Date(endDateParam) 
      : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // 6 months

    // Check cache
    const cacheKey = `${propertySlug}-${startDate.toISOString()}-${endDate.toISOString()}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=900', // 15 minutes
        },
      });
    }

    // Fetch and parse ICS feed
    const icsData = await fetchICSFeed(property.icsUrl);
    const blockedDates = parseICSFeed(icsData);
    
    // Generate date grid
    const dateGrid = generateDateGrid(startDate, endDate, blockedDates);

    const result = {
      property: propertySlug,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      dates: dateGrid,
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=900', // 15 minutes
      },
    });
  } catch (error) {
    console.error('Error in avail_ics endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability data' },
      { status: 500 }
    );
  }
}

