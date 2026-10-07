import { AnimatePresence, motion } from 'motion/react';
import { T } from '../../lib/useLanguage.jsx';
import { useMediaQuery } from '../../lib/useMediaQuery.js';

/** Mouse with a moving wheel (desktop). */
function MouseIcon() {
  return (
    <svg width="22" height="32" viewBox="0 0 22 32" aria-hidden="true">
      <rect x="1.5" y="1.5" width="19" height="29" rx="9.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="9.5" y="7" width="3" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}

/** Finger swiping up (touch). */
function SwipeIcon() {
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2v8M10.5 5.5 14 2l3.5 3.5" />
      <path d="M11 30v-4.5l-3.6-4a2 2 0 0 1 2.9-2.8L12 20.5V13a2 2 0 0 1 4 0v5.2l5.2 1a3 3 0 0 1 2.4 3.3L23 30" />
    </svg>
  );
}

/** a1 only (6.6): bobbing hint, hidden after the first navigation. Swipe icon on touch, mouse elsewhere.
 * Phones: icon and label on one line, so it stays under the caption (now with a description line). */
export function ScrollHint({ visible, reduced }) {
  const coarse = useMediaQuery('(pointer: coarse)'); // touch-first devices (phones, tablets)
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 flex-row items-center gap-2 whitespace-nowrap text-paper desktop:flex-col desktop:gap-1 desktop:left-auto desktop:right-[6vw] desktop:translate-x-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            animate={reduced ? undefined : { y: [-6, 6] }}
            transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
          >
            {coarse ? <SwipeIcon /> : <MouseIcon />}
          </motion.div>
          <T k={coarse ? 'swipeHint' : 'scrollHint'} className="t-time" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
