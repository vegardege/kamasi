import { Note } from './note.js'
import { ensure_type } from './utils.js'
import { search as _search } from './search.js'

/**
 * A note list is an ordered sequence of notes.
 * The notes can be harmonic (simultaneous) or melodic (sequential).
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
   * @param {list} notes Ordered array of Note objects
   */
  constructor(notes=[]) {
    this.notes = notes
    this.intervals = notes.map(n => this.notes[0].intervalTo(n))
  }

  /**
   * Create a note list from a string of notes.
   * 
   * @param {string} string Comma separated list of notes
   */
  static fromString(string) {
    try {
      return new NoteList(string.split(' ').map(n => ensure_type(n, Note)))
    } catch (e) {
      throw new Error(`'${string}' is not a valid note list`)
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
    note = ensure_type(note, Note)
    return new NoteList(this.notes.concat([note]))
  }

  /**
   * Returns a copy of the list with all instances of `note` removed
   * 
   * @param {(Note|string)} note Note to remove from list
   * @param {boolean} enharmonic If true, removes all enharmonic notes
   */
  remove(note, enharmonic=false) {
    note = ensure_type(note, Note)
    const filter = enharmonic ? n => !n.isEnharmonic(note)
                              : n => !n.isEqual(note)
    return new NoteList(this.notes.filter(filter))
  }

  /**
   * Check if note list contains a note equa to `note`.
   * 
   * @param {(Note|string)} note Note to look for OR
   *                             Full scientific pitch notation for note
   */
  includes(note, enharmonic=false) {
    note = ensure_type(note, Note)
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
    // .slice(0) copies the array to keep the original
    return new NoteList(this.notes.slice(0).sort(Note.compare))
  }

  /**
   * Search for chords and scales these notes form. Supports sub and super
   * sets to search for possible extensions or reductions as well.
   *
   * @param {boolean} enharmonic If true, search won't differentiate
   *                             between enharmonic intervals
   * @param {string} type 'exact': Only find exact matches
   *                      'sub': Find subsets of this notelist
   *                      'sup': Find supersets of this notelist
   */
  search(enharmonic=true, type='exact') {
    const intervals = enharmonic ? this.intervals.map(i => i.simplify())
                                 : this.intervals

    return _search(intervals.map(i => i.toString()), type, enharmonic)
  }

  /**
   * Find all known scales and chords that can be made up from a subset
   * of these notes.
   *
   * @param {boolean} enharmonic If true, search won't differentiate
   *                             between enharmonic intervals
   */
  subsets(enharmonic=true) {
    return this.search(enharmonic, 'sub')
  }

  /**
   * Find all known scales and chords that can be made up from a subset
   * of these notes.
   *
   * @param {boolean} enharmonic If true, search won't differentiate
   *                             between enharmonic intervals
   */
  supersets(enharmonic=true) {
    return this.search(enharmonic, 'sup')
  }

  /**
   * Returns the first note of the list. Note that this is not guaranteed
   * to be the lowest pitch, as a notelist does not need to be ascending.
   */
  root() {
    return this.notes[0]
  }

  /**
   * Check if the notelist is empty
   */
  isEmpty() {
    return this.notes.length === 0
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
