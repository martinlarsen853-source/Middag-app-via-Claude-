import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MealCreatePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '20px',
      background: '#faf8f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', color: '#1c1917', marginBottom: '16px' }}>
        🚀 Coming Soon
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#78716c', marginBottom: '32px', maxWidth: '400px' }}>
        Funksjonen for å lage nye middager er under utvikling. Kom tilbake snart!
      </p>
      <button
        onClick={() => navigate('/app')}
        style={{
          padding: '12px 24px',
          fontSize: '1rem',
          background: '#c2410c',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Tilbake til middager
      </button>
    </div>
  );
}
