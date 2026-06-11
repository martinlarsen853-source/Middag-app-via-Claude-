import React from 'react';
import { colors, radius } from '../theme.js';

export default function PersonCounter({ value, onChange, min = 1, max = 20, size = 'md' }) {
  const sizes = {
    sm: { btn: 28, font: '0.85rem', countFont: '0.9rem' },
    md: { btn: 36, font: '1rem', countFont: '1rem' },
    lg: { btn: 44, font: '1.15rem', countFont: '1.25rem' },
  };
  const sz = sizes[size] || sizes.md;

  function decrement() {
    if (value > min) onChange(value - 1);
  }

  function increment() {
    if (value < max) onChange(value + 1);
  }

  const btnStyle = (disabled) => ({
    width: sz.btn,
    height: sz.btn,
    borderRadius: radius.round,
    border: `1.5px solid ${colors.border}`,
    background: colors.bgAlt,
    color: disabled ? colors.textTertiary : colors.accent,
    fontSize: sz.font,
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    lineHeight: 1,
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        style={btnStyle(value <= min)}
        aria-label="Reduser antall"
      >
        −
      </button>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: sz.countFont,
          fontWeight: 700,
          color: colors.text,
          minWidth: 24,
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </span>
        <span style={{ color: colors.textTertiary, fontSize: '0.85rem' }}>pers.</span>
      </div>

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        style={btnStyle(value >= max)}
        aria-label="Øk antall"
      >
        +
      </button>
    </div>
  );
}
