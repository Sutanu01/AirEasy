import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export function Spinner({ size = 24, color = 'var(--color-primary)' }: SpinnerProps) {
  return (
    <div
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `3px solid rgba(248, 68, 100, 0.2)`,
        borderRadius: '50%',
        borderTopColor: color,
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}
