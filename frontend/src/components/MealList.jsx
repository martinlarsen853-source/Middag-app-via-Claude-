import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeals, getInspirationMeals, createMeal, markEaten, updatePersons } from '../api.js';
import { colors, radius, shadows, fonts, mealGradients, defaultMealGradient, mealPhotos } from '../theme.js';

const TERRA = colors.accent;

// Range input styling
const rangeInputCSS = `
  input[type='range'].dual-range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    pointer-events: auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${TERRA};
    border: 2px solid ${colors.white};
    box-shadow: 0 2px 8px rgba(226,90,51,0.40);
    cursor: pointer;
  }

  input[type='range'].dual-range-input::-moz-range-thumb {
    pointer-events: auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${TERRA};
    border: 2px solid ${colors.white};
    box-shadow: 0 2px 8px rgba(226,90,51,0.40);
    cursor: pointer;
  }

  input[type='range'].dual-range-input::-moz-range-track {
    background: transparent;
    border: none;
  }

  /* Responsive meal grid */
  .meal-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px 16px 32px;
  }
  @media (min-width: 640px) {
    .meal-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 20px 24px 40px; }
  }
  @media (min-width: 1024px) {
    .meal-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px 32px 48px; }
  }
  @media (min-width: 1400px) {
    .meal-grid { grid-template-columns: repeat(4, 1fr); }
  }

  /* Desktop: wider page container */
  .meal-page-inner {
    max-width: 100%;
    width: 100%;
  }
  @media (min-width: 640px) {
    .meal-page-inner { max-width: 1600px; margin: 0 auto; }
  }

  /* Desktop: wider header with centered content */
  .meal-header-inner {
    max-width: 100%;
  }
  @media (min-width: 640px) {
    .meal-header-inner { max-width: 1600px; margin: 0 auto; }
  }

  /* Desktop: hero image taller */
  @media (min-width: 640px) {
    .card-hero { height: 200px !important; }
  }

  /* Velg for meg: centered on desktop */
  .pick-wrap {
    padding: 16px 16px 0;
    text-align: center;
  }
  @media (min-width: 640px) {
    .pick-wrap { max-width: 1600px; margin: 0 auto; padding: 20px 24px 0; }
    .pick-wrap button { max-width: 400px; }
  }

  /* ── Card interactions (matprat-style hover lift + photo zoom) ── */
  .meal-card .card-hero img {
    transition: transform 0.45s cubic-bezier(0.2,0,0.2,1);
  }
  @media (hover: hover) {
    .meal-card { transition: transform 0.18s ease, box-shadow 0.2s ease; }
    .meal-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(26,26,26,0.12), 0 4px 10px rgba(26,26,26,0.06);
    }
    .meal-card:hover .card-hero img { transform: scale(1.07); }
  }
  .meal-card:active { transform: scale(0.99); }

  /* ── Filter sheet: slides up (mobile) / pops in (desktop) ── */
  .filter-backdrop {
    position: fixed; inset: 0; z-index: 45;
    background: rgba(26,24,23,0.42);
    -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
    opacity: 0; pointer-events: none;
    transition: opacity 0.26s ease;
  }
  .filter-backdrop.open { opacity: 1; pointer-events: auto; }

  .filter-sheet {
    position: fixed; z-index: 50;
    left: 0; right: 0; bottom: 0;
    max-height: 86vh;
    background: #fff;
    border-radius: 22px 22px 0 0;
    box-shadow: 0 -8px 40px rgba(0,0,0,0.16);
    display: flex; flex-direction: column;
    transform: translateY(100%);
    transition: transform 0.32s cubic-bezier(0.32,0.72,0,1);
    will-change: transform;
  }
  .filter-sheet.open { transform: translateY(0); }

  .filter-grabber {
    width: 40px; height: 4px; border-radius: 999px;
    background: #d8d5cf; margin: 10px auto 2px;
  }

  @media (min-width: 700px) {
    .filter-sheet {
      left: 50%; right: auto; bottom: auto; top: 50%;
      width: 440px; max-height: 82vh;
      border-radius: 18px;
      transform: translate(-50%, -46%) scale(0.96);
      opacity: 0;
      transition: transform 0.24s cubic-bezier(0.2,0,0.2,1), opacity 0.24s ease;
      box-shadow: 0 24px 64px rgba(0,0,0,0.28);
    }
    .filter-sheet.open { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    .filter-grabber { display: none; }
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
  const [mode, setMode] = useState('mine');
  const [inspiration, setInspiration] = useState([]);
  const [addedIds, setAddedIds] = useState(new Set());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { loadMeals(sort); }, [sort]);
  useEffect(() => { getInspirationMeals().then(setInspiration).catch(() => {}); }, []);

  async function handleAddInspiration(meal) {
    try {
      await createMeal({
        name: meal.name,
        emoji: meal.emoji,
        description: meal.description || '',
        time_minutes: meal.time_minutes,
        persons: 4,
        category: meal.category || 'Annet',
        photo_url: meal.photo_url || null,
        ingredients: (meal.ingredients || []).map(i => ({
          name: i.name, quantity: i.quantity, unit: i.unit, section: i.section,
        })),
      });
      setAddedIds(prev => new Set(prev).add(meal.id));
      loadMeals(sort);
    } catch (e) {
      console.error(e);
    }
  }

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

  // Real summed ingredient price from API when available, else price_level estimate
  function getMealPrice(meal) {
    if (typeof meal.estimated_price === 'number' && meal.estimated_price > 0) return meal.estimated_price;
    const priceMap = { 1: 100, 2: 350, 3: 900 };
    return priceMap[meal.price_level] || 500;
  }

  // Weighted random pick — meals not eaten for a long time (or never) win more often
  function pickForMe() {
    if (filtered.length === 0) return;
    const now = Date.now();
    const weights = filtered.map(m => {
      if (!m.last_eaten) return 30;
      const days = (now - new Date(m.last_eaten).getTime()) / 86400000;
      return Math.max(1, Math.min(days, 60));
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < filtered.length; i++) {
      r -= weights[i];
      if (r <= 0) { handleSelect(filtered[i]); return; }
    }
    handleSelect(filtered[filtered.length - 1]);
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
    <div className="meal-page-inner">

      {/* ── FILTER SHEET (slides up on mobile, pops in on desktop) ── */}
      <div
        className={`filter-backdrop${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      <div className={`filter-sheet${drawerOpen ? ' open' : ''}`}>
        <div className="filter-grabber" />
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
          <div style={{ borderTop: `1px solid ${colors.hairline}`, margin: '24px 0 16px', opacity: 0.5 }} />

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
      <div style={{ ...s.header, boxShadow: scrolled ? '0 4px 16px rgba(26,26,26,0.07)' : 'none', borderBottomColor: scrolled ? 'transparent' : colors.borderLight }}>
      <div className="meal-header-inner">
        <div style={s.headerTop}>
          <div style={s.modeToggle}>
            <button
              onClick={() => setMode('mine')}
              style={{ ...s.modeBtn, ...(mode === 'mine' ? s.modeBtnActive : {}) }}
            >
              Mine retter
            </button>
            <button
              onClick={() => setMode('inspirasjon')}
              style={{ ...s.modeBtn, ...(mode === 'inspirasjon' ? s.modeBtnActive : {}) }}
            >
              ✨ Inspirasjon
            </button>
          </div>
          <div style={s.personBox}>
            <button onClick={() => setPersons(p => Math.max(1, p - 1))} style={s.personBtn}>−</button>
            <span style={s.personCount}>{persons}</span>
            <button onClick={() => setPersons(p => Math.min(10, p + 1))} style={s.personBtn}>+</button>
            <span style={s.personLabel}>pers.</span>
          </div>
        </div>

        {mode === 'mine' && <div style={s.toolRow}>
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
        </div>}

        {/* Active filter tags — only when in Mine modus */}
        {mode === 'mine' && selectedTags.size > 0 && (
          <div style={s.activeTagRow}>
            <span style={s.activeTagLabel}>Filtrert:</span>
            {[...selectedTags].map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} style={s.activeTag}>
                {tag} ✕
              </button>
            ))}
          </div>
        )}
      </div>{/* /meal-header-inner */}
      </div>{/* /header */}

      {mode === 'inspirasjon' ? (
        <>
          <p style={s.inspoIntro}>
            Ferdige forslag du kan legge rett til i <strong>Mine retter</strong>. Trykk på et kort for å se detaljer.
          </p>
          <div className="meal-grid">
            {inspiration.map((meal, i) => (
              <InspirationCard
                key={meal.id}
                meal={meal}
                index={i}
                added={addedIds.has(meal.id)}
                getMealPrice={getMealPrice}
                onOpen={() => navigate(`/meal/${meal.id}`)}
                onAdd={() => handleAddInspiration(meal)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* ── VELG FOR MEG ── */}
          {!loading && filtered.length > 0 && (
            <div className="pick-wrap">
              <button onClick={pickForMe} style={s.pickBtn}>
                🎲 Velg for meg
              </button>
              <p style={s.pickHint}>Foreslår noe dere ikke har spist på lenge</p>
            </div>
          )}

          {/* ── LIST ── */}
          {loading ? (
              <div style={s.loadingWrap}>
                <span style={s.loadingEmoji}>🍽</span>
                <p style={s.loadingText}>Henter middager…</p>
              </div>
            ) : meals.length === 0 ? (
              <div style={s.emptyWrap}>
                <span style={s.emptyEmoji}>🍳</span>
                <h3 style={s.emptyTitle}>Ingen egne retter ennå</h3>
                <p style={s.emptyText}>
                  Lag din første rett, eller bla i <strong>Inspirasjon</strong> og legg til ferdige forslag.
                </p>
                <div style={s.emptyActions}>
                  <button onClick={() => navigate('/meals/new')} style={s.emptyPrimary}>+ Lag ny rett</button>
                  <button onClick={() => setMode('inspirasjon')} style={s.emptySecondary}>✨ Se inspirasjon</button>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={s.loadingWrap}>
                <span style={s.loadingEmoji}>🔍</span>
                <p style={s.loadingText}>Ingen av dine retter matcher filteret</p>
                <button onClick={clearFilters} style={s.resetBtn}>Nullstill filter</button>
              </div>
            ) : (
              <div className="meal-grid">
                {filtered.map((meal, i) => (
                  <MealCard key={meal.id} meal={meal} index={i} onSelect={() => handleSelect(meal)} getMealPrice={getMealPrice} />
                ))}
              </div>
            )}
        </>
      )}

    </div>{/* /meal-page-inner */}
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
          background: `linear-gradient(to right, ${colors.border} 0%, ${colors.border} ${minPercent}%, ${TERRA} ${minPercent}%, ${TERRA} ${maxPercent}%, ${colors.border} ${maxPercent}%, ${colors.border} 100%)`
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

function getMealBadge(meal) {
  if (!meal.last_eaten) return { label: 'NYHET', bg: colors.accent, color: colors.white };
  if (meal.time_minutes <= 20) return { label: 'RASK', bg: colors.accentAlt, color: colors.white };
  if (meal.price_level === 1) return { label: 'BUDSJETTVINNER', bg: colors.dark, color: colors.white };
  return null;
}

function MealCard({ meal, onSelect, getMealPrice }) {
  const [imgError, setImgError] = useState(false);
  const badge = getMealBadge(meal);
  const gradient = mealGradients[meal.category] || defaultMealGradient;
  const tags = (meal.tags || []).slice(0, 3);
  const photo = meal.photo_url || mealPhotos[meal.emoji];
  const showPhoto = photo && !imgError;

  return (
    <div className="meal-card" onClick={onSelect} style={s.card}>
      {/* Hero area — food photo, falls back to category gradient + big emoji */}
      <div className="card-hero" style={{ ...s.cardHero, background: gradient }}>
        {showPhoto ? (
          <>
            <img
              src={photo}
              alt={meal.name}
              loading="lazy"
              onError={() => setImgError(true)}
              style={s.heroImg}
            />
            <span style={s.heroEmojiSmall}>{meal.emoji}</span>
          </>
        ) : (
          <span style={s.heroEmoji}>{meal.emoji}</span>
        )}
        {badge && (
          <span style={{ ...s.heroBadge, background: badge.bg, color: badge.color }}>
            {badge.label}
          </span>
        )}
        <span style={s.heroTime}>⏱ {meal.time_minutes} min</span>
      </div>

      {/* Text content */}
      <div style={s.cardContent}>
        <h3 style={s.mealName}>{meal.name}</h3>
        {meal.description && <p style={s.desc}>{meal.description}</p>}
        <div style={s.tagRow}>
          {tags.map(tag => (
            <span key={tag} style={s.tagChip}>{tag}</span>
          ))}
          <span style={{ ...s.tagChip, ...s.priceChip }}>
            {`ca. ${getMealPrice(meal)} kr`}
          </span>
        </div>
      </div>
    </div>
  );
}

function InspirationCard({ meal, added, getMealPrice, onOpen, onAdd }) {
  const [imgError, setImgError] = useState(false);
  const gradient = mealGradients[meal.category] || defaultMealGradient;
  const photo = meal.photo_url || mealPhotos[meal.emoji];
  const showPhoto = photo && !imgError;
  const tags = (meal.tags || []).slice(0, 3);

  return (
    <div className="meal-card" style={{ ...s.card, cursor: 'default', display: 'flex', flexDirection: 'column' }}>
      <div onClick={onOpen} style={{ cursor: 'pointer' }}>
        <div className="card-hero" style={{ ...s.cardHero, background: gradient }}>
          {showPhoto ? (
            <>
              <img src={photo} alt={meal.name} loading="lazy" onError={() => setImgError(true)} style={s.heroImg} />
              <span style={s.heroEmojiSmall}>{meal.emoji}</span>
            </>
          ) : (
            <span style={s.heroEmoji}>{meal.emoji}</span>
          )}
          <span style={s.heroTime}>⏱ {meal.time_minutes} min</span>
        </div>
        <div style={{ ...s.cardContent, paddingBottom: 8 }}>
          <h3 style={s.mealName}>{meal.name}</h3>
          {meal.description && <p style={s.desc}>{meal.description}</p>}
          <div style={s.tagRow}>
            {tags.map(tag => (
              <span key={tag} style={s.tagChip}>{tag}</span>
            ))}
            <span style={{ ...s.tagChip, ...s.priceChip }}>{`ca. ${getMealPrice(meal)} kr`}</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 16px 16px', marginTop: 'auto' }}>
        <button
          onClick={onAdd}
          disabled={added}
          style={{
            width: '100%',
            background: added ? colors.bgLight : `linear-gradient(135deg, ${TERRA}, #C8431F)`,
            color: added ? colors.success : '#fff',
            border: added ? `1.5px solid ${colors.border}` : 'none',
            borderRadius: 10, padding: '11px', fontSize: '0.9rem', fontWeight: 700,
            cursor: added ? 'default' : 'pointer',
            boxShadow: added ? 'none' : '0 4px 12px rgba(226,90,51,0.25)',
            transition: 'all 0.15s',
          }}
        >
          {added ? '✓ Lagt til i Mine retter' : '+ Legg til i Mine retter'}
        </button>
      </div>
    </div>
  );
}

const s = {
  page: { background: colors.bg, minHeight: '100%', fontFamily: fonts.body },

  inspoIntro: {
    maxWidth: 1600, margin: '0 auto', padding: '14px 16px 0',
    color: colors.textSecond, fontSize: '0.9rem', lineHeight: 1.5,
  },

  // Empty state for "Mine retter"
  emptyWrap: {
    maxWidth: 460, margin: '0 auto', padding: '48px 24px',
    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  emptyEmoji: { fontSize: '3.4rem', marginBottom: 8 },
  emptyTitle: { fontSize: '1.25rem', fontWeight: 800, color: colors.text, margin: '0 0 8px', letterSpacing: '-0.01em' },
  emptyText: { color: colors.textSecond, fontSize: '0.95rem', lineHeight: 1.55, margin: '0 0 24px' },
  emptyActions: { display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 },
  emptyPrimary: {
    width: '100%', background: colors.dark, color: colors.white,
    border: 'none', borderRadius: radius.round, padding: '14px',
    fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
    boxShadow: `0 8px 28px ${colors.accent}40`,
  },
  emptySecondary: {
    width: '100%', background: colors.white, color: colors.text,
    border: `1.5px solid ${colors.border}`, borderRadius: radius.round, padding: '13px',
    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
  },

  // Drawer
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 40,
    background: 'rgba(28,25,23,0.5)', backdropFilter: 'blur(2px)',
    transition: 'opacity 0.25s ease',
  },
  drawer: {
    position: 'fixed', top: 0, left: 0, bottom: 0,
    width: 300, zIndex: 50,
    background: colors.bgAlt, borderRight: `1px solid ${colors.hairline}`,
    boxShadow: '4px 0 40px rgba(0,0,0,0.12)',
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
  },
  drawerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 20px 16px', borderBottom: `1px solid ${colors.hairline}`,
  },
  drawerTitle: {
    letterSpacing: '-0.02em', fontSize: '1.25rem', fontWeight: 800,
    color: colors.text, letterSpacing: '-0.02em',
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 8,
    border: `1.5px solid ${colors.border}`, background: colors.bg,
    color: colors.textSecond, fontSize: '0.9rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  drawerBody: { flex: 1, overflowY: 'auto', padding: '16px 20px' },
  filterGroup: { marginBottom: 24 },
  groupLabel: {
    fontSize: '0.72rem', fontWeight: 700, color: colors.textTertiary,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    margin: '0 0 10px',
  },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    padding: '7px 14px', borderRadius: 999,
    border: `1.5px solid ${colors.border}`, background: colors.bg,
    color: colors.text, fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  chipActive: {
    background: colors.accent, borderColor: colors.accent, color: colors.white,
  },
  drawerFooter: {
    padding: '16px 20px', borderTop: `1px solid ${colors.hairline}`,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  clearBtn: {
    background: 'none', border: 'none', color: colors.textSecond,
    fontSize: '0.88rem', cursor: 'pointer', textAlign: 'center',
    textDecoration: 'underline',
  },
  showBtn: {
    background: `linear-gradient(135deg, ${TERRA}, #C8431F)`, color: colors.white, border: 'none',
    borderRadius: 12, padding: '14px', fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', boxShadow: '0 4px 16px rgba(226,90,51,0.30)',
  },

  // Header
  header: {
    position: 'sticky', top: 0, zIndex: 10,
    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${colors.borderLight}`, padding: '16px 16px 12px',
  },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modeToggle: {
    display: 'flex', background: colors.bgLight,
    borderRadius: 999, padding: 3, gap: 2,
  },
  modeBtn: {
    padding: '6px 16px', borderRadius: 999, border: 'none',
    background: 'transparent', color: colors.textSecond,
    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.18s', whiteSpace: 'nowrap',
  },
  modeBtnActive: {
    background: colors.white, color: colors.text,
    boxShadow: '0 1px 4px rgba(26,26,26,0.12)',
  },
  heading: { fontFamily: fonts.display, fontSize: '1.75rem', fontWeight: 700, color: colors.text, margin: 0, letterSpacing: '0.01em', textTransform: 'uppercase' },
  sub: { color: colors.textTertiary, fontSize: '0.8rem', margin: '2px 0 0' },
  personBox: { display: 'flex', alignItems: 'center', gap: 6 },
  personBtn: {
    width: 28, height: 28, borderRadius: 8,
    border: `1.5px solid ${colors.border}`, background: colors.white,
    color: colors.text, fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  personCount: { fontWeight: 700, fontSize: '1rem', color: colors.text, minWidth: 16, textAlign: 'center' },
  personLabel: { color: colors.textTertiary, fontSize: '0.78rem' },

  toolRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0 },
  filterBtn: {
    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 999,
    border: `1.5px solid ${colors.border}`, background: colors.white,
    color: colors.text, fontSize: '0.8rem', fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
  },
  filterBtnActive: { background: colors.accent, borderColor: colors.accent, color: colors.white },
  badge: {
    minWidth: 18, height: 18, borderRadius: 999,
    background: colors.accent, color: colors.white,
    fontSize: '0.7rem', fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 4px',
  },

  sortRow: { display: 'flex', gap: 6, overflowX: 'auto', flex: 1 },
  pill: {
    flexShrink: 0, padding: '6px 12px', borderRadius: 999,
    border: `1.5px solid ${colors.border}`, background: colors.white,
    color: colors.textSecond, fontSize: '0.78rem', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
  },
  pillActive: { background: colors.accent, borderColor: colors.accent, color: colors.white },

  activeTagRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  activeTagLabel: { fontSize: '0.72rem', color: colors.textTertiary, fontWeight: 600 },
  activeTag: {
    padding: '3px 10px', borderRadius: 999,
    background: colors.bgAccent, border: `1px solid ${colors.accent}33`,
    color: colors.accent, fontSize: '0.75rem', fontWeight: 600,
    cursor: 'pointer',
  },

  // Velg for meg
  pickWrap: { padding: '16px 16px 0', textAlign: 'center' },
  pickBtn: {
    width: '100%', background: colors.dark, color: colors.white,
    border: 'none', borderRadius: radius.round, padding: '16px',
    fontSize: '1.05rem', fontWeight: 800, cursor: 'pointer',
    letterSpacing: '-0.01em', boxShadow: `0 8px 32px ${colors.accent}40`,
    transition: 'transform 0.12s',
  },
  pickHint: { color: colors.textTertiary, fontSize: '0.75rem', margin: '8px 0 0' },

  // Cards — magazine style: big hero, badge, bold title, tag chips
  list: { padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 20 },
  card: {
    background: colors.white, borderRadius: 12, overflow: 'hidden',
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.sm,
    cursor: 'pointer', transition: 'transform 0.12s, box-shadow 0.15s',
    userSelect: 'none',
  },
  cardHero: {
    position: 'relative',
    height: 170,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  heroImg: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%', objectFit: 'cover',
  },
  heroEmoji: {
    fontSize: '4.6rem', lineHeight: 1,
    filter: 'drop-shadow(0 6px 12px rgba(28,28,26,0.18))',
  },
  heroEmojiSmall: {
    position: 'absolute', bottom: 10, left: 12,
    fontSize: '1.4rem', lineHeight: 1,
    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
    borderRadius: '50%', width: 38, height: 38,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  heroBadge: {
    position: 'absolute', top: 12, left: 12,
    fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.06em',
    padding: '4px 10px', borderRadius: 6,
  },
  heroTime: {
    position: 'absolute', bottom: 10, right: 12,
    fontSize: '0.75rem', fontWeight: 700, color: colors.text,
    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
    padding: '4px 10px', borderRadius: 999,
  },
  cardContent: { padding: '14px 16px 16px' },
  mealName: { fontFamily: fonts.display, fontWeight: 700, fontSize: '1.3rem', color: colors.text, margin: '0 0 4px', letterSpacing: '0.01em', lineHeight: 1.1 },
  desc: {
    color: colors.textSecond, fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 10px',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
  },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tagChip: {
    fontSize: '0.74rem', fontWeight: 600, color: colors.textTertiary,
    background: colors.bgLight, border: `1px solid ${colors.hairline}`,
    borderRadius: 8, padding: '4px 10px',
  },
  priceChip: { color: colors.accentDark, background: colors.bgAccent, border: `1px solid ${colors.accent}33` },

  loadingWrap: { textAlign: 'center', paddingTop: 80 },
  loadingEmoji: { fontSize: '3rem', display: 'block', marginBottom: 12 },
  loadingText: { color: colors.textTertiary, fontSize: '1rem', marginBottom: 16 },
  resetBtn: {
    background: colors.accent, color: colors.white, border: 'none',
    borderRadius: 10, padding: '10px 20px', fontSize: '0.9rem',
    fontWeight: 600, cursor: 'pointer',
  },

  // Range Slider
  rangeSliderGroup: { marginBottom: 24 },
  rangeValue: {
    fontSize: '0.9rem', fontWeight: 600, color: colors.text,
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
  },
};
