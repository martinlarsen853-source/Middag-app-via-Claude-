import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeals, markEaten, updatePersons } from '../api.js';

const SORT_OPTIONS = [
  { key: 'random', label: '🎲 Tilfeldig' },
  { key: 'time',   label: '⏱ Raskest' },
  { key: 'price',  label: '💰 Billigst' },
  { key: 'rarely', label: '📅 Sjelden' },
];

const FILTER_GROUPS = [
  { label: 'Protein & kosthold', tags: ['Kjøtt', 'Kylling', 'Fisk', 'Gris', 'Vegetar'] },
  { label: 'Anledning',          tags: ['Hverdags', 'Helg', 'Fest', 'Kos', 'Barn'] },
  { label: 'Tilberedning',       tags: ['Enkelt', 'Langtids'] },
  { label: 'Type',               tags: ['Pasta', 'Suppe', 'Salat', 'Meksikansk', 'Asiatisk'] },
];

const PRICE_LABEL = ['', 'kr', 'kr kr', 'kr kr kr'];

export default function MealList() {
  const navigate = useNavigate();
  const [meals, setMeals]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [sort, setSort]             = useState('random');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [persons, setPersons] = useState(() => {
    try { return JSON.parse(localStorage.getItem('middag_user') || '{}').default_persons || 2; }
    catch { return 2; }
  });

  useEffect(() => { loadMeals(sort); }, [sort]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  async function loadMeals(s) {
    setLoading(true);
    try { setMeals(await getMeals(s)); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function toggleTag(tag) {
    setSelectedTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function clearFilters() { setSelectedTags(new Set()); }

  const filtered = selectedTags.size === 0
    ? meals
    : meals.filter(m => m.tags?.some(t => selectedTags.has(t)));

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

      {/* ── FILTER DRAWER ── */}
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          ...s.backdrop,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'all' : 'none',
        }}
      />

      {/* Panel */}
      <div style={{
        ...s.drawer,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}>
        <div style={s.drawerHeader}>
          <span style={s.drawerTitle}>Filter</span>
          <button onClick={() => setDrawerOpen(false)} style={s.closeBtn}>✕</button>
        </div>

        <div style={s.drawerBody}>
          {FILTER_GROUPS.map(group => (
            <div key={group.label} style={s.filterGroup}>
              <p style={s.groupLabel}>{group.label}</p>
              <div style={s.chipRow}>
                {group.tags.map(tag => {
                  const active = selectedTags.has(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{ ...s.chip, ...(active ? s.chipActive : {}) }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={s.drawerFooter}>
          {selectedTags.size > 0 && (
            <button onClick={clearFilters} style={s.clearBtn}>Nullstill</button>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            style={s.showBtn}
          >
            Vis {filtered.length} middag{filtered.length !== 1 ? 'er' : ''}
          </button>
        </div>
      </div>

      {/* ── STICKY HEADER ── */}
      <div style={s.header}>
        <div style={s.headerTop}>
          <div>
            <h2 style={s.heading}>Hva blir det?</h2>
            <p style={s.sub}>Bla gjennom og velg</p>
          </div>
          <div style={s.personBox}>
            <button onClick={() => setPersons(p => Math.max(1, p - 1))} style={s.personBtn}>−</button>
            <span style={s.personCount}>{persons}</span>
            <button onClick={() => setPersons(p => Math.min(10, p + 1))} style={s.personBtn}>+</button>
            <span style={s.personLabel}>pers.</span>
          </div>
        </div>

        <div style={s.toolRow}>
          {/* Filter button */}
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ ...s.filterBtn, ...(selectedTags.size > 0 ? s.filterBtnActive : {}) }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3h14v1.5l-5 5V15l-4-2V9.5L1 4.5V3z"/>
            </svg>
            Filter
            {selectedTags.size > 0 && (
              <span style={s.badge}>{selectedTags.size}</span>
            )}
          </button>

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

        {/* Active filter tags */}
        {selectedTags.size > 0 && (
          <div style={s.activeTagRow}>
            <span style={s.activeTagLabel}>Filtrert:</span>
            {[...selectedTags].map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} style={s.activeTag}>
                {tag} ✕
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── LIST ── */}
      <div style={s.list}>
        {loading ? (
          <div style={s.loadingWrap}>
            <span style={s.loadingEmoji}>🍽</span>
            <p style={s.loadingText}>Henter middager…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={s.loadingWrap}>
            <span style={s.loadingEmoji}>🔍</span>
            <p style={s.loadingText}>Ingen middager matcher filteret</p>
            <button onClick={clearFilters} style={s.resetBtn}>Nullstill filter</button>
          </div>
        ) : filtered.map((meal, i) => (
          <MealCard key={meal.id} meal={meal} index={i} onSelect={() => handleSelect(meal)} />
        ))}
      </div>
    </div>
  );
}

function MealCard({ meal, onSelect }) {
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
          <span style={s.badge2}>⏱ {meal.time_minutes} min</span>
          <span style={{ ...s.badge2, ...s.priceBadge }}>{PRICE_LABEL[meal.price_level]}</span>
        </div>
      </div>
      <span style={s.arrow}>›</span>
    </div>
  );
}

const s = {
  page: { background: '#faf8f5', minHeight: '100%', fontFamily: 'system-ui, sans-serif' },

  // Drawer
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 40,
    background: 'rgba(28,25,23,0.5)', backdropFilter: 'blur(2px)',
    transition: 'opacity 0.25s ease',
  },
  drawer: {
    position: 'fixed', top: 0, left: 0, bottom: 0,
    width: 300, zIndex: 50,
    background: '#fff', borderRight: '1px solid #f0ede9',
    boxShadow: '4px 0 40px rgba(0,0,0,0.12)',
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
  },
  drawerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 20px 16px', borderBottom: '1px solid #f0ede9',
  },
  drawerTitle: {
    fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 800,
    color: '#1c1917', letterSpacing: '-0.02em',
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 8,
    border: '1.5px solid #e7e5e2', background: '#faf8f5',
    color: '#78716c', fontSize: '0.9rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  drawerBody: { flex: 1, overflowY: 'auto', padding: '16px 20px' },
  filterGroup: { marginBottom: 24 },
  groupLabel: {
    fontSize: '0.72rem', fontWeight: 700, color: '#a8a29e',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    margin: '0 0 10px',
  },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    padding: '7px 14px', borderRadius: 999,
    border: '1.5px solid #e7e5e2', background: '#faf8f5',
    color: '#44403c', fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  chipActive: {
    background: '#c2410c', borderColor: '#c2410c', color: '#fff',
  },
  drawerFooter: {
    padding: '16px 20px', borderTop: '1px solid #f0ede9',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  clearBtn: {
    background: 'none', border: 'none', color: '#78716c',
    fontSize: '0.88rem', cursor: 'pointer', textAlign: 'center',
    textDecoration: 'underline',
  },
  showBtn: {
    background: '#c2410c', color: '#fff', border: 'none',
    borderRadius: 12, padding: '14px', fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 16px rgba(194,65,12,0.25)',
  },

  // Header
  header: {
    position: 'sticky', top: 0, zIndex: 10,
    background: 'rgba(250,248,245,0.95)', backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #e7e5e2', padding: '16px 16px 12px',
  },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heading: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 800, color: '#1c1917', margin: 0, letterSpacing: '-0.02em' },
  sub: { color: '#a8a29e', fontSize: '0.8rem', margin: '2px 0 0' },
  personBox: { display: 'flex', alignItems: 'center', gap: 6 },
  personBtn: {
    width: 28, height: 28, borderRadius: 8,
    border: '1.5px solid #e7e5e2', background: '#fff',
    color: '#1c1917', fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  personCount: { fontWeight: 700, fontSize: '1rem', color: '#1c1917', minWidth: 16, textAlign: 'center' },
  personLabel: { color: '#a8a29e', fontSize: '0.78rem' },

  toolRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 },
  filterBtn: {
    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 999,
    border: '1.5px solid #e7e5e2', background: '#fff',
    color: '#44403c', fontSize: '0.8rem', fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
  },
  filterBtnActive: { background: '#1c1917', borderColor: '#1c1917', color: '#fff' },
  badge: {
    minWidth: 18, height: 18, borderRadius: 999,
    background: '#c2410c', color: '#fff',
    fontSize: '0.7rem', fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 4px',
  },

  sortRow: { display: 'flex', gap: 6, overflowX: 'auto', flex: 1 },
  pill: {
    flexShrink: 0, padding: '6px 12px', borderRadius: 999,
    border: '1.5px solid #e7e5e2', background: '#fff',
    color: '#78716c', fontSize: '0.78rem', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
  },
  pillActive: { background: '#c2410c', borderColor: '#c2410c', color: '#fff' },

  activeTagRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  activeTagLabel: { fontSize: '0.72rem', color: '#a8a29e', fontWeight: 600 },
  activeTag: {
    padding: '3px 10px', borderRadius: 999,
    background: '#fff7ed', border: '1px solid #fed7aa',
    color: '#c2410c', fontSize: '0.75rem', fontWeight: 600,
    cursor: 'pointer',
  },

  // Cards
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
  mealName: { fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '1.05rem', color: '#1c1917', margin: 0, letterSpacing: '-0.01em' },
  category: {
    flexShrink: 0, fontSize: '0.72rem', fontWeight: 600,
    color: '#c2410c', background: '#fff7ed', border: '1px solid #fed7aa',
    borderRadius: 999, padding: '2px 8px',
  },
  desc: {
    color: '#78716c', fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 8px',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  badges: { display: 'flex', gap: 6 },
  badge2: { fontSize: '0.75rem', fontWeight: 600, color: '#78716c', background: '#f5f5f4', borderRadius: 999, padding: '3px 10px' },
  priceBadge: { color: '#c2410c', background: '#fff7ed' },
  arrow: { color: '#d6d3d1', fontSize: '1.5rem', flexShrink: 0, fontWeight: 300 },

  loadingWrap: { textAlign: 'center', paddingTop: 80 },
  loadingEmoji: { fontSize: '3rem', display: 'block', marginBottom: 12 },
  loadingText: { color: '#a8a29e', fontSize: '1rem', marginBottom: 16 },
  resetBtn: {
    background: '#c2410c', color: '#fff', border: 'none',
    borderRadius: 10, padding: '10px 20px', fontSize: '0.9rem',
    fontWeight: 600, cursor: 'pointer',
  },
};
