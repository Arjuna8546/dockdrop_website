import { useMediaQuery } from './useMediaQuery.js';

/** True when the visitor prefers reduced motion (3.4). Updates live. */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
