import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShoppingList } from '../api.js';
import PersonCounter from './PersonCounter.jsx';

const sectionConfig = {
  'Frukt & grønt': { icon: '🥦', color: '#1a6e3f', bg: '#e0f7dd' },
  'Kjøtt & fisk': { icon: '🥩', color: '#8b2a2a', bg: '#ffe0e0' },
  'Meieri': { icon: '🥛', color: '#8b6f00', bg: '#fff5e0' },
  'Tørrmat': { icon: '🌾', color: '#8b4513', bg: '#ffe8cc' },
  'Frys': { icon: '🧊', color: '#003d66', bg: '#e0f4ff' },
  'Bakeri': { icon: '🍞', color: '#8b7000', bg: '#fde8b8' },
  'Krydder & sauser': { icon: '🫙', color: '#663d99', bg: '#f3e0ff' },
  'Drikkevarer': { icon: '🥤', color: '#00668b', bg: '#e0f5ff' },
  'Diverse': { icon: '🛒', color: '#78716c', bg: '#f0ede9' }
};

export default function ShoppingList() {
  const { id: mealId, storeId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [persons, setPersons] = useState(() => {
    try {
      const saved = localStorage.getItem('middag_persons_' + mealId);
      if (saved) return parseInt(saved);
      return JSON.parse(localStorage.getItem('middag_user') || '{}').default_persons || 2;
    } catch { return 2; }
  });

  const storageKey = `middag_checked_${mealId}_${storeId}`;
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch { return {}; }
  });

  const fetchList = useCallback(async (p) => {
    setLoading(true);
    try {
      const result = await getShoppingList(mealId, storeId, p);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [mealId, storeId]);

  useEffect(() => {
    fetchList(persons);
  }, [persons, fetchList]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  function toggleItem(itemId) {
    setChecked(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  }

  function clearChecked() {
    setChecked({});
    localStorage.removeItem(storageKey);
  }

  function handlePersonChange(p) {
    setPersons(p);
    localStorage.setItem('middag_persons_' + mealId, p);
  }

  function handlePrint() {
    window.print();
  }

  const totalItems = data?.sections?.reduce((acc, s) => acc + s.items.length, 0) || 0;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '3rem', animation: 'bounce 1s infinite' }}>🛒</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center' }}>
        <div>
          <p style={{ color: '#b91c1c', marginBottom: '16px' }}>{error || 'Kunne ikke laste handleliste'}</p>
          <button
            onClick={() => navigate(-1)}
            style={{ color: '#c2410c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Gå tilbake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '448px', margin: '0 auto', width: '100%', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="print-section">
      {/* Header - no-print hidden in print */}
      <div className="no-print">
        <button
          onClick={() => navigate(`/meal/${mealId}/shopping`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#78716c',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
            marginBottom: '16px',
          }}
          onMouseEnter={e => e.target.style.color = '#c2410c'}
          onMouseLeave={e => e.target.style.color = '#78716c'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Velg annen butikk
        </button>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#78716c', fontSize: '0.85rem', margin: 0 }}>{data.store.name}</p>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#1c1917',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
            fontFamily: 'Georgia, serif',
          }}>
            <span>{data.meal.emoji}</span>
            <span>{data.meal.name}</span>
          </h1>
        </div>
        <div style={{ textAlign: 'right' }} className="no-print">
          <div style={{ color: '#c2410c', fontWeight: 700, fontSize: '0.9rem' }}>
            {checkedCount}/{totalItems}
          </div>
          <div style={{ color: '#a8a29e', fontSize: '0.75rem' }}>i kurven</div>
        </div>
      </div>

      {/* Progress bar */}
      {totalItems > 0 && (
        <div style={{
          height: '6px',
          background: '#e7e5e2',
          borderRadius: '999px',
          overflow: 'hidden',
        }} className="no-print">
          <div
            style={{
              height: '100%',
              background: '#c2410c',
              borderRadius: '999px',
              transition: 'width 0.5s ease',
              width: `${(checkedCount / totalItems) * 100}%`,
            }}
          />
        </div>
      )}

      {/* Persons + actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="no-print">
        <PersonCounter value={persons} onChange={handlePersonChange} size="sm" />
        <div style={{ display: 'flex', gap: '8px' }}>
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              style={{
                fontSize: '0.75rem',
                color: '#78716c',
                background: '#faf8f5',
                border: '1px solid #e7e5e2',
                padding: '6px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => Object.assign(e.target.style, { color: '#c2410c', borderColor: '#c2410c' })}
              onMouseLeave={e => Object.assign(e.target.style, { color: '#78716c', borderColor: '#e7e5e2' })}
            >
              Fjern avhukede
            </button>
          )}
          <button
            onClick={handlePrint}
            style={{
              fontSize: '0.75rem',
              color: '#78716c',
              background: '#faf8f5',
              border: '1px solid #e7e5e2',
              padding: '6px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => Object.assign(e.target.style, { color: '#c2410c', borderColor: '#c2410c' })}
            onMouseLeave={e => Object.assign(e.target.style, { color: '#78716c', borderColor: '#e7e5e2' })}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Skriv ut
          </button>
        </div>
      </div>

      {/* Shopping sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.sections.map(({ section, items }) => {
          const config = sectionConfig[section] || sectionConfig['Diverse'];
          const sectionChecked = items.filter(item => checked[item.id]).length;
          const allChecked = sectionChecked === items.length;

          return (
            <div key={section} style={{ borderRadius: '14px', overflow: 'hidden', border: `1.5px solid ${config.bg}` }}>
              {/* Section header */}
              <div style={{
                background: config.bg,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{config.icon}</span>
                  <h3 style={{ fontWeight: 700, fontSize: '0.85rem', color: config.color, margin: 0 }}>
                    {section}
                  </h3>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: allChecked ? '#c2410c' : '#a8a29e',
                }}>
                  {sectionChecked}/{items.length}
                </span>
              </div>

              {/* Items */}
              <div style={{ background: '#fff', borderTop: `1px solid ${config.bg}` }}>
                {items.map((item, idx) => {
                  const isChecked = !!checked[item.id];
                  return (
                    <label
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        opacity: isChecked ? 0.5 : 1,
                        background: isChecked ? '#f0ede9' : 'transparent',
                        borderBottom: idx < items.length - 1 ? '1px solid #f0ede9' : 'none',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: `2px solid ${isChecked ? '#c2410c' : '#e7e5e2'}`,
                        background: isChecked ? '#c2410c' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}>
                        {isChecked && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(item.id)}
                        style={{ display: 'none' }}
                      />
                      <span style={{
                        flex: 1,
                        fontSize: '0.95rem',
                        color: isChecked ? '#a8a29e' : '#1c1917',
                        textDecoration: isChecked ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                      }}>
                        {item.name}
                      </span>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isChecked ? '#a8a29e' : '#78716c',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}>
                        {item.quantity} {item.unit}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {checkedCount === totalItems && totalItems > 0 && (
        <div style={{
          background: '#fff7ed',
          border: '2px solid #fed7aa',
          borderRadius: '14px',
          padding: '24px',
          textAlign: 'center',
        }} className="no-print">
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎉</div>
          <h3 style={{ color: '#1c1917', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 8px' }}>
            Alt er i kurven!
          </h3>
          <p style={{ color: '#78716c', fontSize: '0.9rem', margin: 0 }}>God appetitt!</p>
        </div>
      )}

      {/* Done button */}
      <div className="no-print" style={{ paddingBottom: '16px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            background: '#c2410c',
            color: '#fff',
            fontWeight: 700,
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 8px 32px rgba(194,65,12,0.25)',
          }}
          onMouseEnter={e => e.target.style.background = '#b53b0a'}
          onMouseLeave={e => e.target.style.background = '#c2410c'}
        >
          Ferdig! 🏠
        </button>
      </div>
    </div>
  );
}
