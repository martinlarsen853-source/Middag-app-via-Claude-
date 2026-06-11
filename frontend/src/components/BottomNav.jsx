import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../theme.js';

const TABS = [
  {
    path: '/app',
    label: 'Hjem',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9.5z" />
      </svg>
    ),
  },
  {
    path: '/meals/new',
    label: 'Ny rett',
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    path: '/ingredients',
    label: 'Ingredienser',
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14l-1.3 12.1a2 2 0 01-2 1.9H8.3a2 2 0 01-2-1.9L5 7z" />
        <path strokeLinecap="round" d="M8.5 7a3.5 3.5 0 117 0" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="no-print" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      display: 'flex',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: `1px solid ${colors.border}`,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(tab => {
        const active = location.pathname === tab.path
          || (tab.path === '/app' && location.pathname.startsWith('/meal/'));
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '9px 0 7px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? colors.accent : colors.textTertiary,
              transition: 'color 0.15s',
            }}
          >
            {tab.icon(active)}
            <span style={{
              fontSize: '0.68rem',
              fontWeight: active ? 700 : 500,
              letterSpacing: '0.01em',
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
