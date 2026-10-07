import { artImg, place, sizesFor } from './place.js';

/**
 * An approved photo cut-out on the scene canvas (art-src → public/art via `npm run art`).
 * Decorative (alt=""): each stage carries its own screen-reader description.
 *
 * @param {Object} props
 * @param {string} props.id        manifest key, e.g. "photos/b1-hand-phone"
 * @param {number} props.x         canvas units
 * @param {number} props.y
 * @param {number} props.w         width in canvas units (height follows the image)
 * @param {number} [props.rot]     static tilt in degrees (GSAP animates on top of it)
 * @param {string} [props.part]    data-part for scene timelines
 * @param {number} [props.z]
 * @param {React.ReactNode} [props.children]  overlays positioned in % of the photo
 */
export function Photo({ id, x, y, w, rot = 0, part, z, children, className = '' }) {
  const img = artImg(id);
  if (!img) {
    if (import.meta.env.DEV) console.warn(`[art] ${id} is not in the manifest (run npm run art)`);
    return null;
  }
  return (
    <div
      data-part={part}
      className={`collage-piece ${className}`}
      style={{ ...place(x, y, w), aspectRatio: `${img.width} / ${img.height}`, rotate: `${rot}deg`, zIndex: z }}
    >
      <img
        {...img}
        sizes={sizesFor(w)}
        alt=""
        decoding="async"
        draggable={false}
        className="relative z-[1] block h-auto w-full select-none"
      />
      {children}
    </div>
  );
}
