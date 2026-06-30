import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getIngredients, getIngredientCategories, createMeal, getMeal, updateMeal, removeMealIngredient, importRecipe } from '../api.js';
import { colors, shadows, radius } from '../theme.js';
import { BASE_RECIPES } from '../baseRecipes.js';

const QUICK_TIMES = [15, 30, 45, 60, 90];

const MOST_USED_INGREDIENTS = [
  'Melk', 'Kjøttdeig', 'Løk', 'Hvitløk', 'Smør', 'Egg',
  'Ost', 'Tomat', 'Hermetiske tomater', 'Olivenolje', 'Salt', 'Pepper',
];

const CATEGORY_EMOJIS = {
  'Grønnsaker': '🥬', 'Kjøtt': '🍖', 'Fisk': '🐟', 'Meieri': '🧀',
  'Bakeri': '🍞', 'Tørrmat': '🌾', 'Krydder & sauser': '🌶️', 'Diverse': '📦',
};

function guessEmojiFromName(name) {
  if (!name) return '🍽';
  const l = name.toLowerCase();
  if (l.match(/laks|sei|torsk|fisk|reker|scampi|tun|makrell|sardiner|skalldyr|blekksprut/)) return '🐟';
  if (l.match(/pasta|spaghetti|penne|bolognese|carbonara|lasagne|tortellini|ravioli/)) return '🍝';
  if (l.match(/kjøtt|steak|entrecôte|biff|kjøttboller|karbonader|pølse|bacon|ribs/)) return '🍖';
  if (l.match(/kylling|kyllingfilet|chicken|nuggets/)) return '🍗';
  if (l.match(/suppe|stew|gryte|gryterett|fårikål|minestrone/)) return '🍲';
  if (l.match(/salat|cesar|coleslaw|rucola/)) return '🥗';
  if (l.match(/omelett|egg|scrambled|frittata/)) return '🍳';
  if (l.match(/taco|burrito|fajita|enchilada|quesadilla|mexikansk/)) return '🌮';
  if (l.match(/pizza|margherita|pepperoni/)) return '🍕';
  if (l.match(/burger|hamburger|kjøttkaker|sandwich/)) return '🍔';
  if (l.match(/ris|risotto|wok|thai|asian|pad thai|teriyaki|sushi|ramen|nudler/)) return '🍛';
  if (l.match(/brød|rundstykker|bagel|pannekaker|waffles/)) return '🍞';
  return '🍽';
}

function getIngredientFrequency(name) {
  const idx = MOST_USED_INGREDIENTS.indexOf(name);
  return idx >= 0 ? idx : 999;
}

