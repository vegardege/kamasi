import { CHROMATIC, DIATONIC, type IntervalQuality } from "#data/intervals.js";
import { ensureType, mod } from "#src/utils.js";

/**
 * An _interval_ is the difference between two pitches or pitch classes.
 *
 * In Western tonal music theory, an octave represents the difference between
 * two pitches with a 2:1 frequency ratio. An octave is divided into 12
 * equally large steps called _semitones_, which are the smallest intervals we
 * can represent in this system.
 *
 * In addition to the semitone difference, an interval specifies how many note
 * letters separate two notes. This is called the _diatonic number_.
 *
 * Two intervals representing the same semitone difference, but with different
 * diatonic numbers, are called _enharmonic_. They will sound identical, but
 * are considered separate intervals for historical and notational reasons.
 *
 * An interval is named according to three defining components:
 *
 *  `number` is the diatonic number, specifying how many note letters the
 *           interval will modify a note by. It includes the origin note,
 *           e.g. the number 3 is the difference between a 'C' and an 'E'.
 *  `quality` qualifies how many semitones the interval spans, relative to
 *            the expectation of the diatonic number. An interval can be
 *            perfect (P), major (M), minor (m), augmented (A), or
 *            diminished (d).
 *  `sign` determines if the diatonic number of positive or negative.
 *
 * The short hand notation is sign, quality, and number in that order:
 *
 *  'M3' is a major third. It encompasses 3 note letters, as specified by its
 *  diatonic number. A major third represents 4 semitones. This is the
 *  difference between a 'C' and an 'E', or e.g. an 'B4' and a 'D#5'.
 *
 *  '-P5' is a descending perfect fifth. It encompasses 5 note letters and 7
 *  semitones. This is the difference between 'G' and 'C' in the same octave,
 *  or e.g. an 'F4' and a 'Bb3'.
 *
 * @see {@link https://en.wikipedia.org/wiki/Interval_(music)}
 */
export class Interval {
  readonly quality: string;
  readonly number: number;
  readonly sign: number;
  readonly diatonicSteps: number;
  readonly chromaticSteps: number;

  /**
   * Create a new interval from quality, number, and an optional sign.
   *
   * @param quality Interval quality ('P', 'M', 'm', 'A', or 'd')
   * @param number Diatonic number (1 or higher)
   * @param sign '+' for ascending, '-' for descending
   */
  constructor(quality: string, number: number, sign: string = "+") {
    validateInterval(quality, number, sign);

    this.quality = quality;
    this.number = number;
    this.sign = sign === "+" ? 1 : -1;

    // Diatonic steps represents how many note letters two notes differ by.
    // We subtract one from the number to avoid the annoying 1-indexing.
    this.diatonicSteps = this.sign * (this.number - 1);

    // Chromatic steps represents how many semitones two pitches differ by.
    // It is calculated in three steps:
    //  (1) Each full octave contains 12 semitones
    //  (2) The diatonic number maps to a default number of semitones
    //  (3) The quality may add or remove semitones from (2)
    const octaveSteps = 12 * Math.floor((number - 1) / DIATONIC.length);
    const [mainType, mainSteps] = DIATONIC[mod(number - 1, DIATONIC.length)]!;
    const qualitySteps = qualityToSemitoneDiff(mainType, quality);

    this.chromaticSteps = this.sign * (octaveSteps + mainSteps + qualitySteps);
  }

  /**
   * Create an interval with the specified short hand notation.
   *
   * @param notation Interval short hand notation
   *
   * @see {@link https://en.wikipedia.org/wiki/Interval_%28music%29#Shorthand_notation}
   */
  static fromString(notation: string): Interval {
    try {
      const match = notation.match(/^([+-]?)([PMm]|[A]+|[d]+)([0-9]*)$/);
      if (!match) throw new Error();
      const [, dir, qual, number] = match;
      return new Interval(qual!, parseInt(number!, 10), dir || "+");
    } catch {
      throw new Error(`'${notation}' is not a valid interval`);
    }
  }

