import React, { useState, useEffect } from 'react';
import { createMeal, getIngredients, getIngredientCategories } from '../api.js';
import { useNavigate } from 'react-router-dom';

export default function MealCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: meal info, 2: ingredients, 3: review
  const [mealData, setMealData] = useState({
    name: '',
    emoji: '🍽',
    description: '',
    time_minutes: 30,
    category: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
    if (step === 2) {
      loadIngredients();
    }
  }, [step]);

  async function loadCategories() {
    try {
      const data = await getIngredientCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadIngredients(searchTerm = '') {
    try {
      const { data } = await getIngredients(null, searchTerm || search, 500);
      setAvailableIngredients(data || []);
    } catch (e) {
      setError(e.message);
    }
  }

  function handleAddIngredient(ing) {
    setIngredients([...ingredients, {
      ingredient_id: ing.id,
      name: ing.name,
      price: ing.price,
      quantity: 1,
      unit: ing.unit,
      category: ing.category,
    }]);
    setSearch('');
  }

  function handleRemoveIngredient(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function handleQuantityChange(index, quantity) {
    const updated = [...ingredients];
    updated[index].quantity = parseFloat(quantity) || 1;
    setIngredients(updated);
  }

  function calculateTotalPrice() {
    return ingredients.reduce((sum, ing) => sum + (ing.price * ing.quantity), 0).toFixed(2);
  }

  async function handleCreateMeal() {
    if (!mealData.name) {
      setError('Navn på måltid er påkrevd');
      return;
    }

    try {
      setLoading(true);
      await createMeal({
        ...mealData,
        ingredients,
      });
      navigate('/app');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const groupedByCategory = availableIngredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {});

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Lag ny måltid</h1>
        <div style={s.stepIndicator}>
          {[1, 2, 3].map(num => (
            <div
              key={num}
              style={{
                ...s.step,
                ...(step === num ? s.stepActive : {}),
              }}
              onClick={() => num < step && setStep(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {error && <p style={s.error}>{error}</p>}

      {/* Step 1: Meal Info */}
      {step === 1 && (
        <div style={s.step1}>
          <label style={s.label}>
            Emoji
            <input
              type="text"
              maxLength="2"
              value={mealData.emoji}
              onChange={e => setMealData({ ...mealData, emoji: e.target.value })}
              style={s.input}
            />
          </label>

          <label style={s.label}>
            Navn på måltid *
            <input
              type="text"
              value={mealData.name}
              onChange={e => setMealData({ ...mealData, name: e.target.value })}
              placeholder="F.eks. Fårikål"
              style={s.input}
            />
          </label>

          <label style={s.label}>
            Beskrivelse
            <textarea
              value={mealData.description}
              onChange={e => setMealData({ ...mealData, description: e.target.value })}
              placeholder="Kort beskrivelse av måltid..."
              style={s.textarea}
              rows="4"
            />
          </label>

          <label style={s.label}>
            Tidsforbruk (minutter)
            <input
              type="number"
              value={mealData.time_minutes}
              onChange={e => setMealData({ ...mealData, time_minutes: parseInt(e.target.value) })}
              min="5"
              max="180"
              style={s.input}
            />
          </label>

          <label style={s.label}>
            Kategori
            <select
              value={mealData.category}
              onChange={e => setMealData({ ...mealData, category: e.target.value })}
              style={s.input}
            >
              <option value="">Velg kategori</option>
              <option value="Pasta">Pasta</option>
              <option value="Fisk">Fisk</option>
              <option value="Kjøtt">Kjøtt</option>
              <option value="Suppe">Suppe</option>
              <option value="Salat">Salat</option>
              <option value="Meksikansk">Meksikansk</option>
              <option value="Asiatisk">Asiatisk</option>
              <option value="Annet">Annet</option>
            </select>
          </label>

          <div style={s.buttonRow}>
            <button onClick={() => navigate('/app')} style={s.buttonSecondary}>
              Avbryt
            </button>
            <button onClick={() => setStep(2)} style={s.buttonPrimary}>
              Neste: Ingredienser
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Ingredients */}
      {step === 2 && (
        <div style={s.step2}>
          <h2 style={s.subtitle}>Legg til ingredienser</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Søk ingrediens..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (e.target.value.length > 0) loadIngredients(e.target.value);
            }}
            style={s.input}
          />

          {/* Ingredient list */}
          {search && (
            <div style={s.ingredientList}>
              {Object.entries(groupedByCategory).map(([category, items]) => (
                <div key={category}>
                  <h4 style={s.categoryLabel}>{category}</h4>
                  {items.map(ing => (
                    <button
                      key={ing.id}
                      onClick={() => handleAddIngredient(ing)}
                      style={s.ingredientOption}
                    >
                      <span>{ing.name}</span>
                      <span style={s.price}>{ing.price} kr/{ing.unit}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Added ingredients */}
          <h3 style={s.subtitle}>Valgte ingredienser ({ingredients.length})</h3>
          <div style={s.addedIngredients}>
            {ingredients.map((ing, idx) => (
              <div key={idx} style={s.addedIngredientRow}>
                <div style={s.ingInfo}>
                  <span style={s.ingName}>{ing.name}</span>
                  <span style={s.ingPrice}>{(ing.price * ing.quantity).toFixed(2)} kr</span>
                </div>
                <div style={s.ingQuantity}>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={ing.quantity}
                    onChange={e => handleQuantityChange(idx, e.target.value)}
                    style={s.quantityInput}
                  />
                  <span style={s.unit}>{ing.unit}</span>
                </div>
                <button
                  onClick={() => handleRemoveIngredient(idx)}
                  style={s.deleteBtn}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={s.buttonRow}>
            <button onClick={() => setStep(1)} style={s.buttonSecondary}>
              Tilbake
            </button>
            <button onClick={() => setStep(3)} style={s.buttonPrimary}>
              Neste: Gjennomgang
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div style={s.step3}>
          <div style={s.reviewCard}>
            <div style={s.reviewHeader}>
              <span style={s.reviewEmoji}>{mealData.emoji}</span>
              <div>
                <h2 style={s.reviewName}>{mealData.name}</h2>
                <p style={s.reviewDesc}>{mealData.description}</p>
              </div>
            </div>

            <div style={s.reviewMeta}>
              <span>⏱ {mealData.time_minutes} min</span>
              <span>📂 {mealData.category}</span>
              <span style={s.totalPrice}>💰 {calculateTotalPrice()} kr</span>
            </div>

            <h3 style={s.subtitle}>Ingredienser ({ingredients.length})</h3>
            {ingredients.map((ing, idx) => (
              <div key={idx} style={s.reviewIngredient}>
                <span>{ing.name}</span>
                <span>{ing.quantity} {ing.unit}</span>
                <span style={s.price}>{(ing.price * ing.quantity).toFixed(2)} kr</span>
              </div>
            ))}
          </div>

          <div style={s.buttonRow}>
            <button onClick={() => setStep(2)} style={s.buttonSecondary}>
              Tilbake
            </button>
            <button
              onClick={handleCreateMeal}
              disabled={loading}
              style={{ ...s.buttonPrimary, ...(loading ? { opacity: 0.6 } : {}) }}
            >
              {loading ? 'Opprett...' : 'Lag måltid'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '16px', minHeight: '100vh', background: '#faf8f5', maxWidth: '100%', margin: '0 auto' },
  header: { marginBottom: 24 },
  title: { fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 800, color: '#1c1917', margin: '0 0 16px' },
  stepIndicator: { display: 'flex', gap: 12 },
  step: { width: 40, height: 40, borderRadius: '50%', border: '2px solid #e7e5e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#a8a29e' },
  stepActive: { background: '#c2410c', borderColor: '#c2410c', color: '#fff' },
  step1: { display: 'flex', flexDirection: 'column', gap: 16 },
  step2: { display: 'flex', flexDirection: 'column', gap: 16 },
  step3: { display: 'flex', flexDirection: 'column', gap: 16 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem', fontWeight: 600, color: '#1c1917' },
  input: { padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e7e5e2', fontSize: '1rem', fontFamily: 'inherit' },
  textarea: { padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e7e5e2', fontSize: '1rem', fontFamily: 'inherit' },
  subtitle: { fontSize: '1rem', fontWeight: 700, color: '#1c1917', margin: '0 0 12px' },
  ingredientList: { border: '1px solid #e7e5e2', borderRadius: 8, maxHeight: 300, overflowY: 'auto', background: '#fff' },
  categoryLabel: { fontSize: '0.85rem', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', padding: '8px 12px 4px', margin: 0 },
  ingredientOption: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', color: '#1c1917', transition: 'background 0.15s' },
  price: { fontSize: '0.8rem', color: '#c2410c', fontWeight: 600 },
  addedIngredients: { display: 'flex', flexDirection: 'column', gap: 8 },
  addedIngredientRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px', background: '#fff', borderRadius: 8, border: '1px solid #e7e5e2' },
  ingInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
  ingName: { fontSize: '0.9rem', fontWeight: 600, color: '#1c1917' },
  ingPrice: { fontSize: '0.8rem', color: '#c2410c', fontWeight: 600 },
  ingQuantity: { display: 'flex', alignItems: 'center', gap: 6 },
  quantityInput: { width: 50, padding: '6px', borderRadius: 4, border: '1px solid #e7e5e2', fontSize: '0.9rem' },
  unit: { fontSize: '0.8rem', color: '#a8a29e', minWidth: 30 },
  deleteBtn: { width: 28, height: 28, borderRadius: 4, border: '1px solid #e7e5e2', background: '#faf8f5', cursor: 'pointer', fontSize: '0.9rem' },
  buttonRow: { display: 'flex', gap: 10, marginTop: 16 },
  buttonPrimary: { flex: 1, padding: '12px', borderRadius: 8, background: '#c2410c', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' },
  buttonSecondary: { flex: 1, padding: '12px', borderRadius: 8, background: '#fff', color: '#1c1917', border: '1.5px solid #e7e5e2', fontWeight: 700, cursor: 'pointer' },
  reviewCard: { background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e7e5e2' },
  reviewHeader: { display: 'flex', gap: 12, marginBottom: 16 },
  reviewEmoji: { fontSize: '2.5rem' },
  reviewName: { fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 700, color: '#1c1917', margin: 0 },
  reviewDesc: { fontSize: '0.9rem', color: '#78716c', margin: '4px 0 0' },
  reviewMeta: { display: 'flex', gap: 12, marginBottom: 16, fontSize: '0.9rem', color: '#78716c' },
  totalPrice: { fontWeight: 700, color: '#c2410c' },
  reviewIngredient: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0ede9', fontSize: '0.9rem' },
  error: { color: '#c2410c', background: '#fff7ed', padding: 12, borderRadius: 8, marginBottom: 16 },
};
