'use client';

import React from 'react';
import { Booking, Flight } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AirEasyLogo } from '@/components/brand/AirEasyLogo';
import { Plane, Printer, QrCode, ShieldCheck, Ticket } from 'lucide-react';

interface BoardingPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  flight?: Flight;
}

export function BoardingPassModal({ isOpen, onClose, booking, flight }: BoardingPassModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const depTime = flight?.departureTime ? new Date(flight.departureTime) : new Date(booking.createdAt);
  const arrTime = flight?.arrivalTime ? new Date(flight.arrivalTime) : new Date(booking.createdAt);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Boarding Pass" maxWidth="620px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Boarding Pass Ticket Container */}
        <div
          id="boarding-pass-print"
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '2px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #F84464 0%, #D81B60 100%)',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            <AirEasyLogo size="sm" variant="white" subtitle="Official Boarding Pass" />
            <div style={{ textAlign: 'right', fontSize: '13px' }}>
              <span style={{ opacity: 0.85 }}>PNR CODE</span>
              <div style={{ fontWeight: 900, fontSize: '16px', letterSpacing: '0.1em' }}>
                {booking.pnr}
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Origin & Destination */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>FROM</span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-primary)' }}>
                  {flight?.departureAirport?.airportCode || 'DEP'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>
                  {flight?.departureAirport?.city?.cityName || 'Origin City'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {depTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                <Plane size={20} style={{ transform: 'rotate(90deg)', color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '11px', marginTop: '4px' }}>Direct Flight</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TO</span>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-primary)' }}>
                  {flight?.arrivalAirport?.airportCode || 'ARR'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>
                  {flight?.arrivalAirport?.city?.cityName || 'Destination City'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {arrTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Flight Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-muted)',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>FLIGHT</span>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>{flight?.flightNumber || 'AE-101'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>DATE</span>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>
                  {depTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>GATE</span>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>
                  {flight?.boardingGate || 'Gate 4'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>SEATS</span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {booking.noOfSeats} {booking.noOfSeats === 1 ? 'Seat' : 'Seats'}
                </div>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '2px dashed var(--border-subtle)',
              }}
            >
              {/* SVG barcode visualization */}
              <svg width="280" height="42" viewBox="0 0 280 42">
                {Array.from({ length: 42 }).map((_, idx) => (
                  <rect
                    key={idx}
                    x={idx * 6.5 + (idx % 3 === 0 ? 1 : 0)}
                    y="0"
                    width={idx % 4 === 0 ? 4 : idx % 2 === 0 ? 2 : 1}
                    height="42"
                    fill="var(--text-main)"
                  />
                ))}
              </svg>
              <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: 'var(--text-muted)' }}>
                {booking.pnr}-AIR-EASY-VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" icon={<Printer size={16} />} onClick={handlePrint}>
            Print Boarding Pass
          </Button>
        </div>
      </div>
    </Modal>
  );
}
