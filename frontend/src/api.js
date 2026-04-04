import { supabase, isDemoMode } from './supabase.js';
import * as mock from './mockApi.js';

// --- Auth ---
export async function login(email, password) {
  if (isDemoMode) return mock.login(email, password);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  const profile = await getOrCreateProfile(data.user);
  return { token: data.session.access_token, user: { id: data.user.id, email: data.user.email, ...profile } };
}

export async function register(name, email, password, default_persons = 2) {
  if (isDemoMode) return mock.register(name, email, password, default_persons);
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name, default_persons } }
  });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Sjekk e-posten din for bekreftelseslenke');
  // Wait briefly for trigger to create profile
  await new Promise(r => setTimeout(r, 500));
  const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', data.user.id).single();
  return {
    token: data.session?.access_token || '',
    user: { id: data.user.id, email, name, default_persons: profile?.default_persons || default_persons, household_id: profile?.household_id }
  };
}

export async function logout() {
  if (isDemoMode) return;
  await supabase.auth.signOut();
}

async function getOrCreateProfile(user) {
  const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
  return data || {};
}

// --- Meals ---
export async function getMeals(sort = '') {
  if (isDemoMode) return mock.getMeals(sort);

  let query = supabase.from('meals').select('id, name, emoji, description, time_minutes, price_level, category');

  if (sort === 'time') query = query.order('time_minutes', { ascending: true });
  else if (sort === 'price') query = query.order('price_level', { ascending: true });
  else query = query.order('name');

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // For 'rarely' sort, fetch meal history and sort client-side
  if (sort === 'rarely') {
    const { data: history } = await supabase
      .from('meal_history')
      .select('meal_id, eaten_at')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .order('eaten_at', { ascending: false });

    const lastEaten = {};
    (history || []).forEach(h => {
      if (!lastEaten[h.meal_id]) lastEaten[h.meal_id] = h.eaten_at;
    });

    return data.map(m => ({ ...m, last_eaten: lastEaten[m.id] || null }))
      .sort((a, b) => {
        const da = a.last_eaten ? new Date(a.last_eaten).getTime() : 0;
        const db2 = b.last_eaten ? new Date(b.last_eaten).getTime() : 0;
        return da - db2;
      });
  }

  if (sort === 'random') {
    // shuffle
    const arr = [...data];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return data;
}

export async function getMeal(id) {
  if (isDemoMode) return mock.getMeal(id);
  const { data, error } = await supabase
    .from('meals')
    .select('*, meal_ingredients(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return { ...data, ingredients: data.meal_ingredients.map(i => ({ name: i.ingredient_name, quantity: i.quantity, unit: i.unit, section: i.section })) };
}

export async function markEaten(id) {
  if (isDemoMode) return mock.markEaten(id);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('meal_history').insert({ user_id: user.id, meal_id: id });
  return { ok: true };
}

// --- Stores ---
export async function getStores() {
  if (isDemoMode) return mock.getStores();
  const { data, error } = await supabase.from('stores').select('*').order('id');
  if (error) throw new Error(error.message);
  return data.map(s => ({ ...s, section_order: s.section_order || [] }));
}

// --- Shopping list ---
export async function getShoppingList(mealId, storeId, persons = 2) {
  if (isDemoMode) return mock.getShoppingList(mealId, storeId, persons);

  const BASE_PERSONS = 4;
  const scale = persons / BASE_PERSONS;

  const [{ data: meal, error: mealErr }, { data: store, error: storeErr }] = await Promise.all([
    supabase.from('meals').select('id, name, emoji, meal_ingredients(*)').eq('id', mealId).single(),
    supabase.from('stores').select('*').eq('id', storeId).single()
  ]);

  if (mealErr) throw new Error(mealErr.message);
  if (storeErr) throw new Error(storeErr.message);

  const sectionOrder = store.section_order || [];
  const grouped = {};

  for (const ing of (meal.meal_ingredients || [])) {
    const section = ing.section || 'Diverse';
    if (!grouped[section]) grouped[section] = [];
    const qty = Math.ceil(ing.quantity * scale * 10) / 10;
    grouped[section].push({ name: ing.ingredient_name, quantity: qty, unit: ing.unit, section });
  }

  const sections = sectionOrder
    .filter(s => grouped[s])
    .map(s => ({ section: s, items: grouped[s] }));

  for (const s of Object.keys(grouped)) {
    if (!sectionOrder.includes(s)) sections.push({ section: s, items: grouped[s] });
  }

  return { meal: { id: meal.id, name: meal.name, emoji: meal.emoji }, store: { id: store.id, name: store.name }, persons, sections };
}

// --- Household ---
export async function getHousehold() {
  if (isDemoMode) return mock.getHousehold();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Ikke innlogget');

  const { data: profile } = await supabase.from('user_profiles').select('*, households(*)').eq('id', user.id).single();
  const household = profile?.households;
  if (!household) throw new Error('Husstand ikke funnet');

  const { data: members } = await supabase
    .from('user_profiles')
    .select('id, name')
    .eq('household_id', household.id);

  return { household_id: household.id, invite_code: household.invite_code, members: members || [] };
}

export async function joinHousehold(invite_code) {
  if (isDemoMode) return mock.joinHousehold(invite_code);
  const { data: household, error } = await supabase
    .from('households')
    .select('id')
    .eq('invite_code', invite_code.toUpperCase())
    .single();
  if (error || !household) throw new Error('Ugyldig invitasjonskode');
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('user_profiles').update({ household_id: household.id }).eq('id', user.id);
  return { ok: true };
}

export async function updatePersons(default_persons) {
  if (isDemoMode) return mock.updatePersons(default_persons);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('user_profiles').update({ default_persons }).eq('id', user.id);
  const stored = JSON.parse(localStorage.getItem('middag_user') || '{}');
  stored.default_persons = default_persons;
  localStorage.setItem('middag_user', JSON.stringify(stored));
  return { ok: true };
}
