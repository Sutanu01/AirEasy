import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  glass?: boolean;
}

export function Card({
  children,
  hoverEffect = false,
  glass = false,
  style,
  ...props
}: CardProps) {
  return (
    <div
      style={{
        background: glass ? 'var(--bg-surface-glass)' : 'var(--bg-surface)',
        backdropFilter: glass ? 'blur(12px)' : 'none',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
        padding: '24px',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverEffect) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
