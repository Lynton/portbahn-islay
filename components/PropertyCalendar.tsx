'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isSameDay, isBefore, startOfDay, isToday,
  getDay,
} from 'date-fns';

interface PropertyCalendarProps {
  propertySlug: string;
  propertyId: number;
  propertyName: string;
  sleeps?: number;
  weeklyRate?: number | null;
  dailyRate?: number | null;
  minimumStay?: string | null;
}

interface AvailabilityData {
  [date: string]: 'available' | 'booked';
}

// ─── CALENDAR WIDGET ───────────────────────────────────────────────────────
export default function PropertyCalendar({
  propertySlug,
  propertyId,
  propertyName,
  sleeps,
  weeklyRate,
  dailyRate,
  minimumStay,
}: PropertyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
      const end = format(addMonths(currentMonth, 2), 'yyyy-MM-dd');
      const res = await fetch(
        `/api/avail_ics?property=${propertySlug}&start=${start}&end=${end}`
      );
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      if (data.dates && Array.isArray(data.dates)) {
        const availData: AvailabilityData = {};
        data.dates.forEach((item: { date: string; available: boolean }) => {
          availData[item.date] = item.available ? 'available' : 'booked';
        });
        setAvailability(availData);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [currentMonth, propertySlug]);

  useEffect(() => { fetchAvailability(); }, [fetchAvailability]);

  const handleDateClick = (date: Date, isAvailable: boolean) => {
    if (!isAvailable) return;
    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    } else {
      if (isBefore(date, selectedCheckIn)) {
        setSelectedCheckIn(date);
        setSelectedCheckOut(null);
      } else {
        setSelectedCheckOut(date);
        setShowModal(true);
      }
    }
  };

  const handleBooking = () => {
    if (!selectedCheckIn || !selectedCheckOut) return;
    window.location.href =
      `https://checkout.lodgify.com/?arrival=${format(selectedCheckIn, 'yyyy-MM-dd')}` +
      `&departure=${format(selectedCheckOut, 'yyyy-MM-dd')}&adults=${guests}` +
      `&propertyId=${propertyId}&language=en&currency=GBP`;
  };

  const displayRate = weeklyRate || (dailyRate ? dailyRate * 7 : null);
  const isPastNav = isBefore(startOfMonth(currentMonth), startOfMonth(new Date()));

  return (
    <div className="avail-widget">
      {/* Price header */}
      <div className="aw-header">
        <div style={{ paddingBottom: '14px' }}>
          {displayRate ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '4px' }}>
              <span className="aw-price-from">from</span>
              <span className="aw-price-num">£{displayRate.toLocaleString()}</span>
              <span className="aw-price-unit">/ week</span>
            </div>
          ) : null}
          {minimumStay && (
            <span className="aw-min-stay">{minimumStay}</span>
          )}
        </div>
      </div>

      {/* Month navigation */}
      <div className="aw-cal">
        <div className="aw-cal-nav">
          <button
            onClick={() => !isPastNav && setCurrentMonth(subMonths(currentMonth, 1))}
            disabled={isPastNav}
            aria-label="Previous month"
            style={{ opacity: isPastNav ? 0.2 : 1 }}
          >
            ‹
          </button>
          <span className="aw-month">{format(currentMonth, 'MMM yyyy').toUpperCase()}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="Next month">›</button>
        </div>

        {/* Day labels */}
        <div className="aw-day-labels">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div style={{
            padding: '24px 0', textAlign: 'center',
            fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px',
            color: 'var(--color-washed-timber)', letterSpacing: '0.08em',
          }}>
            Loading availability…
          </div>
        ) : (
          <CalendarGrid
            monthDate={currentMonth}
            availability={availability}
            selectedCheckIn={selectedCheckIn}
            selectedCheckOut={selectedCheckOut}
            onDateClick={handleDateClick}
          />
        )}
      </div>

      {/* Legend */}
      <div className="aw-legend">
        <span className="aw-leg aw-leg-a">Available</span>
        <span className="aw-leg aw-leg-x">Booked</span>
        <span className="aw-leg aw-leg-ci">Check-in</span>
      </div>

      {/* Primary CTA */}
      <a
        href={`https://checkout.lodgify.com/?propertyId=${propertyId}&language=en&currency=GBP`}
        className="aw-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        CHECK AVAILABILITY →
      </a>

      {/* Secondary link */}
      <div style={{ padding: '0 16px 16px', textAlign: 'center' }}>
        <Link
          href="/availability"
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '10px',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: 'var(--color-kelp-edge)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          View all property availability →
        </Link>
      </div>

      {/* Booking modal */}
      {showModal && selectedCheckIn && selectedCheckOut && (
        <BookingModal
          propertyName={propertyName}
          checkIn={selectedCheckIn}
          checkOut={selectedCheckOut}
          guests={guests}
          maxGuests={sleeps}
          onGuestsChange={setGuests}
          onConfirm={handleBooking}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ─── CALENDAR GRID ─────────────────────────────────────────────────────────
export function CalendarGrid({
  monthDate,
  availability,
  selectedCheckIn,
  selectedCheckOut,
  onDateClick,
}: {
  monthDate: Date;
  availability: AvailabilityData;
  selectedCheckIn: Date | null;
  selectedCheckOut: Date | null;
  onDateClick: (date: Date, available: boolean) => void;
}) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const offset = (getDay(monthStart) + 6) % 7; // Monday-first

  return (
    <div className="aw-grid">
      {Array.from({ length: offset }).map((_, i) => (
        <em key={`e-${i}`} />
      ))}
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const status = availability[dateStr] ?? 'available';
        const isAvail = status === 'available';
        const isPast = isBefore(day, startOfDay(new Date()));
        const isCI = selectedCheckIn ? isSameDay(day, selectedCheckIn) : false;
        const isCO = selectedCheckOut ? isSameDay(day, selectedCheckOut) : false;
        const inRange =
          selectedCheckIn && selectedCheckOut &&
          day > selectedCheckIn && day < selectedCheckOut;
        const isNow = isToday(day);

        if (isPast) return <em key={day.toISOString()}>{format(day, 'd')}</em>;

        const cls = isCI || isCO ? 'aw-ci' : isAvail ? 'aw-a' : 'aw-x';
        const inlineStyle: React.CSSProperties = {};
        if (inRange) { inlineStyle.background = 'rgba(0,128,96,0.10)'; inlineStyle.color = 'var(--color-kelp-edge)'; }
        if (isNow && isAvail && !isCI && !isCO) inlineStyle.outline = '1.5px solid var(--color-kelp-edge)';

        return (
          <b
            key={day.toISOString()}
            className={cls}
            style={inlineStyle}
            onClick={() => onDateClick(day, isAvail && !isPast)}
            role="button"
            tabIndex={isAvail && !isPast ? 0 : -1}
            aria-label={`${format(day, 'd MMMM')}: ${isAvail ? 'available' : 'booked'}`}
          >
            {format(day, 'd')}
          </b>
        );
      })}
    </div>
  );
}

