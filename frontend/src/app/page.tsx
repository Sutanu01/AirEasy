'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FlightSearchForm } from '@/components/flights/FlightSearchForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plane, ArrowRight, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const popularRoutes = [
    { from: 'DEL', fromCity: 'Delhi', to: 'BOM', toCity: 'Mumbai', price: '₹4,200' },
    { from: 'BOM', fromCity: 'Mumbai', to: 'BLR', toCity: 'Bengaluru', price: '₹3,850' },
    { from: 'DEL', fromCity: 'Delhi', to: 'GOI', toCity: 'Goa', price: '₹4,900' },
    { from: 'BLR', fromCity: 'Bengaluru', to: 'HYD', toCity: 'Hyderabad', price: '₹2,650' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Hero Section with Vibrant Gradient & Glow */}
      <section
        style={{
          position: 'relative',
          padding: '64px 24px 80px',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(248, 68, 100, 0.25), transparent)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: 'var(--text-main)',
              fontFamily: 'var(--font-family-heading)',
              letterSpacing: '-0.03em',
              maxWidth: '850px',
            }}
          >
            Effortless Air Travel with{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #F84464 0%, #D81B60 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AirEasy
            </span>
          </h1>

          <p
            style={{
              marginTop: '16px',
              fontSize: '18px',
              color: 'var(--text-muted)',
              maxWidth: '620px',
              lineHeight: 1.6,
            }}
          >
            Find scheduled flights at unbeatable rates. Pick your favorite window or aisle seat in real time and checkout securely with Razorpay.
          </p>

          {/* Search Form Widget */}
          <div
            style={{
              width: '100%',
              maxWidth: '1100px',
              marginTop: '40px',
            }}
          >
            <FlightSearchForm />
          </div>
        </div>
      </section>

      {/* Popular Routes Carousel / Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 60px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-family-heading)' }}>
              Popular Flight Routes
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Top travel connections bookable today
            </p>
          </div>

          <Link href="/flights">
            <Button variant="ghost" size="sm" icon={<ChevronRight size={16} />}>
              View All Flights
            </Button>
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {popularRoutes.map((route, idx) => (
            <Card
              key={idx}
              hoverEffect
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderLeft: '3px solid var(--color-primary)',
              }}
              onClick={() => router.push(`/flights?trips=${route.from}-${route.to}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                  DAILY ROUTE
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  From {route.price}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 900 }}>{route.from}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{route.fromCity}</div>
                </div>

                <div style={{ color: 'var(--color-primary)', padding: '0 12px' }}>
                  <Plane size={20} />
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900 }}>{route.to}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{route.toCity}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px', width: '100%' }}>
        <div
          style={{
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
            overflow: 'hidden',
            padding: '40px 36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Subtle Ambient Brand Glow Accent */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '400px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(248, 68, 100, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                fontSize: '26px',
                fontWeight: 800,
                fontFamily: 'var(--font-family-heading)',
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
              }}
            >
              Ready to take flight with{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #F84464 0%, #D81B60 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                AirEasy
              </span>
              ?
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '520px' }}>
              Find your flights, reserve your favorite seats, and take off with seamless Razorpay checkout.
            </p>
          </div>

          <Link href="/flights" style={{ position: 'relative', zIndex: 1 }}>
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              Book Flights Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
