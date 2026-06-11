import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIngredients, getIngredientCategories, createMeal } from '../api.js';

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

  useEffect(() => { loadData(); }, []);

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
    } catch (e) {
      setError('Feil ved lasting: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function getVisibleIngredients() {
    let visible = allIngredients;
    if (selectedCategory) visible = visible.filter(i => i.category === selectedCategory);
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      visible = visible.filter(i => i.name.toLowerCase().includes(s));
    }
    return visible.sort((a, b) => {
      const fa = getIngredientFrequency(a.name), fb = getIngredientFrequency(b.name);
      return fa !== fb ? fa - fb : a.name.localeCompare(b.name);
    });
  }

  function getMostUsedIngredients() {
    return allIngredients
      .filter(i => MOST_USED_INGREDIENTS.includes(i.name))
      .sort((a, b) => getIngredientFrequency(a.name) - getIngredientFrequency(b.name));
  }

  function isIngredientSelected(id) {
    return selectedIngredients.some(i => i.id === id);
  }

  function toggleIngredient(ingredient) {
    if (isIngredientSelected(ingredient.id)) {
      setSelectedIngredients(prev => prev.filter(i => i.id !== ingredient.id));
    } else {
      setSelectedIngredients(prev => [...prev, {
        id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        price: ingredient.price || 0,
        quantity: ingredient.unit === 'g' || ingredient.unit === 'ml' ? 200 : 1,
        unit: ingredient.unit || 'stk'
      }]);
    }
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

  function calculateTotalPrice() {
    return selectedIngredients.reduce((sum, i) => sum + ((i.price || 0) * i.quantity), 0).toFixed(0);
  }

  async function saveMeal() {
    if (!mealData.name.trim()) { alert('Skriv inn navn'); return; }
    try {
      await createMeal({
        ...mealData,
        ingredients: selectedIngredients.map(ing => ({
          ingredient_id: ing.id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          section: ing.category
        }))
      });
      navigate('/app');
    } catch (e) {
      alert('Feil ved lagring: ' + e.message);
    }
  }

  const visibleIngredients = getVisibleIngredients();
  const mostUsed = getMostUsedIngredients();

  // Shared styles
  const btnBack = { flex: 1, padding: '12px', borderRadius: '10px', background: '#fff', color: '#1c1917', border: '1.5px solid #e7e5e2', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' };
  const btnNext = (active = true) => ({ flex: 2, padding: '12px', borderRadius: '10px', background: active ? '#c2410c' : '#e7e5e2', color: active ? '#fff' : '#a8a29e', border: 'none', fontWeight: '600', cursor: active ? 'pointer' : 'not-allowed', fontSize: '0.95rem', boxShadow: active ? '0 8px 32px rgba(194,65,12,0.25)' : 'none' });

  return (
    <div style={{ padding: '0', background: '#faf8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* STEP 1: Navn + beskrivelse */}
      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', marginBottom: '4px' }}>
            {mealData.name && <span style={{ fontSize: '2rem', lineHeight: 1 }}>{mealData.emoji}</span>}
            <h1 style={{ color: '#1c1917', fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>
              {mealData.name || 'Nytt måltid'}
            </h1>
          </div>
          <p style={{ color: '#a8a29e', fontSize: '0.85rem', margin: '0 0 24px' }}>Hva skal vi lage?</p>

          <input
            type="text"
            value={mealData.name}
            onChange={e => setMealData({ ...mealData, name: e.target.value, emoji: guessEmojiFromName(e.target.value) })}
            placeholder="Navn på måltid..."
            autoFocus
            style={{
              padding: '14px 14px', borderRadius: '12px', border: 'none',
              background: '#fff', width: '100%', boxSizing: 'border-box',
              fontSize: '1.1rem', fontWeight: '500', color: '#1c1917', outline: 'none',
            }}
          />

          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#78716c', fontWeight: '600', marginBottom: '8px' }}>
              Kort beskrivelse (valgfritt)
            </label>
            <textarea
              value={mealData.description}
              onChange={e => setMealData({ ...mealData, description: e.target.value })}
              placeholder="F.eks. Rask hverdagsfavoritt..."
              style={{
                padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #e7e5e2',
                background: '#fff', width: '100%', boxSizing: 'border-box',
                fontSize: '0.95rem', color: '#1c1917', outline: 'none',
                fontFamily: 'inherit', minHeight: '80px', resize: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#c2410c'}
              onBlur={e => e.target.style.borderColor = '#e7e5e2'}
            />
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '16px' }}>
            <button onClick={() => navigate('/app')} style={btnBack}>Avbryt</button>
            <button onClick={() => setStep(2)} disabled={!mealData.name.trim()} style={btnNext(!!mealData.name.trim())}>Neste →</button>
          </div>
        </div>
      )}

      {/* STEP 2: Ingredienser */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: '0' }}>
          <h1 style={{ color: '#1c1917', fontSize: '1.2rem', fontWeight: '600', margin: '12px 0 2px' }}>Ingredienser</h1>
          <p style={{ color: '#a8a29e', fontSize: '0.85rem', margin: '0 0 12px' }}>Velg og juster mengder</p>

          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Søk ingrediens..."
            style={{
              padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e7e5e2',
              background: '#fff', width: '100%', boxSizing: 'border-box',
              fontSize: '0.95rem', color: '#1c1917', marginBottom: '10px', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#c2410c'}
            onBlur={e => e.target.style.borderColor = '#e7e5e2'}
          />

          {/* Category pills */}
          {!searchTerm && (
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '10px', paddingBottom: '4px' }}>
              <button onClick={() => setSelectedCategory(null)} style={{
                flex: '0 0 auto', padding: '7px 12px', borderRadius: '20px',
                background: !selectedCategory ? '#c2410c' : '#fff',
                color: !selectedCategory ? '#fff' : '#1c1917',
                border: !selectedCategory ? 'none' : '1px solid #e7e5e2',
                fontWeight: '500', cursor: 'pointer', fontSize: '0.82rem', whiteSpace: 'nowrap',
              }}>Alle</button>
              {Object.keys(ingredientsByCategory).sort().map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)} style={{
                  flex: '0 0 auto', padding: '7px 12px', borderRadius: '20px',
                  background: selectedCategory === cat ? '#c2410c' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#1c1917',
                  border: selectedCategory === cat ? 'none' : '1px solid #e7e5e2',
                  fontWeight: '500', cursor: 'pointer', fontSize: '0.82rem', whiteSpace: 'nowrap',
                }}>
                  {CATEGORY_EMOJIS[cat] || '📦'} {cat}
                </button>
              ))}
            </div>
          )}

          {/* Ingredients list */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
            {loading ? (
              <p style={{ color: '#a8a29e', textAlign: 'center', padding: '20px' }}>Laster...</p>
            ) : (
              <>
                {!searchTerm && !selectedCategory && mostUsed.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ color: '#78716c', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px' }}>Klassikerne</p>
                    {mostUsed.map(ing => {
                      const selected = isIngredientSelected(ing.id);
                      return (
                        <button key={ing.id} onClick={() => toggleIngredient(ing)} style={{
                          display: 'flex', alignItems: 'center', width: '100%',
                          padding: '11px 12px', marginBottom: '6px', borderRadius: '10px',
                          background: selected ? '#fff7ed' : '#fff',
                          border: selected ? '2px solid #c2410c' : '1px solid #e7e5e2',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                          position: 'relative',
                        }}>
                          {selected && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#c2410c', borderRadius: '10px 0 0 10px' }} />}
                          <div style={{ flex: 1, paddingLeft: selected ? '10px' : '0' }}>
                            <div style={{ fontWeight: '600', color: '#1c1917', fontSize: '0.95rem' }}>{ing.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#a8a29e' }}>{ing.unit}</div>
                          </div>
                          {selected && <span style={{ color: '#c2410c', fontSize: '1.1rem' }}>✓</span>}
                        </button>
                      );
                    })}
                    <div style={{ height: '8px' }} />
                  </div>
                )}
                {!searchTerm && !selectedCategory && (
                  <p style={{ color: '#78716c', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px' }}>Alle</p>
                )}
                {visibleIngredients.map(ing => {
                  if (!searchTerm && !selectedCategory && MOST_USED_INGREDIENTS.includes(ing.name)) return null;
                  const selected = isIngredientSelected(ing.id);
                  return (
                    <button key={ing.id} onClick={() => toggleIngredient(ing)} style={{
                      display: 'flex', alignItems: 'center', width: '100%',
                      padding: '11px 12px', marginBottom: '6px', borderRadius: '10px',
                      background: selected ? '#fff7ed' : '#fff',
                      border: selected ? '2px solid #c2410c' : '1px solid #e7e5e2',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      position: 'relative',
                    }}>
                      {selected && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#c2410c', borderRadius: '10px 0 0 10px' }} />}
                      <div style={{ flex: 1, paddingLeft: selected ? '10px' : '0' }}>
                        <div style={{ fontWeight: '600', color: '#1c1917', fontSize: '0.95rem' }}>{ing.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#a8a29e' }}>{ing.unit}</div>
                      </div>
                      {selected && <span style={{ color: '#c2410c', fontSize: '1.1rem' }}>✓</span>}
                    </button>
                  );
                })}
                {visibleIngredients.length === 0 && (
                  <p style={{ color: '#a8a29e', textAlign: 'center', padding: '20px' }}>Ingen ingredienser funnet</p>
                )}
              </>
            )}
          </div>

          {/* Chips dock */}
          {selectedIngredients.length > 0 && (
            <div style={{
              borderTop: '1px solid #e7e5e2',
              paddingTop: '10px',
              paddingBottom: '4px',
            }}>
              <p style={{ color: '#78716c', fontSize: '0.75rem', fontWeight: '600', margin: '0 0 8px', textTransform: 'uppercase' }}>
                Valgt ({selectedIngredients.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedIngredients.map(ing => (
                  <div key={ing.id} style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: '#fff7ed', border: '1.5px solid #c2410c',
                    borderRadius: '20px', padding: '5px 6px 5px 10px',
                    fontSize: '0.85rem',
                  }}>
                    <span style={{ fontWeight: '600', color: '#1c1917' }}>{ing.name}</span>

                    {/* Unit toggle */}
                    <button onClick={e => { e.stopPropagation(); updateUnit(ing.id, ing.unit === 'g' ? 'stk' : ing.unit === 'stk' ? 'dl' : 'g'); }} style={{
                      background: '#fde8d8', border: 'none', borderRadius: '6px',
                      padding: '2px 5px', fontSize: '0.72rem', color: '#c2410c',
                      fontWeight: '700', cursor: 'pointer', marginLeft: '2px',
                    }}>
                      {ing.unit}
                    </button>

                    {/* − qty + */}
                    <button onClick={e => { e.stopPropagation(); adjustQuantity(ing.id, -1); }} style={{ background: 'none', border: 'none', color: '#c2410c', fontSize: '1rem', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>−</button>

                    {editingQtyId === ing.id ? (
                      <input type="number" min="0.1" step="1" value={ing.quantity} autoFocus onChange={e => updateQuantity(ing.id, e.target.value)} onBlur={() => setEditingQtyId(null)} style={{
                        width: '40px', textAlign: 'center', border: '1px solid #c2410c',
                        borderRadius: '4px', fontSize: '0.82rem', padding: '1px 2px',
                        fontWeight: '700', color: '#1c1917',
                      }} />
                    ) : (
                      <span onClick={e => { e.stopPropagation(); setEditingQtyId(ing.id); }} style={{ fontWeight: '700', color: '#1c1917', minWidth: '20px', textAlign: 'center', cursor: 'text' }}>
                        {ing.quantity}
                      </span>
                    )}

                    <button onClick={e => { e.stopPropagation(); adjustQuantity(ing.id, 1); }} style={{ background: 'none', border: 'none', color: '#c2410c', fontSize: '1rem', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>+</button>

                    <button onClick={e => { e.stopPropagation(); removeIngredient(ing.id); }} style={{ background: 'none', border: 'none', color: '#a8a29e', fontSize: '0.9rem', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <h1 style={{ color: '#1c1917', fontSize: '1.2rem', fontWeight: '600', margin: '12px 0 2px' }}>Detaljer</h1>
          <p style={{ color: '#a8a29e', fontSize: '0.85rem', margin: '0 0 20px' }}>Tid, personer, kategori</p>

          {/* Time section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800', color: '#c2410c', lineHeight: 1 }}>
                {mealData.time_minutes}
              </span>
              <span style={{ fontSize: '1rem', color: '#78716c', fontWeight: '600', marginLeft: '4px' }}>min</span>
            </div>

            {/* Quick buttons */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {QUICK_TIMES.map(t => (
                <button key={t} onClick={() => setMealData({ ...mealData, time_minutes: t })} style={{
                  flex: 1, padding: '10px 0', borderRadius: '10px',
                  background: mealData.time_minutes === t ? '#c2410c' : '#fff',
                  color: mealData.time_minutes === t ? '#fff' : '#1c1917',
                  border: mealData.time_minutes === t ? 'none' : '1px solid #e7e5e2',
                  fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.15s',
                }}>
                  {t}m
                </button>
              ))}
              <button onClick={() => setMealData({ ...mealData, time_minutes: Math.max(90, mealData.time_minutes >= 90 ? mealData.time_minutes : 90) })} style={{
                flex: 1, padding: '10px 0', borderRadius: '10px',
                background: mealData.time_minutes >= 90 ? '#c2410c' : '#fff',
                color: mealData.time_minutes >= 90 ? '#fff' : '#1c1917',
                border: mealData.time_minutes >= 90 ? 'none' : '1px solid #e7e5e2',
                fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.15s',
              }}>
                90+
              </button>
            </div>

            {/* Slider */}
            <input type="range" min="5" max="180" step="5" value={mealData.time_minutes} onChange={e => setMealData({ ...mealData, time_minutes: parseInt(e.target.value) })} style={{
              width: '100%',
              accentColor: '#c2410c',
              height: '6px',
              cursor: 'pointer',
            }} />
          </div>

          {/* Persons */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#78716c', fontWeight: '600', marginBottom: '8px' }}>
              Antall personer
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setMealData({ ...mealData, persons: Math.max(1, mealData.persons - 1) })} style={{
                width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #e7e5e2',
                background: '#fff', cursor: 'pointer', fontSize: '1.2rem', color: '#c2410c', fontWeight: '700'
              }}>−</button>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1c1917', minWidth: '20px', textAlign: 'center' }}>
                {mealData.persons}
              </span>
              <button onClick={() => setMealData({ ...mealData, persons: mealData.persons + 1 })} style={{
                width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #e7e5e2',
                background: '#fff', cursor: 'pointer', fontSize: '1.2rem', color: '#c2410c', fontWeight: '700'
              }}>+</button>
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#78716c', fontWeight: '600', marginBottom: '8px' }}>
              Type rett (valgfritt)
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Pasta', 'Fisk', 'Kjøtt', 'Suppe', 'Salat', 'Annet'].map(cat => (
                <button key={cat} onClick={() => setMealData({ ...mealData, category: mealData.category === cat ? 'Annet' : cat })} style={{
                  padding: '8px 12px', borderRadius: '8px',
                  background: mealData.category === cat ? '#fff7ed' : '#fff',
                  color: mealData.category === cat ? '#c2410c' : '#1c1917',
                  border: mealData.category === cat ? '2px solid #c2410c' : '1px solid #e7e5e2',
                  fontWeight: '500', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.15s',
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '14px',
            border: '1px solid #e7e5e2', marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: selectedIngredients.length > 0 ? '10px' : '0' }}>
              <span style={{ fontSize: '1.8rem' }}>{mealData.emoji}</span>
              <div>
                <div style={{ fontWeight: '700', color: '#1c1917', fontSize: '1rem' }}>{mealData.name || '(navn)'}</div>
                <div style={{ color: '#a8a29e', fontSize: '0.8rem' }}>⏱ {mealData.time_minutes} min · 👥 {mealData.persons} pers</div>
              </div>
            </div>
            {selectedIngredients.length > 0 && (
              <div style={{ fontSize: '0.8rem', color: '#78716c', borderTop: '1px solid #f0ede9', paddingTop: '8px' }}>
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
    </div>
  );
}
