'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Booking, Flight } from '@/types';
import { FlightsApi } from '@/lib/flights-api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { BookingCard } from '@/components/bookings/BookingCard';
import { BoardingPassModal } from '@/components/bookings/BoardingPassModal';
import { RazorpayCheckoutModal } from '@/components/bookings/RazorpayCheckoutModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Ticket, Plane, AlertTriangle, RefreshCw } from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { success, error: toastError } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'ALL' | 'BOOKED' | 'PENDING' | 'CANCELLED'>('ALL');

  // Selected modals state
  const [selectedForBoardingPass, setSelectedForBoardingPass] = useState<Booking | null>(null);
  const [selectedForPayment, setSelectedForPayment] = useState<Booking | null>(null);
  const [selectedForCancel, setSelectedForCancel] = useState<Booking | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Flight cache for bookings
  const [flightsMap, setFlightsMap] = useState<Record<number, Flight>>({});

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await FlightsApi.getMyBookings();
      setBookings(data);

      // Fetch flight details for these bookings
      const flightIds = Array.from(new Set(data.map((b) => b.flightId)));
      const flightPromises = flightIds.map(async (id) => {
        try {
          const flightData = await FlightsApi.getFlight(id);
          return { id, data: flightData };
        } catch {
          return null;
        }
      });

      const resolved = await Promise.all(flightPromises);
      const newMap: Record<number, Flight> = {};
      resolved.forEach((item) => {
        if (item) newMap[item.id] = item.data;
      });
      setFlightsMap(newMap);
    } catch (err: any) {
      console.error('Failed to load bookings', err);
      toastError(err.message || 'Could not fetch your bookings');
    } finally {
      setLoading(false);
    }
  }, [user, toastError]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/bookings');
    } else if (user) {
      fetchBookings();
    }
  }, [authLoading, user, router, fetchBookings]);

  const handleConfirmCancel = async () => {
    if (!selectedForCancel) return;
    setCancelLoading(true);
    try {
      await FlightsApi.cancelBooking(selectedForCancel.id);
      success(`Booking #${selectedForCancel.pnr} was successfully cancelled`);
      setSelectedForCancel(null);
      fetchBookings();
    } catch (err: any) {
      toastError(err.message || 'Failed to cancel reservation');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'ALL') return true;
    return b.status === filterTab;
  });

  if (authLoading || (!user && loading)) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
        <Skeleton width="220px" height="32px" style={{ marginBottom: '24px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Skeleton width="100%" height="140px" />
          <Skeleton width="100%" height="140px" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 24px', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--text-main)',
              fontFamily: 'var(--font-family-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            My Flight Reservations
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage active tickets, complete pending payments, or view boarding passes
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={() => fetchBookings()} icon={<RefreshCw size={14} />}>
          Refresh
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {[
          { key: 'ALL', label: 'All Bookings' },
          { key: 'BOOKED', label: 'Confirmed' },
          { key: 'PENDING', label: 'Pending Payment' },
          { key: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => {
          const active = filterTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key as any)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: active ? 700 : 500,
                background: active ? 'var(--color-primary-subtle)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                border: active ? '1.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bookings Stream */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Skeleton width="100%" height="160px" />
          <Skeleton width="100%" height="160px" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div
          style={{
            padding: '64px 24px',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-active)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-primary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
            }}
          >
            <Ticket size={32} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>No Reservations Found</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px' }}>
            {filterTab === 'ALL'
              ? 'You have not booked any flights yet. Search scheduled flights and grab your seats!'
              : `You have no ${filterTab.toLowerCase()} reservations at this time.`}
          </p>
          <Link href="/flights">
            <Button variant="primary" size="md" icon={<Plane size={16} />}>
              Explore Available Flights
            </Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPayNow={(b) => setSelectedForPayment(b)}
              onCancel={(b) => setSelectedForCancel(b)}
              onViewBoardingPass={(b) => setSelectedForBoardingPass(b)}
            />
          ))}
        </div>
      )}

      {/* Boarding Pass Modal */}
      {selectedForBoardingPass && (
        <BoardingPassModal
          isOpen={!!selectedForBoardingPass}
          onClose={() => setSelectedForBoardingPass(null)}
          booking={selectedForBoardingPass}
          flight={flightsMap[selectedForBoardingPass.flightId]}
        />
      )}

      {/* Razorpay Payment Modal for Pending Booking */}
      {selectedForPayment && flightsMap[selectedForPayment.flightId] && (
        <RazorpayCheckoutModal
          isOpen={!!selectedForPayment}
          onClose={() => setSelectedForPayment(null)}
          booking={selectedForPayment}
          flight={flightsMap[selectedForPayment.flightId]}
          seats={[]}
          onPaymentSuccess={() => {
            setSelectedForPayment(null);
            fetchBookings();
          }}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {selectedForCancel && (
        <Modal
          isOpen={!!selectedForCancel}
          onClose={() => setSelectedForCancel(null)}
          title="Cancel Reservation?"
          maxWidth="440px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'var(--color-danger)',
                background: 'var(--color-danger-bg)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
              }}
            >
              <AlertTriangle size={24} />
              <span>
                Are you sure you want to cancel booking <strong>#{selectedForCancel.pnr}</strong>? Your reserved seats will be immediately released back to the airline inventory.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button variant="secondary" onClick={() => setSelectedForCancel(null)}>
                Keep Reservation
              </Button>
              <Button
                variant="danger"
                loading={cancelLoading}
                onClick={handleConfirmCancel}
              >
                Yes, Cancel Reservation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
