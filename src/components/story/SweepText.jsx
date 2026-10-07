import { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';

const PER_CHAR = 0.05; // seconds per character before scaling
const MIN_TOTAL = 1.0;
const MAX_TOTAL = 1.6;
const MIN_WORD = 0.12;

const graphemes = (() => {
  try {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return (s) => [...seg.segment(s)].length;
  } catch {
    return (s) => [...s].length;
  }
})();

/**
 * Caption line with a reading highlight (Design amendment 1).
 * Words start dim; a gradient clipped to the text runs across each word in reading order, so the
 * line lights up like it's being read. Split only at spaces, so Malayalam conjuncts are never broken
 * and screen readers still get normal words. Motion owns it.
 *
 * @param {{ text: string, lang: string, dark: boolean, play: boolean, delay?: number }} props
 *   play=false (reduced motion / static) → fully lit.
 *   A language change after mount shows the new text fully lit (no replay).
 */
export function SweepText({ text, lang, dark, play, delay = 0.6 }) {
  const firstText = useRef(text);
  const [done, setDone] = useState(false);
  const lit = !play || done || text !== firstText.current;

  const words = useMemo(() => {
    const parts = text.split(/(\s+)/).filter(Boolean);
    const timed = parts.map((p) => ({ text: p, space: /^\s+$/.test(p), dur: Math.max(MIN_WORD, graphemes(p) * PER_CHAR) }));
    const total = timed.filter((w) => !w.space).reduce((s, w) => s + w.dur, 0) || 1;
    const scale = Math.min(Math.max(total, MIN_TOTAL), MAX_TOTAL) / total;
    let t = delay;
    return timed.map((w) => {
      if (w.space) return w;
      const out = { ...w, delay: t, dur: w.dur * scale };
      t += out.dur;
      return out;
    });
  }, [text, delay]);

  const lastIndex = words.reduce((last, w, i) => (w.space ? last : i), -1);
  // Explicit colours: currentColor would resolve to transparent on the clipped spans.
  const full = dark ? 'var(--paper)' : 'var(--ledger)';
  const dim = dark ? 'rgba(233,238,234,0.28)' : 'rgba(21,22,14,0.28)';
  const edge = dark ? 'var(--turmeric)' : full;
  const gradient = `linear-gradient(90deg, ${full} 0%, ${full} 44%, ${edge} 50%, ${dim} 56%, ${dim} 100%)`;

  return (
    <motion.span
      key={lang}
      lang={lang}
      initial={{ opacity: lit ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {words.map((w, i) =>
        w.space ? (
          w.text
        ) : lit ? (
          <span key={i}>{w.text}</span>
        ) : (
          <motion.span
            key={i}
            className="inline-block"
            style={{
              backgroundImage: gradient,
              backgroundSize: '230% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              padding: '0.08em 0',
              margin: '-0.08em 0',
            }}
            initial={{ backgroundPosition: '100% 0%' }}
            animate={{ backgroundPosition: '0% 0%' }}
            transition={{ delay: w.delay, duration: w.dur, ease: 'linear' }}
            onAnimationComplete={i === lastIndex ? () => setDone(true) : undefined}
          >
            {w.text}
          </motion.span>
        ),
      )}
    </motion.span>
  );
}
