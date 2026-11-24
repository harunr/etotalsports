import React, { useRef, useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, RotateCcw, Truck, Zap, ChevronDown, SlidersHorizontal, X, ExternalLink, Newspaper, CalendarDays, Trophy } from 'lucide-react';
import { useStore, minor, regular } from './store.jsx';
import { gsap, ScrollTrigger, Split, useFx, Marquee, Magnetic, reduced } from './fx.jsx';
import Hero3D from './Hero3D.jsx';
import { ProductArt, ProductImage } from './ProductArt.jsx';
import { ProductCard, Btn, SectionHead } from './ui.jsx';
import { SPORTS, CATEGORY_TABS, COLOR_HEX } from './data.js';
import { NEWS, EVENTS, NEWS_SPORTS, GUIDES } from './news.js';
import { REVIEWS } from './content.js';
import { Ad, AdSlot, SponsoredStrip } from './Ads.jsx';

const SPORT_TINT = { Football: 'bg-green-600', Cricket: 'bg-amber-500', Tennis: 'bg-volt text-onyx', Basketball: 'bg-orange-500' };

export function NewsCard({ n, big = false }) {
  return (
    <a href={n.url} target="_blank" rel="noopener noreferrer" className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl ${big ? 'md:col-span-2' : ''}`}>
      <div className={`flex items-center justify-between px-5 pt-5`}>
        <span className={`rounded-full px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-white ${SPORT_TINT[n.sport] || 'bg-onyx'}`}>{n.sport}</span>
        <span className="text-xs text-slate-500">{n.date}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-display font-extrabold uppercase italic leading-[.95] ${big ? 'text-4xl' : 'text-2xl'}`}>{n.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{n.body}</p>
        <p className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500"><span>Source: {n.source}</span><span className="inline-flex items-center gap-1 text-onyx group-hover:underline">Read story <ExternalLink size={13} /></span></p>
      </div>
    </a>
  );
}

const rise = (i = 0) => ({ initial: { opacity: 0, y: 36 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] } });

export function EventBox({ e, i = 0 }) {
  return (
    <motion.div {...rise(i)} className="flex gap-4 rounded-2xl bg-onyx p-5 text-white ring-1 ring-white/10">
      <div className="grid h-16 w-16 flex-none place-items-center rounded-xl bg-volt text-center font-display font-extrabold uppercase italic leading-none text-onyx"><span className="text-lg">{e.date}</span></div>
      <div className="min-w-0"><p className="font-display text-xl font-extrabold uppercase italic leading-tight">{e.title}</p><p className="mt-1 text-sm text-slate-400">{e.sport} · {e.place}</p><span className="mt-2 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-volt">{e.status}</span></div>
    </motion.div>
  );
}

export function GuideBox({ g, i = 0 }) {
  const { goShop } = useStore();
  return (
    <motion.button {...rise(i)} onClick={() => goShop({ cat: g.cat })} className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left ring-1 ring-slate-200 hover:shadow-xl">
      <div className="relative flex h-32 items-end p-4" style={{ background: g.color }}><span className="rounded-full bg-white px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-onyx">{g.sport} guide</span></div>
      <div className="flex flex-1 flex-col p-5"><h3 className="font-display text-2xl font-extrabold uppercase italic leading-[.95]">{g.title}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{g.body}</p><p className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500"><span>{g.read} read</span><span className="inline-flex items-center gap-1 text-onyx group-hover:underline">Shop the gear <ArrowRight size={13} /></span></p></div>
    </motion.button>
  );
}

