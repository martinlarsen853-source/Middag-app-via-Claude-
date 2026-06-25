import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShoppingList } from '../api.js';
import PersonCounter from './PersonCounter.jsx';
import { colors, radius } from '../theme.js';

const sectionConfig = {
  'Frukt & grønt': { icon: '🥦', color: '#1d7a40', bg: '#e9f7ee' },
  'Kjøtt & fisk': { icon: '🥩', color: '#b3362e', bg: '#fdeceb' },
  'Meieri': { icon: '🥛', color: '#8a6a14', bg: '#fdf4e0' },
  'Tørrmat': { icon: '🌾', color: '#8a5a24', bg: '#f8efe4' },
  'Frys': { icon: '🧊', color: '#1d6291', bg: '#e7f3fb' },
  'Bakeri': { icon: '🍞', color: '#856414', bg: '#f9f1de' },
  'Krydder & sauser': { icon: '🫙', color: '#6b3fa3', bg: '#f3ecfa' },
  'Drikkevarer': { icon: '🥤', color: '#1d6291', bg: '#e7f3fb' },
  'Diverse': { icon: '🛒', color: '#5f5f68', bg: '#f0f0f3' }
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
  const isComplete = checkedCount === totalItems && totalItems > 0;

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
          <p style={{ color: colors.error, marginBottom: '16px' }}>{error || 'Kunne ikke laste handleliste'}</p>
          <button
            onClick={() => navigate(-1)}
            style={{ color: colors.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
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
            color: colors.textSecond,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
            marginBottom: '16px',
          }}
          onMouseEnter={e => e.target.style.color = colors.accent}
          onMouseLeave={e => e.target.style.color = colors.textSecond}
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
          <p style={{ color: colors.textSecond, fontSize: '0.85rem', margin: 0 }}>{data.store.name}</p>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            <span>{data.meal.emoji}</span>
            <span>{data.meal.name}</span>
          </h1>
        </div>
        <div style={{ textAlign: 'right' }} className="no-print">
          <div style={{ color: colors.accent, fontWeight: 700, fontSize: '0.9rem' }}>
            {checkedCount}/{totalItems}
          </div>
          <div style={{ color: colors.textTertiary, fontSize: '0.75rem' }}>i kurven</div>
        </div>
      </div>

      {/* Progress bar */}
      {totalItems > 0 && (
        <div style={{
          height: '6px',
          background: colors.border,
          borderRadius: radius.round,
          overflow: 'hidden',
        }} className="no-print">
          <div
            style={{
              height: '100%',
              background: colors.accent,
              borderRadius: radius.round,
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
                color: colors.textSecond,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                padding: '6px 12px',
                borderRadius: radius.md,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => Object.assign(e.target.style, { color: colors.accent, borderColor: colors.accent })}
              onMouseLeave={e => Object.assign(e.target.style, { color: colors.textSecond, borderColor: colors.border })}
            >
              Fjern avhukede
            </button>
          )}
          <button
            onClick={handlePrint}
            style={{
              fontSize: '0.75rem',
              color: colors.textSecond,
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              padding: '6px 12px',
              borderRadius: radius.md,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => Object.assign(e.target.style, { color: colors.accent, borderColor: colors.accent })}
            onMouseLeave={e => Object.assign(e.target.style, { color: colors.textSecond, borderColor: colors.border })}
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
            <div key={section} style={{ borderRadius: radius.md, overflow: 'hidden', border: `1.5px solid ${config.bg}` }}>
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
                  color: allChecked ? colors.accent : colors.textTertiary,
                }}>
                  {sectionChecked}/{items.length}
                </span>
              </div>

              {/* Items */}
              <div style={{ background: colors.bgAlt, borderTop: `1px solid ${config.bg}` }}>
                {items.map((item, idx) => {
                  const isChecked = !!checked[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        opacity: isChecked ? 0.5 : 1,
                        background: isChecked ? colors.hairline : 'transparent',
                        borderBottom: idx < items.length - 1 ? `1px solid ${colors.hairline}` : 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: `2px solid ${isChecked ? colors.accent : colors.border}`,
                        background: isChecked ? colors.accent : 'transparent',
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
                      <span style={{
                        flex: 1,
                        fontSize: '0.95rem',
                        color: isChecked ? colors.textTertiary : colors.text,
                        textDecoration: isChecked ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                      }}>
                        {item.name}
                      </span>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isChecked ? colors.textTertiary : colors.textSecond,
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {isComplete && (
        <div style={{
          background: colors.bgAccent,
          border: `2px solid ${colors.accentAlt}`,
          borderRadius: radius.md,
          padding: '24px',
          textAlign: 'center',
          animation: 'fadeUp 0.4s ease-out',
        }} className="no-print">
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✨🎉</div>
          <h3 style={{ color: colors.text, fontWeight: 700, fontSize: '1.2rem', margin: '0 0 8px' }}>
            Alt er kjøpt inn!
          </h3>
          <p style={{ color: colors.textSecond, fontSize: '0.95rem', margin: '0 0 16px' }}>
            Lyst på tips? Velg en ny middag når du er ferdig med {data.meal.name.toLowerCase()}.
          </p>
        </div>
      )}

      {/* Done button */}
      <div className="no-print" style={{ paddingBottom: '16px', display: 'flex', gap: '10px', flexDirection: isComplete ? 'row-reverse' : 'column' }}>
        <button
          onClick={() => navigate('/app')}
          style={{
            flex: isComplete ? 1 : undefined,
            width: isComplete ? 'auto' : '100%',
            background: colors.accent,
            color: colors.white,
            fontWeight: 700,
            padding: '16px',
            borderRadius: radius.md,
            border: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: `0 8px 32px ${colors.accent}40`,
          }}
          onMouseEnter={e => e.target.style.background = colors.accentDark}
          onMouseLeave={e => e.target.style.background = colors.accent}
        >
          {isComplete ? '🎲 Velg ny' : 'Ferdig! 🏠'}
        </button>
        {isComplete && (
          <button
            onClick={() => navigate('/')}
            style={{
              flex: 1,
              background: colors.bgAlt,
              color: colors.text,
              fontWeight: 600,
              padding: '16px',
              borderRadius: radius.md,
              border: `1.5px solid ${colors.border}`,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => Object.assign(e.target.style, { borderColor: colors.accent, color: colors.accent })}
            onMouseLeave={e => Object.assign(e.target.style, { borderColor: colors.border, color: colors.text })}
          >
            Hjem
          </button>
        )}
      </div>
    </div>
  );
}
