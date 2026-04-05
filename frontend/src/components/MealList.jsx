import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeals, markEaten, updatePersons } from '../api.js';

// Range input styling
const rangeInputCSS = `
  input[type='range'].dual-range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    pointer-events: auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #c2410c;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(194, 65, 12, 0.3);
    cursor: pointer;
  }

  input[type='range'].dual-range-input::-moz-range-thumb {
    pointer-events: auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #c2410c;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(194, 65, 12, 0.3);
    cursor: pointer;
  }

  input[type='range'].dual-range-input::-moz-range-track {
    background: transparent;
    border: none;
  }
`;

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
  const [timeRange, setTimeRange]   = useState({ min: 10, max: 100 });
  const [priceRange, setPriceRange] = useState({ min: 50, max: 1500 });
  const [persons, setPersons] = useState(() => {
    try { return JSON.parse(localStorage.getItem('middag_user') || '{}').default_persons || 2; }
    catch { return 2; }
  });

  useEffect(() => { loadMeals(sort); }, [sort]);

  // Inject range input styles
  useEffect(() => {
    if (!document.getElementById('range-input-styles')) {
      const style = document.createElement('style');
      style.id = 'range-input-styles';
      style.textContent = rangeInputCSS;
      document.head.appendChild(style);
    }
  }, []);

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

  function clearFilters() {
    setSelectedTags(new Set());
    setTimeRange({ min: 10, max: 100 });
    setPriceRange({ min: 50, max: 1500 });
  }

  // Map price_level to estimated price range
  function getMealPrice(meal) {
    if (meal.price && typeof meal.price === 'number') return meal.price;
    // Temporary mapping until Oda scraping is implemented
    const priceMap = { 1: 100, 2: 350, 3: 900 };
    return priceMap[meal.price_level] || 500;
  }

  // Check if meal matches active filters
  function isFilterMatch(meal) {
    const tagMatch = selectedTags.size === 0 || meal.tags?.some(t => selectedTags.has(t));
    const timeMatch = meal.time_minutes >= timeRange.min && meal.time_minutes <= timeRange.max;
    const priceMatch = getMealPrice(meal) >= priceRange.min && getMealPrice(meal) <= priceRange.max;
    return tagMatch && timeMatch && priceMatch;
  }

  const filtered = meals.filter(isFilterMatch);

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
          {/* Range Filters */}
          <DualRangeSlider
            label="⏱ Tid"
            min={10}
            max={100}
            step={5}
            value={timeRange}
            onChange={setTimeRange}
            formatLabel={(min, max) => `${min}-${max} min`}
          />
          <DualRangeSlider
            label="💰 Pris"
            min={50}
            max={1500}
            step={50}
            value={priceRange}
            onChange={setPriceRange}
            formatLabel={(min, max) => `${min}-${max} kr`}
          />

          {/* Divider */}
          <div style={{ borderTop: '1px solid #f0ede9', margin: '24px 0 16px', opacity: 0.5 }} />

          {/* Tag Filters */}
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
          {(() => {
            const hasActiveFilters = selectedTags.size > 0 || timeRange.min > 10 || timeRange.max < 100 || priceRange.min > 50 || priceRange.max < 1500;
            return hasActiveFilters && (
              <button onClick={clearFilters} style={s.clearBtn}>Nullstill</button>
            );
          })()}
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
          {(() => {
            const activeCount = selectedTags.size + (timeRange.min > 10 || timeRange.max < 100 ? 1 : 0) + (priceRange.min > 50 || priceRange.max < 1500 ? 1 : 0);
            return (
              <button
                onClick={() => setDrawerOpen(true)}
                style={{ ...s.filterBtn, ...(activeCount > 0 ? s.filterBtnActive : {}) }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 3h14v1.5l-5 5V15l-4-2V9.5L1 4.5V3z"/>
                </svg>
                Filter
                {activeCount > 0 && (
                  <span style={s.badge}>{activeCount}</span>
                )}
              </button>
            );
          })()}

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

function DualRangeSlider({ label, min, max, step, value, onChange, formatLabel }) {
  const handleMinChange = (e) => {
    const newMin = Math.min(parseInt(e.target.value), value.max);
    onChange({ ...value, min: newMin });
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(parseInt(e.target.value), value.min);
    onChange({ ...value, max: newMax });
  };

  const minPercent = ((value.min - min) / (max - min)) * 100;
  const maxPercent = ((value.max - min) / (max - min)) * 100;

  return (
    <div style={s.rangeSliderGroup}>
      <p style={s.groupLabel}>{label}</p>
      <p style={s.rangeValue}>{formatLabel(value.min, value.max)}</p>

      <div style={s.rangeSliderContainer}>
        <div style={{
          ...s.rangeTrack,
          background: `linear-gradient(to right, #e7e5e2 0%, #e7e5e2 ${minPercent}%, #c2410c ${minPercent}%, #c2410c ${maxPercent}%, #e7e5e2 ${maxPercent}%, #e7e5e2 100%)`
        }} />

        <input
          type="range"
          className="dual-range-input"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={handleMinChange}
          style={{
            ...s.rangeInput,
            zIndex: value.min > max - (max - min) * 0.1 ? 5 : 3,
          }}
        />
        <input
          type="range"
          className="dual-range-input"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={handleMaxChange}
          style={{
            ...s.rangeInput,
            zIndex: 4,
          }}
        />
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

  // Range Slider
  rangeSliderGroup: { marginBottom: 24 },
  rangeValue: {
    fontSize: '0.9rem', fontWeight: 600, color: '#44403c',
    margin: '8px 0 12px', fontFamily: 'system-ui, sans-serif',
  },
  rangeSliderContainer: {
    position: 'relative', height: 28, marginBottom: 4,
  },
  rangeTrack: {
    position: 'absolute', top: 11, left: 0, right: 0, height: 6,
    borderRadius: 3, pointerEvents: 'none',
  },
  rangeInput: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 28,
    pointerEvents: 'none', background: 'none', border: 'none', outline: 'none',
    WebkitAppearance: 'none', appearance: 'none', zIndex: 3,
    '&::-webkit-slider-thumb': {
      WebkitAppearance: 'none',
      appearance: 'none',
      pointerEvents: 'auto',
      width: 20, height: 20, borderRadius: '50%',
      background: '#c2410c', border: '2px solid #fff',
      boxShadow: '0 2px 8px rgba(194,65,12,0.3)',
      cursor: 'pointer',
    },
    '&::-moz-range-thumb': {
      pointerEvents: 'auto',
      width: 20, height: 20, borderRadius: '50%',
      background: '#c2410c', border: '2px solid #fff',
      boxShadow: '0 2px 8px rgba(194,65,12,0.3)',
      cursor: 'pointer',
    },
  },
};
