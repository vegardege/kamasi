import { Interval } from './interval.js'
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
   * @param {list} notes Ordered list of Note objects
   */
  constructor(notes) {
    this.notes = notes
  }

  /**
   * Create a note list from a string of notes.
   * 
   * @param {string} string Space separated list of notes
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
    interval = ensure_type(interval, Interval)
    return new NoteList(this.notes.map(n => n.transpose(interval)))
  }

  /**
   * Find the intervals from first note to each subsequent note.
   */
  intervals() {
    return this.notes.map(n => this.notes[0].intervalTo(n))
  }

  toString() {
    return this.notes.map(n => n.toString()).join(' ')
  }
}
