import { T, useLanguage } from '../lib/useLanguage.jsx';
import { waLink } from '../lib/whatsapp.js';
import { track } from '../lib/analytics.js';
import { BrandMark } from '../components/layout/BrandMark.jsx';

/** Footer (13.5): logo, copyright, legal links, login, WhatsApp. */
export function Footer() {
  const { t, lang } = useLanguage();
  const link = 'rounded-md underline-offset-4 hover:text-ledger hover:underline';
  return (
    <footer className="border-t border-ledger/10 bg-paper px-5 py-10 text-mute tablet:px-6">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-6 tablet:flex-row tablet:items-center tablet:justify-between">
        <span className="flex items-center gap-2 font-sora text-[17px] font-bold text-ledger">
          <BrandMark size={26} /> {t('brand.name')}
        </span>
        <nav aria-label={t('aria.footer')} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px]" lang={lang}>
          {/* Privacy policy lives in the web app. TODO before launch: add a Terms page and link it here. */}
          <a className={link} href="https://admin.dockdrop.in/privacy">
            <T k="footer.privacy" />
          </a>
          <a className={link} href="https://admin.dockdrop.in">
            <T k="footer.login" />
          </a>
          <a className={link} href={waLink(t('wa.message'))} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { location: 'footer' })}>
            {t('whatsapp')}
          </a>
          <T k="footer.copy" className="tnum" />
          {/* licence credit for the phone mockup (docs/ART_APPROVALS.md) */}
          <T k="footer.credit" className="text-[13px]" />
        </nav>
      </div>
    </footer>
  );
}
