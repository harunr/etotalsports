import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, Truck, Globe, ChevronRight, ChevronDown, ArrowRight, ArrowUp, Plus, Minus, Trash2, Tag, Check, Lock, Command, CornerDownLeft, Flame, Star, Layers, Mail } from 'lucide-react';
import { useStore, minor, regular, onSale, pct } from './store.jsx';
import { Logo } from './Logo.jsx';
import { ProductImage } from './ProductArt.jsx';
import { Drawer, Modal, Btn, Stars, Swatches } from './ui.jsx';
import { Magnetic, Marquee } from './fx.jsx';
import { Ad } from './Ads.jsx';
import { MEGA, SPORTS, COLOR_HEX, PROMOS } from './data.js';
import { gsap } from './fx.jsx';

export function AnnouncementBar() {
  const { region, regionCode, setRegionCode, regions, money, meter, freeShip, count, after, FREE_SHIPPING_MINOR, toast } = useStore();
  return (
    <div className="relative z-[60] bg-onyx text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-xs sm:text-sm">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Truck size={16} className="flex-none text-volt" />
          <p className="truncate font-medium">{freeShip && count ? <span className="text-volt">You unlocked free shipping.</span> : <>Free shipping over <b className="text-volt">{money(FREE_SHIPPING_MINOR)}</b>{count ? <> · {money(FREE_SHIPPING_MINOR - after)} to go</> : null}</>}</p>
          <div className="hidden h-1.5 w-40 flex-none overflow-hidden rounded-full bg-white/20 sm:block" role="progressbar" aria-valuenow={meter} aria-valuemin={0} aria-valuemax={100} aria-label="Free shipping progress"><motion.div className="h-full rounded-full bg-volt" animate={{ width: `${meter}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>
        </div>
        <label className="flex flex-none items-center gap-1.5"><Globe size={14} className="text-volt" /><span className="sr-only">Region and currency</span>
          <select value={regionCode} onChange={(e) => { setRegionCode(e.target.value); toast(`Region set to ${regions.find((r) => r.code === e.target.value).name}`); }} className="cursor-pointer rounded bg-transparent py-0.5 pr-1 text-xs font-semibold outline-none focus:ring-2 focus:ring-volt sm:text-sm">
            {regions.map((r) => <option key={r.code} value={r.code} className="text-onyx">{r.name} · {r.currency}</option>)}
          </select></label>
      </div>
    </div>
  );
}

export function Header() {
  const { navigate, route, count, wish, setCartOpen, setSearchOpen, setMenuOpen, goShop, products, bump, money } = useStore();
  const [mega, setMega] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => { const prev = scrollY.getPrevious() || 0; setHidden(y > prev && y > 260); setSolid(y > 40); });
  const link = (to, label) => <button onClick={() => navigate(to)} className={`relative px-3 py-2 font-display text-[15px] font-bold uppercase tracking-wide transition hover:text-onyx ${route.name === to.slice(1) ? 'text-onyx' : 'text-slate-600'}`}>{label}{route.name === to.slice(1) && <motion.span layoutId="nav-ul" className="absolute inset-x-3 -bottom-1 h-[3px] bg-volt" />}</button>;
  return (
    <motion.header animate={{ y: hidden && !mega ? '-100%' : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 34 }} onMouseLeave={() => setMega(null)}
      className={`sticky top-0 z-50 border-b transition-colors ${solid ? 'border-slate-200 bg-white/90 backdrop-blur-xl' : 'border-transparent bg-white'}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-5">
        <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        <a href="#home" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex-none" aria-label="eTotalSports home" data-cursor-text="HOME">
          <span className="hidden sm:block"><Logo tone="light" height={38} /></span><span className="sm:hidden"><Logo variant="icon" tone="light" height={38} /></span>
        </a>
        <nav className="ml-2 hidden items-center lg:flex" aria-label="Main">
          {MEGA.map((m) => (
            <button key={m.key} onMouseEnter={() => setMega(m.key)} onFocus={() => setMega(m.key)} onClick={() => goShop({ cat: m.cat })} className={`relative px-3 py-2 font-display text-[15px] font-bold uppercase tracking-wide transition hover:text-onyx ${mega === m.key ? 'text-onyx' : 'text-slate-600'}`}>
              {m.label}<span className={`absolute inset-x-3 -bottom-1 h-[3px] origin-left bg-volt transition-transform ${mega === m.key ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
          ))}
          {link('/news', 'News')}
          <button onClick={() => goShop({ sale: true })} className="px-3 py-2 font-display text-[15px] font-bold uppercase tracking-wide text-red-700 hover:underline">Sale</button>
        </nav>
        <div className="ml-auto flex flex-none items-center gap-1">
          <button onClick={() => setSearchOpen(true)} className="hidden items-center gap-2 rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-4 pr-3 text-sm text-slate-500 transition hover:border-onyx md:flex" aria-label="Search products (Ctrl K)">
            <Search size={17} /> <span className="w-28 text-left lg:w-36">Search gear…</span><kbd className="flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-slate-200"><Command size={10} />K</kbd>
          </button>
          <button onClick={() => setSearchOpen(true)} className="rounded-full p-2.5 hover:bg-slate-100 md:hidden" aria-label="Search"><Search size={22} /></button>
          <button onClick={() => navigate('/wishlist')} className="relative rounded-full p-2.5 hover:bg-slate-100" aria-label={`Wishlist, ${wish.size} saved`}>
            <Heart size={22} className={wish.size ? 'fill-onyx' : ''} />
            <AnimatePresence>{wish.size > 0 && <motion.span key={wish.size} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-onyx px-1 text-[11px] font-bold text-volt">{wish.size}</motion.span>}</AnimatePresence>
          </button>
          <motion.button key={bump} animate={bump ? { rotate: [0, -12, 10, 0], scale: [1, 1.18, 1] } : {}} transition={{ duration: 0.5 }} onClick={() => setCartOpen(true)} className="relative rounded-full bg-onyx p-2.5 text-white hover:bg-carbon" aria-label={`Open cart, ${count} items`}>
            <ShoppingBag size={22} />
            <AnimatePresence>{count > 0 && <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-volt px-1 text-[11px] font-extrabold text-onyx">{count}</motion.span>}</AnimatePresence>
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {mega && (
          <motion.div key="mega" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="absolute inset-x-0 top-full hidden border-b border-slate-200 bg-white shadow-2xl lg:block" onMouseEnter={() => setMega(mega)}>
            {MEGA.filter((m) => m.key === mega).map((m) => {
              const feat = products.find((p) => p.name === m.feature);
              return (
                <div key={m.key} className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-4 py-8">
                  <div className="col-span-3">
                    <p className="font-display text-xs font-bold uppercase tracking-[.2em] text-slate-500">{m.label}</p>
                    <ul className="mt-3 space-y-1">
                      {m.links.map((l, i) => <motion.li key={l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}><button onClick={() => goShop({ cat: m.cat })} className="group flex items-center gap-2 py-1 text-[15px] font-medium text-slate-700 hover:text-onyx"><span className="h-px w-0 bg-onyx transition-all group-hover:w-4" />{l}</button></motion.li>)}
                    </ul>
                    <button onClick={() => goShop({ cat: m.cat })} className="mt-4 inline-flex items-center gap-1 font-display text-sm font-bold uppercase tracking-wide">Shop all {m.label} <ArrowRight size={16} /></button>
                  </div>
                  <div className="col-span-5 grid grid-cols-2 gap-3">
                    {[['Just dropped', Flame, {}], ['On sale', Tag, { sale: true }], ['Top rated', Star, { sort: 'rated' }], ['All sports', Layers, {}]].map(([t, I, patch]) => (
                      <button key={t} onClick={() => goShop({ cat: m.cat, ...patch })} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-onyx hover:bg-slate-50"><I size={20} /><span className="font-display font-bold uppercase tracking-wide">{t}</span></button>
                    ))}
                  </div>
                  {feat && <button onClick={() => navigate(`/product/${feat.slug}`)} className="col-span-4 flex items-center gap-4 overflow-hidden rounded-2xl bg-onyx p-4 text-left text-white">
                    <div className="h-28 w-36 flex-none"><ProductImage p={feat} /></div>
                    <div><p className="font-display text-xs font-bold uppercase tracking-[.2em] text-volt">Featured</p><p className="font-display text-xl font-extrabold uppercase italic leading-tight">{feat.name}</p><p className="mt-1 text-sm text-slate-300">{money(minor(feat))}</p></div>
                  </button>}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function MobileMenu() {
  const { menuOpen, setMenuOpen, goShop, navigate, regionCode, region } = useStore();
  const items = [...MEGA.map((m) => [m.label, () => goShop({ cat: m.cat })]), ['News', () => navigate('/news')], ['About', () => navigate('/about')], ['Contact', () => navigate('/contact')], ['Sale', () => goShop({ sale: true })]];
  return (
    <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" label="Menu" width="max-w-sm">
      <div className="flex items-center justify-between bg-onyx px-4 py-4 text-white">
        <div className="flex items-center gap-3"><Logo variant="icon" tone="dark" height={42} /><div><p className="font-display text-xl font-extrabold uppercase italic leading-none">eTotal<span className="text-volt">Sports</span></p><p className="text-xs text-slate-400">Total performance. Zero limits.</p></div></div>
        <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-white/10"><X size={22} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="divide-y divide-slate-100">
          {items.map(([l, fn], i) => <motion.li key={l} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.045 }}><button onClick={fn} className={`flex w-full items-center justify-between py-4 font-display text-3xl font-extrabold uppercase italic ${l === 'Sale' ? 'text-red-700' : ''}`}>{l}<ChevronRight size={22} /></button></motion.li>)}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">{SPORTS.map((s) => <button key={s.key} onClick={() => goShop({ sport: s.key })} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold">{s.label}</button>)}</div>
      </div>
      <p className="border-t border-slate-200 p-4 text-center text-xs text-slate-500">Region: {region.name} · {region.currency}</p>
    </Drawer>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, count, money, subtotal, discount, shipping, total, meter, freeShip, after, setQty, remove, promo, setPromo, applyPromo, navigate, products, add, FREE_SHIPPING_MINOR, goShop } = useStore();
  const [code, setCode] = useState(''); const [err, setErr] = useState('');
  const upsell = useMemo(() => products.filter((p) => !cart.some((l) => l.id === p.id) && ['accessories'].some((c) => p.categories.some((x) => x.slug === c))).slice(0, 2), [products, cart]);
  return (
    <Drawer open={cartOpen} onClose={() => setCartOpen(false)} label="Shopping cart">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3"><Logo variant="icon" tone="light" height={32} /><h2 className="font-display text-2xl font-extrabold uppercase italic leading-none">Your cart <span className="text-slate-400">({count})</span></h2></div>
        <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="rounded-full p-2 hover:bg-slate-100"><X size={22} /></button>
      </div>
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
        <p className="text-sm font-medium">{freeShip && cart.length ? <span className="inline-flex items-center gap-1.5"><Check size={16} /> Free shipping unlocked</span> : <>Add <b>{money(FREE_SHIPPING_MINOR - after)}</b> for free shipping</>}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><motion.div className="h-full rounded-full bg-onyx" animate={{ width: `${meter}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} /></div>
      </div>
      <div className="flex-1 overflow-y-auto px-5">
        {cart.length === 0 ? (
          <div className="grid h-full place-items-center py-16 text-center"><div>
            <div className="mx-auto mb-4 w-fit rounded-2xl bg-onyx p-4"><Logo variant="mark" tone="dark" height={48} /></div>
            <p className="font-display text-2xl font-extrabold uppercase italic">Your cart is empty</p><p className="mt-1 text-sm text-slate-500">Gear up and add something fast.</p>
            <Btn variant="dark" className="mt-5" onClick={() => goShop({})}>Start shopping</Btn></div></div>
        ) : (
          <ul className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {cart.map((l) => (
                <motion.li key={l.key} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} className="flex gap-4 overflow-hidden py-4">
                  <div className="h-24 w-24 flex-none rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-1.5"><ProductImage p={l.p} color={l.color} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div><button onClick={() => navigate(`/product/${l.p.slug}`)} className="text-left font-display text-lg font-bold uppercase italic leading-tight hover:underline">{l.p.name}</button>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><span className="inline-block h-3 w-3 rounded-full border border-slate-300" style={{ background: COLOR_HEX[l.color] }} />{l.color} · {l.size}</p></div>
                      <button onClick={() => remove(l.key)} aria-label={`Remove ${l.p.name}`} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-700"><Trash2 size={16} /></button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-slate-300">
                        <button onClick={() => setQty(l.key, -1)} aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"><Minus size={15} /></button>
                        <AnimatePresence mode="popLayout" initial={false}><motion.span key={l.qty} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="w-8 text-center text-sm font-bold">{l.qty}</motion.span></AnimatePresence>
                        <button onClick={() => setQty(l.key, 1)} aria-label="Increase quantity" className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"><Plus size={15} /></button>
                      </div>
                      <div className="text-right"><p className="font-bold">{money(l.qty * minor(l.p))}</p>{onSale(l.p) && <p className="text-xs text-slate-400 line-through">{money(l.qty * regular(l.p))}</p>}</div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
            {upsell.length > 0 && <li className="py-4"><p className="mb-2 font-display text-xs font-bold uppercase tracking-[.2em] text-slate-500">Complete the kit</p>
              <div className="grid grid-cols-2 gap-3">{upsell.map((p) => <button key={p.id} onClick={() => add(p)} className="rounded-xl border border-slate-200 p-2 text-left transition hover:border-onyx"><div className="aspect-[5/4] rounded-lg bg-slate-100 p-2"><ProductImage p={p} /></div><p className="mt-1 truncate text-xs font-semibold">{p.name}</p><p className="flex items-center justify-between text-xs"><span className="font-bold">{money(minor(p))}</span><span className="inline-flex items-center gap-0.5 font-semibold text-laser"><Plus size={12} />Add</span></p></button>)}</div></li>}
          </ul>
        )}
      </div>
      {cart.length > 0 && (
        <div className="border-t border-slate-200 bg-white px-5 py-4">
          <form onSubmit={(e) => { e.preventDefault(); if (applyPromo(code)) { setCode(''); setErr(''); } else setErr('That code is not valid. Try VOLT10.'); }} className="flex gap-2">
            <label className="sr-only" htmlFor="ets-promo">Promo code</label>
            <div className="flex flex-1 items-center rounded-full border border-slate-300 px-3 focus-within:ring-2 focus-within:ring-volt"><Tag size={16} className="text-slate-500" /><input id="ets-promo" value={code} onChange={(e) => { setCode(e.target.value); setErr(''); }} placeholder="Promo code" className="w-full bg-transparent px-2 py-2.5 text-sm uppercase outline-none" /></div>
            <button className="rounded-full bg-slate-100 px-5 font-display font-bold uppercase hover:bg-volt">Apply</button>
          </form>
          {err && <p className="mt-1.5 text-xs text-red-700" role="alert">{err}</p>}
          {promo && <p className="mt-2 flex items-center justify-between text-xs"><span className="inline-flex items-center gap-1 rounded-full bg-volt px-2.5 py-1 font-bold"><Check size={12} /> {promo} · {PROMOS[promo] * 100}% off</span><button onClick={() => setPromo(null)} className="text-slate-500 underline">Remove</button></p>}
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-slate-600">Subtotal</dt><dd className="font-semibold">{money(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><dt>Discount</dt><dd className="font-semibold">-{money(discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-slate-600">Shipping</dt><dd className="font-semibold">{shipping === 0 ? 'Free' : money(shipping)}</dd></div>
            <div className="flex items-baseline justify-between border-t border-slate-200 pt-3"><dt className="font-display text-xl font-extrabold uppercase italic">Total</dt><dd className="text-2xl font-extrabold">{money(total)}</dd></div>
          </dl>
          <button onClick={() => navigate('/cart')} className="mt-4 w-full rounded-full border-2 border-onyx/20 py-3 font-display text-lg font-extrabold uppercase italic hover:border-onyx">View full cart</button>
          <Btn variant="volt" className="mt-2 w-full !py-4 !text-xl" onClick={() => navigate('/checkout')}><Lock size={18} /> Checkout <ArrowRight size={20} className="transition group-hover:translate-x-1" /></Btn>
          <p className="mt-2 text-center text-xs text-slate-500">30-day free returns · Secure payment</p>
        </div>
      )}
    </Drawer>
  );
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, products, money, navigate, goShop } = useStore();
  const [q, setQ] = useState(''); const [sel, setSel] = useState(0); const inp = useRef(null);
  useEffect(() => { const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen((o) => !o); } }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [setSearchOpen]);
  useEffect(() => { if (searchOpen) { setQ(''); setSel(0); setTimeout(() => inp.current && inp.current.focus(), 80); } }, [searchOpen]);
  const res = useMemo(() => { const t = q.trim().toLowerCase(); return (t ? products.filter((p) => [p.name, p.sport, ...p.tags, ...p.categories.map((c) => c.name)].join(' ').toLowerCase().includes(t)) : products.slice(0, 5)).slice(0, 6); }, [q, products]);
  const go = (p) => navigate(`/product/${p.slug}`);
  const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(res.length - 1, s + 1)); } if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); } if (e.key === 'Enter') { e.preventDefault(); if (res[sel] && q) go(res[sel]); else if (q) goShop({ q }); else if (res[sel]) go(res[sel]); } };
  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[95] flex items-start justify-center px-3 pt-[10vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Search">
          <div className="absolute inset-0 bg-onyx/80 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
          <motion.div initial={{ y: -30, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: 'spring', stiffness: 340, damping: 28 }} className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5"><Search size={20} className="text-slate-500" />
              <input ref={inp} value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} onKeyDown={onKey} placeholder="Search shoes, balls, rackets…" aria-label="Search products" className="w-full bg-transparent py-5 text-lg outline-none" />
              <button onClick={() => setSearchOpen(false)} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">ESC</button></div>
            <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3">
              {['Running shoes', 'Football', 'Dumbbell', 'Racket', 'Hydration', 'Basketball', 'Cricket'].map((t) => <button key={t} onClick={() => goShop({ q: t })} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium transition hover:bg-volt">{t}</button>)}
            </div>
            <ul className="max-h-[48vh] overflow-y-auto p-2" role="listbox">
              {res.length === 0 && <li className="px-4 py-10 text-center text-slate-500">No results for “{q}”. Try “shoes” or “ball”.</li>}
              {res.map((p, i) => (
                <motion.li key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} role="option" aria-selected={i === sel}>
                  <button onMouseEnter={() => setSel(i)} onClick={() => go(p)} className={`flex w-full items-center gap-4 rounded-xl p-2.5 text-left transition ${i === sel ? 'bg-slate-100' : ''}`}>
                    <span className="h-14 w-16 flex-none rounded-lg bg-slate-100 p-1"><ProductImage p={p} /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-display text-lg font-bold uppercase italic leading-tight">{p.name}</span><span className="text-xs text-slate-500">{p.categories[0].name} · {p.sport}</span></span>
                    <span className="font-bold">{money(minor(p))}</span>{i === sel && <CornerDownLeft size={16} className="text-slate-400" />}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-xs text-slate-500"><span>↑ ↓ to navigate · Enter to open</span><button onClick={() => goShop({ q })} className="font-semibold text-onyx hover:underline">See all results</button></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function QuickView() {
  const { quick, setQuick, money, wish, toggleWish, add, navigate } = useStore();
  const [color, setColor] = useState(null); const [size, setSize] = useState(null); const [qty, setQty] = useState(1);
  useEffect(() => { if (quick) { setColor(quick.colors[0]); setSize(quick.sizes[0]); setQty(1); } }, [quick]);
  const p = quick;
  return (
    <Modal open={!!p} onClose={() => setQuick(null)} label="Quick view">
      {p && color && (
        <div className="grid md:grid-cols-2">
          <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-8 md:rounded-l-2xl"><span className="absolute left-4 top-4 rounded-full bg-onyx px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-white">{p.categories[0].name}</span>
            <div className="mx-auto mt-6 aspect-[5/4] w-full max-w-xs"><ProductImage p={p} color={color} /></div></div>
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3"><h2 className="font-display text-3xl font-extrabold uppercase italic leading-none">{p.name}</h2><button onClick={() => setQuick(null)} aria-label="Close quick view" className="rounded-full p-2 hover:bg-slate-100"><X size={20} /></button></div>
            <div className="mt-2"><Stars value={p.average_rating} count={p.review_count} /></div>
            <div className="mt-3 flex items-baseline gap-3"><span className="text-3xl font-extrabold">{money(minor(p))}</span>{onSale(p) && <><span className="text-slate-400 line-through">{money(regular(p))}</span><span className="rounded-full bg-volt px-2 py-0.5 text-xs font-extrabold">-{pct(p)}%</span></>}</div>
            <div className="mt-5"><p className="mb-2 text-sm font-semibold">Colour: <span className="capitalize text-slate-500">{color}</span></p><Swatches colors={p.colors} value={color} onChange={setColor} size={26} /></div>
            <div className="mt-5"><p className="mb-2 text-sm font-semibold">Size</p><div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">{p.sizes.map((s) => <button key={s} role="radio" aria-checked={size === s} onClick={() => setSize(s)} className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-semibold ${size === s ? 'border-onyx bg-onyx text-white' : 'border-slate-300 hover:border-onyx'}`}>{s}</button>)}</div></div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-slate-300"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="grid h-11 w-11 place-items-center rounded-full hover:bg-slate-100"><Minus size={16} /></button><span className="w-8 text-center font-bold">{qty}</span><button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="grid h-11 w-11 place-items-center rounded-full hover:bg-slate-100"><Plus size={16} /></button></div>
              <Btn className="flex-1 !py-3" onClick={() => { add(p, { color, size, qty, open: true }); setQuick(null); }}><ShoppingBag size={18} /> Add to cart</Btn>
              <button onClick={() => toggleWish(p)} aria-pressed={wish.has(p.id)} aria-label="Toggle wishlist" className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 hover:border-onyx"><Heart size={20} className={wish.has(p.id) ? 'fill-red-500 text-red-500' : ''} /></button>
            </div>
            <button onClick={() => navigate(`/product/${p.slug}`)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline">View full details <ArrowRight size={14} /></button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function Footer() {
  const { navigate, goShop, toast } = useStore();
  const [email, setEmail] = useState(''); const [ok, setOk] = useState(false);
  return (
    <footer className="relative overflow-hidden bg-onyx text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pt-10"><Ad id="gym" size="leaderboard" /></div>
      <Marquee items={['SPEED', 'POWER', 'ENDURANCE', 'TOTAL PERFORMANCE', 'ZERO LIMITS']} speed={36} className="border-y border-white/10 py-5" itemClass="font-display text-6xl font-extrabold uppercase italic text-white/90 sm:text-8xl" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tone="dark" height={48} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">eTotalSports puts authentic, performance-grade gear in the hands of every athlete, from first-day runners to match-day regulars. Total sport. No limits.</p>
          <form className="mt-6 max-w-sm" onSubmit={(e) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(email)) { setOk(true); toast('Subscribed. Use WELCOME10 for 10% off'); } else toast('Enter a valid email address'); }}>
            <label htmlFor="ets-news" className="font-display text-sm font-bold uppercase tracking-[.2em] text-white">Join the team</label>
            {ok ? <p className="mt-2 flex items-center gap-2 rounded-lg bg-white/10 p-3 text-sm text-volt"><Check size={18} /> You are in. Use WELCOME10 for 10% off.</p> : (
              <div className="mt-2 flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20 focus-within:ring-volt"><input id="ets-news" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400" /><button className="bg-volt px-5 font-display font-extrabold uppercase italic text-onyx hover:bg-white">Join</button></div>)}
          </form>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          {[['Shop', [['Running', () => goShop({ cat: 'running' })], ['Training', () => goShop({ cat: 'training' })], ['Team Sports', () => goShop({ cat: 'team-sports' })], ['Footwear', () => goShop({ cat: 'footwear' })], ['Accessories', () => goShop({ cat: 'accessories' })]]],
            ['Sports', [['Football', () => goShop({ sport: 'football' })], ['Basketball', () => goShop({ sport: 'basketball' })], ['Tennis', () => goShop({ sport: 'tennis' })], ['Cricket', () => goShop({ sport: 'cricket' })], ['Gym', () => goShop({ sport: 'gym' })]]],
            ['Company', [['About', () => navigate('/about')], ['Sports news', () => navigate('/news')], ['Contact', () => navigate('/contact')], ['Cart', () => navigate('/cart')], ['Wishlist', () => navigate('/wishlist')]]]].map(([h, ls]) => (
            <div key={h}><p className="font-display text-sm font-bold uppercase tracking-[.2em] text-white">{h}</p><ul className="mt-3 space-y-2 text-sm">{ls.map(([l, fn]) => <li key={l}><button onClick={fn} className="transition hover:text-volt">{l}</button></li>)}</ul></div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 text-xs">
        <p>© 2026 eTotalSports · <button onClick={() => navigate('/terms')} className="underline hover:text-volt">Terms</button> · <button onClick={() => navigate('/privacy')} className="underline hover:text-volt">Privacy</button></p>
        <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payments"><Lock size={14} className="text-volt" /><span className="mr-1">Secure checkout</span>{['VISA', 'Mastercard', 'PayPal', 'Apple Pay', 'bKash', 'COD'].map((b) => <span key={b} className="rounded bg-white px-2 py-1 text-[11px] font-extrabold tracking-wide text-onyx">{b}</span>)}</div>
        <Magnetic><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1.5 rounded-full bg-volt px-4 py-2 font-display text-sm font-extrabold uppercase italic text-onyx" aria-label="Back to top"><ArrowUp size={16} /> Top</button></Magnetic>
      </div></div>
    </footer>
  );
}
