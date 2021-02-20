import { Interval } from './interval.js'
import { Note } from './note.js'
import { SCALES, SCALE_ALIAS } from '../data/scales.js'
import { CHORDS, CHORD_ALIAS } from '../data/chords.js'
import { ensureType } from './utils.js'
import { search as _search } from './search.js'

/**
 * A note list is an ordered sequence of notes. The notes can be
 * harmonic (simultaneous) or melodic (sequential).
 * 
 * This class is a collection used for an arbitrary list of notes. Subclasses
 * should be used for more specific purposes, e.g. a scale, a chord, or a
 * melody.
 */
export class NoteList {

  /**
   * Create a new note list, using a list of Notes or strings on scientific
   * pitch notation, or as a single string of the latter.
   * 
   * It can be created using a root note and a list of intervas, or as a
   * list of notes (intervals will be calculated).
   * 
   * @param {(Note|string|Array)} root The first note of the note list OR
   *                                   A list of valid notes
   * @param {array} intervals A list of intervals from root note. Can only be
   *                          used if root is a single note.
   */
  constructor(root=[], intervals=[]) {

    if (root instanceof Array && intervals.length === 0) {
      this.notes = root.map(n => ensureType(n, Note))

      // There are no intervals between pitches and pitch classes, so
      // intervals can't be calculated. The list will still work, but
      // can't be used for search or other functions requiring intervals.
      this.intervals = this.isEmpty() ? [] :
                       this.isMixed() ? undefined :
                       this.notes.map(n => this.notes[0].intervalTo(n))

    } else if (intervals.length > 0) {
      root = ensureType(root, Note)
      this.notes = intervals.map(i => root.transpose(i))
      this.intervals = intervals.map(i => ensureType(i, Interval))

    } else {
      throw new Error('NoteList must be created with a root note and a ' +
                      'list of intervals, or as a list of notes')
    }
  }

  /**
   * Create a note list from a string of notes
   * 
   * @param {string} string Space separated list of notes
   */
  static fromString(string) {
    try {
      return new NoteList(string.split(' '))
    } catch (e) {
      throw new Error(`'${string}' is not a valid note list`)
    }
  }

  /**
   * Create a scale from a tonic note and scale name
   * 
   * @param {(Note|string)} tonic Root note of scale
   * @param {string} name Name of scale
   */
  static fromScale(tonic, name) {
    tonic = ensureType(tonic, Note)
    if (name in SCALES) {
      return new NoteList(tonic, SCALES[name])
    } else if (name in SCALE_ALIAS) {
      return new NoteList(tonic, SCALES[SCALE_ALIAS[name]])
    } else {
      throw new Error(`The scale ${name} is not known`)
    }
  }

  /**
   * Create a chord from a tonic note and scchordale name
   * 
   * @param {(Note|string)} tonic Root note of chord
   * @param {string} name Name of chord
   */
  static fromChord(tonic, name) {
    tonic = ensureType(tonic, Note)
    if (name in CHORDS) {
      return new NoteList(tonic, CHORDS[name])
    } else if (name in CHORD_ALIAS) {
      return new NoteList(tonic, CHORDS[CHORD_ALIAS[name]])
    } else {
      throw new Error(`The chord ${name} is not known`)
    }
  }

  /**
   * Transpose all notes in the list by the same interval.
   * 
   * @param {(Interval|string)} interval Interval object OR
   *                                     Shorthand interval notation (e.g. P5)
   */
  transpose(interval) {
    return new NoteList(this.notes.map(n => n.transpose(interval)))
  }

  /**
   * Reduce accidentals as much as possible for each note in the list.
   */
  simplify() {
    return new NoteList(this.notes.map(n => n.simplify()))
  }

  /**
   * Returns a copy of the list with `note` added
   * 
   * @param {(Note|string)} note Note to add to list
   */
  add(note) {
    note = ensureType(note, Note)
    return new NoteList(this.notes.concat(note))
  }

  /**
   * Returns a copy of the list with all instances of `note` removed
   * 
   * @param {(Note|string)} note Note to remove from list
   * @param {boolean} enharmonic If true, removes all enharmonic notes
   */
  remove(note, enharmonic=false) {
    note = ensureType(note, Note)
    const filter = enharmonic ? n => !n.isEnharmonic(note)
                              : n => !n.isEqual(note)
    return new NoteList(this.notes.filter(filter))
  }

  /**
   * Add note to list if it's not present, otherwise remove it
   * 
   * @param {(Note|string)} note Note to toggle
   * @param {boolean} enharmonic If true, toggles all enharmonic notes
   */
  toggle(note, enharmonic=false) {
    note = ensureType(note, Note)
    return this.includes(note, enharmonic) ? this.remove(note, enharmonic)
                                           : this.add(note)
  }

