import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeal, deleteMeal, createMeal } from '../api.js';
import PersonCounter from './PersonCounter.jsx';
import { colors, shadows, radius, fonts, foodPhotoFor, mealGradients, defaultMealGradient } from '../theme.js';

// Dempede seksjonsmerker — i handlelista har fargekodingen en jobb å gjøre,
// men i oppskriften skal den ikke stjele oppmerksomhet fra maten.
const sectionColors = {
  'Frukt & grønt': { bg: 'transparent', text: '#918B82' },
  'Kjøtt & fisk': { bg: 'transparent', text: '#918B82' },
  'Meieri': { bg: 'transparent', text: '#918B82' },
  'Tørrmat': { bg: 'transparent', text: '#918B82' },
  'Frys': { bg: 'transparent', text: '#918B82' },
  'Bakeri': { bg: 'transparent', text: '#918B82' },
  'Krydder & sauser': { bg: 'transparent', text: '#918B82' },
  'Drikkevarer': { bg: 'transparent', text: '#918B82' },
  'Diverse': { bg: 'transparent', text: '#918B82' }
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
  const [addingToMine, setAddingToMine] = useState(false);
  const [addedToMine, setAddedToMine] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  // Copy an inspiration (catalog) meal into the user's own list
  async function handleAddToMine() {
    setAddingToMine(true);
    try {
      await createMeal({
        name: meal.name,
        emoji: meal.emoji,
        description: meal.description || '',
        time_minutes: meal.time_minutes,
        persons: meal.persons || 4,
        category: meal.category || 'Annet',
        photo_url: meal.photo_url || null,
        tags: meal.tags || [],
        instructions: meal.instructions || [],
        ingredients: (meal.ingredients || []).map(i => ({
          name: i.ingredient_name || i.name,
          quantity: i.quantity,
          unit: i.unit,
          section: i.section || 'Diverse',
        })),
      });
      setAddedToMine(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingToMine(false);
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

  // Recipes scale from their own base servings (user/imported meals carry it)
  const basePersons = meal.persons || 4;
  const scale = persons / basePersons;

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

      {/* Oppslag: bilde i full bredde, tittelen under — som i et matmagasin */}
      <div style={{ background: 'transparent' }}>
        <div style={{
          position: 'relative', aspectRatio: '3 / 2',
          background: mealGradients[meal.category] || defaultMealGradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {imgError ? (
            <span style={{ fontSize: '4.5rem', lineHeight: 1 }}>{meal.emoji}</span>
          ) : (
            <img
              src={foodPhotoFor(meal)}
              alt={meal.name}
              onError={() => setImgError(true)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
        </div>

        <div style={{ padding: '22px 2px 20px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: colors.accent, margin: '0 0 10px' }}>
            {meal.category}
          </p>
          <h1 style={{
            fontFamily: fonts.display,
            fontSize: '2.2rem',
            fontWeight: 600,
            color: colors.text,
            margin: '0 0 14px',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            {meal.name}
          </h1>

          {meal.description && (
            <p style={{ color: colors.textSecond, fontSize: '0.92rem', lineHeight: 1.55, margin: '0 0 16px' }}>
              {meal.description}
            </p>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px',
            marginTop: '18px', paddingTop: '18px',
            borderTop: `1px solid ${colors.hairline}`,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="eyebrow" style={{ color: colors.textTertiary, marginBottom: '5px' }}>Tilbereding</div>
              <div style={{ color: colors.text, fontWeight: 600, fontSize: '0.95rem' }}>{meal.time_minutes} min</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: colors.hairline }} />
            <div style={{ textAlign: 'center' }}>
              <div className="eyebrow" style={{ color: colors.textTertiary, marginBottom: '5px' }}>Handlekurv</div>
              <div style={{ color: colors.accent, fontWeight: 600, fontSize: '0.95rem' }}>
                ca. {meal.estimated_price || '–'} kr
              </div>
            </div>
            {meal.last_eaten && (
              <>
                <div style={{ width: '1px', height: '32px', background: colors.hairline }} />
                <div style={{ textAlign: 'center' }}>
                  <div className="eyebrow" style={{ color: colors.textTertiary, marginBottom: '5px' }}>Sist spist</div>
                  <div style={{ color: colors.text, fontWeight: 600, fontSize: '0.95rem' }}>
                    {new Date(meal.last_eaten).toLocaleDateString('no-NO', { month: 'short', day: 'numeric' })}
                  </div>
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
            fontFamily: fonts.display,
            fontWeight: 500,
            padding: '16px',
            borderRadius: radius.sm,
            border: 'none',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = colors.accentDark}
          onMouseLeave={e => e.target.style.background = colors.accent}
        >
          Gå til butikk
        </button>
        {meal.is_catalog ? (
          <button
            onClick={handleAddToMine}
            disabled={addingToMine || addedToMine}
            style={{
              width: '100%',
              background: addedToMine ? colors.bgLight : colors.bgAlt,
              color: addedToMine ? colors.success : colors.text,
              fontWeight: 600,
              padding: '14px',
              borderRadius: radius.md,
              border: `1.5px solid ${addedToMine ? colors.border : colors.accent}`,
              fontSize: '1rem',
              cursor: addedToMine ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {addedToMine ? 'Lagt til i Mine retter' : addingToMine ? 'Legger til…' : 'Legg til i Mine retter'}
          </button>
        ) : (
          <>
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
          </>
        )}
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
