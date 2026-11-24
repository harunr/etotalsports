import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { PRODUCTS, REGIONS, PROMOS, FREE_SHIPPING_MINOR, FLAT_SHIPPING_MINOR } from './data.js';
import { getProducts, addCartItem } from './wooAdapter.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export const minor = (p) => Number(p.prices.price);
export const regular = (p) => Number(p.prices.regular_price);
export const onSale = (p) => regular(p) > minor(p);
export const pct = (p) => Math.round((1 - minor(p) / regular(p)) * 100);

/* ---- tiny hash router (plain #names only, no #/paths) ---- */
function parse(hash) {
  const h = (hash || '').replace(/^#/, '');
  if (h.startsWith('product-')) return { name: 'product', slug: h.slice(8), key: h };
  if (['shop', 'wishlist', 'about', 'contact', 'checkout', 'order', 'news', 'cart', 'terms', 'privacy'].includes(h)) return { name: h, key: h };
  if (!h || h === 'home') return { name: 'home', key: 'home' };
  return { name: 'notfound', key: 'nf-' + h };
}
const toHash = (path) => {
  if (path === '/' || !path) return 'home';
  const parts = path.replace(/^\//, '').split('/');
  return parts[0] === 'product' ? 'product-' + parts[1] : parts[0];
};

const DEFAULT_FILTERS = { cat: 'all', sport: null, q: '', price: 300, colors: [], rating: 0, sale: false, sort: 'featured' };

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);
  const [regionCode, setRegionCode] = useState('BD');
  const [route, setRoute] = useState(() => parse(typeof location !== 'undefined' ? location.hash : ''));
  const [cart, setCart] = useState([]);
  const [promo, setPromo] = useState(null);
  const [wish, setWish] = useState(() => new Set());
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quick, setQuick] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState(null);
  const [bump, setBump] = useState(0);
  const tid = useRef(0);

  useEffect(() => { getProducts().then(setProducts).catch(() => {}); }, []);
  useEffect(() => {
    const on = () => setRoute(parse(location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const navigate = useCallback((path) => {
    const h = toHash(path);
    setCartOpen(false); setSearchOpen(false); setMenuOpen(false); setQuick(null);
    setRoute(parse('#' + h));
    try { if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h); } catch (e) { /* sandboxed */ }
  }, []);

  const region = REGIONS.find((r) => r.code === regionCode);
  const money = useMemo(() => {
    if (region.currency === 'BDT') { const bd = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }); return (m) => '৳' + bd.format(Math.round((m / 100) * region.rate)); }
    const nf = new Intl.NumberFormat(region.locale, { style: 'currency', currency: region.currency });
    return (m) => nf.format((m / 100) * region.rate);
  }, [region]);

  const toast = useCallback((msg) => {
    const id = ++tid.current;
    setToasts((t) => [...t.slice(-2), { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }, []);

  const byId = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const bySlug = useMemo(() => Object.fromEntries(products.map((p) => [p.slug, p])), [products]);
  const lines = useMemo(() => cart.map((l) => ({ ...l, p: byId[l.id] })).filter((l) => l.p), [cart, byId]);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * minor(l.p), 0);
  const discount = promo ? Math.round(subtotal * PROMOS[promo]) : 0;
  const after = subtotal - discount;
  const freeShip = after >= FREE_SHIPPING_MINOR;
  const [shipMode, setShipMode] = useState('standard');
  const shipping = lines.length === 0 ? 0 : shipMode === 'express' ? 1499 : freeShip ? 0 : FLAT_SHIPPING_MINOR;
  const total = after + shipping;
  const meter = Math.min(100, Math.round((after / FREE_SHIPPING_MINOR) * 100));

  const add = useCallback((p, { color, size, qty = 1, open = false } = {}) => {
    const c = color || p.colors[0], s = size || p.sizes[0];
    const key = `${p.id}-${c}-${s}`;
    setCart((cur) => {
      const i = cur.findIndex((l) => l.key === key);
      return i >= 0 ? cur.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l)) : [...cur, { key, id: p.id, color: c, size: s, qty }];
    });
    addCartItem({ id: p.id, qty, color: c, size: s });
    setBump((b) => b + 1);
    toast(`${p.name} added to cart`);
    if (open) setCartOpen(true);
  }, [toast]);
  const setQty = (key, d) => setCart((c) => c.flatMap((l) => (l.key === key ? (l.qty + d <= 0 ? [] : [{ ...l, qty: l.qty + d }]) : [l])));
  const remove = (key) => setCart((c) => c.filter((l) => l.key !== key));
  const clear = () => { setCart([]); setPromo(null); };
  const applyPromo = (code) => { const c = code.trim().toUpperCase(); if (PROMOS[c]) { setPromo(c); toast(`${c} applied: ${PROMOS[c] * 100}% off`); return true; } return false; };
  const toggleWish = (p) => setWish((w) => { const n = new Set(w); if (n.has(p.id)) { n.delete(p.id); toast('Removed from wishlist'); } else { n.add(p.id); toast('Saved to wishlist'); } return n; });
  const patchFilters = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const goShop = (patch = {}) => { setFilters({ ...DEFAULT_FILTERS, ...patch }); navigate('/shop'); };

  const value = { products, byId, bySlug, region, regionCode, setRegionCode, regions: REGIONS, money, route, navigate, goShop,
    cart: lines, count, subtotal, discount, after, shipping, total, freeShip, meter, promo, setPromo, applyPromo, add, setQty, remove, clear, shipMode, setShipMode, bump,
    wish, toggleWish, filters, patchFilters, resetFilters,
    cartOpen, setCartOpen, searchOpen, setSearchOpen, menuOpen, setMenuOpen, quick, setQuick, toasts, toast, ready, setReady, order, setOrder,
    FREE_SHIPPING_MINOR };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
