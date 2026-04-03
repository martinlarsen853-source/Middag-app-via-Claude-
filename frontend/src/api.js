const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('middag_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Nettverksfeil' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function register(name, email, password, default_persons = 2) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, default_persons })
  });
}

// Meals
export async function getMeals(sort = '') {
  const qs = sort ? `?sort=${sort}` : '';
  return request(`/meals${qs}`);
}

export async function getMeal(id) {
  return request(`/meals/${id}`);
}

export async function markEaten(id) {
  return request(`/meals/${id}/eaten`, { method: 'PUT' });
}

// Stores
export async function getStores() {
  return request('/shopping/stores/all');
}

// Shopping list
export async function getShoppingList(mealId, storeId, persons = 2) {
  return request(`/shopping/${mealId}/${storeId}?persons=${persons}`);
}

// Household
export async function getHousehold() {
  return request('/household');
}

export async function joinHousehold(invite_code) {
  return request('/household/join', {
    method: 'POST',
    body: JSON.stringify({ invite_code })
  });
}

export async function updatePersons(default_persons) {
  return request('/household/persons', {
    method: 'PUT',
    body: JSON.stringify({ default_persons })
  });
}
