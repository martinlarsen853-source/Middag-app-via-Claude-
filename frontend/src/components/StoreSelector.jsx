import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeal, getStores } from '../api.js';

const storeEmojis = {
  'Rema 1000': '🔴',
  'Kiwi': '🟡',
  'Coop Extra': '🟢'
};

const storeDescriptions = {
  'Rema 1000': 'Enkelt og billig hverdagshandel',
  'Kiwi': 'Godt utvalg til lavpris',
  'Coop Extra': 'Stort utvalg, god kvalitet'
};

const storeColors = {
  'Rema 1000': { border: '#fde8d8', bg: '#fff7ed' },
  'Kiwi': { border: '#fed7aa', bg: '#fff7ed' },
  'Coop Extra': { border: '#fed7aa', bg: '#fff7ed' }
};

export default function StoreSelector() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMeal(id), getStores()])
      .then(([m, s]) => {
        setMeal(m);
        setStores(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  function handleSelectStore(storeId) {
    navigate(`/meal/${id}/shopping/${storeId}`);
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>🛒</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '448px', margin: '0 auto', width: '100%', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back */}
      <button
        onClick={() => navigate(`/meal/${id}`)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#78716c',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = '#c2410c'}
        onMouseLeave={e => e.target.style.color = '#78716c'}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tilbake
      </button>

      {/* Meal reminder */}
      {meal && (
        <div style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid #e7e5e2',
        }}>
          <span style={{ fontSize: '1.8rem' }}>{meal.emoji}</span>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#a8a29e', margin: 0 }}>Du lager</p>
            <p style={{ color: '#1c1917', fontWeight: 600, margin: 0 }}>{meal.name}</p>
          </div>
        </div>
      )}

      {/* Question */}
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1c1917', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
          Hvilken butikk er du i?
        </h1>
        <p style={{ color: '#78716c', fontSize: '0.9rem', margin: 0 }}>
          Vi sorterer handlelisten etter butikkens rekkefølge
        </p>
      </div>

      {/* Store cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {stores.map(store => {
          const colors = storeColors[store.name] || { border: '#fed7aa', bg: '#fff7ed' };
          return (
            <button
              key={store.id}
              onClick={() => handleSelectStore(store.id)}
              style={{
                width: '100%',
                background: '#fff',
                border: `1.5px solid #e7e5e2`,
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = colors.border;
                e.currentTarget.style.background = colors.bg;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e7e5e2';
                e.currentTarget.style.background = '#fff';
              }}
            >
              <div style={{ fontSize: '2.2rem' }}>{storeEmojis[store.name] || '🏪'}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#1c1917', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                  {store.name}
                </h3>
                <p style={{ color: '#78716c', fontSize: '0.8rem', marginTop: '4px', margin: '4px 0 0' }}>
                  {storeDescriptions[store.name] || 'Norsk dagligvarebutikk'}
                </p>
              </div>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#a8a29e">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>

      <p style={{ textAlign: 'center', color: '#a8a29e', fontSize: '0.75rem', margin: 0 }}>
        Handlelisten sorteres etter den valgte butikkens avdelingsrekkefølge
      </p>
    </div>
  );
}
