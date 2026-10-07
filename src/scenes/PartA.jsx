import { forwardRef } from 'react';
import { gsap } from '../lib/gsap.js';
import { CollageScene } from './CollageScene.jsx';
import { Photo } from '../components/collage/Photo.jsx';
import { BillSlip, PinkSlip } from '../components/collage/Paper.jsx';
import { Calculator, WallClock, WallCalendar, Bubble, Road } from '../components/collage/Gadgets.jsx';
import { Notification } from '../components/collage/Cards.jsx';
import { BrandMark } from '../components/layout/BrandMark.jsx';
import { place } from '../components/collage/place.js';

/*
 * Part A — the paper day, as a photo collage (Design amendment 3). Positions are canvas units
 * (1920×1200); key content stays within y 100–780 above the caption band. Every loop ends in the
 * state it starts in.
 */

/** Rotate clock hands to h:m (svgOrigin = the clock face centre). */
function clockTo(tl, part, prefix, h, m, at, dur = 0.6) {
  const hourDeg = ((h % 12) + m / 60) * 30;
  const minDeg = ((h % 12) * 60 + m) * 6; // cumulative across the 12-hour face (hands move forward)
  tl.to(part(`${prefix}-hour`), { rotation: hourDeg, svgOrigin: '100 100', duration: dur, ease: 'power2.inOut' }, at);
  tl.to(part(`${prefix}-min`), { rotation: minDeg, svgOrigin: '100 100', duration: dur, ease: 'power2.inOut' }, at);
}

// Portrait window (800 units wide, content above y≈880): see CollageScene `mobile`.
const A1_MOBILE = {
  slip: { x: 130, y: 60, w: 270, r: -6 },
  calc: { x: 540, y: 80, w: 200, r: 7 },
  book: { x: 60, y: 330, w: 680, r: 4 },
  n1: { x: 150, y: 700, w: 500 },
  n2: { x: 150, y: 800, w: 500 },
  n3: { x: 150, y: 900, w: 500 },
};
/* ---------------- a1 · Bill book (hero) · 10:30 PM ---------------- */
export const A1Scene = forwardRef(function A1Scene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={A1_MOBILE}
      keyAt={0.62}
      // glowAt="50% 30%"
      layers={{
        chars: (
          <>
            <BillSlip x={420} y={140} w={430} rot={-6} part="slip" z={1} />
            <Photo id="photos/a1-hand-writing-billbook" x={730} y={330} w={620} rot={5} part="book" z={2} />
            <Calculator x={1370} y={150} w={240} rot={7} part="calc" z={3} />
          </>
        ),
        ui: (
          <>
            <Notification n={1} x={1310} y={440} w={450} part="n1" z={4} />
            <Notification n={2} x={1330} y={560} w={430} part="n2" z={5} />
            <Notification n={3} x={1350} y={670} w={410} part="n3" z={6} />
          </>
        ),
      }}
      build={({ part, intro, loop }) => {
        const notifs = [part('n1'), part('n2'), part('n3')];
        gsap.set(notifs, { autoAlpha: 0, y: 24 });
        gsap.set(part('slip-circle'), { drawSVG: '0%' });

        intro
          .fromTo(part('book'), { y: -60, scale: 1.05 }, { y: 0, scale: 1, duration: 0.9, ease: 'settle' }, 0)
          .fromTo([part('slip'), part('calc')], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, 0.15);
        loop.to(part('slip-circle'), { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, 0.5);
        notifs.forEach((n, i) => {
          loop.to(n, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, 1.5 + i * 1.2);
          loop.fromTo(part('calc'), { x: 0 }, { x: 3, duration: 0.05, repeat: 5, yoyo: true, ease: 'none' }, 1.5 + i * 1.2);
        });
        loop.to(part('calc-display'), { opacity: 0.35, duration: 0.08, repeat: 3, yoyo: true }, 4.9);
        loop.to(part('book'), { y: -6, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 2.5);
        loop.to(notifs, { autoAlpha: 0, y: -12, duration: 0.4, stagger: 0.06 }, 5.8);
        loop.to(part('slip-circle'), { drawSVG: '0%', duration: 0.4 }, 6.1);
        loop.set(notifs, { y: 24 }, 6.9);
        loop.to({}, { duration: 0.1 }, 6.9);
      }}
    />
  );
});

