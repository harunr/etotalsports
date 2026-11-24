import { PRODUCTS } from './data.js';

// Headless WooCommerce adapter.
// Point WOO_BASE at your CMS to go live, e.g. 'https://cms.etotalsports.com/wp-json/wc/store/v1'.
// The Store API is public for catalogue reads and cookie/nonce (or Cart-Token) based for cart writes.
// Left empty here: the prototype serves the mock catalogue in the same response shape.
export const WOO_BASE = '';

export async function getProducts({ category } = {}) {
  if (!WOO_BASE) return PRODUCTS;
  const qs = new URLSearchParams({ per_page: '24', ...(category ? { category } : {}) });
  const res = await fetch(`${WOO_BASE}/products?${qs}`);
  if (!res.ok) throw new Error('Woo products ' + res.status);
  return res.json();
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
