'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, addMonths, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, isToday } from 'date-fns';

interface Property {
  slug: string;
  name: string;
  lodgifyPropertyId: number;
  lodgifyRoomId?: number;
  sleeps?: number; // Renamed from maxGuests to match Sanity schema
}

interface AvailabilityData {
  [propertySlug: string]: {
    [date: string]: 'available' | 'booked';
  };
}

interface DateSelection {
  checkIn: Date | null;
  checkOut: Date | null;
  property: Property | null;
}

export default function MultiPropertyCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthsToShow, setMonthsToShow] = useState<1 | 3>(1);
  const [availability, setAvailability] = useState<AvailabilityData>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<DateSelection>({
    checkIn: null,
    checkOut: null,
    property: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [guests, setGuests] = useState<number | string>(2); // Default to 2 guests, can be empty string
  const [guestsError, setGuestsError] = useState<string | null>(null);
  const [loadingMaxGuests, setLoadingMaxGuests] = useState(false);
  const [properties, setProperties] = useState<Property[]>([
    { slug: 'portbahn-house', name: 'Portbahn House', lodgifyPropertyId: 360238 },
    { slug: 'shorefield-house', name: 'Shorefield House', lodgifyPropertyId: 360241 },
    { slug: 'curlew-cottage', name: 'Curlew Cottage', lodgifyPropertyId: 629317 },
  ]);

  // Fetch property details including maxGuests
  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          // Map Sanity data to Property interface
          const props = data.map((p: any) => ({
            slug: p.slug?.current || p.slug,
            name: p.name,
            lodgifyPropertyId: p.lodgifyPropertyId,
            lodgifyRoomId: p.lodgifyRoomId,
            sleeps: p.sleeps, // Use sleeps to match Sanity schema
          }));
          setProperties(props);
          
          console.log('Properties loaded with sleeps:', props.map((p: Property) => ({
            name: p.name,
            sleeps: p.sleeps,
          })));
          
          // Set default guests to minimum of all properties or 2
          const validSleeps = props.map((p: Property) => p.sleeps).filter((g: number | undefined) => g && g > 0);
          const minGuests = validSleeps.length > 0 ? Math.min(...validSleeps as number[]) : 2;
          setGuests(Math.min(minGuests, 2)); // Default to 2 or less
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }
    fetchProperties();
  }, []);

  // Fetch availability data
  useEffect(() => {
    console.log('MultiPropertyCalendar useEffect triggered', {
      currentMonth: format(currentMonth, 'yyyy-MM-dd'),
      monthsToShow,
      timestamp: new Date().toISOString(),
    });
    fetchAvailability();
  }, [currentMonth, monthsToShow]);

  const fetchAvailability = async () => {
    console.log('fetchAvailability called', {
      currentMonth: format(currentMonth, 'yyyy-MM-dd'),
      monthsToShow,
    });
    setLoading(true);
    const availData: AvailabilityData = {};

    for (const property of properties) {
      const start = format(currentMonth, 'yyyy-MM-dd');
      const end = format(addMonths(currentMonth, monthsToShow), 'yyyy-MM-dd');

      console.log(`Fetching availability for ${property.name}`, {
        slug: property.slug,
        start,
        end,
        url: `/api/avail_ics?property=${property.slug}&start=${start}&end=${end}`,
      });

      try {
        const res = await fetch(
          `/api/avail_ics?property=${property.slug}&start=${start}&end=${end}`
        );
        
        console.log(`Response for ${property.name}:`, {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`API error for ${property.name}:`, {
            status: res.status,
            errorText,
          });
          continue;
        }

        const data = await res.json();
        console.log(`Data received for ${property.name}:`, {
          property: data.property,
          datesCount: data.dates?.length || 0,
          sampleDates: data.dates?.slice(0, 5) || [],
        });

        // Transform dates array into availability object
        if (data.dates && Array.isArray(data.dates)) {
          const propertyAvailability: { [date: string]: 'available' | 'booked' } = {};
          data.dates.forEach((item: { date: string; available: boolean }) => {
            propertyAvailability[item.date] = item.available ? 'available' : 'booked';
          });
          availData[property.slug] = propertyAvailability;
          console.log(`Processed availability for ${property.name}:`, {
            totalDates: Object.keys(propertyAvailability).length,
            availableCount: Object.values(propertyAvailability).filter(v => v === 'available').length,
            bookedCount: Object.values(propertyAvailability).filter(v => v === 'booked').length,
          });
        } else {
          console.warn(`No dates array found in response for ${property.name}`, data);
        }
      } catch (error) {
        console.error(`Error fetching availability for ${property.name}:`, error);
      }
    }

    console.log('Final availability data:', {
      properties: Object.keys(availData),
      totalDates: Object.values(availData).reduce((sum, prop) => sum + Object.keys(prop).length, 0),
    });

    setAvailability(availData);
    setLoading(false);
  };

  const handleDateClick = async (date: Date, property: Property, isAvailable: boolean) => {
    if (!isAvailable) return;

    setSelectedDate({
      checkIn: date,
      checkOut: null,
      property,
    });
    setShowModal(true);
    setQuote(null);
    setGuestsError(null); // Clear any previous errors
    // Reset guests to 2 when modal opens (or keep current if valid)
    if (typeof guests === 'string' || guests < 1) {
      setGuests(2);
    }

    // Fetch sleeps from Sanity when modal opens
    if (property.lodgifyPropertyId) {
      console.log('[handleDateClick] Fetching sleeps from Sanity for', property.name, {
        propertyId: property.lodgifyPropertyId,
        currentSleeps: property.sleeps,
      });
      setLoadingMaxGuests(true);
      try {
        const res = await fetch(`/api/properties?propertyId=${property.lodgifyPropertyId}`);
        if (res.ok) {
          const data = await res.json();
          console.log('[handleDateClick] Received sleeps data from Sanity:', {
            sleeps: data.sleeps,
            sleepsSource: data.sleepsSource,
            fullData: data,
          });
          const updatedProperty = {
            ...property,
            sleeps: data.sleeps,
            lodgifyRoomId: data.lodgifyRoomId || property.lodgifyRoomId,
          };
          // Update property in properties array
          setProperties(prev => prev.map(p => 
            p.slug === property.slug ? updatedProperty : p
          ));
          // Update selected property
          setSelectedDate(prev => ({
            ...prev,
            property: updatedProperty,
          }));
          console.log('[handleDateClick] Updated property with sleeps from Sanity:', updatedProperty.sleeps);
        } else {
          const errorText = await res.text();
          console.error('[handleDateClick] Failed to fetch sleeps from Sanity:', {
            status: res.status,
            error: errorText,
          });
        }
      } catch (error) {
        console.error('[handleDateClick] Error fetching property sleeps from Sanity:', error);
      } finally {
        setLoadingMaxGuests(false);
      }
    } else {
      console.log('[handleDateClick] Skipping sleeps fetch - missing lodgifyPropertyId:', {
        hasPropertyId: !!property.lodgifyPropertyId,
      });
    }
  };

  const validateDateRange = (checkIn: Date, checkOut: Date, propertySlug: string): string | null => {
    const today = startOfDay(new Date());
    
    // Check if check-in is in the past
    if (isBefore(startOfDay(checkIn), today)) {
      return 'Check-in date cannot be in the past';
    }

    // Check if check-out is before or equal to check-in
    if (!isBefore(startOfDay(checkIn), startOfDay(checkOut))) {
      return 'Check-out date must be after check-in date';
    }

    // Check minimum stay (2 nights)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    if (nights < 2) {
      return 'Minimum stay is 2 nights';
    }

    // Check that all dates in the range are available
    const propertyAvailability = availability[propertySlug] || {};
    const checkInDate = startOfDay(checkIn);
    const checkOutDate = startOfDay(checkOut);
    
    let currentDate = new Date(checkInDate);
    while (currentDate < checkOutDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const status = propertyAvailability[dateStr];
      
      if (status === 'booked' || status === undefined) {
        return `Date ${format(currentDate, 'MMM dd, yyyy')} is not available`;
      }
      
      currentDate = addDays(currentDate, 1);
    }

    return null;
  };

  const validateGuests = (guestsValue: number | string, property: Property | null, isLoading: boolean = false): string | null => {
    if (!property) return null;
    
    // Don't validate if still loading
    if (isLoading) {
      return null;
    }
    
    // Handle empty string
    if (guestsValue === '' || guestsValue === null || guestsValue === undefined) {
      return 'At least 1 guest required';
    }
    
    const numGuests = typeof guestsValue === 'string' ? parseInt(guestsValue, 10) : guestsValue;
    
    // Check if valid number
    if (isNaN(numGuests) || numGuests < 1) {
      return 'At least 1 guest required';
    }
    
    // Only validate max if sleeps is available
    if (property.sleeps !== null && property.sleeps !== undefined) {
      if (numGuests > property.sleeps) {
        return `Maximum ${property.sleeps} guests allowed for ${property.name}. Please reduce the number of guests.`;
      }
    }
    
    return null;
  };

  const handleDateRangeChange = async (checkIn: Date, checkOut: Date, guestsOverride?: number | string) => {
    if (!selectedDate.property) return;

    // Use override if provided, otherwise use state
    const guestsToUse = guestsOverride !== undefined ? guestsOverride : guests;
    const numGuests = typeof guestsToUse === 'string' ? parseInt(guestsToUse, 10) : guestsToUse;
    if (isNaN(numGuests) || numGuests < 1) {
      setSelectedDate({ ...selectedDate, checkIn, checkOut });
      return; // Don't fetch quote if guests is invalid
    }

    // Check max guests if sleeps is available
    if (selectedDate.property.sleeps && numGuests > selectedDate.property.sleeps) {
      setSelectedDate({ ...selectedDate, checkIn, checkOut });
      return; // Don't fetch quote if exceeds max
    }

    // Validate the date range
    const validationError = validateDateRange(checkIn, checkOut, selectedDate.property.slug);
    if (validationError) {
      setQuote({
        valid: false,
        error: validationError,
      });
      setSelectedDate({ ...selectedDate, checkIn, checkOut });
      return;
    }

    setSelectedDate({ ...selectedDate, checkIn, checkOut });
    setLoadingQuote(true);
    // Clear any previous invalid quote errors - we're fetching a fresh quote
    if (quote && !quote.valid) {
      setQuote(null);
    }

    try {
      const res = await fetch('/api/quote_preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: selectedDate.property.slug,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          guests: numGuests,
        }),
      });

      const data = await res.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote({
        valid: false,
        error: 'Failed to fetch quote. Please try again.',
      });
    } finally {
      setLoadingQuote(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedDate.checkIn || !selectedDate.checkOut || !selectedDate.property) return;

    // Validate guests first
    const numGuests = typeof guests === 'string' ? parseInt(guests, 10) : guests;
    const guestsError = validateGuests(guests, selectedDate.property);
    
    if (guestsError) {
      setGuestsError(guestsError);
      setQuote({
        valid: false,
        error: guestsError,
      });
      return;
    }
    
    // Clear any previous errors
    setGuestsError(null);

    // Final validation before redirecting
    const validationError = validateDateRange(
      selectedDate.checkIn,
      selectedDate.checkOut,
      selectedDate.property.slug
    );
    
    if (validationError) {
      setQuote({
        valid: false,
        error: validationError,
      });
      return;
    }

    // Ensure guests doesn't exceed max (should already be validated, but double-check)
    const finalGuests = Math.min(numGuests, selectedDate.property.sleeps || numGuests);

    const checkoutUrl = `https://checkout.lodgify.com/?arrival=${format(
      selectedDate.checkIn,
      'yyyy-MM-dd'
    )}&departure=${format(selectedDate.checkOut, 'yyyy-MM-dd')}&adults=${finalGuests}&propertyId=${selectedDate.property.lodgifyPropertyId}&language=en&currency=GBP`;

    console.log('Checkout URL:', checkoutUrl);

    window.location.href = checkoutUrl;
  };

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div key={format(monthDate, 'yyyy-MM')} className="mb-12">
        <h2 className="text-2xl font-serif mb-6">{format(monthDate, 'MMMM, yyyy')}</h2>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header row with day numbers */}
            <div className="flex border-b border-[#C8C6BF]">
              <div className="w-48 min-w-[192px] flex-shrink-0 p-4 font-mono text-sm font-semibold">Property</div>
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className="w-12 min-w-[48px] flex-shrink-0 h-12 p-2 text-center font-mono text-xs flex items-center justify-center"
                >
                  {format(day, 'dd')}
                </div>
              ))}
            </div>

            {/* Property rows */}
            {properties.map((property) => (
              <div key={property.slug} className="flex border-b border-[#E8E7D5]">
                <div className="w-48 min-w-[192px] flex-shrink-0 p-4 font-mono text-sm bg-[#FFFCF7]">
                  <Link 
                    href={`/properties/${property.slug}`}
                    className="hover:text-[#4F9EA9] transition-colors"
                  >
                    {property.name}
                  </Link>
                </div>
                {days.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const status = availability[property.slug]?.[dateStr] || 'available';
                  const isAvailable = status === 'available';
                  const isSelected =
                    selectedDate.checkIn &&
                    selectedDate.property?.slug === property.slug &&
                    isSameDay(day, selectedDate.checkIn);
                  const isCurrentDate = isToday(day);

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day, property, isAvailable)}
                      disabled={!isAvailable}
                      className={`
                        w-12 min-w-[48px] flex-shrink-0 h-12 p-2 text-center transition-colors flex items-center justify-center relative
                        ${isAvailable ? 'bg-white hover:bg-[#F3F1E7] cursor-pointer' : 'bg-[#f7d9d9] cursor-not-allowed'}
                        ${isSelected ? 'ring-2 ring-[#4F9EA9] ring-inset' : ''}
                        border-r border-[#F3F1E7]
                      `}
                      style={isCurrentDate ? { 
                        boxShadow: 'inset 0 0 0 2px #008060',
                      } : {}}
                    >
                      {isCurrentDate && (
                        <span className="absolute top-1 left-1 w-2 h-2 bg-[#008060] rounded-full z-10"></span>
                      )}
                      {!isAvailable && <span className="text-[#C45508] text-xs">—</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const months = Array.from({ length: monthsToShow }, (_, i) => addMonths(currentMonth, i));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <select
            value={format(currentMonth, 'yyyy-MM')}
            onChange={(e) => setCurrentMonth(new Date(e.target.value + '-01'))}
            className="px-4 py-2 border border-[#C8C6BF] rounded font-mono text-sm"
          >
            {Array.from({ length: 24 }, (_, i) => {
              const month = addMonths(new Date(), i);
              return (
                <option key={format(month, 'yyyy-MM')} value={format(month, 'yyyy-MM')}>
                  {format(month, 'MMMM yyyy')}
                </option>
              );
            })}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setMonthsToShow(1)}
              className={`px-4 py-2 font-mono text-sm border border-[#C8C6BF] rounded ${
                monthsToShow === 1 ? 'bg-[#312F32] text-white' : 'bg-white'
              }`}
            >
              1 Month
            </button>
            <button
              onClick={() => setMonthsToShow(3)}
              className={`px-4 py-2 font-mono text-sm border border-[#C8C6BF] rounded ${
                monthsToShow === 3 ? 'bg-[#312F32] text-white' : 'bg-white'
              }`}
            >
              3 Months
            </button>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="text-center py-12 font-mono text-[#C8C6BF]">Loading availability...</div>
      ) : (
        months.map((month) => renderMonth(month))
      )}

      {/* Booking modal */}
      {showModal && selectedDate.property && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-serif">{selectedDate.property.name}</h3>
                <p className="text-sm font-mono text-[#C8C6BF] mt-1">
                  {selectedDate.checkIn && format(selectedDate.checkIn, 'MMM dd, yyyy')}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl leading-none text-[#C8C6BF] hover:text-[#312F32]"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono mb-2">Check-in</label>
                <input
                  type="date"
                  value={selectedDate.checkIn ? format(selectedDate.checkIn, 'yyyy-MM-dd') : ''}
                  min={format(startOfDay(new Date()), 'yyyy-MM-dd')}
                  onChange={(e) => {
                    const newCheckIn = new Date(e.target.value);
                    setSelectedDate({ ...selectedDate, checkIn: newCheckIn, checkOut: null });
                    setQuote(null);
                  }}
                  className="w-full px-4 py-2 border border-[#C8C6BF] rounded font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-mono mb-2">Check-out (min 2 nights)</label>
                <input
                  type="date"
                  value={selectedDate.checkOut ? format(selectedDate.checkOut, 'yyyy-MM-dd') : ''}
                  min={
                    selectedDate.checkIn
                      ? format(addDays(selectedDate.checkIn, 2), 'yyyy-MM-dd')
                      : format(startOfDay(new Date()), 'yyyy-MM-dd')
                  }
                  disabled={!selectedDate.checkIn}
                  onChange={(e) => {
                    const newCheckOut = new Date(e.target.value);
                    handleDateRangeChange(selectedDate.checkIn!, newCheckOut);
                  }}
                  className="w-full px-4 py-2 border border-[#C8C6BF] rounded font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-mono mb-2">
                  Number of Guests
                  {loadingMaxGuests && (
                    <span className="text-[#C8C6BF] font-normal ml-2">
                      (checking availability...)
                    </span>
                  )}
                  {!loadingMaxGuests && selectedDate.property?.sleeps && (
                    <span className="text-[#C8C6BF] font-normal ml-2">
                      (max {selectedDate.property.sleeps})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={guests === '' ? '' : guests}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    
                    // Allow empty string
                    if (inputValue === '') {
                      setGuests('');
                      setGuestsError(null); // Clear error when user starts typing
                      // Clear quote if dates are selected (can't calculate without guests)
                      if (selectedDate.checkIn && selectedDate.checkOut) {
                        setQuote(null);
                      }
                      return;
                    }
                    
                    // Allow any number input (don't restrict)
                    const numValue = parseInt(inputValue, 10);
                    if (!isNaN(numValue)) {
                      setGuests(numValue);
                      setGuestsError(null); // Clear error when user types valid number
                      
                      // Only fetch quote if valid and dates are selected
                      if (numValue >= 1 && selectedDate.checkIn && selectedDate.checkOut) {
                        // Check if exceeds max (but don't block typing)
                        if (selectedDate.property?.sleeps && numValue > selectedDate.property.sleeps) {
                          // Don't fetch quote, but don't show error yet (wait for blur)
                          setQuote(null);
                        } else {
                          // Valid number, fetch quote immediately with new value
                          handleDateRangeChange(selectedDate.checkIn, selectedDate.checkOut, numValue);
                        }
                      } else {
                        setQuote(null);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const inputValue = e.target.value;
                    const numGuests = inputValue === '' ? NaN : parseInt(inputValue, 10);
                    
                    // Validate on blur
                    const error = validateGuests(guests, selectedDate.property, loadingMaxGuests);
                    
                    if (error) {
                      setGuestsError(error);
                      // Don't set quote error - only show guestsError to avoid duplicates
                      setQuote(null);
                      
                      // Auto-fix if possible
                      if (isNaN(numGuests) || numGuests < 1) {
                        setGuests(1);
                        // Re-fetch quote if dates are selected
                        if (selectedDate.checkIn && selectedDate.checkOut) {
                          handleDateRangeChange(selectedDate.checkIn, selectedDate.checkOut, 1);
                        }
                      } else if (selectedDate.property?.sleeps && numGuests > selectedDate.property.sleeps) {
                        // Don't auto-fix max - let user decide, but show error
                        // Don't fetch quote if exceeds max
                        setQuote(null);
                      }
                    } else {
                      // Clear error if valid
                      setGuestsError(null);
                      
                      // Ensure quote is fetched if dates are selected
                      if (selectedDate.checkIn && selectedDate.checkOut && !isNaN(numGuests) && numGuests >= 1) {
                        handleDateRangeChange(selectedDate.checkIn, selectedDate.checkOut, numGuests);
                      }
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded font-mono text-sm ${
                    guestsError
                      ? 'border-red-500 bg-red-50'
                      : 'border-[#C8C6BF]'
                  }`}
                />
                {guestsError && (
                  <p className="text-red-500 text-xs font-mono mt-1 font-semibold">
                    ⚠️ {guestsError}
                  </p>
                )}
              </div>

              {loadingQuote && (
                <div className="text-center py-4 font-mono text-sm text-[#C8C6BF]">
                  Loading price...
                </div>
              )}

              {quote && quote.valid && (
                <div className="bg-[#F3F1E7] p-4 rounded">
                  <div className="flex justify-between font-mono text-sm mb-2">
                    <span>Nightly rate</span>
                    <span>£{quote.breakdown?.nightlyRate?.toFixed(2) || '0.00'}</span>
                  </div>
                  {quote.breakdown?.fees && quote.breakdown.fees > 0 && (
                    <>
                      {quote.guestFees && quote.guestFees.totalGuestFees > 0 && (
                        <div className="flex justify-between font-mono text-xs text-[#C8C6BF] mb-1">
                          <span>
                            Guest fees ({quote.guestFees.guests} {quote.guestFees.guests === 1 ? 'guest' : 'guests'}
                            {quote.guestFees.additionalGuests > 0 && `, +${quote.guestFees.additionalGuests} additional`})
                          </span>
                          <span>£{quote.guestFees.totalGuestFees.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-mono text-sm mb-2">
                        <span>Fees</span>
                        <span>£{quote.breakdown.fees.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-mono font-semibold">
                    <span>Total</span>
                    <span>£{quote.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              )}

              {quote && !quote.valid && !guestsError && (
                <div className="bg-[#f7d9d9] p-4 rounded text-sm font-mono text-[#C45508]">
                  {quote.error || 'Price unavailable. Please try different dates.'}
                </div>
              )}

              <button
                onClick={handleBookNow}
                disabled={
                  !selectedDate.checkIn || 
                  !selectedDate.checkOut || 
                  loadingQuote || 
                  guestsError !== null ||
                  (typeof guests === 'string' && guests === '') ||
                  (typeof guests === 'number' && guests < 1) ||
                  (quote !== null && !quote?.valid)
                }
                className="w-full bg-[#312F32] text-white py-3 rounded font-mono disabled:bg-[#C8C6BF] disabled:cursor-not-allowed hover:bg-[#4F9EA9] transition-colors"
              >
                {loadingQuote ? 'Loading...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
