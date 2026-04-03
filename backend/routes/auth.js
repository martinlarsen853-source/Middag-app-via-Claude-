const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'middag-secret-key-2024';

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, name, default_persons } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'E-post, passord og navn er påkrevd' });
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(409).json({ error: 'E-postadressen er allerede i bruk' });
  }

  try {
    const password_hash = bcrypt.hashSync(password, 10);

    // Generate unique invite code
    let invite_code;
    let attempts = 0;
    do {
      invite_code = generateInviteCode();
      attempts++;
    } while (db.prepare('SELECT id FROM households WHERE invite_code = ?').get(invite_code) && attempts < 10);

    const createHousehold = db.transaction(() => {
      const householdResult = db.prepare(
        'INSERT INTO households (name, invite_code) VALUES (?, ?)'
      ).run(`${name}s husholdning`, invite_code);

      const householdId = householdResult.lastInsertRowid;

      const userResult = db.prepare(
        'INSERT INTO users (email, password_hash, name, household_id, default_persons) VALUES (?, ?, ?, ?, ?)'
      ).run(email, password_hash, name, householdId, default_persons || 2);

      const userId = userResult.lastInsertRowid;

      db.prepare(
        'INSERT INTO household_members (user_id, household_id) VALUES (?, ?)'
      ).run(userId, householdId);

      return { userId, householdId, invite_code };
    });

    const { userId, householdId, invite_code: code } = createHousehold();

    const token = jwt.sign(
      { userId, email, name, householdId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        name,
        household_id: householdId,
        default_persons: default_persons || 2,
        invite_code: code
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Intern serverfeil' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-post og passord er påkrevd' });
  }

  const user = db.prepare(`
    SELECT u.*, h.invite_code
    FROM users u
    LEFT JOIN households h ON u.household_id = h.id
    WHERE u.email = ?
  `).get(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Feil e-post eller passord' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name, householdId: user.household_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      household_id: user.household_id,
      default_persons: user.default_persons,
      invite_code: user.invite_code
    }
  });
});

module.exports = router;
