import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, Heart, Eye, ShoppingBag, Check, X, ArrowRight } from 'lucide-react';
import { useStore, minor, regular, onSale, pct } from './store.jsx';
import { COLOR_HEX } from './data.js';
import { ProductImage } from './ProductArt.jsx';

export function Stars({ value, count, size = 13 }) {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500" aria-label={`${value} out of 5 stars`}>
      <div className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-onyx text-onyx' : 'text-slate-300'} />)}</div>
      <span className="font-semibold text-onyx">{Number(value).toFixed(1)}</span>
      {count != null && <span>({count})</span>}
    </div>
  );
}

export function Swatches({ colors, value, onChange, size = 18 }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Colour">
      {colors.map((c) => (
        <motion.button key={c} type="button" role="radio" aria-checked={value === c} aria-label={c} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); onChange(c); }}
          className={`rounded-full border ${value === c ? 'ring-2 ring-offset-2 ring-onyx border-transparent' : 'border-slate-300'}`} style={{ width: size, height: size, background: COLOR_HEX[c] }} />
      ))}
    </div>
  );
}

export function Btn({ children, variant = 'dark', className = '', as: Tag = 'button', ...rest }) {
  const v = { dark: 'bg-onyx text-white hover:bg-carbon', volt: 'bg-volt text-onyx hover:bg-white', ghost: 'border-2 border-onyx/20 text-onyx hover:border-onyx', light: 'bg-white text-onyx hover:bg-volt', outline: 'border-2 border-white/40 text-white hover:border-volt hover:text-volt' }[variant];
  return <Tag {...rest} className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-lg font-extrabold uppercase italic tracking-wide transition active:scale-95 ${v} ${className}`}>{children}</Tag>;
}

export function SectionHead({ eyebrow, title, right, dark = false }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div data-reveal>
        <p className={`font-display text-xs font-bold uppercase tracking-[.25em] ${dark ? 'text-volt' : 'text-slate-500'}`}>{eyebrow}</p>
        <h2 className={`font-display text-5xl font-extrabold uppercase italic leading-[.9] sm:text-6xl ${dark ? 'text-white' : ''}`}>{title}</h2>
      </div>
      {right}
    </div>
  );
}

export function ProductCard({ p, index = 0 }) {
  const { money, wish, toggleWish, add, setQuick, navigate } = useStore();
  const [color, setColor] = useState(p.colors[0]);
  const [added, setAdded] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 18 });
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); };
  const liked = wish.has(p.id);
  const tint = `${COLOR_HEX[color]}22`;
  return (
    <motion.article layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ type: 'spring', stiffness: 260, damping: 28, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -6 }} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition-shadow duration-300 hover:shadow-2xl">
      <div className="relative overflow-hidden" style={{ background: `radial-gradient(120% 90% at 50% 100%, ${tint}, transparent 60%), linear-gradient(135deg,#F8FAFC,#E2E8F0)`, perspective: 700 }} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          <span className="rounded-full bg-onyx px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-white">{p.categories[0].name}</span>
          {onSale(p) && <span className="rounded-full bg-volt px-2.5 py-1 font-display text-[11px] font-extrabold uppercase tracking-widest text-onyx">-{pct(p)}%</span>}
          {p.badge && !p.badge.startsWith('-') && <span className="rounded-full bg-laser px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-white">{p.badge}</span>}
        </div>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleWish(p)} aria-pressed={liked} aria-label={liked ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow">
          <AnimatePresence mode="wait"><motion.span key={String(liked)} initial={{ scale: 0.3, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}><Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-onyx'} /></motion.span></AnimatePresence>
        </motion.button>
        <button onClick={() => navigate(`/product/${p.slug}`)} data-cursor-text="VIEW" className="block aspect-[5/4] w-full px-8 pb-6 pt-12" aria-label={`View ${p.name}`}>
          <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="h-full w-full"><ProductImage p={p} color={color} className="h-full w-full transition duration-500 group-hover:scale-110" /></motion.div>
        </button>
        <button onClick={() => setQuick(p)} className="absolute inset-x-3 bottom-3 flex translate-y-4 items-center justify-center gap-1.5 rounded-full bg-white/95 py-2 text-sm font-semibold opacity-0 shadow transition group-hover:translate-y-0 group-hover:opacity-100"><Eye size={16} /> Quick view</button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Stars value={p.average_rating} count={p.review_count} />
        <h3 className="mt-1.5 font-display text-xl font-bold uppercase italic leading-tight">{p.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold">{money(minor(p))}</span>
          {onSale(p) && <><span className="text-sm text-slate-400 line-through">{money(regular(p))}</span><span className="text-xs font-bold text-red-700">Save {money(regular(p) - minor(p))}</span></>}
        </div>
        <div className="mt-3"><Swatches colors={p.colors} value={color} onChange={setColor} /></div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { add(p, { color }); setAdded(true); setTimeout(() => setAdded(false), 1300); }}
          className={`mt-4 flex items-center justify-center gap-2 rounded-full py-3 font-display text-base font-extrabold uppercase italic tracking-wide transition-colors ${added ? 'bg-volt text-onyx' : 'bg-onyx text-white hover:bg-carbon'}`}>
          <AnimatePresence mode="wait" initial={false}>
            {added ? <motion.span key="a" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="flex items-center gap-2"><Check size={18} /> Added</motion.span>
              : <motion.span key="b" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} className="flex items-center gap-2"><ShoppingBag size={18} /> Add to cart</motion.span>}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.article>
  );
}

export function Modal({ open, onClose, children, label, wide = 'max-w-3xl' }) {
  useEffect(() => {
    if (!open) return undefined;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={label}>
          <div className="absolute inset-0 bg-onyx/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.92, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }} className={`relative max-h-[94vh] w-full overflow-auto rounded-2xl bg-white shadow-2xl ${wide}`}>{children}</motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Drawer({ open, onClose, side = 'right', children, label, width = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, onClose]);
  const from = side === 'right' ? '100%' : '-100%';
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90]" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} role="dialog" aria-modal="true" aria-label={label}>
          <motion.div className="absolute inset-0 bg-onyx/70 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div initial={{ x: from }} animate={{ x: 0 }} exit={{ x: from }} transition={{ type: 'spring', stiffness: 340, damping: 38 }} className={`absolute top-0 flex h-full w-[92%] flex-col bg-white shadow-2xl ${width} ${side === 'right' ? 'right-0' : 'left-0'}`}>{children}</motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[150] flex flex-col items-center gap-2 px-4" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} layout initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="flex items-center gap-2 rounded-full bg-onyx px-5 py-3 text-sm font-semibold text-white shadow-2xl ring-1 ring-volt/60">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-volt text-onyx"><Check size={13} /></span>{t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { X, ArrowRight };
