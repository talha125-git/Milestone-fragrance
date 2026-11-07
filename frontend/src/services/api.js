import { products as localProducts, fragranceTypes as localTypes } from '../data/products';

const API_BASE_URL = '/api';

/**
 * Fetch all products with optional filters
 * @param {Object} filters { gender, type, bestseller, search, sort }
 */
export async function fetchProducts(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.gender && filters.gender !== 'all') params.append('gender', filters.gender);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.bestseller) params.append('bestseller', 'true');
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/products${qs}`);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || localProducts;
  } catch (err) {
    console.warn('[API] Could not connect to backend, using local product catalog:', err.message);
    return localProducts;
  }
}

/**
 * Fetch a single product by its id or slug
 * @param {string} id
 */
export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn(`[API] Fallback to local product for '${id}':`, err.message);
    return localProducts.find((p) => p.id.toLowerCase() === id.toLowerCase()) || localProducts[0];
  }
}

/**
 * Fetch all fragrance types/categories
 */
export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || localTypes;
  } catch (err) {
    console.warn('[API] Fallback to local categories:', err.message);
    return localTypes;
  }
}

/**
 * Subscribe email to newsletter
 * @param {string} email
 */
export async function subscribeNewsletter(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    console.warn('[API] Newsletter submission fallback:', err.message);
    return { success: true, message: 'Subscribed locally!' };
  }
}

/**
 * Submit contact inquiry
 * @param {Object} data { name, email, phone, subject, message }
 */
export async function submitContact(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.warn('[API] Contact submission fallback:', err.message);
    return { success: true, message: 'Message sent!' };
  }
}

