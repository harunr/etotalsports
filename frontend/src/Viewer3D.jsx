import React, { useEffect, useRef, useState } from 'react';
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, SphereGeometry, CylinderGeometry,
  TorusGeometry, LatheGeometry, Vector2, Vector3, Box3, PointLight, DirectionalLight, AmbientLight, CanvasTexture, SRGBColorSpace,
  ACESFilmicToneMapping, PMREMGenerator, Shape, ExtrudeGeometry, BoxGeometry, LineSegments, LineBasicMaterial, BufferGeometry, Float32BufferAttribute, Color, MeshBasicMaterial, CircleGeometry,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Play, Pause, ZoomIn, ZoomOut, RotateCcw, Move3d } from 'lucide-react';
import { COLOR_HEX } from './data.js';
import { reduced } from './fx.jsx';
import { webglOK } from './Hero3D.jsx';

export const SUPPORTS_3D = ['football', 'basketball', 'dumbbell', 'bottle', 'racket', 'shoe'];
const hex = (c) => new Color(COLOR_HEX[c] || c);
const lumOf = (c) => { const x = hex(c); return 0.299 * x.r + 0.587 * x.g + 0.114 * x.b; };
const accentOf = (c) => (lumOf(c) > 0.55 ? '#0F172A' : '#D4FF00');
const std = (color, o = {}) => new MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.45, ...o });

function footballTexture(patch) {
  const W = 1024, H = 512, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d'); g.fillStyle = '#f8fafc'; g.fillRect(0, 0, W, H);
  const phi = (1 + Math.sqrt(5)) / 2, V = [];
  [[0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi], [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0], [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]].forEach((v) => V.push(new Vector3(...v).normalize()));
  const proj = (p) => { const u = ((Math.atan2(p.z, -p.x) / (Math.PI * 2)) % 1 + 1) % 1; const th = Math.acos(Math.max(-1, Math.min(1, p.y))); return [u * W, (th / Math.PI) * H]; };
  g.lineJoin = 'round';
  V.forEach((v) => {
    const up = Math.abs(v.y) > 0.9 ? new Vector3(1, 0, 0) : new Vector3(0, 1, 0);
    const t1 = new Vector3().crossVectors(v, up).normalize(), t2 = new Vector3().crossVectors(v, t1);
    const pts = []; const r = 0.43;
    for (let k = 0; k < 5; k++) { const a = (k * 2 * Math.PI) / 5; pts.push(proj(v.clone().multiplyScalar(Math.cos(r)).add(t1.clone().multiplyScalar(Math.cos(a) * Math.sin(r))).add(t2.clone().multiplyScalar(Math.sin(a) * Math.sin(r))).normalize())); }
    const [cx] = proj(v); const adj = pts.map(([x, y]) => [x - cx > W / 2 ? x - W : x - cx < -W / 2 ? x + W : x, y]);
    [-W, 0, W].forEach((off) => { g.beginPath(); adj.forEach(([x, y], i) => (i ? g.lineTo(x + off, y) : g.moveTo(x + off, y))); g.closePath(); g.fillStyle = patch; g.fill(); g.strokeStyle = '#0F172A'; g.lineWidth = 3; g.stroke(); });
  });
  const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
}
function basketTexture(base) {
  const W = 1024, H = 512, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
  g.strokeStyle = '#111827'; g.lineWidth = 7; g.lineCap = 'round';
  [0, W / 2, W].forEach((x) => { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); });
  g.beginPath(); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke();
  [W * 0.25, W * 0.75].forEach((cx) => { [-1, 1].forEach((s) => { g.beginPath(); for (let y = 0; y <= H; y += 8) { const x = cx + s * 0.11 * W * Math.sin((Math.PI * y) / H); y ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }); });
  const t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t;
}
function tr(x, y) { return [(x - 100) / 40, -(y - 80) / 40]; }
function shoeShape() {
  const s = new Shape(), P = (x, y) => tr(x, y);
  s.moveTo(...P(14, 114)); s.lineTo(...P(14, 82));
  s.bezierCurveTo(...P(14, 72), ...P(20, 68), ...P(30, 66)); s.lineTo(...P(50, 63));
  s.bezierCurveTo(...P(58, 62), ...P(62, 58), ...P(66, 52)); s.lineTo(...P(72, 44));
  s.bezierCurveTo(...P(76, 40), ...P(83, 41), ...P(87, 47)); s.lineTo(...P(97, 64));
  s.bezierCurveTo(...P(116, 72), ...P(138, 76), ...P(158, 86)); s.bezierCurveTo(...P(176, 94), ...P(188, 104), ...P(188, 114)); s.closePath();
  return s;
}
function roundRect(x0, y0, x1, y1, r) {
  const s = new Shape(); s.moveTo(x0 + r, y0); s.lineTo(x1 - r, y0); s.quadraticCurveTo(x1, y0, x1, y0 + r); s.lineTo(x1, y1 - r); s.quadraticCurveTo(x1, y1, x1 - r, y1); s.lineTo(x0 + r, y1); s.quadraticCurveTo(x0, y1, x0, y1 - r); s.lineTo(x0, y0 + r); s.quadraticCurveTo(x0, y0, x0 + r, y0); return s;
}

