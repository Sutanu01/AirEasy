'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Flight } from '@/types';
import { FlightsApi } from '@/lib/flights-api';
import { FlightSearchForm } from '@/components/flights/FlightSearchForm';
import { FlightFilters } from '@/components/flights/FlightFilters';
import { FlightCard } from '@/components/flights/FlightCard';
import { FlightBookingModal } from '@/components/flights/FlightBookingModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Plane, AlertCircle, RefreshCw } from 'lucide-react';

function FlightsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params
  const tripsParam = searchParams.get('trips') || '';
  const dateParam = searchParams.get('date') || '';
  const passengersParam = searchParams.get('passengers') ? Number(searchParams.get('passengers')) : 1;
  const sortParam = searchParams.get('sort') || 'price_asc';
  const priceParam = searchParams.get('price') || '';

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(25000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(25000);
  const [sortBy, setSortBy] = useState(sortParam);

  // Booking modal state
  const [selectedFlightForBooking, setSelectedFlightForBooking] = useState<Flight | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const fetchFlights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await FlightsApi.getFlights({
        trips: tripsParam || undefined,
        date: dateParam || undefined,
        passengers: passengersParam || undefined,
        sort: sortBy || undefined,
        price: priceParam || undefined,
      });

      setFlights(data);

      if (data.length > 0) {
        const highestPrice = Math.max(...data.map((f) => f.price));
        setMaxAvailablePrice(Math.max(highestPrice, 10000));
        if (selectedMaxPrice === 25000) {
          setSelectedMaxPrice(Math.max(highestPrice, 10000));
        }
      }
    } catch (err: any) {
      console.error('Failed to load flights', err);
      setError(err.message || 'Could not fetch flights. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  }, [tripsParam, dateParam, passengersParam, sortBy, priceParam, selectedMaxPrice]);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleSearchSubmit = (origin: string, dest: string, date: string, passengers: number) => {
    const params = new URLSearchParams();
    if (origin && dest) params.set('trips', `${origin}-${dest}`);
    if (date) params.set('date', date);
    if (passengers > 1) params.set('passengers', String(passengers));
    if (sortBy) params.set('sort', sortBy);
    router.push(`/flights?${params.toString()}`);
  };

  const handlePriceChange = (val: number) => {
    setSelectedMaxPrice(val);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/flights?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedMaxPrice(maxAvailablePrice);
    setSortBy('price_asc');
    router.push('/flights');
  };

  // Client-side price filtering
  const filteredFlights = flights.filter((f) => f.price <= selectedMaxPrice);

  const [originCode, destCode] = tripsParam.split('-');

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
      {/* Search Header Form */}
      <div style={{ marginBottom: '32px' }}>
        <FlightSearchForm
          initialOrigin={originCode || ''}
          initialDestination={destCode || ''}
          initialDate={dateParam || ''}
          initialPassengers={passengersParam}
          onSearch={handleSearchSubmit}
        />
      </div>

      {/* Main Content Layout: Sidebar Filters + Flight List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
        className="flights-layout"
      >
        {/* Left Sidebar Filters */}
        <aside>
          <FlightFilters
            maxPrice={maxAvailablePrice}
            selectedPrice={selectedMaxPrice}
            onPriceChange={handlePriceChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Flight Cards Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Results Summary Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600 }}>
              {loading ? (
                'Searching available flights...'
              ) : (
                <>
                  Found <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{filteredFlights.length}</span> flights
                  {tripsParam && ` between ${tripsParam}`}
                </>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={() => fetchFlights()} icon={<RefreshCw size={14} />}>
              Refresh
            </Button>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton width="140px" height="24px" />
                    <Skeleton width="100px" height="24px" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton width="180px" height="40px" />
                    <Skeleton width="80px" height="40px" />
                    <Skeleton width="180px" height="40px" />
                  </div>
                  <Skeleton width="100%" height="40px" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div
              style={{
                padding: '32px',
                textAlign: 'center',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-danger-bg)',
                border: '1px solid var(--color-danger)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <AlertCircle size={32} color="var(--color-danger)" />
              <div style={{ fontWeight: 700, color: 'var(--color-danger)' }}>{error}</div>
              <Button variant="primary" size="sm" onClick={() => fetchFlights()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredFlights.length === 0 && (
            <div
              style={{
                padding: '60px 24px',
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
                <Plane size={32} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>No Flights Found</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px' }}>
                We couldn&apos;t find any scheduled flights matching your criteria. Try adjusting your dates, airports, or price filter.
              </p>
              <Button variant="outline" size="md" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Flight Card List */}
          {!loading &&
            !error &&
            filteredFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={(f) => {
                  setSelectedFlightForBooking(f);
                  setIsBookingModalOpen(true);
                }}
              />
            ))}
        </div>
      </div>

      {/* Seat Selection & Booking Modal */}
      {selectedFlightForBooking && (
        <FlightBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedFlightForBooking(null);
          }}
          flight={selectedFlightForBooking}
          onBookingComplete={() => fetchFlights()}
        />
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.flights-layout) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading flights...</div>}>
      <FlightsPageContent />
    </Suspense>
  );
}
