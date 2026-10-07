import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { T, useLanguage } from '../lib/useLanguage.jsx';
import { waLink, startTrial } from '../lib/whatsapp.js';
import { track } from '../lib/analytics.js';
import { WhatsAppIcon } from '../components/layout/Header.jsx';
import { PhoneShot } from '../components/collage/PhoneShot.jsx';
import { AppSplash } from '../components/collage/AppSplash.jsx';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import { reveal } from './reveal.js';

const LOGO_HOLD = 400; // ms on the finished logo before the dashboard fades in

/**
 * The CTA phone: each time it scrolls into view the app's own splash plays (logo forming), then the
 * real owner dashboard fades in, as when the seller opens DockDrop.
 */
function CtaPhone() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [run, setRun] = useState(0);
  const [dash, setDash] = useState(false);
  const holdRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setRun(1);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(holdRef.current);
        setDash(false);
        if (entry.isIntersecting) setRun((n) => n + 1);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(holdRef.current);
    };
  }, []);

  const onDone = () => {
    holdRef.current = window.setTimeout(() => setDash(true), LOGO_HOLD);
  };

  return (
    <div ref={ref} className="cta-phone">
      <PhoneShot frame="bare" inline sizes="300px" part="cta-phone" screens={['b1-dashboard']}>
        <div className={`cta-splash${dash ? ' is-done' : ''}`}>
          <AppSplash run={run} reduced={reduced} onDone={onDone} label={t('cta.splash')} />
        </div>
      </PhoneShot>
    </div>
  );
}

/** Final CTA (13.4): the one deliberate dark band, the DockDrop app on a phone on the right. */
export function FinalCta() {
  const { t, lang } = useLanguage();
  return (
    <section id="contact" className="cta-band">
      <div className="post-wrap grid grid-cols-1 items-center gap-10 desktop:grid-cols-12">
        <motion.div {...reveal()} className="desktop:col-span-6">
          <h2 className="t-h2 m-0 max-w-[16ch] text-paper">
            <T k="cta.h2" />
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href={waLink(t('wa.message'))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { location: 'final_cta' })}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary"
            >
              <WhatsAppIcon />
              <span lang={lang}>{t('whatsapp')}</span>
            </motion.a>
            <motion.button
              type="button"
              onClick={() => {
                track('trial_click', { location: 'final_cta' });
                startTrial(t('wa.trial'));
              }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline"
            >
              <span lang={lang}>{t('freeTrial')}</span>
            </motion.button>
          </div>
          <p className="mt-6 text-[15px] font-medium text-paper/70" lang={lang}>
            {t('cta.line')}
          </p>
        </motion.div>

        <motion.div {...reveal(0.1)} className="relative desktop:col-span-6">
          {/* the app, not the van: the seller runs DockDrop from the phone */}
          <CtaPhone />
        </motion.div>
      </div>
    </section>
  );
}