function NewsSection() {
  const { navigate } = useStore();
  return (
    <section className="bg-slate-50 py-20"><div className="mx-auto max-w-7xl px-4">
      <SectionHead eyebrow="Locker room" title="Sports news" right={<Btn variant="ghost" onClick={() => navigate('/news')}>All news <ArrowRight size={18} /></Btn>} />
      <div className="grid gap-5 md:grid-cols-3">{NEWS.map((n, i) => <motion.div key={n.id} {...rise(i)} className={`flex ${i === 0 ? 'md:col-span-2' : i === NEWS.length - 1 ? 'md:col-span-3' : ''}`}><NewsCard n={n} big={i === 0} /></motion.div>)}</div>
      <p className="mt-3 text-xs text-slate-500">Headlines are summarised from the linked sources and may have moved on since publication.</p>

      <div className="mb-6 mt-16 flex items-end justify-between"><div><p className="font-display text-xs font-bold uppercase tracking-[.25em] text-slate-500">Mark your calendar</p><h2 className="font-display text-5xl font-extrabold uppercase italic leading-[.9]">Events</h2></div></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{EVENTS.map((e, i) => <EventBox key={e.title} e={e} i={i} />)}</div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_20rem]"><SponsoredStrip /><AdSlot size="rect" label="Home news rectangle" className="!min-h-0" /></div>

      <div className="mb-6 mt-16 flex items-end justify-between"><div><p className="font-display text-xs font-bold uppercase tracking-[.25em] text-slate-500">From our blog</p><h2 className="font-display text-5xl font-extrabold uppercase italic leading-[.9]">Gear guides</h2></div></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{GUIDES.map((g, i) => <GuideBox key={g.id} g={g} i={i} />)}</div>
    </div></section>
  );
}

