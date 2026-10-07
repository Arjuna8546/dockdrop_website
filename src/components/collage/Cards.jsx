import { useLanguage } from '../../lib/useLanguage.jsx';
import { RECEIPT } from '../../content/copy.js';
import { BrandMark } from '../layout/BrandMark.jsx';
import { WhatsAppIcon } from '../layout/Header.jsx';
import { place } from './place.js';

/*
 * The DockDrop side of the collage: crisp app-style cards over the photos ("the world is
 * photographed, the app is crisp"). All text from copy.js; sizes in cqw so cards scale with the
 * scene canvas. GSAP moves the card wrappers (data-part); nothing here animates itself.
 */

function Card({ x, y, w, rot = 0, part, z, className = '', children }) {
  return (
    <div
      data-part={part}
      className={`collage-piece ui-card ${className}`}
      style={{ ...place(x, y, w), rotate: `${rot}deg`, zIndex: z }}
    >
      {children}
    </div>
  );
}

function Tick({ part, done = false }) {
  return (
    <span data-part={part} className={`ui-tick ${done ? 'ui-tick--done' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 12 12">
        <path d="M2.5 6.4 5 8.8 9.6 3.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** WhatsApp-style message banner (a1). */
export function Notification({ n, x, y, w, part, z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="notif">
      <span className="notif__icon">
        <WhatsAppIcon size={18} />
      </span>
      <span className="notif__body" lang={lang}>
        <span className="notif__from">{t(`notif${n}.from`)}</span>
        <span className="notif__msg">{t(`notif${n}.msg`)}</span>
      </span>
    </Card>
  );
}

/** Small stat card used around the phone (b1 home). */
export function StatCard({ k, x, y, w, part, z, alert = false }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="stat-card">
      <span className={`stat-card__dot ${alert ? 'stat-card__dot--alert' : ''}`} />
      <span lang={lang} className="tnum">
        {t(k)}
      </span>
    </Card>
  );
}

/** Van load checklist (b2): rows tick as items load; row 4 first shows "1 left". */
export function VanLoadCard({ x, y, w, part = 'vanload', z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="list-card">
      <div className="list-card__title" lang={lang}>
        {t('vanLoad.title')}
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} data-part={`${part}-row${i}`} className="list-card__row" lang={lang}>
          <Tick part={`${part}-tick${i}`} />
          <span className="list-card__label">{t(`vanLoad.row${i}`)}</span>
          {i === 4 && (
            <span data-part={`${part}-left`} className="list-card__flag">
              {t('vanLoad.left')}
            </span>
          )}
        </div>
      ))}
      <div data-part={`${part}-done`} className="list-card__done" lang={lang}>
        {t('vanLoad.done')}
      </div>
    </Card>
  );
}

/** Delivery challan chip-card (b2). */
export function ChallanCard({ x, y, w, part = 'challan', z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="doc-card">
      <span className="doc-card__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M6 3h8l4 4v14H6z M14 3v4h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span lang={lang}>{t('chip.challan')}</span>
      <Tick done />
    </Card>
  );
}

/** Printed thermal receipt (b3 shop 1) — follows the active language (14.5). */
export function ReceiptCard({ x, y, w, part = 'receipt', z }) {
  const { lang } = useLanguage();
  const r = RECEIPT[lang];
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="receipt">
      <div lang={lang} className="receipt__inner" data-part={`${part}-paper`}>
        <div className="receipt__biz">{r.business}</div>
        <div className="receipt__muted">{r.place}</div>
        <div className="receipt__muted tnum">{r.meta}</div>
        <div className="receipt__rule" />
        {r.items.map(([name, qty, amt]) => (
          <div key={name} className="receipt__row tnum">
            <span>{name}</span>
            <span>{qty}</span>
            <span>{amt}</span>
          </div>
        ))}
        <div className="receipt__rule" />
        <div className="receipt__row receipt__total tnum">
          <span>{r.totalLabel}</span>
          <span />
          <span>{r.total}</span>
        </div>
        <div className="receipt__thanks">{r.thanks}</div>
      </div>
    </Card>
  );
}

/** One-line callout with an icon tone (b3 change / return / offline / credit). */
export function Callout({ k, x, y, w, part, z, tone = 'ok', icon = 'tick', value }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className={`callout callout--${tone}`}>
      <span className="callout__icon" aria-hidden="true">
        {icon === 'tick' && (
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5 10 17 19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {icon === 'cash' && (
          <svg viewBox="0 0 24 24">
            <rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
        {icon === 'tag' && (
          <svg viewBox="0 0 24 24">
            <path d="M3 12V4h8l10 10-8 8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="7.5" cy="8.5" r="1.4" fill="currentColor" />
          </svg>
        )}
        {icon === 'nosignal' && (
          <svg viewBox="0 0 24 24">
            <path d="M4 18h2M9 18v-4M14 18v-8M19 18V6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M3 4l18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {icon === 'limit' && (
          <svg viewBox="0 0 24 24">
            <path d="M12 3 2 20h20z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 9v5M12 17h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span lang={lang} className="callout__text tnum">
        {t(k)}
        {value && <strong className="callout__value">{value}</strong>}
      </span>
    </Card>
  );
}

/** Deterministic QR-like pattern (decorative; not a real payment code). */
function QrPattern() {
  const n = 21;
  const cells = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!finder(r, c) && rnd() > 0.52) cells.push([r, c]);
  const F = ({ r, c }) => (
    <g transform={`translate(${c} ${r})`}>
      <rect width="7" height="7" fill="currentColor" />
      <rect x="1" y="1" width="5" height="5" fill="var(--white)" />
      <rect x="2" y="2" width="3" height="3" fill="currentColor" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges" className="h-full w-full text-ledger">
      {cells.map(([r, c]) => (
        <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="currentColor" />
      ))}
      <F r={0} c={0} />
      <F r={0} c={n - 7} />
      <F r={n - 7} c={0} />
    </svg>
  );
}

/** UPI QR with the amount pre-filled; a scan line and "Paid ✓" (b3 shop 2). */
export function UpiCard({ x, y, w, part = 'upi', z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="upi">
      <div className="upi__head" lang={lang}>
        {t('chip.upi')} · <span className="tnum">{t('upi.amount')}</span>
      </div>
      <div className="upi__qr">
        <QrPattern />
        <span data-part={`${part}-scan`} className="upi__scan" />
      </div>
      <div data-part={`${part}-paid`} className="upi__paid" lang={lang}>
        {t('upi.paid')}
      </div>
    </Card>
  );
}

/** Offline: saved bills stack, then sync (b3 shop 3). */
export function OfflinePile({ x, y, w, part = 'offline', z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="offline">
      <div className="offline__bars" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} data-part={`${part}-bar`} style={{ height: `${25 * i}%` }} />
        ))}
      </div>
      <div className="offline__pile" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} data-part={`${part}-bill`} />
        ))}
      </div>
      <span lang={lang} className="offline__label">
        <span data-part={`${part}-count`} className="tnum">
          3
        </span>{' '}
        · {t('offline.saved')}
      </span>
    </Card>
  );
}

/** Day-end check (b4): expected = collected, stock back, returns. */
export function DayEndCard({ x, y, w, part = 'dayend', z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="list-card">
      <div className="list-card__title" lang={lang}>
        {t('dayEnd.title')}
      </div>
      {['dayEnd.expected', 'dayEnd.collected', 'dayEnd.stock', 'dayEnd.returns'].map((k, i) => (
        <div key={k} data-part={`${part}-row${i + 1}`} className="list-card__row tnum" lang={lang}>
          <Tick done={i > 0 && i < 3} />
          <span className="list-card__label">{t(k)}</span>
        </div>
      ))}
    </Card>
  );
}

/** Shop dues (b4): five shops, two need attention. */
export function DuesCard({ x, y, w, part = 'dues', z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="list-card">
      <div className="list-card__title" lang={lang}>
        {t('dues.title')}
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} data-part={`${part}-row${i}`} className="list-card__row tnum" lang={lang}>
          <span className={`stat-card__dot ${i <= 2 ? 'stat-card__dot--alert' : ''}`} />
          <span className="list-card__label">{t(`dues.shop${i}`)}</span>
          {i <= 2 && <span className="list-card__flag">{t('dues.attention')}</span>}
        </div>
      ))}
    </Card>
  );
}

const LEDGER_ROWS = [
  { tag: 'order', tone: 'plus' },
  { tag: 'receipt', tone: 'minus' },
  { tag: 'return', tone: 'minus' },
  { tag: 'order', tone: 'plus' },
  { tag: 'upi', tone: 'minus' },
];

/**
 * One shop's whole history (b3): credit balance against its limit, then every order, receipt,
 * return and payment, newest last. Rows are `<part>-row<i>`, the limit bar `<part>-bar`, the
 * closing line `<part>-done`; the amounts add up to the balance.
 */
export function ShopLedgerCard({ x, y, w, part = 'ledger', z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="list-card ledger-card">
      <div className="ledger-card__head">
        <span className="list-card__title m-0" lang={lang}>
          {t('ledger.shop')}
        </span>
        <span className="ledger-card__balance" lang={lang}>
          <span className="ledger-card__label">{t('ledger.balance')}</span>
          <span className="ledger-card__amount tnum">{t('ledger.amount')}</span>
        </span>
      </div>
      <div className="ledger-card__limit" lang={lang}>
        <span className="ledger-card__track">
          <span data-part={`${part}-bar`} className="ledger-card__bar" />
        </span>
        <span className="tnum">{t('ledger.limit')}</span>
      </div>
      {LEDGER_ROWS.map((r, i) => (
        <div key={i} data-part={`${part}-row${i + 1}`} className="list-card__row tnum" lang={lang}>
          <span className={`ledger-card__tag ledger-card__tag--${r.tag}`}>{t(`ledger.tag.${r.tag}`)}</span>
          <span className="list-card__label">{t(`ledger.row${i + 1}`)}</span>
          <span className={`ledger-card__amt ledger-card__amt--${r.tone}`}>{t(`ledger.amt${i + 1}`)}</span>
        </div>
      ))}
      <div data-part={`${part}-done`} className="list-card__done" lang={lang}>
        {t('ledger.done')}
      </div>
    </Card>
  );
}

/** Excel export chip (b4 reports). */
export function ExcelChip({ x, y, w, part = 'excel', z }) {
  const { t, lang } = useLanguage();
  return (
    <Card x={x} y={y} w={w} part={part} z={z} className="doc-card">
      <span className="doc-card__icon doc-card__icon--sheet" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 9h16M4 15h16M10 3v18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      <span lang={lang}>{t('chip.reports')}</span>
    </Card>
  );
}

/**
 * DockDrop badge placed on the van in Part B ("same van, now with DockDrop"). Positioned in % of
 * the van photo; the founder's mark plus the wordmark (brand name, same in both languages).
 */
export function VanBadge({ left = 18, top = 26, width = 36, part = 'badge' }) {
  const { t } = useLanguage();
  return (
    <div data-part={part} className="van-badge" style={{ left: `${left}%`, top: `${top}%`, width: `${width}%` }} aria-hidden="true">
      <BrandMark size={40} className="van-badge__mark" />
      <span className="van-badge__word">{t('brand.name')}</span>
    </div>
  );
}
