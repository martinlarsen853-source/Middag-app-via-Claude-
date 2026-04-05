import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('MealCreatePage error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#faf8f5', minHeight: '100vh' }}>
          <h1 style={{ color: '#c2410c' }}>❌ Feil i komponenten</h1>
          <pre style={{ background: '#fff', padding: '16px', borderRadius: '8px', overflow: 'auto', fontSize: '0.85rem' }}>
            {this.state.error?.toString()}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function MealCreatePageWrapper() {
  return (
    <ErrorBoundary>
      <MealCreatePage />
    </ErrorBoundary>
  );
}

// Cleaned version - no external dependencies

function MealCreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mealData, setMealData] = useState({
    name: '',
    emoji: '🍽',
    description: '',
    time_minutes: 30,
    category: '',
  });

  return (
    <div style={{ padding: '20px', background: '#faf8f5', minHeight: '100vh' }}>
      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h1 style={{ color: '#1c1917' }}>Lag ny måltid</h1>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Emoji
            </label>
            <input
              type="text"
              maxLength="2"
              value={mealData.emoji}
              onChange={e => setMealData({ ...mealData, emoji: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Navn på måltid *
            </label>
            <input
              type="text"
              value={mealData.name}
              onChange={e => setMealData({ ...mealData, name: e.target.value })}
              placeholder="F.eks. Fårikål"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Beskrivelse
            </label>
            <textarea
              value={mealData.description}
              onChange={e => setMealData({ ...mealData, description: e.target.value })}
              placeholder="Kort beskrivelse av måltid..."
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
              rows="4"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Tidsforbruk (minutter)
            </label>
            <input
              type="number"
              value={mealData.time_minutes}
              onChange={e => setMealData({ ...mealData, time_minutes: parseInt(e.target.value) })}
              min="5"
              max="180"
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Kategori
            </label>
            <select
              value={mealData.category}
              onChange={e => setMealData({ ...mealData, category: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e7e5e2', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
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

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h1 style={{ color: '#1c1917' }}>Ingredienser</h1>
          <p style={{ color: '#78716c', fontSize: '1rem', marginBottom: '16px' }}>
            Ingrediensvalget er deaktivert for nå. Gå direkte til gjennomgang.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#fff', color: '#1c1917', border: '1.5px solid #e7e5e2', fontWeight: 'bold', cursor: 'pointer' }}>
              Tilbake
            </button>
            <button onClick={() => setStep(3)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#c2410c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Neste
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e7e5e2' }}>
          <h2 style={{ color: '#1c1917', fontSize: '1.5rem', margin: 0 }}>{mealData.emoji} {mealData.name}</h2>
          <p style={{ color: '#78716c', margin: '8px 0 0' }}>{mealData.description}</p>
          <p style={{ color: '#78716c', marginTop: '16px' }}>⏱ {mealData.time_minutes} min | 📂 {mealData.category}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#fff', color: '#1c1917', border: '1.5px solid #e7e5e2', fontWeight: 'bold', cursor: 'pointer' }}>
              Tilbake
            </button>
            <button onClick={() => { alert('Måltid lagret!'); navigate('/app'); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#c2410c', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Lag måltid
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
