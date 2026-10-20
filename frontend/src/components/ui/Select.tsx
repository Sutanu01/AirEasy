'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  value?: string | number;
  onChange?: (e: { target: { value: string } }) => void;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  style,
  id,
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const displayText = selectedOption?.label || placeholder || 'Select...';

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.children;
      const item = items[placeholder ? highlightedIndex + 1 : highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen, placeholder]);

  const handleSelect = useCallback(
    (optValue: string | number) => {
      onChange?.({ target: { value: String(optValue) } });
      setIsOpen(false);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(options.findIndex((o) => String(o.value) === String(value)));
          } else if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            handleSelect(options[highlightedIndex].value);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, highlightedIndex, options, value, handleSelect]
  );

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', position: 'relative' }}
    >
      {label && (
        <label
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-primary)' }}>*</span>}
        </label>
      )}

      {/* Hidden native select for form submission */}
      <input type="hidden" name={name} value={String(value ?? '')} />

      {/* Trigger Button */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          width: '100%',
          padding: '12px 14px',
          fontSize: '14px',
          fontWeight: selectedOption ? 600 : 400,
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${error ? 'var(--color-danger)' : isOpen ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
          background: 'var(--bg-input)',
          color: selectedOption ? 'var(--text-main)' : 'var(--text-muted)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: isOpen ? '0 0 0 3px var(--color-primary-glow)' : 'none',
          opacity: disabled ? 0.6 : 1,
          ...style,
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {displayText}
        </span>
        <ChevronDown
          size={16}
          style={{
            color: 'var(--text-muted)',
            flexShrink: 0,
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}
        />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            maxHeight: '260px',
            overflowY: 'auto',
            background: 'var(--bg-surface-elevated)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 12px 28px -4px rgba(0,0,0,0.15), 0 4px 10px -2px rgba(0,0,0,0.08)',
            zIndex: 1000,
            padding: '4px',
            animation: 'selectDropIn 0.15s ease-out',
          }}
        >
          {placeholder && (
            <div
              role="option"
              aria-selected={!value || value === ''}
              onClick={() => handleSelect('')}
              style={{
                padding: '10px 12px',
                fontSize: '13px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                transition: 'background 0.1s ease',
                fontStyle: 'italic',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {placeholder}
            </div>
          )}
          {options.map((opt, idx) => {
            const isSelected = String(opt.value) === String(value);
            const isHighlighted = idx === highlightedIndex;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'var(--color-primary)' : 'var(--text-main)',
                  background: isSelected
                    ? 'var(--color-primary-subtle)'
                    : isHighlighted
                    ? 'var(--bg-muted)'
                    : 'transparent',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.1s ease',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {opt.label}
                </span>
                {isSelected && <Check size={14} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />}
              </div>
            );
          })}
          {options.length === 0 && (
            <div style={{ padding: '16px 12px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
              No options available
            </div>
          )}
        </div>
      )}

      {error && (
        <span style={{ fontSize: '12px', color: 'var(--color-danger)', fontWeight: 500 }}>
          {error}
        </span>
      )}

      <style jsx>{`
        @keyframes selectDropIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
