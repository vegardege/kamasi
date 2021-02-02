import { Interval } from './interval.js'
import { ensure_type, mod } from './utils.js'

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
   * Create a note from note letter, accidentals, and an optional octave.
   * 
   * @param {string} letter Note letter (A-G)
   * @param {string} accidentals A secuencque of # or b modifying the letter
   * @param {number} octave Number for a specific pitch, NaN for pitch class
   */
  constructor(letter, accidentals='', octave=NaN) {
    validateNote(letter, accidentals, octave)

    this.letter = letter.toUpperCase()
    this.accidentals = accidentals
    this.octave = octave

    // Offset from C (pitch class or in note's octave)
    this.diatonicOffset = Note.diatonic.indexOf(this.letter)
    this.chromaticOffset = Note.chromatic.indexOf(this.letter)
                         + accToNum(this.accidentals)
  }

  /**
   * Create a note from scientific pitch notation
   * 
   * @param {string} string 
   * 
   * @see {@link https://en.wikipedia.org/wiki/Scientific_pitch_notation}
   */
  static fromString(string) {
    try {
      const [, root, acc, oct] = string.match('^([a-gA-G])(#*|b*)(-?[0-9]?)$')
      return new Note(root, acc, parseInt(oct, 10))
    } catch (e) {
      throw new Error(`'${string}' is not a valid note`)
    }
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
    interval = Number.isInteger(interval) ? Interval.fromSemitones(interval)
                                          : ensure_type(interval, Interval)

    // The interval number specifies how many note letters we should move
    const diatonicTarget = this.diatonicOffset + interval.diatonicSteps,
          newLetter = Note.diatonic[mod(diatonicTarget, 7)]

    // Similarly, the new octave is trivially calculated from the number
    const octaveDiff = Math.floor(diatonicTarget / 7),
          newOctave = this.octave + octaveDiff

    // Accidentals are a bit harder. We need to calculate how many semitones
    // the interval represents, and how many semitones the letter change
    // represented. Accidentals are used to compensate for the difference.
    const chromaticTarget = this.chromaticOffset + interval.chromaticSteps,
          chromaticMoved = Note.chromatic.indexOf(newLetter) + 12 * octaveDiff,
          newAccidentals = numToAcc(chromaticTarget - chromaticMoved)

    return new Note(newLetter, newAccidentals, newOctave)
  }

  /**
   * Distance between two notes measured in semitones.
   * 
   * @param {(Note|string)} note Note to compare to OR
   *                             Full scientific pitch notation for note
   */
  distance(note) {
    note = ensure_type(note, Note)
    const octaveDiff = Note.octaveDiff(this, note)

    return note.chromaticOffset - this.chromaticOffset + 12 * octaveDiff
  }

  /**
   * Find the interval required to transpose this note into a different one.
   * 
   * @param {(Note|string)} note 
   */
  intervalTo(note) {
    note = ensure_type(note, Note)
    const octaveDiff = Note.octaveDiff(this, note)

    return Interval.fromSteps(
      note.diatonicOffset - this.diatonicOffset + 7 * octaveDiff,
      note.chromaticOffset - this.chromaticOffset + 12 * octaveDiff
    )
  }

  /**
   * Find the interval required to transpose a note into this one.
   * 
   * @param {(Note|string)} note 
   */
  intervalFrom(note) {
    note = ensure_type(note, Note)
    return note.intervalTo(this)
  }

  /**
   * Return frequency in a 12-tone equal temperament with A4 = 440 Hz.
   */
  frequency() {
    return 440 * Math.pow(2, -this.distance('A4') / 12)
  }

  /**
   * Return the midi number of this note, or -1 if it can't be represented.
   * Doesn't work for pitch classes.
   */
  midi() {
    const midi = 60 - this.distance('C4')
    return midi > 0 && midi <= 127 ? midi : NaN
  }

  /**
   * Create an enharmonic note with the fewest possible accidentals.
   * Arbitrarily chooses '#' over 'b' to be deterministic.
   */
  simplify() {
    const octave = this.octave + Math.floor(this.chromaticOffset / 12)
    const [root, acc] = Note.chromatic[mod(this.chromaticOffset, 12)]

    return new Note(root, acc || '', octave || NaN)
  }

  /**
   * Convert a pitch to a pitch class by removing the octave
   */
  toPitchClass() {
    if (this.isPitchClass()) return this
    return new Note(this.letter, this.accidentals)
  }

  /**
   * Convert a pitch class to a pitch by giving it an octave
   * 
   * @param {number} octave Octave the pitch should belong to
   */
  toPitch(octave) {
    return new Note(this.letter, this.accidentals, octave)
  }

  isPitchClass() {
    return !Number.isInteger(this.octave)
  }

  /**
   * Two notes are equal if letter, accidentals, and octave are equal. 
   *
   * @param {(Note|string)} note note Note to compare to OR
   *                             Full scientific pitch notation for note
   */
  isEqual(note) {
    note = ensure_type(note, Note)
    return (this.letter === note.letter)
        && (this.accidentals === note.accidentals)
        && ((this.isPitchClass() && note.isPitchClass())
         || (this.octave === note.octave))
  }

  /**
   * Two notes are enharmonic if they represent the same pitch or pitch class.
   * Note that pitch classes and specific pitches can't be enharmonic.
   * 
   * @param {(Note|string)} note note Note to compare to OR
   *                             Full scientific pitch notation for note
   * @see {@link https://en.wikipedia.org/wiki/Enharmonic}
   */
  isEnharmonic(note) {
    note = ensure_type(note, Note)
    return this.isPitchClass() === note.isPitchClass()
        && this.distance(note) === 0
  }

  toString() {
    return `${this.letter}${this.accidentals}${this.octave || ''}`
  }
}

// The diatonic notes are 
Note.diatonic = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

// The chromatic notes are 
Note.chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#',
                  'G', 'G#', 'A', 'A#', 'B']

// Use this comparator if you want to sort notes. Pitch classes are sorted
// before all pitches, then they are sorted by octave, pitch, and letter.
Note.compare = (a, b) => (a.octave || -Infinity) - (b.octave || -Infinity)
                      || a.chromaticOffset - b.chromaticOffset
                      || a.diatonicOffset - b.diatonicOffset

/**
 * Find the octave difference between two notes. This is easy for pitches.
 * For two pitch classes, we always want to move up in pitch. If the first
 * note has a higher pitch, we assume an octave shift.
 *
 * E.g. D -> C is assumed to be a shift from a D to a C in a higher octave.
 *
 * @param {Note} a First note
 * @param {Note} b Second note
 */
Note.octaveDiff = (a, b) => {
  if (a.isPitchClass() != b.isPitchClass()) {
    throw new Error("Can't compare a pitch and a pitch class")
  }
  if (a.isPitchClass()) {
    return a.chromaticOffset > b.chromaticOffset ? 1 : 0
  } else {
    return b.octave - a.octave
  }
}

function validateNote(letter, accidentals, octave) {
  if (!Note.diatonic.includes(letter.toUpperCase())) {
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

// Accidentals helper functions
const accToNum = a => a[0] === 'b' ? -a.length : a.length
const numToAcc = n => n > 0 ? '#'.repeat(n) : 'b'.repeat(-n)

// Shortcut for creating an note with scientific pitch notation
export const note = Note.fromString
