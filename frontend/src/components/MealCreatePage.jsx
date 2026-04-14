import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIngredients, getIngredientCategories, createMeal } from '../api.js';
import { calculateIngredientCost, describeIngredientPricing, formatCurrency } from '../pricing.js';

const EMOJI_PRESETS = ['🍝', '🥩', '🐟', '🍲', '🥗', '🍳', '🌮', '🍕', '🍔', '🌯', '🥘', '🍛'];

const QUICK_TIMES = [15, 30, 45, 60, 90];

// Most commonly used ingredients (ordered by frequency)
const MOST_USED_INGREDIENTS = [
  'Melk',
  'Kjøttdeig',
  'Løk',
  'Hvitløk',
  'Smør',
  'Egg',
  'Ost',
  'Tomat',
  'Hermetiske tomater',
  'Olivenolje',
  'Salt',
  'Pepper',
];

function getIngredientFrequency(name) {
  const idx = MOST_USED_INGREDIENTS.indexOf(name);
  return idx >= 0 ? idx : 999;
}

function guessEmojiFromName(name) {
  if (!name) return '🍽';

  const lower = name.toLowerCase();

  // Fish & seafood
  if (lower.match(/laks|sei|torsk|fisk|reker|scampi|tun|makrell|sardiner|fiskegrateng|fiskekaker|ceviche|gravlaks|fiskestew|skalldyr|blekksprut|kamskjell/)) return '🐟';

  // Pasta
  if (lower.match(/pasta|spaghetti|penne|bolognese|carbonara|lasagne|tortellini|ravioli|fettuccine|tagliatelle/)) return '🍝';

  // Meat (beef, pork)
  if (lower.match(/kjøtt|steak|entrecôte|biff|kjøttboller|karbonader|grillpølse|pølse|bacon|prøjekt|pulled pork|ribs|kyllingkjøtt/)) return '🍖';

  // Chicken
  if (lower.match(/kylling|kyllingfilet|kyllingsuppe|kyllingwok|kylling|chicken|nuggets/)) return '🍗';

  // Soup & stew
  if (lower.match(/suppe|stew|gryte|gryterett|fårikål|kjøttsupe|grønnsakssuppe|minestrone|tomatsuppe|løksuppe/)) return '🍲';

  // Salad
  if (lower.match(/salat|cesar|greek|coleslaw|rucola|spinat|salad|dressing/)) return '🥗';

  // Egg dishes
  if (lower.match(/omelett|egg|scrambled|frittata|røromelett|stekte egg|pochert/)) return '🍳';

  // Tacos & Mexican
  if (lower.match(/taco|burrito|fajita|enchilada|quesadilla|chili|nacho|mexikansk/)) return '🌮';

  // Pizza
  if (lower.match(/pizza|margherita|hawaiian|pepperoni|quattro formaggi/)) return '🍕';

  // Burger
  if (lower.match(/burger|hamburger|kjøttkaker|smørbrød|sandwich/)) return '🍔';

  // Rice & Asian
  if (lower.match(/ris|risotto|wok|asiatisk|thai|asian|pad thai|teriyaki|sushi|ramen|nudler|noodles/)) return '🍛';

  // Bread & bakery
  if (lower.match(/brød|rundstykker|bagel|focaccia|fladbrød|pannekaker|pancakes|waffles/)) return '🍞';

  // Default
  return '🍽';
}

function updateMealName(name) {
  return {
    name,
    emoji: guessEmojiFromName(name),
  };
}

const CATEGORY_EMOJIS = {
  'Grønnsaker': '🥬',
  'Kjøtt': '🍖',
  'Fisk': '🐟',
  'Meieri': '🧀',
  'Bakeri': '🍞',
  'Tørrmat': '🌾',
  'Krydder & sauser': '🌶️',
  'Diverse': '📦',
};

