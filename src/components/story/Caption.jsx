import { AnimatePresence, motion } from 'motion/react';
import { T, useLanguage } from '../../lib/useLanguage.jsx';
import { FeatureChips } from './FeatureChips.jsx';
import { BrandMark } from '../layout/BrandMark.jsx';
import { SweepText } from './SweepText.jsx';

/** Caption plate tint per sky preset (RGB of the sky's lower colour), so the plate melts into the sky. */
const PLATE = {
  night: '30 33 22',
  dusk: '21 22 14',
  morningDull: '238 240 232',
  morning: '246 248 241',
  afternoon: '238 241 230',
  evening: '122 78 94',
};

// The plate (--plate) fades in with the first text line, after the new sky has mostly crossfaded in,
// so a frosted patch never shows over the previous stage.
const container = {
  hidden: { '--plate': 0 },
  show: {
    '--plate': 1,
    transition: { '--plate': { delay: 0.45, duration: 0.5, ease: 'easeOut' }, delayChildren: 0.45, staggerChildren: 0.08 },
  },
  exit: { y: -16, opacity: 0, '--plate': 0, transition: { duration: 0.3 } },
};
const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } },
};

/**
 * Caption band (6.2 + Design amendment 1): optional time label, main line with the reading highlight,
 * optional subline, chips (Part B), extras. Sits at the bottom of the full-screen scene on a feathered frosted plate (.caption-plate), no gradient band.
 * Motion owns its enter / exit. Static (reduced motion) panels render it without animation or sweep.
 */
export function Caption({ stage, show, isStatic, dark, activeChip, children }) {
  const { lang, t } = useLanguage();
  const { id } = stage;
  const hasSubline = stage.subline && t(`stage.${id}.subline`);

  return (
    <div className="caption-block" style={{ color: dark ? 'var(--paper)' : 'var(--ledger)' }}>
      <AnimatePresence>
        {show && (
          <motion.div
            key={id}
            className="caption-plate"
            style={{ '--scrim': PLATE[stage.sky] ?? (dark ? '21 22 14' : '238 241 230') }}
            variants={container} initial={isStatic ? false : 'hidden'} animate="show" exit="exit">
            {stage.timeLabel && (
              <motion.p variants={item} className="t-time m-0 mb-2 opacity-80">
                <T k={`stage.${id}.time`} />
              </motion.p>
            )}
            <motion.h2 variants={item} className="t-caption m-0">
              {id === 'b1' && <BrandMark size={32} className="mr-2 inline-block align-[-0.12em]" />}
              <SweepText text={t(`stage.${id}.caption`)} lang={lang} dark={dark} play={!isStatic} />
            </motion.h2>
            {hasSubline && (
              <motion.p variants={item} className="t-subline m-0 mt-2 opacity-85">
                <T k={`stage.${id}.subline`} />
              </motion.p>
            )}
            <FeatureChips ids={stage.chips} activeId={activeChip} dark={dark} itemVariants={item} />
            {children && <motion.div variants={item}>{children}</motion.div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
