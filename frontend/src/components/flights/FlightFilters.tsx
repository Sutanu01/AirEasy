'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FlightFiltersProps {
  maxPrice: number;
  selectedPrice: number;
  onPriceChange: (val: number) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  onReset: () => void;
}

export function FlightFilters({
  maxPrice,
  selectedPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  onReset,
}: FlightFiltersProps) {
  const sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'departureTime_asc', label: 'Departure: Earliest' },
    { value: 'departureTime_desc', label: 'Departure: Latest' },
    { value: 'availableSeats_desc', label: 'Seats: Most Available' },
  ];

  return (
    <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px' }}>
          <SlidersHorizontal size={18} color="var(--color-primary)" />
          <span>Filters &amp; Sort</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          icon={<RotateCcw size={14} />}
          style={{ fontSize: '12px', padding: '4px 8px' }}
        >
          Reset
        </Button>
      </div>

      {/* Sort Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
          Sort Flights By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-subtle)',
            background: 'var(--bg-input)',
            color: 'var(--text-main)',
            fontSize: '13px',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
            Max Price
          </label>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>
            ₹{selectedPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min={1000}
          max={Math.max(maxPrice, 15000)}
          step={500}
          value={selectedPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--color-primary)',
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>₹1,000</span>
          <span>₹{Math.max(maxPrice, 15000).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </Card>
  );
}
