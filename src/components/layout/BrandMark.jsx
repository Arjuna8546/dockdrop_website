/**
 * The DockDrop mark (user-provided brand logo, built by `npm run brand` from brand-src/).
 * Decorative: the surrounding control or text carries the name.
 */
export function BrandMark({ size = 28, className }) {
  return (
    <img
      src="/brand/mark-64.webp"
      srcSet="/brand/mark-64.webp 64w, /brand/mark-128.webp 128w, /brand/mark-256.webp 256w"
      sizes={`${size}px`}
      width={size}
      height={size}
      alt=""
      decoding="async"
      draggable={false}
      className={className}
    />
  );
}
