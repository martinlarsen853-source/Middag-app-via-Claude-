import React from 'react';

export default function PersonCounter({ value, onChange, min = 1, max = 20, size = 'md' }) {
  const sizeClasses = {
    sm: {
      button: 'w-7 h-7 text-sm',
      text: 'text-sm font-semibold w-8 text-center'
    },
    md: {
      button: 'w-9 h-9 text-base',
      text: 'text-base font-bold w-10 text-center'
    },
    lg: {
      button: 'w-11 h-11 text-lg',
      text: 'text-xl font-bold w-12 text-center'
    }
  };

  const classes = sizeClasses[size] || sizeClasses.md;

  function decrement() {
    if (value > min) onChange(value - 1);
  }

  function increment() {
    if (value < max) onChange(value + 1);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className={`${classes.button} rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center border border-white/20`}
        aria-label="Reduser antall"
      >
        −
      </button>

      <div className="flex items-center gap-1">
        <span className={`${classes.text} text-white tabular-nums`}>
          {value}
        </span>
        <span className="text-gray-400 text-sm">pers.</span>
      </div>

      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className={`${classes.button} rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-all duration-150 hover:scale-110 active:scale-95 flex items-center justify-center border border-white/20`}
        aria-label="Øk antall"
      >
        +
      </button>
    </div>
  );
}
