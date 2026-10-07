import { useCallback, useRef, useState } from 'react';
import { gsap, useGSAP, Observer, ScrollTrigger, DUR } from './gsap.js';

/**
 * @typedef {import('../scenes/sceneContract.js').SceneHandle} SceneHandle
 */

/** Back-to-front layer order (4.3). */
const LAYER_ORDER = ['sky', 'far', 'mid', 'chars', 'fg', 'fx', 'ui'];
/** yPercent travel per layer for the standard transition (3.3). Sky only crossfades. */
const LAYER_SHIFT = { far: 8, mid: 18, chars: 26, fg: 40, fx: 26, ui: 26 };
/** Pointer parallax amplitude in px (4.4). */
const PARALLAX = { far: 6, mid: 10, chars: 14, fg: 24 };

const JUMP_DURATION = 0.6;
const LEAVE_DURATION = 0.8;
/** Wheel events closer together than this belong to the same gesture (trackpad inertia, fast notches). */
const WHEEL_GESTURE_GAP = 180;
/** ms the wheel must rest after re-entering the story before it moves a stage again */
const REENTRY_QUIET = 400;

/**
 * Stepped story navigator (3.2–3.4). Owns index, input lock, 1-item queue, Observer,
 * keyboard, leaving / re-entering the story, scroll lock, pausing inactive stages and
 * pointer parallax / mobile drift.
 *
 * @param {Object} opts
 * @param {React.RefObject<HTMLElement>} opts.theatreRef   theatre element; stages are `[data-stage]` children
 * @param {React.MutableRefObject<(SceneHandle|null)[]>} opts.scenesRef  scene handles by stage index
 * @param {number} opts.count
 * @param {boolean} opts.reduced         prefers-reduced-motion → static page, navigator off
 * @param {string} opts.exitTarget       selector of the first post-story section
 */
