import { ensure_type, mod } from './utils.js'

/**
 * An interval is the difference between two notes or pitch classes.
 * It can be harmonic (simulaneous) and melodic (sequential).
 * 
 * It is named according to three defining properties:
 * 
 *  `number` specifies how many diatonic notes the interval encompasses, i.e.
 *           how many note letters or staff positions it will move a note.
 *  `quality` qualifies how many semitones the interval spans, and determines
 *            which accidentals (# or b) are added to the note letter.
 *  `direction` determines if the interval increases or decreases the pitch.
 * 
 * Examples:
 * 
 *  'M3' transposes a note by 2 diatonic steps (as the number includes the
 *  root note itself), and by 4 semitones (as found from `SEMITONE_TABLE`).
 *  This interval will e.g. transpose a 'C' to an 'E' and a 'B4' to a 'D#5'.
 * 
 *  '-P5' transposes a note down by 4 diatonic steps, a total of 7 semitones.
 *  This interval will e.g. transpose a 'G' to a 'C' and an 'F4' to a 'Bb3'.
 * 
 * @see {@link https://en.wikipedia.org/wiki/Interval_(music)}
 */
export class Interval {

  /**
   * Create a new interval by short hand notation or defining properties.
   * 
   * @param {string} quality Interval quality ('P', 'M', 'm', 'A', or 'd') OR
   *                         Interval shorthand notation (e.g. '-P5')
   * @param {number} number Interval number (1 or higher)
   * @param {string} sign '+' for higher pitch, '-' for lower pitch
   * 
   * @see {@link https://en.wikipedia.org/wiki/Interval_%28music%29#Shorthand_notation}
   */
  constructor(quality, number, sign='+') {
    if (quality.length > 1) {
      [quality, number, sign] = parseIntervalString(quality)
    }
    validateInterval(quality, number, sign)
    
    this.quality = quality
    this.number = number
    this.sign = sign == '+' ? 1 : -1
    
    // Calculate how many steps the interval encompasses on the diatonic and
    // chromatic scale respectively. The numbers do not include the root note.
    const wholeSteps = this.sign * (this.number - 1)
    const octaveHalfSteps = 12 * Math.trunc(wholeSteps / 7)
    const tableHalfSteps = SEMITONE_TABLE[this.quality][mod(this.number, 7, 1)]

    this.diatonicSteps = wholeSteps
    this.chromaticSteps = this.sign * tableHalfSteps + octaveHalfSteps
  }

  /**
   * Frequency ratio in 12-tone equal temperament
   * @see {@link https://en.wikipedia.org/wiki/Interval_ratio}
   */
  frequencyRatio() {
    return 2 ** (this.chromaticSteps / 12)
  }

  /**
   * Cents in 12-tone equal temperament
   * @see {@link https://en.wikipedia.org/wiki/Cent_(music)}
   */
  cents() {
    return 100 * this.chromaticSteps
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
  invert() {
    const invQuality = {'P': 'P', 'M': 'm', 'm': 'M', 'A': 'd', 'd': 'A'}
    // P1 is the inverse of P8, the other pure octaves are inverted to P1
    const invNumber = this.number === 1 ? 8 : 9 - mod(this.number, 7, 2)

    return new Interval(
      invQuality[this.quality], invNumber, this.sign === 1 ? '+' : '-')
  }

  /**
   * Checks if the interval is enharmonic (represents the same number of
   * semitones) as another interval.
   * 
   * @param {(Interval|string)} interval Interval to compare to
   */
  isEnharmonic(interval) {
    interval = ensure_type(interval, Interval)
    return this.chromaticSteps == interval.chromaticSteps
  }

  toString() {
    return `${this.sign === -1 ? '-' : ''}${this.quality}${this.number}`
  }
}

// Number of semitones of each main interval (e.g. P4 = 5 semitones)
// Compound intervals can use mod with an offset of 1 and re-add octaves
// d1 is -1 to simplify compound interval math, but is blocked in validation
const SEMITONE_TABLE = {
  'P': {1: 0, 4: 5, 5: 7},
  'M': {2: 2, 3: 4, 6: 9, 7: 11},
  'm': {2: 1, 3: 3, 6: 8, 7: 10}, // M-1
  'A': {1: 1, 2: 3, 3: 5, 4: 6, 5: 8, 6: 10, 7: 12}, // P+1 or M+1
  'd': {1: -1, 2: 0, 3: 2, 4: 4, 5: 6, 6: 7, 7: 9}, // P-1 or M-2
}

function parseIntervalString(string) {
  try {
    const [, dir, qual, number] = string.match('^([+-]?)([PMmAd])([0-9]*)$')
    return [qual, parseInt(number, 10), dir || '+']
  } catch {
    throw new Error(`'${string}' is not a valid interval`)
  }
}

function validateInterval(quality, number, direction) {
  const validQualities = Object.keys(SEMITONE_TABLE)
  if (!validQualities.includes(quality)) {
    throw new Error(`quality must be one of: ${validQualities.join(', ')}`)
  }
  if (!Number.isInteger(number) || number < 1) {
    throw new Error(`number must be 1 or higher`)
  }
  if (!['+', '-'].includes(direction)) {
    throw new Error(`direction must be '+' or '-'`)
  }
  const octaves = Math.floor((number - 1) / 7)
  const semitones = SEMITONE_TABLE?.[quality]?.[mod(number, 7, 1)] + 12 * octaves
  if (!Number.isInteger(semitones) || semitones < 0) {
    throw new Error(`'${quality}${number}' is not a valid interval`)
  }
}
