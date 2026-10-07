import { motion } from 'motion/react';
import { T, useLanguage } from '../lib/useLanguage.jsx';
import { startTrial } from '../lib/whatsapp.js';
import { track } from '../lib/analytics.js';
import { reveal } from './reveal.js';

const PLANS = [
  { id: 'monthly', name: 'pricing.monthly', price: '349', per: 'pricing.perMonth', note: 'pricing.monthlyNote' },
  { id: 'halfYear', name: 'pricing.halfYear', price: '1,799', per: 'pricing.perHalfYear', note: 'pricing.halfYearNote' },
  { id: 'yearly', name: 'pricing.yearly', price: '3,199', per: 'pricing.perYear', note: 'pricing.yearlyNote', best: true },
];

/** Pricing (13.2): one price for the whole business; yearly highlighted by colour, not height. */
export function Pricing() {
  const { t, lang } = useLanguage();
  const onTrial = () => {
    track('trial_click', { location: 'pricing' });
    startTrial(t('wa.trial'));
  };
  return (
    <section id="pricing" className="post-section">
      <div className="post-wrap">
        <motion.h2 {...reveal()} className="t-h2 m-0 max-w-[20ch]">
          <T k="pricing.h2" />
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-4 tablet:grid-cols-3 desktop:mt-14 desktop:gap-5">
          {PLANS.map((p, i) => (
            <motion.div key={p.id} {...reveal(0.06 * i)} className={`plan ${p.best ? 'plan--best' : ''}`}>
              <div className="flex items-center justify-between gap-3">
                <span className="plan__name" lang={lang}>
                  {t(p.name)}
                </span>
                {p.best && (
                  <span className="plan__badge" lang={lang}>
                    {t('pricing.best')}
                  </span>
                )}
              </div>
              <div className="plan__price tnum">
                <span className="plan__rupee">₹</span>
                {p.price}
                <span className="plan__per" lang={lang}>
                  {t(p.per)}
                </span>
              </div>
              <p className="plan__note" lang={lang}>
                {t(p.note)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div {...reveal(0.1)} className="mt-8 flex flex-col gap-5 desktop:flex-row desktop:items-center desktop:justify-between">
          <p className="m-0 max-w-[60ch] text-[15px] font-medium text-ink-2" lang={lang}>
            {t('pricing.line')}
          </p>
          <motion.button type="button" onClick={onTrial} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="btn-dark self-start">
            <span lang={lang}>{t('freeTrial')}</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
