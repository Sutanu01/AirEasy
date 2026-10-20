'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AirEasyLogo } from '@/components/brand/AirEasyLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Ticket, Shield, LogOut, ChevronDown, Menu, X } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAirlineStaff } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: active ? 700 : 500,
    color: active ? 'var(--color-primary)' : 'var(--text-main)',
    padding: '8px 12px',
    borderRadius: 'var(--radius-md)',
    background: active ? 'var(--color-primary-subtle)' : 'transparent',
    transition: 'all var(--transition-fast)',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--bg-surface-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link href="/">
          <AirEasyLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="desktop-nav"
        >
          {isAirlineStaff && (
            <Link href="/admin" style={navLinkStyle(pathname.startsWith('/admin'))}>
              <Shield size={16} />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Action Controls & User Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />

          {user ? (
            <div ref={profileRef} style={{ position: 'relative' }}>
              {/* User Profile Pill Trigger */}
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: profileMenuOpen ? 'var(--color-primary-subtle)' : 'var(--bg-muted)',
                  border: `1.5px solid ${profileMenuOpen ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                aria-label="User profile menu"
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    maxWidth: '130px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'var(--text-main)',
                  }}
                >
                  {user.email.split('@')[0]}
                </span>
                <ChevronDown
                  size={14}
                  color="var(--text-muted)"
                  style={{
                    transform: profileMenuOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--transition-fast)',
                  }}
                />
              </button>

              {/* Profile Dropdown Card */}
              {profileMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '230px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px',
                    zIndex: 1000,
                    animation: 'fadeIn 0.15s ease-out',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px 10px',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '6px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                      }}
                    >
                      Signed in as
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: '2px',
                      }}
                    >
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/bookings"
                    onClick={() => setProfileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isActive('/bookings') ? 'var(--color-primary)' : 'var(--text-main)',
                      background: isActive('/bookings') ? 'var(--color-primary-subtle)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <Ticket size={16} color="var(--color-primary)" />
                    My Bookings
                  </Link>

                  {isAirlineStaff && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: pathname.startsWith('/admin') ? 'var(--color-primary)' : 'var(--text-main)',
                        background: pathname.startsWith('/admin') ? 'var(--color-primary-subtle)' : 'transparent',
                        textDecoration: 'none',
                        transition: 'background var(--transition-fast)',
                      }}
                    >
                      <Shield size={16} color="var(--color-primary)" />
                      Staff Portal
                    </Link>
                  )}

                  <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '6px 0' }} />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-danger)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background var(--transition-fast)',
                    }}
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '8px',
              color: 'var(--text-main)',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {user && (
            <Link
              href="/bookings"
              style={navLinkStyle(isActive('/bookings'))}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Ticket size={16} />
              My Bookings
            </Link>
          )}
          {isAirlineStaff && (
            <Link
              href="/admin"
              style={navLinkStyle(pathname.startsWith('/admin'))}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield size={16} />
              Admin Portal
            </Link>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          :global(.desktop-nav) {
            display: none !important;
          }
          :global(.mobile-toggle) {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