function build(type, color) {
  const g = new Group(), acc = accentOf(color), main = hex(color);
  if (type === 'football') {
    g.add(new Mesh(new SphereGeometry(1.6, 64, 48), new MeshStandardMaterial({ map: footballTexture(lumOf(color) > 0.8 ? '#0F172A' : COLOR_HEX[color] || color), roughness: 0.38, metalness: 0.02 })));
  } else if (type === 'basketball') {
    g.add(new Mesh(new SphereGeometry(1.6, 64, 48), new MeshStandardMaterial({ map: basketTexture(color === 'onyx' ? '#1f2937' : COLOR_HEX[color] || color), roughness: 0.78 })));
  } else if (type === 'dumbbell') {
    const metal = std('#94a3b8', { metalness: 0.9, roughness: 0.28 });
    const bar = new Mesh(new CylinderGeometry(0.14, 0.14, 4.2, 28), metal); bar.rotation.z = Math.PI / 2; g.add(bar);
    for (let i = -3; i <= 3; i++) { const k = new Mesh(new TorusGeometry(0.15, 0.025, 8, 24), metal); k.rotation.y = Math.PI / 2; k.position.x = i * 0.16; g.add(k); }
    [-1, 1].forEach((s) => {
      [[0.95, 0.3, 1.3], [0.74, 0.26, 1.6], [0.52, 0.22, 1.86]].forEach(([r, t, x], i) => {
        const plate = new Mesh(new CylinderGeometry(r, r, t, 6), std(i === 1 ? acc : main, { metalness: 0.35, roughness: 0.35 })); plate.rotation.z = Math.PI / 2; plate.position.x = s * x; g.add(plate);
      });
      const cap = new Mesh(new CylinderGeometry(0.22, 0.22, 0.2, 24), metal); cap.rotation.z = Math.PI / 2; cap.position.x = s * 2.05; g.add(cap);
    });
    g.rotation.z = 0.35;
  } else if (type === 'bottle') {
    const pts = [[0, 0], [0.52, 0], [0.6, 0.06], [0.62, 0.3], [0.62, 2.3], [0.56, 2.52], [0.36, 2.72], [0.3, 2.9], [0.3, 3]].map(([x, y]) => new Vector2(x, y));
    g.add(new Mesh(new LatheGeometry(pts, 48), new MeshPhysicalMaterial({ color: main, metalness: 0.45, roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2 })));
    const band = new Mesh(new CylinderGeometry(0.625, 0.625, 0.7, 48, 1, true), std(acc, { roughness: 0.4 })); band.position.y = 1.25; g.add(band);
    const cap = new Mesh(new CylinderGeometry(0.34, 0.37, 0.5, 32), std(acc, { roughness: 0.35 })); cap.position.y = 3.15; g.add(cap);
    const loop = new Mesh(new TorusGeometry(0.2, 0.05, 12, 32), std(acc)); loop.position.set(0, 3.52, 0); g.add(loop);
    g.rotation.z = -0.25;
  } else if (type === 'racket') {
    const frame = std(main, { metalness: 0.5, roughness: 0.3 });
    const head = new Mesh(new TorusGeometry(1, 0.075, 16, 96), frame); head.scale.set(0.8, 1, 1); head.position.y = 0.9; g.add(head);
    const pts = []; const a = 0.77, b = 0.97;
    for (let x = -a; x <= a + 1e-3; x += 0.14) { const h = b * Math.sqrt(1 - (x / a) ** 2); pts.push(x, 0.9 - h, 0, x, 0.9 + h, 0); }
    for (let y = -b; y <= b + 1e-3; y += 0.14) { const w = a * Math.sqrt(1 - (y / b) ** 2); pts.push(-w, 0.9 + y, 0, w, 0.9 + y, 0); }
    const bg = new BufferGeometry(); bg.setAttribute('position', new Float32BufferAttribute(pts, 3));
    g.add(new LineSegments(bg, new LineBasicMaterial({ color: 0xe2e8f0 })));
    [-1, 1].forEach((s) => { const th = new Mesh(new CylinderGeometry(0.05, 0.05, 1.05, 12), frame); th.position.set(s * 0.18, -0.35, 0); th.rotation.z = s * 0.18; g.add(th); });
    const handle = new Mesh(new CylinderGeometry(0.1, 0.12, 1.4, 20), std(acc, { roughness: 0.7 })); handle.position.y = -1.55; g.add(handle);
    const butt = new Mesh(new CylinderGeometry(0.15, 0.15, 0.12, 20), std('#0F172A')); butt.position.y = -2.3; g.add(butt);
    g.rotation.z = 0.35;
  } else if (type === 'shoe') {
    const dep = 1.7, bev = { bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 6, curveSegments: 24 };
    const body = new Mesh(new ExtrudeGeometry(shoeShape(), { depth: dep, ...bev }), std(main, { metalness: 0.1, roughness: 0.5 })); body.position.z = -dep / 2; g.add(body);
    const heel = new Shape(); [[14, 82], [14, 72], [20, 68], [30, 66], [36, 92], [14, 100]].forEach(([x, y], i) => (i ? heel.lineTo(...tr(x, y)) : heel.moveTo(...tr(x, y)))); heel.closePath();
    const tab = new Mesh(new ExtrudeGeometry(heel, { depth: dep + 0.08, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 4 }), std(acc, { roughness: 0.4 })); tab.position.z = -dep / 2 - 0.04; g.add(tab);
    const sole = new Mesh(new ExtrudeGeometry(roundRect(...tr(10, 130).concat(tr(192, 112)).slice(0, 2), ...tr(192, 112), 0.25), { depth: dep + 0.15, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 4 }), std('#f8fafc', { roughness: 0.6 }));
    sole.position.z = -(dep + 0.15) / 2; g.add(sole);
    const stripe = new Shape(); [[30, 100], [88, 94], [140, 104], [184, 110], [184, 114], [30, 106]].forEach(([x, y], i) => (i ? stripe.lineTo(...tr(x, y)) : stripe.moveTo(...tr(x, y)))); stripe.closePath();
    const st = new Mesh(new ExtrudeGeometry(stripe, { depth: dep + 0.5, bevelEnabled: false }), std(acc, { roughness: 0.4 })); st.position.z = -(dep + 0.5) / 2; g.add(st);
    [[86, 56, 98, 51], [94, 67, 108, 61], [105, 75, 119, 69]].forEach(([x0, y0, x1, y1]) => {
      const [ax, ay] = tr(x0, y0), [bx, by] = tr(x1, y1); const len = Math.hypot(bx - ax, by - ay);
      const lace = new Mesh(new BoxGeometry(len, 0.07, dep + 0.55), std('#f8fafc')); lace.position.set((ax + bx) / 2, (ay + by) / 2, 0); lace.rotation.z = Math.atan2(by - ay, bx - ax); g.add(lace);
    });
    g.rotation.y = -0.5;
  }
  const box = new Box3().setFromObject(g), size = box.getSize(new Vector3()), ctr = box.getCenter(new Vector3());
  const wrap = new Group(); g.position.sub(ctr); wrap.add(g); wrap.scale.setScalar(3.4 / Math.max(size.x, size.y, size.z));
  return wrap;
}

