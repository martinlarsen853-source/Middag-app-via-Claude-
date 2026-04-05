import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hard-coded ingredient list with categories
const INGREDIENTS_BY_CATEGORY = {
  'Kjøtt': [
    { id: 1, name: 'Kjøttkjøtt', unit: '500g', price: 89 },
    { id: 2, name: 'Lammekjøtt', unit: '300g', price: 120 },
    { id: 3, name: 'Svinekjøtt', unit: '400g', price: 65 },
    { id: 4, name: 'Kylling', unit: '500g', price: 59 },
  ],
  'Fisk': [
    { id: 5, name: 'Laks', unit: '200g', price: 120 },
    { id: 6, name: 'Torsk', unit: '250g', price: 85 },
    { id: 7, name: 'Sild', unit: '300g', price: 49 },
  ],
  'Meieri': [
    { id: 8, name: 'Melk', unit: '500ml', price: 18 },
    { id: 9, name: 'Ost', unit: '200g', price: 35 },
    { id: 10, name: 'Smør', unit: '250g', price: 28 },
    { id: 11, name: 'Fløte', unit: '250ml', price: 22 },
  ],
  'Grønnsaker': [
    { id: 12, name: 'Løk', unit: '500g', price: 12 },
    { id: 13, name: 'Hvitløk', unit: '100g', price: 8 },
    { id: 14, name: 'Paprika', unit: '200g', price: 15 },
    { id: 15, name: 'Tomat', unit: '500g', price: 18 },
    { id: 16, name: 'Gulrot', unit: '500g', price: 10 },
  ],
  'Pasta & Kornprodukter': [
    { id: 17, name: 'Spaghetti', unit: '500g', price: 15 },
    { id: 18, name: 'Ris', unit: '500g', price: 12 },
    { id: 19, name: 'Poteter', unit: '1kg', price: 8 },
  ],
  'Krydder & Essenser': [
    { id: 20, name: 'Salt', unit: '500g', price: 5 },
    { id: 21, name: 'Pepper', unit: '100g', price: 25 },
    { id: 22, name: 'Olje', unit: '500ml', price: 28 },
  ],
};

const CATEGORIES = Object.keys(INGREDIENTS_BY_CATEGORY).sort();

