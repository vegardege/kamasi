import { Note } from './note.js'
import { ensure_type } from './utils.js'

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
  constructor(notes) {
    this.notes = notes
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
   * Find the intervals from first note to each subsequent note.
   */
  intervals() {
    return this.notes.map(n => this.notes[0].intervalTo(n))
  }

  /**
   * Sort the note list by pitch
   */
  sort() {
    // .slice(0) copies the array to keep the original
    return new NoteList(this.notes.slice(0).sort(Note.compare))
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
