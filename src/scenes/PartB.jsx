import { forwardRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { CollageScene } from './CollageScene.jsx';
import { Photo } from '../components/collage/Photo.jsx';
import { PhoneShot } from '../components/collage/PhoneShot.jsx';
import { Road } from '../components/collage/Gadgets.jsx';
import {
  StatCard,
  VanLoadCard,
  ChallanCard,
  ReceiptCard,
  Callout,
  UpiCard,
  OfflinePile,
  DayEndCard,
  DuesCard,
  ExcelChip,
  VanBadge,
  ShopLedgerCard,
} from '../components/collage/Cards.jsx';
import { T } from '../lib/useLanguage.jsx';

/*
 * Part B — the same day with DockDrop. Real app screenshots sit in the owner's phone; the crisp
 * DockDrop cards carry each feature moment, and the chips follow the beats.
 */

const pop = { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.6)' };
const hide = { autoAlpha: 0, y: -14, duration: 0.3, ease: 'power2.in' };

/** Cross-fade the phone's screenshot to `id` (both language variants share data-screen). */
function screenTo(tl, part, all, id, at) {
  all.forEach((s) => tl.to(part('phone')[0]?.querySelectorAll(`[data-screen="${s}"]`) ?? [], { opacity: s === id ? 1 : 0, duration: 0.45 }, at));
}

/** Tick a list-card row: turn its circle lime and pop it. */
function tick(tl, part, name, at) {
  const el = part(name)[0];
  if (!el) return;
  tl.call(() => el.classList.add('ui-tick--done'), [], at);
  tl.fromTo(el, { scale: 0.6 }, { scale: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, at);
}
function untick(tl, part, names, at) {
  tl.call(() => names.forEach((n) => part(n)[0]?.classList.remove('ui-tick--done')), [], at);
}

// Portrait window (800 units wide, content above y≈880): see CollageScene `mobile`.
const B1_MOBILE = {
  // the hand holds the phone into the frame from the bottom right; the screen fills the right half
  phone: { x: 170, y: 110, w: 1650 },
  c1: { x: 80, y: 200, w: 290 },
  c2: { x: 80, y: 360, w: 290 },
  c3: { x: 80, y: 520, w: 290 },
};
/* ---------------- b1 · Phone (hero) · 6:30 AM ---------------- */
export const B1Scene = forwardRef(function B1Scene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={B1_MOBILE}
      keyAt={0.4}
      layers={{
        // the owner's hand reaches into the frame from the bottom-right corner
        chars: <PhoneShot screens={['b1-dashboard']} x={1010} y={430} w={1000} part="phone" z={2} />,
        ui: (
          <>
            <StatCard k="home.todayVan" x={560} y={170} w={390} part="c1" z={3} />
            <StatCard k="home.yesterday" x={600} y={290} w={420} part="c2" z={3} />
            <StatCard k="home.duesShops" x={560} y={410} w={390} part="c3" z={3} alert />
          </>
        ),
      }}
      build={({ part, intro, loop }) => {
        const cards = [part('c1'), part('c2'), part('c3')];
        intro
          .fromTo(part('phone'), { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' }, 0)
          .fromTo(cards, { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 0.35);
        loop.to(part('phone'), { y: -10, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0);
        cards.forEach((c, i) => loop.to(c, { scale: 1.04, duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 1.6 + i * 0.35));
        loop.to({}, { duration: 0.1 }, 4.9);
      }}
    />
  );
});

const B2_MOBILE = {
  van: { x: 20, y: 60, w: 380, r: -3 },
  phone: { x: 470, y: 60, w: 300 },
  vl: { x: 100, y: 500, w: 400 },
  challan: { x: 420, y: 760, w: 300 },
};
/* ---------------- b2 · Loading, the DockDrop way · 6:30 → 6:45 AM ---------------- */
export const B2Scene = forwardRef(function B2Scene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={B2_MOBILE}
      keyAt={0.66}
      keyChip="challan"
      layers={{
        chars: (
          <>
            <Photo id="photos/b2-van-topdown-loading" x={170} y={90} w={470} rot={-3} part="van" z={1} />
            <PhoneShot frame="bare" screens={['b2-assign']} x={1290} y={90} w={340} part="phone" z={2} />
          </>
        ),
        ui: (
          <>
            <VanLoadCard x={690} y={140} w={440} part="vl" z={3} />
            <ChallanCard x={760} y={650} w={330} part="challan" z={3} />
          </>
        ),
      }}
      build={({ part, intro, loop, chip }) => {
        const rows = [1, 2, 3, 4, 5];
        gsap.set(part('vl-left'), { autoAlpha: 0, scale: 0.6 });
        gsap.set(part('vl-done'), { autoAlpha: 0, y: 10 });
        gsap.set(part('challan'), { autoAlpha: 0, x: -60 });
        intro
          .fromTo(part('van'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0)
          .fromTo(part('phone'), { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.1)
          .fromTo(part('vl'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'back.out(1.4)' }, 0.3);

        loop.call(chip, ['vanLoad'], 0);
        loop.fromTo(part('vl'), { scale: 1 }, { scale: 1.02, duration: 0.2, yoyo: true, repeat: 1, immediateRender: false }, 0.3);
        loop.call(chip, ['stockList'], 0.9);
        tick(loop, part, 'vl-tick1', 1.0);
        tick(loop, part, 'vl-tick2', 1.6);
        tick(loop, part, 'vl-tick3', 2.2);
        // the box that slipped away on the paper day: caught by the list this time
        loop.to(part('vl-left'), { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 2.9);
        loop.to(part('vl-row4'), { backgroundColor: 'rgba(193,68,14,0.08)', duration: 0.3, yoyo: true, repeat: 3 }, 2.9);
        loop.to(part('van'), { x: 10, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 3.6);
        loop.to(part('vl-left'), { autoAlpha: 0, scale: 0.6, duration: 0.3 }, 4.4);
        tick(loop, part, 'vl-tick4', 4.5);
        tick(loop, part, 'vl-tick5', 5.0);
        loop.to(part('vl-done'), { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }, 5.5);
        loop.call(chip, ['challan'], 6.1);
        loop.to(part('challan'), { autoAlpha: 1, x: 0, duration: 0.5, ease: 'back.out(1.4)' }, 6.1);
        loop.to(part('phone'), { y: -10, duration: 0.6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 6.6);
        loop.to([part('challan'), part('vl-done')], { autoAlpha: 0, duration: 0.35 }, 8.3);
        untick(loop, part, rows.map((i) => `vl-tick${i}`), 8.7);
        loop.set(part('challan'), { x: -60 }, 8.7);
        loop.set(part('vl-done'), { y: 10 }, 8.7);
        loop.to({}, { duration: 0.1 }, 8.9);
      }}
    />
  );
});

/* ---------------- b3 · Route, the DockDrop way: one shop's whole history ---------------- */
// Each beat fills in part of the shop's ledger and shows the moment it came from.
const B3_MOBILE = {
  // the ledger is the hero and stays readable; each beat's card pops below it, over the shop by the road
  ledger: { x: 180, y: 70, w: 440 },
  receipt: { x: 515, y: 450, w: 210 },
  upi: { x: 505, y: 470, w: 220 },
  ret: { x: 460, y: 520, w: 280 },
  offline: { x: 380, y: 500, w: 320 },
  shop: { x: 520, y: 470, w: 260, r: 2 },
  van: { x: -20, y: 500, w: 400 },
  road: { x: -760, y: 680, w: 2320, h: 90 },
};
const B3_BEATS = [
  { at: 2.8, chip: 'orders', rows: [1, 4], card: 'receipt' },
  { at: 5.2, chip: 'receipts', rows: [2, 5], card: 'upi' },
  { at: 7.6, chip: 'returns', rows: [3], card: 'ret' },
  { at: 9.6, chip: 'offline', rows: [], card: 'offline' },
];
const B3_END = 13;

export const B3Scene = forwardRef(function B3Scene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={B3_MOBILE}
      keyAt={11 / (B3_END + 0.1)}
      keyChip="offline"
      layers={{
        // road kept high: the three-line caption needs the space below it
        mid: <Road y={540} h={96} />,
        chars: (
          <>
            <Photo id="photos/b3-shop-snack-counter" x={1360} y={70} w={480} rot={2} part="shop" z={1} />
            <Photo id="photos/van-box-truck-side" x={120} y={210} w={600} part="van" z={2}>
              <VanBadge left={14} top={30} width={40} />
            </Photo>
          </>
        ),
        ui: (
          <>
            <ShopLedgerCard x={770} y={95} w={540} part="ledger" z={3} />
            <ReceiptCard x={1420} y={250} w={300} part="receipt" z={4} />
            <UpiCard x={1450} y={280} w={280} part="upi" z={4} />
            <Callout k="return.tag" x={1400} y={420} w={320} part="ret" tone="warn" icon="tag" z={4} />
            <OfflinePile x={1360} y={420} w={400} part="offline" z={4} />
          </>
        ),
      }}
      build={({ part, intro, loop, chip }) => {
        const cards = B3_BEATS.map((b) => part(b.card));
        const rows = [1, 2, 3, 4, 5].map((i) => part(`ledger-row${i}`));
        gsap.set(cards, { autoAlpha: 0, y: 24, scale: 0.96 });
        gsap.set(part('van'), { x: -900 });
        gsap.set(part('ledger'), { autoAlpha: 0, y: 30 });
        gsap.set(rows, { autoAlpha: 0, x: -12 });
        gsap.set(part('ledger-done'), { autoAlpha: 0, y: 8 });
        gsap.set(part('ledger-bar'), { scaleX: 0 });
        intro.fromTo(part('shop'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0);
        loop.to(part('van'), { x: 0, duration: 1.3, ease: 'power2.out' }, 0);
        loop.to(part('road-dashes'), { x: '-=420', duration: 1.3, ease: 'power2.out' }, 0);
        // the shop's ledger opens: balance against its limit
        loop.call(chip, ['credit'], 1.2);
        loop.to(part('ledger'), { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 1.2);
        loop.to(part('ledger-bar'), { scaleX: 1, duration: 0.9, ease: 'power2.out' }, 1.7);
        B3_BEATS.forEach((b) => {
          loop.call(chip, [b.chip], b.at);
          loop.to(part(b.card), pop, b.at);
          b.rows.forEach((r, i) =>
            loop.to(part(`ledger-row${r}`), { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' }, b.at + 0.3 + i * 0.4),
          );
          if (b.card === 'receipt') {
            loop.fromTo(part('receipt-paper'), { yPercent: -100 }, { yPercent: 0, duration: 1, ease: 'power1.out', immediateRender: false }, b.at);
          }
          if (b.card === 'upi') {
            loop.fromTo(part('upi-scan'), { top: '0%', opacity: 1 }, { top: '96%', duration: 0.8, ease: 'sine.inOut', immediateRender: false }, b.at + 0.4);
            loop.to(part('upi-scan'), { opacity: 0, duration: 0.15 }, b.at + 1.2);
            loop.to(part('upi-paid'), { opacity: 1, duration: 0.3 }, b.at + 1.25);
          }
          if (b.card === 'offline') {
            // no network: the bars drop, the bill is still saved, the ledger is complete
            loop.to(part('offline-bar'), { opacity: 0.15, duration: 0.2, stagger: { each: 0.1, from: 'end' } }, b.at + 0.2);
            loop.to(part('ledger-done'), { autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }, b.at + 0.9);
            loop.to(part('offline-bar'), { opacity: 1, duration: 0.2, stagger: 0.1 }, b.at + 1.9);
          } else {
            loop.to(part(b.card), hide, b.at + 1.95);
          }
        });
        loop.to(part('offline'), hide, 11.8);
        loop.to(part('van'), { x: 1400, duration: 1, ease: 'power2.in' }, 12.0);
        loop.to(part('ledger'), { autoAlpha: 0, y: -14, duration: 0.35 }, 12.3);
        loop.set(part('van'), { x: -900 }, B3_END);
        loop.set(cards, { y: 24, scale: 0.96 }, B3_END);
        loop.set(part('ledger'), { y: 30 }, B3_END);
        loop.set(rows, { autoAlpha: 0, x: -12 }, B3_END);
        loop.set(part('ledger-done'), { autoAlpha: 0, y: 8 }, B3_END);
        loop.set(part('ledger-bar'), { scaleX: 0 }, B3_END);
        loop.set(part('upi-paid'), { opacity: 0 }, B3_END);
        loop.to({}, { duration: 0.1 }, B3_END);
      }}
    />
  );
});

const B4_MOBILE = {
  dayend: { x: 70, y: 70, w: 360 },
  dues: { x: 60, y: 450, w: 380 },
  phone: { x: 500, y: 120, w: 280, r: -3 },
  excel: { x: 430, y: 90, w: 300 },
};
/* ---------------- b4 · Settlement, the DockDrop way · 7:00 → 7:05 PM ---------------- */
function ClockCompare() {
  const Mini = ({ tone, h, m }) => {
    const hourDeg = ((h % 12) + m / 60) * 30;
    return (
      <svg viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">
        <circle cx="20" cy="20" r="17" fill="none" stroke={tone} strokeWidth="3" />
        <line x1="20" y1="20" x2="20" y2="10" stroke={tone} strokeWidth="3" strokeLinecap="round" transform={`rotate(${hourDeg} 20 20)`} />
        <line x1="20" y1="20" x2="20" y2="6" stroke={tone} strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${m * 6} 20 20)`} />
      </svg>
    );
  };
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold">
      {/* label in paper: chilli text is too dark on the evening sky without the caption scrim */}
      <span className="flex items-center gap-2" style={{ color: 'var(--paper)' }}>
        <Mini tone="var(--chilli)" h={11} m={40} />
        <T k="compare.paper" className="tnum" />
      </span>
      <span className="flex items-center gap-2" style={{ color: 'var(--turmeric)' }}>
        <Mini tone="var(--turmeric)" h={7} m={5} />
        <T k="compare.app" className="tnum" />
      </span>
    </div>
  );
}

export const B4Scene = forwardRef(function B4Scene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={B4_MOBILE}
      keyAt={0.45}
      keyChip="dues"
      glowAt="70% 30%"
      captionExtra={<ClockCompare />}
      layers={{
        chars: (
          <>
            <PhoneShot frame="bare" screens={['b4-money', 'b4-reports']} x={1400} y={120} w={370} rot={-3} part="phone" z={2} />
          </>
        ),
        ui: (
          <>
            <DayEndCard x={200} y={130} w={440} part="dayend" z={3} />
            <DuesCard x={230} y={390} w={460} part="dues" z={3} />
            <ExcelChip x={1030} y={360} w={330} part="excel" z={4} />
          </>
        ),
      }}
      build={({ part, intro, loop, chip }) => {
        const screens = ['b4-money', 'b4-reports'];
        gsap.set([part('dayend'), part('dues'), part('excel')], { autoAlpha: 0, y: 24 });
        intro.fromTo(part('phone'), { y: 90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' }, 0);

        loop.call(chip, ['dayEnd'], 0);
        loop.to(part('dayend'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }, 0.3);
        loop.fromTo(part('dayend-row2'), { x: -8 }, { x: 0, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, 1.0);
        loop.call(chip, ['dues'], 2.8);
        loop.to(part('dues'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }, 2.9);
        loop.fromTo([part('dues-row1'), part('dues-row2')], { backgroundColor: 'rgba(193,68,14,0)' }, { backgroundColor: 'rgba(193,68,14,0.08)', duration: 0.4, yoyo: true, repeat: 3, immediateRender: false }, 3.5);
        loop.call(chip, ['profit'], 5.6);
        loop.to(part('phone'), { scale: 1.03, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 5.8);
        loop.call(chip, ['reports'], 8.0);
        screenTo(loop, part, screens, 'b4-reports', 8.0);
        loop.to(part('excel'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, 8.3);
        loop.to([part('dayend'), part('dues'), part('excel')], { autoAlpha: 0, y: -14, duration: 0.35, stagger: 0.05 }, 10.9);
        screenTo(loop, part, screens, 'b4-money', 11.0);
        loop.set([part('dayend'), part('dues'), part('excel')], { y: 24 }, 11.5);
        loop.to({}, { duration: 0.1 }, 11.8);
      }}
    />
  );
});
