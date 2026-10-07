/**
 * Scene contract (section 11). Every stage scene exposes this through forwardRef + useImperativeHandle.
 *
 * @typedef {Object} SceneHandle
 * @property {gsap.core.Timeline} intro   plays once on enter (after the transition)
 * @property {gsap.core.Timeline} loop    repeat: -1, starts after intro; paused when inactive
 * @property {() => void} keyFrame        static key-frame state (reduced motion, previews, dot jumps)
 * @property {() => void} reset           back to pre-intro state
 */

export {};