export default function MealCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mealData, setMealData] = useState({
    name: '',
    emoji: '🍽',
    time_minutes: 30,
    category: '',
  });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedForAdding, setSelectedForAdding] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [ingredientsByCategory, setIngredientsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const cats = await getIngredientCategories();
      setCategories(cats || []);

      const { data: ingredients } = await getIngredients(null, null, 1000);
      setAllIngredients(ingredients || []);

      const grouped = {};
      (ingredients || []).forEach(ing => {
        if (!grouped[ing.category]) {
          grouped[ing.category] = [];
        }
        grouped[ing.category].push(ing);
      });

      setIngredientsByCategory(grouped);

      if (cats && cats.length > 0) {
        setSelectedCategory(cats[0].name);
      }
    } catch (e) {
      setError('Feil ved lasting av ingredienser: ' + e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function getVisibleIngredients() {
    let visible = allIngredients;

    if (selectedCategory) {
      visible = visible.filter(ing => ing.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      visible = visible.filter(ing => ing.name.toLowerCase().includes(search));
    }

    // Sort: Most used first, then alphabetically
    visible = visible.sort((a, b) => {
      const freqA = getIngredientFrequency(a.name);
      const freqB = getIngredientFrequency(b.name);
      if (freqA !== freqB) return freqA - freqB;
      return a.name.localeCompare(b.name);
    });

    return visible;
  }

  function getMostUsedIngredients() {
    // Get the most frequently used ingredients that are available
    return allIngredients
      .filter(ing => MOST_USED_INGREDIENTS.includes(ing.name))
      .sort((a, b) => getIngredientFrequency(a.name) - getIngredientFrequency(b.name));
  }

  function toggleIngredientSelection(ingredientId) {
    const newSet = new Set(selectedForAdding);
    if (newSet.has(ingredientId)) {
      newSet.delete(ingredientId);
    } else {
      newSet.add(ingredientId);
    }
    setSelectedForAdding(newSet);
  }

  function addSelectedIngredients() {
    const ingredientsToAdd = allIngredients.filter(ing => selectedForAdding.has(ing.id));
    const newIngredients = ingredientsToAdd.map(ing => ({
      ...ing,
      quantity: Number.isFinite(Number(ing.package_quantity)) && Number(ing.package_quantity) > 0 && ing.package_unit === ing.unit
        ? Number(ing.package_quantity)
        : 1,
    }));
    setSelectedIngredients([...selectedIngredients, ...newIngredients]);
    setSelectedForAdding(new Set());
    setStep(4);
  }

  function removeIngredient(index) {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  }

  function updateQuantity(index, quantity) {
    const updated = [...selectedIngredients];
    updated[index].quantity = Math.max(0.1, parseFloat(quantity) || 1);
    setSelectedIngredients(updated);
  }

  function getPriceSummary() {
    return selectedIngredients.reduce((summary, ing) => {
      const pricing = calculateIngredientCost(ing, ing.quantity, ing.unit);
      if (pricing.status === 'ok') {
        summary.total += pricing.total;
      } else {
        summary.missing += 1;
      }
      return summary;
    }, { total: 0, missing: 0 });
  }

  function formatTotalPriceSummary() {
    const summary = getPriceSummary();
    if (summary.missing === 0) {
      return formatCurrency(summary.total);
    }
    if (summary.total > 0) {
      return `${formatCurrency(summary.total)} + ${summary.missing} ukjent`;
    }
    return `${summary.missing} ukjent`;
  }

  async function saveMeal() {
    if (!mealData.name.trim()) {
      alert('Vennligst skriv inn navn på måltid');
      return;
    }

    try {
      await createMeal({
        ...mealData,
        ingredients: selectedIngredients,
      });
      alert(`✅ Måltid "${mealData.name}" lagret!\n\nPris: ${formatTotalPriceSummary()}`);
      navigate('/app');
    } catch (e) {
      alert('Feil ved lagring: ' + e.message);
    }
  }

  const visibleIngredients = getVisibleIngredients();

  return (
    <div style={{ padding: '0', background: '#faf8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ========== STEP 1: Navn + Emoji ========== */}
      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <h1 style={{ color: '#1c1917', fontSize: '1.2rem', fontWeight: '600', marginBottom: '4px', marginTop: '12px' }}>Nytt måltid</h1>
          <p style={{ color: '#a8a29e', fontSize: '0.9rem', marginBottom: '24px', margin: 0 }}>Hva skal vi lage?</p>

          {/* Name input - BIG and prominent */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={mealData.name}
              onChange={e => {
                const { name, emoji } = updateMealName(e.target.value);
                setMealData({ ...mealData, name, emoji });
              }}
              placeholder="Navn på måltid"
              autoFocus
              style={{
                padding: '16px 12px',
                borderRadius: '12px',
                border: 'none',
                background: '#fff',
                width: '100%',
                boxSizing: 'border-box',
                fontSize: '1.1rem',
                fontWeight: '500',
                color: '#1c1917',
                outline: 'none',
              }}
            />
          </div>

          {/* Auto emoji display + override options */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#78716c', fontSize: '0.8rem', fontWeight: '500', marginBottom: '10px' }}>
              {mealData.name ? 'Endre emoji (valgfritt):' : 'Velg emoji:'}
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {EMOJI_PRESETS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setMealData({ ...mealData, emoji })}
                  style={{
                    flex: '1 1 calc(25% - 5px)',
                    minWidth: '54px',
                    padding: '10px',
                    borderRadius: '10px',
                    background: mealData.emoji === emoji ? '#c2410c' : '#fff',
                    border: mealData.emoji === emoji ? '2px solid #c2410c' : '1px solid #e7e5e2',
                    fontSize: '1.6rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {mealData.name && (
              <p style={{ color: '#a8a29e', fontSize: '0.75rem', marginTop: '8px', fontStyle: 'italic' }}>
                💡 Emoji valgt automatisk basert på navn
              </p>
            )}
          </div>

          {/* Buttons */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/app')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                background: 'transparent',
                color: '#c2410c',
                border: '1.5px solid #c2410c',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Avbryt
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!mealData.name.trim()}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: '10px',
                background: mealData.name.trim() ? '#c2410c' : '#d4a9a0',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: mealData.name.trim() ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
              }}
            >
              Neste →
            </button>
          </div>
        </div>
      )}

      {/* ========== STEP 2: Tidsforbruk + Kategori ========== */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <h1 style={{ color: '#1c1917', fontSize: '1.2rem', fontWeight: '600', marginBottom: '4px', marginTop: '12px' }}>Hvor lang tid?</h1>
          <p style={{ color: '#a8a29e', fontSize: '0.9rem', marginBottom: '16px', margin: 0 }}>2/4</p>

          {/* Quick time select */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
              {QUICK_TIMES.map(time => (
                <button
                  key={time}
                  onClick={() => setMealData({ ...mealData, time_minutes: time })}
                  style={{
                    flex: '0 0 auto',
                    minWidth: '60px',
                    padding: '10px 14px',
                    borderRadius: '20px',
                    background: mealData.time_minutes === time ? '#c2410c' : '#fff',
                    color: mealData.time_minutes === time ? '#fff' : '#1c1917',
                    border: mealData.time_minutes === time ? 'none' : '1px solid #e7e5e2',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {time}m
                </button>
              ))}
            </div>
          </div>

          {/* Category select */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#78716c', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px' }}>Type rett (valgfritt):</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Pasta', 'Fisk', 'Kjøtt', 'Suppe', 'Salat', 'Annet'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setMealData({ ...mealData, category: mealData.category === cat ? '' : cat })}
                  style={{
                    flex: '1 1 calc(33% - 6px)',
                    minWidth: '80px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: mealData.category === cat ? '#fff7ed' : '#fff',
                    color: mealData.category === cat ? '#c2410c' : '#1c1917',
                    border: mealData.category === cat ? '2px solid #c2410c' : '1px solid #e7e5e2',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setStep(1)}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                background: '#fff',
                color: '#1c1917',
                border: '1.5px solid #e7e5e2',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ← Tilbake
            </button>
            <button
              onClick={() => setStep(3)}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: '10px',
                background: '#c2410c',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Neste →
            </button>
          </div>
        </div>
      )}

      {/* ========== STEP 3: Velg ingredienser (Multi-select) ========== */}
      {step === 3 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: '0' }}>
          <h1 style={{ color: '#1c1917', fontSize: '1.2rem', fontWeight: '600', marginBottom: '4px', marginTop: '12px' }}>Legg til ingredienser</h1>
          <p style={{ color: '#a8a29e', fontSize: '0.9rem', marginBottom: '16px', margin: 0 }}>3/4</p>

          {error && (
            <div style={{ padding: '10px', background: '#fff7ed', color: '#c2410c', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Search */}
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Søk ingrediens..."
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #e7e5e2',
                background: '#fff',
                width: '100%',
                boxSizing: 'border-box',
                fontSize: '1rem',
                color: '#1c1917',
              }}
            />
          </div>

          {/* Category tabs */}
          {!searchTerm && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px', paddingBottom: '4px' }}>
              {Object.keys(ingredientsByCategory).sort().map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  style={{
                    flex: '0 0 auto',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    background: selectedCategory === cat ? '#c2410c' : '#fff',
                    color: selectedCategory === cat ? '#fff' : '#1c1917',
                    border: selectedCategory === cat ? 'none' : '1px solid #e7e5e2',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {CATEGORY_EMOJIS[cat] || '📦'} {cat}
                </button>
              ))}
            </div>
          )}

          {/* Ingredients list - scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
            {loading ? (
              <p style={{ color: '#a8a29e', textAlign: 'center', padding: '20px' }}>Laster ingredienser...</p>
            ) : visibleIngredients.length === 0 ? (
              <p style={{ color: '#a8a29e', textAlign: 'center', padding: '20px' }}>Ingen ingredienser funnet</p>
            ) : (
              <>
                {/* Most used section - only when not filtering */}
                {!searchTerm && !selectedCategory && getMostUsedIngredients().length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ color: '#78716c', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', marginTop: '0' }}>Klassikerne</h3>
                    {getMostUsedIngredients().map(ing => {
                      const isSelected = selectedForAdding.has(ing.id);
                      return (
                        <button
                          key={ing.id}
                          onClick={() => toggleIngredientSelection(ing.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '12px',
                            marginBottom: '6px',
                            borderRadius: '10px',
                            background: isSelected ? '#fff7ed' : '#fff',
                            border: isSelected ? '2px solid #c2410c' : '1px solid #e7e5e2',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            position: 'relative',
                          }}
                        >
                          {isSelected && (
                            <div style={{
                              position: 'absolute',
                              left: '0',
                              top: '0',
                              bottom: '0',
                              width: '4px',
                              background: '#c2410c',
                              borderRadius: '10px 0 0 10px',
                            }} />
                          )}
                          <div style={{ flex: 1, paddingLeft: isSelected ? '12px' : '0' }}>
                            <div style={{ fontWeight: '600', color: '#1c1917', fontSize: '0.95rem' }}>{ing.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#a8a29e' }}>{ing.unit}</div>
                          </div>
                          {isSelected && (
                            <span style={{ color: '#c2410c', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                          )}
                        </button>
                      );
                    })}
                    <div style={{ height: '8px' }} />
                  </div>
                )}

                {/* Rest of ingredients */}
                <div>
                  {!searchTerm && !selectedCategory && (
                    <h3 style={{ color: '#78716c', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', marginTop: '0' }}>Alle</h3>
                  )}
                  {visibleIngredients.map(ing => {
                    const isSelected = selectedForAdding.has(ing.id);
                    const isMostUsed = MOST_USED_INGREDIENTS.includes(ing.name);

                    // Skip most used items when showing "all" list (they're already shown above)
                    if (!searchTerm && !selectedCategory && isMostUsed) return null;

                    return (
                      <button
                        key={ing.id}
                        onClick={() => toggleIngredientSelection(ing.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          padding: '12px',
                          marginBottom: '6px',
                          borderRadius: '10px',
                          background: isSelected ? '#fff7ed' : '#fff',
                          border: isSelected ? '2px solid #c2410c' : '1px solid #e7e5e2',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          position: 'relative',
                        }}
                      >
                        {isSelected && (
                          <div style={{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            bottom: '0',
                            width: '4px',
                            background: '#c2410c',
                            borderRadius: '10px 0 0 10px',
                          }} />
                        )}
                        <div style={{ flex: 1, paddingLeft: isSelected ? '12px' : '0' }}>
                          <div style={{ fontWeight: '600', color: '#1c1917', fontSize: '0.95rem' }}>{ing.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#a8a29e' }}>{ing.unit}</div>
                        </div>
                        {isSelected && (
                          <span style={{ color: '#c2410c', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', paddingBottom: '16px' }}>
            <button
              onClick={() => setStep(2)}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                background: '#fff',
                color: '#1c1917',
                border: '1.5px solid #e7e5e2',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ← Tilbake
            </button>
            {selectedForAdding.size > 0 && (
              <button
                onClick={addSelectedIngredients}
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '10px',
                  background: '#c2410c',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Legg til {selectedForAdding.size} →
              </button>
            )}
            {selectedForAdding.size === 0 && (
              <button
                onClick={() => setStep(5)}
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '10px',
                  background: '#e7e5e2',
                  color: '#78716c',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Hopp over →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========== STEP 4: Rediger mengde ========== */}
      {step === 4 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: '0' }}>
          <h1 style={{ color: '#1c1917', fontSize: '1.2rem', fontWeight: '600', marginBottom: '4px', marginTop: '12px' }}>Mengde for hver ingrediens</h1>
          <p style={{ color: '#a8a29e', fontSize: '0.9rem', marginBottom: '16px', margin: 0 }}>4/4</p>

          {/* Ingredients with quantity editors */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
            {selectedIngredients.map((ing, idx) => (
              <div key={idx} style={{ marginBottom: '16px', background: '#fff', padding: '14px', borderRadius: '10px', border: '1px solid #e7e5e2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#c2410c', fontSize: '1rem' }}>{ing.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#a8a29e' }}>{ing.category}</div>
                  </div>
                  <button
                    onClick={() => removeIngredient(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#c2410c',
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                      padding: '0',
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>Mengde</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={ing.quantity}
                      onChange={e => updateQuantity(idx, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #e7e5e2',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#1c1917',
                      }}
                    />
                  </div>
                  <div style={{ flex: 0.8 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>Enhet</label>
                    <div style={{ fontSize: '0.95rem', color: '#1c1917', fontWeight: '500', padding: '10px', background: '#faf8f5', borderRadius: '8px' }}>
                      {ing.unit}
                    </div>
                  </div>
                  <div style={{ flex: 0.6, textAlign: 'right' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#78716c', marginBottom: '4px', fontWeight: '500' }}>Pris</label>
                    <div style={{ fontSize: '0.95rem', color: '#c2410c', fontWeight: '600' }}>
                      {(() => {
                        const pricing = calculateIngredientCost(ing, ing.quantity, ing.unit);
                        return pricing.status === 'ok' ? formatCurrency(pricing.total) : 'Ukjent pris';
                      })()}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#a8a29e', marginTop: '4px' }}>
                      {describeIngredientPricing(ing)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', paddingBottom: '16px' }}>
            <button
              onClick={() => { setSelectedForAdding(new Set()); setStep(3); }}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                background: '#fff',
                color: '#1c1917',
                border: '1.5px solid #e7e5e2',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ← Tilbake
            </button>
            <button
              onClick={() => setStep(5)}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: '10px',
                background: '#c2410c',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Gjennomgang →
            </button>
          </div>
        </div>
      )}

      {/* ========== STEP 5: Gjennomgang & Lagring ========== */}
      {step === 5 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: '0' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '14px', border: '1px solid #e7e5e2', marginBottom: '16px', marginTop: '12px' }}>
            <h2 style={{ color: '#1c1917', fontSize: '1.4rem', margin: '0 0 8px', fontWeight: '600' }}>
              {mealData.emoji} {mealData.name}
            </h2>
            <div style={{ display: 'flex', gap: '12px', color: '#78716c', fontSize: '0.85rem', marginBottom: '12px', flexWrap: 'wrap' }}>
              {mealData.time_minutes && <span>⏱ {mealData.time_minutes} min</span>}
              {mealData.category && <span>📂 {mealData.category}</span>}
            </div>

            {selectedIngredients.length > 0 && (
              <>
                <h3 style={{ color: '#1c1917', marginBottom: '10px', marginTop: '12px', fontSize: '0.95rem', fontWeight: '600' }}>Ingredienser ({selectedIngredients.length})</h3>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedIngredients.map((ing, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0ede9', fontSize: '0.85rem' }}>
                        <span>{ing.name}</span>
                        <span style={{ textAlign: 'right' }}>
                          <span style={{ marginRight: '12px' }}>{ing.quantity} {ing.unit}</span>
                          <span style={{ fontWeight: '600', color: '#c2410c' }}>
                            {(() => {
                              const pricing = calculateIngredientCost(ing, ing.quantity, ing.unit);
                              return pricing.status === 'ok' ? formatCurrency(pricing.total) : 'Ukjent pris';
                            })()}
                          </span>
                        </span>
                      </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ marginTop: '12px', padding: '10px', background: '#fff7ed', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: '#1c1917', fontSize: '0.9rem' }}>Totalpris:</span>
              <span style={{ fontWeight: 'bold', color: '#c2410c', fontSize: '1.1rem' }}>{formatTotalPriceSummary()}</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingBottom: '16px' }}>
            <button
              onClick={() => setStep(selectedIngredients.length > 0 ? 4 : 3)}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '10px',
                background: '#fff',
                color: '#1c1917',
                border: '1.5px solid #e7e5e2',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ← Tilbake
            </button>
            <button
              onClick={saveMeal}
              style={{
                flex: 2,
                padding: '14px',
                borderRadius: '10px',
                background: '#c2410c',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Lag måltid ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
