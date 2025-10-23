import { CHORDS, CHORD_ALIAS } from '#data/chords.js'
import type { IntervalNotation } from '#data/intervals.js'
import { SCALES, SCALE_ALIAS } from '#data/scales.js'
import { Interval } from '#src/interval.js'
import { Note } from '#src/note.js'
import { search as _search, type SearchResult, type PatternResult } from '#src/search.js'
import { ensureType } from '#src/utils.js'

/**
 * A note list is an ordered sequence of notes. The notes can be
 * harmonic (simultaneous) or melodic (sequential).
 *
 * This class is a collection used for an arbitrary list of notes. Subclasses
 * should be used for more specific purposes, e.g. a scale, a chord, or a
 * melody.
 */
export class NoteList {
  readonly notes: Note[]
  readonly intervals?: Interval[]

  /**
   * Create a new note list, using a list of Notes or strings on scientific
   * pitch notation, or as a single string of the latter.
   *
   * It can be created using a root note and a list of intervals, or as a
   * list of notes (intervals will be calculated).
   *
   * @param root The first note of the note list OR A list of valid notes
   * @param intervals A list of intervals from root note. Can only be used if root is a single note.
   */
  constructor(root: (Note | string)[] | Note | string = [], intervals: readonly IntervalNotation[] | (Interval | string)[] = []) {
    if (Array.isArray(root) && intervals.length === 0) {
      this.notes = root.map(n => ensureType(n, Note))

      // There are no intervals between pitches and pitch classes, so
      // intervals can't be calculated. The list will still work, but
      // can't be used for search or other functions requiring intervals.
      this.intervals = this.isEmpty() ? [] :
                       this.isMixed() ? undefined :
                       this.notes.map(n => this.notes[0]!.intervalTo(n))

    } else if (intervals.length > 0) {
      const rootNote = ensureType(root as Note | string, Note)
      this.notes = intervals.map(i => rootNote.transpose(i))
      this.intervals = intervals.map(i => ensureType(i, Interval))

    } else {
      throw new Error('NoteList must be created with a root note and a ' +
                      'list of intervals, or as a list of notes')
    }
  }

  /**
   * Create a note list from a string of notes
   *
   * @param string Space separated list of notes
   */
  static fromString(string: string): NoteList {
    try {
      return new NoteList(string.split(' '))
    } catch {
      throw new Error(`'${string}' is not a valid note list`)
    }
  }

  /**
   * Create a scale from a tonic note and scale name
   *
   * @param tonic Root note of scale
   * @param name Name of scale
   */
  static fromScale(tonic: Note | string, name: string): NoteList {
    const tonicNote = ensureType(tonic, Note)
    if (name in SCALES) {
      return new NoteList(tonicNote, SCALES[name]!)
    } else if (name in SCALE_ALIAS) {
      const scaleName = SCALE_ALIAS[name]!
      return new NoteList(tonicNote, SCALES[scaleName]!)
    } else {
      throw new Error(`The scale ${name} is not known`)
    }
  }

  /**
   * Create a chord from a tonic note and chord name
   *
   * @param tonic Root note of chord
   * @param name Name of chord
   */
  static fromChord(tonic: Note | string, name: string): NoteList {
    const tonicNote = ensureType(tonic, Note)
    if (name in CHORDS) {
      return new NoteList(tonicNote, CHORDS[name]!)
    } else if (name in CHORD_ALIAS) {
      const chordName = CHORD_ALIAS[name]!
      return new NoteList(tonicNote, CHORDS[chordName]!)
    } else {
      throw new Error(`The chord ${name} is not known`)
    }
  }

  /**
   * Transpose all notes in the list by the same interval.
   *
   * @param interval Interval object OR Shorthand interval notation (e.g. P5)
   */
  transpose(interval: Interval | string): NoteList {
    return new NoteList(this.notes.map(n => n.transpose(interval)))
  }

  /**
   * Reduce accidentals as much as possible for each note in the list.
   */
  simplify(): NoteList {
    return new NoteList(this.notes.map(n => n.simplify()))
  }

  /**
   * Returns a copy of the list with `note` added
   *
   * @param note Note to add to list
   */
  add(note: Note | string): NoteList {
    const noteObj = ensureType(note, Note)
    return new NoteList(this.notes.concat(noteObj))
  }

  /**
   * Returns a copy of the list with all instances of `note` removed
   *
   * @param note Note to remove from list
   * @param enharmonic If true, removes all enharmonic notes
   */
  remove(note: Note | string, enharmonic: boolean = false): NoteList {
    const noteObj = ensureType(note, Note)
    const filter = enharmonic ? (n: Note) => !n.isEnharmonic(noteObj)
                              : (n: Note) => !n.isEqual(noteObj)
    return new NoteList(this.notes.filter(filter))
  }

  /**
   * Add note to list if it's not present, otherwise remove it
   *
   * @param note Note to toggle
   * @param enharmonic If true, toggles all enharmonic notes
   */
  toggle(note: Note | string, enharmonic: boolean = false): NoteList {
    const noteObj = ensureType(note, Note)
    return this.includes(noteObj, enharmonic) ? this.remove(noteObj, enharmonic)
                                              : this.add(noteObj)
  }

