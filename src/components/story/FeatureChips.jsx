import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { T, useLanguage } from '../../lib/useLanguage.jsx';

/**
 * Feature chips (6.3). The active chip follows what the scene shows (scenes call setActiveChip).
 * On mobile the row scrolls horizontally and the active chip is centred.
 */
export function FeatureChips({ ids, activeId, dark, itemVariants }) {
  const { lang } = useLanguage();
  const rowRef = useRef(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !activeId) return;
    const chip = row.querySelector(`[data-chip="${activeId}"]`);
    if (!chip || row.scrollWidth <= row.clientWidth) return;
    // Centre the chip inside the row only (scrollIntoView could also move the locked page).
    row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' });
  }, [activeId]);

  if (!ids.length) return null;
  const border = dark ? 'rgba(233,238,234,0.25)' : 'rgba(21,22,14,0.25)';

  return (
    <motion.ul ref={rowRef} className="chip-row mt-4 list-none p-0" variants={itemVariants} role="list">
      {ids.map((id) => {
        const isActive = id === activeId;
        return (
          <li key={id} data-chip={id} className="shrink-0">
            <span
              lang={lang}
              aria-current={isActive ? 'true' : undefined}
              className="t-chip inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 transition-colors duration-300"
              style={{
                border: `1px solid ${isActive ? 'var(--turmeric)' : border}`,
                background: isActive ? 'var(--turmeric)' : 'transparent',
                color: isActive ? 'var(--ledger)' : 'inherit',
              }}
            >
              {isActive ? (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 6.5l2.5 2.5L10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-turmeric" />
              )}
              <T k={`chip.${id}`} />
            </span>
          </li>
        );
      })}
    </motion.ul>
  );
}