function useWide() {
  const [w, setW] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(min-width: 768px)').matches);
  useEffect(() => { const m = matchMedia('(min-width: 768px)'); const f = () => setW(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return w;
}

export function Home() {
  const wide = useWide();
  const root = useRef(null); const track = useRef(null); const pin = useRef(null);
  const { ready, products, goShop, navigate, filters } = useStore();
  const [tab, setTab] = useState('all');
  useFx(root, [ready]);
  useLayoutEffect(() => {
    if (!ready) return undefined;
    const ctx = gsap.context(() => {
      if (!reduced()) {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.from('.hero-ch .ch', { yPercent: 115, rotate: 6, duration: 0.9, ease: 'power4.out', stagger: 0.02 })
          .from('.hero-in', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, '-=0.5');
      }
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const dist = () => track.current.scrollWidth - window.innerWidth;
        const tw = gsap.to(track.current, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: pin.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 } });
        gsap.utils.toArray('.h-card').forEach((c) => gsap.from(c.querySelector('.h-art'), { rotate: -12, scale: 0.8, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left 90%', end: 'left 30%', scrub: true } }));
      });
      return () => mm.revert();
    }, root);
    return () => ctx.revert();
  }, [ready]);
  const shown = useMemo(() => products.filter((p) => tab === 'all' || p.categories.some((c) => c.slug === tab)).slice(0, 8), [products, tab]);
  return (
    <div ref={root}>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-onyx text-white">
        {wide && <div className="absolute inset-0"><Hero3D ready={ready} className="h-full w-full" /></div>}
        <div className="grain pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20">
          <p className="hero-in mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-volt px-4 py-1.5 font-display text-sm font-extrabold uppercase italic tracking-wider text-onyx"><Zap size={16} /> Season 26 · New drop live</p>
          <h1 className="hero-ch font-display text-[17vw] font-extrabold uppercase italic leading-[.82] sm:text-[11vw] lg:text-[9rem]"><Split text={'TOTAL\nPERFORMANCE.'} /><span className="block text-volt"><Split text="ZERO LIMITS." /></span></h1>
          <p className="hero-in mt-6 max-w-xl text-lg text-slate-300">Authentic football, basketball, cricket, tennis, running and gym gear. Picked by athletes, shipped fast, returned free for 30 days.</p>
          <div className="hero-in mt-8 flex flex-wrap gap-4"><Magnetic><Btn variant="volt" onClick={() => goShop({})}>Shop the drop <ArrowRight size={20} className="transition group-hover:translate-x-1" /></Btn></Magnetic><Btn variant="outline" onClick={() => document.getElementById('sports') && document.getElementById('sports').scrollIntoView({ behavior: 'smooth' })}>Explore sports</Btn></div>
          <ul className="hero-in mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
            {[[ShieldCheck, '100% authentic gear'], [RotateCcw, '30-day free returns'], [Truck, 'Free shipping over ৳12,200']].map(([I, t]) => <li key={t} className="flex items-center gap-2"><I size={18} className="text-volt" />{t}</li>)}
          </ul>
        </div>
        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-white/60 sm:block"><ChevronDown /></div>
      </section>
      <Marquee items={['FOOTBALL', 'CRICKET', 'TENNIS', 'BASKETBALL', 'RUNNING', 'GYM']} speed={30} className="bg-volt py-3" itemClass="font-display text-3xl font-extrabold uppercase italic text-onyx" />

      <div className="mx-auto max-w-7xl px-4 pt-8"><Ad id="ship" size="leaderboard" /></div>

      {/* PINNED HORIZONTAL SPORTS RAIL */}
      <section id="sports" ref={pin} className="overflow-hidden bg-white py-16 lg:flex lg:h-screen lg:items-center lg:py-0">
        <div ref={track} className="flex gap-6 px-4 lg:w-max lg:items-center lg:px-[8vw]">
          <div className="w-72 flex-none lg:w-[26rem]"><p className="font-display text-xs font-bold uppercase tracking-[.25em] text-slate-500">Pick your game</p><h2 className="font-display text-6xl font-extrabold uppercase italic leading-[.85] lg:text-8xl">Shop by<br />sport</h2><p className="mt-4 text-slate-600">Scroll sideways through every discipline. Each one has its own kit.</p></div>
          {SPORTS.map((s, i) => (
            <button key={s.key} onClick={() => goShop({ sport: s.key })} data-cursor-text="SHOP" className="h-card group relative h-72 w-64 flex-none overflow-hidden rounded-3xl p-5 text-left text-white transition hover:-translate-y-2 lg:h-[26rem] lg:w-[22rem]" style={{ background: ['#0F172A', '#2563EB', '#7C3AED', '#0D9488', '#EA580C', '#DB2777'][i % 6] }}>
              <span className="font-display text-xl font-bold italic opacity-70">0{i + 1}</span>
              <div className="h-art absolute inset-x-6 top-1/4 h-1/2 transition duration-500 group-hover:scale-110"><ProductArt type={s.art} color={s.color} className="h-full w-full" /></div>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between"><span className="font-display text-4xl font-extrabold uppercase italic leading-none lg:text-5xl">{s.label}</span><span className="grid h-11 w-11 place-items-center rounded-full bg-volt text-onyx transition group-hover:rotate-45"><ArrowRight size={20} /></span></div>
            </button>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead eyebrow="Fresh gear" title="Trending now" right={
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-slate-100 p-1" role="tablist">
            {CATEGORY_TABS.map((t) => <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)} className="relative whitespace-nowrap rounded-full px-4 py-2 font-display text-sm font-bold uppercase tracking-wide">{tab === t.key && <motion.span layoutId="home-tab" className="absolute inset-0 rounded-full bg-onyx" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}<span className={`relative ${tab === t.key ? 'text-white' : 'text-slate-600'}`}>{t.label}</span></button>)}
          </div>} />
        <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"><AnimatePresence mode="popLayout">{shown.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</AnimatePresence></motion.div>
        <div className="mt-10 text-center"><Btn onClick={() => goShop({})}>View all products <ArrowRight size={18} /></Btn></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2"><Ad id="sale" size="native" /><Ad id="team" size="native" i={1} /></div>
      </section>

      {/* MANIFESTO scrubbed words */}
      <section className="bg-onyx px-4 py-28 text-white"><div className="mx-auto max-w-5xl">
        <p className="mb-6 font-display text-xs font-bold uppercase tracking-[.25em] text-volt">Our promise</p>
        <p data-words="1" className="font-display text-4xl font-extrabold uppercase italic leading-[1.02] sm:text-6xl">We build for the sprint, the sixth set, the last over and the long run. Every product is tested by athletes who refuse to settle.</p>
        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-white/15 pt-10 md:grid-cols-4">
          {[[50, 'k+', 'Athletes equipped'], [12, '', 'Sports covered'], [30, '-day', 'Free returns'], [98, '%', 'Happy customers']].map(([n, s, l]) => <div key={l}><p className="font-display text-6xl font-extrabold italic text-volt"><span data-count={n} data-suffix={s}>{n}{s}</span></p><p className="mt-1 text-sm text-slate-300">{l}</p></div>)}
        </div>
      </div></section>

      {/* FEATURE SPLIT */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-24 md:grid-cols-2">
        <div data-reveal="left" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-volt to-lime-300 p-10"><div data-parallax="0.08" className="aspect-square"><ProductArt type="shoe" color="pink" className="h-full w-full -rotate-12 drop-shadow-2xl" /></div><span className="absolute left-5 top-5 rounded-full bg-onyx px-4 py-1 font-display text-sm font-bold uppercase tracking-widest text-volt">New · Velocity Pro</span></div>
        <div data-reveal="right"><p className="font-display text-xs font-bold uppercase tracking-[.25em] text-slate-500">Featured</p><h2 className="font-display text-6xl font-extrabold uppercase italic leading-[.88]">Faster starts.<br />Softer finishes.</h2><p className="mt-5 text-lg text-slate-600">A carbon-assisted plate, springy foam and a breathable knit upper. Now in five colours, from volt to pink to cyan.</p><div className="mt-7 flex gap-3"><Btn onClick={() => navigate('/product/velocity-pro-runner')}>See the shoe <ArrowRight size={18} /></Btn><Btn variant="ghost" onClick={() => goShop({ cat: 'running' })}>Running range</Btn></div></div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-16"><Ad id="racket" size="billboard" /></div>
      <NewsSection />

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHead eyebrow="Real feedback" title="Athletes say" />
        <div className="grid gap-5 md:grid-cols-3" data-stagger>{REVIEWS.slice(0, 3).map((r, i) => <figure key={i} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200"><div className="mb-3 flex gap-0.5 text-onyx">{[1,2,3,4,5].map((k) => <span key={k} className={k <= r.rating ? '' : 'opacity-25'}>★</span>)}</div><p className="font-display text-xl font-bold uppercase italic">{r.title}</p><blockquote className="mt-1 text-slate-700">{r.body}</blockquote><figcaption className="mt-4 text-sm font-bold">{r.name} <span className="font-normal text-slate-500">· {r.date}</span></figcaption></figure>)}</div>
      </section>
    </div>
  );
}

export function NewsPage() {
  const root = useRef(null); const { ready } = useStore(); useFx(root, []);
  const [f, setF] = useState('All');
  const list = NEWS.filter((n) => f === 'All' || n.sport === f);
  return (
    <div ref={root}>
      <section className="bg-onyx py-16 text-white"><div className="mx-auto max-w-7xl px-4"><p className="font-display text-xs font-bold uppercase tracking-[.25em] text-volt"><Newspaper className="mr-2 inline" size={16} />eTotalSports news</p><h1 className="font-display text-6xl font-extrabold uppercase italic leading-[.85] sm:text-8xl">Sports news<br /><span className="text-volt">& events</span></h1><p className="mt-4 max-w-xl text-slate-300">Football, cricket, tennis and basketball: what happened, and what is coming up.</p></div></section>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-wrap gap-2" role="tablist">{NEWS_SPORTS.map((s) => <button key={s} role="tab" aria-selected={f === s} onClick={() => setF(s)} className={`rounded-full px-5 py-2 font-display text-sm font-bold uppercase tracking-wide transition ${f === s ? 'bg-onyx text-white' : 'bg-slate-100 hover:bg-volt'}`}>{s}</button>)}</div>
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <motion.div layout className="grid gap-5 md:grid-cols-2"><AnimatePresence mode="popLayout">{list.map((n, i) => <motion.div key={n.id} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }} className="flex"><NewsCard n={n} /></motion.div>)}</AnimatePresence></motion.div>
          <div className="space-y-5 lg:sticky lg:top-24 lg:h-fit"><Ad id="shoes" size="rect" /><aside className="h-fit rounded-2xl bg-onyx p-5 text-white"><p className="mb-3 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[.2em] text-volt"><Trophy size={16} /> Events calendar</p><ul className="space-y-3">{EVENTS.map((e) => <li key={e.title} className="border-b border-white/10 pb-3 last:border-0"><p className="font-display text-lg font-extrabold uppercase italic text-volt">{e.date}</p><p className="text-sm font-semibold">{e.title}</p><p className="text-xs text-slate-400">{e.sport} · {e.place} · {e.status}</p></li>)}</ul></aside><AdSlot size="rect" label="News sidebar" /></div>
        </div>
        <p className="mt-8 text-xs text-slate-500">Summaries are written by eTotalSports from the cited sources. Follow each link for the full story.</p>
        <h2 className="mb-5 mt-14 font-display text-5xl font-extrabold uppercase italic">Upcoming events</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{EVENTS.map((e, i) => <EventBox key={e.title} e={e} i={i} />)}</div>
        <h2 className="mb-5 mt-14 font-display text-5xl font-extrabold uppercase italic">Gear guides</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{GUIDES.map((g, i) => <GuideBox key={g.id} g={g} i={i} />)}</div>
      </div>
    </div>
  );
}
