'use client';

import React, { useState } from 'react';
import { Booking, Flight } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plane, Calendar, CreditCard, Ticket, AlertCircle, Ban } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onPayNow: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onViewBoardingPass: (booking: Booking) => void;
}

export function BookingCard({
  booking,
  onPayNow,
  onCancel,
  onViewBoardingPass,
}: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'BOOKED':
        return <Badge variant="success">Confirmed</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Hold Pending Payment</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{booking.status}</Badge>;
    }
  };

  const bookingDate = new Date(booking.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card
      hoverEffect
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        borderLeft:
          booking.status === 'BOOKED'
            ? '4px solid var(--color-success)'
            : booking.status === 'PENDING'
            ? '4px solid var(--color-warning)'
            : '4px solid var(--color-danger)',
      }}
    >
      {/* Top Header */}
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
            <Ticket size={16} />
            PNR: {booking.pnr}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Booked on {bookingDate}
          </span>
        </div>

        {getStatusBadge()}
      </div>

      {/* Flight & Details Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          padding: '16px',
          background: 'var(--bg-muted)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>FLIGHT</span>
          <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px' }}>
            Flight #{booking.flightId}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>SEATS RESERVED</span>
          <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px' }}>
            {booking.noOfSeats} {booking.noOfSeats === 1 ? 'Passenger' : 'Passengers'}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL AMOUNT</span>
          <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-primary)', marginTop: '2px' }}>
            ₹{booking.totalCost.toLocaleString('en-IN')}
          </div>
        </div>

        {booking.razorpayPaymentId && (
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>RAZORPAY ID</span>
            <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px', fontFamily: 'monospace' }}>
              {booking.razorpayPaymentId}
            </div>
          </div>
        )}
      </div>

      {/* Action CTA Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {booking.status === 'BOOKED' && (
          <Button
            variant="primary"
            size="sm"
            icon={<Ticket size={16} />}
            onClick={() => onViewBoardingPass(booking)}
          >
            View Boarding Pass
          </Button>
        )}

        {booking.status === 'PENDING' && (
          <Button
            variant="primary"
            size="sm"
            icon={<CreditCard size={16} />}
            onClick={() => onPayNow(booking)}
          >
            Pay with Razorpay Now
          </Button>
        )}

        {booking.status !== 'CANCELLED' && (
          <Button
            variant="ghost"
            size="sm"
            style={{ color: 'var(--color-danger)' }}
            icon={<Ban size={16} />}
            onClick={() => onCancel(booking)}
          >
            Cancel Reservation
          </Button>
        )}
      </div>
    </Card>
  );
}
