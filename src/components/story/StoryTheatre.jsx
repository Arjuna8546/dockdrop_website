import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { STAGES } from '../../content/stages.js';
import { T, useLanguage } from '../../lib/useLanguage.jsx';
import { A1Scene, A2Scene, A3Scene, A4Scene, TScene } from '../../scenes/PartA.jsx';
import { B1Scene, B2Scene, B3Scene, B4Scene } from '../../scenes/PartB.jsx';

import { ScrollHint } from './ScrollHint.jsx';

const SCENES = { a1: A1Scene, a2: A2Scene, a3: A3Scene, a4: A4Scene, t: TScene, b1: B1Scene, b2: B2Scene, b3: B3Scene, b4: B4Scene };

/** Rewind button on stage `t` (12.5). Click = next stage. */
function RewindButton({ onClick, reduced }) {
  return (
    <div className="relative mt-5 inline-block">
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-turmeric"
          animate={{ scale: [1, 1.08], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex min-h-[48px] items-center gap-2 rounded-full bg-turmeric px-5 py-3 font-semibold text-ledger shadow-ui"
      >
        <T k="rewindBtn" className="t-chip text-[15px]" />
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </div>
  );
}

/**
 * Full-screen story theatre (3.2). All stages stack inside; only the active one is visible.
 * With reduced motion it renders the stages as a normal vertical page (3.4).
 */
export const StoryTheatre = forwardRef(function StoryTheatre({ nav, scenesRef, reduced }, ref) {
  const { t } = useLanguage();
  const { index, hasNavigated, next } = nav;

  return (
    <div ref={ref} className={`theatre${reduced ? ' is-static' : ''}`} aria-label={t('aria.story')} role="region">
      {STAGES.map((stage, i) => {
        const Scene = SCENES[stage.id];
        return (
        <Scene
          key={stage.id}
          ref={(h) => {
            scenesRef.current[i] = h;
          }}
          stage={stage}
          active={!reduced && i === index}
          isStatic={reduced}
          {...(stage.id === 't' ? { captionExtra: <RewindButton onClick={next} reduced={reduced} /> } : {})}
        />
        );
      })}

      {!reduced && <ScrollHint visible={index === 0 && !hasNavigated} reduced={reduced} />}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {!reduced && hasNavigated ? t(`stage.${STAGES[index].id}.name`) : ''}
      </div>
    </div>
  );
});
