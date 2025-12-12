'use client';

import { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { enGB } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { format, differenceInDays } from 'date-fns';

registerLocale('enGB', enGB);

interface BookingCalendarProps {
  propertySlug: string;
  propertyId: number;
  propertyName: string;
}

interface AvailabilityData {
  property: string;
  startDate: string;
  endDate: string;
  dates: Array<{
    date: string;
    available: boolean;
  }>;
}

interface QuoteData {
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

export default function BookingCalendar({
  propertySlug,
  propertyId,
  propertyName,
}: BookingCalendarProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [guests, setGuests] = useState(2);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Fetch availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const start = '2026-01-01';
        const end = '2026-06-30';
        const response = await fetch(
          `/api/avail_ics?property=${propertySlug}&start=${start}&end=${end}`
        );
        const data = await response.json();
        setAvailability(data);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [propertySlug]);

  // Get blocked dates from availability data
  const getBlockedDates = (): Date[] => {
    if (!availability) return [];
    
    return availability.dates
      .filter((item) => !item.available)
      .map((item) => new Date(item.date));
  };

  // Check if date is available
  const isDateAvailable = (date: Date): boolean => {
    if (!availability) return true;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dateItem = availability.dates.find((d) => d.date === dateStr);
    return dateItem ? dateItem.available : true;
  };

  // Handle date selection
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // If both dates are selected, open modal and fetch quote
    if (start && end) {
      setShowModal(true);
      fetchQuote(start, end, guests);
    }
  };

  // Fetch quote from API
  const fetchQuote = async (checkIn: Date, checkOut: Date, numGuests: number) => {
    setQuoteLoading(true);
    try {
      const checkInStr = format(checkIn, 'yyyy-MM-dd');
      const checkOutStr = format(checkOut, 'yyyy-MM-dd');

      const response = await fetch('/api/quote_preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property: propertySlug,
          checkIn: checkInStr,
          checkOut: checkOutStr,
          guests: numGuests,
        }),
      });

      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote({
        property: propertySlug,
        checkIn: format(checkIn, 'yyyy-MM-dd'),
        checkOut: format(checkOut, 'yyyy-MM-dd'),
        nights: differenceInDays(checkOut, checkIn),
        valid: false,
        error: 'Failed to fetch pricing information',
      });
    } finally {
      setQuoteLoading(false);
    }
  };

  // Handle guest count change
  const handleGuestsChange = (newGuests: number) => {
    if (newGuests < 1) return;
    setGuests(newGuests);
    if (startDate && endDate) {
      fetchQuote(startDate, endDate, newGuests);
    }
  };

  // Build Lodgify checkout URL
  const getCheckoutUrl = (): string => {
    if (!startDate || !endDate) return '';
    
    const arrival = format(startDate, 'yyyy-MM-dd');
    const departure = format(endDate, 'yyyy-MM-dd');
    
    return `https://checkout.lodgify.com/portbahnislay/${propertyId}/reservation?currency=GBP&arrival=${arrival}&departure=${departure}&adults=${guests}`;
  };

  // Calculate nights
  const calculateNights = (): number => {
    if (!startDate || !endDate) return 0;
    return differenceInDays(endDate, startDate);
  };

  if (loading) {
    return (
      <div className="font-mono text-base text-harbour-stone">
        Loading availability...
      </div>
    );
  }

  return (
    <>
      <div className="border border-washed-timber p-6">
        <h3 className="font-serif text-2xl text-harbour-stone mb-4">
          Book {propertyName}
        </h3>
        
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          minDate={new Date('2026-01-01')}
          maxDate={new Date('2026-06-30')}
          excludeDates={getBlockedDates()}
          filterDate={(date) => isDateAvailable(date)}
          inline
          locale="enGB"
          className="font-mono"
          calendarClassName="font-mono"
        />
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-sea-spray border border-washed-timber p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-serif text-3xl text-harbour-stone">
                Booking Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="font-mono text-base text-harbour-stone hover:text-emerald-accent"
              >
                ×
              </button>
            </div>

            {startDate && endDate && (
              <>
                <div className="font-mono text-base text-harbour-stone mb-6 space-y-2">
                  <div>
                    <span className="opacity-60">Arrival:</span>{' '}
                    {format(startDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div>
                    <span className="opacity-60">Departure:</span>{' '}
                    {format(endDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div>
                    <span className="opacity-60">Nights:</span> {calculateNights()}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="font-mono text-sm text-harbour-stone mb-2 block">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => handleGuestsChange(parseInt(e.target.value) || 1)}
                    className="font-mono text-base border border-washed-timber px-4 py-2 w-full bg-sea-spray text-harbour-stone focus:outline-none focus:border-emerald-accent"
                  />
                </div>

                {quoteLoading ? (
                  <div className="font-mono text-base text-harbour-stone mb-6">
                    Calculating pricing...
                  </div>
                ) : quote && quote.valid ? (
                  <div className="mb-6">
                    <div className="font-mono text-base text-harbour-stone space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="opacity-60">Nightly Rate:</span>
                        <span>
                          {quote.currency || 'GBP'} £
                          {quote.breakdown?.nightlyRate.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">
                          {quote.breakdown?.nights || 0} nights:
                        </span>
                        <span>
                          {quote.currency || 'GBP'} £
                          {quote.breakdown?.subtotal.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      {quote.breakdown?.fees && quote.breakdown.fees > 0 && (
                        <div className="flex justify-between">
                          <span className="opacity-60">Cleaning Fee:</span>
                          <span>
                            {quote.currency || 'GBP'} £
                            {quote.breakdown.fees.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-washed-timber pt-2 mt-2">
                        <span className="font-semibold">Total:</span>
                        <span className="font-semibold">
                          {quote.currency || 'GBP'} £
                          {quote.breakdown?.total.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>

                    <a
                      href={getCheckoutUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center font-mono text-base text-sea-spray bg-emerald-accent px-8 py-4 transition-colors hover:bg-opacity-90"
                    >
                      Book Now
                    </a>
                  </div>
                ) : (
                  <div className="font-mono text-sm text-harbour-stone mb-6">
                    {quote?.error || 'Unable to calculate pricing'}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}



