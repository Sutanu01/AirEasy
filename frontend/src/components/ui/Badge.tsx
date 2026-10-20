import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
  className?: string;
}

export function Badge({ children, variant = 'primary', size = 'md', style, className }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    primary: {
      background: 'var(--color-primary-subtle)',
      color: 'var(--color-primary)',
      border: '1px solid rgba(248, 68, 100, 0.2)',
    },
    success: {
      background: 'var(--color-success-bg)',
      color: 'var(--color-success)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    },
    warning: {
      background: 'var(--color-warning-bg)',
      color: 'var(--color-warning)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    },
    danger: {
      background: 'var(--color-danger-bg)',
      color: 'var(--color-danger)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    info: {
      background: 'var(--color-info-bg)',
      color: 'var(--color-info)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
    },
    neutral: {
      background: 'var(--bg-muted)',
      color: 'var(--text-muted)',
      border: '1px solid var(--border-subtle)',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