export default function MealCreatePage() {
  const navigate = useNavigate();
  const { id: mealId } = useParams();
  const isEditing = !!mealId;
  const [step, setStep] = useState(1);
  const [mealData, setMealData] = useState({
    name: '',
    emoji: '🍽',
    description: '',
    time_minutes: 30,
    persons: 4,
    category: 'Annet',
  });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingQtyId, setEditingQtyId] = useState(null);
  const [appliedRecipe, setAppliedRecipe] = useState(null);
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  useEffect(() => { loadData(); }, [mealId]);

  // Responsive modal styling: full-screen on mobile, centered card on desktop
  useEffect(() => {
    if (document.getElementById('create-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'create-modal-styles';
    style.textContent = `
      .create-overlay {
        position: fixed; inset: 0; z-index: 90;
        display: flex; align-items: stretch; justify-content: center;
        background: ${colors.bg};
      }
      .create-card {
        width: 100%; max-width: 640px;
        background: ${colors.bg};
        display: flex; flex-direction: column;
        min-height: 0;
      }
      @media (min-width: 700px) {
        .create-overlay {
          align-items: center; padding: 32px 16px;
          background: rgba(28,25,23,0.45);
          -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
        }
        .create-card {
          max-height: 90vh; border-radius: 20px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.28);
          overflow: hidden;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const cats = await getIngredientCategories();
      setCategories(cats || []);
      const { data: ingredients } = await getIngredients(null, null, 1000);
      setAllIngredients(ingredients || []);
      const grouped = {};
      (ingredients || []).forEach(ing => {
        if (!grouped[ing.category]) grouped[ing.category] = [];
        grouped[ing.category].push(ing);
      });
      setIngredientsByCategory(grouped);

      if (isEditing && mealId) {
        const meal = await getMeal(mealId);
        setMealData({
          name: meal.name,
          emoji: meal.emoji,
          description: meal.description || '',
          time_minutes: meal.time_minutes || 30,
          persons: meal.persons || 4,
          category: meal.category || 'Annet',
        });
        setSelectedIngredients(meal.ingredients.map(ing => ({
          id: ing.ingredient_id,
          name: ing.ingredient_name,
          category: ing.section,
          price: 0,
          quantity: ing.quantity,
          unit: ing.unit,
        })));
      }
    } catch (e) {
      setError('Feil ved lasting: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function getMostUsedIngredients() {
    return allIngredients
      .filter(i => MOST_USED_INGREDIENTS.includes(i.name))
      .sort((a, b) => getIngredientFrequency(a.name) - getIngredientFrequency(b.name));
  }

  function isIngredientSelected(id) {
    return selectedIngredients.some(i => i.id === id);
  }

  // Search-first add: tap a suggestion (or hit Enter) to add it straight away
  function addIngredient(ingredient) {
    if (!isIngredientSelected(ingredient.id)) {
      setSelectedIngredients(prev => [...prev, {
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        price: ingredient.price || 0,
        quantity: ingredient.unit === 'g' || ingredient.unit === 'ml' ? 200 : 1,
        unit: ingredient.unit || 'stk'
      }]);
    }
    setSearchTerm('');
  }

  // Free-text item that doesn't exist in the ingredient database
  function addCustomIngredient(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `custom:${trimmed.toLowerCase()}`;
    if (!selectedIngredients.some(i => i.id === id)) {
      setSelectedIngredients(prev => [...prev, {
        id, name: trimmed, category: 'Diverse', price: 0, quantity: 1, unit: 'stk',
      }]);
    }
    setSearchTerm('');
  }

  function removeIngredient(id) {
    setSelectedIngredients(prev => prev.filter(i => i.id !== id));
  }

  function updateQuantity(id, qty) {
    setSelectedIngredients(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: Math.max(0.1, parseFloat(qty) || 1) } : i)
    );
  }

  function updateUnit(id, unit) {
    setSelectedIngredients(prev => prev.map(i => i.id === id ? { ...i, unit } : i));
  }

  function adjustQuantity(id, delta) {
    setSelectedIngredients(prev =>
      prev.map(i => {
        if (i.id !== id) return i;
        const step = i.unit === 'g' || i.unit === 'ml' ? 50 : 1;
        return { ...i, quantity: Math.max(step, i.quantity + delta * step) };
      })
    );
  }

  // Prefill the whole wizard from a base recipe. Ingredients are matched
  // by name against the synced ingredient database so they keep real ids
  // and prices; unmatched ones get a synthetic id and are saved by name.
  function applyBaseRecipe(recipe) {
    const KNOWN_CATEGORIES = ['Pasta', 'Fisk', 'Kjøtt', 'Suppe', 'Salat'];
    setMealData({
      ...mealData,
      name: recipe.name,
      emoji: recipe.emoji,
      description: '',
      time_minutes: recipe.time_minutes,
      category: KNOWN_CATEGORIES.includes(recipe.category) ? recipe.category : 'Annet',
    });
    setSelectedIngredients(recipe.ingredients.map(ri => {
      const match = allIngredients.find(ai => ai.name.toLowerCase() === ri.name.toLowerCase());
      return {
        id: match ? match.id : `base:${ri.name}`,
        name: ri.name,
        category: match ? match.category : ri.section,
        price: match?.price || 0,
        quantity: ri.quantity,
        unit: ri.unit,
      };
    }));
    setAppliedRecipe(recipe.name);
  }

  function calculateTotalPrice() {
    return selectedIngredients.reduce((sum, i) => sum + ((i.price || 0) * i.quantity), 0).toFixed(0);
  }

  // Import a recipe from a pasted URL — prefills the whole wizard
  async function handleImport() {
    const url = importUrl.trim();
    if (!url) return;
    setImporting(true);
    setImportError('');
    try {
      const r = await importRecipe(url);
      const KNOWN = ['Pasta', 'Fisk', 'Kjøtt', 'Suppe', 'Salat'];
      setMealData(prev => ({
        ...prev,
        name: r.name || prev.name,
        emoji: guessEmojiFromName(r.name || ''),
        description: '',
        time_minutes: r.time_minutes || prev.time_minutes,
        persons: r.persons || prev.persons,
        category: r.category && KNOWN.includes(r.category) ? r.category : prev.category,
        photo_url: r.image || null,
      }));
      setSelectedIngredients((r.ingredients || []).map((ing, idx) => {
        const match = allIngredients.find(ai => ai.name.toLowerCase() === ing.name.toLowerCase());
        return {
          id: match ? match.id : `import:${idx}:${ing.name}`,
          name: ing.name,
          category: match ? match.category : (ing.section || 'Diverse'),
          price: match?.price || 0,
          quantity: ing.quantity ?? 1,
          unit: ing.unit || 'stk',
        };
      }));
      setImportUrl('');
      setStep(2); // jump to ingredient review
    } catch (e) {
      setImportError(e.message || 'Klarte ikke å hente oppskriften');
    } finally {
      setImporting(false);
    }
  }

  // Cancel the whole wizard — confirm only if there is unsaved work
  function handleCancel() {
    const hasData = mealData.name.trim() || selectedIngredients.length > 0;
    if (hasData && !isEditing && !window.confirm('Avbryte? Det du har lagt inn blir ikke lagret.')) return;
    navigate(isEditing ? `/meal/${mealId}` : '/app');
  }

  async function saveMeal() {
    if (!mealData.name.trim()) { alert('Skriv inn navn'); return; }
    try {
      const mealPayload = {
        ...mealData,
        ingredients: selectedIngredients.map(ing => ({
          ingredient_id: typeof ing.id === 'string' && (ing.id.startsWith('base:') || ing.id.startsWith('custom:')) ? null : ing.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          section: ing.category
        }))
      };

      if (isEditing && mealId) {
        await updateMeal(mealId, mealPayload);
      } else {
        await createMeal(mealPayload);
      }
      navigate('/app');
    } catch (e) {
      alert('Feil ved lagring: ' + e.message);
    }
  }

  const mostUsed = getMostUsedIngredients();

  // Live search suggestions for step 2 (prefix matches first)
  const searchQuery = searchTerm.trim().toLowerCase();
  const suggestions = searchQuery
    ? allIngredients
        .filter(i => i.name.toLowerCase().includes(searchQuery))
        .sort((a, b) => {
          const sa = a.name.toLowerCase().startsWith(searchQuery) ? 0 : 1;
          const sb = b.name.toLowerCase().startsWith(searchQuery) ? 0 : 1;
          return sa !== sb ? sa - sb : a.name.localeCompare(b.name);
        })
        .slice(0, 8)
    : [];
  const exactMatch = searchQuery ? allIngredients.find(i => i.name.toLowerCase() === searchQuery) : null;

  // Shared styles
  const btnBack = { flex: 1, padding: '12px', borderRadius: radius.md, background: colors.bgAlt, color: colors.text, border: `1.5px solid ${colors.border}`, fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' };
  const btnNext = (active = true) => ({ flex: 2, padding: '12px', borderRadius: radius.md, background: active ? colors.accent : colors.borderLight, color: active ? colors.white : colors.textTertiary, border: 'none', fontWeight: '600', cursor: active ? 'pointer' : 'not-allowed', fontSize: '0.95rem', boxShadow: active ? shadows.accent : 'none' });

  return (
    <div className="create-overlay" onClick={e => { if (e.target === e.currentTarget) handleCancel(); }}>
    <div className="create-card">

      {/* Step progress bar + close */}
      <div style={{ padding: '16px 20px 4px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{
              height: '4px', flex: 1, borderRadius: '2px',
              background: n <= step ? colors.accent : colors.borderLight,
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <span style={{ fontSize: '0.75rem', color: colors.textTertiary, fontWeight: '600', whiteSpace: 'nowrap' }}>
          {step} / 3
        </span>
        <button
          onClick={handleCancel}
          title="Lukk"
          aria-label="Lukk"
          style={{
            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
            border: `1.5px solid ${colors.border}`, background: colors.bgAlt,
            color: colors.textSecond, fontSize: '1rem', cursor: 'pointer', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent; e.currentTarget.style.color = colors.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textSecond; }}
        >
          ✕
        </button>
      </div>

      {/* STEP 1: Navn + beskrivelse */}
      {step === 1 && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '12px 24px 24px' }}>
          <h1 style={{ color: colors.text, fontSize: '1.3rem', fontWeight: '700', margin: '4px 0 2px', letterSpacing: '-0.01em' }}>
            {isEditing ? 'Rediger måltid' : 'Nytt måltid'}
          </h1>
          <p style={{ color: colors.textTertiary, fontSize: '0.85rem', margin: '0 0 16px' }}>
            Navn og kort beskrivelse
          </p>

          {/* ── Import from URL ── */}
          {!isEditing && (
            <div style={{
              background: colors.bgAccent, border: `1px solid ${colors.accentAltLight}`,
              borderRadius: radius.md, padding: '14px', marginBottom: '20px',
            }}>
              <label style={{ fontSize: '0.85rem', color: colors.text, fontWeight: '700', marginBottom: '4px', display: 'block' }}>
                🔗 Hent fra nettside
              </label>
              <p style={{ fontSize: '0.78rem', color: colors.textSecond, margin: '0 0 10px' }}>
                Lim inn lenke til en oppskrift, så fyller vi inn ingrediensene for deg.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  inputMode="url"
                  value={importUrl}
                  onChange={e => { setImportUrl(e.target.value); setImportError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleImport(); } }}
                  placeholder="https://www.matprat.no/oppskrifter/…"
                  style={{
                    flex: 1, minWidth: 0, padding: '11px 12px', borderRadius: radius.sm,
                    border: `1.5px solid ${colors.border}`, background: colors.bgAlt,
                    fontSize: '0.95rem', color: colors.text, outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = colors.accent}
                  onBlur={e => e.target.style.borderColor = colors.border}
                />
                <button
                  onClick={handleImport}
                  disabled={!importUrl.trim() || importing}
                  style={{
                    flexShrink: 0, padding: '0 16px', borderRadius: radius.sm, border: 'none',
                    background: (!importUrl.trim() || importing) ? colors.borderLight : colors.accent,
                    color: (!importUrl.trim() || importing) ? colors.textTertiary : colors.white,
                    fontWeight: '700', fontSize: '0.9rem',
                    cursor: (!importUrl.trim() || importing) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {importing ? 'Henter…' : 'Hent'}
                </button>
              </div>
              {importError && (
                <p style={{ fontSize: '0.78rem', color: colors.error, margin: '8px 0 0' }}>{importError}</p>
              )}
            </div>
          )}

          <label style={{ fontSize: '0.8rem', color: colors.textSecond, fontWeight: '600', marginBottom: '6px', display: 'block' }}>
            Navn på måltid
          </label>
          <input
            type="text"
            value={mealData.name}
            onChange={e => setMealData({ ...mealData, name: e.target.value, emoji: guessEmojiFromName(e.target.value) })}
            placeholder="F.eks. Pannekaker…"
            autoFocus
            style={{
              padding: '14px 14px', borderRadius: radius.md, border: `1.5px solid ${colors.border}`,
              background: colors.bgAlt, width: '100%', boxSizing: 'border-box',
              fontSize: '1rem', fontWeight: '500', color: colors.text, outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = colors.accent}
            onBlur={e => e.target.style.borderColor = colors.border}
          />

          {/* Grunnoppskrift-forslag — live while typing, tap to prefill */}
          {(() => {
            const q = mealData.name.trim().toLowerCase();
            if (!q || appliedRecipe === mealData.name) return null;
            const matches = BASE_RECIPES.filter(r => r.name.toLowerCase().includes(q)).slice(0, 5);
            if (matches.length === 0) return null;
            return (
              <div style={{
                marginTop: '6px', borderRadius: radius.md, overflow: 'hidden',
                border: `1px solid ${colors.border}`, background: colors.white,
                boxShadow: shadows.md,
              }}>
                <p style={{
                  fontSize: '0.68rem', fontWeight: '700', color: colors.textTertiary,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  margin: 0, padding: '8px 14px 6px',
                }}>
                  Grunnoppskrifter
                </p>
                {matches.map((recipe, idx) => (
                  <button
                    key={recipe.name}
                    onClick={() => applyBaseRecipe(recipe)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                      padding: '11px 14px', background: 'none', textAlign: 'left',
                      border: 'none', cursor: 'pointer',
                      borderTop: idx === 0 ? 'none' : `1px solid ${colors.hairline}`,
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{recipe.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: '700', color: colors.text, fontSize: '0.95rem' }}>
                        {recipe.name}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.76rem', color: colors.textTertiary }}>
                        ⏱ {recipe.time_minutes} min · {recipe.ingredients.length} ingredienser
                      </span>
                    </span>
                    <span style={{ color: colors.accent, fontSize: '1.2rem', fontWeight: '700', flexShrink: 0 }}>+</span>
                  </button>
                ))}
              </div>
            );
          })()}

          {appliedRecipe === mealData.name && (
            <p style={{ fontSize: '0.78rem', color: colors.accent, fontWeight: '600', margin: '8px 0 0' }}>
              ✓ Grunnoppskrift hentet — ingredienser og tid er fylt ut. Juster fritt!
            </p>
          )}

          <div style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '0.8rem', color: colors.textSecond, fontWeight: '600', marginBottom: '6px', display: 'block' }}>
              Kort beskrivelse (valgfritt)
            </label>
            <textarea
              value={mealData.description}
              onChange={e => setMealData({ ...mealData, description: e.target.value })}
              placeholder="F.eks. Rask hverdagsfavoritt…"
              style={{
                padding: '12px 14px', borderRadius: radius.md, border: `1.5px solid ${colors.border}`,
                background: colors.bgAlt, width: '100%', boxSizing: 'border-box',
                fontSize: '0.95rem', color: colors.text, outline: 'none',
                fontFamily: 'inherit', minHeight: '70px', resize: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = colors.accent}
              onBlur={e => e.target.style.borderColor = colors.border}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '20px' }}>
            <button onClick={handleCancel} style={btnBack}>Avbryt</button>
            <button onClick={() => setStep(2)} disabled={!mealData.name.trim()} style={btnNext(!!mealData.name.trim())}>Neste →</button>
          </div>
        </div>
      )}

      {/* STEP 2: Ingredienser — search-first */}
      {step === 2 && (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '24px 24px 0' }}>
          <h1 style={{ color: colors.text, fontSize: '1.3rem', fontWeight: '700', margin: '4px 0 2px', letterSpacing: '-0.01em' }}>Ingredienser</h1>
          <p style={{ color: colors.textTertiary, fontSize: '0.85rem', margin: '0 0 14px' }}>
            {selectedIngredients.length > 0 ? `${selectedIngredients.length} lagt til` : 'Søk og legg til'}
          </p>

          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchQuery) {
                e.preventDefault();
                exactMatch ? addIngredient(exactMatch) : addCustomIngredient(searchTerm);
              }
            }}
            placeholder="Søk eller skriv egen vare…"
            autoFocus
            style={{
              padding: '13px 14px', borderRadius: radius.md, border: `1.5px solid ${colors.border}`,
              background: colors.bgAlt, width: '100%', boxSizing: 'border-box',
              fontSize: '1rem', color: colors.text, outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = colors.accent}
            onBlur={e => e.target.style.borderColor = colors.border}
          />

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: '10px' }}>

            {/* ── Searching: live suggestions ── */}
            {searchQuery ? (
              <div style={{
                borderRadius: radius.md, overflow: 'hidden',
                border: `1px solid ${colors.border}`, background: colors.white,
              }}>
                {suggestions.map((ing, idx) => {
                  const selected = isIngredientSelected(ing.id);
                  return (
                    <button
                      key={ing.id}
                      onClick={() => addIngredient(ing)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                        padding: '12px 14px', background: 'none', textAlign: 'left',
                        border: 'none', cursor: 'pointer',
                        borderTop: idx === 0 ? 'none' : `1px solid ${colors.hairline}`,
                      }}
                    >
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontWeight: '600', color: colors.text, fontSize: '0.95rem' }}>{ing.name}</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: colors.textTertiary }}>{ing.category}{ing.unit ? ` · ${ing.unit}` : ''}</span>
                      </span>
                      <span style={{ color: selected ? colors.success : colors.accent, fontSize: '1.15rem', fontWeight: '700', flexShrink: 0 }}>
                        {selected ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}

                {/* Free-text add */}
                {!exactMatch && (
                  <button
                    onClick={() => addCustomIngredient(searchTerm)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      padding: '12px 14px', background: colors.bgLight, textAlign: 'left',
                      border: 'none', cursor: 'pointer',
                      borderTop: suggestions.length > 0 ? `1px solid ${colors.hairline}` : 'none',
                    }}
                  >
                    <span style={{ flex: 1, fontWeight: '600', color: colors.text, fontSize: '0.95rem' }}>
                      Legg til <span style={{ color: colors.accent }}>«{searchTerm.trim()}»</span> som egen vare
                    </span>
                    <span style={{ color: colors.accent, fontSize: '1.15rem', fontWeight: '700' }}>+</span>
                  </button>
                )}
              </div>

            ) : (
              <>
                {/* ── Added ingredients: one clean card with divider rows ── */}
                {selectedIngredients.length > 0 && (
                  <div style={{
                    borderRadius: radius.md, overflow: 'hidden',
                    border: `1px solid ${colors.border}`, background: colors.white,
                    marginBottom: '16px',
                  }}>
                    {selectedIngredients.map((ing, idx) => (
                      <div key={ing.id} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '11px 14px',
                        borderTop: idx === 0 ? 'none' : `1px solid ${colors.hairline}`,
                      }}>
                        <span style={{ flex: 1, minWidth: 0, fontWeight: '600', color: colors.text, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ing.name}
                        </span>

                        {/* − qty unit + */}
                        <button onClick={() => adjustQuantity(ing.id, -1)} style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          border: `1.5px solid ${colors.border}`, background: colors.white,
                          color: colors.accent, fontSize: '1.05rem', fontWeight: '700',
                          cursor: 'pointer', lineHeight: 1, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>−</button>

                        {editingQtyId === ing.id ? (
                          <input type="number" min="0.1" step="1" value={ing.quantity} autoFocus onChange={e => updateQuantity(ing.id, e.target.value)} onBlur={() => setEditingQtyId(null)} style={{
                            width: '48px', textAlign: 'center', border: `1.5px solid ${colors.accent}`,
                            borderRadius: '8px', fontSize: '0.9rem', padding: '4px 2px',
                            fontWeight: '700', color: colors.text,
                          }} />
                        ) : (
                          <button onClick={() => setEditingQtyId(ing.id)} style={{
                            background: 'none', border: 'none', cursor: 'text', padding: 0,
                            fontWeight: '700', color: colors.text, fontSize: '0.92rem',
                            minWidth: '52px', textAlign: 'center', whiteSpace: 'nowrap',
                          }}>
                            {ing.quantity}{' '}
                            <span
                              onClick={e => { e.stopPropagation(); updateUnit(ing.id, ing.unit === 'g' ? 'stk' : ing.unit === 'stk' ? 'dl' : 'g'); }}
                              style={{ color: colors.accent, fontWeight: '700' }}
                            >
                              {ing.unit}
                            </span>
                          </button>
                        )}

                        <button onClick={() => adjustQuantity(ing.id, 1)} style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          border: `1.5px solid ${colors.border}`, background: colors.white,
                          color: colors.accent, fontSize: '1.05rem', fontWeight: '700',
                          cursor: 'pointer', lineHeight: 1, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>+</button>

                        <button onClick={() => removeIngredient(ing.id)} style={{
                          background: 'none', border: 'none', color: colors.textTertiary,
                          fontSize: '0.9rem', cursor: 'pointer', padding: '4px 0 4px 4px', lineHeight: 1, flexShrink: 0,
                        }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Quick-add classics ── */}
                {loading ? (
                  <p style={{ color: colors.textTertiary, textAlign: 'center', padding: '20px' }}>Laster…</p>
                ) : (
                  <>
                    {mostUsed.filter(i => !isIngredientSelected(i.id)).length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ color: colors.textSecond, fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Klassikerne</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {mostUsed.filter(i => !isIngredientSelected(i.id)).map(ing => (
                            <button key={ing.id} onClick={() => addIngredient(ing)} style={{
                              padding: '8px 14px', borderRadius: radius.round,
                              background: colors.white, border: `1px solid ${colors.border}`,
                              color: colors.text, fontWeight: '600', fontSize: '0.85rem',
                              cursor: 'pointer', transition: 'all 0.15s',
                            }}>
                              + {ing.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Browse by category ── */}
                    <p style={{ color: colors.textSecond, fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Bla i kategorier</p>
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '10px', paddingBottom: '4px' }}>
                      {Object.keys(ingredientsByCategory).sort().map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)} style={{
                          flex: '0 0 auto', padding: '7px 12px', borderRadius: radius.round,
                          background: selectedCategory === cat ? colors.accent : colors.white,
                          color: selectedCategory === cat ? colors.white : colors.text,
                          border: selectedCategory === cat ? 'none' : `1px solid ${colors.border}`,
                          fontWeight: '500', cursor: 'pointer', fontSize: '0.82rem', whiteSpace: 'nowrap',
                        }}>
                          {CATEGORY_EMOJIS[cat] || '📦'} {cat}
                        </button>
                      ))}
                    </div>

                    {selectedCategory && (
                      <div style={{
                        borderRadius: radius.md, overflow: 'hidden',
                        border: `1px solid ${colors.border}`, background: colors.white,
                        marginBottom: '12px',
                      }}>
                        {(ingredientsByCategory[selectedCategory] || []).map((ing, idx) => {
                          const selected = isIngredientSelected(ing.id);
                          return (
                            <button
                              key={ing.id}
                              onClick={() => selected ? removeIngredient(ing.id) : addIngredient(ing)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                                padding: '11px 14px', background: selected ? colors.bgAccent : 'none',
                                textAlign: 'left', border: 'none', cursor: 'pointer',
                                borderTop: idx === 0 ? 'none' : `1px solid ${colors.hairline}`,
                              }}
                            >
                              <span style={{ flex: 1, fontWeight: '600', color: colors.text, fontSize: '0.92rem' }}>{ing.name}</span>
                              <span style={{ color: selected ? colors.success : colors.accent, fontSize: '1.1rem', fontWeight: '700' }}>
                                {selected ? '✓' : '+'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: '10px', paddingBottom: '16px', paddingTop: '10px' }}>
            <button onClick={() => setStep(1)} style={btnBack}>← Tilbake</button>
            <button onClick={() => setStep(3)} style={btnNext()}>
              {selectedIngredients.length > 0 ? `Neste (${selectedIngredients.length}) →` : 'Hopp over →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Tid + personer + kategori + lagre */}
      {step === 3 && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '12px 24px 24px' }}>
          <h1 style={{ color: colors.text, fontSize: '1.2rem', fontWeight: '600', margin: '12px 0 2px' }}>Detaljer</h1>
          <p style={{ color: colors.textTertiary, fontSize: '0.85rem', margin: '0 0 20px' }}>Tid, personer, kategori</p>

          {/* Time section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800', color: colors.accent, lineHeight: 1 }}>
                {mealData.time_minutes}
              </span>
              <span style={{ fontSize: '1rem', color: colors.textSecond, fontWeight: '600', marginLeft: '4px' }}>min</span>
            </div>

            {/* Quick buttons */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {QUICK_TIMES.map(t => (
                <button key={t} onClick={() => setMealData({ ...mealData, time_minutes: t })} style={{
                  flex: 1, padding: '10px 0', borderRadius: radius.md,
                  background: mealData.time_minutes === t ? colors.accent : colors.white,
                  color: mealData.time_minutes === t ? colors.white : colors.text,
                  border: mealData.time_minutes === t ? 'none' : `1px solid ${colors.border}`,
                  fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.15s',
                }}>
                  {t}m
                </button>
              ))}
              <button onClick={() => setMealData({ ...mealData, time_minutes: Math.max(90, mealData.time_minutes >= 90 ? mealData.time_minutes : 90) })} style={{
                flex: 1, padding: '10px 0', borderRadius: radius.md,
                background: mealData.time_minutes >= 90 ? colors.accent : colors.white,
                color: mealData.time_minutes >= 90 ? colors.white : colors.text,
                border: mealData.time_minutes >= 90 ? 'none' : `1px solid ${colors.border}`,
                fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.15s',
              }}>
                90+
              </button>
            </div>

            {/* Slider */}
            <input type="range" min="5" max="180" step="5" value={mealData.time_minutes} onChange={e => setMealData({ ...mealData, time_minutes: parseInt(e.target.value) })} style={{
              width: '100%',
              accentColor: colors.accent,
              height: '6px',
              cursor: 'pointer',
            }} />
          </div>

          {/* Persons */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: colors.textSecond, fontWeight: '600', marginBottom: '8px' }}>
              Antall personer
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setMealData({ ...mealData, persons: Math.max(1, mealData.persons - 1) })} style={{
                width: '36px', height: '36px', borderRadius: radius.md, border: `1.5px solid ${colors.border}`,
                background: colors.bgAlt, cursor: 'pointer', fontSize: '1.2rem', color: colors.accent, fontWeight: '700'
              }}>−</button>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.text, minWidth: '20px', textAlign: 'center' }}>
                {mealData.persons}
              </span>
              <button onClick={() => setMealData({ ...mealData, persons: mealData.persons + 1 })} style={{
                width: '36px', height: '36px', borderRadius: radius.md, border: `1.5px solid ${colors.border}`,
                background: colors.bgAlt, cursor: 'pointer', fontSize: '1.2rem', color: colors.accent, fontWeight: '700'
              }}>+</button>
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: colors.textSecond, fontWeight: '600', marginBottom: '8px' }}>
              Type rett (valgfritt)
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Pasta', 'Fisk', 'Kjøtt', 'Suppe', 'Salat', 'Annet'].map(cat => (
                <button key={cat} onClick={() => setMealData({ ...mealData, category: mealData.category === cat ? 'Annet' : cat })} style={{
                  padding: '8px 12px', borderRadius: radius.sm,
                  background: mealData.category === cat ? colors.bgAccent : colors.white,
                  color: mealData.category === cat ? colors.accent : colors.text,
                  border: mealData.category === cat ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
                  fontWeight: '500', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.15s',
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: colors.bgAlt, borderRadius: radius.md, padding: '14px',
            border: `1px solid ${colors.border}`, marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: selectedIngredients.length > 0 ? '10px' : '0' }}>
              <span style={{ fontSize: '1.8rem' }}>{mealData.emoji}</span>
              <div>
                <div style={{ fontWeight: '700', color: colors.text, fontSize: '1rem' }}>{mealData.name || '(navn)'}</div>
                <div style={{ color: colors.textTertiary, fontSize: '0.8rem' }}>⏱ {mealData.time_minutes} min · 👥 {mealData.persons} pers</div>
              </div>
            </div>
            {selectedIngredients.length > 0 && (
              <div style={{ fontSize: '0.8rem', color: colors.textSecond, borderTop: `1px solid ${colors.hairline}`, paddingTop: '8px' }}>
                {selectedIngredients.map(i => `${i.name} (${i.quantity} ${i.unit})`).join(' · ')}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={btnBack}>← Tilbake</button>
            <button onClick={saveMeal} style={btnNext()}>Lagre måltid ✓</button>
          </div>
        </div>
      )}
    </div>{/* /maxWidth inner */}
    </div>
  );
}