// ─── BOOKING MODAL ─────────────────────────────────────────────────────────
function BookingModal({
  propertyName,
  checkIn,
  checkOut,
  guests,
  maxGuests,
  onGuestsChange,
  onConfirm,
  onClose,
}: {
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  maxGuests?: number;
  onGuestsChange: (n: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(43,44,46,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 500, padding: '12px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${propertyName}`}
    >
      <div
        style={{
          background: 'var(--color-sea-spray)',
          maxWidth: '400px', width: '100%', padding: '24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
          <div>
            <h3 style={{
              fontFamily: '"The Seasons", Georgia, serif', fontWeight: 700,
              fontSize: '20px', color: 'var(--color-harbour-stone)', marginBottom: '6px',
            }}>
              {propertyName}
            </h3>
            <p style={{
              fontFamily: '"IBM Plex Mono", monospace', fontSize: '12px',
              color: 'var(--color-washed-timber)',
            }}>
              {format(checkIn, 'MMM d')} → {format(checkOut, 'MMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '22px', color: 'var(--color-washed-timber)', lineHeight: 1,
              minWidth: '44px', minHeight: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        <label style={{
          display: 'block', fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--color-kelp-edge)', marginBottom: '8px',
        }}>
          Guests
        </label>
        <input
          type="number" min="1" max={maxGuests || 10} value={guests}
          onChange={e => onGuestsChange(parseInt(e.target.value))}
          style={{
            width: '100%', padding: '10px 12px',
            border: '1px solid var(--color-washed-timber)',
            fontFamily: '"IBM Plex Mono", monospace', fontSize: '14px',
            color: 'var(--color-harbour-stone)', marginBottom: maxGuests ? '4px' : '24px',
            background: 'var(--color-sea-spray)', outline: 'none',
          }}
        />
        {maxGuests && (
          <p style={{
            fontFamily: '"IBM Plex Mono", monospace', fontSize: '10px',
            color: 'var(--color-washed-timber)', marginBottom: '24px',
          }}>
            Maximum {maxGuests} guests
          </p>
        )}

        <button
          onClick={onConfirm}
          style={{
            display: 'block', width: '100%', padding: '14px',
            background: 'var(--color-emerald-accent)', color: '#fff',
            border: 'none', cursor: 'pointer',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
        >
          Continue to Booking →
        </button>
      </div>
    </div>
  );
}
