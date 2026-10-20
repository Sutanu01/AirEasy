'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flight, Seat, Booking } from '@/types';
import { FlightsApi } from '@/lib/flights-api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SeatMap } from '@/components/flights/SeatMap';
import { RazorpayCheckoutModal } from '@/components/bookings/RazorpayCheckoutModal';
import { Plane, AlertCircle, CreditCard, Armchair } from 'lucide-react';

interface FlightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight | null;
  onBookingComplete?: () => void;
}

export function FlightBookingModal({
  isOpen,
  onClose,
  flight,
  onBookingComplete,
}: FlightBookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!flight) return null;

  const handleToggleSeat = (seat: Seat) => {
    setError(null);
    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        setError('Maximum 6 seats can be reserved in a single transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalCost = selectedSeats.length * flight.price;

  const handleProceedToBooking = async () => {
    if (!user) {
      toastError('Please log in to complete your flight reservation');
      router.push(`/login?redirect=/flights`);
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to proceed.');
      return;
    }

    setBookingLoading(true);
    setError(null);

    try {
      const newBooking = await FlightsApi.createBooking({
        flightId: flight.id,
        noOfSeats: selectedSeats.length,
        seatIds: selectedSeats.map((s) => s.id),
      });

      setCreatedBooking(newBooking);
      setShowCheckoutModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to lock seats for reservation');
      toastError(err.message || 'Seat lock failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentSuccess = (confirmedBooking: Booking) => {
    setShowCheckoutModal(false);
    onClose();
    if (onBookingComplete) onBookingComplete();
    router.push('/bookings');
  };

  return (
    <>
      <Modal isOpen={isOpen && !showCheckoutModal} onClose={onClose} title="Select Your Seats" maxWidth="720px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Flight Route Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-muted)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-primary)' }}>
                  {flight.flightNumber}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {flight.airplane?.modelNumber}
                </span>
              </div>
              <div style={{ fontSize: '13px', marginTop: '2px', color: 'var(--text-main)', fontWeight: 600 }}>
                {flight.departureAirport?.airportCode} &rarr; {flight.arrivalAirport?.airportCode} (
                {flight.departureAirport?.city?.cityName} to {flight.arrivalAirport?.city?.cityName})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Price per seat</span>
              <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)' }}>
                ₹{flight.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-danger-bg)',
                border: '1px solid var(--color-danger)',
                fontSize: '13px',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Interactive Seat Map */}
          <div style={{ maxHeight: '440px', overflowY: 'auto', padding: '10px 0' }}>
            <SeatMap
              flight={flight}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
              maxSeats={6}
            />
          </div>

          {/* Bottom Bar: Selected Seats summary & Checkout CTA */}
          <div
            style={{
              paddingTop: '16px',
              borderTop: '1.5px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Armchair size={18} color="var(--color-primary)" />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>
                  Selected: {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                </span>
              </div>
              {selectedSeats.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {selectedSeats.map((s) => (
                    <Badge key={s.id} variant="primary" size="sm">
                      {s.row}{s.column}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Amount</span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-primary)' }}>
                  ₹{totalCost.toLocaleString('en-IN')}
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                loading={bookingLoading}
                disabled={selectedSeats.length === 0}
                onClick={handleProceedToBooking}
                icon={<CreditCard size={18} />}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Razorpay Checkout Trigger */}
      {createdBooking && (
        <RazorpayCheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          booking={createdBooking}
          flight={flight}
          seats={selectedSeats}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
