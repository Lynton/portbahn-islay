'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, isToday } from 'date-fns';

interface PropertyCalendarProps {
  propertySlug: string;
  propertyId: number;
  propertyName: string;
  sleeps?: number;
}

interface AvailabilityData {
  [date: string]: 'available' | 'booked';
}

export default function PropertyCalendar({
  propertySlug,
  propertyId,
  propertyName,
  sleeps,
}: PropertyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthsToShow, setMonthsToShow] = useState<1 | 3>(1);
  const [availability, setAvailability] = useState<AvailabilityData>({});
  const [loading, setLoading] = useState(true);
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [guests, setGuests] = useState(2);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const start = format(currentMonth, 'yyyy-MM-dd');
      const end = format(addMonths(currentMonth, monthsToShow), 'yyyy-MM-dd');

      const res = await fetch(
        `/api/avail_ics?property=${propertySlug}&start=${start}&end=${end}`
      );

      if (!res.ok) {
        console.error(`API error for ${propertyName}:`, res.status);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.dates && Array.isArray(data.dates)) {
        const availData: AvailabilityData = {};
        data.dates.forEach((item: { date: string; available: boolean }) => {
          availData[item.date] = item.available ? 'available' : 'booked';
        });
        setAvailability(availData);
      }
    } catch (error) {
      console.error(`Error fetching availability for ${propertyName}:`, error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, monthsToShow, propertySlug, propertyName]);

  // Fetch availability data
  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleDateClick = (date: Date, isAvailable: boolean) => {
    if (!isAvailable) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      // Start new selection
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    } else {
      // Complete selection
      if (isBefore(date, selectedCheckIn)) {
        // Clicked earlier date, start over
        setSelectedCheckIn(date);
        setSelectedCheckOut(null);
      } else {
        // Valid check-out date
        setSelectedCheckOut(date);
        setShowModal(true);
      }
    }
  };

  const handleBooking = () => {
    if (!selectedCheckIn || !selectedCheckOut) return;

    const checkoutUrl = `https://checkout.lodgify.com/?arrival=${format(
      selectedCheckIn,
      'yyyy-MM-dd'
    )}&departure=${format(selectedCheckOut, 'yyyy-MM-dd')}&adults=${guests}&propertyId=${propertyId}&language=en&currency=GBP`;

    window.location.href = checkoutUrl;
  };

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div key={format(monthDate, 'yyyy-MM')} className="mb-8">
        <h3 className="text-xl font-serif mb-4 text-harbour-stone">
          {format(monthDate, 'MMMM yyyy')}
        </h3>

        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
            <div
              key={day}
              className="text-center font-mono text-xs text-harbour-stone/60 p-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Calendar days */}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const status = availability[dateStr] || 'available';
            const isAvailable = status === 'available';
            const isCheckIn = selectedCheckIn && isSameDay(day, selectedCheckIn);
            const isCheckOut = selectedCheckOut && isSameDay(day, selectedCheckOut);
            const isInRange =
              selectedCheckIn &&
              selectedCheckOut &&
              day > selectedCheckIn &&
              day < selectedCheckOut;
            const isCurrentDate = isToday(day);
            const isPast = isBefore(day, startOfDay(new Date()));

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day, isAvailable && !isPast)}
                disabled={!isAvailable || isPast}
                className={`
                  aspect-square p-2 text-center transition-colors relative
                  font-mono text-sm
                  ${isAvailable && !isPast ? 'bg-white hover:bg-machair-sand cursor-pointer' : 'bg-red-50 cursor-not-allowed'}
                  ${isCheckIn || isCheckOut ? 'ring-2 ring-emerald-accent ring-inset' : ''}
                  ${isInRange ? 'bg-emerald-accent/10' : ''}
                  ${isPast ? 'opacity-40' : ''}
                  border border-washed-timber
                `}
                style={
                  isCurrentDate
                    ? {
                        boxShadow: 'inset 0 0 0 2px #008060',
                      }
                    : {}
                }
              >
                {isCurrentDate && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-accent rounded-full"></span>
                )}
                <span className={isAvailable && !isPast ? 'text-harbour-stone' : 'text-red-400'}>
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const months = Array.from({ length: monthsToShow }, (_, i) => addMonths(currentMonth, i));

  return (
    <div className="bg-white border border-washed-timber rounded-lg p-6 sticky top-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-harbour-stone mb-2">
          Check Availability
        </h2>
        <p className="font-mono text-sm text-harbour-stone/70">
          {propertyName}
          {sleeps && <span className="ml-2">• Sleeps {sleeps}</span>}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <select
          value={format(currentMonth, 'yyyy-MM')}
          onChange={(e) => setCurrentMonth(new Date(e.target.value + '-01'))}
          className="px-4 py-2 border border-washed-timber rounded font-mono text-sm bg-white text-harbour-stone"
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
            className={`flex-1 px-4 py-2 font-mono text-sm border border-washed-timber rounded ${
              monthsToShow === 1 ? 'bg-harbour-stone text-sea-spray' : 'bg-white text-harbour-stone'
            }`}
          >
            1 Month
          </button>
          <button
            onClick={() => setMonthsToShow(3)}
            className={`flex-1 px-4 py-2 font-mono text-sm border border-washed-timber rounded ${
              monthsToShow === 3 ? 'bg-harbour-stone text-sea-spray' : 'bg-white text-harbour-stone'
            }`}
          >
            3 Months
          </button>
        </div>
      </div>

      {/* Calendar */}
      {loading ? (
        <div className="text-center py-12 font-mono text-sm text-harbour-stone/60">
          Loading availability...
        </div>
      ) : (
        <div className="space-y-6">
          {months.map((month) => renderMonth(month))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-washed-timber">
        <div className="flex items-center gap-4 font-mono text-xs text-harbour-stone/70">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-washed-timber"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-washed-timber"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && selectedCheckIn && selectedCheckOut && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-serif text-harbour-stone">{propertyName}</h3>
                <p className="text-sm font-mono text-harbour-stone/70 mt-1">
                  {format(selectedCheckIn, 'MMM dd')} - {format(selectedCheckOut, 'MMM dd, yyyy')}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-2xl leading-none text-harbour-stone/50 hover:text-harbour-stone"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <label className="block font-mono text-sm text-harbour-stone mb-2">
                Number of guests
              </label>
              <input
                type="number"
                min="1"
                max={sleeps || 10}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-washed-timber rounded font-mono text-sm"
              />
              {sleeps && (
                <p className="mt-1 font-mono text-xs text-harbour-stone/60">
                  Maximum {sleeps} guests
                </p>
              )}
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-emerald-accent text-white py-3 rounded font-mono text-sm hover:bg-emerald-accent/90 transition-colors"
            >
              Continue to Booking →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
