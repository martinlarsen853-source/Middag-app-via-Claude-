import { supabase, isDemoMode } from './supabase.js';
import * as mock from './mockApi.js';
import { calculateIngredientCost } from './pricing.js';

// --- Auth ---
export async function login(email, password) {
  if (isDemoMode()) return mock.login(email, password);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  const profile = await getOrCreateProfile(data.user);
  return { token: data.session.access_token, user: { id: data.user.id, email: data.user.email, ...profile } };
}

export async function register(name, email, password, default_persons = 2) {
  if (isDemoMode()) return mock.register(name, email, password, default_persons);
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
  if (isDemoMode()) return;
  await supabase.auth.signOut();
}

async function getOrCreateProfile(user) {
  const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
  return data || {};
}

// --- Meals ---
export async function getMeals(sort = '') {
  if (isDemoMode()) return mock.getMeals(sort);

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
  if (isDemoMode()) return mock.getMeal(id);
  const { data, error } = await supabase
    .from('meals')
    .select('*, meal_ingredients(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return { ...data, ingredients: data.meal_ingredients.map(i => ({ name: i.ingredient_name, quantity: i.quantity, unit: i.unit, section: i.section })) };
}

export async function markEaten(id) {
  if (isDemoMode()) return mock.markEaten(id);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('meal_history').insert({ user_id: user.id, meal_id: id });
  return { ok: true };
}

// --- Stores ---
export async function getStores() {
  if (isDemoMode()) return mock.getStores();
  const { data, error } = await supabase.from('stores').select('*').order('id');
  if (error) throw new Error(error.message);
  return data.map(s => ({ ...s, section_order: s.section_order || [] }));
}

// --- Shopping list ---
export async function getShoppingList(mealId, storeId, persons = 2) {
  if (isDemoMode()) return mock.getShoppingList(mealId, storeId, persons);

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

// --- Ingredients (NEW) ---
export async function getIngredients(category = null, search = null, limit = 50, offset = 0) {
  if (isDemoMode()) return mock.getIngredients(category, search, limit, offset);

  let query = supabase.from('ingredients').select('*', { count: 'exact' });

  if (category) query = query.eq('category', category);
  if (search) query = query.ilike('name', `%${search}%`);

  const { data, error, count } = await query
    .order('category', { ascending: true })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);
  return { data, count, limit, offset };
}

export async function getIngredientCategories() {
  if (isDemoMode()) return mock.getIngredientCategories();

  const { data, error } = await supabase
    .from('ingredient_categories')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);
  return data;
}

export async function getIngredientsByCategory(category) {
  return getIngredients(category, null, 500, 0);
}

export async function createIngredient(data) {
  if (isDemoMode()) return {};
  throw new Error('Ingredienspriser styres kun av Kassalapp-sync');
}

export async function updateIngredient(id, data) {
  if (isDemoMode()) return {};
  throw new Error('Ingredienspriser styres kun av Kassalapp-sync');
}

export async function deleteIngredient(id) {
  if (isDemoMode()) return { ok: true };
  throw new Error('Ingredienskatalogen er skrivebeskyttet. Endringer skjer via Kassalapp-sync.');
}

// --- Meals CRUD (NEW) ---
export async function createMeal(mealData) {
  if (isDemoMode()) return {};

  const { name, emoji, description, time_minutes, category, ingredients } = mealData;

  // Insert meal
  const { data: meal, error: mealError } = await supabase
    .from('meals')
    .insert([{
      name,
      emoji: emoji || '🍽',
      description: description || '',
      time_minutes: time_minutes || 30,
      price_level: 2,
      category: category || 'Annet',
    }])
    .select()
    .single();

  if (mealError) throw new Error(mealError.message);

  // Insert ingredients if provided
  if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
    const ingredientsData = ingredients.map(ing => ({
      meal_id: meal.id,
      ingredient_id: ing.ingredient_id || null,
      ingredient_name: ing.name,
      quantity: ing.quantity || 1,
      unit: ing.unit || 'g',
      section: ing.section || 'Diverse',
    }));

    const { error: ingError } = await supabase
      .from('meal_ingredients')
      .insert(ingredientsData);

    if (ingError) throw new Error(ingError.message);
  }

  return meal;
}

export async function updateMeal(id, mealData) {
  if (isDemoMode()) return {};

  const { name, emoji, description, time_minutes, category } = mealData;

  const { data, error } = await supabase
    .from('meals')
    .update({
      name,
      emoji,
      description,
      time_minutes,
      category,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteMeal(id) {
  if (isDemoMode()) return { ok: true };

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { ok: true };
}

// --- Meal Ingredients ---
export async function addMealIngredient(mealId, ingredientData) {
  if (isDemoMode()) return {};

  const { data, error } = await supabase
    .from('meal_ingredients')
    .insert([{
      meal_id: mealId,
      ingredient_id: ingredientData.ingredient_id || null,
      ingredient_name: ingredientData.name,
      quantity: ingredientData.quantity || 1,
      unit: ingredientData.unit || 'g',
      section: ingredientData.section || 'Diverse',
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function removeMealIngredient(ingredientId) {
  if (isDemoMode()) return { ok: true };

  const { error } = await supabase
    .from('meal_ingredients')
    .delete()
    .eq('id', ingredientId);

  if (error) throw new Error(error.message);
  return { ok: true };
}

// --- Price Calculation ---
export function calculateMealPrice(ingredients) {
  if (!Array.isArray(ingredients)) return 0;
  return ingredients.reduce((total, ing) => {
    const pricing = calculateIngredientCost(ing.ingredient || ing, ing.quantity || 0, ing.unit || ing.ingredient?.unit);
    return pricing.status === 'ok' ? total + pricing.total : total;
  }, 0);
}

// --- Household ---
export async function getHousehold() {
  if (isDemoMode()) return mock.getHousehold();
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
  if (isDemoMode()) return mock.joinHousehold(invite_code);
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
  if (isDemoMode()) return mock.updatePersons(default_persons);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('user_profiles').update({ default_persons }).eq('id', user.id);
  const stored = JSON.parse(localStorage.getItem('middag_user') || '{}');
  stored.default_persons = default_persons;
  localStorage.setItem('middag_user', JSON.stringify(stored));
  return { ok: true };
}
