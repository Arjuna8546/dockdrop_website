import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { COPY } from '../content/copy.js';

/** @typedef {'ml'|'en'} Lang */

const STORAGE_KEY = 'dockdrop.lang';
const LANGS = ['ml', 'en'];

/** @returns {Lang} */
function initialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
  } catch {
    /* ignore */
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(stored)) return stored;
  } catch {
    /* storage blocked */
  }
  return 'ml';
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const t = useCallback(
    (key) => {
      const entry = COPY[key];
      if (!entry) {
        if (import.meta.env.DEV) console.warn(`[copy] missing key: ${key}`);
        return '';
      }
      return entry[lang];
    },
    [lang],
  );

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked */
    }
    // Keep a ?lang= in the URL in sync so a reload doesn't override the visitor's choice.
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', next);
        window.history.replaceState(null, '', url);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // <html lang>, <title>, meta description follow the language (6.5, 15.3)
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = COPY['meta.title'][lang];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', COPY['meta.description'][lang]);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** @returns {{ lang: Lang, setLang: (l: Lang) => void, t: (key: string) => string }} */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}

/**
 * Text that crossfades on language change (Motion, 0.2 s) without remounting its parents,
 * so running stage timelines are never restarted.
 */
export function T({ k, as = 'span', className, ...rest }) {
  const { lang, t } = useLanguage();
  const text = t(k);
  const Comp = motion[as];
  return (
    <Comp
      key={lang}
      lang={lang}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...rest}
    >
      {text}
    </Comp>
  );
}
