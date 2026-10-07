import { motion } from 'motion/react';
import { artImg } from '../components/collage/place.js';
import { T, useLanguage } from '../lib/useLanguage.jsx';
import { waLink } from '../lib/whatsapp.js';
import { track } from '../lib/analytics.js';
import { BrandMark } from '../components/layout/BrandMark.jsx';
import { WhatsAppIcon } from '../components/layout/Header.jsx';
import { reveal } from './reveal.js';

/**
 * Trust (13.1): an asymmetric 4-tile grid (exactly four cells). The Malayalam tile shows a real
 * screenshot of the app in Malayalam; the founder tile carries the direct WhatsApp line.
 */
export function Trust() {
  const { t, lang } = useLanguage();
  const shot = artImg('screens/b1-dashboard-ml');
  return (
    <section id="trust" tabIndex={-1} className="post-section outline-none">
      <div className="post-wrap">
        <motion.h2 {...reveal()} className="t-h2 m-0 max-w-[18ch]">
          <T k="trust.h2" />
        </motion.h2>

        <div className="mt-10 grid grid-cols-1 gap-4 tablet:grid-cols-12 desktop:mt-14 desktop:gap-5">
          {/* Made in Thrissur — the founder, reachable */}
          <motion.article {...reveal(0.05)} className="trust-tile tablet:col-span-7">
            <div className="flex items-center gap-3">
              <BrandMark size={44} />
              <span className="t-chip opacity-70" lang={lang}>
                {t('trust.founder')}
              </span>
            </div>
            <h3 className="trust-tile__title" lang={lang}>
              {t('trust.made')}
            </h3>
            <p className="trust-tile__body" lang={lang}>
              {t('trust.madeBody')}
            </p>
            <motion.a
              href={waLink(t('wa.message'))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { location: 'trust' })}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary mt-auto self-start"
            >
              <WhatsAppIcon />
              <span lang={lang}>{t('whatsapp')}</span>
            </motion.a>
          </motion.article>

          {/* Fully in Malayalam — the real app, in Malayalam */}
          <motion.article {...reveal(0.1)} className="trust-tile trust-tile--lime tablet:col-span-5 tablet:row-span-2">
            <h3 className="trust-tile__title" lang={lang}>
              {t('trust.malayalam')}
            </h3>
            <p className="trust-tile__body" lang={lang}>
              {t('trust.malayalamBody')}
            </p>
            <div className="trust-shot">
              <img
                {...shot}
                sizes="(min-width: 768px) 300px, 70vw"
                alt={t('trust.screenAlt')}
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.article>

          {/* Your data is yours */}
          <motion.article {...reveal(0.15)} className="trust-tile tablet:col-span-4">
            <span className="trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8.2 7.5 9.5 4.4-1.3 7.5-5.1 7.5-9.5V6z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M12 8v6m-3-3h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <h3 className="trust-tile__title" lang={lang}>
              {t('trust.data')}
            </h3>
            <p className="trust-tile__body" lang={lang}>
              {t('trust.dataBody')}
            </p>
          </motion.article>

          {/* Our first customer */}
          <motion.article {...reveal(0.2)} className="trust-tile trust-tile--dark tablet:col-span-3">
            <h3 className="trust-tile__title" lang={lang}>
              {t('trust.first')}
            </h3>
            <p className="trust-tile__quote" lang={lang}>
              {t('trust.firstBody')}
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