export default function Viewer3D({ type, color, className = '', fallback = null }) {
  const host = useRef(null), S = useRef({});
  const [ok, setOk] = useState(true);
  const [auto, setAuto] = useState(!reduced());

  useEffect(() => {
    const el = host.current; if (!el) return undefined;
    if (!webglOK()) { setOk(false); return undefined; }
    let renderer;
    try { renderer = new WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { setOk(false); return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.outputColorSpace = SRGBColorSpace; renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement); renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab';
    const scene = new Scene(), pm = new PMREMGenerator(renderer); const env = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environment = env;
    const camera = new PerspectiveCamera(32, 1, 0.1, 50); camera.position.set(0, 0.4, 8.5);
    const key = new DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 5); scene.add(key, new AmbientLight(0xffffff, 0.5));
    const rim = new PointLight(0xd4ff00, 25, 20); rim.position.set(-4, 1, -3); scene.add(rim);
    const shadow = new Mesh(new CircleGeometry(1.7, 48), new MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.16 })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -2.1; scene.add(shadow);
    const pivot = new Group(); scene.add(pivot);
    const st = { pivot, scene, camera, renderer, model: null, rx: 0.12, ry: 0, vy: 0, zoom: 8.5, auto: !reduced(), drag: false, last: [0, 0], visible: true };
    S.current = st;
    const size = () => { const w = el.clientWidth || 500, h = el.clientHeight || 500; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    size(); const ro = new ResizeObserver(size); ro.observe(el);
    const down = (e) => { st.drag = true; st.last = [e.clientX, e.clientY]; renderer.domElement.style.cursor = 'grabbing'; renderer.domElement.setPointerCapture?.(e.pointerId); };
    const move = (e) => { if (!st.drag) return; const dx = e.clientX - st.last[0], dy = e.clientY - st.last[1]; st.last = [e.clientX, e.clientY]; st.vy = dx * 0.012; st.ry += dx * 0.012; st.rx = Math.max(-0.7, Math.min(0.9, st.rx + dy * 0.006)); };
    const up = () => { st.drag = false; renderer.domElement.style.cursor = 'grab'; };
    const cv = renderer.domElement; cv.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; }); io.observe(el);
    let raf, last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop); const dt = Math.min((now - last) / 1000, 0.05); last = now; if (!st.visible) return;
      if (!st.drag) { st.vy *= 0.94; st.ry += st.vy * 0.5 + (st.auto ? dt * 0.7 : 0); }
      pivot.rotation.y = st.ry; pivot.rotation.x = st.rx; camera.position.z += (st.zoom - camera.position.z) * 0.12; pivot.position.y = Math.sin(now / 900) * 0.06;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); cv.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); env.dispose(); pm.dispose(); renderer.dispose(); if (cv.parentNode === el) el.removeChild(cv); };
  }, []);

  useEffect(() => {
    const st = S.current; if (!st.pivot) return;
    if (st.model) { st.pivot.remove(st.model); st.model.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { o.material.map?.dispose(); o.material.dispose(); } }); }
    st.model = build(type, color); st.pivot.add(st.model);
  }, [type, color, ok]);
  useEffect(() => { if (S.current) S.current.auto = auto; }, [auto]);

  if (!ok) return fallback;
  const btn = 'grid h-10 w-10 place-items-center rounded-full bg-white/90 text-onyx shadow ring-1 ring-slate-200 transition hover:bg-volt active:scale-90';
  return (
    <div className={`relative ${className}`}>
      <div ref={host} className="absolute inset-0" role="img" aria-label={`Interactive 3D ${type}. Drag to rotate.`} />
      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-onyx px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-volt"><Move3d size={14} /> 3D · Drag to rotate</span>
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button className={btn} aria-label={auto ? 'Pause rotation' : 'Auto rotate'} onClick={() => setAuto((a) => !a)}>{auto ? <Pause size={16} /> : <Play size={16} />}</button>
        <button className={btn} aria-label="Zoom in" onClick={() => { S.current.zoom = Math.max(5.5, S.current.zoom - 1.2); }}><ZoomIn size={16} /></button>
        <button className={btn} aria-label="Zoom out" onClick={() => { S.current.zoom = Math.min(12, S.current.zoom + 1.2); }}><ZoomOut size={16} /></button>
        <button className={btn} aria-label="Reset view" onClick={() => { Object.assign(S.current, { rx: 0.12, ry: 0, vy: 0, zoom: 8.5 }); }}><RotateCcw size={16} /></button>
      </div>
    </div>
  );
}
