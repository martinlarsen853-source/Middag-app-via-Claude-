// Vercel serverless API — Express + Supabase (ingen SQLite)
// Brukes i produksjon på Vercel. Lokalt brukes backend/ med SQLite.
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Supabase admin-klient (service role key omgår RLS)
function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Supabase env vars mangler');
  return createClient(url, key, { auth: { persistSession: false } });
}

// Auth-middleware: verifiser Supabase JWT
async function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Ikke autentisert' });
  try {
    const sb = getSupabase();
    const { data: { user }, error } = await sb.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Ugyldig token' });
    req.user = user;
    req.sb = sb;
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Middagshjulet API er oppe!' }));

// ─── Auth ────────────────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, default_persons = 2 } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Navn, e-post og passord er påkrevd' });
  try {
    const sb = getSupabase();
    const { data, error } = await sb.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { name, default_persons }
    });
    if (error) return res.status(400).json({ error: error.message });

    // Sign in to get a session token
    const { data: session, error: signInErr } = await sb.auth.signInWithPassword({ email, password });
    if (signInErr) return res.status(400).json({ error: signInErr.message });

    // Wait for trigger to create profile
    await new Promise(r => setTimeout(r, 600));
    const { data: profile } = await sb.from('user_profiles').select('*, households(invite_code)').eq('id', data.user.id).single();

    res.status(201).json({
      token: session.session.access_token,
      user: {
        id: data.user.id, email, name,
        default_persons: profile?.default_persons || default_persons,
        household_id: profile?.household_id,
        invite_code: profile?.households?.invite_code
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'E-post og passord er påkrevd' });
  try {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: 'Feil e-post eller passord' });

    const { data: profile } = await sb.from('user_profiles').select('*, households(invite_code)').eq('id', data.user.id).single();
    res.json({
      token: data.session.access_token,
      user: {
        id: data.user.id, email: data.user.email,
        name: profile?.name,
        default_persons: profile?.default_persons || 2,
        household_id: profile?.household_id,
        invite_code: profile?.households?.invite_code
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Middager ────────────────────────────────────────────────────────────────

app.get('/api/meals', auth, async (req, res) => {
  const sort = req.query.sort || '';
  let query = req.sb.from('meals').select('id, name, emoji, description, time_minutes, price_level, category');

  if (sort === 'time') query = query.order('time_minutes', { ascending: true });
  else if (sort === 'price') query = query.order('price_level', { ascending: true });
  else query = query.order('name');

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  let meals = data || [];

  if (sort === 'random') {
    for (let i = meals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [meals[i], meals[j]] = [meals[j], meals[i]];
    }
  } else if (sort === 'rarely') {
    const { data: history } = await req.sb
      .from('meal_history').select('meal_id, eaten_at')
      .eq('user_id', req.user.id).order('eaten_at', { ascending: false });
    const lastEaten = {};
    (history || []).forEach(h => { if (!lastEaten[h.meal_id]) lastEaten[h.meal_id] = h.eaten_at; });
    meals = meals
      .map(m => ({ ...m, last_eaten: lastEaten[m.id] || null }))
      .sort((a, b) => (a.last_eaten ? new Date(a.last_eaten).getTime() : 0) - (b.last_eaten ? new Date(b.last_eaten).getTime() : 0));
  }

  res.json(meals);
});

app.get('/api/meals/:id', auth, async (req, res) => {
  const { data, error } = await req.sb.from('meals').select('*, meal_ingredients(*)').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Middag ikke funnet' });
  res.json({
    ...data,
    ingredients: (data.meal_ingredients || []).map(i => ({ name: i.ingredient_name, quantity: i.quantity, unit: i.unit, section: i.section }))
  });
});

app.put('/api/meals/:id/eaten', auth, async (req, res) => {
  await req.sb.from('meal_history').insert({ user_id: req.user.id, meal_id: req.params.id });
  res.json({ ok: true });
});

// ─── Butikker & handleliste ───────────────────────────────────────────────────

app.get('/api/shopping/stores/all', auth, async (req, res) => {
  const { data, error } = await req.sb.from('stores').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/shopping/:mealId/:storeId', auth, async (req, res) => {
  const persons = parseInt(req.query.persons) || 2;
  const scale = persons / 4;

  const [{ data: meal, error: mErr }, { data: store, error: sErr }] = await Promise.all([
    req.sb.from('meals').select('id, name, emoji, meal_ingredients(*)').eq('id', req.params.mealId).single(),
    req.sb.from('stores').select('*').eq('id', req.params.storeId).single()
  ]);
  if (mErr || sErr) return res.status(404).json({ error: 'Ikke funnet' });

  const sectionOrder = store.section_order || [];
  const grouped = {};
  for (const ing of (meal.meal_ingredients || [])) {
    const section = ing.section || 'Diverse';
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push({ name: ing.ingredient_name, quantity: Math.ceil(ing.quantity * scale * 10) / 10, unit: ing.unit, section });
  }

  const sections = sectionOrder.filter(s => grouped[s]).map(s => ({ section: s, items: grouped[s] }));
  for (const s of Object.keys(grouped)) {
    if (!sectionOrder.includes(s)) sections.push({ section: s, items: grouped[s] });
  }

  res.json({ meal: { id: meal.id, name: meal.name, emoji: meal.emoji }, store: { id: store.id, name: store.name }, persons, sections });
});

// ─── Husstand ────────────────────────────────────────────────────────────────

app.get('/api/household', auth, async (req, res) => {
  const { data: profile } = await req.sb.from('user_profiles').select('*, households(*)').eq('id', req.user.id).single();
  const household = profile?.households;
  if (!household) return res.status(404).json({ error: 'Husstand ikke funnet' });
  const { data: members } = await req.sb.from('user_profiles').select('id, name').eq('household_id', household.id);
  res.json({ household_id: household.id, invite_code: household.invite_code, members: members || [] });
});

app.post('/api/household/join', auth, async (req, res) => {
  const { invite_code } = req.body;
  const { data: household, error } = await req.sb.from('households').select('id').eq('invite_code', invite_code.toUpperCase()).single();
  if (error || !household) return res.status(404).json({ error: 'Ugyldig invitasjonskode' });
  await req.sb.from('user_profiles').update({ household_id: household.id }).eq('id', req.user.id);
  res.json({ ok: true });
});

app.put('/api/household/persons', auth, async (req, res) => {
  const { default_persons } = req.body;
  await req.sb.from('user_profiles').update({ default_persons }).eq('id', req.user.id);
  res.json({ ok: true });
});

// ─── Ingredients ──────────────────────────────────────────────────────────────────

// GET /api/ingredients — List all ingredients with optional filtering
app.get('/api/ingredients', auth, async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    let query = req.sb.from('ingredients').select('*');

    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ data, count, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/ingredient-categories — List ingredient categories
app.get('/api/ingredient-categories', auth, async (req, res) => {
  try {
    const { data, error } = await req.sb
      .from('ingredient_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/ingredients/:id — Get single ingredient
app.get('/api/ingredients/:id', auth, async (req, res) => {
  try {
    const { data, error } = await req.sb
      .from('ingredients')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Ingrediens ikke funnet' });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/sync-ingredients — Sync ingredients from Kassalapp
// Kan kalles fra ekstern cron-tjeneste eller fra frontend
app.post('/api/sync-ingredients', async (req, res) => {
  try {
    // Sikkerhet: Sjekk API-nøkkel hvis den er satt
    const syncKey = process.env.SYNC_API_KEY;
    const providedKey = req.headers['x-sync-key'] || req.body.sync_key;

    if (syncKey && syncKey !== providedKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid sync key' });
    }

    console.log('📦 Starting ingredient sync...');

    // Import sync service
    const { syncIngredientsFromKassalapp } = await import('./kassaappSync.js');

    const result = await syncIngredientsFromKassalapp(req.body);
    console.log('✅ Sync completed:', result);

    res.json({ ok: true, ...result });
  } catch (e) {
    console.error('❌ Sync error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ─── Meals (CRUD) ─────────────────────────────────────────────────────────────────

// POST /api/meals — Create new meal from scratch
app.post('/api/meals', auth, async (req, res) => {
  try {
    const { name, emoji, description, time_minutes, category, ingredients } = req.body;

    if (!name) return res.status(400).json({ error: 'Meal name is required' });

    // Insert meal
    const { data: meal, error: mealError } = await req.sb
      .from('meals')
      .insert([{
        name,
        emoji: emoji || '🍽',
        description: description || '',
        time_minutes: time_minutes || 30,
        price_level: 2, // Default to medium
        category: category || 'Annet',
      }])
      .select()
      .single();

    if (mealError) throw mealError;

    // Insert ingredients
    if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
      const ingredientsData = ingredients.map(ing => ({
        meal_id: meal.id,
        ingredient_id: ing.ingredient_id,
        ingredient_name: ing.name,
        quantity: ing.quantity || 1,
        unit: ing.unit || 'g',
        section: ing.section || 'Diverse',
      }));

      const { error: ingError } = await req.sb
        .from('meal_ingredients')
        .insert(ingredientsData);

      if (ingError) throw ingError;
    }

    res.status(201).json(meal);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/meals/:id — Update meal
app.put('/api/meals/:id', auth, async (req, res) => {
  try {
    const { name, emoji, description, time_minutes, category } = req.body;

    const { data, error } = await req.sb
      .from('meals')
      .update({
        name,
        emoji,
        description,
        time_minutes,
        category,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Meal not found' });

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/meals/:id — Delete meal
app.delete('/api/meals/:id', auth, async (req, res) => {
  try {
    const { error } = await req.sb
      .from('meals')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Vercel eksporterer Express-appen direkte
module.exports = app;
