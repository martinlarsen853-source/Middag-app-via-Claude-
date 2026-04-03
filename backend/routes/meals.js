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

// GET /api/meals
router.get('/', authMiddleware, (req, res) => {
  const { sort } = req.query;

  let orderBy = 'name ASC';
  if (sort === 'time') orderBy = 'time_minutes ASC';
  else if (sort === 'price') orderBy = 'price_level ASC';
  else if (sort === 'random') orderBy = 'RANDOM()';
  else if (sort === 'rarely') orderBy = 'last_eaten ASC NULLS FIRST';

  const meals = db.prepare(`SELECT * FROM meals ORDER BY ${orderBy}`).all();
  res.json(meals);
});

// GET /api/meals/:id
router.get('/:id', authMiddleware, (req, res) => {
  const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(req.params.id);
  if (!meal) return res.status(404).json({ error: 'Måltid ikke funnet' });

  const ingredients = db.prepare(
    'SELECT * FROM meal_ingredients WHERE meal_id = ? ORDER BY section, ingredient_name'
  ).all(req.params.id);

  res.json({ ...meal, ingredients });
});

// PUT /api/meals/:id/eaten
router.put('/:id/eaten', authMiddleware, (req, res) => {
  const now = new Date().toISOString();
  const result = db.prepare('UPDATE meals SET last_eaten = ? WHERE id = ?').run(now, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Måltid ikke funnet' });
  res.json({ success: true, last_eaten: now });
});

module.exports = router;