  /**
   * Check if note list contains a note equa to `note`.
   * 
   * @param {(Note|string)} note Note to look for OR
   *                             Full scientific pitch notation for note
   */
  includes(note, enharmonic=false) {
    note = ensureType(note, Note)
    return enharmonic ? this.notes.some(n => n.isEnharmonic(note))
                      : this.notes.some(n => n.isEqual(note))
  }

  /**
   * Check if note list contains all the notes in `notes`.
   */
  includesAll(notes, enharmonic=false) {
    notes = notes instanceof NoteList ? notes.notes : notes
    return notes.every(n => this.includes(n, enharmonic))
  }

  /**
   * Sort the note list by pitch
   */
  sort() {
    // .slice(0) copies the array to avoid mutating the original
    return new NoteList(this.notes.slice(0).sort(Note.compare))
  }
  
  /**
   * Returns the first note of the list. Note that this is not guaranteed
   * to be the lowest pitch, as a notelist does not need to be ascending.
   */
  root() {
    return this.notes[0]
  }

  /**
   * Search for chords and scales these notes form. Supports sub and super
   * sets as well as exact search.
   *
   * @param {boolean} enharmonic If true, search won't differentiate
   *                             between enharmonic intervals
   */
  search(enharmonic=true, searchType=undefined, patternType=undefined) {

    if (this.intervals === undefined) {
      throw new Error('This note list is a mix of pitches and pitch ' +
        'classes, and can not be used to search. Convert the list ' +
        'using .toPitches(octave) or .toPitchClasses() to search.')
    }

    const intervals = enharmonic ? this.intervals.map(i => i.simplify())
                                 : this.intervals

    return _search(intervals.map(i => i.toString()),
                   enharmonic,
                   searchType,
                   patternType)
  }

  /**
   * Search for scales/chords with the exact notes from this notelist
   * 
   * @param {boolean} enharmonic If true, search won't differentiate
   *                             between enharmonic intervals
   */
  exact(enharmonic=true) {
    return this.search(enharmonic, 'exact')
  }

  /**
   * Search for scales/chords including the notes from this notelist
   * 
   * @param {boolean} enharmonic If true, search won't differentiate
   *                             between enharmonic intervals
   */
  supersets(enharmonic=true) {
    return this.search(enharmonic, 'supersets')
  }

  /**
   * Search for scales/chords containing only notes from this notelist
   * 
   * @param {boolean} enharmonic If true, search won't differentiate
   *                             between enharmonic intervals
   */
  subsets(enharmonic=true) {
    return this.search(enharmonic, 'subsets')
  }

  /**
   * Check if the notelist is empty
   */
  isEmpty() {
    return this.notes.length === 0
  }

  /**
   * True if the notelist is a mix of pitches and pitch classes.
   * These lists are possible to create and work with, but can't be used to
   * search or convert to a chord or scale.
   */
  isMixed() {
    const rootIsPitch = this.notes[0].isPitch()
    return this.notes.some(n => n.isPitch() !== rootIsPitch)
  }

  /**
   * True if all notes in the notelist are pitches (e.g. C#4, not C#)
   */
  isPitches() {
    return this.notes.every(n => n.isPitch())
  }

  /**
   * True if all notes in the notelist are pitch classes (e.g. C#, not C#4)
   */
  isPitchClasses() {
    return this.notes.every(n => n.isPitchClass())
  }

  /**
   * Convert all notes in the list to a pitch in the specified octave.
   * Note that this will also change the octave of existing pitches.
   * 
   * @param {number} octave Octave of notes
   */
  toPitches(octave) {
    return new NoteList(this.notes.map(n => n.toPitch(octave)))
  }
  
  /**
   * Convert all notes in the list to a pitch class
   */
  toPitchClasses() {
    return new NoteList(this.notes.map(n => n.toPitchClass()))
  }

  toStringArray() {
    return this.notes.map(n => n.toString())
  }

  toString() {
    return this.toStringArray().join(' ')
  }
}

// Shortcut for creating a note list from space separated notes
export const notes = NoteList.fromString


/**
 * Create a NoteList from a scale tonic and name
 */
export function scale(string) {
  //eslint-disable-next-line
  const [, tonic, name] = string.match(/^([a-gA-G][b#]*-?[0-9]?)\s*(.*)$/)
  return NoteList.fromScale(tonic, name.trim())
}

/**
 * Create a NoteList from a chord tonic and name
 */
export function chord(string) {
  //eslint-disable-next-line
  const [, tonic, name] = string.match(/^([a-gA-G][b#]*-?[0-9]?)\s*(.*)$/)
  return NoteList.fromChord(tonic, name.trim())
}
