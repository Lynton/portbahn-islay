import { NextRequest, NextResponse } from 'next/server';
import { lodgifyProperties, LODGIFY_WEBSITE_ID, LODGIFY_API_BASE } from '@/lib/lodgify-config';
import { format, addDays, startOfDay, isBefore } from 'date-fns';
import ICAL from 'ical.js';
import { client } from '@/sanity/lib/client';

const MINIMUM_STAY_NIGHTS = 2;

interface QuoteRequest {
  property: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
}

interface QuoteResponse {
  property: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  valid: boolean;
  error?: string;
  total?: number;
  currency?: string;
  breakdown?: {
    nightlyRate: number;
    nights: number;
    subtotal: number;
    fees?: number;
    total: number;
  };
}

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

async function fetchRates(
  propertyId: number,
  roomTypeId: number,
  checkIn: string,
  checkOut: string,
  guests: number = 1
): Promise<any> {
  const apiKey = process.env.LODGIFY_API_KEY;
  
  if (!apiKey) {
    throw new Error('LODGIFY_API_KEY is not configured');
  }

  // Construct URL with query parameters
  const url = new URL(`${LODGIFY_API_BASE}/rates/calendar`);
  url.searchParams.set('HouseId', propertyId.toString());
  url.searchParams.set('RoomTypeId', roomTypeId.toString());
  url.searchParams.set('StartDate', checkIn);
  url.searchParams.set('EndDate', checkOut);
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-ApiKey': apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lodgify API error:', {
      url: url.toString(),
      status: response.status,
      statusText: response.statusText,
      errorText,
    });
    throw new Error(`Lodgify API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json();
    const { property: propertySlug, checkIn, checkOut, guests = 1 } = body;

    if (!propertySlug || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Property, checkIn, and checkOut are required' },
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

    // Fetch sleeps (max guests) from Sanity
    let maxSleeps: number | null = null;
    try {
      const query = `*[_type == "property" && lodgifyPropertyId == $propertyId][0]{
        sleeps
      }`;
      const propertyData = await client.fetch(query, { propertyId: property.propertyId });
      maxSleeps = propertyData?.sleeps || null;
    } catch (error) {
      console.error('[quote_preview] Error fetching sleeps from Sanity:', error);
      // Continue without max guests validation if fetch fails
    }

    // Validate guests count against sleeps from Sanity
    if (maxSleeps && guests > maxSleeps) {
      return NextResponse.json({
        property: propertySlug,
        checkIn,
        checkOut,
        nights: 0,
        valid: false,
        error: `Maximum ${maxSleeps} guests allowed for this property`,
      } as QuoteResponse);
    }

    // Validate dates
    const checkInDate = startOfDay(new Date(checkIn));
    const checkOutDate = startOfDay(new Date(checkOut));
    const today = startOfDay(new Date());

    if (isBefore(checkInDate, today)) {
      return NextResponse.json({
        property: propertySlug,
        checkIn,
        checkOut,
        nights: 0,
        valid: false,
        error: 'Check-in date cannot be in the past',
      } as QuoteResponse);
    }

    if (!isBefore(checkInDate, checkOutDate)) {
      return NextResponse.json({
        property: propertySlug,
        checkIn,
        checkOut,
        nights: 0,
        valid: false,
        error: 'Check-out date must be after check-in date',
      } as QuoteResponse);
    }

    const nights = calculateNights(checkIn, checkOut);

    // Validate minimum stay
    if (nights < MINIMUM_STAY_NIGHTS) {
      return NextResponse.json({
        property: propertySlug,
        checkIn,
        checkOut,
        nights,
        valid: false,
        error: `Minimum stay is ${MINIMUM_STAY_NIGHTS} nights`,
      } as QuoteResponse);
    }

    // Validate availability for all dates in the range by checking ICS feed
    // This prevents booking dates that are already reserved
    try {
      const icsUrl = property.icsUrl;
      
      // Fetch ICS feed
      const icsResponse = await fetch(icsUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'text/calendar',
        },
      });
      
      if (icsResponse.ok) {
        const icsData = await icsResponse.text();
        const jcalData = ICAL.parse(icsData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');
        
        // Build set of blocked dates
        const blockedDates = new Set<string>();
        for (const vevent of vevents) {
          const event = new ICAL.Event(vevent);
          const startDate = event.startDate.toJSDate();
          const endDate = event.endDate.toJSDate();
          
          // Mark all dates in the range as blocked
          let currentDate = new Date(startDate);
          while (currentDate < endDate) {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            blockedDates.add(dateStr);
            currentDate = addDays(currentDate, 1);
          }
        }
        
        // Check that all dates in the booking range are available
        let currentDate = new Date(checkInDate);
        while (currentDate < checkOutDate) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          
          if (blockedDates.has(dateStr)) {
            return NextResponse.json({
              property: propertySlug,
              checkIn,
              checkOut,
              nights,
              valid: false,
              error: `Date ${format(currentDate, 'MMM dd, yyyy')} is not available (already booked)`,
            } as QuoteResponse);
          }
          
          currentDate = addDays(currentDate, 1);
        }
      }
    } catch (availError) {
      console.error('Error checking availability:', availError);
      // Continue with quote even if availability check fails (don't block quote)
      // The frontend validation should catch this, but server-side is a backup
    }

    // Fetch rates from Lodgify API
    try {
      const ratesData = await fetchRates(
        property.propertyId,
        property.unitId, // This is RoomTypeId in Lodgify terms
        checkIn,
        checkOut,
        guests
      );

      // Parse the calendar_items structure
      const calendarItems = ratesData.calendar_items || [];
      
      if (calendarItems.length === 0) {
        return NextResponse.json({
          property: propertySlug,
          checkIn,
          checkOut,
          nights,
          valid: false,
          error: 'No pricing data available for the selected dates',
        } as QuoteResponse);
      }

      // Filter items between checkIn and checkOut (excluding checkOut date)
      const rateCheckIn = new Date(checkIn);
      const rateCheckOut = new Date(checkOut);

      const relevantItems = calendarItems.filter((item: any) => {
        const itemDate = new Date(item.date);
        return itemDate >= rateCheckIn && itemDate < rateCheckOut;
      });

      if (relevantItems.length === 0) {
        return NextResponse.json({
          property: propertySlug,
          checkIn,
          checkOut,
          nights,
          valid: false,
          error: 'No pricing data found for the selected date range',
        } as QuoteResponse);
      }

      // Extract prices and calculate total
      let total = 0;
      const dailyRates: number[] = [];

      for (const item of relevantItems) {
        const prices = item.prices || [];
        if (prices.length > 0) {
          // Use the first price entry (usually the default/min_stay option)
          const pricePerDay = prices[0].price_per_day || 0;
          total += pricePerDay;
          dailyRates.push(pricePerDay);
        }
      }

      // Calculate average nightly rate
      const averageNightlyRate = dailyRates.length > 0 
        ? total / dailyRates.length 
        : 0;

      // Extract currency and fees from rate_settings if available
      const rateSettings = ratesData.rate_settings || {};
      const currency = rateSettings.currency_code || 'GBP';
      
      // Calculate fees (cleaning fee, guest fees, etc.)
      const fees = rateSettings.fees || [];
      let cleaningFee = 0;
      let guestFee = 0;
      let additionalGuestFee = 0;
      
      for (const fee of fees) {
        if (fee.fee_type === 'CleaningFee' && fee.price) {
          cleaningFee = fee.price.amount || 0;
        }
        // Check for guest-related fees
        if (fee.fee_type === 'GuestFee' || fee.fee_type === 'AdditionalGuestFee') {
          const feeAmount = fee.price?.amount || fee.amount || 0;
          // Some fees might be per guest, some might be per additional guest
          if (fee.fee_type === 'GuestFee') {
            guestFee = feeAmount;
          } else {
            additionalGuestFee = feeAmount;
          }
        }
      }
      
      // Calculate guest-related fees
      // Check if there's a base guest count and charge for additional guests
      const baseGuests = rateSettings.base_guests || 1;
      const additionalGuests = Math.max(0, guests - baseGuests);
      const totalGuestFees = guestFee * guests + (additionalGuestFee * additionalGuests);

      const subtotal = total;
      const totalWithFees = subtotal + cleaningFee + totalGuestFees;

      const response: QuoteResponse = {
        property: propertySlug,
        checkIn,
        checkOut,
        nights,
        valid: true,
        total: totalWithFees,
        currency,
        breakdown: {
          nightlyRate: averageNightlyRate,
          nights,
          subtotal,
          fees: cleaningFee + totalGuestFees,
          total: totalWithFees,
        },
      };
      
      // Add guest fee details if applicable
      if (totalGuestFees > 0) {
        (response as any).guestFees = {
          baseGuests,
          guests,
          additionalGuests,
          guestFee,
          additionalGuestFee,
          totalGuestFees,
        };
      }

      return NextResponse.json(response);
    } catch (apiError: any) {
      console.error('Lodgify API error:', apiError);
      return NextResponse.json({
        property: propertySlug,
        checkIn,
        checkOut,
        nights,
        valid: false,
        error: apiError.message || 'Failed to fetch pricing information',
      } as QuoteResponse);
    }
  } catch (error: any) {
    console.error('Error in quote_preview endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process quote request' },
      { status: 500 }
    );
  }
}

