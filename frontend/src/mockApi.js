// Full localStorage-based API for GitHub Pages / demo mode (no backend needed)
import { MEALS, STORES, INGREDIENTS, INGREDIENT_CATEGORIES } from './mockData.js';

const BASE_PERSONS = 4; // seed data quantities are based on 4 persons

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getEatenDates() {
  try { return JSON.parse(localStorage.getItem('middag_eaten') || '{}'); } catch { return {}; }
}

// --- Auth ---
export async function login(email, password) {
  const users = JSON.parse(localStorage.getItem('middag_users') || '[]');
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('Finner ikke konto med den e-postadressen');
  if (user.password !== password) throw new Error('Feil passord');
  const token = btoa(JSON.stringify({ id: user.id, email: user.email }));
  return { token, user: { id: user.id, name: user.name, email: user.email, default_persons: user.default_persons, household_id: user.id } };
}

export async function register(name, email, password, default_persons = 2) {
  const users = JSON.parse(localStorage.getItem('middag_users') || '[]');
  if (users.find(u => u.email === email)) throw new Error('E-postadressen er allerede i bruk');
  const id = Date.now();
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const user = { id, name, email, password, default_persons, household_id: id, invite_code: inviteCode };
  users.push(user);
  localStorage.setItem('middag_users', JSON.stringify(users));
  const token = btoa(JSON.stringify({ id, email }));
  return { token, user: { id, name, email, default_persons, household_id: id } };
}

// --- Meals ---
export async function getMeals(sort = '') {
  const eaten = getEatenDates();
  let meals = [...MEALS];
  if (sort === 'time') {
    meals.sort((a, b) => a.time_minutes - b.time_minutes);
  } else if (sort === 'price') {
    meals.sort((a, b) => a.price_level - b.price_level);
  } else if (sort === 'rarely') {
    meals.sort((a, b) => {
      const da = eaten[a.id] ? new Date(eaten[a.id]).getTime() : 0;
      const db2 = eaten[b.id] ? new Date(eaten[b.id]).getTime() : 0;
      return da - db2;
    });
  } else {
    meals = shuffle(meals);
  }
  return meals.map(m => ({ ...m, last_eaten: eaten[m.id] || null }));
}

export async function getMeal(id) {
  const meal = MEALS.find(m => m.id === Number(id));
  if (!meal) throw new Error('Middag ikke funnet');
  const eaten = getEatenDates();
  return { ...meal, last_eaten: eaten[meal.id] || null };
}

export async function markEaten(id) {
  const eaten = getEatenDates();
  eaten[id] = new Date().toISOString();
  localStorage.setItem('middag_eaten', JSON.stringify(eaten));
  return { ok: true };
}

// --- Stores ---
export async function getStores() {
  return STORES;
}

// --- Shopping list ---
export async function getShoppingList(mealId, storeId, persons = 2) {
  const meal = MEALS.find(m => m.id === Number(mealId));
  if (!meal) throw new Error('Middag ikke funnet');
  const store = STORES.find(s => s.id === Number(storeId));
  if (!store) throw new Error('Butikk ikke funnet');

  const scale = persons / BASE_PERSONS;
  const sectionOrder = store.section_order;

  // Group by section
  const grouped = {};
  for (const ing of meal.ingredients) {
    const section = ing.section || 'Diverse';
    if (!grouped[section]) grouped[section] = [];
    const qty = Math.ceil(ing.quantity * scale * 10) / 10;
    grouped[section].push({ ...ing, quantity: qty });
  }

  // Sort sections according to store order
  const sections = sectionOrder
    .filter(s => grouped[s])
    .map(s => ({ section: s, items: grouped[s] }));

  // Add any sections not in store order
  for (const s of Object.keys(grouped)) {
    if (!sectionOrder.includes(s)) {
      sections.push({ section: s, items: grouped[s] });
    }
  }

  return { meal: { id: meal.id, name: meal.name, emoji: meal.emoji }, store: { id: store.id, name: store.name }, persons, sections };
}

// --- Household ---
export async function getHousehold() {
  const userStr = localStorage.getItem('middag_user');
  const user = JSON.parse(userStr || '{}');
  const users = JSON.parse(localStorage.getItem('middag_users') || '[]');
  const me = users.find(u => u.id === user.id);
  const householdId = me?.household_id || user.id;
  const members = users.filter(u => u.household_id === householdId).map(u => ({ id: u.id, name: u.name, email: u.email }));
  return { household_id: householdId, invite_code: me?.invite_code || '------', members };
}

export async function joinHousehold(invite_code) {
  const users = JSON.parse(localStorage.getItem('middag_users') || '[]');
  const target = users.find(u => u.invite_code === invite_code.toUpperCase());
  if (!target) throw new Error('Ugyldig invitasjonskode');
  const userStr = localStorage.getItem('middag_user');
  const currentUser = JSON.parse(userStr || '{}');
  const meIndex = users.findIndex(u => u.id === currentUser.id);
  if (meIndex === -1) throw new Error('Bruker ikke funnet');
  users[meIndex].household_id = target.household_id;
  localStorage.setItem('middag_users', JSON.stringify(users));
  return { ok: true };
}

export async function updatePersons(default_persons) {
  const users = JSON.parse(localStorage.getItem('middag_users') || '[]');
  const userStr = localStorage.getItem('middag_user');
  const currentUser = JSON.parse(userStr || '{}');
  const meIndex = users.findIndex(u => u.id === currentUser.id);
  if (meIndex !== -1) {
    users[meIndex].default_persons = default_persons;
    localStorage.setItem('middag_users', JSON.stringify(users));
  }
  currentUser.default_persons = default_persons;
  localStorage.setItem('middag_user', JSON.stringify(currentUser));
  return { ok: true };
}

// --- Ingredients (MOCK) ---
export async function getIngredients(category = null, search = null, limit = 50, offset = 0) {
  let filtered = [...INGREDIENTS];

  if (category) {
    filtered = filtered.filter(ing => ing.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(ing => ing.name.toLowerCase().includes(searchLower));
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return { data: paginated, count: total, limit, offset };
}

export async function getIngredientCategories() {
  return INGREDIENT_CATEGORIES;
}
