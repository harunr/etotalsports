import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from './store.jsx';
import { WORD_E, WORD_S } from './logoData.js';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches;

/** Splits text into masked lines > words > chars. Use "\n" for line breaks. Animate `.ch` with GSAP. */
export function Split({ text, className = '', as: Tag = 'span' }) {
  return (
    <Tag className={className} aria-label={text.replace(/\n/g, ' ')}>
      {text.split('\n').map((ln, i) => (
        <span key={i} className="line-mask" aria-hidden="true">
          {ln.split(' ').map((w, j, a) => (
            <React.Fragment key={j}>
              <span className="inline-block whitespace-nowrap">{[...w].map((c, k) => <span key={k} className="ch">{c}</span>)}</span>
              {j < a.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}

/** Scroll-triggered reveals driven by data attributes inside `ref`:
 *  data-reveal="up|left|right|scale|mask" data-delay, data-stagger (children), data-parallax="0.2",
 *  data-count="30" data-suffix="+" data-prefix="" , data-words (scrubbed word highlight) */
export function useFx(ref, deps = []) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = (s) => gsap.utils.toArray(s);
      if (reduced()) { gsap.set('[data-reveal], [data-stagger] > *', { opacity: 1, clearProps: 'all' }); q('[data-count]').forEach((el) => { el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || ''); }); q('.word').forEach((w) => { w.style.opacity = 1; }); return; }
      q('[data-reveal]').forEach((el) => {
        const t = el.dataset.reveal;
        const from = t === 'left' ? { x: -70 } : t === 'right' ? { x: 70 } : t === 'scale' ? { scale: 0.88 } : t === 'mask' ? { clipPath: 'inset(0 100% 0 0)' } : { y: 56 };
        gsap.from(el, { ...from, opacity: t === 'mask' ? 1 : 0, duration: 1.05, ease: 'power3.out', delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      q('[data-stagger]').forEach((box) => {
        const kids = Array.from(box.children); kids.forEach((c) => { c.style.transition = 'none'; });
        gsap.from(kids, { y: 54, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: box, start: 'top 90%', once: true }, onComplete: () => kids.forEach((c) => { c.style.transition = ''; c.style.transform = ''; c.style.opacity = ''; }) });
      });
      q('[data-parallax]').forEach((el) => {
        const s = +(el.dataset.parallax || 0.15) * 100;
        gsap.fromTo(el, { yPercent: s }, { yPercent: -s, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      q('[data-count]').forEach((el) => {
        const end = +el.dataset.count, o = { v: 0 }, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
        el.textContent = pre + '0' + suf;
        gsap.to(o, { v: end, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = pre + Math.round(o.v) + suf; } });
      });
      q('[data-words]').forEach((el) => {
        const words = el.dataset.words ? el.textContent.split(' ') : [];
        el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(' ');
        gsap.to(el.querySelectorAll('.word'), { opacity: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
      });
    }, ref);
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => { clearTimeout(t); ctx.revert(); };
    // eslint-disable-next-line
  }, deps);
}

export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !finePointer()) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const mv = (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - (r.left + r.width / 2)) * strength); yTo((e.clientY - (r.top + r.height / 2)) * strength); };
    const lv = () => { xTo(0); yTo(0); };
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', lv);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv); };
  }, [strength]);
  return <span ref={ref} className="inline-block">{children}</span>;
}

export function Marquee({ items, speed = 38, reverse = false, className = '', itemClass = '' }) {
  const track = useRef(null);
  useLayoutEffect(() => {
    if (reduced()) return;
    const tw = gsap.fromTo(track.current, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: speed, ease: 'none', repeat: -1 });
    const st = ScrollTrigger.create({ onUpdate: (s) => { gsap.to(tw, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 220, 7), duration: 0.2, overwrite: true, onComplete: () => gsap.to(tw, { timeScale: 1, duration: 0.8 }) }); } });
    return () => { tw.kill(); st.kill(); };
  }, [speed, reverse]);
  const row = items.map((t, i) => <span key={i} className={`mx-6 inline-flex items-center gap-6 ${itemClass}`}>{t}<span className="inline-block h-3 w-3 rotate-45 bg-volt" /></span>);
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <div ref={track} className="inline-flex will-change-transform">{row}{row}{row}{row}</div>
    </div>
  );
}

