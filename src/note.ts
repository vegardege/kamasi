import { Interval } from '#src/interval.js'
import { ensureType, mod } from '#src/utils.js'

/**
 * A note represents a specific pitch or a general pitch class.
 *
 * In Western tonal music theory, an octave is divided into 12 pitch classes.
 * 7 of these have a note letter (C, D, E, F, G, A, B), while the remaining
 * 5 are represented by adding accidentals (# or b) to a note letter.
 *
 * Two notes can represent the same pitch (or pitch class), but have different
 * notation. These are called _enharmonic_. They will sound identical, but
 * are considered separate notes for historical and notational reasons.
 * E.g. C##4, D4, and Ebb4 are all the same pitch.
 *
 * A note is named according to three defining components:
 *
 *  `letter` represents one of the 7 note letters.
 *  `accidentals` modify the letter with sharps (#) or flats (b), shifting the
 *                pitch a semitone up or down. This allows us to represent all
 *                pitch classes on the chromatic scale.
 *  `octave` specifies the exact pitch of the note. E.g. 'A' is a pitch class,
 *           while 'A4' is 'A' in the fourth octave.
 *
 * This library uses the English standard, where the letter A through G are
 * used. The letter H is not supported.
 *
 * @see {@link https://en.wikipedia.org/wiki/Musical_note}
 */
export class Note {
  readonly letter: string
  readonly accidentals: string
  readonly octave: number
  readonly diatonicOffset: number
  readonly chromaticOffset: number

  /**
   * Create a note from note letter, accidentals, and an optional octave.
   *
   * @param letter Note letter (A-G)
   * @param accidentals A sequence of '#' or 'b' modifying the letter
   * @param octave Number for a specific pitch, NaN for pitch class
   */
  constructor(letter: string, accidentals: string = '', octave: number = NaN) {
    validateNote(letter, accidentals, octave)

    this.letter = letter.toUpperCase()
    this.accidentals = accidentals
    this.octave = octave

    // Offset from C (pitch class or in note's octave)
    // Stored to simplify the math of transposing a note
    this.diatonicOffset = NOTE_LETTERS.indexOf(this.letter as any)
    this.chromaticOffset = DEFAULT_NOTE.indexOf(this.letter as any)
                         + accToNum(this.accidentals)
  }

