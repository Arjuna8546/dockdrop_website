// The DockDrop app's splash timeline ("The Fit"), the same intervals and curves as the app
// (dispatchdesk_flutter/lib/features/splash/splash_timings.dart, ported in the web app's splashTimeline.js),
// played a little faster on the website: every time is scaled by SPEED.

const SPEED = 0.65;
const APP_MS = 6700;
export const SPLASH_MS = APP_MS * SPEED;

// Flutter's Cubic: solve x for t by bisection, then return y.
function cubic(a, b, c, d) {
  const evaluate = (p, q, m) => 3 * p * (1 - m) * (1 - m) * m + 3 * q * (1 - m) * m * m + m * m * m;
  return (t) => {
    let start = 0;
    let end = 1;
    for (let i = 0; i < 60; i += 1) {
      const mid = (start + end) / 2;
      const estimate = evaluate(a, c, mid);
      if (Math.abs(t - estimate) < 0.001) return evaluate(b, d, mid);
      if (estimate < t) start = mid;
      else end = mid;
    }
    return evaluate(b, d, (start + end) / 2);
  };
}

// Flutter's Interval: the curve runs between `begin` and `end` (app ms) and holds outside them.
function interval(beginMs, endMs, curve) {
  return (t) => {
    const local = Math.min(1, Math.max(0, (t * APP_MS - beginMs) / (endMs - beginMs)));
    return local === 0 || local === 1 ? local : curve(local);
  };
}

const enter = cubic(0.22, 1.0, 0.36, 1.0);
const flip = cubic(0.45, 0.0, 0.55, 1.0);
const easeOut = cubic(0.0, 0.0, 0.58, 1.0);
const fastOutSlowIn = cubic(0.4, 0.0, 0.2, 1.0);

export const wordmarkIn = interval(0, 550, enter);
export const letterFadeOut = interval(550, 1050, easeOut);
export const dGrow = interval(1050, 2150, enter);
export const d1PreSpin = interval(2150, 2850, flip);
export const spinRotate = interval(2850, 6000, flip);
export const containerBloom = interval(2850, 5600, fastOutSlowIn);
