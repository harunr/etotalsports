import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Megaphone } from 'lucide-react';
import { useStore } from './store.jsx';
import { ProductArt } from './ProductArt.jsx';

// House ads. Swap any <Ad> for your ad network tag (AdSense, GAM) by replacing the body of the slot.
const ADS = {
  shoes: { bg: 'linear-gradient(110deg,#D4FF00,#A3E635)', ink: '#0F172A', k: 'New drop', t: 'Velocity Pro. Run faster.', s: 'From ৳15,738 · 5 colours', cta: 'Shop running', art: 'shoe', c: 'pink', go: { cat: 'running' } },
  sale: { bg: 'linear-gradient(110deg,#EF4444,#F97316)', ink: '#fff', k: 'Limited time', t: 'Up to 25% off kit', s: 'Use code VOLT10 at checkout', cta: 'Shop sale', art: 'shirt', c: 'yellow', go: { sale: true } },
  team: { bg: 'linear-gradient(110deg,#2563EB,#7C3AED)', ink: '#fff', k: 'Team sports', t: 'Match balls for match day', s: 'Football · Basketball · Cricket', cta: 'Shop team gear', art: 'football', c: 'white', go: { cat: 'team-sports' } },
  gym: { bg: 'linear-gradient(110deg,#0D9488,#06B6D4)', ink: '#fff', k: 'Home gym', t: 'Build your iron corner', s: 'Dumbbells, bottles, trainers', cta: 'Shop training', art: 'dumbbell', c: 'onyx', go: { cat: 'training' } },
  ship: { bg: 'linear-gradient(110deg,#0F172A,#1E293B)', ink: '#fff', k: 'Free shipping', t: 'Over ৳12,200. 30-day free returns.', s: 'Authentic gear, shipped in 24 hours', cta: 'Start shopping', art: 'bag', c: 'volt', go: {} },
  racket: { bg: 'linear-gradient(110deg,#EC4899,#F97316)', ink: '#fff', k: 'Tennis', t: 'Spin it to win it', s: 'Carbon rackets from ৳23,058', cta: 'Shop tennis', art: 'racket', c: 'blue', go: { sport: 'tennis' } },
};

const SIZES = {
  leaderboard: 'min-h-[110px] sm:min-h-[96px] flex-row',
  billboard: 'min-h-[220px] flex-row',
  rect: 'min-h-[250px] flex-col',
  skyscraper: 'min-h-[420px] flex-col',
  native: 'min-h-[180px] flex-col',
};

export function Ad({ id = 'shoes', size = 'leaderboard', className = '', i = 0 }) {
  const { goShop } = useStore();
  const a = ADS[id]; const vertical = size === 'rect' || size === 'skyscraper' || size === 'native';
  return (
    <motion.aside initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: i * 0.06 }} aria-label="Advertisement" className={`relative ${className}`}>
      <button onClick={() => goShop(a.go)} data-cursor-text="SHOP" className={`group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl p-5 text-left sm:p-6 ${SIZES[size]}`} style={{ background: a.bg, color: a.ink }}>
        <span className="pointer-events-none absolute -right-8 top-0 h-full w-1/4 skew-x-[-14deg] bg-white/10" />
        <span className={`relative z-10 ${vertical ? 'w-full' : 'min-w-0 flex-1'}`}>
          <span className="font-display text-xs font-bold uppercase tracking-[.25em] opacity-80">{a.k}</span>
          <span className={`mt-1 block font-display font-extrabold uppercase italic leading-[.9] ${size === 'billboard' ? 'text-5xl sm:text-6xl' : size === 'leaderboard' ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-4xl'}`}>{a.t}</span>
          <span className="mt-1 block text-sm opacity-90">{a.s}</span>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2 font-display text-sm font-extrabold uppercase italic tracking-wide transition group-hover:scale-105" style={a.ink === '#0F172A' ? { background: '#0F172A', color: '#fff' } : { background: '#D4FF00', color: '#0F172A' }}>{a.cta} <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
        </span>
        <span className={`relative z-10 flex-none transition duration-500 group-hover:scale-110 group-hover:-rotate-6 ${size === 'skyscraper' ? 'mx-auto h-44 w-44' : size === 'billboard' ? 'h-44 w-56' : vertical ? 'mx-auto h-28 w-36' : 'h-20 w-28 sm:h-24 sm:w-36'}`}><ProductArt type={a.art} color={a.c} className="h-full w-full drop-shadow-xl" /></span>
        <span className="absolute right-3 top-2 z-20 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">Ad</span>
      </button>
    </motion.aside>
  );
}

/** Empty slot for a third-party ad network tag. Labelled so layouts can be checked before the tag is pasted in. */
export function AdSlot({ size = 'rect', label, className = '' }) {
  const dims = { leaderboard: '728 × 90', billboard: '970 × 250', rect: '300 × 250', skyscraper: '300 × 600', native: 'Native' }[size];
  return (
    <aside aria-label="Advertisement" className={`grid place-items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center text-slate-500 ${size === 'leaderboard' ? 'min-h-[90px]' : size === 'skyscraper' ? 'min-h-[420px]' : size === 'billboard' ? 'min-h-[200px]' : 'min-h-[250px]'} ${className}`}>
      <div className="p-4"><Megaphone size={22} className="mx-auto" /><p className="mt-1 font-display text-sm font-bold uppercase tracking-[.2em]">Advertisement</p><p className="text-xs">{label || 'Ad network slot'} · {dims}</p></div>
    </aside>
  );
}

export function SponsoredStrip() {
  const { products, navigate, money } = useStore();
  const { minor } = { minor: (p) => parseInt(p.prices.price, 10) };
  const picks = products.slice(0, 4);
  return (
    <section aria-label="Sponsored products" className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <p className="mb-3 flex items-center justify-between font-display text-xs font-bold uppercase tracking-[.25em] text-slate-500"><span>Sponsored picks</span><span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] tracking-wider">Ad</span></p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{picks.map((p) => <button key={p.id} onClick={() => navigate(`/product/${p.slug}`)} className="group rounded-xl bg-white p-3 text-left ring-1 ring-slate-200 transition hover:shadow-lg"><div className="aspect-[5/4]"><ProductArt type={p.art} color={p.colors[0]} className="h-full w-full transition group-hover:scale-110" /></div><p className="mt-1 truncate text-sm font-semibold">{p.name}</p><p className="text-sm font-bold">{money(minor(p))}</p></button>)}</div>
    </section>
  );
}
