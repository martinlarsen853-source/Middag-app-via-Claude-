const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'middag-secret-key-2024';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Ikke autentisert' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Ugyldig token' });
  }
}

// GET /api/shopping/stores/all - must come BEFORE /:mealId/:storeId
router.get('/stores/all', authMiddleware, (req, res) => {
  const stores = db.prepare('SELECT id, name FROM stores ORDER BY name').all();
  res.json(stores);
});

// GET /api/shopping/:mealId/:storeId?persons=2
router.get('/:mealId/:storeId', authMiddleware, (req, res) => {
  const { mealId, storeId } = req.params;
  const persons = parseFloat(req.query.persons) || 2;
  const BASE_PERSONS = 4;
  const scale = persons / BASE_PERSONS;

  const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(mealId);
  if (!meal) return res.status(404).json({ error: 'Måltid ikke funnet' });

  const store = db.prepare('SELECT * FROM stores WHERE id = ?').get(storeId);
  if (!store) return res.status(404).json({ error: 'Butikk ikke funnet' });

  const ingredients = db.prepare(
    'SELECT * FROM meal_ingredients WHERE meal_id = ? ORDER BY ingredient_name'
  ).all(mealId);

  const sectionOrder = JSON.parse(store.section_order);

  // Group ingredients by section
  const grouped = {};
  for (const section of sectionOrder) {
    grouped[section] = [];
  }

  for (const ing of ingredients) {
    const scaledQty = ing.quantity * scale;
    // Round nicely
    const roundedQty = Math.round(scaledQty * 10) / 10;

    const item = {
      id: ing.id,
      name: ing.ingredient_name,
      quantity: roundedQty,
      unit: ing.unit,
      section: ing.section
    };

    if (grouped[ing.section] !== undefined) {
      grouped[ing.section].push(item);
    } else {
      // Section not in store's order - put in Diverse
      if (!grouped['Diverse']) grouped['Diverse'] = [];
      grouped['Diverse'].push(item);
    }
  }

  // Build ordered list of sections that have items
  const sections = sectionOrder
    .filter(s => grouped[s] && grouped[s].length > 0)
    .map(s => ({
      section: s,
      items: grouped[s]
    }));

  res.json({
    meal: { id: meal.id, name: meal.name, emoji: meal.emoji },
    store: { id: store.id, name: store.name },
    persons,
    sections
  });
});

module.exports = router;
