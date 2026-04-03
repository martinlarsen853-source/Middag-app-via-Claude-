const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'middag.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS households (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    household_id INTEGER REFERENCES households(id),
    default_persons INTEGER DEFAULT 2
  );

  CREATE TABLE IF NOT EXISTS household_members (
    user_id INTEGER REFERENCES users(id),
    household_id INTEGER REFERENCES households(id),
    PRIMARY KEY (user_id, household_id)
  );

  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    description TEXT,
    time_minutes INTEGER NOT NULL,
    price_level INTEGER NOT NULL CHECK(price_level BETWEEN 1 AND 3),
    category TEXT NOT NULL,
    last_eaten TEXT
  );

  CREATE TABLE IF NOT EXISTS meal_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_id INTEGER NOT NULL REFERENCES meals(id),
    ingredient_name TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    section TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    section_order TEXT NOT NULL
  );
`);

module.exports = db;