export function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`; } });
    return () => st.kill();
  }, []);
  return <div ref={bar} className="fixed left-0 top-0 z-[120] h-[3px] w-full origin-left scale-x-0 bg-volt" />;
}

export function Cursor() {
  const dot = useRef(null), ring = useRef(null), label = useRef(null);
  useEffect(() => {
    if (!finePointer() || reduced()) return;
    document.body.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot.current, 'y', { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, opacity: 0 });
    const move = (e) => { gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2, overwrite: 'auto' }); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e) => {
      const t = e.target.closest ? e.target.closest('[data-cursor-text],a,button,[role=button],input,select,textarea,label') : null;
      const txt = e.target.closest ? e.target.closest('[data-cursor-text]') : null;
      gsap.to(ring.current, { scale: txt ? 3.2 : t ? 1.8 : 1, backgroundColor: txt ? '#D4FF00' : 'rgba(212,255,0,0)', borderColor: txt ? '#D4FF00' : '#D4FF00', duration: 0.3, overwrite: 'auto' });
      label.current.textContent = txt ? txt.dataset.cursorText : '';
      gsap.to(label.current, { opacity: txt ? 1 : 0, duration: 0.2 });
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    window.addEventListener('mousemove', move); window.addEventListener('mouseover', over); document.addEventListener('mouseleave', leave);
    return () => { document.body.classList.remove('has-cursor'); window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); document.removeEventListener('mouseleave', leave); };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[200] hidden [@media(pointer:fine)]:block" aria-hidden="true">
      <div ref={ring} className="absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border-2 border-volt mix-blend-difference"><span ref={label} className="font-display text-[5px] font-extrabold uppercase italic leading-none tracking-wider text-onyx opacity-0" /></div>
      <div ref={dot} className="absolute left-0 top-0 h-2 w-2 rounded-full bg-volt mix-blend-difference" />
    </div>
  );
}

export function Preloader() {
  const { setReady } = useStore();
  const root = useRef(null);
  const [done, setDone] = useState(() => { try { return reduced() || sessionStorage.getItem('ets-pre') === '1'; } catch (e) { return reduced(); } });
  useEffect(() => {
    if (done) { setReady(true); return undefined; }
    document.body.style.overflow = 'hidden';
    const num = root.current.querySelector('.pl-num'), cnt = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => { document.body.style.overflow = ''; try { sessionStorage.setItem('ets-pre', '1'); } catch (e) { /* ignore */ } setReady(true); setDone(true); } });
      tl.set('.pl-ring', { strokeDasharray: 1, strokeDashoffset: 1 })
        .set('.pl-bar', { transformOrigin: '0% 50%', scaleX: 0 })
        .to('.pl-ring', { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.1)
        .to('.pl-bar', { scaleX: 1, duration: 0.6, ease: 'power3.out' }, 0.7)
        .from('.pl-s', { x: -30, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, 0.9)
        .from('.pl-word path', { yPercent: 120, opacity: 0, stagger: 0.18, duration: 0.7, ease: 'power4.out' }, 0.8)
        .to(cnt, { v: 100, duration: 1.7, ease: 'power1.inOut', onUpdate: () => { num.textContent = String(Math.round(cnt.v)).padStart(3, '0'); } }, 0)
        .to('.pl-content', { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' }, 2.05)
        .to('.pl-onyx', { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, 2.2)
        .to('.pl-volt', { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, 2.32);
    }, root);
    return () => { ctx.revert(); document.body.style.overflow = ''; };
  }, []);
  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[300]" role="status" aria-label="Loading eTotalSports">
      <div className="pl-volt absolute inset-0 bg-volt" />
      <div className="pl-onyx absolute inset-0 grid place-items-center bg-onyx">
        <div className="pl-content flex flex-col items-center gap-8">
          <svg viewBox="0 0 340 64" className="w-[min(78vw,520px)] overflow-visible" aria-hidden="true">
            <g transform="translate(7.2 0) skewX(-12)">
              <path className="pl-ring" pathLength="1" d="M53 34A17 17 0 1 0 48 46" fill="none" stroke="#fff" strokeWidth="8" />
              <path className="pl-bar" d="M2 30.5H53L63 34L53 37.5H2Z" fill="#D4FF00" />
              <path className="pl-s" d="M10 19H24V23H10Z" fill="#D4FF00" />
              <path className="pl-s" d="M4 45H17V49H4Z" fill="#D4FF00" />
            </g>
            <g className="pl-word">
              <path transform="translate(74 46)" d={WORD_E} fill="#fff" />
              <path transform="translate(193 46)" d={WORD_S} fill="#D4FF00" />
            </g>
          </svg>
          <p className="font-display text-sm font-bold uppercase tracking-[.4em] text-slate-400">Loading performance <span className="pl-num ml-2 text-volt">000</span></p>
        </div>
      </div>
    </div>
  );
}
