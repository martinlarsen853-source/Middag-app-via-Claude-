import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeals, markEaten, updatePersons } from '../api.js';

const SORT_OPTIONS = [
  { key: 'random',  label: '🎲 Tilfeldig' },
  { key: 'time',    label: '⏱ Raskest' },
  { key: 'price',   label: '💰 Billigst' },
  { key: 'rarely',  label: '📅 Sjelden spist' },
];

const PRICE_LABEL = ['', 'kr', 'kr kr', 'kr kr kr'];

export default function MealList() {
  const navigate = useNavigate();
  const [meals, setMeals]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]       = useState('random');
  const [persons, setPersons] = useState(() => {
    try { return JSON.parse(localStorage.getItem('middag_user') || '{}').default_persons || 2; }
    catch { return 2; }
  });

  useEffect(() => { loadMeals(sort); }, [sort]);

  async function loadMeals(s) {
    setLoading(true);
    try { setMeals(await getMeals(s)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function handleSelect(meal) {
    markEaten(meal.id).catch(() => {});
    updatePersons(persons).catch(() => {});
    const u = JSON.parse(localStorage.getItem('middag_user') || '{}');
    u.default_persons = persons;
    localStorage.setItem('middag_user', JSON.stringify(u));
    navigate(`/meal/${meal.id}`);
  }

  return (
    <div style={s.page}>

      {/* Sticky header */}
      <div style={s.header}>
        <div style={s.headerTop}>
          <div>
            <h2 style={s.heading}>Hva blir det?</h2>
            <p style={s.sub}>Bla gjennom og velg</p>
          </div>
          {/* Person counter */}
          <div style={s.personBox}>
            <button onClick={() => setPersons(p => Math.max(1, p - 1))} style={s.personBtn}>−</button>
            <span style={s.personCount}>{persons}</span>
            <button onClick={() => setPersons(p => Math.min(10, p + 1))} style={s.personBtn}>+</button>
            <span style={s.personLabel}>pers.</span>
          </div>
        </div>

        {/* Sort pills */}
        <div style={s.sortRow}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              style={{ ...s.pill, ...(sort === opt.key ? s.pillActive : {}) }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={s.list}>
        {loading ? (
          <div style={s.loadingWrap}>
            <span style={s.loadingEmoji}>🍽</span>
            <p style={s.loadingText}>Henter middager…</p>
          </div>
        ) : meals.map((meal, i) => (
          <MealCard key={meal.id} meal={meal} index={i} onSelect={() => handleSelect(meal)} />
        ))}
      </div>
    </div>
  );
}

function MealCard({ meal, index, onSelect }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        ...s.card,
        transform: pressed ? 'scale(0.985)' : 'scale(1)',
        boxShadow: pressed
          ? '0 1px 4px rgba(0,0,0,0.06)'
          : '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        animationDelay: `${index * 40}ms`,
      }}
    >
      <span style={s.emoji}>{meal.emoji}</span>

      <div style={s.cardBody}>
        <div style={s.cardTop}>
          <h3 style={s.mealName}>{meal.name}</h3>
          <span style={s.category}>{meal.category}</span>
        </div>
        <p style={s.desc}>{meal.description}</p>
        <div style={s.badges}>
          <span style={s.badge}>⏱ {meal.time_minutes} min</span>
          <span style={{ ...s.badge, ...s.priceBadge }}>{PRICE_LABEL[meal.price_level]}</span>
        </div>
      </div>

      <span style={s.arrow}>›</span>
    </div>
  );
}

const s = {
  page: {
    background: '#faf8f5', minHeight: '100%',
    fontFamily: 'system-ui, sans-serif',
  },

  header: {
    position: 'sticky', top: 0, zIndex: 10,
    background: 'rgba(250,248,245,0.95)', backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #e7e5e2',
    padding: '16px 20px 12px',
  },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heading: {
    fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 800,
    color: '#1c1917', margin: 0, letterSpacing: '-0.02em',
  },
  sub: { color: '#a8a29e', fontSize: '0.8rem', margin: '2px 0 0', },

  personBox: { display: 'flex', alignItems: 'center', gap: 6 },
  personBtn: {
    width: 28, height: 28, borderRadius: 8,
    border: '1.5px solid #e7e5e2', background: '#fff',
    color: '#1c1917', fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  personCount: { fontWeight: 700, fontSize: '1rem', color: '#1c1917', minWidth: 16, textAlign: 'center' },
  personLabel: { color: '#a8a29e', fontSize: '0.78rem' },

  sortRow: { display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 },
  pill: {
    flexShrink: 0, padding: '6px 14px', borderRadius: 999,
    border: '1.5px solid #e7e5e2', background: '#fff',
    color: '#78716c', fontSize: '0.8rem', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
  },
  pillActive: {
    background: '#c2410c', borderColor: '#c2410c', color: '#fff',
  },

  list: { padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 },

  card: {
    display: 'flex', alignItems: 'center', gap: 16,
    background: '#fff', borderRadius: 20, padding: '18px 16px',
    border: '1px solid #f0ede9',
    cursor: 'pointer', transition: 'transform 0.12s, box-shadow 0.12s',
    userSelect: 'none',
  },
  emoji: { fontSize: '2.8rem', lineHeight: 1, flexShrink: 0 },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 },
  mealName: {
    fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.05rem',
    color: '#1c1917', margin: 0, letterSpacing: '-0.01em',
  },
  category: {
    flexShrink: 0, fontSize: '0.72rem', fontWeight: 600,
    color: '#c2410c', background: '#fff7ed',
    border: '1px solid #fed7aa', borderRadius: 999,
    padding: '2px 8px',
  },
  desc: {
    color: '#78716c', fontSize: '0.82rem', lineHeight: 1.5,
    margin: '0 0 8px',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  badges: { display: 'flex', gap: 6 },
  badge: {
    fontSize: '0.75rem', fontWeight: 600, color: '#78716c',
    background: '#f5f5f4', borderRadius: 999, padding: '3px 10px',
  },
  priceBadge: { color: '#c2410c', background: '#fff7ed' },
  arrow: { color: '#d6d3d1', fontSize: '1.5rem', flexShrink: 0, fontWeight: 300 },

  loadingWrap: { textAlign: 'center', paddingTop: 80 },
  loadingEmoji: { fontSize: '3rem', display: 'block', marginBottom: 12 },
  loadingText: { color: '#a8a29e', fontSize: '1rem' },
};
