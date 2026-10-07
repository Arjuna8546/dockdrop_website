import { BILL_BOOK_PAGES } from '../../content/copy.js';
import { place } from './place.js';

/**
 * A handwritten credit bill page (14.4) — always English, printed parts in Inter, handwriting in
 * Kalam. The balance gets a chilli circle (data-part="circle", an SVG path for DrawSVG).
 * Sizes use cqw (the scene canvas is a size container) so the slip scales with the scene.
 *
 * @param {{ page?: number, x: number, y: number, w: number, rot?: number, part?: string, z?: number }} props
 */
export function BillSlip({ page = 0, x, y, w, rot = 0, part = 'slip', z }) {
  const b = BILL_BOOK_PAGES[page];
  return (
    <div data-part={part} className="collage-piece paper-slip" style={{ ...place(x, y, w), rotate: `${rot}deg`, zIndex: z }} aria-hidden="true">
      <div className="paper-slip__head">
        <div className="paper-slip__biz">{b.business}</div>
        <div className="paper-slip__addr">{b.address}</div>
        <div className="paper-slip__row">
          <span className="paper-slip__title">{b.title}</span>
          <span>
            No. <span className="hand">{b.no}</span>
          </span>
        </div>
        <div className="paper-slip__row">
          <span>
            Date: <span className="hand">{b.date}</span>
          </span>
        </div>
        <div className="paper-slip__to">
          To: <span className="hand">{b.to}</span>
        </div>
      </div>
      <table className="paper-slip__table">
        <thead>
          <tr>
            <th>Sl</th>
            <th className="text-left">Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {b.items.map((it, i) => (
            <tr key={it.sl} className="hand" style={{ rotate: `${i % 2 ? 0.8 : -0.7}deg` }}>
              <td>{it.sl}</td>
              <td className="text-left">{it.item}</td>
              <td>{it.qty}</td>
              <td>{it.rate}</td>
              <td>{it.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="paper-slip__totals">
        <div>
          <span>TOTAL</span>
          <span className="hand">{b.total}</span>
        </div>
        <div>
          <span>PAID</span>
          <span className="hand">{b.paid}</span>
        </div>
        <div className="relative">
          <span>BALANCE</span>
          <span className="hand text-chilli">{b.balance}</span>
          <svg className="paper-slip__circle" viewBox="0 0 120 50" preserveAspectRatio="none">
            <path
              data-part={`${part}-circle`}
              d="M18 30 C 14 10, 92 4, 108 20 C 120 34, 70 48, 34 44 C 12 41, 6 26, 28 14"
              fill="none"
              stroke="var(--chilli)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** A torn pink carbon copy slip with a few scribbled lines. */
export function PinkSlip({ x, y, w, rot = 0, part = 'pink', z, amount = '₹1,240' }) {
  return (
    <div data-part={part} className="collage-piece pink-slip" style={{ ...place(x, y, w), rotate: `${rot}deg`, zIndex: z }} aria-hidden="true">
      <div className="pink-slip__line" style={{ width: '70%' }} />
      <div className="pink-slip__line" style={{ width: '52%' }} />
      <div className="pink-slip__line" style={{ width: '64%' }} />
      <div className="hand pink-slip__amt">{amount}</div>
    </div>
  );
}