const A2_MOBILE = {
  slip: { x: 100, y: 160, w: 270, r: -9 },
  van: { x: 310, y: 60, w: 440, r: -3 },
  q1: { x: 600, y: 140, w: 110 },
  q2: { x: 690, y: 300, w: 84 },
  clock: { x: 80, y: 640, w: 210 },
};
/* ---------------- a2 · Loading, the paper way · 6:30 → 7:40 AM ---------------- */
export const A2Scene = forwardRef(function A2Scene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={A2_MOBILE}
      keyAt={0.55}
      layers={{
        chars: (
          <>
            <BillSlip page={1} x={300} y={200} w={380} rot={-9} part="slip" z={1} />
            <Photo id="photos/a2-van-rear-loading" x={760} y={110} w={440} rot={-3} part="van" z={2} />
          </>
        ),
        ui: (
          <>
            <Bubble x={1240} y={190} w={120} part="q1" z={3} />
            <Bubble x={1335} y={330} w={92} part="q2" z={3} />
            <WallClock x={1290} y={470} w={210} part="clock" time={[6, 30]} z={2} />
          </>
        ),
      }}
      build={({ part, intro, loop }) => {
        gsap.set([part('q1'), part('q2')], { autoAlpha: 0, scale: 0.4 });
        intro
          .fromTo(part('van'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0)
          .fromTo(part('slip'), { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, 0.15);
        clockTo(intro, part, 'clock', 6, 40, 0.3, 0.9);
        // the owner flips yesterday's bill to guess today's load
        loop.to(part('slip'), { rotation: 4, y: -10, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 0.4);
        loop.to(part('van'), { x: 10, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.2);
        loop.to(part('q1'), { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 3.2);
        loop.to(part('q2'), { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 3.6);
        clockTo(loop, part, 'clock', 7, 10, 4.0, 0.8);
        clockTo(loop, part, 'clock', 7, 40, 5.2, 0.8);
        loop.to([part('q1'), part('q2')], { autoAlpha: 0, scale: 0.4, duration: 0.3 }, 6.9);
        clockTo(loop, part, 'clock', 6, 40, 7.4, 0.5);
        loop.to({}, { duration: 0.1 }, 7.9);
      }}
    />
  );
});

const A3_MOBILE = {
  road: { x: -760, y: 820, w: 2320, h: 110 },
  shop: { x: 220, y: 120, w: 560 },
  shop2: { x: 320, y: 60, w: 440, r: -2 },
  van: { x: -30, y: 560, w: 540 },
  write: { x: 420, y: 440, w: 350, r: -5 },
  pink: { x: 610, y: 620, w: 130, r: 9 },
};
/* ---------------- a3 · Route, the paper way · 8:00 AM → 6:00 PM ---------------- */
export const A3Scene = forwardRef(function A3Scene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={A3_MOBILE}
      keyAt={9.3 / 13.1}
      layers={{
        mid: <Road y={690} h={110} />,
        chars: (
          <>
            <Photo id="photos/a3-pettikada-kiosk" x={1140} y={130} w={580} part="shop" z={1} />
            <Photo id="photos/a3-fruit-shop-kerala" x={1190} y={60} w={470} rot={-2} part="shop2" z={1} />
            <Photo id="photos/van-box-truck-side" x={170} y={375} w={580} part="van" z={2} />
            <Photo id="photos/a1-hand-writing-billbook" x={1170} y={420} w={380} rot={-5} part="write" z={3} />
            <PinkSlip x={1530} y={500} w={150} rot={9} part="pink" z={4} />
          </>
        ),
      }}
      build={({ part, intro, loop }) => {
        const van = part('van');
        const shop = part('shop');
        const shop2 = part('shop2');
        const write = part('write');
        const pink = part('pink');
        const dashes = part('road-dashes');
        gsap.set(van, { x: -1100 });
        gsap.set([shop, shop2], { x: 1000 });
        gsap.set([write, pink], { autoAlpha: 0, scale: 0.85 });
        intro.to({}, { duration: 0.01 });

        /** At a shop: the hand writes the bill, the carbon copy is torn off and handed over. */
        const billAt = (at) => {
          loop.set(pink, { x: 0, y: 0, rotation: 9, scale: 0.85, autoAlpha: 0 }, at - 0.05);
          loop.set(write, { rotation: -5 }, at - 0.05);
          loop.to(write, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }, at);
          loop.to(write, { rotation: -1, duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, at + 0.5);
          loop.to(pink, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.6)' }, at + 1.8);
          loop.to(pink, { rotation: 22, x: 90, y: -40, duration: 0.6, ease: 'power2.out' }, at + 2.4);
          loop.to(pink, { x: 260, y: -160, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, at + 3.1);
          loop.to(write, { autoAlpha: 0, scale: 0.9, duration: 0.35 }, at + 3.6);
        };
        loop.to(van, { x: 0, duration: 1.4, ease: 'power2.out' }, 0);
        loop.to(dashes, { x: '-=420', duration: 1.4, ease: 'power2.out' }, 0);
        loop.to(van, { y: -3, duration: 0.18, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0);
        // shop 1: the petti kada
        loop.to(shop, { x: 0, duration: 1.1, ease: 'power3.out' }, 0.7);
        billAt(1.9);
        // drive on: the first shop slides away, the next one comes up
        loop.to(shop, { x: -1600, duration: 1.2, ease: 'power2.in' }, 5.7);
        loop.to(dashes, { x: '-=520', duration: 1.6, ease: 'sine.inOut' }, 5.7);
        loop.to(van, { y: -3, duration: 0.18, yoyo: true, repeat: 7, ease: 'sine.inOut' }, 5.7);
        // shop 2: the fruit and vegetable shop
        loop.to(shop2, { x: 0, duration: 1.1, ease: 'power3.out' }, 6.4);
        billAt(7.1);
        loop.to(van, { x: 1500, duration: 1.5, ease: 'power2.in' }, 11.1);
        loop.to(dashes, { x: '-=520', duration: 1.5, ease: 'power2.in' }, 11.1);
        loop.to(shop2, { x: -1500, duration: 1.4, ease: 'power2.in' }, 11.3);
        // back to the start, off-screen, for the next day's first shop
        loop.set(van, { x: -1100 }, 12.8);
        loop.set([shop, shop2], { x: 1000 }, 12.8);
        loop.set(write, { scale: 0.85 }, 12.8);
        loop.to({}, { duration: 0.1 }, 13.0);
      }}
    />
  );
});

const A4_MOBILE = {
  pile: { x: 10, y: 520, w: 780, r: 3 },
  slip: { x: 110, y: 60, w: 240, r: -11 },
  s1: { x: 50, y: 790, w: 130, r: -14 },
  book: { x: 90, y: 400, w: 620, r: -2 },
  s2: { x: 610, y: 800, w: 130, r: 12 },
  calc: { x: 560, y: 140, w: 200, r: 6 },
  clock: { x: 340, y: 50, w: 170 },
};
/* ---------------- a4 · Night settlement, the paper way · 7:00 → 11:40 PM ---------------- */
export const A4Scene = forwardRef(function A4Scene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={A4_MOBILE}
      keyAt={0.8}
      // glowAt="55% 25%"
      layers={{
        chars: (
          <>
            <Photo id="photos/a4-receipts-pile" x={520} y={430} w={760} rot={3} part="pile" z={0} />
            <BillSlip x={360} y={150} w={330} rot={-11} part="slip" z={1} />
            <PinkSlip x={430} y={560} w={150} rot={-14} part="s1" z={2} />
            <Photo id="photos/a1-hand-writing-billbook" x={640} y={290} w={640} rot={-2} part="book" z={3} />
            <PinkSlip x={1240} y={600} w={140} rot={12} part="s2" z={4} amount="₹2,850" />
            <Calculator x={1350} y={260} w={260} rot={6} part="calc" z={4} value="0" />
          </>
        ),
        fx: <WallClock x={1010} y={60} w={200} part="clock" time={[8, 15]} />,
      }}
      build={({ part, intro, loop }) => {
        const display = part('calc-display')[0];
        const counter = { v: 0 };
        const show = () => {
          if (display) display.textContent = Math.round(counter.v).toLocaleString('en-IN');
        };
        intro.fromTo(part('book'), { y: -40, scale: 1.04 }, { y: 0, scale: 1, duration: 0.9, ease: 'settle' }, 0);
        // riffle the bill book again and again
        loop.to(part('book'), { scaleY: 0.96, duration: 0.09, yoyo: true, repeat: 7, ease: 'none', transformOrigin: '50% 100%' }, 0.2);
        loop.fromTo(counter, { v: 0 }, { v: -2850, duration: 1.2, ease: 'power2.out', onUpdate: show }, 1.1);
        clockTo(loop, part, 'clock', 9, 40, 2.4, 0.7);
        loop.to([part('s1'), part('slip')], { rotation: '+=4', duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 3.0);
        clockTo(loop, part, 'clock', 11, 40, 4.0, 0.7);
        loop.to(part('s2'), { rotation: 18, y: -8, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 4.2);
        loop.to(counter, { v: 0, duration: 0.01, onUpdate: show }, 5.85);
        clockTo(loop, part, 'clock', 8, 15, 5.6, 0.35);
        loop.to({}, { duration: 0.1 }, 5.9);
      }}
    />
  );
});

const T_MOBILE = {
  cal: { x: 80, y: 60, w: 230 },
  clock: { x: 360, y: 90, w: 160 },
  owner: { x: 280, y: 330, w: 470 },
  folder: { x: 60, y: 520, w: 220, r: 10 },
  logo: { x: 320, y: 450, w: 180 },
};
/* ---------------- t · Every day · 11:40 PM ---------------- */
export const TScene = forwardRef(function TScene(props, ref) {
  return (
    <CollageScene
      ref={ref}
      {...props}
      mobile={T_MOBILE}
      keyAt={0.8}
      // glowAt="45% 40%"
      layers={{
        chars: (
          <>
            <WallCalendar x={400} y={130} w={290} part="cal" date={5} pages={5} z={1} />
            <WallClock x={760} y={170} w={200} part="clock" time={[11, 40]} z={1} />
            <Photo id="photos/t-owner-head-in-hands" x={1030} y={170} w={480} part="owner" z={2} />
            <Photo id="photos/t-paper-folder" x={1500} y={280} w={230} rot={10} part="folder" z={3} />
            <div data-part="logo" className="collage-piece" style={{ ...place(690, 470, 170), aspectRatio: '1', zIndex: 4 }} aria-hidden="true">
              <div className="h-full w-full rounded-full" style={{ boxShadow: '0 0 4cqw 1.2cqw rgba(207,234,62,0.55)' }}>
                <BrandMark size={256} className="h-full w-full" />
              </div>
            </div>
          </>
        ),
      }}
      build={({ part, intro, loop }) => {
        const pages = part('cal-page');
        const night = [part('owner'), part('folder')];
        gsap.set(part('logo'), { autoAlpha: 0, scale: 0.3 });
        intro
          .fromTo(part('owner'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0)
          .fromTo(part('folder'), { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, 0.2);
        // tear-off days, accelerating: the same night again and again
        pages.forEach((p, i) => {
          const at = 0.3 + [0, 0.5, 0.9, 1.2, 1.45][i];
          loop.to(p, { rotation: -25, x: -140, y: -220, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, at);
        });
        // the owner sinks a little lower each night; slips keep piling into the folder
        loop.to(part('owner'), { y: 10, scale: 0.98, duration: 1.2, ease: 'sine.inOut' }, 2.1);
        loop.to(part('folder'), { rotation: 14, y: -8, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.4);
        // the turn: DockDrop
        loop.to(night, { autoAlpha: 0.45, duration: 0.6 }, 3.7);
        loop.to(part('logo'), { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 3.8);
        loop.to(part('logo'), { scale: 1.06, duration: 0.8, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 4.6);
        // next "day": put everything back (behind the reset fade of the pages)
        loop.to(part('logo'), { autoAlpha: 0, duration: 0.35 }, 6.6);
        loop.to(night, { autoAlpha: 1, duration: 0.35 }, 6.6);
        loop.set(pages, { rotation: 0, x: 0, y: 0, autoAlpha: 1 }, 7.0);
        loop.set(part('owner'), { y: 0, scale: 1 }, 7.0);
        loop.set(part('logo'), { scale: 0.3 }, 7.0);
        loop.to({}, { duration: 0.1 }, 7.4);
      }}
    />
  );
});
