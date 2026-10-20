'use client';

import React, { useEffect, useState } from 'react';
import { Seat, Flight, SeatClass } from '@/types';
import { FlightsApi } from '@/lib/flights-api';
import { Spinner } from '@/components/ui/Spinner';
import { Check, X, Shield, Sparkles } from 'lucide-react';

interface SeatMapProps {
  flight: Flight;
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  maxSeats?: number;
}

export function SeatMap({ flight, selectedSeats, onToggleSeat, maxSeats = 6 }: SeatMapProps) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    FlightsApi.getFlightSeats(flight.id)
      .then((data) => {
        setSeats(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load seats', err);
        setError('Could not retrieve seat configuration for this flight.');
      })
      .finally(() => setLoading(false));
  }, [flight.id]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Spinner size={36} />
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Loading live airplane cabin layout...</span>
      </div>
    );
  }

  if (error || seats.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-danger)' }}>
        {error || 'No seats available for this flight configuration.'}
      </div>
    );
  }

  // Group seats by row
  const rowsMap = new Map<number, Seat[]>();
  seats.forEach((seat) => {
    const list = rowsMap.get(seat.row) || [];
    list.push(seat);
    rowsMap.set(seat.row, list);
  });

  const sortedRowNumbers = Array.from(rowsMap.keys()).sort((a, b) => a - b);

  // Group columns into Left (A, B, C) and Right (D, E, F)
  const isSelected = (seatId: number) => selectedSeats.some((s) => s.id === seatId);

  const getClassColor = (type: SeatClass) => {
    switch (type) {
      case 'FIRST_CLASS':
        return '#8B5CF6';
      case 'BUSINESS':
        return '#3B82F6';
      case 'PREMIUM_ECONOMY':
        return '#14B8A6';
      case 'ECONOMY':
      default:
        return 'var(--border-active)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Seat Class & Status Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '24px',
          padding: '12px 20px',
          background: 'var(--bg-muted)',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', border: '1.5px solid var(--border-active)', background: 'var(--bg-surface)' }} />
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--color-primary)' }} />
          <span>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: 'var(--border-subtle)', opacity: 0.5 }} />
          <span>Booked / Held</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#8B5CF6' }} />
          <span>First Class</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#3B82F6' }} />
          <span>Business</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#14B8A6' }} />
          <span>Premium Econ</span>
        </div>
      </div>

      {/* Airplane Fuselage Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--bg-surface-elevated)',
          border: '2px solid var(--border-subtle)',
          borderRadius: '120px 120px 30px 30px',
          boxShadow: 'var(--shadow-card)',
          padding: '40px 24px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Cockpit Window Stylings */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            opacity: 0.6,
          }}
        >
          <div style={{ width: '32px', height: '18px', background: 'var(--text-muted)', borderRadius: '14px 4px 4px 14px' }} />
          <div style={{ width: '38px', height: '22px', background: 'var(--text-muted)', borderRadius: '6px 6px 4px 4px' }} />
          <div style={{ width: '32px', height: '18px', background: 'var(--text-muted)', borderRadius: '4px 14px 14px 4px' }} />
        </div>

        {/* Airplane Cabin Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {sortedRowNumbers.map((rowNum) => {
            const rowSeats = rowsMap.get(rowNum) || [];
            // Sort by column (A, B, C, D, E, F)
            const sortedSeats = [...rowSeats].sort((a, b) => a.column.localeCompare(b.column));

            const leftSeats = sortedSeats.filter((s) => ['A', 'B', 'C'].includes(s.column));
            const rightSeats = sortedSeats.filter((s) => !['A', 'B', 'C'].includes(s.column));

            return (
              <div
                key={rowNum}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  width: '100%',
                }}
              >
                {/* Left side seats (A, B, C) */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {leftSeats.map((seat) => {
                    const selected = isSelected(seat.id);
                    const booked = seat.isBooked;

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={booked}
                        onClick={() => onToggleSeat(seat)}
                        title={`Seat ${seat.row}${seat.column} (${seat.seatType})`}
                        style={{
                          width: '36px',
                          height: '38px',
                          borderRadius: '8px',
                          border: selected
                            ? '2px solid var(--color-primary)'
                            : `1.5px solid ${getClassColor(seat.seatType)}`,
                          background: selected
                            ? 'var(--color-primary)'
                            : booked
                            ? 'var(--bg-muted)'
                            : 'var(--bg-surface)',
                          color: selected ? '#FFFFFF' : booked ? 'var(--text-muted)' : 'var(--text-main)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: booked ? 'not-allowed' : 'pointer',
                          opacity: booked ? 0.35 : 1,
                          transition: 'all var(--transition-fast)',
                          boxShadow: selected ? '0 2px 8px rgba(248, 68, 100, 0.4)' : 'none',
                        }}
                      >
                        {selected ? (
                          <Check size={14} strokeWidth={3} />
                        ) : booked ? (
                          <X size={12} strokeWidth={2.5} />
                        ) : (
                          `${seat.column}`
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Center Aisle with Row Number */}
                <div
                  style={{
                    width: '28px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                  }}
                >
                  {rowNum}
                </div>

                {/* Right side seats (D, E, F) */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {rightSeats.map((seat) => {
                    const selected = isSelected(seat.id);
                    const booked = seat.isBooked;

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={booked}
                        onClick={() => onToggleSeat(seat)}
                        title={`Seat ${seat.row}${seat.column} (${seat.seatType})`}
                        style={{
                          width: '36px',
                          height: '38px',
                          borderRadius: '8px',
                          border: selected
                            ? '2px solid var(--color-primary)'
                            : `1.5px solid ${getClassColor(seat.seatType)}`,
                          background: selected
                            ? 'var(--color-primary)'
                            : booked
                            ? 'var(--bg-muted)'
                            : 'var(--bg-surface)',
                          color: selected ? '#FFFFFF' : booked ? 'var(--text-muted)' : 'var(--text-main)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: booked ? 'not-allowed' : 'pointer',
                          opacity: booked ? 0.35 : 1,
                          transition: 'all var(--transition-fast)',
                          boxShadow: selected ? '0 2px 8px rgba(248, 68, 100, 0.4)' : 'none',
                        }}
                      >
                        {selected ? (
                          <Check size={14} strokeWidth={3} />
                        ) : booked ? (
                          <X size={12} strokeWidth={2.5} />
                        ) : (
                          `${seat.column}`
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
