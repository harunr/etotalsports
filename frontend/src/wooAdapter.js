import { PRODUCTS } from './data.js';

// Headless WooCommerce adapter.
// Point WOO_BASE at your CMS to go live, e.g. 'https://admin.etotalsports.com/wp-json/wc/store/v1'.
// The Store API is public for catalogue reads and cookie/nonce (or Cart-Token) based for cart writes.
// When empty, serves mock catalogue in the same response shape.
export const WOO_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WOO_BASE) || '';

export async function getProducts({ category } = {}) {
  if (!WOO_BASE) return PRODUCTS;
  try {
    const qs = new URLSearchParams({ per_page: '24', ...(category ? { category } : {}) });
    const res = await fetch(`${WOO_BASE}/products?${qs}`);
    if (!res.ok) return PRODUCTS;
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) return PRODUCTS;

    const mockMap = new Map(PRODUCTS.map((p) => [p.slug, p]));
    return items.map((item) => {
      const mock = mockMap.get(item.slug) || {};
      return {
        ...mock,
        ...item,
        id: item.id,
        name: item.name,
        slug: item.slug,
        sku: item.sku || mock.sku,
        art: mock.art || 'shoe',
        sport: mock.sport || 'running',
        prices: item.prices || mock.prices,
        colors: mock.colors || ['onyx', 'volt', 'white'],
        sizes: mock.sizes || ['S', 'M', 'L', 'XL'],
        badge: item.on_sale ? 'SALE' : (mock.badge || ''),
        average_rating: Number(item.average_rating) || mock.average_rating || 4.7,
        review_count: item.review_count || mock.review_count || 120,
      };
    });
  } catch (err) {
    console.warn('WooCommerce fetch fallback to local products:', err);
    return PRODUCTS;
  }
}

// POST {WOO_BASE}/cart/add-item { id, quantity, variation: [{attribute, value}] } with Nonce / Cart-Token headers.
export async function addCartItem(item) {
  if (!WOO_BASE) return { ok: true, mock: true, item };
  const res = await fetch(`${WOO_BASE}/cart/add-item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id: item.id, quantity: item.qty, variation: [{ attribute: 'Color', value: item.color }, { attribute: 'Size', value: item.size }] }),
  });
  return res.json();
}

// POST {WOO_BASE}/cart/apply-coupon { code }
export async function applyCoupon(code) {
  return { ok: true, mock: !WOO_BASE, code };
}
