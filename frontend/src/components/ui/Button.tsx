'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  style,
  ...props
}: ButtonProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '13px', borderRadius: 'var(--radius-sm)' },
    md: { padding: '10px 18px', fontSize: '14px', borderRadius: 'var(--radius-md)' },
    lg: { padding: '14px 24px', fontSize: '16px', borderRadius: 'var(--radius-md)' },
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #F84464 0%, #D81B60 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(248, 68, 100, 0.25)',
          border: 'none',
        };
      case 'secondary':
        return {
          background: 'var(--bg-muted)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--color-primary)',
          border: '1.5px solid var(--color-primary)',
        };
      case 'danger':
        return {
          background: 'var(--color-danger)',
          color: '#FFFFFF',
          border: 'none',
        };
      case 'ghost':
      default:
        return {
          background: 'transparent',
          color: 'var(--text-main)',
          border: 'none',
        };
    }
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.65 : 1,
        transition: 'all var(--transition-fast)',
        outline: 'none',
        ...sizeStyles[size],
        ...getVariantStyles(),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(248, 68, 100, 0.4)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 68, 100, 0.25)';
          }
        }
      }}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : icon}
      {children}
    </button>
  );
}
