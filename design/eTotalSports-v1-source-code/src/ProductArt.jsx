import React from 'react';
import { COLOR_HEX } from './data.js';

const ONYX = '#0F172A', VOLT = '#D4FF00';
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const ACC = { '#D4FF00': '#0F172A', '#0F172A': '#D4FF00', '#F1F5F9': '#2563EB', '#2563EB': '#FACC15', '#EF4444': '#FACC15', '#F97316': '#0F172A', '#EC4899': '#06B6D4', '#06B6D4': '#EC4899', '#7C3AED': '#D4FF00', '#FACC15': '#7C3AED', '#14B8A6': '#FACC15', '#22C55E': '#0F172A' };
const accentFor = (c) => ACC[c.toUpperCase()] || (lum(c) > 0.55 ? ONYX : VOLT);

const ART = {
  shoe: (c, a) => (
    <g>
      <ellipse cx="101" cy="138" rx="88" ry="6" fill="rgba(15,23,42,.14)" />
      <path d="M14 114 V82 C14 72 20 68 30 66 L50 63 C58 62 62 58 66 52 L72 44 C76 40 83 41 87 47 L97 64 C116 72 138 76 158 86 C176 94 188 104 188 114Z" fill={c} />
      <path d="M14 82 C14 72 20 68 30 66 L36 92 L14 100Z" fill={a} />
      <path d="M50 63 C58 62 62 58 66 52 L72 44 L82 48 L70 64Z" fill="#0F172A" opacity=".85" />
      <path d="M86 56 L98 51 M94 67 L108 61 M105 75 L119 69" stroke={a} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M150 84 C172 92 188 102 188 114 H150Z" fill="#fff" opacity=".28" />
      <path d="M40 104 Q90 96 140 106 T182 112" stroke={a} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M10 112 H192 V122 Q192 130 182 130 H20 Q10 130 10 122Z" fill="#F8FAFC" stroke="#CBD5E1" />
      <path d="M10 119 H192" stroke="#CBD5E1" />
    </g>
  ),
  shirt: (c, a) => (
    <g>
      <path d="M62 30 L82 20 Q100 38 118 20 L138 30 L168 58 L148 76 L136 66 V132 H64 V66 L52 76 L32 58Z" fill={c} />
      <path d="M64 96 L136 68 V82 L64 110Z" fill={a} />
      <path d="M82 20 Q100 38 118 20" fill="none" stroke={a} strokeWidth="5" />
    </g>
  ),
  shorts: (c, a) => (
    <g>
      <path d="M54 32 H146 L158 126 H108 L100 78 L92 126 H42Z" fill={c} />
      <rect x="54" y="32" width="92" height="12" fill={a} />
      <path d="M62 52 L52 120" stroke={a} strokeWidth="5" strokeLinecap="round" />
      <path d="M138 52 L148 120" stroke={a} strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  football: (c, a) => (
    <g>
      <ellipse cx="100" cy="142" rx="50" ry="5" fill="rgba(15,23,42,.14)" />
      <circle cx="100" cy="78" r="58" fill="#F8FAFC" stroke={ONYX} strokeWidth="3" />
      <polygon points="100,52 124,70 115,98 85,98 76,70" fill={c === '#F1F5F9' ? ONYX : c} stroke={ONYX} strokeWidth="2" />
      <g stroke={ONYX} strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M100 52 V22 M124 70 L152 60 M115 98 L132 124 M85 98 L68 124 M76 70 L48 60" />
      </g>
      <g fill={ONYX}><polygon points="100,22 112,28 108,40 92,40 88,28" /><polygon points="152,60 156,76 146,84 138,72 142,62" /><polygon points="48,60 58,62 62,72 54,84 44,76" /></g>
    </g>
  ),
  basketball: (c, a) => (
    <g>
      <ellipse cx="100" cy="142" rx="50" ry="5" fill="rgba(15,23,42,.14)" />
      <circle cx="100" cy="78" r="58" fill={c === '#0F172A' ? '#1E293B' : c} stroke={ONYX} strokeWidth="3" />
      <g stroke={c === '#0F172A' ? VOLT : ONYX} strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M100 20 V136 M42 78 H158 M60 30 Q96 78 60 126 M140 30 Q104 78 140 126" />
      </g>
    </g>
  ),
  racket: (c, a) => (
    <g transform="rotate(-32 100 80)">
      <ellipse cx="100" cy="52" rx="36" ry="46" fill="rgba(255,255,255,.55)" stroke={c} strokeWidth="7" />
      <g stroke="#94A3B8" strokeWidth="1.2">
        {[-24, -12, 0, 12, 24].map((x) => <line key={x} x1={100 + x} y1={12} x2={100 + x} y2={92} />)}
        {[24, 36, 48, 60, 72].map((y) => <line key={y} x1={68} y1={y} x2={132} y2={y} />)}
      </g>
      <path d="M92 96 L100 112 L108 96" fill="none" stroke={c} strokeWidth="6" strokeLinejoin="round" />
      <rect x="95" y="108" width="10" height="46" rx="4" fill={a} />
      <rect x="95" y="112" width="10" height="4" fill={ONYX} opacity=".35" />
    </g>
  ),
  dumbbell: (c, a) => (
    <g>
      <ellipse cx="100" cy="128" rx="80" ry="5" fill="rgba(15,23,42,.14)" />
      <rect x="62" y="74" width="76" height="9" rx="3" fill="#94A3B8" />
      <rect x="30" y="52" width="16" height="52" rx="5" fill={c} /><rect x="46" y="60" width="12" height="36" rx="4" fill={a} />
      <rect x="154" y="52" width="16" height="52" rx="5" fill={c} /><rect x="142" y="60" width="12" height="36" rx="4" fill={a} />
      <rect x="18" y="64" width="12" height="28" rx="4" fill={c} /><rect x="170" y="64" width="12" height="28" rx="4" fill={c} />
    </g>
  ),
  bottle: (c, a) => (
    <g>
      <ellipse cx="100" cy="142" rx="34" ry="5" fill="rgba(15,23,42,.14)" />
      <rect x="86" y="14" width="28" height="16" rx="4" fill={a} />
      <path d="M82 30 H118 Q124 40 124 56 V132 Q124 142 114 142 H86 Q76 142 76 132 V56 Q76 40 82 30Z" fill={c} />
      <path d="M76 70 H124 V104 H76Z" fill={a} opacity=".95" />
      <path d="M84 80 L98 80 L90 96 H84Z" fill={c} />
    </g>
  ),
  bat: (c, a) => (
    <g transform="rotate(28 100 80)">
      <rect x="82" y="8" width="36" height="104" rx="9" fill="#E7C894" stroke="#B88F52" />
      <path d="M100 14 V108" stroke="#C9A468" strokeWidth="2" />
      <rect x="82" y="60" width="36" height="8" fill={c} opacity=".9" />
      <rect x="94" y="112" width="12" height="46" rx="4" fill={c} />
      <rect x="94" y="120" width="12" height="3" fill={a} /><rect x="94" y="130" width="12" height="3" fill={a} /><rect x="94" y="140" width="12" height="3" fill={a} />
    </g>
  ),
  bag: (c, a) => (
    <g>
      <ellipse cx="100" cy="144" rx="52" ry="5" fill="rgba(15,23,42,.14)" />
      <path d="M72 34 Q72 14 100 14 Q128 14 128 34" fill="none" stroke={a} strokeWidth="6" strokeLinecap="round" />
      <path d="M58 40 Q58 28 72 28 H128 Q142 28 142 40 V128 Q142 142 128 142 H72 Q58 142 58 128Z" fill={c} />
      <path d="M70 84 H130 V118 Q130 124 124 124 H76 Q70 124 70 118Z" fill={a} opacity=".95" />
      <path d="M70 52 H130" stroke={a} strokeWidth="5" strokeLinecap="round" />
      <path d="M58 60 Q44 64 46 100 M142 60 Q156 64 154 100" fill="none" stroke={a} strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
};

export function ProductArt({ type = 'shoe', color = 'volt', className = '' }) {
  const c = COLOR_HEX[color] || color;
  const render = ART[type] || ART.shoe;
  return (
    <svg viewBox="0 0 200 160" className={className} role="img" aria-label={`${type} in ${color}`} style={{ display: 'block' }}>
      {render(c, accentFor(c))}
    </svg>
  );
}
export default ProductArt;

/** Real photo when WooCommerce supplies images[0].src, otherwise the colourful vector artwork. */
export function ProductImage({ p, color, className = '', imgClass = 'object-contain' }) {
  const src = p.images && p.images[0] && p.images[0].src;
  if (src) return <img src={src} alt={p.name} loading="lazy" className={`h-full w-full ${imgClass} ${className}`} />;
  return <ProductArt type={p.art} color={color || p.colors[0]} className={className} />;
}
