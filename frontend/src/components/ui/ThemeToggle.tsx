'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-muted)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-main)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {theme === 'light' ? (
        <Moon size={18} color="var(--text-main)" />
      ) : (
        <Sun size={18} color="#FBBF24" />
      )}
    </button>
  );
}