  /**
   * Creates an interval spanning the given number of semitones.
   *
   * Note that semitone to interval is a one-to-many mapping, with several
   * equally valid answers. This function will always return the same answer,
   * giving preference to qualities in the order: P, M, m, A, d.
   *
   * @param semitones Number of semitones the interval should span
   */
  static fromSemitones(semitones: number): Interval {
    const chromaticSteps = Math.abs(semitones);
    const octaves = Math.floor(chromaticSteps / 12);

    // Find default interval for semitones (minus the full octaves)
    const [quality, number] = CHROMATIC[mod(chromaticSteps, 12)]!;
    const sign = semitones >= 0 ? "+" : "-";

    // Re-add 7 diatonic steps per full octave
    return new Interval(quality, number + 7 * octaves, sign);
  }

  /**
   * Finds the interval spanning a certain number of diatonic steps and
   * semitones, if it exists. This is a one-to-one mapping, but not guaranteed
   * to have an answer.
   *
   * @param diatonicSteps Desired number of diatonic steps
   * @param semitones Desired number of semitones
   */
  static fromSteps(diatonicSteps: number, semitones: number): Interval {
    // Number and sign depends entirely on the number of diatonic steps
    const number = Math.abs(diatonicSteps) + 1;
    const sign = diatonicSteps >= 0 ? 1 : -1;

    // The quality is determined by the difference between the semitones we
    // want to move, and the number of semitones spanned by the wholetones.
    // As usual, we keep the octaves out of the calculation until the end.
    const octaveSteps = 12 * Math.trunc((number - 1) / 7);
    const [mainType, mainSteps] = DIATONIC[mod(number - 1, DIATONIC.length)]!;

    const semitoneDiff = sign * semitones - (octaveSteps + mainSteps);
    const quality = semitoneDiffToQuality(mainType, semitoneDiff);

    return new Interval(quality, number, sign === 1 ? "+" : "-");
  }

