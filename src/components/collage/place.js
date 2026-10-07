import manifest from '../../art/manifest.json';

/**
 * Positioning on the 1920×1200 scene canvas (Design amendment 1). Everything placed in a scene uses
 * canvas units; these helpers turn them into percentages of the camera canvas.
 */

/** @param {number} x @param {number} y @param {number} w @param {number} [h] */
export function place(x, y, w, h) {
  const style = { position: 'absolute', left: `${x / 19.2}%`, top: `${y / 12}%`, width: `${w / 19.2}%` };
  if (h !== undefined) style.height = `${h / 12}%`;
  return style;
}

/**
 * <img> attributes for a built art image (`npm run art`): the @1x file plus the 2× file in srcSet,
 * and its intrinsic size from the manifest. Null if the key isn't built.
 * @param {string} key  manifest key, e.g. "photos/b1-hand-phone"
 */
export function artImg(key) {
  const m = manifest[key];
  if (!m) return null;
  return { src: `/art/${key}@1x.webp`, srcSet: `/art/${key}@1x.webp ${m.w}w, /art/${key}.webp ${m.w * 2}w`, width: m.w, height: m.h };
}

/**
 * `sizes` for an image that is `w` canvas units wide. The canvas is max(100vw, 160svh) wide, so the
 * image is roughly w/1920 of that.
 * @param {number} w
 */
export function sizesFor(w) {
  const p = (w / 1920) * 100;
  return `max(${p.toFixed(1)}vw, ${(p * 1.6).toFixed(1)}vh)`;
}
