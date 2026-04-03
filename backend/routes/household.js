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

// GET /api/household - get current household members
router.get('/', authMiddleware, (req, res) => {
  const { householdId } = req.user;

  const household = db.prepare('SELECT * FROM households WHERE id = ?').get(householdId);
  if (!household) return res.status(404).json({ error: 'Husholdning ikke funnet' });

  const members = db.prepare(`
    SELECT u.id, u.name, u.email, u.default_persons
    FROM users u
    JOIN household_members hm ON u.id = hm.user_id
    WHERE hm.household_id = ?
  `).all(householdId);

  res.json({
    household: {
      id: household.id,
      name: household.name,
      invite_code: household.invite_code
    },
    members
  });
});

// POST /api/household/join - join household by invite code
router.post('/join', authMiddleware, (req, res) => {
  const { invite_code } = req.body;
  const { userId } = req.user;

  if (!invite_code) {
    return res.status(400).json({ error: 'Invitasjonskode er påkrevd' });
  }

  const household = db.prepare('SELECT * FROM households WHERE invite_code = ?').get(invite_code.toUpperCase());
  if (!household) {
    return res.status(404).json({ error: 'Ugyldig invitasjonskode' });
  }

  // Check if already member
  const existing = db.prepare(
    'SELECT * FROM household_members WHERE user_id = ? AND household_id = ?'
  ).get(userId, household.id);

  if (existing) {
    return res.status(409).json({ error: 'Du er allerede med i denne husholdningen' });
  }

  const join = db.transaction(() => {
    db.prepare(
      'INSERT INTO household_members (user_id, household_id) VALUES (?, ?)'
    ).run(userId, household.id);

    db.prepare(
      'UPDATE users SET household_id = ? WHERE id = ?'
    ).run(household.id, userId);
  });

  join();

  res.json({
    success: true,
    household: {
      id: household.id,
      name: household.name,
      invite_code: household.invite_code
    }
  });
});

// PUT /api/household/persons - update default_persons for current user
router.put('/persons', authMiddleware, (req, res) => {
  const { default_persons } = req.body;
  const { userId } = req.user;

  if (!default_persons || default_persons < 1 || default_persons > 20) {
    return res.status(400).json({ error: 'Ugyldig antall personer (1-20)' });
  }

  db.prepare('UPDATE users SET default_persons = ? WHERE id = ?').run(default_persons, userId);

  res.json({ success: true, default_persons });
});

module.exports = router;
