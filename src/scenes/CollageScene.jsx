import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap.js';
import { StageFrame } from '../components/story/StageFrame.jsx';

/** Portrait and square screens (index.css .scene-camera) show a fixed, composed window of the canvas. */
const PORTRAIT_QUERY = '(max-aspect-ratio: 1/1)';
const WINDOW_X = 560; // canvas x of the portrait window's left edge (800 units wide, --fx 0.5)

/**
 * Portrait composition: per data-part, where the piece sits in the 800×1200 portrait window
 * ({ x, y, w, h?, r?, z? } in window units, or null to leave it out). Written as a scoped media-query
 * stylesheet so it overrides the inline desktop placement without any JS.
 * @param {string} id
 * @param {Record<string, {x:number,y:number,w:number,h?:number,r?:number,z?:number}|null>} mobile
 */
function portraitCss(id, mobile) {
  const rules = Object.entries(mobile).map(([part, v]) => {
    const sel = `[data-stage="${id}"] [data-part="${part}"]`;
    if (!v) return `${sel}{display:none!important}`;
    let r = `left:${((WINDOW_X + v.x) / 19.2).toFixed(3)}%!important;top:${(v.y / 12).toFixed(3)}%!important;width:${(v.w / 19.2).toFixed(3)}%!important;`;
    if (v.h !== undefined) r += `height:${(v.h / 12).toFixed(3)}%!important;`;
    if (v.r !== undefined) r += `rotate:${v.r}deg!important;`;
    if (v.z !== undefined) r += `z-index:${v.z}!important;`;
    return `${sel}{${r}}`;
  });
  return `@media ${PORTRAIT_QUERY}{${rules.join('')}}`;
}

/**
 * Shared shell for every photo-collage stage (Design amendment 3). A scene supplies its layers
 * (JSX on the 1920×1200 canvas) and a `build` function that fills the intro and loop timelines.
 * The shell implements the SceneHandle contract (section 11) for the navigator.
 *
 * @typedef {Object} BuildApi
 * @property {(name: string) => Element[]} part   elements with data-part="<name>" in this stage
 * @property {gsap.core.Timeline} intro          plays once after the transition
 * @property {gsap.core.Timeline} loop           repeat: -1; must end where it started (seamless)
 * @property {(id: string) => void} chip         set the active feature chip (Part B)
 *
 * @param {Object} props
 * @param {import('../content/stages.js').StageDef} props.stage
 * @param {boolean} props.active
 * @param {boolean} props.isStatic
 * @param {Object} props.layers                  { far, mid, chars, fg, fx, ui }
 * @param {(api: BuildApi) => void} props.build
 * @param {number} [props.keyAt]                 loop progress used as the static key frame
 * @param {string} [props.keyChip]               chip shown in the key frame (seeking skips loop callbacks)
 * @param {React.ReactNode} [props.captionExtra]
 * @param {string} [props.glowAt]
 * @param {Object} [props.mobile]                portrait composition (see portraitCss)
 */
export const CollageScene = forwardRef(function CollageScene(
  { stage, active, isStatic, layers, build, keyAt = 0.5, keyChip, captionExtra, glowAt, mobile },
  ref,
) {
  const rootRef = useRef(null);
  const [activeChip, setActiveChip] = useState(stage.chips[0] ?? null);
  const handle = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const q = gsap.utils.selector(root);
      const part = (name) => q(`[data-part="${name}"]`);
      const intro = gsap.timeline({ paused: true });
      const loop = gsap.timeline({ paused: true, repeat: -1 });
      const chip = (id) => setActiveChip(id);

      build({ part, intro, loop, chip });

      const firstChip = stage.chips[0] ?? null;
      handle.current = {
        intro,
        loop,
        reset: () => {
          loop.pause(0);
          intro.pause(0);
          setActiveChip(firstChip);
        },
        keyFrame: () => {
          intro.progress(1).pause();
          loop.progress(keyAt).pause();
          if (keyChip) setActiveChip(keyChip);
        },
      };
      if (isStatic) handle.current.keyFrame();
    },
    { scope: rootRef, dependencies: [isStatic, keyChip, keyAt] },
  );

  useImperativeHandle(ref, () => ({
    get intro() {
      return handle.current?.intro;
    },
    get loop() {
      return handle.current?.loop;
    },
    reset: () => handle.current?.reset(),
    keyFrame: () => handle.current?.keyFrame(),
  }));

  const css = mobile ? portraitCss(stage.id, mobile) : null;
  return (
    <>
      {css && <style>{css}</style>}
      <StageFrame
        ref={rootRef}
        stage={stage}
        active={active}
        isStatic={isStatic}
        activeChip={activeChip}
        captionExtra={captionExtra}
        glowAt={glowAt}
        layers={layers}
      />
    </>
  );
});
