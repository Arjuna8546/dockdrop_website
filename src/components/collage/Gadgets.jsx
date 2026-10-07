import { useLanguage } from '../../lib/useLanguage.jsx';
import { place } from './place.js';

/** Desk calculator with an HTML display (data-part="<part>-display"); numbers are never baked into art. */
export function Calculator({ x, y, w, rot = 0, part = 'calc', z, value = '-2,850' }) {
  return (
    <div data-part={part} className="collage-piece calc" style={{ ...place(x, y, w), rotate: `${rot}deg`, zIndex: z }} aria-hidden="true">
      <div className="calc__display">
        <span data-part={`${part}-display`} className="tnum">
          {value}
        </span>
      </div>
      <div className="calc__keys">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} className={i === 15 ? 'calc__key calc__key--eq' : 'calc__key'} />
        ))}
      </div>
    </div>
  );
}

/**
 * Round wall clock: tick marks only (no numerals), SVG hands. Timelines rotate
 * data-part="<part>-hour" / "<part>-min" (transform-origin at the centre).
 * @param {{ time?: [number, number] }} props  initial hours, minutes
 */
export function WallClock({ x, y, w, part = 'clock', z, time = [10, 30] }) {
  const [h, m] = time;
  const hourDeg = ((h % 12) + m / 60) * 30;
  const minDeg = ((h % 12) * 60 + m) * 6; // cumulative, so later tweens move forward
  return (
    <div data-part={part} className="collage-piece" style={{ ...place(x, y, w), aspectRatio: '1', zIndex: z }} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_6px_14px_rgba(21,22,14,0.25)]">
        <circle cx="100" cy="100" r="94" fill="var(--white)" stroke="var(--ledger)" strokeWidth="9" />
        {Array.from({ length: 60 }, (_, i) => (
          <line
            key={i}
            x1="100"
            y1={i % 5 === 0 ? 16 : 18}
            x2="100"
            y2={i % 5 === 0 ? 32 : 24}
            stroke="var(--ledger)"
            strokeWidth={i % 5 === 0 ? 5 : 2}
            strokeLinecap="round"
            transform={`rotate(${i * 6} 100 100)`}
          />
        ))}
        <g data-part={`${part}-hour`} style={{ transformOrigin: '100px 100px', transformBox: 'view-box' }} transform={`rotate(${hourDeg} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="56" stroke="var(--ledger)" strokeWidth="9" strokeLinecap="round" />
        </g>
        <g data-part={`${part}-min`} style={{ transformOrigin: '100px 100px', transformBox: 'view-box' }} transform={`rotate(${minDeg} 100 100)`}>
          <line x1="100" y1="100" x2="100" y2="34" stroke="var(--ledger)" strokeWidth="6" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="7" fill="var(--chilli)" />
      </svg>
    </div>
  );
}

/** Tear-off wall calendar: month from copy, date as HTML (data-part="<part>-date"), tearable pages. */
export function WallCalendar({ x, y, w, part = 'cal', z, date = 5, pages = 6 }) {
  const { t } = useLanguage();
  return (
    <div data-part={part} className="collage-piece calendar" style={{ ...place(x, y, w), zIndex: z }} aria-hidden="true">
      <div className="calendar__ring" />
      <div className="calendar__month">{t('calendar.month')}</div>
      <div className="calendar__stack">
        <div className="calendar__page calendar__page--base">
          <span data-part={`${part}-date`} className="tnum">
            {date + pages}
          </span>
        </div>
        {Array.from({ length: pages }, (_, i) => (
          <div key={i} data-part={`${part}-page`} className="calendar__page" style={{ zIndex: pages - i }}>
            <span className="tnum">{date + i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Round "?" bubble (Part A confusion beats). */
export function Bubble({ x, y, w, part, z, children = '?' }) {
  return (
    <div data-part={part} className="collage-piece bubble" style={{ ...place(x, y, w), aspectRatio: '1', zIndex: z }} aria-hidden="true">
      <span>{children}</span>
    </div>
  );
}

/** The road the van drives on (CSS only), full canvas width. */
export function Road({ y = 760, h = 110, part = 'road' }) {
  return (
    <div data-part={part} className="collage-piece road" style={{ ...place(-200, y, 2320, h), zIndex: 0 }} aria-hidden="true">
      <div data-part={`${part}-dashes`} className="road__dashes" />
    </div>
  );
}
