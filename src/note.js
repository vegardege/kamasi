import { Interval } from './interval.js'
import { ensure_type } from './utils.js'

/**
 * A note represents a specific pitch or a general pitch class.
 * 
 * It is named according to three defining properties:
 * 
 *  `letter` represents a pitch class from the diatonic scale (A-G).
 *  `accidentals` modify the letter with sharps (#) or flats (b), shifting 
 *  pitch a semitone up or down. This allows us to represent all pitch classes
 *  on the chromatic scale.
 *  `octave` specifies the exact pitch of the note. A4, A in the 4th octave,
 *  is defined as 440Hz, and serves as the basis of pitch calculation.
 * 
 * Note that a single pitch can be represented by several notes. These are
 * called enharmonic. E.g. C##4, D4, and Ebb4 are all the same pitch.
 * 
 * This library uses the English standard, where the letter A through G are
 * used. The letter H is not supported.
 * 
 * @see {@link https://en.wikipedia.org/wiki/Musical_note}
 */
export class Note {

  /**
   * @param {string} letter Note letter (A-G) OR
   *                        Full scientific pitch notation
   * @param {string} accidentals A secuencque of # or b modifying the letter
   * @param {number} octave Number for a specific pitch, NaN for pitch class
   * 
   * @see {@link https://en.wikipedia.org/wiki/Scientific_pitch_notation}
   */
  constructor(letter, accidentals = '', octave = NaN) {
    if (letter.length > 1) {
      [letter, accidentals, octave] = parseNoteString(letter)
    }
    validateNote(letter, accidentals, octave)

    this.letter = letter
    this.accidentals = accidentals
    this.octave = octave

    // Offset from C (pitch class or in note's octave)
    this.diatonicOffset = Note.diatonic.indexOf(letter)
    this.chromaticOffset = Note.chromatic.indexOf(letter)
                         + accToNum(accidentals)
  }

  /**
   * Move the note up or down in pitch by the specified interval.
   * 
   * Returns a new note. Pitch classes will be transposed to pitch classes,
   * specific pitches to specific pitches.
   * 
   * @param {(Interval|string)} interval Interval object OR
   *                                     Shorthand interval notation (e.g. P5)
   * 
   * @see {@link https://en.wikipedia.org/wiki/Transposition_(music)}
   */
  transpose(interval) {
    interval = ensure_type(interval, Interval)

    const diatonicTarget = this.diatonicOffset + interval.diatonicSteps
    const newLetter = Note.diatonic[circularMod(diatonicTarget, 7)]

    const octaveDiff = Math.floor(diatonicTarget / 7)
    const newOctave = this.octave + octaveDiff

    const chromaticTarget = this.chromaticOffset + interval.chromaticSteps
    const chromaticMoved = Note.chromatic.indexOf(newLetter) + 12 * octaveDiff
    const newAccidentals = numToAcc(chromaticTarget - chromaticMoved)

    return new Note(newLetter, newAccidentals, newOctave)
  }

  toString() {
    return `${this.letter}${this.accidentals}${this.octave || ''}`
  }
}

Note.diatonic = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
Note.chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#',
                  'G', 'G#', 'A', 'A#', 'B']

function parseNoteString(string) {
  const [, root, acc, oct] = string.match('^([A-G])(#*|b*)(-?[0-9]?)$')
  return [root, acc, parseInt(oct, 10)]
}

function validateNote(letter, accidentals, octave) {
  if (!Note.diatonic.includes(letter)) {
    throw new Error(`letter must be one of ${Note.diatonic.join(', ')}`)
  }
  if (accidentals.replaceAll('#', '').length &&
      accidentals.replaceAll('b', '').length) {
        throw new Error(`accidentals can only be '#'s or 'b's`)
  }
  if (!Number.isNaN(octave) && !Number.isInteger(octave)) {
    throw new Error('octave must be a valid number or NaN')
  }
}

// Safe for negative numbers
const circularMod = (i, N) => (i % N + N) % N

// Accidentals helper functions
const accToNum = a => a[0] === 'b' ? -a.length : a.length
const numToAcc = n => n > 0 ? '#'.repeat(n) : 'b'.repeat(-n)
