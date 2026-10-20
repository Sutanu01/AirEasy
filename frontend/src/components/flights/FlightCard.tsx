'use client';

import React from 'react';
import { Flight } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plane, Clock, Armchair, ChevronRight } from 'lucide-react';

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  // Format dates & times
  const depDate = new Date(flight.departureTime);
  const arrDate = new Date(flight.arrivalTime);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Calculate duration in hours and mins
  const durationMs = Math.max(0, arrDate.getTime() - depDate.getTime());
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const durationText = `${hours}h ${minutes}m`;

  const isLowSeats = flight.availableSeats <= 5;

  return (
    <Card
      hoverEffect
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderLeft: isLowSeats ? '4px solid var(--color-warning)' : '4px solid var(--color-primary)',
      }}
    >
      {/* Top Bar: Flight number, Airplane model, Gate */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plane size={16} />
            {flight.flightNumber}
          </div>

          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {flight.airplane?.modelNumber || 'Commercial Airliner'}
          </span>

          {flight.boardingGate && (
            <Badge variant="neutral" size="sm">
              Gate {flight.boardingGate}
            </Badge>
          )}
        </div>

        {/* Available seats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Armchair size={16} color={isLowSeats ? 'var(--color-warning)' : 'var(--color-success)'} />
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: isLowSeats ? 'var(--color-warning)' : 'var(--color-success)',
            }}
          >
            {flight.availableSeats} seats remaining
          </span>
        </div>
      </div>

      {/* Main Flight Times & Route Visualizer */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '20px',
          padding: '8px 0',
        }}
      >
        {/* Departure */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-family-heading)' }}>
            {formatTime(depDate)}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>
            {flight.departureAirport?.airportCode || 'DEP'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {flight.departureAirport?.city?.cityName || flight.departureAirport?.airportName || 'Departure City'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {formatDate(depDate)}
          </div>
        </div>

        {/* Route visualization with line & airplane */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            minWidth: '140px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            {durationText}
          </span>
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '2px',
                background: 'dashed 2px var(--border-active)',
                borderTop: '2px dashed var(--border-active)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                padding: '4px',
                borderRadius: '50%',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <Plane size={14} style={{ transform: 'rotate(90deg)' }} />
            </div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
            Non-stop
          </span>
        </div>

        {/* Arrival */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-family-heading)' }}>
            {formatTime(arrDate)}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>
            {flight.arrivalAirport?.airportCode || 'ARR'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {flight.arrivalAirport?.city?.cityName || flight.arrivalAirport?.airportName || 'Arrival City'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {formatDate(arrDate)}
          </div>
        </div>
      </div>

      {/* Bottom bar: Price and CTA */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total fare per passenger</span>
          <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)' }}>
            ₹{flight.price.toLocaleString('en-IN')}
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onSelect(flight)}
          disabled={flight.availableSeats <= 0}
          icon={<ChevronRight size={18} />}
        >
          {flight.availableSeats <= 0 ? 'Sold Out' : 'Select Seats'}
        </Button>
      </div>
    </Card>
  );
}
