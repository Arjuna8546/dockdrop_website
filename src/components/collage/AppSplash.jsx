import { useEffect, useRef, useState } from 'react';
import { BrandMark } from '../layout/BrandMark.jsx';
import { CONTAINER_PATH } from './splashContainerPath.js';
import { SPLASH_MS, containerBloom, d1PreSpin, dGrow, letterFadeOut, spinRotate, wordmarkIn } from './splashTimeline.js';

/*
 * The DockDrop app's own animated splash, drawn on a canvas that fills a phone screen: the DOCKDROP
 * wordmark's two D's grow into the interlocked pair, the lime D turns, the pair spins upright while the
 * round container grows behind it, and it rests on the logo. Same 393×852 stage, artwork and timeline as
 * the app (web port: spice-distributor/src/components/splash/SplashIntro.jsx), a little faster.
 */
const STAGE_W = 393;
const MARK_Y = 375; // mark centre on the app stage
const BG = '#F5F5F4';
const INK = '#15160E';

const ART_W = 10872;
const ART_H = 1403;
const WORD_W = 330;
const SCALE = WORD_W / ART_W;
const ORIGIN_X = 196.5 - WORD_W / 2;
const ORIGIN_Y = MARK_Y - (ART_H * SCALE) / 2;
const toStage = ([x, y, w, h]) => [ORIGIN_X + x * SCALE, ORIGIN_Y + y * SCALE, w * SCALE, h * SCALE];
const WORD = {
  d0: toStage([0, 0, 1435, 1398]),
  ock: toStage([1443, 54, 3911, 1297]),
  d1: toStage([5517, 4, 1433, 1397]),
  rop: toStage([6957, 60, 3915, 1343]),
};
const D0_PAIR = [149.27, 348.33, 55.78, 54.57];
const D1_PAIR = [188.06, 347.08, 55.83, 54.6];
const ART = ['/splash/d0_white.png', '/splash/d1_lime.png', '/splash/ock.png', '/splash/rop.png'];

const lerpRect = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

/** One frame at progress t (0..1); the stage is drawn `scale` px per unit, the mark centred at (cx, cy). */
function drawFrame(ctx, t, art, container, w, h) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, w, h);
  const s = w / STAGE_W;
  // the stage's mark centre lands a little above the middle of the screen, as in the app
  ctx.setTransform(s, 0, 0, s, 0, h * 0.44 - MARK_Y * s);

  const bloom = containerBloom(t) * 0.0861;
  if (bloom > 0) {
    ctx.save();
    ctx.translate(196.5, MARK_Y);
    ctx.scale(bloom, bloom);
    ctx.translate(-751, -766.5);
    ctx.fillStyle = INK;
    ctx.fill(container);
    ctx.restore();
  }

  const wordOpacity = wordmarkIn(t);
  if (wordOpacity <= 0) return;
  const letters = 1 - letterFadeOut(t);
  if (letters > 0) {
    const wordScale = 0.92 + 0.08 * wordOpacity;
    ctx.save();
    ctx.globalAlpha = wordOpacity * letters;
    ctx.translate(196.5, MARK_Y);
    ctx.scale(wordScale, wordScale);
    ctx.translate(-196.5, -MARK_Y);
    ctx.drawImage(art.ock, ...WORD.ock);
    ctx.drawImage(art.rop, ...WORD.rop);
    ctx.restore();
  }

  ctx.save();
  ctx.globalAlpha = wordOpacity;
  ctx.translate(196.5, MARK_Y);
  ctx.rotate((810 * spinRotate(t) * Math.PI) / 180);
  ctx.translate(-196.5, -MARK_Y);
  const grow = dGrow(t);
  ctx.drawImage(art.d0, ...lerpRect(WORD.d0, D0_PAIR, grow));
  const d1 = lerpRect(WORD.d1, D1_PAIR, grow);
  const cx = d1[0] + d1[2] / 2;
  const cy = d1[1] + d1[3] / 2;
  ctx.translate(cx, cy);
  ctx.rotate((180 * d1PreSpin(t) * Math.PI) / 180);
  ctx.translate(-cx, -cy);
  ctx.drawImage(art.d1, ...d1);
  ctx.restore();
}

/**
 * Plays the splash once each time `run` changes to a new number (0 = hold the blank first frame).
 * `onDone` runs when it reaches the logo. Reduced motion shows the logo straight away.
 * @param {{ run: number, reduced?: boolean, onDone?: () => void, label?: string }} props
 */
export function AppSplash({ run, reduced = false, onDone, label }) {
  const canvasRef = useRef(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const container = new Path2D(CONTAINER_PATH);
    let art = null;
    let frame = 0;
    let timer = 0;
    let start = 0;
    let progress = 0;
    let cancelled = false;

    const paint = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      ctx.imageSmoothingQuality = 'high';
      if (art) drawFrame(ctx, progress, art, container, w, h);
      else {
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, w, h);
      }
    };
    const tick = (now) => {
      if (cancelled) return;
      if (!start) start = now;
      progress = Math.min(1, (now - start) / SPLASH_MS);
      paint();
      if (progress < 1) frame = requestAnimationFrame(tick);
      else doneRef.current?.();
    };

    paint();
    Promise.all(ART.map(loadImage)).then(([d0, d1, ock, rop]) => {
      if (cancelled) return;
      if (!d0 || !d1 || !ock || !rop) {
        setFailed(true);
        if (run) timer = window.setTimeout(() => doneRef.current?.(), 700);
        return;
      }
      art = { d0, d1, ock, rop };
      if (!run) return paint();
      if (reduced) {
        progress = 1;
        paint();
        timer = window.setTimeout(() => doneRef.current?.(), 700);
      } else {
        frame = requestAnimationFrame(tick);
      }
    });
    window.addEventListener('resize', paint);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('resize', paint);
    };
  }, [run, reduced]);

  if (failed) {
    return (
      <div className="app-splash grid place-items-center" role="img" aria-label={label}>
        <BrandMark size={128} className="w-[42%] h-auto" />
      </div>
    );
  }
  return <canvas ref={canvasRef} className="app-splash" role="img" aria-label={label} />;
}
