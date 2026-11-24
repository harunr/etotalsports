import React, { useEffect, useRef, useState } from 'react';
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Curve, Vector3, TubeGeometry, MeshStandardMaterial, Mesh,
  PointLight, AmbientLight, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, AdditiveBlending,
  PMREMGenerator, SRGBColorSpace, ACESFilmicToneMapping, MathUtils, TorusGeometry, Color,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { reduced } from './fx.jsx';
import { Logo } from './Logo.jsx';

class Lemniscate extends Curve {
  constructor(a = 2.7, twist = 0.55) { super(); this.a = a; this.twist = twist; }
  getPoint(t, target = new Vector3()) {
    const tt = t * Math.PI * 2, s = Math.sin(tt), c = Math.cos(tt), d = 1 + s * s;
    return target.set((this.a * c) / d, (this.a * s * c) / d, Math.sin(tt * 2) * this.twist);
  }
}

export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

/** Three.js hero: a metallic volt infinity loop (the "e" of eTotal) with speed streaks, mouse parallax and scroll-driven rotation. */
export default function Hero3D({ ready, className = '' }) {
  const host = useRef(null);
  const [fallback, setFallback] = useState(false);
  const api = useRef({});

  useEffect(() => {
    const el = host.current;
    if (!el) return undefined;
    if (!webglOK()) { setFallback(true); return undefined; }
    let renderer;
    try { renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (e) { setFallback(true); return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';

    const scene = new Scene();
    const pm = new PMREMGenerator(renderer);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    let xOff = 0; let base = 1;
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 10.5);

    const group = new Group();
    scene.add(group);
    const curve = new Lemniscate();
    const volt = new Mesh(new TubeGeometry(curve, 520, 0.34, 28, true), new MeshStandardMaterial({ color: 0xd4ff00, metalness: 0.55, roughness: 0.22, emissive: 0x4a5a00, emissiveIntensity: 0.35, envMapIntensity: 1.4 }));
    const white = new Mesh(new TubeGeometry(new Lemniscate(2.7, -0.55), 520, 0.1, 18, true), new MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.3, envMapIntensity: 1.2 }));
    white.scale.setScalar(1.12);
    const ring = new Mesh(new TorusGeometry(3.9, 0.035, 12, 160), new MeshStandardMaterial({ color: 0x2563eb, emissive: 0x2563eb, emissiveIntensity: 1.4, metalness: 0.2, roughness: 0.4 }));
    ring.rotation.x = Math.PI / 2.6;
    group.add(volt, white, ring);
    group.rotation.z = -0.22;

    const key = new PointLight(0xd4ff00, 60, 30); key.position.set(4, 3, 6);
    const rim = new PointLight(0x2563eb, 90, 30); rim.position.set(-6, -2, 4);
    scene.add(key, rim, new AmbientLight(0xffffff, 0.35));

    // speed streaks
    const N = 360, pos = new Float32Array(N * 3), spd = new Float32Array(N);
    for (let i = 0; i < N; i++) { pos[i * 3] = MathUtils.randFloatSpread(30); pos[i * 3 + 1] = MathUtils.randFloatSpread(14); pos[i * 3 + 2] = MathUtils.randFloatSpread(10) - 2; spd[i] = 0.02 + Math.random() * 0.09; }
    const pg = new BufferGeometry(); pg.setAttribute('position', new Float32BufferAttribute(pos, 3));
    const pts = new Points(pg, new PointsMaterial({ color: new Color(0xd4ff00), size: 0.05, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false }));
    scene.add(pts);

    const size = () => {
      const w = el.clientWidth || 600, h = el.clientHeight || 600;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? 15 : w / h < 1.3 ? 12 : 10.5;
      const halfW = Math.tan(MathUtils.degToRad(19)) * camera.position.z * (w / h);
      xOff = w / h >= 1.3 ? halfW * 0.5 : 0;
      base = w / h >= 1.3 ? 0.68 : 0.85;
      group.scale.setScalar(base);
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size); ro.observe(el);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const mv = (e) => { const r = el.getBoundingClientRect(); mouse.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; mouse.ty = ((e.clientY - r.top) / r.height - 0.5) * 2; };
    window.addEventListener('pointermove', mv, { passive: true });

    const st = { visible: true, intro: 0, boost: 0 };
    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    api.current = { st, group, volt, get base() { return base; } };

    const still = reduced();
    let raf, last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!st.visible) return;
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
      const sc = Math.min(window.scrollY / window.innerHeight, 1.5);
      if (!still) group.rotation.y += dt * (0.35 + st.boost);
      group.rotation.x = mouse.y * 0.25 + sc * 0.6;
      group.position.x = xOff + mouse.x * 0.35; group.position.y = -sc * 1.4;
      ring.rotation.z += dt * 0.4;
      key.position.x = 4 + mouse.x * 3; key.position.y = 3 - mouse.y * 2;
      const a = pg.attributes.position.array;
      for (let i = 0; i < N; i++) { a[i * 3] -= spd[i] * (1 + st.boost * 5) * (still ? 0 : 1); if (a[i * 3] < -15) a[i * 3] = 15; }
      pg.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', mv);
      [volt, white, ring].forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
      pg.dispose(); pts.material.dispose(); env.dispose(); pm.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const a = api.current;
    if (!ready || !a.group) return;
    if (reduced()) return;
    gsap.fromTo(a.group.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: a.base, y: a.base, z: a.base, duration: 1.6, ease: 'elastic.out(1,.7)' });
    gsap.fromTo(a.st, { boost: 1.6 }, { boost: 0, duration: 2.4, ease: 'power3.out' });
  }, [ready]);

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div ref={host} className="absolute inset-0" />
      {fallback && <div className="absolute inset-0 grid place-items-center"><Logo variant="mark" tone="dark" height={220} /></div>}
    </div>
  );
}
