import frames from '../../art/frames.json';
import { useLanguage } from '../../lib/useLanguage.jsx';
import { artImg, place, sizesFor } from './place.js';

/** Phone photos and the frame name their screen geometry has in frames.json (`media.py screen-hole`). */
const FRAMES = {
  hand: 'photos/b1-hand-phone',
  bare: 'photos/phone-frame',
};
const BLEED = 0.4; // % — tuck the screen a little under the bezel so no gap shows

/**
 * A phone with REAL DockDrop app screenshots showing through its see-through screen.
 * `frame` picks the photo: "hand" (the owner's hand holding the phone) or "bare" (the phone alone).
 * The screen layer follows the measured screen: its tilt, its rounded corners, and a paper strip
 * under the notch / island so no app content hides behind it.
 * `screens` are stacked (first visible); scenes cross-fade them through data-screen="<id>". The
 * language toggle swaps EN/ML screenshots. `children` sit over the screenshots (e.g. a splash that fades out).
 * `inline` drops the canvas placement so the phone fills its parent's width (sections outside the story).
 *
 * @param {{ screens?: string[], frame?: 'hand'|'bare', x?: number, y?: number, w?: number, rot?: number,
 *   part?: string, z?: number, inline?: boolean, sizes?: string, children?: import('react').ReactNode }} props
 */
export function PhoneShot({ screens = [], frame = 'hand', x = 0, y = 0, w = 400, rot = 0, part = 'phone', z, inline = false, sizes, children }) {
  const { lang } = useLanguage();
  const photo = FRAMES[frame];
  const frameImg = artImg(photo);
  const hole = frames[frame];
  const screenW = (w * hole.width) / 100;
  // radius is measured in % of the screen width; the vertical radius is the same length in % of its height
  const radiusX = hole.radius;
  const radiusY = hole.radius * hole.aspect;
  const name = photo.split('/')[1];
  return (
    <div
      data-part={part}
      className={`collage-piece${frame === 'bare' ? ' phone-bare' : ''}`}
      style={{ ...(inline ? { position: 'relative', width: '100%' } : place(x, y, w)), aspectRatio: `${frameImg.width} / ${frameImg.height}`, rotate: `${rot}deg`, zIndex: z }}
    >
      <div
        className="absolute flex flex-col overflow-hidden bg-paper"
        style={{
          left: `${hole.left - BLEED}%`,
          top: `${hole.top - BLEED}%`,
          width: `${hole.width + BLEED * 2}%`,
          height: `${hole.height + BLEED * 2}%`,
          rotate: `${hole.rot}deg`,
          borderRadius: `${radiusX}% / ${radiusY}%`,
        }}
      >
        <div className="shrink-0" style={{ height: `${hole.strip}%` }} aria-hidden="true" />
        <div className="relative min-h-0 flex-1">
          {screens.map((id, i) =>
              ['en', 'ml'].map((l) => {
                const key = `screens/${id}-${l}`;
                const img = artImg(key);
                if (!img) return null;
                return (
                  <img
                    key={key}
                    data-screen={id}
                    data-lang={l}
                    {...img}
                    sizes={sizesFor(screenW)}
                    alt=""
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-200"
                    style={{ opacity: l === lang && i === 0 ? 1 : 0, visibility: l === lang ? 'visible' : 'hidden' }}
                  />
                );
              }),
          )}
          {children}
        </div>
      </div>
      <img
        {...frameImg}
        sizes={sizes ?? sizesFor(w)}
        alt=""
        decoding="async"
        draggable={false}
        data-frame={name}
        className="relative z-[1] block h-auto w-full select-none"
      />
    </div>
  );
}
