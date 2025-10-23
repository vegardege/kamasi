// Type definitions for interval notation
export type IntervalQuality = 'P' | 'M' | 'm' | 'A' | 'd'
export type IntervalNotation = string // e.g., 'P1', 'M3', 'd5'

/**
 * The quality and semitone difference of the intervals on the C diatonic
 * scale, indexed by diatonic number. These are used to calculate how an
 * interval modifies the note letter of a note.
 */
export const DIATONIC: ReadonlyArray<readonly [IntervalQuality, number]> = [
  ['P', 0], ['M', 2], ['M', 4], ['P', 5], ['P', 7], ['M', 9], ['M', 11],
] as const

/**
 * The quality and diatonic number of the intervals on the C chromatic scale,
 * indexed by semitone difference. These are chosen as the default intervals
 * for each possible semitone diff in one octave.
 */
export const CHROMATIC: ReadonlyArray<readonly [IntervalQuality, number]> = [
  ['P', 1], ['m', 2], ['M', 2], ['m', 3], ['M', 3], ['P', 4],
  ['A', 4], ['P', 5], ['m', 6], ['M', 6], ['m', 7], ['M', 7],
] as const

/**
 * Interval bitmasks are used to compare collections of intervals with bitwise
 * operations. This makes reverse lookup of chords and scales fast and simple,
 * even if we want to search for supersets or subsets.
 *
 * This list only contains as many compound intervals as we need to accurately
 * represent all chords and scales in the database.
 *
 * @see {@link https://en.wikipedia.org/wiki/Mask_(computing)}
 * @see {@link https://en.wikipedia.org/wiki/Interval_(music)#Main_intervals}
 * @see {@link https://en.wikipedia.org/wiki/Interval_(music)#Compound_intervals}
 */
export const INTERVAL_BITMASK: Readonly<Record<IntervalNotation, number>> = {
  'P1':  1 << 0,  'd2':  1 << 1,
  'm2':  1 << 2,  'A1':  1 << 3,
  'M2':  1 << 4,  'd3':  1 << 5,
  'm3':  1 << 6,  'A2':  1 << 7,
  'M3':  1 << 8,  'd4':  1 << 9,
  'P4':  1 << 10, 'A3':  1 << 11,
  'd5':  1 << 12, 'A4':  1 << 13,
  'P5':  1 << 14, 'd6':  1 << 15,
  'm6':  1 << 16, 'A5':  1 << 17,
  'M6':  1 << 18, 'd7':  1 << 19,
  'm7':  1 << 20, 'A6':  1 << 21,
  'M7':  1 << 22, 'd8':  1 << 23,
  'P8':  1 << 24, 'A7':  1 << 25, 'd9':  1 << 26,
  'm9':  1 << 27, 'A8':  1 << 28,
  'M9':  1 << 29, 'd10': 1 << 30,
  'm10': 1 << 31, 'A9':  1 << 32,
  'M10': 1 << 33, 'd11': 1 << 34,
  'P11': 1 << 35, 'A10': 1 << 36,
  'd12': 1 << 37, 'A11': 1 << 38,
  'P12': 1 << 39, 'd13': 1 << 40,
  'm13': 1 << 41, 'A12': 1 << 42,
  'M13': 1 << 43, 'd14': 1 << 44,
} as const

/**
 * Similar to `INTERVAL_BITMASK`, but does not differentiate between
 * enharmonic intervals. The value for each interval is its semitone
 * difference from the tonic.
 *
 * We could easliy calculate this on the spot, but the lookup table
 * is static, unchangeable and faster for indexing the database.
 */
export const INTERVAL_BITMASK_ENHARMONIC: Readonly<Record<IntervalNotation, number>> = {
  'P1':  1 << 0,  'd2':  1 << 0,
  'm2':  1 << 1,  'A1':  1 << 1,
  'M2':  1 << 2,  'd3':  1 << 2,
  'm3':  1 << 3,  'A2':  1 << 3,
  'M3':  1 << 4,  'd4':  1 << 4,
  'P4':  1 << 5,  'A3':  1 << 5,
  'd5':  1 << 6,  'A4':  1 << 6,
  'P5':  1 << 7,  'd6':  1 << 7,
  'm6':  1 << 8,  'A5':  1 << 8,
  'M6':  1 << 9,  'd7':  1 << 9,
  'm7':  1 << 10, 'A6':  1 << 10,
  'M7':  1 << 11, 'd8':  1 << 11,
  'P8':  1 << 12, 'A7':  1 << 12, 'd9':  1 << 12,
  'm9':  1 << 13, 'A8':  1 << 13,
  'M9':  1 << 14, 'd10': 1 << 14,
  'm10': 1 << 15, 'A9':  1 << 15,
  'M10': 1 << 16, 'd11': 1 << 16,
  'P11': 1 << 17, 'A10': 1 << 17,
  'd12': 1 << 18, 'A11': 1 << 18,
  'P12': 1 << 19, 'd13': 1 << 19,
  'm13': 1 << 20, 'A12': 1 << 20,
  'M13': 1 << 21, 'd14': 1 << 21,
} as const
