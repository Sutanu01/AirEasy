'use client';

import React from 'react';
import Link from 'next/link';
import { AirEasyLogo } from '@/components/brand/AirEasyLogo';

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 'auto',
        padding: '28px 24px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Top Section: Brand & Secondary Utility Links */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <AirEasyLogo size="sm" />
            </Link>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: '12px',
                opacity: 0.85,
              }}
            >
              Effortless flight reservations &amp; live seat choice
            </span>
          </div>

          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            <Link
              href="/flights"
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Search Flights
            </Link>
            <Link
              href="/admin"
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Staff Portal
            </Link>
          </nav>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div
          style={{
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            opacity: 0.75,
          }}
        >
          <p>&copy; 2026 AirEasy Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
