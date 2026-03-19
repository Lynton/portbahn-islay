'use client';

import { useState } from 'react';
import PropertyCalendar from './PropertyCalendar';

interface MobileAvailBarProps {
  propertySlug: string;
  propertyId: number;
  propertyName: string;
  sleeps?: number;
  weeklyRate?: number | null;
  dailyRate?: number | null;
  minimumStay?: string | null;
}

export default function MobileAvailBar({
  propertySlug,
  propertyId,
  propertyName,
  sleeps,
  weeklyRate,
  dailyRate,
  minimumStay,
}: MobileAvailBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Fixed bottom availability bar — mobile only (hidden md+) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[150] md:hidden"
        style={{
          background: 'var(--color-sea-spray)',
          borderTop: '1px solid var(--color-washed-timber)',
          padding: '12px 20px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(weeklyRate || dailyRate) && (
            <div style={{ flexShrink: 0 }}>
              <p style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '9px',
                color: 'var(--color-washed-timber)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                From
              </p>
              <p style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '18px',
                color: 'var(--color-harbour-stone)',
                lineHeight: 1.2,
              }}>
                £{(weeklyRate || dailyRate)!.toLocaleString()}
                <span style={{ fontSize: '10px', color: 'var(--color-washed-timber)' }}>
                  {weeklyRate ? '/wk' : '/night'}
                </span>
              </p>
            </div>
          )}
          <button
            onClick={() => setOpen(true)}
            style={{
              flex: 1,
              background: 'var(--color-emerald-accent)',
              color: '#fff',
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '10.5px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '14px',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            Check Availability
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] md:hidden"
        style={{
          background: 'rgba(43,44,46,0.5)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
        onClick={() => setOpen(false)}
      />

      {/* Slide-up panel */}
      <div
        className="fixed left-0 right-0 z-[201] md:hidden"
        style={{
          bottom: 0,
          background: 'var(--color-sea-spray)',
          borderTop: '2px solid var(--color-kelp-edge)',
          maxHeight: '85vh',
          overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Panel header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 8px',
          borderBottom: '1px solid var(--color-washed-timber)',
        }}>
          <p style={{
            fontFamily: '"The Seasons", Georgia, serif',
            fontWeight: 700,
            fontSize: '1.15rem',
            color: 'var(--color-harbour-stone)',
          }}>
            Availability
          </p>
          <button
            onClick={() => setOpen(false)}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '18px',
              color: 'var(--color-harbour-stone)',
              opacity: 0.45,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '0.45')}
          >
            ✕
          </button>
        </div>

        <PropertyCalendar
          propertySlug={propertySlug}
          propertyId={propertyId}
          propertyName={propertyName}
          sleeps={sleeps}
          weeklyRate={weeklyRate}
          dailyRate={dailyRate}
          minimumStay={minimumStay}
        />
      </div>
    </>
  );
}
