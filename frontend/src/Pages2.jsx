import React, { useRef, useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, SlidersHorizontal, X, Heart, ShieldCheck, RotateCcw, Truck, Check, Lock, Minus, Plus, ShoppingBag, Box, Image as ImageIcon, ChevronDown, Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react';
import { useStore, minor, regular, onSale, pct } from './store.jsx';
import { useFx, Split, gsap, reduced } from './fx.jsx';
import { ProductCard, Btn, Stars, Swatches, SectionHead } from './ui.jsx';
import { ProductArt, ProductImage } from './ProductArt.jsx';
import Viewer3D, { SUPPORTS_3D } from './Viewer3D.jsx';
import { CATEGORY_TABS, SPORTS, COLOR_HEX } from './data.js';
import { COPY, REVIEWS, FAQ, SPORT_COPY } from './content.js';
import { Logo } from './Logo.jsx';
import { Ad, AdSlot, SponsoredStrip } from './Ads.jsx';

export function PageHead({ eyebrow, title, children }) {
  return <section className="relative overflow-hidden bg-onyx py-14 text-white"><div className="absolute -right-10 top-0 h-full w-1/3 skew-x-[-14deg] bg-volt/10" /><div className="relative mx-auto max-w-7xl px-4"><p className="font-display text-xs font-bold uppercase tracking-[.25em] text-volt">{eyebrow}</p><h1 className="font-display text-6xl font-extrabold uppercase italic leading-[.85] sm:text-8xl">{title}</h1>{children}</div></section>;
}

export function Shop() {
  const { products, filters: f, patchFilters, resetFilters, money } = useStore();
  const [open, setOpen] = useState(false);
  const list = useMemo(() => {
    let l = products.filter((p) => (f.cat === 'all' || p.categories.some((c) => c.slug === f.cat)) && (!f.sport || p.sport === f.sport) && minor(p) / 100 <= f.price && p.average_rating >= f.rating && (!f.sale || onSale(p)) && (!f.colors.length || f.colors.some((c) => p.colors.includes(c))) && (!f.q || [p.name, p.sport, ...p.tags, ...p.categories.map((c) => c.name)].join(' ').toLowerCase().includes(f.q.toLowerCase())));
    const s = { price: (a, b) => minor(a) - minor(b), 'price-desc': (a, b) => minor(b) - minor(a), rated: (a, b) => b.average_rating - a.average_rating, featured: () => 0 }[f.sort];
    return [...l].sort(s);
  }, [products, f]);
  const active = f.sport || f.q || f.sale || f.colors.length || f.rating || f.price < 300;
  const Panel = (
    <div className="space-y-7">
      <div><p className="mb-2 font-display text-sm font-bold uppercase tracking-[.2em]">Sport</p><div className="flex flex-wrap gap-2">{SPORTS.map((s) => <button key={s.key} aria-pressed={f.sport === s.key} onClick={() => patchFilters({ sport: f.sport === s.key ? null : s.key })} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${f.sport === s.key ? 'bg-onyx text-white' : 'bg-slate-100 hover:bg-volt'}`}>{s.label}</button>)}</div></div>
      <div><label htmlFor="ets-price" className="mb-2 block font-display text-sm font-bold uppercase tracking-[.2em]">Max price: {money(f.price * 100)}</label><input id="ets-price" type="range" min="20" max="300" step="10" value={f.price} onChange={(e) => patchFilters({ price: +e.target.value })} className="w-full accent-onyx" /></div>
      <div><p className="mb-2 font-display text-sm font-bold uppercase tracking-[.2em]">Colour</p><div className="flex flex-wrap gap-2">{Object.keys(COLOR_HEX).map((c) => <button key={c} aria-label={c} aria-pressed={f.colors.includes(c)} onClick={() => patchFilters({ colors: f.colors.includes(c) ? f.colors.filter((x) => x !== c) : [...f.colors, c] })} className={`h-8 w-8 rounded-full border ${f.colors.includes(c) ? 'ring-2 ring-onyx ring-offset-2' : 'border-slate-300'}`} style={{ background: COLOR_HEX[c] }} />)}</div></div>
      <div><p className="mb-2 font-display text-sm font-bold uppercase tracking-[.2em]">Rating</p><div className="flex gap-2">{[0, 4, 4.5].map((r) => <button key={r} aria-pressed={f.rating === r} onClick={() => patchFilters({ rating: r })} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${f.rating === r ? 'bg-onyx text-white' : 'bg-slate-100'}`}>{r ? `${r}+ ★` : 'Any'}</button>)}</div></div>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={f.sale} onChange={(e) => patchFilters({ sale: e.target.checked })} className="h-5 w-5 accent-onyx" /> On sale only</label>
      <button onClick={resetFilters} className="text-sm font-semibold underline">Reset all</button>
    </div>
  );
  return (
    <div>
      <PageHead eyebrow="The full range" title="Shop all gear" />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Ad id="sale" size="leaderboard" className="mb-6" />
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-slate-100 p-1" role="tablist">{CATEGORY_TABS.map((t) => <button key={t.key} role="tab" aria-selected={f.cat === t.key} onClick={() => patchFilters({ cat: t.key })} className="relative whitespace-nowrap rounded-full px-4 py-2 font-display text-sm font-bold uppercase tracking-wide">{f.cat === t.key && <motion.span layoutId="shop-tab" className="absolute inset-0 rounded-full bg-onyx" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}<span className={`relative ${f.cat === t.key ? 'text-white' : 'text-slate-600'}`}>{t.label}</span></button>)}</div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold lg:hidden"><SlidersHorizontal size={16} /> Filters</button>
          <label className="ml-auto flex items-center gap-2 text-sm"><span className="text-slate-500">Sort</span><select value={f.sort} onChange={(e) => patchFilters({ sort: e.target.value })} className="rounded-full border border-slate-300 bg-white px-3 py-2 font-semibold"><option value="featured">Featured</option><option value="price">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rated">Top rated</option></select></label>
        </div>
        {active && <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">{f.q && <button onClick={() => patchFilters({ q: '' })} className="inline-flex items-center gap-1 rounded-full bg-volt px-3 py-1 font-semibold">“{f.q}” <X size={14} /></button>}{f.sport && <button onClick={() => patchFilters({ sport: null })} className="inline-flex items-center gap-1 rounded-full bg-volt px-3 py-1 font-semibold capitalize">{f.sport} <X size={14} /></button>}</div>}
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className="hidden lg:block"><div className="sticky top-24 space-y-6">{Panel}<Ad id="gym" size="rect" /></div></aside>
          <div>
            <p className="mb-4 text-sm text-slate-500" aria-live="polite">{list.length} product{list.length === 1 ? '' : 's'}</p>
            {list.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center"><p className="font-display text-3xl font-extrabold uppercase italic">No matches</p><p className="mt-1 text-slate-500">Try removing a filter.</p><Btn className="mt-5" onClick={resetFilters}>Reset filters</Btn></div>
              : <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3"><AnimatePresence mode="popLayout">{list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</AnimatePresence></motion.div>}
            {list.length > 0 && <div className="mt-8"><SponsoredStrip /></div>}
            <AdSlot size="leaderboard" label="Shop footer leaderboard" className="mt-6" />
          </div>
        </div>
      </div>
      <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[90] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="absolute inset-0 bg-onyx/70" onClick={() => setOpen(false)} /><motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 36 }} className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-white p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-3xl font-extrabold uppercase italic">Filters</h2><button onClick={() => setOpen(false)} aria-label="Close filters"><X /></button></div>{Panel}<Btn className="mt-6 w-full" onClick={() => setOpen(false)}>Show {list.length} results</Btn></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}

export function ProductPage() {
  const { route, bySlug, products, money, add, wish, toggleWish, navigate } = useStore();
  const p = bySlug[route.slug];
  const root = useRef(null); useFx(root, [route.slug]);
  const [color, setColor] = useState(null); const [size, setSize] = useState(null); const [qty, setQty] = useState(1); const [mode, setMode] = useState('3d'); const [faq, setFaq] = useState(0);
  useEffect(() => { if (p) { setColor(p.colors[0]); setSize(p.sizes[0]); setQty(1); setMode(SUPPORTS_3D.includes(p.art) && p.art !== 'shoe' ? '3d' : 'art'); } }, [p && p.id]);
  if (!p) return <div className="mx-auto max-w-xl px-4 py-32 text-center"><p className="font-display text-6xl font-extrabold uppercase italic">Out of bounds</p><p className="mt-2 text-slate-500">That product does not exist.</p><Btn className="mt-6" onClick={() => navigate('/shop')}>Back to shop</Btn></div>;
  if (!color) return null;
  const copy = COPY[p.slug] || { blurb: '', specs: [] };
  const related = products.filter((x) => x.id !== p.id && (x.sport === p.sport || x.categories[0].slug === p.categories[0].slug)).slice(0, 4);
  return (
    <div ref={root} className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-slate-500"><button onClick={() => navigate('/')} className="hover:underline">Home</button> / <button onClick={() => navigate('/shop')} className="hover:underline">Shop</button> / <span className="text-onyx">{p.name}</span></nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-square overflow-hidden rounded-3xl" style={{ background: `radial-gradient(circle at 50% 60%, ${COLOR_HEX[color]}55, transparent 60%), linear-gradient(135deg,#F8FAFC,#CBD5E1)` }}>
            {mode === '3d' && SUPPORTS_3D.includes(p.art) ? <Viewer3D type={p.art} color={COLOR_HEX[color]} className="h-full w-full" fallback={<div className="grid h-full place-items-center p-10"><ProductImage p={p} color={color} /></div>} /> : <motion.div key={color} initial={{ scale: 0.85, opacity: 0, rotate: -6 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} className="grid h-full place-items-center p-12"><ProductImage p={p} color={color} className="h-full w-full drop-shadow-2xl" /></motion.div>}
            {SUPPORTS_3D.includes(p.art) && <div className="absolute right-3 top-3 z-10 flex gap-1 rounded-full bg-white/90 p-1 shadow">{[['3d', 'Interactive 3D', Box], ['art', 'Studio view', ImageIcon]].map(([k, l, I]) => <button key={k} onClick={() => setMode(k)} aria-pressed={mode === k} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${mode === k ? 'bg-onyx text-white' : ''}`}><I size={14} />{l}</button>)}</div>}
            
          </div>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[.25em] text-slate-500">{p.categories[0].name} · SKU {p.sku}</p>
          <h1 className="font-display text-5xl font-extrabold uppercase italic leading-[.9] sm:text-6xl">{p.name}</h1>
          <div className="mt-3"><Stars value={p.average_rating} count={p.review_count} size={16} /></div>
          <div className="mt-4 flex items-baseline gap-3"><span className="text-4xl font-extrabold">{money(minor(p))}</span>{onSale(p) && <><span className="text-lg text-slate-400 line-through">{money(regular(p))}</span><span className="rounded-full bg-volt px-3 py-1 text-sm font-extrabold">Save {pct(p)}%</span></>}</div>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{copy.blurb}</p>
          <div className="mt-6"><p className="mb-2 text-sm font-semibold">Colour: <span className="capitalize text-slate-500">{color}</span></p><Swatches colors={p.colors} value={color} onChange={setColor} size={32} /></div>
          <div className="mt-5"><p className="mb-2 text-sm font-semibold">Size: <span className="text-slate-500">{size}</span></p><div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">{p.sizes.map((s) => <button key={s} role="radio" aria-checked={size === s} onClick={() => setSize(s)} className={`min-w-[48px] rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${size === s ? 'border-onyx bg-onyx text-white' : 'border-slate-300 hover:border-onyx'}`}>{s}</button>)}</div></div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-slate-300"><button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="grid h-12 w-12 place-items-center rounded-full hover:bg-slate-100"><Minus size={16} /></button><span className="w-8 text-center font-bold">{qty}</span><button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity" className="grid h-12 w-12 place-items-center rounded-full hover:bg-slate-100"><Plus size={16} /></button></div>
            <Btn className="min-w-[200px] flex-1" onClick={() => add(p, { color, size, qty, open: true })}><ShoppingBag size={20} /> Add to cart · {money(minor(p) * qty)}</Btn>
            <button onClick={() => toggleWish(p)} aria-pressed={wish.has(p.id)} aria-label="Toggle wishlist" className="grid h-14 w-14 place-items-center rounded-full border-2 border-slate-300 hover:border-onyx"><Heart className={wish.has(p.id) ? 'fill-red-500 text-red-500' : ''} /></button>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3 text-sm font-semibold">{[[ShieldCheck, 'Authentic gear'], [RotateCcw, '30-day free returns'], [Truck, 'Ships in 24 hours']].map(([I, t]) => <li key={t} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3"><I size={18} />{t}</li>)}</ul>
          <Ad id="ship" size="native" className="mt-6" />
          {copy.specs.length > 0 && <dl className="mt-8 divide-y divide-slate-100 rounded-2xl ring-1 ring-slate-200">{copy.specs.map(([k, v]) => <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm"><dt className="text-slate-500">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>}
        </div>
      </div>
      <section className="mt-20"><SectionHead eyebrow="Reviews" title="What athletes say" /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-stagger>{REVIEWS.slice(0, 5).map((r, i) => <figure key={i} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200"><Stars value={r.rating} /><p className="mt-2 font-display text-xl font-bold uppercase italic">{r.title}</p><blockquote className="mt-1 text-sm text-slate-600">{r.body}</blockquote><figcaption className="mt-3 text-xs font-bold">{r.name} <span className="font-normal text-slate-500">· {r.date}</span></figcaption></figure>)}</div></section>
      <section className="mt-16 max-w-3xl"><SectionHead eyebrow="Good to know" title="FAQ" />{FAQ.map(([q, a], i) => <div key={q} className="border-b border-slate-200"><button onClick={() => setFaq(faq === i ? -1 : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between py-4 text-left font-semibold">{q}<ChevronDown className={`transition ${faq === i ? 'rotate-180' : ''}`} /></button><AnimatePresence initial={false}>{faq === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-4 text-slate-600">{a}</motion.p>}</AnimatePresence></div>)}</section>
      <div className="mt-16"><Ad id="team" size="billboard" /></div>
      {related.length > 0 && <section className="mt-20"><SectionHead eyebrow="Pairs well" title="You may also like" /><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}</div></section>}
    </div>
  );
}

export function Wishlist() {
  const { products, wish, navigate, goShop } = useStore();
  const list = products.filter((p) => wish.has(p.id));
  return <div><PageHead eyebrow="Saved for later" title="Wishlist" /><div className="mx-auto max-w-7xl px-4 py-12">{list.length === 0 ? <div className="py-16 text-center"><Heart size={48} className="mx-auto text-slate-300" /><p className="mt-3 font-display text-3xl font-extrabold uppercase italic">Nothing saved yet</p><p className="text-slate-500">Tap the heart on any product.</p><Btn className="mt-5" onClick={() => goShop({})}>Browse gear</Btn></div> : <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"><AnimatePresence>{list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</AnimatePresence></div>}</div></div>;
}

export function Checkout() {
  const { cart, money, subtotal, discount, shipping, total, shipMode, setShipMode, navigate, clear, setOrder, goShop, region } = useStore();
  const [f, setF] = useState({ name: '', email: '', address: '', city: '', zip: '' }); const [pay, setPay] = useState('card'); const [err, setErr] = useState({}); const [busy, setBusy] = useState(false);
  if (!cart.length) return <div className="mx-auto max-w-xl px-4 py-32 text-center"><p className="font-display text-5xl font-extrabold uppercase italic">Cart is empty</p><Btn className="mt-6" onClick={() => goShop({})}>Shop gear</Btn></div>;
  const submit = (e) => {
    e.preventDefault(); const er = {};
    if (!f.name.trim()) er.name = 'Enter your name'; if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'; if (!f.address.trim()) er.address = 'Enter your address'; if (!f.city.trim()) er.city = 'Enter your city'; if (!f.zip.trim()) er.zip = 'Enter a postcode';
    setErr(er); if (Object.keys(er).length) return;
    setBusy(true);
    setTimeout(() => { setOrder({ id: 'ETS-' + Math.floor(100000 + Math.random() * 900000), lines: cart, total: money(total), name: f.name, email: f.email, ship: shipMode, pay }); clear(); setBusy(false); navigate('/order'); }, 1100);
  };
  const Field = ({ k, label, type = 'text', span = '' }) => <div className={span}><label htmlFor={`f-${k}`} className="mb-1 block text-sm font-semibold">{label}</label><input id={`f-${k}`} type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-volt ${err[k] ? 'border-red-500' : 'border-slate-300'}`} />{err[k] && <p className="mt-1 text-xs text-red-700" role="alert">{err[k]}</p>}</div>;
  return (
    <div><PageHead eyebrow="Secure checkout" title="Checkout" />
      <form onSubmit={submit} noValidate className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-8">
          <p className="rounded-xl bg-volt/30 p-4 text-sm font-semibold">Demo checkout: no payment is taken. Please do not enter real card details.</p>
          <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="mb-3 font-display text-2xl font-extrabold uppercase italic">Delivery</legend><Field k="name" label="Full name" span="sm:col-span-2" /><Field k="email" label="Email" type="email" span="sm:col-span-2" /><Field k="address" label="Address" span="sm:col-span-2" /><Field k="city" label="City" /><Field k="zip" label="Postcode" /></fieldset>
          <fieldset><legend className="mb-3 font-display text-2xl font-extrabold uppercase italic">Shipping</legend><div className="grid gap-3 sm:grid-cols-2">{[['standard', 'Standard · 3-5 days', shipping === 0 && shipMode === 'standard' ? 'Free' : money(899)], ['express', 'Express · 1-2 days', money(1499)]].map(([k, l, pr]) => <label key={k} className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 ${shipMode === k ? 'border-onyx bg-slate-50' : 'border-slate-200'}`}><span className="flex items-center gap-3"><input type="radio" name="ship" checked={shipMode === k} onChange={() => setShipMode(k)} className="accent-onyx" /><span className="font-semibold">{l}</span></span><span className="font-bold">{pr}</span></label>)}</div></fieldset>
          <fieldset><legend className="mb-3 font-display text-2xl font-extrabold uppercase italic">Payment</legend><div className="grid gap-3 sm:grid-cols-3">{[['card', 'Card'], ['paypal', 'PayPal'], ['cod', 'Cash on delivery']].map(([k, l]) => <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 font-semibold ${pay === k ? 'border-onyx bg-slate-50' : 'border-slate-200'}`}><input type="radio" name="pay" checked={pay === k} onChange={() => setPay(k)} className="accent-onyx" />{l}</label>)}</div></fieldset>
        </div>
        <aside className="h-fit rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-extrabold uppercase italic">Order summary</h2>
          <ul className="mt-4 space-y-3">{cart.map((l) => <li key={l.key} className="flex items-center gap-3"><span className="h-14 w-14 flex-none rounded-lg bg-white p-1"><ProductImage p={l.p} color={l.color} /></span><span className="min-w-0 flex-1 text-sm"><b className="block truncate">{l.p.name}</b><span className="text-slate-500">{l.color} · {l.size} × {l.qty}</span></span><span className="text-sm font-bold">{money(l.qty * minor(l.p))}</span></li>)}</ul>
          <dl className="mt-5 space-y-1.5 border-t border-slate-200 pt-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>{discount > 0 && <div className="flex justify-between text-green-700"><dt>Discount</dt><dd>-{money(discount)}</dd></div>}<div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : money(shipping)}</dd></div><div className="flex justify-between border-t border-slate-200 pt-3 text-xl font-extrabold"><dt>Total</dt><dd>{money(total)}</dd></div></dl>
          <Btn variant="volt" className="mt-5 w-full !py-4" disabled={busy}>{busy ? 'Placing order…' : <><Lock size={18} /> Place order</>}</Btn>
        </aside>
      </form>
    </div>
  );
}

export function OrderDone() {
  const { order, navigate, goShop } = useStore(); const ref = useRef(null);
  useEffect(() => { if (reduced() || !ref.current) return; const ctx = gsap.context(() => { gsap.from('.pop', { scale: 0, rotate: -40, duration: 0.8, ease: 'back.out(2)' }); gsap.from('.confetti i', { y: -40, x: () => gsap.utils.random(-120, 120), opacity: 0, rotate: () => gsap.utils.random(-360, 360), duration: 1.4, stagger: 0.03, ease: 'power3.out' }); }, ref); return () => ctx.revert(); }, []);
  if (!order) return <div className="mx-auto max-w-xl px-4 py-32 text-center"><p className="font-display text-5xl font-extrabold uppercase italic">No recent order</p><Btn className="mt-6" onClick={() => goShop({})}>Shop gear</Btn></div>;
  return <div ref={ref} className="relative mx-auto max-w-2xl px-4 py-24 text-center"><div className="confetti pointer-events-none absolute inset-x-0 top-20 flex justify-center gap-2" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} className="block h-3 w-1.5" style={{ background: ['#D4FF00', '#2563EB', '#EC4899', '#F97316', '#06B6D4'][i % 5] }} />)}</div><div className="pop mx-auto grid h-24 w-24 place-items-center rounded-full bg-volt text-onyx"><Check size={48} /></div><h1 className="mt-6 font-display text-6xl font-extrabold uppercase italic leading-none">Order placed</h1><p className="mt-3 text-slate-600">Thanks {order.name.split(' ')[0]}. Your demo order <b>{order.id}</b> for {order.total} is confirmed. A receipt would go to {order.email}.</p><Btn className="mt-8" onClick={() => goShop({})}>Keep shopping <ArrowRight size={18} /></Btn></div>;
}

export function About() {
  const root = useRef(null); const { goShop, ready } = useStore(); useFx(root, [ready]);
  return <div ref={root}><PageHead eyebrow="Our story" title="About eTotalSports" /><div className="mx-auto max-w-7xl px-4 py-16"><div className="grid items-center gap-12 md:grid-cols-2"><div data-reveal="left"><h2 className="font-display text-5xl font-extrabold uppercase italic leading-[.9]">Built for people who move.</h2><p className="mt-4 text-lg text-slate-600">eTotalSports is a performance sports store covering football, cricket, tennis, basketball, running and the gym. We sell authentic gear and back it with fast delivery and 30-day free returns.</p><p className="mt-3 text-slate-600">The storefront is headless: a fast React front end talking to WooCommerce for products, carts and orders.</p></div><div data-reveal="right" className="rounded-3xl bg-onyx p-12"><Logo tone="dark" height={80} /></div></div>
    <div className="mt-20 grid gap-5 md:grid-cols-3" data-stagger>{[['Authentic', 'Every item comes from the brand or an authorised distributor.'], ['Fast', 'Orders ship within 24 hours on working days.'], ['Fair', 'Free 30-day returns, no awkward questions.']].map(([t, d]) => <div key={t} className="rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-200"><p className="font-display text-4xl font-extrabold uppercase italic">{t}</p><p className="mt-2 text-slate-600">{d}</p></div>)}</div>
    <div className="mt-16 text-center" data-reveal><Btn onClick={() => goShop({})}>Shop the range <ArrowRight size={18} /></Btn></div></div></div>;
}

export function Contact() {
  const { toast } = useStore(); const [f, setF] = useState({ name: '', email: '', msg: '' }); const [sent, setSent] = useState(false); const [e, setE] = useState({});
  const submit = (ev) => { ev.preventDefault(); const er = {}; if (!f.name.trim()) er.name = 'Enter your name'; if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'; if (f.msg.trim().length < 5) er.msg = 'Write a short message'; setE(er); if (Object.keys(er).length) return; setSent(true); toast('Message sent (demo)'); };
  return <div><PageHead eyebrow="Talk to us" title="Contact" /><div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-[1fr_18rem]">{sent ? <div className="rounded-2xl bg-volt/30 p-10 text-center"><Check className="mx-auto" size={40} /><p className="mt-2 font-display text-3xl font-extrabold uppercase italic">Message sent</p><p className="text-slate-600">This is a demo form, so nothing was delivered.</p></div> : <form onSubmit={submit} noValidate className="space-y-4">{[['name', 'Name', 'text'], ['email', 'Email', 'email']].map(([k, l, t]) => <div key={k}><label htmlFor={`c-${k}`} className="mb-1 block text-sm font-semibold">{l}</label><input id={`c-${k}`} type={t} value={f[k]} onChange={(x) => setF({ ...f, [k]: x.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-volt" />{e[k] && <p className="mt-1 text-xs text-red-700" role="alert">{e[k]}</p>}</div>)}<div><label htmlFor="c-msg" className="mb-1 block text-sm font-semibold">Message</label><textarea id="c-msg" rows={5} value={f.msg} onChange={(x) => setF({ ...f, msg: x.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-volt" />{e.msg && <p className="mt-1 text-xs text-red-700" role="alert">{e.msg}</p>}</div><Btn><Send size={18} /> Send message</Btn></form>}<aside className="space-y-4 text-sm"><a href="mailto:support@etotalsports.com" className="flex items-start gap-3 text-slate-800 hover:text-onyx font-medium"><Mail size={18} className="mt-0.5 text-slate-500" /> support@etotalsports.com</a><a href="https://wa.me/8801811377577" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-emerald-700 hover:text-emerald-800 font-bold"><MessageCircle size={18} className="mt-0.5 text-emerald-600" /> WhatsApp: +880 1811-377577</a><a href="tel:+8801811377577" className="flex items-start gap-3 text-slate-700 hover:text-onyx"><Phone size={18} className="mt-0.5 text-slate-500" /> Phone: +880 1811-377577</a><p className="flex items-start gap-3 text-slate-600"><Truck size={18} className="mt-0.5 text-slate-500" /> Delivery questions answered within 24 hours</p><p className="flex items-start gap-3 text-slate-600"><RotateCcw size={18} className="mt-0.5 text-slate-500" /> Returns: contact us within 30 days</p></aside></div></div>;
}