  /**
   * Check if a string is valid interval notation without throwing.
   *
   * @param notation String to validate
   */
  static isValidInterval(notation: string): boolean {
    try {
      Interval.fromString(notation);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Find the interval with the same number of diatonic and chromatic steps as
   * the two underlying intervals combined. Not guaranteed to have a result.
   *
   * @param interval Interval to add
   */
  add(interval: Interval | string): Interval {
    interval = ensureType(interval, Interval);
    return Interval.fromSteps(
      this.diatonicSteps + interval.diatonicSteps,
      this.chromaticSteps + interval.chromaticSteps,
    );
  }

  /**
   * Find the interval whose diatonic and chromatic steps are the difference
   * between the underlying intervals. Not guaranteed to have a result.
   *
   * @param interval Interval to subtract
   */
  sub(interval: Interval | string): Interval {
    interval = ensureType(interval, Interval);
    return Interval.fromSteps(
      this.diatonicSteps - interval.diatonicSteps,
      this.chromaticSteps - interval.chromaticSteps,
    );
  }

  /**
   * A compound interval spans more than a full octave. This function will
   * return the simple interval left after subtracting the octaves. Note that
   * this will _not_ be an enharmonic interval.
   */
  simpleTerm(): Interval {
    const number = (Math.abs(this.diatonicSteps) % 7) + 1;
    return new Interval(this.quality, number, this.sign === 1 ? "+" : "-");
  }

  /**
   * Returns an enharmonic interval with the simplest quality possible.
   */
  simplify(): Interval {
    return Interval.fromSemitones(this.chromaticSteps);
  }

  /**
   * Frequency ratio in 12-tone equal temperament.
   *
   * @see {@link https://en.wikipedia.org/wiki/Interval_ratio}
   */
  frequencyRatio(): number {
    return 2 ** (this.chromaticSteps / 12);
  }

  /**
   * Cents in 12-tone equal temperament.
   *
   * @see {@link https://en.wikipedia.org/wiki/Cent_(music)}
   */
  cents(): number {
    return 100 * this.chromaticSteps;
  }

  /**
   * The inversion of an interval is the interval which, together with the
   * original interval, raises the lower note by one (or more) octaves.
   *
   * A simple interval plus its invert will make one octave.
   * A compount intervals plus its invert will make two or more octaves.
   *
   * E.g. a P5 and a P4 will raise a pitch class by an octave, and are
   * therefore each other's inversion. P11 and P4 together make two octaves,
   * therefore P4 is the inversion of P11 (but not the other way around).
   *
   * @see {@link https://en.wikipedia.org/wiki/Inversion_(music)#Intervals}
   */
  invert(): Interval {
    // P1 is the inverse of P8, compound pure octaves are inverted to P1
    const invQuality = invertQuality(this.quality);
    const invNumber = this.number === 1 ? 8 : 9 - mod(this.number, 7, 2);

    return new Interval(invQuality, invNumber, this.sign === 1 ? "+" : "-");
  }

  /**
   * Returns true if the interval is compound (spans more than one octave).
   */
  isCompound(): boolean {
    return this.number >= 8;
  }

  /**
   * Checks if the interval is enharmonic (represents the same number of
   * semitones) as another interval.
   *
   * @param interval Interval to compare to
   */
  isEnharmonic(interval: Interval | string): boolean {
    interval = ensureType(interval, Interval);
    return this.chromaticSteps === interval.chromaticSteps;
  }

  /**
   * Convert interval to short hand notation (e.g. 'M3', '-P5').
   */
  toString(): string {
    return `${this.sign === -1 ? "-" : ""}${this.quality}${this.number}`;
  }
}

/**
 * Perfect ('P') and Major ('M') intervals are associated with a number of
 * semitone steps. Any other quality will change this number of semitones.
 * This function finds the semitone diff based on type (P/M) and quality.
 */
function qualityToSemitoneDiff(type: IntervalQuality, quality: string): number {
  if (type === "P") {
    if (quality === "P") return 0;
    if (quality[0] === "A") return quality.length;
    if (quality[0] === "d") return -quality.length;
  } else if (type === "M") {
    if (quality === "M") return 0;
    if (quality === "m") return -1;
    if (quality[0] === "A") return quality.length;
    if (quality[0] === "d") return -quality.length - 1;
  }
  throw new Error(`Invalid quality '${quality}' for type '${type}'`);
}

/**
 * Perfect ('P') and Major ('M') intervals are associated with a number of
 * semitone steps. Any other quality will change this number of semitones.
 * This function finds the quality based on type (P/M) and semitone diff.
 */
function semitoneDiffToQuality(
  type: IntervalQuality,
  semitoneDiff: number,
): string {
  if (type === "P") {
    if (semitoneDiff === 0) return "P";
    if (semitoneDiff > 0) return "A".repeat(semitoneDiff);
    if (semitoneDiff < 0) return "d".repeat(-semitoneDiff);
  } else if (type === "M") {
    if (semitoneDiff === 0) return "M";
    if (semitoneDiff === -1) return "m";
    if (semitoneDiff > 0) return "A".repeat(semitoneDiff);
    if (semitoneDiff < -1) return "d".repeat(-semitoneDiff - 1);
  }
  throw new Error(`Invalid semitoneDiff ${semitoneDiff} for type '${type}'`);
}

/**
 * Quality inverts according to a simple table.
 */
function invertQuality(quality: string): string {
  switch (quality[0]) {
    case "P":
      return "P";
    case "M":
      return "m";
    case "m":
      return "M";
    case "A":
      return "d".repeat(quality.length);
    case "d":
      return "A".repeat(quality.length);
    default:
      throw new Error(`Invalid quality '${quality}'`);
  }
}

/**
 * Validate interval constructor parameters.
 * Throws an error if quality, number, or direction are invalid.
 */
function validateInterval(
  quality: string,
  number: number,
  direction: string,
): void {
  if (!quality.match(/^[PMm]|[A]+|[d]+$/)) {
    throw new Error(`quality must be one of: P, M, m, A, d}`);
  }
  if (!Number.isInteger(number) || number < 1) {
    throw new Error(`number must be 1 or higher`);
  }
  if (!["+", "-"].includes(direction)) {
    throw new Error(`direction must be '+' or '-'`);
  }
  // Check if quality and number are compatible
  const diatonicEntry = DIATONIC[mod(number - 1, DIATONIC.length)];
  if (!diatonicEntry) throw new Error(`Invalid number ${number}`);
  const [mainType] = diatonicEntry;
  if (
    (mainType === "P" && quality === "M") ||
    (mainType === "P" && quality === "m") ||
    (mainType === "M" && quality === "P")
  ) {
    throw new Error(`${quality}${number} is not a valid interval`);
  }
}

// Shortcut for creating an interval with short hand notation
export const interval = Interval.fromString;
