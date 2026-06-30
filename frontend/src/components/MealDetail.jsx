import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeal, deleteMeal } from '../api.js';
import PersonCounter from './PersonCounter.jsx';
import { colors, shadows, radius, fonts, foodPhotoFor } from '../theme.js';

const sectionColors = {
  'Frukt & grønt': { bg: '#e9f7ee', text: '#1d7a40' },
  'Kjøtt & fisk': { bg: '#fdeceb', text: '#b3362e' },
  'Meieri': { bg: '#fdf4e0', text: '#8a6a14' },
  'Tørrmat': { bg: '#f8efe4', text: '#8a5a24' },
  'Frys': { bg: '#e7f3fb', text: '#1d6291' },
  'Bakeri': { bg: '#f9f1de', text: '#856414' },
  'Krydder & sauser': { bg: '#f3ecfa', text: '#6b3fa3' },
  'Drikkevarer': { bg: '#e7f3fb', text: '#1d6291' },
  'Diverse': { bg: '#f0f0f3', text: '#5f5f68' }
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteMeal(id);
      navigate('/app');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
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
            onClick={() => navigate('/app')}
            style={{ color: colors.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Tilbake til mine retter
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
        onClick={() => navigate('/app')}
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
        Tilbake til mine retter
      </button>

      {/* Hero card */}
      <div style={{
        background: colors.bgAlt,
        borderRadius: radius.xl,
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.md,
      }}>
        {/* Photo */}
        <div style={{ position: 'relative', height: '220px', background: colors.bgLight }}>
          <img
            src={foodPhotoFor(meal)}
            alt={meal.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <span style={{
            position: 'absolute', bottom: '12px', left: '14px',
            fontSize: '1.6rem', lineHeight: 1,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
            borderRadius: '50%', width: '46px', height: '46px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: shadows.sm,
          }}>{meal.emoji}</span>
        </div>

        <div style={{ padding: '20px 24px 24px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: fonts.display,
            fontSize: '2rem',
            fontWeight: 700,
            color: colors.text,
            margin: '0 0 6px',
            letterSpacing: '0.01em',
            lineHeight: 1.1,
          }}>
            {meal.name}
          </h1>
          <p style={{ color: colors.textTertiary, fontSize: '0.85rem', margin: '0 0 16px' }}>
            {meal.category}
          </p>

          {meal.description && (
            <p style={{ color: colors.textSecond, fontSize: '0.92rem', lineHeight: 1.55, margin: '0 0 16px' }}>
              {meal.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>⏱</div>
              <div style={{ color: colors.text, fontWeight: 700 }}>{meal.time_minutes} min</div>
              <div style={{ color: colors.textTertiary, fontSize: '0.7rem' }}>tilbereding</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: colors.border }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🛒</div>
              <div style={{ color: colors.accent, fontWeight: 800 }}>
                ca. {meal.estimated_price || '–'} kr
              </div>
              <div style={{ color: colors.textTertiary, fontSize: '0.7rem' }}>handlekurv</div>
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
          {meal.ingredients.map((ing, idx) => {
            const scaled = Math.round(ing.quantity * scale * 10) / 10;
            const section = ing.section || 'Diverse';
            const name = ing.ingredient_name || ing.name;
            const sectionColor = sectionColors[section] || sectionColors['Diverse'];
            return (
              <div key={ing.id || `${name}-${idx}`} style={{
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
                    {section.split(' ')[0]}
                  </span>
                  <span style={{ color: colors.text, fontSize: '0.9rem' }}>{name}</span>
                </div>
                <span style={{ color: colors.textSecond, fontSize: '0.9rem', fontWeight: 600, marginLeft: '8px', flexShrink: 0 }}>
                  {scaled} {ing.unit}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cooking steps — HelloFresh-style numbered list */}
      {Array.isArray(meal.instructions) && meal.instructions.length > 0 && (
        <div style={{
          background: colors.bgAlt,
          borderRadius: radius.xl,
          padding: '16px',
          border: `1px solid ${colors.border}`,
        }}>
          <h3 style={{ color: colors.text, fontWeight: 700, margin: '0 0 16px', fontFamily: fonts.display, fontSize: '1.25rem', letterSpacing: '0.01em' }}>
            Slik lager du den
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {meal.instructions.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0,
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: colors.bgAccent, color: colors.accent,
                  fontWeight: 800, fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</span>
                <p style={{ margin: 0, color: colors.textSecond, fontSize: '0.95rem', lineHeight: 1.55, paddingTop: '3px' }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
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
        <button
          onClick={() => navigate(`/meal/${id}/edit`)}
          style={{
            width: '100%',
            background: colors.bgAlt,
            color: colors.text,
            fontWeight: 600,
            padding: '14px',
            borderRadius: radius.md,
            border: `1.5px solid ${colors.border}`,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => Object.assign(e.target.style, { borderColor: colors.accent, color: colors.accent })}
          onMouseLeave={e => Object.assign(e.target.style, { borderColor: colors.border, color: colors.text })}
        >
          ✏️ Rediger
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            width: '100%',
            background: colors.bgAlt,
            color: colors.error,
            fontWeight: 600,
            padding: '14px',
            borderRadius: radius.md,
            border: `1.5px solid ${colors.error}33`,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => Object.assign(e.target.style, { borderColor: colors.error, background: `${colors.error}08` })}
          onMouseLeave={e => Object.assign(e.target.style, { borderColor: `${colors.error}33`, background: colors.bgAlt })}
        >
          🗑️ Slett
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'rgba(45,37,32,0.3)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={() => !deleting && setShowDeleteConfirm(false)}
        >
          <div style={{
            background: colors.white,
            borderRadius: radius.xl,
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            boxShadow: shadows.lg,
          }}
          onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: colors.text, margin: '0 0 8px' }}>
              Slett {meal?.name}?
            </h2>
            <p style={{ color: colors.textSecond, fontSize: '0.9rem', margin: '0 0 20px' }}>
              Denne handlingen kan ikke angres.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: radius.md,
                  border: `1.5px solid ${colors.border}`,
                  background: colors.white,
                  color: colors.text,
                  fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.5 : 1,
                }}
              >
                Avbryt
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: radius.md,
                  border: 'none',
                  background: deleting ? colors.error + '80' : colors.error,
                  color: colors.white,
                  fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                {deleting ? 'Sletter...' : 'Slett'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
