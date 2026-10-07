/**
 * Part A / Part B grading (7.3). One filter per stage container, never per image.
 * @typedef {'A'|'A-night'|'B'} Grade
 */

const FILTER = {
  A: 'sepia(0.3) saturate(0.82) brightness(0.93)',
  'A-night': 'sepia(0.3) saturate(0.82) brightness(0.93)',
  B: 'none',
};

/** Wraps a stage's art layers and applies the grade filter. */
export function StageGrade({ grade, children }) {
  return (
    <div className="stage-grade" data-grade={grade} style={{ filter: FILTER[grade] }}>
      {children}
    </div>
  );
}

/**
 * Grade overlays, placed above the art (after `fx`) and below `ui`.
 * A: kraft multiply 16%. A-night: + ink multiply 45% + warm lamp glow (screen) from `glowAt`.
 * B: nothing (lime accent layers are switched on by the art components instead).
 * @param {{ grade: Grade, glowAt?: string }} props  glowAt = CSS position of the light source
 */
// eslint-disable-next-line no-unused-vars -- glowAt feeds the lamp glow, commented out for now (founder)
export function GradeOverlays({ grade, glowAt = '50% 18%' }) {
  if (grade === 'B') return null;
  return (
    <div data-layer="grade" className="layer-bleed" aria-hidden="true">
      <div className="layer-bleed" style={{ background: '#C9A97A', mixBlendMode: 'multiply', opacity: 0.16 }} />
      {grade === 'A-night' && (
        <>
          <div className="layer-bleed" style={{ background: '#15160E', mixBlendMode: 'multiply', opacity: 0.45 }} />
          {/* <div
            className="layer-bleed"
            style={{
              background: `radial-gradient(ellipse 55% 45% at ${glowAt}, rgba(255, 214, 150, 0.32), rgba(255, 214, 150, 0) 70%)`,
              mixBlendMode: 'screen',
            }}
          /> */}
        </>
      )}
    </div>
  );
}
