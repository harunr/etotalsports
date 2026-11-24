import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trash2, Minus, Plus, Tag, Check, Lock, Truck, Compass, Search } from 'lucide-react';
import { useStore, minor, regular, onSale } from './store.jsx';
import { PageHead } from './Pages2.jsx';
import { Ad, AdSlot } from './Ads.jsx';
import { Btn, ProductCard } from './ui.jsx';
import { ProductImage, ProductArt } from './ProductArt.jsx';
import { COLOR_HEX, PROMOS } from './data.js';

export function CartPage() {
  const { cart, money, subtotal, discount, shipping, total, meter, freeShip, after, setQty, remove, promo, setPromo, applyPromo, navigate, goShop, products, FREE_SHIPPING_MINOR } = useStore();
  const [code, setCode] = React.useState(''); const [err, setErr] = React.useState('');
  const more = products.filter((p) => !cart.some((l) => l.id === p.id)).slice(0, 4);
  return (
    <div><PageHead eyebrow="Review your gear" title="Your cart" />
      <div className="mx-auto max-w-7xl px-4 py-10">
        {cart.length === 0 ? (
          <div className="py-16 text-center"><div className="mx-auto w-fit"><ProductArt type="bag" color="volt" className="h-40 w-40" /></div><p className="mt-4 font-display text-4xl font-extrabold uppercase italic">Your cart is empty</p><p className="text-slate-500">Gear up and add something fast.</p><Btn className="mt-6" onClick={() => goShop({})}>Start shopping <ArrowRight size={18} /></Btn></div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
            <div>
              <div className="mb-5 rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold">{freeShip ? <span className="inline-flex items-center gap-1.5"><Check size={16} /> Free shipping unlocked</span> : <>Add <b>{money(FREE_SHIPPING_MINOR - after)}</b> for free shipping</>}</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><motion.div className="h-full rounded-full bg-onyx" animate={{ width: `${meter}%` }} /></div></div>
              <ul className="divide-y divide-slate-200">
                <AnimatePresence initial={false}>{cart.map((l) => (
                  <motion.li key={l.key} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60 }} className="flex gap-4 py-5">
                    <button onClick={() => navigate(`/product/${l.p.slug}`)} className="h-28 w-28 flex-none rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-2 sm:h-36 sm:w-36" aria-label={`View ${l.p.name}`}><ProductImage p={l.p} color={l.color} /></button>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-2xl font-extrabold uppercase italic leading-tight">{l.p.name}</h3><p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><span className="h-3.5 w-3.5 rounded-full border border-slate-300" style={{ background: COLOR_HEX[l.color] }} />{l.color} · {l.size}</p></div><button onClick={() => remove(l.key)} aria-label={`Remove ${l.p.name}`} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-700"><Trash2 size={18} /></button></div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border border-slate-300"><button onClick={() => setQty(l.key, -1)} aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"><Minus size={16} /></button><span className="w-8 text-center font-bold">{l.qty}</span><button onClick={() => setQty(l.key, 1)} aria-label="Increase quantity" className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"><Plus size={16} /></button></div>
                        <div className="text-right"><p className="text-lg font-bold">{money(l.qty * minor(l.p))}</p>{onSale(l.p) && <p className="text-xs text-slate-400 line-through">{money(l.qty * regular(l.p))}</p>}</div>
                      </div>
                    </div>
                  </motion.li>))}</AnimatePresence>
              </ul>
              <button onClick={() => goShop({})} className="mt-4 text-sm font-semibold underline">Continue shopping</button>
            </div>
            <aside className="h-fit rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 lg:sticky lg:top-24">
              <h2 className="font-display text-2xl font-extrabold uppercase italic">Summary</h2>
              <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (applyPromo(code)) { setCode(''); setErr(''); } else setErr('That code is not valid. Try VOLT10.'); }}>
                <label htmlFor="cp-promo" className="sr-only">Promo code</label>
                <div className="flex flex-1 items-center rounded-full border border-slate-300 bg-white px-3 focus-within:ring-2 focus-within:ring-volt"><Tag size={16} className="text-slate-500" /><input id="cp-promo" value={code} onChange={(e) => { setCode(e.target.value); setErr(''); }} placeholder="Promo code" className="w-full bg-transparent px-2 py-2.5 text-sm uppercase outline-none" /></div>
                <button className="rounded-full bg-onyx px-5 font-display font-bold uppercase text-white hover:bg-carbon">Apply</button>
              </form>
              {err && <p className="mt-1.5 text-xs text-red-700" role="alert">{err}</p>}
              {promo && <p className="mt-2 flex items-center justify-between text-xs"><span className="inline-flex items-center gap-1 rounded-full bg-volt px-2.5 py-1 font-bold"><Check size={12} /> {promo} · {PROMOS[promo] * 100}% off</span><button onClick={() => setPromo(null)} className="underline">Remove</button></p>}
              <dl className="mt-5 space-y-1.5 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd className="font-semibold">{money(subtotal)}</dd></div>{discount > 0 && <div className="flex justify-between text-green-700"><dt>Discount</dt><dd>-{money(discount)}</dd></div>}<div className="flex justify-between"><dt>Shipping</dt><dd className="font-semibold">{shipping === 0 ? 'Free' : money(shipping)}</dd></div><div className="flex items-baseline justify-between border-t border-slate-200 pt-3"><dt className="font-display text-xl font-extrabold uppercase italic">Total</dt><dd className="text-2xl font-extrabold">{money(total)}</dd></div></dl>
              <Ad id="sale" size="native" className="mt-5" />
              <Btn variant="volt" className="mt-5 w-full !py-4" onClick={() => navigate('/checkout')}><Lock size={18} /> Checkout <ArrowRight size={18} /></Btn>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500"><Truck size={14} /> 30-day free returns</p>
            </aside>
          </div>
        )}
        {more.length > 0 && <section className="mt-20"><h2 className="mb-6 font-display text-4xl font-extrabold uppercase italic">Complete the kit</h2><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{more.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</div></section>}
      </div>
    </div>
  );
}

