import { forwardRef } from 'react';
import { useLanguage } from '../../lib/useLanguage.jsx';
import { StageGrade, GradeOverlays } from '../../art/StageGrade.jsx';
import { Sky } from './Sky.jsx';
import { Caption } from './Caption.jsx';

/**
 * One full-screen stage (Design amendment 1; 4.3 layer order, 15.2 a11y).
 * sky (full-bleed) · scene camera [far · mid · chars · fg · fx · ui] · grade overlays · caption band (with its own scrim).
 * The camera is a 1920×1200-unit canvas covering the screen; `--fx/--fy` set its focus.
 * GSAP moves the `data-layer` wrappers and the camera; Motion owns the caption.
 *
 * @param {Object} props
 * @param {import('../../content/stages.js').StageDef} props.stage
 * @param {boolean} props.active
 * @param {boolean} props.isStatic       reduced-motion static panel
 * @param {string|null} props.activeChip
 * @param {{ far?, mid?, chars?, fg?, fx?, ui? }} props.layers
 * @param {React.ReactNode} [props.captionExtra]
 * @param {string} [props.glowAt]       A-night lamp position
 */
export const StageFrame = forwardRef(function StageFrame(
  { stage, active, isStatic, activeChip, layers = {}, captionExtra, glowAt },
  ref,
) {
  const { t } = useLanguage();
  const { id, focus, dark } = stage;
  const visible = active || isStatic;
  return (
    <section
      ref={ref}
      data-stage={id}
      className="stage"
      role="group"
      aria-roledescription={t('aria.slide')}
      aria-label={t(`stage.${id}.name`)}
      aria-hidden={visible ? undefined : 'true'}
      inert={visible ? undefined : ''}
    >
      <StageGrade grade={stage.grade}>
        <div data-layer="sky" className="layer-bleed">
          <Sky preset={stage.sky} />
        </div>
        <div data-camera className="scene-camera" style={{ '--fx': focus.fx, '--fy': focus.fy }}>
          <div data-layer="far" className="layer-canvas is-bleed">
            {layers.far}
          </div>
          <div data-layer="mid" className="layer-canvas">
            {layers.mid}
          </div>
          <div data-layer="chars" className="layer-canvas">
            {layers.chars}
          </div>
          <div data-layer="fg" className="layer-canvas is-bleed pointer-events-none">
            {layers.fg}
          </div>
          <div data-layer="fx" className="layer-canvas pointer-events-none">
            {layers.fx}
          </div>
          <div data-layer="ui" className="layer-canvas">
            {layers.ui}
          </div>
        </div>
        <GradeOverlays grade={stage.grade} glowAt={glowAt} />
      </StageGrade>

      <p className="sr-only">{t(`stage.${id}.sr`)}</p>

      <Caption stage={stage} show={visible} isStatic={isStatic} dark={dark} activeChip={activeChip}>
        {captionExtra}
      </Caption>
    </section>
  );
});
