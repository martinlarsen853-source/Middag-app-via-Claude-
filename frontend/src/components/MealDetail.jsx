import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeal } from '../api.js';
import PersonCounter from './PersonCounter.jsx';
import { colors, shadows, radius } from '../theme.js';

const sectionColors = {
  'Frukt & grønt': { bg: '#1a3a2e', text: '#5cff9e' },
  'Kjøtt & fisk': { bg: '#3a1a1a', text: '#ff6b6b' },
  'Meieri': { bg: '#3a3a1a', text: '#ffd666' },
  'Tørrmat': { bg: '#3a2a1a', text: '#ffb366' },
  'Frys': { bg: '#1a3a4a', text: '#66d4ff' },
  'Bakeri': { bg: '#3a3a2a', text: '#ffcc66' },
  'Krydder & sauser': { bg: '#2a1a3a', text: '#dd99ff' },
  'Drikkevarer': { bg: '#1a3a4a', text: '#66d4ff' },
  'Diverse': { bg: '#2a2a3a', text: '#b0b0c8' }
};

function PriceDots({ level }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: i < level ? colors.accent : colors.textTertiary,
        }}>
          kr
        </span>
      ))}
    </div>
  );
}

export default function MealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [persons, setPersons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('middag_user') || '{}').default_persons || 2;
    } catch { return 2; }
  });

  useEffect(() => {
    getMeal(id)
      .then(setMeal)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleGoShopping() {
    const user = JSON.parse(localStorage.getItem('middag_user') || '{}');
    user.default_persons = persons;
    localStorage.setItem('middag_user', JSON.stringify(user));
    localStorage.setItem('middag_persons_' + id, persons);
    navigate(`/meal/${id}/shopping`);
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>🍽️</div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center' }}>
        <div>
          <p style={{ color: colors.error, marginBottom: '16px' }}>{error || 'Måltid ikke funnet'}</p>
          <button
            onClick={() => navigate('/')}
            style={{ color: colors.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Tilbake
          </button>
        </div>
      </div>
    );
  }

  const BASE_PERSONS = 4;
  const scale = persons / BASE_PERSONS;

  return (
    <div style={{ maxWidth: '448px', margin: '0 auto', width: '100%', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: colors.textSecond,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.target.style.color = colors.accent}
        onMouseLeave={e => e.target.style.color = colors.textSecond}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Tilbake til hjulet
      </button>

      {/* Hero card */}
      <div style={{
        background: colors.bgAlt,
        borderRadius: radius.xl,
        padding: '24px',
        textAlign: 'center',
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.md,
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px', lineHeight: 1 }}>{meal.emoji}</div>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          color: colors.text,
          margin: '0 0 8px',
          fontFamily: 'Georgia, serif',
        }}>
          {meal.name}
        </h1>
        <p style={{ color: colors.textSecond, fontSize: '0.85rem', marginBottom: '16px', margin: '0 0 16px' }}>
          {meal.category}
        </p>

        {meal.description && (
          <p style={{ color: colors.textSecond, fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
            {meal.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>⏱</div>
            <div style={{ color: colors.text, fontWeight: 700 }}>{meal.time_minutes} min</div>
            <div style={{ color: colors.textTertiary, fontSize: '0.7rem' }}>tilbereding</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: colors.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '4px' }}><PriceDots level={meal.price_level} /></div>
            <div style={{ color: colors.text, fontWeight: 700 }}>
              {meal.price_level === 1 ? 'Billig' : meal.price_level === 2 ? 'Middels' : 'Dyrere'}
            </div>
            <div style={{ color: colors.textTertiary, fontSize: '0.7rem' }}>prisnivå</div>
          </div>
          {meal.last_eaten && (
            <>
              <div style={{ width: '1px', height: '40px', background: colors.border }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>📅</div>
                <div style={{ color: colors.text, fontWeight: 700, fontSize: '0.9rem' }}>
                  {new Date(meal.last_eaten).toLocaleDateString('no-NO', { month: 'short', day: 'numeric' })}
                </div>
                <div style={{ color: colors.textTertiary, fontSize: '0.7rem' }}>sist spist</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Persons selector */}
      <div style={{
        background: colors.bgAlt,
        borderRadius: radius.xl,
        padding: '16px',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ color: colors.text, fontWeight: 600, margin: '0 0 4px' }}>Antall personer</h3>
            <p style={{ color: colors.textTertiary, fontSize: '0.75rem', margin: 0 }}>Justerer ingrediensene</p>
          </div>
          <PersonCounter value={persons} onChange={setPersons} size="md" />
        </div>
      </div>

      {/* Ingredients */}
      <div style={{
        background: colors.bgAlt,
        borderRadius: radius.xl,
        padding: '16px',
        border: `1px solid ${colors.border}`,
      }}>
        <h3 style={{ color: colors.text, fontWeight: 600, marginBottom: '16px', margin: '0 0 16px' }}>Ingredienser</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {meal.ingredients.map(ing => {
            const scaled = Math.round(ing.quantity * scale * 10) / 10;
            const sectionColor = sectionColors[ing.section] || sectionColors['Diverse'];
            return (
              <div key={ing.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: `1px solid ${colors.hairline}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: radius.round,
                    background: sectionColor.bg,
                    color: sectionColor.text,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {ing.section.split(' ')[0]}
                  </span>
                  <span style={{ color: colors.text, fontSize: '0.9rem' }}>{ing.ingredient_name}</span>
                </div>
                <span style={{ color: colors.textSecond, fontSize: '0.9rem', fontWeight: 600, marginLeft: '8px', flexShrink: 0 }}>
                  {scaled} {ing.unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleGoShopping}
        style={{
          width: '100%',
          background: colors.accent,
          color: colors.white,
          fontWeight: 700,
          padding: '16px',
          borderRadius: radius.md,
          border: 'none',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: shadows.accent,
        }}
        onMouseEnter={e => e.target.style.background = colors.accentDark}
        onMouseLeave={e => e.target.style.background = colors.accent}
      >
        🛒 Gå til butikk
      </button>
    </div>
  );
}
