import React, { useState, useEffect } from 'react';
import { getIngredients, getIngredientCategories, deleteIngredient } from '../api.js';
import { colors, radius, shadows } from '../theme.js';

export default function IngredientListPage() {
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
    loadIngredients();
  }, [selectedCategory, search]);

  async function loadCategories() {
    try {
      const data = await getIngredientCategories();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadIngredients() {
    try {
      setLoading(true);
      const { data } = await getIngredients(selectedCategory, search);
      setIngredients(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (confirm('Slett ingrediens?')) {
      try {
        await deleteIngredient(id);
        loadIngredients();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    }
  }

  const grouped = ingredients.reduce((acc, ing) => {
    const cat = ing.category || 'Diverse';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ing);
    return acc;
  }, {});

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>🥕 Ingredienser</h1>
        <input
          type="text"
          placeholder="Søk ingrediens..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={s.search}
        />
      </div>

      {/* Category filter */}
      <div style={s.categoryRow}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{ ...s.categoryBtn, ...(selectedCategory === null ? s.categoryBtnActive : {}) }}
        >
          Alle
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            style={{ ...s.categoryBtn, ...(selectedCategory === cat.name ? s.categoryBtnActive : {}) }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {error && <p style={s.error}>{error}</p>}

      {loading ? (
        <p style={s.loading}>Laster...</p>
      ) : (
        <div style={s.listContainer}>
          {Object.keys(grouped).length === 0 ? (
            <p style={s.empty}>Ingen ingredienser funnet</p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} style={s.categorySection}>
                <h2 style={s.categoryTitle}>{category}</h2>
                <div style={s.itemsGrid}>
                  {items.map(ing => (
                    <div key={ing.id} style={s.ingredientCard}>
                      <div style={s.ingredientInfo}>
                        <h3 style={s.ingredientName}>{ing.name}</h3>
                        <p style={s.ingredientPrice}>{ing.price} kr / {ing.unit}</p>
                        {ing.brand && <p style={s.ingredientBrand}>{ing.brand}</p>}
                      </div>
                      <button
                        onClick={() => handleDelete(ing.id)}
                        style={s.deleteBtn}
                        title="Slett"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: '16px', minHeight: '100vh', background: colors.bg },
  header: { marginBottom: '24px' },
  title: {
    letterSpacing: '-0.02em',
    fontSize: '1.75rem',
    fontWeight: 800,
    color: colors.text,
    margin: '0 0 12px',
  },
  search: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    borderRadius: radius.md,
    border: `1.5px solid ${colors.border}`,
    background: colors.bgAlt,
    color: colors.text,
    boxSizing: 'border-box',
    outline: 'none',
  },
  categoryRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    overflowX: 'auto',
    paddingBottom: 8,
  },
  categoryBtn: {
    padding: '6px 12px',
    borderRadius: radius.round,
    border: `1.5px solid ${colors.border}`,
    background: colors.bgAlt,
    color: colors.textSecond,
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  categoryBtnActive: {
    background: colors.accent,
    borderColor: colors.accent,
    color: colors.white,
  },
  categorySection: { marginBottom: 32 },
  categoryTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: colors.text,
    margin: '0 0 12px',
  },
  itemsGrid: {
    display: 'grid',
    gap: 8,
  },
  ingredientCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: colors.bgAlt,
    padding: '12px 16px',
    borderRadius: radius.md,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.sm,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  ingredientInfo: { flex: 1 },
  ingredientName: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: colors.text,
    margin: '0 0 4px',
  },
  ingredientPrice: {
    fontSize: '0.8rem',
    color: colors.accentAlt,
    fontWeight: 600,
    margin: 0,
  },
  ingredientBrand: {
    fontSize: '0.75rem',
    color: colors.textTertiary,
    margin: '4px 0 0',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.round,
    border: `1.5px solid ${colors.border}`,
    background: colors.bg,
    color: colors.textSecond,
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  error: {
    color: colors.error,
    padding: '12px',
    background: '#fdeceb',
    borderRadius: radius.sm,
    marginBottom: 16,
  },
  loading: {
    textAlign: 'center',
    color: colors.textTertiary,
    padding: '40px 16px',
  },
  empty: {
    textAlign: 'center',
    color: colors.textTertiary,
    padding: '40px 16px',
  },
  listContainer: { marginTop: 16 },
};
