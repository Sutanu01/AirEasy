'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Booking, Flight, Seat } from '@/types';
import { FlightsApi } from '@/lib/flights-api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CreditCard, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  flight: Flight;
  seats: Seat[];
  onPaymentSuccess: (confirmedBooking: Booking) => void;
}

export function RazorpayCheckoutModal({
  isOpen,
  onClose,
  booking,
  flight,
  seats,
  onPaymentSuccess,
}: RazorpayCheckoutModalProps) {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Create order on backend
      const orderData = await FlightsApi.createRazorpayOrder(booking.id);

      // 2. Verify Razorpay script is present on window
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'AirEasy Reservation',
          description: `Flight ${flight.flightNumber} - PNR: ${booking.pnr}`,
          order_id: orderData.orderId,
          prefill: {
            email: user?.email || 'customer@aireasy.com',
          },
          theme: {
            color: '#F84464', // AirEasy / BookMyShow pinkish red signature
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
          },
          handler: async (response: any) => {
            try {
              // 3. Confirm with HMAC verification on backend
              const idempotencyKey = `pay_${booking.id}_${Date.now()}`;
              const confirmRes = await FlightsApi.verifyAndConfirmPayment({
                bookingId: booking.id,
                idempotencyKey,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              // Trigger celebration confetti
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#F84464', '#D81B60', '#10B981', '#3B82F6', '#FBBF24'],
              });

              success('Payment verified! Your booking is confirmed.');
              onPaymentSuccess(confirmRes.booking || booking);
              onClose();
            } catch (confirmErr: any) {
              setErrorMessage(confirmErr.message || 'Signature verification failed');
              toastError(confirmErr.message || 'Payment confirmation failed');
            } finally {
              setLoading(false);
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (failedRes: any) => {
          setErrorMessage(failedRes?.error?.description || 'Payment was declined by bank.');
          setLoading(false);
        });
        rzp.open();
      } else {
        throw new Error('Razorpay checkout SDK is not loaded. Please refresh the page.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not initiate Razorpay checkout');
      toastError(err.message || 'Payment initiation failed');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Flight Reservation" maxWidth="520px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errorMessage && (
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
            <AlertTriangle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Flight Summary Card */}
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-muted)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-primary)' }}>
              {flight.flightNumber}
            </span>
            <Badge variant="neutral" size="sm">
              PNR: {booking.pnr}
            </Badge>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{flight.departureAirport?.airportCode || 'DEP'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {flight.departureAirport?.city?.cityName || 'Departure'}
              </div>
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              &rarr;
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>{flight.arrivalAirport?.airportCode || 'ARR'}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {flight.arrivalAirport?.city?.cityName || 'Arrival'}
              </div>
            </div>
          </div>

          {/* Selected Seat Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px dashed var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Seats:</span>
            {seats.map((s) => (
              <Badge key={s.id} variant="primary" size="sm">
                Row {s.row} - {s.column}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Fare ({booking.noOfSeats} &times; ₹{flight.price.toLocaleString('en-IN')})</span>
            <span>₹{(booking.noOfSeats * flight.price).toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Taxes &amp; Airline Surcharges</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Included</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1.5px solid var(--border-subtle)',
              fontSize: '16px',
              fontWeight: 800,
            }}
          >
            <span>Total Amount</span>
            <span style={{ fontSize: '22px', color: 'var(--color-primary)' }}>
              ₹{booking.totalCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-muted)',
          }}
        >
          <ShieldCheck size={16} color="var(--color-success)" />
          <span>Secured via Razorpay Sandbox &bull; 256-bit SSL Encryption</span>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="lg"
          loading={loading}
          onClick={handlePay}
          icon={<CreditCard size={18} />}
          style={{ width: '100%', height: '48px', fontSize: '15px' }}
        >
          Pay ₹{booking.totalCost.toLocaleString('en-IN')} Now
        </Button>
      </div>
    </Modal>
  );
}