export default function MealCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mealData, setMealData] = useState({
    name: '',
    emoji: '🍽',
    description: '',
    time_minutes: 30,
    category: '',
  });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(CATEGORIES[0]);

  function addIngredient(ingredient) {
    setSelectedIngredients([...selectedIngredients, { ...ingredient, quantity: 1 }]);
  }

  function removeIngredient(index) {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  }

  function updateQuantity(index, quantity) {
    const updated = [...selectedIngredients];
    updated[index].quantity = Math.max(0.1, parseFloat(quantity) || 1);
    setSelectedIngredients(updated);
  }

  function calculateTotalPrice() {
    return selectedIngredients.reduce((sum, ing) => sum + (ing.price * ing.quantity), 0).toFixed(2);
  }

  function saveMeal() {
    if (!mealData.name) {
      alert('Vennligst skriv inn navn på måltid');
      return;
    }
    alert(`✅ Måltid "${mealData.name}" lagret!\n\nPris: ${calculateTotalPrice()} kr`);
    navigate('/app');
  }

  return (
    <div style={{ padding: '20px', background: '#faf8f5', minHeight: '100vh' }}>
      {/* Step 1: Meal Info */}
      {step === 1 && (
        <div>
          <h1 style={{ color: '#1c1917', marginBottom: '24px' }}>Lag ny måltid</h1>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Emoji</label>
            <input
              type="text"
              maxLength="2"
              value={mealData.emoji}
              onChange={e => setMealData({ ...mealData, emoji: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Navn på måltid *</label>
            <input
              type="text"
              value={mealData.name}
              onChange={e => setMealData({ ...mealData, name: e.target.value })}
              placeholder="F.eks. Fårikål"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Beskrivelse</label>
            <textarea
              value={mealData.description}
              onChange={e => setMealData({ ...mealData, description: e.target.value })}
              placeholder="Kort beskrivelse..."
              rows="3"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Tidsforbruk (minutter)</label>
            <input
              type="number"
              value={mealData.time_minutes}
              onChange={e => setMealData({ ...mealData, time_minutes: parseInt(e.target.value) })}
              min="5"
              max="180"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Kategori</label>
            <select
              value={mealData.category}
              onChange={e => setMealData({ ...mealData, category: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', width: '100%', boxSizing: 'border-box' }}
            >
              <option value="">Velg kategori</option>
              <option value="Pasta">Pasta</option>
              <option value="Fisk">Fisk</option>
              <option value="Kjøtt">Kjøtt</option>
              <option value="Suppe">Suppe</option>
              <option value="Salat">Salat</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/app')} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#fff', color: '#1c1917', border: '1.5px solid #e7e5e2', fontWeight: 'bold', cursor: 'pointer' }}>
              Avbryt
            </button>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#c2410c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Neste
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Ingredients */}
      {step === 2 && (
        <div>
          <h1 style={{ color: '#1c1917', marginBottom: '24px' }}>Velg ingredienser</h1>

          {/* Categories */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#1c1917', marginBottom: '12px' }}>Kategorier</h3>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                  background: expandedCategory === cat ? '#c2410c' : '#fff',
                  color: expandedCategory === cat ? '#fff' : '#1c1917',
                  border: '1px solid #e7e5e2',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {cat} ({INGREDIENTS_BY_CATEGORY[cat].length})
              </button>
            ))}
          </div>

          {/* Ingredients in expanded category */}
          {expandedCategory && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#1c1917', marginBottom: '12px' }}>Ingredienser i {expandedCategory}</h3>
              {INGREDIENTS_BY_CATEGORY[expandedCategory].map(ing => (
                <button
                  key={ing.id}
                  onClick={() => addIngredient(ing)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '8px',
                    background: '#fff',
                    color: '#1c1917',
                    border: '1px solid #e7e5e2',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: '500'
                  }}
                >
                  {ing.name} ({ing.unit})
                </button>
              ))}
            </div>
          )}

          {/* Selected ingredients */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#1c1917', marginBottom: '12px' }}>Valgte ingredienser ({selectedIngredients.length})</h3>
            {selectedIngredients.length === 0 ? (
              <p style={{ color: '#a8a29e' }}>Ingen ingredienser valgt ennå</p>
            ) : (
              selectedIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '8px',
                    background: '#fff',
                    border: '1px solid #e7e5e2'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1c1917' }}>{ing.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#a8a29e' }}>{ing.unit}</div>
                  </div>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={ing.quantity}
                    onChange={e => updateQuantity(idx, e.target.value)}
                    style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #e7e5e2' }}
                  />
                  <button
                    onClick={() => removeIngredient(idx)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      background: '#faf8f5',
                      color: '#c2410c',
                      border: '1px solid #e7e5e2',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#fff', color: '#1c1917', border: '1.5px solid #e7e5e2', fontWeight: 'bold', cursor: 'pointer' }}>
              Tilbake
            </button>
            <button onClick={() => setStep(3)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#c2410c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Gjennomgang
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e7e5e2', marginBottom: '24px' }}>
            <h2 style={{ color: '#1c1917', fontSize: '1.5rem', margin: '0 0 8px' }}>
              {mealData.emoji} {mealData.name}
            </h2>
            <p style={{ color: '#78716c', margin: '0 0 16px' }}>{mealData.description}</p>
            <div style={{ display: 'flex', gap: '16px', color: '#78716c', fontSize: '0.9rem', marginBottom: '16px' }}>
              <span>⏱ {mealData.time_minutes} min</span>
              <span>📂 {mealData.category}</span>
            </div>

            <h3 style={{ color: '#1c1917', marginBottom: '12px' }}>Ingredienser ({selectedIngredients.length})</h3>
            {selectedIngredients.map((ing, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0ede9', fontSize: '0.9rem' }}>
                <span>{ing.name}</span>
                <span>{ing.quantity} {ing.unit}</span>
                <span style={{ fontWeight: '600', color: '#c2410c' }}>{(ing.price * ing.quantity).toFixed(0)} kr</span>
              </div>
            ))}

            <div style={{ marginTop: '16px', padding: '12px', background: '#fff7ed', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#1c1917' }}>Totalpris:</span>
              <span style={{ fontWeight: 'bold', color: '#c2410c', fontSize: '1.2rem' }}>{calculateTotalPrice()} kr</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#fff', color: '#1c1917', border: '1.5px solid #e7e5e2', fontWeight: 'bold', cursor: 'pointer' }}>
              Tilbake
            </button>
            <button onClick={saveMeal} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#c2410c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Lag måltid
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