  /**
   * Create a note from scientific pitch notation
   *
   * @param string
   *
   * @see {@link https://en.wikipedia.org/wiki/Scientific_pitch_notation}
   */
  static fromString(string: string): Note {
    try {
      const match = string.match(/^([A-G])(#*|b*)(-?[0-9]?)$/)
      if (!match) throw new Error()
      const [, root, acc, oct] = match
      return new Note(root!, acc, parseInt(oct!, 10))
    } catch {
      throw new Error(`'${string}' is not a valid note`)
    }
  }

  /**
   * Move the note up or down in pitch by the specified interval.
   *
   * Returns a new note. Pitch classes will be transposed to pitch classes,
   * specific pitches to specific pitches.
   *
   * @param interval Interval object OR Shorthand interval notation (e.g. P5) OR number of semitones
   *
   * @see {@link https://en.wikipedia.org/wiki/Transposition_(music)}
   */
  transpose(interval: Interval | string | number): Note {
    const intervalObj = typeof interval === 'number' ? Interval.fromSemitones(interval)
                                          : ensureType(interval, Interval)

    // New letter and octave are determined by interval number alone.
    // E.g. a P5 will move us four diatonic steps up in pitch.
    const diatonicTarget = this.diatonicOffset + intervalObj.diatonicSteps
    const newLetter = NOTE_LETTERS[mod(diatonicTarget, 7)]!

    const octaveDiff = Math.floor(diatonicTarget / 7)
    const newOctave = this.octave + octaveDiff

    // Accidentals are a bit harder. We need to calculate how many semitones
    // the interval spans, and how many semitones were covered by the
    // letter/octave movement. Accidentals compensate for the difference.
    const chromaticTarget = this.chromaticOffset + intervalObj.chromaticSteps
    const chromaticMoved = DEFAULT_NOTE.indexOf(newLetter) + 12 * octaveDiff
    const newAccidentals = numToAcc(chromaticTarget - chromaticMoved)

    return new Note(newLetter, newAccidentals, newOctave)
  }

  /**
   * Distance between two notes measured in semitones.
   *
   * Will fail if you try to compare a pitch and a pitch class.
   *
   * @param note Note to compare to OR Full scientific pitch notation for note
   */
  distance(note: Note | string): number {
    note = ensureType(note, Note)
    const octaveDiff = Note.octaveDiff(this, note)

    return note.chromaticOffset - this.chromaticOffset + 12 * octaveDiff
  }

  /**
   * Find the interval required to transpose this note into a different one.
   *
   * Will fail if you try to compare a pitch and a pitch class.
   *
   * @param note Note to compare to OR Full scientific pitch notation for note
   */
  intervalTo(note: Note | string): Interval {
    note = ensureType(note, Note)
    const octaveDiff = Note.octaveDiff(this, note)

    return Interval.fromSteps(
      note.diatonicOffset - this.diatonicOffset + 7 * octaveDiff,
      note.chromaticOffset - this.chromaticOffset + 12 * octaveDiff
    )
  }

  /**
   * Find the interval required to transpose a note into this one.
   *
   * Will fail if you try to compare a pitch and a pitch class.
   *
   * @param note Note to compare to OR Full scientific pitch notation for note
   */
  intervalFrom(note: Note | string): Interval {
    note = ensureType(note, Note)
    return note.intervalTo(this)
  }

  /**
   * Return frequency in a 12-tone equal temperament with A4 = 440 Hz.
   * Will fail for pitch classes.
   */
  frequency(): number {
    return 440 * 2 ** (-this.distance('A4') / 12)
  }

  /**
   * Return the midi number of this note, or NaN if it can't be represented.
   * Will fail for pitch classes.
   */
  midi(): number {
    const midi = 60 - this.distance('C4')
    return midi > 0 && midi <= 127 ? midi : NaN
  }

  /**
   * Create an enharmonic note with the fewest possible accidentals.
   * Arbitrarily chooses '#' over 'b' to be deterministic.
   */
  simplify(): Note {
    const octave = this.octave + Math.floor(this.chromaticOffset / 12)
    const noteStr = DEFAULT_NOTE[mod(this.chromaticOffset, 12)]
    if (!noteStr) throw new Error('Invalid chromatic offset')
    const [root, acc] = noteStr

    return new Note(root!, acc || '', octave || NaN)
  }

  /**
   * Two notes are equal if letter, accidentals, and octave are equal.
   *
   * @param note Note to compare to OR Full scientific pitch notation for note
   */
  isEqual(note: Note | string): boolean {
    note = ensureType(note, Note)
    return (this.letter === note.letter)
        && (this.accidentals === note.accidentals)
        && ((this.isPitchClass() && note.isPitchClass())
         || (this.octave === note.octave))
  }

  /**
   * Two notes are enharmonic if they represent the same pitch or pitch class.
   * Note that pitch classes and specific pitches can't be enharmonic.
   *
   * @param note Note to compare to OR Full scientific pitch notation for note
   * @see {@link https://en.wikipedia.org/wiki/Enharmonic}
   */
  isEnharmonic(note: Note | string): boolean {
    note = ensureType(note, Note)
    return this.isPitchClass() === note.isPitchClass()
        && this.distance(note) === 0
  }

  /**
   * True if the note is a pitch (C#4), false if  it's a pitch class (C#)
   */
  isPitch(): boolean {
    return Number.isInteger(this.octave)
  }

  /**
   * True if the note is a pitch class (C#), false if it's a pitch (C#4)
   */
  isPitchClass(): boolean {
    return !this.isPitch()
  }

  /**
   * Convert a pitch class to a pitch by giving it an octave.
   * Note that this will change the octave of an existing pitch.
   *
   * @param octave Octave the pitch should belong to
   */
  toPitch(octave: number): Note {
    return new Note(this.letter, this.accidentals, octave)
  }

  /**
   * Convert a pitch to a pitch class by removing the octave
   */
  toPitchClass(): Note {
    if (this.isPitchClass()) return this
    return new Note(this.letter, this.accidentals)
  }

  toString(): string {
    return `${this.letter}${this.accidentals}${this.octave || ''}`
  }

  /**
   * Use this comparator if you want to sort notes. Pitch classes are sorted
   * before all pitches, then they are sorted by octave, pitch, and letter.
   */
  static compare = (a: Note, b: Note): number => (a.octave || -Infinity) - (b.octave || -Infinity)
                        || a.chromaticOffset - b.chromaticOffset
                        || a.diatonicOffset - b.diatonicOffset

  /**
   * Find the octave difference between two notes. This is easy for pitches.
   * For two pitch classes, we always want to move up in pitch. If the first
   * note has a higher pitch, we assume an octave shift.
   *
   * E.g. 'D' -> 'C' is assumed to shift from a 'D' to a 'C' in a higher octave.
   *
   * @param a First note
   * @param b Second note
   */
  static octaveDiff = (a: Note, b: Note): number => {
    if (a.isPitchClass() !== b.isPitchClass()) {
      throw new Error("Can't compare a pitch and a pitch class")
    }
    if (a.isPitchClass()) {
      return a.chromaticOffset > b.chromaticOffset ? 1 : 0
    } else {
      return b.octave - a.octave
    }
  }
}

/**
 * The 7 note letters indexed by diatonic offset from C
 */
const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const

/**
 * The default note indexed by semitone offset from C. Note that all
 * enharmonic notes are equally valid, these were chosen to be simple
 * and make lookup deterministic.
 */
const DEFAULT_NOTE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#',
                      'G', 'G#', 'A', 'A#', 'B'] as const

function validateNote(letter: string, accidentals: string, octave: number): void {
  if (!NOTE_LETTERS.includes(letter.toUpperCase() as any)) {
    throw new Error(`letter must be one of ${NOTE_LETTERS.join(', ')}`)
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
const accToNum = (a: string): number => a[0] === 'b' ? -a.length : a.length
const numToAcc = (n: number): string => n > 0 ? '#'.repeat(n) : 'b'.repeat(-n)

// Shortcut for creating a note with scientific pitch notation
export const note = Note.fromString
