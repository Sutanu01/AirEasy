'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Airport } from '@/types';
import { FlightsApi } from '@/lib/flights-api';
import { Button } from '@/components/ui/Button';
import { PlaneTakeoff, PlaneLanding, ArrowRightLeft, Calendar, Users, Search, Check, ChevronDown } from 'lucide-react';

interface FlightSearchFormProps {
  initialOrigin?: string;
  initialDestination?: string;
  initialDate?: string;
  initialPassengers?: number;
  onSearch?: (origin: string, destination: string, date: string, passengers: number) => void;
  compact?: boolean;
}

export function FlightSearchForm({
  initialOrigin = '',
  initialDestination = '',
  initialDate = '',
  initialPassengers = 1,
  onSearch,
  compact = false,
}: FlightSearchFormProps) {
  const router = useRouter();

  const [airports, setAirports] = useState<Airport[]>([]);
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate);
  const [passengers, setPassengers] = useState(initialPassengers);
  const [isSwapping, setIsSwapping] = useState(false);
  const [tripType, setTripType] = useState<'ONE_WAY' | 'ROUND_TRIP'>('ONE_WAY');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Custom dropdown states
  const [originOpen, setOriginOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const passRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) setOriginOpen(false);
      if (destRef.current && !destRef.current.contains(e.target as Node)) setDestOpen(false);
      if (passRef.current && !passRef.current.contains(e.target as Node)) setPassOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getAirportLabel = useCallback((code: string) => {
    const a = airports.find((ap) => ap.airportCode === code);
    return a ? `${a.airportCode} - ${a.airportName}` : '';
  }, [airports]);

  useEffect(() => {
    FlightsApi.getAirports()
      .then((data) => setAirports(data))
      .catch((err) => console.error('Failed to load airports', err));
  }, []);

  const [today, setToday] = useState('');

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setToday(todayStr);
    if (!initialDate) {
      setDate(todayStr);
    }
  }, [initialDate]);

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return 'Select Date';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setOrigin(destination);
    setDestination(origin);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(origin, destination, date, passengers);
    } else {
      const params = new URLSearchParams();
      if (origin && destination) {
        params.set('trips', `${origin}-${destination}`);
      }
      if (date) params.set('date', date);
      if (passengers > 1) params.set('passengers', String(passengers));
      router.push(`/flights?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: compact ? '20px' : '28px 32px',
        boxShadow: 'var(--shadow-card)',
        width: '100%',
      }}
    >
      {/* Top Header / Trip Type Selection */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '22px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setTripType('ONE_WAY')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 700,
              border: tripType === 'ONE_WAY' ? '1.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              background: tripType === 'ONE_WAY' ? 'var(--color-primary-subtle)' : 'transparent',
              color: tripType === 'ONE_WAY' ? 'var(--color-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <PlaneTakeoff size={14} /> One Way
          </button>
          <button
            type="button"
            onClick={() => setTripType('ROUND_TRIP')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid var(--border-subtle)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: 0.75,
            }}
            title="Round trip bookings launching soon"
          >
            <ArrowRightLeft size={14} /> Round Trip
            <span
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'var(--bg-muted)',
                color: 'var(--text-muted)',
              }}
            >
              Soon
            </span>
          </button>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
          Direct &amp; Connecting Flights Across India
        </div>
      </div>

      {/* Main Cohesive Input Grid */}
      <div className="flight-search-grid">
        {/* Origin Field */}
        <div className="search-field field-from" ref={originRef} style={{ position: 'relative' }}>
          <label className="field-label">From</label>
          <div
            className={`input-box${originOpen ? ' input-box-active' : ''}`}
            onClick={() => { setOriginOpen(!originOpen); setDestOpen(false); setPassOpen(false); }}
            style={{ cursor: 'pointer' }}
          >
            <PlaneTakeoff size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span className="field-display-text">
              {origin ? getAirportLabel(origin) : 'Select Origin'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: originOpen ? 'rotate(180deg)' : 'none' }} />
          </div>
          {originOpen && (
            <div className="custom-dropdown">
              {airports.map((airport) => {
                const isSelected = origin === airport.airportCode;
                return (
                  <div
                    key={airport.id}
                    className={`dropdown-item${isSelected ? ' dropdown-item-selected' : ''}`}
                    onClick={() => { setOrigin(airport.airportCode); setOriginOpen(false); }}
                  >
                    <span className="dropdown-item-text">
                      <strong>{airport.airportCode}</strong> — {airport.airportName}
                      <span className="dropdown-city">{airport.city?.cityName || ''}</span>
                    </span>
                    {isSelected && <Check size={14} color="var(--color-primary)" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
              {airports.length === 0 && <div className="dropdown-empty">No airports available</div>}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="field-swap">
          <button
            type="button"
            onClick={handleSwap}
            className="swap-button"
            aria-label="Swap origin and destination"
            style={{
              transform: isSwapping ? 'rotate(180deg)' : 'none',
            }}
          >
            <ArrowRightLeft size={16} />
          </button>
        </div>

        {/* Destination Field */}
        <div className="search-field field-to" ref={destRef} style={{ position: 'relative' }}>
          <label className="field-label">To</label>
          <div
            className={`input-box${destOpen ? ' input-box-active' : ''}`}
            onClick={() => { setDestOpen(!destOpen); setOriginOpen(false); setPassOpen(false); }}
            style={{ cursor: 'pointer' }}
          >
            <PlaneLanding size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span className="field-display-text">
              {destination ? getAirportLabel(destination) : 'Select Destination'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: destOpen ? 'rotate(180deg)' : 'none' }} />
          </div>
          {destOpen && (
            <div className="custom-dropdown">
              {airports.map((airport) => {
                const isSelected = destination === airport.airportCode;
                return (
                  <div
                    key={airport.id}
                    className={`dropdown-item${isSelected ? ' dropdown-item-selected' : ''}`}
                    onClick={() => { setDestination(airport.airportCode); setDestOpen(false); }}
                  >
                    <span className="dropdown-item-text">
                      <strong>{airport.airportCode}</strong> — {airport.airportName}
                      <span className="dropdown-city">{airport.city?.cityName || ''}</span>
                    </span>
                    {isSelected && <Check size={14} color="var(--color-primary)" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
              {airports.length === 0 && <div className="dropdown-empty">No airports available</div>}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="search-field field-date">
          <label className="field-label">Departure Date</label>
          <div
            className="input-box date-box-wrapper"
            onClick={() => {
              try {
                dateInputRef.current?.showPicker();
              } catch {
                dateInputRef.current?.focus();
              }
            }}
          >
            <Calendar size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span className="date-display-text">
              {formatDateDisplay(date)}
            </span>
            <input
              ref={dateInputRef}
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="native-date-overlay"
              aria-label="Departure Date"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="search-field field-passengers" ref={passRef} style={{ position: 'relative' }}>
          <label className="field-label">Passengers</label>
          <div
            className={`input-box${passOpen ? ' input-box-active' : ''}`}
            onClick={() => { setPassOpen(!passOpen); setOriginOpen(false); setDestOpen(false); }}
            style={{ cursor: 'pointer' }}
          >
            <Users size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span className="field-display-text">
              {passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: passOpen ? 'rotate(180deg)' : 'none' }} />
          </div>
          {passOpen && (
            <div className="custom-dropdown">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                const isSelected = passengers === num;
                return (
                  <div
                    key={num}
                    className={`dropdown-item${isSelected ? ' dropdown-item-selected' : ''}`}
                    onClick={() => { setPassengers(num); setPassOpen(false); }}
                  >
                    <span>{num} {num === 1 ? 'Passenger' : 'Passengers'}</span>
                    {isSelected && <Check size={14} color="var(--color-primary)" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit Search Action */}
        <div className="field-submit">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<Search size={18} />}
            style={{
              width: '100%',
              height: '50px',
              padding: '0 24px',
              whiteSpace: 'nowrap',
            }}
          >
            Search Flights
          </Button>
        </div>
      </div>

      <style jsx>{`
        .flight-search-grid {
          display: grid;
          grid-template-columns: 1.3fr 42px 1.3fr 1.05fr 0.95fr auto;
          gap: 12px;
          align-items: flex-end;
          width: 100%;
        }

        .search-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .field-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          height: 50px;
          border: 1.5px solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-input);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        .input-box:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(248, 68, 100, 0.12);
        }

        .date-box-wrapper {
          position: relative;
          cursor: pointer;
        }

        .date-display-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .native-date-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .field-display-text {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .input-box-active {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 3px rgba(248, 68, 100, 0.12) !important;
        }

        .custom-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          max-height: 280px;
          overflow-y: auto;
          background: var(--bg-surface-elevated);
          border: 1.5px solid var(--border-subtle);
          border-radius: var(--radius-md);
          box-shadow: 0 12px 28px -4px rgba(0,0,0,0.15), 0 4px 10px -2px rgba(0,0,0,0.08);
          z-index: 1000;
          padding: 4px;
          animation: dropIn 0.15s ease-out;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 12px;
          font-size: 13px;
          color: var(--text-main);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: background 0.1s ease;
        }

        .dropdown-item:hover {
          background: var(--bg-muted);
        }

        .dropdown-item-selected {
          background: var(--color-primary-subtle);
          color: var(--color-primary);
          font-weight: 600;
        }

        .dropdown-item-selected:hover {
          background: var(--color-primary-subtle);
        }

        .dropdown-item-text {
          display: flex;
          align-items: baseline;
          gap: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }

        .dropdown-city {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 400;
        }

        .dropdown-empty {
          padding: 16px 12px;
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
        }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .field-swap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 5px;
        }

        .swap-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-muted);
          border: 1.5px solid var(--border-subtle);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .swap-button:hover {
          color: var(--color-primary);
          border-color: var(--color-primary);
          background: var(--color-primary-subtle);
          transform: scale(1.05);
        }

        @media (max-width: 1100px) {
          .flight-search-grid {
            grid-template-columns: 1fr 40px 1fr;
            row-gap: 16px;
          }
          .field-from {
            grid-column: 1;
          }
          .field-swap {
            grid-column: 2;
          }
          .field-to {
            grid-column: 3;
          }
          .field-date {
            grid-column: 1 / span 2;
          }
          .field-passengers {
            grid-column: 3;
          }
          .field-submit {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .flight-search-grid {
            grid-template-columns: 1fr;
            row-gap: 14px;
          }
          .field-from,
          .field-to,
          .field-date,
          .field-passengers,
          .field-submit {
            grid-column: 1 / -1;
          }
          .field-swap {
            grid-column: 1 / -1;
            padding-bottom: 0;
            margin: -4px 0;
          }
        }
      `}</style>
    </form>
  );
}
