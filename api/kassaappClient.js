import fetch from 'node-fetch';

const API_BASE_URL = 'https://kassal.app/api/v1';
const API_KEY = process.env.KASSALAPP_API_KEY;

if (!API_KEY) {
  console.warn('⚠️  KASSALAPP_API_KEY not configured in .env');
}

// Rate limiting: max 60 requests per minute
let requestCount = 0;
let lastResetTime = Date.now();

function checkRateLimit() {
  const now = Date.now();
  if (now - lastResetTime >= 60000) {
    requestCount = 0;
    lastResetTime = now;
  }
  if (requestCount >= 60) {
    throw new Error('Kassalapp API rate limit exceeded (60 requests/minute)');
  }
  requestCount++;
}

async function request(endpoint, options = {}) {
  checkRateLimit();

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Kassalapp API rate limit exceeded');
      }
      throw new Error(`Kassalapp API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Kassalapp request failed (${endpoint}):`, error.message);
    throw error;
  }
}

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.store_id) params.append('store_id', filters.store_id);

  const endpoint = `/products?${params.toString()}`;
  return request(endpoint);
}

export async function fetchProductById(id) {
  return request(`/products/id/${id}`);
}

export async function fetchProductByEAN(ean) {
  return request(`/products/ean/${ean}`);
}

export async function fetchStores() {
  return request('/physical-stores');
}

export async function fetchStoreById(id) {
  return request(`/physical-stores/${id}`);
}

export async function fetchProductsPricesBulk(productIds) {
  return request('/products/prices-bulk', {
    method: 'POST',
    body: JSON.stringify({ ids: productIds }),
  });
}

export async function searchProducts(searchTerm, options = {}) {
  return fetchProducts({
    search: searchTerm,
    limit: options.limit || 50,
    page: options.page || 1,
  });
}
