import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FAQ_KEYS } from '../content/copy.js';
import { T, useLanguage } from '../lib/useLanguage.jsx';
import { waLink } from '../lib/whatsapp.js';
import { track } from '../lib/analytics.js';
import { reveal } from './reveal.js';

/** FAQ (13.3, 14.8): one open at a time, Motion height animation, aria-expanded / aria-controls. */
export function Faq() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <section id="faq" className="post-section">
      <div className="post-wrap grid grid-cols-1 gap-10 desktop:grid-cols-12 desktop:gap-12">
        <motion.div {...reveal()} className="desktop:col-span-4">
          <h2 className="t-h2 m-0">
            <T k="faq.h2" />
          </h2>
          <a
            href={waLink(t('wa.message'))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', { location: 'faq' })}
            className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold underline decoration-turmeric decoration-2 underline-offset-[6px] hover:decoration-ledger"
            lang={lang}
          >
            {t('faq.ask')}
          </a>
        </motion.div>

        <motion.ul {...reveal(0.08)} className="m-0 list-none p-0 desktop:col-span-8">
          {FAQ_KEYS.map((k, i) => {
            const isOpen = open === i;
            const btnId = `${base}-q${i}`;
            const panelId = `${base}-a${i}`;
            return (
              <li key={k} className="faq-item">
                <h3 className="m-0">
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="faq-q"
                  >
                    <span lang={lang}>{t(`${k}.q`)}</span>
                    <motion.span aria-hidden="true" className="faq-plus" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                      <svg viewBox="0 0 20 20" width="18" height="18">
                        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="faq-a" lang={lang}>
                        {t(`${k}.a`)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