  /**
   * Check if note list contains a note equal to `note`.
   *
   * @param note Note to look for OR Full scientific pitch notation for note
   */
  includes(note: Note | string, enharmonic: boolean = false): boolean {
    const noteObj = ensureType(note, Note)
    return enharmonic ? this.notes.some(n => n.isEnharmonic(noteObj))
                      : this.notes.some(n => n.isEqual(noteObj))
  }

  /**
   * Check if note list contains all the notes in `notes`.
   */
  includesAll(notes: NoteList | (Note | string)[], enharmonic: boolean = false): boolean {
    const noteArray = notes instanceof NoteList ? notes.notes : notes
    return noteArray.every(n => this.includes(n, enharmonic))
  }

  /**
   * Sort the note list by pitch
   */
  sort(): NoteList {
    // .slice(0) copies the array to avoid mutating the original
    return new NoteList(this.notes.slice(0).sort(Note.compare))
  }

  /**
   * Returns the first note of the list. Note that this is not guaranteed
   * to be the lowest pitch, as a notelist does not need to be ascending.
   */
  root(): Note | undefined {
    return this.notes[0]
  }

  /**
   * Search for chords and scales these notes form. Supports sub and super
   * sets as well as exact search.
   *
   * @param enharmonic If true, search won't differentiate between enharmonic intervals
   *
   * @example
   * notes('C E G').search().exact().chord()      // 'major'
   * notes('C E G').search().supersets().scales() // All scales containing C, E, G
   */
  search(enharmonic = true): SearchResult {
    if (this.intervals === undefined) {
      throw new Error('This note list is a mix of pitches and pitch ' +
        'classes, and can not be used to search. Convert the list ' +
        'using .toPitches(octave) or .toPitchClasses() to search.')
    }

    const intervals = enharmonic ? this.intervals.map(i => i.simplify())
                                 : this.intervals

    return _search(intervals.map(i => i.toString()) as IntervalNotation[], enharmonic)
  }

  /**
   * Search for scales/chords with the exact notes from this notelist
   *
   * @param enharmonic If true, search won't differentiate between enharmonic intervals
   *
   * @example
   * notes('C E G').exact().chord()  // 'major'
   * notes('C E G').exact().chords() // ['major']
   */
  exact(enharmonic = true): PatternResult {
    return this.search(enharmonic).exact()
  }

  /**
   * Search for scales/chords including the notes from this notelist
   *
   * @param enharmonic If true, search won't differentiate between enharmonic intervals
   *
   * @example
   * notes('C E').supersets().scales() // All scales containing C and E
   */
  supersets(enharmonic = true): PatternResult {
    return this.search(enharmonic).supersets()
  }

  /**
   * Search for scales/chords containing only notes from this notelist
   *
   * @param enharmonic If true, search won't differentiate between enharmonic intervals
   *
   * @example
   * notes('C D E F G A B').subsets().chords() // All chords using only notes from C major scale
   */
  subsets(enharmonic = true): PatternResult {
    return this.search(enharmonic).subsets()
  }

  /**
   * Check if the notelist is empty
   */
  isEmpty(): boolean {
    return this.notes.length === 0
  }

  /**
   * True if the notelist is a mix of pitches and pitch classes.
   * These lists are possible to create and work with, but can't be used to
   * search or convert to a chord or scale.
   */
  isMixed(): boolean {
    const firstNote = this.notes[0]
    if (!firstNote) return false
    const rootIsPitch = firstNote.isPitch()
    return this.notes.some(n => n.isPitch() !== rootIsPitch)
  }

  /**
   * True if all notes in the notelist are pitches (e.g. C#4, not C#)
   */
  isPitches(): boolean {
    return this.notes.every(n => n.isPitch())
  }

  /**
   * True if all notes in the notelist are pitch classes (e.g. C#, not C#4)
   */
  isPitchClasses(): boolean {
    return this.notes.every(n => n.isPitchClass())
  }

  /**
   * Convert all notes in the list to a pitch in the specified octave.
   * Note that this will also change the octave of existing pitches.
   *
   * @param octave Octave of notes
   */
  toPitches(octave: number): NoteList {
    return new NoteList(this.notes.map(n => n.toPitch(octave)))
  }

  /**
   * Convert all notes in the list to a pitch class
   */
  toPitchClasses(): NoteList {
    return new NoteList(this.notes.map(n => n.toPitchClass()))
  }

  toStringArray(): string[] {
    return this.notes.map(n => n.toString())
  }

  toString(): string {
    return this.toStringArray().join(' ')
  }
}

// Shortcut for creating a note list from space separated notes
export const notes = NoteList.fromString

/**
 * Create a NoteList from a scale tonic and name
 */
export function scale(string: string): NoteList {
  const match = string.match(/^([A-G][b#]*-?[0-9]?)?\s*(.*)$/)
  if (!match) throw new Error(`'${string}' is not a valid scale`)
  const [, tonic, name] = match
  return NoteList.fromScale(tonic || 'C', name!.trim())
}

/**
 * Create a NoteList from a chord tonic and name
 */
export function chord(string: string): NoteList {
  const match = string.match(/^([A-G][b#]*-?[0-9]?)?\s*(.*)$/)
  if (!match) throw new Error(`'${string}' is not a valid chord`)
  const [, tonic, name] = match
  return NoteList.fromChord(tonic || 'C', name!.trim())
}