function Legal({ eyebrow, title, updated, sections }) {
  const [active, setActive] = React.useState(0);
  return (
    <div><PageHead eyebrow={eyebrow} title={title}><p className="mt-3 text-sm text-slate-400">Last updated {updated}</p></PageHead>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="On this page" className="hidden lg:block"><ul className="sticky top-24 space-y-1 border-l-2 border-slate-200">{sections.map(([h], i) => <li key={h}><a href={`#${eyebrow.toLowerCase()}`} onClick={(e) => { e.preventDefault(); setActive(i); const el = document.getElementById(`${eyebrow}-${i}`); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' }); }} className={`-ml-0.5 block border-l-2 py-1.5 pl-4 text-sm font-semibold transition ${active === i ? 'border-onyx text-onyx' : 'border-transparent text-slate-500 hover:text-onyx'}`}>{h}</a></li>)}</ul></nav>
        <article className="space-y-10">
          <p className="rounded-xl bg-volt/30 p-4 text-sm font-semibold">This is sample policy text for the eTotalSports demo storefront. Replace it with text reviewed by your legal adviser before launch.</p>
          {sections.map(([h, body], i) => <section key={h} id={`${eyebrow}-${i}`}><h2 className="font-display text-3xl font-extrabold uppercase italic"><span className="mr-2 text-volt" style={{ WebkitTextStroke: '1px #0F172A' }}>{String(i + 1).padStart(2, '0')}</span>{h}</h2><p className="mt-3 leading-relaxed text-slate-600">{body}</p></section>)}
        </article>
      </div>
    </div>
  );
}

export const Terms = () => <Legal eyebrow="Terms" title="Terms & conditions" updated="24 November 2026" sections={[
  ['Using this site', 'By browsing or buying from eTotalSports you agree to these terms. You must be at least 18, or have a parent or guardian place the order for you.'],
  ['Products and pricing', 'We describe and photograph products as accurately as we can. Prices are shown in your selected currency and may change before an order is confirmed. If we spot a pricing error we may cancel the order and refund you in full.'],
  ['Orders and payment', 'An order is accepted when we send a shipping confirmation. We accept the payment methods shown at checkout. Cash on delivery is available in selected regions.'],
  ['Shipping', 'Standard delivery takes 3 to 5 working days and Express takes 1 to 2. Orders over ৳12,200 ship free on Standard. Delivery times are estimates, not guarantees.'],
  ['Returns and refunds', 'You can return unused items in original packaging within 30 days for a refund to your original payment method. We provide a prepaid label. Items damaged by misuse cannot be refunded.'],
  ['Promo codes', 'One promo code may be used per order. Codes cannot be combined and have no cash value. We may withdraw a code at any time.'],
  ['Liability', 'Sports equipment carries inherent risk. Use gear as intended and follow the manufacturer instructions. Nothing here limits rights you have under consumer law.'],
  ['Contact', 'Questions about these terms? Write to support@etotalsports.com.'],
]} />;

export const Privacy = () => <Legal eyebrow="Privacy" title="Privacy policy" updated="24 November 2026" sections={[
  ['What we collect', 'Details you give us at checkout or in forms (name, email, delivery address), order history, and basic usage data such as pages viewed and device type.'],
  ['How we use it', 'To process and deliver orders, answer your questions, prevent fraud, improve the store, and, only if you opt in, send offers by email.'],
  ['Sharing', 'We share data only with services needed to run the store, such as payment processors and delivery partners. We do not sell your personal data.'],
  ['Cookies and storage', 'We use essential storage for your cart, wishlist and region choice. Analytics or marketing cookies are used only with your consent.'],
  ['Your rights', 'You can ask to see, correct, export or delete your data, and unsubscribe from marketing at any time using the link in any email.'],
  ['Security and retention', 'Payments are handled by certified processors and we never store full card numbers. We keep order records only as long as the law or our business needs require.'],
  ['Contact', 'Privacy questions or requests: support@etotalsports.com.'],
]} />;

export function NotFound() {
  const { navigate, goShop, products, setSearchOpen } = useStore();
  return (
    <div className="relative overflow-hidden bg-onyx text-white"><div className="absolute -right-20 top-0 h-full w-1/2 skew-x-[-14deg] bg-volt/10" />
      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center">
        <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }} className="font-display text-[10rem] font-extrabold italic leading-none text-volt sm:text-[16rem]">404</motion.p>
        <h1 className="-mt-4 font-display text-5xl font-extrabold uppercase italic sm:text-7xl">Out of bounds</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-300">That page is not on the pitch. Head back to the game or search for what you need.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Btn variant="volt" onClick={() => navigate('/')}><Compass size={18} /> Back home</Btn><Btn variant="outline" onClick={() => setSearchOpen(true)}><Search size={18} /> Search</Btn><Btn variant="outline" onClick={() => goShop({})}>Shop all</Btn></div>
        <div className="mt-14 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">{products.slice(0, 4).map((p) => <button key={p.id} onClick={() => navigate(`/product/${p.slug}`)} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 transition hover:bg-white/10"><div className="aspect-[5/4]"><ProductImage p={p} /></div><p className="mt-2 truncate font-display text-lg font-bold uppercase italic">{p.name}</p></button>)}</div>
      </div>
    </div>
  );
}
