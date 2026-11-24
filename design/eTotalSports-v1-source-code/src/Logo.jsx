import React from 'react';
import { WORD_E, WORD_S, WE, WS } from './logoData.js';

export const BRAND = { onyx: '#0F172A', volt: '#D4FF00', laser: '#2563EB', white: '#FFFFFF' };
const TX = 74;

function Mark({ ink, acc }) {
  return (
    <g transform="translate(7.2 0) skewX(-12)">
      <path d="M53 34A17 17 0 1 0 48 46" fill="none" stroke={ink} strokeWidth="8" />
      <path d="M2 30.5H53L63 34L53 37.5H2Z" fill={acc} />
      <path d="M10 19H24V23H10Z" fill={acc} />
      <path d="M4 45H17V49H4Z" fill={acc} />
    </g>
  );
}

function Tile({ fill, ink, acc, stroke }) {
  return (
    <g>
      <rect width="64" height="64" rx="14" fill={fill} stroke={stroke} strokeWidth={stroke ? 1.5 : 0} />
      <g transform="translate(6.2 7) scale(.80)"><Mark ink={ink} acc={acc} /></g>
    </g>
  );
}

/**
 * eTotalSports logo.
 * variant: 'lockup' (mark + wordmark) | 'icon' (app tile) | 'mark' (bare mark)
 * tone: 'dark' (for dark grounds) | 'light' (for light grounds) | 'mono-onyx' | 'mono-white' | 'volt'
 */
export function Logo({ variant = 'lockup', tone = 'dark', height = 40, className = '', title = 'eTotalSports' }) {
  const { onyx, volt, white, laser } = BRAND;
  let w = 64, body;
  if (variant === 'icon') {
    body =
      tone === 'volt' ? <Tile fill={volt} ink={onyx} acc={onyx} /> :
      tone === 'mono-onyx' ? <Tile fill={onyx} ink={white} acc={white} /> :
      tone === 'mono-white' ? <Tile fill={white} ink={onyx} acc={onyx} stroke="#CBD5E1" /> :
      tone === 'dark' ? <Tile fill={onyx} ink={white} acc={volt} stroke="rgba(255,255,255,.22)" /> :
      <Tile fill={onyx} ink={white} acc={volt} />;
  } else if (variant === 'mark') {
    const [i, a] = tone === 'light' ? [onyx, laser] : tone === 'mono-onyx' ? [onyx, onyx] : tone === 'mono-white' ? [white, white] : tone === 'volt' ? [onyx, onyx] : [white, volt];
    body = <Mark ink={i} acc={a} />;
  } else {
    const chip = tone === 'light';
    const mono = tone === 'mono-onyx' || tone === 'mono-white';
    const c = tone === 'mono-white' ? white : onyx;
    const sx = chip ? TX + WE + 3 + 8 : TX + WE + 6;
    w = Math.round(sx + WS + (chip ? 14 : 0) + 2);
    body = (
      <g>
        {chip ? <Tile fill={onyx} ink={white} acc={volt} /> : <Mark ink={mono ? c : white} acc={mono ? c : volt} />}
        {chip && <path d={`M${TX + WE + 7} 6H${TX + WE + 3 + WS + 16}L${TX + WE + 3 + WS + 10} 52H${TX + WE + 1}Z`} fill={volt} />}
        <path transform={`translate(${TX} 46)`} d={WORD_E} fill={mono ? c : chip ? onyx : white} />
        <path transform={`translate(${sx} 46)`} d={WORD_S} fill={mono ? c : chip ? onyx : volt} />
      </g>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} 64`} height={height} width={(w / 64) * height} role="img" aria-label={title} className={className} style={{ display: 'block', flex: 'none' }}>
      <title>{title}</title>
      {body}
    </svg>
  );
}

export default Logo;
