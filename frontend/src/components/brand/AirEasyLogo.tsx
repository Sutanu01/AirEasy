'use client';

import React, { useId } from 'react';

interface AirEasyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
  subtitle?: string;
  className?: string;
}

export function AirEasyLogo({
  size = 'md',
  showText = true,
  variant = 'default',
  subtitle,
  className,
}: AirEasyLogoProps) {
  const uid = useId().replace(/:/g, '');

  const config = {
    sm: { markSize: 22, fontSize: '1.2rem', gap: '8px' },
    md: { markSize: 28, fontSize: '1.45rem', gap: '10px' },
    lg: { markSize: 36, fontSize: '1.9rem', gap: '12px' },
    xl: { markSize: 46, fontSize: '2.3rem', gap: '14px' },
  }[size];

  const isWhite = variant === 'white';
  const gradId = `ae-plane-grad-${uid}`;
  const trailId = `ae-trail-grad-${uid}`;
  const fillId = `ae-fill-grad-${uid}`;

  return (
    <div
      className={`aireasy-logo-root ${className || ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: config.gap,
        textDecoration: 'none',
        userSelect: 'none',
        cursor: 'pointer',
      }}
    >
      {/* Unboxed Aerodynamic Plane Mark */}
      <div
        className="plane-mark-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <svg
          width={config.markSize}
          height={config.markSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible', display: 'block' }}
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F84464" />
              <stop offset="100%" stopColor="#D81B60" />
            </linearGradient>
            <linearGradient id={trailId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#F84464'} stopOpacity="0" />
              <stop offset="60%" stopColor={isWhite ? '#FFFFFF' : '#F84464'} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isWhite ? '#FFFFFF' : '#D81B60'} stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={isWhite ? '#FFFFFF' : '#F84464'}
                stopOpacity={isWhite ? '0.18' : '0.14'}
              />
              <stop
                offset="100%"
                stopColor={isWhite ? '#FFFFFF' : '#D81B60'}
                stopOpacity={isWhite ? '0.28' : '0.24'}
              />
            </linearGradient>
          </defs>

          {/* Aerodynamic Flight Arc (Contrail / Jet Stream) */}
          <path
            d="M 2 26 C 7 25, 14 21, 18 15"
            stroke={`url(#${trailId})`}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Secondary subtle supersonic contrail */}
          <path
            d="M 4 29 C 7 28.5, 11 26.5, 14 23"
            stroke={`url(#${trailId})`}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />

          {/* Clean Soaring Airplane Body */}
          <g transform="translate(4, 0)">
            <path
              d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
              fill={`url(#${fillId})`}
              stroke={isWhite ? '#FFFFFF' : `url(#${gradId})`}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: config.fontSize,
              fontWeight: 800,
              fontFamily: 'var(--font-family-heading)',
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            <span
              style={{
                color: isWhite ? '#FFFFFF' : 'var(--text-main)',
                fontWeight: 800,
              }}
            >
              Air
            </span>
            <span
              style={{
                background: isWhite
                  ? '#FFFFFF'
                  : 'linear-gradient(135deg, #F84464 0%, #E0294C 100%)',
                WebkitBackgroundClip: isWhite ? 'none' : 'text',
                WebkitTextFillColor: isWhite ? '#FFFFFF' : 'transparent',
                color: isWhite ? '#FFFFFF' : 'inherit',
                fontWeight: 900,
                marginLeft: '1px',
                opacity: isWhite ? 0.95 : 1,
              }}
            >
              Easy
            </span>
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isWhite ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-muted)',
                marginTop: '3px',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}

      <style jsx>{`
        .aireasy-logo-root:hover .plane-mark-wrapper {
          transform: translate(2px, -2px);
        }
      `}</style>
    </div>
  );
}
