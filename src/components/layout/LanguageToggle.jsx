import { motion } from 'motion/react';
import { useLanguage } from '../../lib/useLanguage.jsx';
import { track } from '../../lib/analytics.js';

/** Pill `മല | EN` (6.5). Motion owns it. */
export function LanguageToggle({ dark }) {
  const { lang, setLang, t } = useLanguage();
  const options = [
    { id: 'ml', label: 'മല', name: t('aria.langMl'), labelLang: 'ml' },
    { id: 'en', label: 'EN', name: t('aria.langEn'), labelLang: 'en' },
  ];

  return (
    <div
      role="group"
      aria-label={t('aria.langToggle')}
      className="relative flex h-9 items-center rounded-full p-0.5"
      style={{ border: `1px solid ${dark ? 'rgba(233,238,234,0.35)' : 'rgba(21,22,14,0.25)'}` }}
    >
      {options.map((o) => {
        const isActive = lang === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={isActive}
            aria-label={o.name}
            onClick={() => {
              if (!isActive) {
                setLang(o.id);
                track('language_switch', { to: o.id });
              }
            }}
            className="relative z-10 flex h-8 min-w-[44px] items-center justify-center rounded-full px-3 text-[13px] font-semibold"
            style={{ color: isActive ? 'var(--ledger)' : dark ? 'var(--paper)' : 'var(--ledger)' }}
          >
            {isActive && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-turmeric"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span lang={o.labelLang} className={o.labelLang === 'ml' ? 'font-ml' : 'font-sora'}>
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