export function useStageNavigator({ theatreRef, scenesRef, count, reduced, exitTarget }) {
  const [index, setIndex] = useState(0);
  const [storyActive, setStoryActive] = useState(!reduced);
  const [visited, setVisited] = useState(() => new Set([0]));
  const [hasNavigated, setHasNavigated] = useState(false);

  const ctrl = useRef({
    request: () => {},
    goTo: () => {},
    leave: () => {},
  });

  useGSAP(
    (context, contextSafe) => {
      const theatre = theatreRef.current;
      if (!theatre || reduced) {
        document.documentElement.classList.remove('story-locked');
        return undefined;
      }

      const stages = Array.from(theatre.querySelectorAll('[data-stage]'));
      const layersOf = (i) =>
        Object.fromEntries(LAYER_ORDER.map((name) => [name, stages[i]?.querySelector(`[data-layer="${name}"]`)]));
      const allLayers = stages.map((_, i) => layersOf(i));

      // ---- state kept in closures (not React state) so GSAP callbacks always see current values
      let current = 0;
      let locked = false;
      /** @type {null | { dir?: number, target?: number }} */
      let queued = null;
      let active = true;
      let leaving = false;
      let entering = false;
      let pageHidden = document.hidden;

      setStoryActive(true);
      if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
      document.documentElement.classList.add('story-locked');

      stages.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 1 }));

      // ---------- scene lifecycle (11): reset → transition → intro → loop ----------
      const scene = (i) => scenesRef.current?.[i] ?? null;

      const pauseScene = (i) => {
        const s = scene(i);
        s?.intro?.pause();
        s?.loop?.pause();
      };

      const startScene = (i) => {
        const s = scene(i);
        if (!s) return;
        s.intro?.eventCallback('onComplete', () => {
          if (current === i && active && !pageHidden) s.loop?.restart();
        });
        if (s.intro && s.intro.duration() > 0) s.intro.restart();
        else s.loop?.restart();
      };

      const resumeScene = (i) => {
        const s = scene(i);
        if (!s) return;
        if (s.intro && s.intro.progress() < 1) s.intro.resume();
        else s.loop?.resume();
      };

      stages.forEach((_, i) => {
        if (i !== 0) pauseScene(i);
      });
      startScene(0);

      // ---------- mobile drift (4.4): fg ±6px, only the active stage's tween runs ----------
      const drift = [];
      const mm = gsap.matchMedia();
      mm.add('(pointer: coarse)', () => {
        allLayers.forEach(({ fg }, i) => {
          if (!fg) return;
          gsap.set(fg, { x: -6 });
          drift[i] = gsap.to(fg, { x: 6, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: i !== 0 });
        });
        return () => drift.splice(0);
      });

      // ---------- desktop pointer parallax (4.4) ----------
      mm.add('(pointer: fine)', () => {
        const movers = allLayers.map((layers) =>
          Object.entries(PARALLAX)
            .filter(([name]) => layers[name])
            .map(([name, amp]) => ({
              amp,
              x: gsap.quickTo(layers[name], 'x', { duration: 0.6, ease: 'power3.out' }),
              y: gsap.quickTo(layers[name], 'y', { duration: 0.6, ease: 'power3.out' }),
            })),
        );
        const onMove = (e) => {
          if (!active) return;
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          movers[current]?.forEach((m) => {
            m.x(-nx * m.amp);
            m.y(-ny * m.amp * 0.5);
          });
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
      });

      const setDrift = (i) => drift.forEach((tw, j) => tw && (j === i ? tw.resume() : tw.pause()));

      // ---------- transitions ----------
      const resetLayers = (i) => {
        const layers = allLayers[i];
        LAYER_ORDER.forEach((name) => layers[name] && gsap.set(layers[name], { yPercent: 0, opacity: 1 }));
      };

      /** Standard parallax transition (3.3). dir = +1 down, -1 up. */
      const standardTl = (from, to, dir) => {
        const tl = gsap.timeline({ defaults: { duration: DUR.transition, ease: 'power3.inOut' } });
        const a = allLayers[from];
        const b = allLayers[to];
        gsap.set(stages[to], { autoAlpha: 1, zIndex: 3 });
        gsap.set(stages[from], { zIndex: 2 });

        // Leaving stage: layers move away and fade; its sky stays so the new sky crossfades over it.
        LAYER_ORDER.forEach((name) => {
          if (name === 'sky' || !a[name]) return;
          tl.to(a[name], { yPercent: -dir * LAYER_SHIFT[name], opacity: 0 }, 0);
        });
        // Entering stage: sky crossfades, layers arrive back-to-front with a 0.08 s stagger.
        let n = 0;
        LAYER_ORDER.forEach((name) => {
          if (!b[name]) return;
          if (name === 'sky') {
            tl.fromTo(b.sky, { opacity: 0 }, { opacity: 1 }, 0);
          } else {
            tl.fromTo(b[name], { yPercent: dir * LAYER_SHIFT[name], opacity: 0 }, { yPercent: 0, opacity: 1 }, n * 0.08);
            n += 1;
          }
        });
        return tl;
      };

      /** Dot jump of more than one stage: plain crossfade (3.2). */
      const jumpTl = (from, to) => {
        resetLayers(to);
        gsap.set(stages[from], { zIndex: 2 });
        return gsap
          .timeline()
          .fromTo(stages[to], { autoAlpha: 0, zIndex: 3 }, { autoAlpha: 1, duration: JUMP_DURATION, ease: 'power2.inOut' });
      };

      const flushQueue = () => {
        const q = queued;
        queued = null;
        if (!q || !active) return;
        if (q.target !== undefined) go(q.target);
        else request(q.dir);
      };

      const go = contextSafe((target) => {
        if (target === current || target < 0 || target >= count) return;
        if (locked) {
          queued = { target };
          return;
        }
        locked = true;
        runTransition(current, target);
      });

      const runTransition = contextSafe((from, target) => {
        const dir = target > from ? 1 : -1;
        const isStep = Math.abs(target - from) === 1;

        pauseScene(from);
        scene(target)?.reset?.();
        current = target;
        setIndex(target);
        setHasNavigated(true);
        setVisited((v) => (v.has(target) ? v : new Set(v).add(target)));
        setDrift(target);

        const tl = isStep ? standardTl(from, target, dir) : jumpTl(from, target);
        tl.eventCallback('onComplete', () => {
          gsap.set(stages[from], { autoAlpha: 0, zIndex: 1 });
          gsap.set(stages[target], { zIndex: 2 });
          resetLayers(from);
          locked = false;
          if (active && !pageHidden) startScene(target);
          flushQueue();
        });
      });

      const request = contextSafe((dir) => {
        if (!active) return;
        if (locked) {
          queued = { dir }; // max 1 queued gesture
          return;
        }
        const target = current + dir;
        if (target >= count) leave();
        else if (target >= 0) go(target);
      });

      // ---------- leaving / re-entering the story ----------
      const leave = contextSafe(() => {
        if (!active || leaving) return;
        active = false;
        leaving = true;
        queued = null;
        observer.disable();
        pauseScene(current);
        setDrift(-1);
        document.documentElement.classList.remove('story-locked');
        setStoryActive(false);
        gsap.to(window, {
          scrollTo: { y: exitTarget, autoKill: false },
          duration: LEAVE_DURATION,
          ease: 'power3.inOut',
          onComplete: () => {
            leaving = false;
          },
        });
      });

      const enter = contextSafe(() => {
        if (active) return;
        entering = false;
        active = true;
        locked = false;
        // The scroll that brought the visitor back must not also move the story.
        wheelFresh = false;
        pressFresh = false;
        // ...even when a slow frame splits that scroll into bursts: stay quiet until the wheel rests
        wheelQuietUntil = performance.now() + REENTRY_QUIET;
        document.documentElement.classList.add('story-locked');
        setStoryActive(true);
        observer.enable();
        setDrift(current);
        if (!pageHidden) resumeScene(current);
      });

      // Scrolling back up into the theatre glides to the top and re-enables the story at the stage
      // the visitor left from (b4 after a normal exit).
      ScrollTrigger.create({
        trigger: theatre,
        start: 'top top',
        end: 'bottom top',
        onEnterBack: () => {
          if (active || leaving || entering) return;
          entering = true;
          gsap.to(window, { scrollTo: { y: 0, autoKill: false }, duration: 0.6, ease: 'power3.inOut', onComplete: enter });
        },
      });
      const onScroll = () => {
        if (!active && !leaving && !entering && window.scrollY <= 0) enter();
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      // ---------- gestures: one gesture = one stage ----------
      let lastWheel = 0;
      let wheelFresh = true;
      let pressFresh = true;
      let wheelQuietUntil = 0;
      const onWheelCapture = () => {
        const now = performance.now();
        if (now < wheelQuietUntil) {
          wheelQuietUntil = now + REENTRY_QUIET;
          wheelFresh = false;
          lastWheel = now;
          return;
        }
        if (now - lastWheel > WHEEL_GESTURE_GAP) wheelFresh = true;
        lastWheel = now;
      };
      window.addEventListener('wheel', onWheelCapture, { capture: true, passive: true });

      const gesture = (self, dir) => {
        const type = self.event?.type ?? '';
        if (type.startsWith('wheel')) {
          if (!wheelFresh) return;
          wheelFresh = false;
        } else {
          if (!pressFresh) return;
          pressFresh = false;
        }
        request(dir);
      };

      const observer = Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        tolerance: 40,
        preventDefault: true,
        wheelSpeed: -1,
        ignore: '.chip-row, [data-observer-ignore]',
        onPress: () => {
          pressFresh = true;
        },
        onUp: (self) => gesture(self, 1),
        onDown: (self) => gesture(self, -1),
      });

      // ---------- keyboard ----------
      const onKey = (e) => {
        if (!active || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        const tag = e.target?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
        const onControl = tag === 'BUTTON' || tag === 'A';
        switch (e.key) {
          case 'ArrowDown':
          case 'PageDown':
            e.preventDefault();
            request(1);
            break;
          case ' ':
            if (onControl) return;
            e.preventDefault();
            request(1);
            break;
          case 'ArrowUp':
          case 'PageUp':
            e.preventDefault();
            request(-1);
            break;
          case 'Home':
            e.preventDefault();
            go(0);
            break;
          case 'End':
            e.preventDefault();
            go(count - 1);
            break;
          default:
        }
      };
      window.addEventListener('keydown', onKey);

      // ---------- tab hidden: pause every loop ----------
      const onVisibility = () => {
        pageHidden = document.hidden;
        if (pageHidden) stages.forEach((_, i) => pauseScene(i));
        else if (active) resumeScene(current);
      };
      document.addEventListener('visibilitychange', onVisibility);

      ctrl.current = { request, goTo: go, leave };

      return () => {
        observer.kill();
        mm.revert();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('wheel', onWheelCapture, { capture: true });
        window.removeEventListener('keydown', onKey);
        document.removeEventListener('visibilitychange', onVisibility);
        document.documentElement.classList.remove('story-locked');
        ctrl.current = { request: () => {}, goTo: () => {}, leave: () => {} };
      };
    },
    { scope: theatreRef, dependencies: [reduced, count, exitTarget] },
  );

  const next = useCallback(() => ctrl.current.request(1), []);
  const prev = useCallback(() => ctrl.current.request(-1), []);
  const goTo = useCallback((i) => ctrl.current.goTo(i), []);
  const leaveStory = useCallback(() => {
    if (reduced) {
      document.querySelector(exitTarget)?.scrollIntoView({ behavior: 'auto' });
      return;
    }
    ctrl.current.leave();
  }, [reduced, exitTarget]);

  return { index, storyActive: storyActive && !reduced, visited, hasNavigated, next, prev, goTo, leaveStory };
}
