/** Sky layer (5.3): the stage's preset gradient. */
export function Sky({ preset }) {
  return (
    <div
      className="layer-bleed"
      style={{ background: `linear-gradient(180deg, var(--sky-${preset}-top), var(--sky-${preset}-bottom))` }}
    />
  );
}
