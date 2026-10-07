import { motion } from 'motion/react';
import { T, useLanguage } from '../../lib/useLanguage.jsx';
import { waLink } from '../../lib/whatsapp.js';
import { track } from '../../lib/analytics.js';
import { LanguageToggle } from './LanguageToggle.jsx';
import { BrandMark } from './BrandMark.jsx';

export function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z"
      />
    </svg>
  );
}

/**
 * Fixed header (6.1). Transparent; the wordmark follows dark / light stages (0.3 s).
 * @param {{ dark: boolean, storyActive: boolean, solid: boolean, onSkip: () => void, onHome: () => void }} props
 */
export function Header({ dark, storyActive, solid, onSkip, onHome }) {
  const { t } = useLanguage();
  const ink = dark ? 'var(--paper)' : 'var(--ledger)';

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--header-h)] items-center justify-between gap-2 pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] desktop:pl-[max(32px,env(safe-area-inset-left))] desktop:pr-[max(32px,env(safe-area-inset-right))]"
      initial={false}
      animate={{
        color: ink,
        backgroundColor: solid ? 'rgba(233,238,234,0.92)' : 'rgba(233,238,234,0)',
      }}
      transition={{ duration: 0.3 }}
      style={{ backdropFilter: solid ? 'blur(8px)' : 'none' }}
    >
      <motion.button
        type="button"
        onClick={onHome}
        aria-label={t('aria.home')}
        whileHover={{ opacity: 0.8 }}
        whileTap={{ scale: 0.97 }}
        className="flex min-h-[44px] items-center gap-2 rounded-lg"
      >
        <BrandMark size={30} />
        <span className="font-sora text-[19px] font-bold tracking-tight max-[379px]:hidden">DockDrop</span>
      </motion.button>

      <nav className="flex items-center gap-2 desktop:gap-4">
        <LanguageToggle dark={dark} />
        <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-current opacity-20 desktop:mx-0" />

        {storyActive && (
          <motion.button
            type="button"
            onClick={onSkip}
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.96 }}
            className="flex h-11 min-w-[44px] items-center justify-center rounded-full text-sm font-semibold desktop:px-1"
            aria-label={t('skip')}
          >
            <T k="skip" className="hidden underline decoration-1 underline-offset-4 desktop:inline" aria-hidden="true" />
            <svg className="desktop:hidden" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 5l7 7-7 7M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}

        <motion.a
          href={waLink(t('wa.message'))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('aria.whatsapp')}
          whileHover={{ y: -1, boxShadow: '0 10px 28px rgba(150, 175, 20, 0.45), 0 2px 6px rgba(21, 22, 14, 0.16)' }}
          whileTap={{ scale: 0.96, y: 0 }}
          style={{ boxShadow: '0 6px 20px rgba(150, 175, 20, 0.32), 0 1px 3px rgba(21, 22, 14, 0.14)' }}
          className="flex h-11 items-center gap-2 rounded-btn bg-turmeric px-3 font-semibold text-ledger desktop:px-4"
          onClick={() => track('whatsapp_click', { location: 'header' })}
        >
          <WhatsAppIcon />
          <span className="text-sm max-[479px]:hidden">{t('whatsapp')}</span>
        </motion.a>
      </nav>
    </motion.header>
  );
}
