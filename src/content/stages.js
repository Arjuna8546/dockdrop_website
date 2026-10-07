/**
 * @typedef {'night'|'morningDull'|'morning'|'afternoon'|'evening'|'dusk'} SkyPreset
 * @typedef {'A'|'A-night'|'B'} Grade
 *
 * @typedef {Object} StageDef
 * @property {string} id
 * @property {SkyPreset} sky        sky preset at the stage's key frame (a3 / b3 animate later)
 * @property {Grade} grade
 * @property {'A'|'T'|'B'} part
 * @property {{fx: number, fy: number}} focus  default camera focus on the 1920×1200 scene canvas (0–1)
 * @property {boolean} dark          dark sky → paper-coloured text and header
 * @property {string[]} chips        chip ids (copy keys `chip.<id>`), Part B only
 * @property {boolean} [subline]     stage has a subline (copy key `stage.<id>.subline`)
 * @property {boolean} [timeLabel]   stage has a time label (copy key `stage.<id>.time`)
 */

/** §3.1 stages, in order. Copy lives in copy.js under `stage.<id>.*`. */
/** @type {StageDef[]} */
export const STAGES = [
  {
    id: 'a1',
    focus: { fx: 0.5, fy: 0.45 },
    sky: 'night',
    grade: 'A-night',
    part: 'A',
    dark: true,
    chips: [],
    subline: true,
    timeLabel: true,
  },
  {
    id: 'a2',
    focus: { fx: 0.3, fy: 0.45 },
    sky: 'morningDull',
    grade: 'A',
    part: 'A',
    dark: false,
    chips: [],
    subline: true,
    timeLabel: true,
  },
  {
    id: 'a3',
    focus: { fx: 0.2, fy: 0.45 },
    sky: 'afternoon',
    grade: 'A',
    part: 'A',
    dark: false,
    chips: [],
    subline: true,
    timeLabel: true,
  },
  {
    id: 'a4',
    focus: { fx: 0.51, fy: 0.45 },
    sky: 'night',
    grade: 'A-night',
    part: 'A',
    dark: true,
    chips: [],
    subline: true,
    timeLabel: true,
  },
  {
    id: 't',
    focus: { fx: 0.3, fy: 0.45 },
    sky: 'night',
    grade: 'A-night',
    part: 'T',
    dark: true,
    chips: [],
    timeLabel: false,
    subline: true,
  },
  {
    id: 'b1',
    focus: { fx: 0.72, fy: 0.45 },
    sky: 'morning',
    grade: 'B',
    part: 'B',
    dark: false,
    chips: [],
    timeLabel: true,
    subline: true,
  },
  {
    id: 'b2',
    focus: { fx: 0.46, fy: 0.45 },
    sky: 'morning',
    grade: 'B',
    part: 'B',
    dark: false,
    chips: ['vanLoad', 'stockList', 'challan'],
    subline: true,
    timeLabel: true,
  },
  {
    id: 'b3',
    focus: { fx: 0.22, fy: 0.45 },
    sky: 'afternoon',
    grade: 'B',
    part: 'B',
    dark: false,
    chips: ['credit', 'orders', 'receipts', 'returns', 'offline'],
    timeLabel: true,
    subline: true,
  },
  {
    id: 'b4',
    focus: { fx: 0.25, fy: 0.45 },
    sky: 'evening',
    grade: 'B',
    part: 'B',
    dark: true,
    chips: ['dayEnd', 'dues', 'profit', 'reports'],
    timeLabel: true,
    subline: true,
  },
];
