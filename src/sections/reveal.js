/**
 * Shared Motion props for post-story reveals (13): y 24 → 0, opacity 0 → 1, 0.5 s, once.
 * With reduced motion, MotionConfig (App) turns this into a short fade.
 * @param {number} [delay]
 */
export function reveal(delay = 0) {
  return {
    initial: { y: 24, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  };
}
