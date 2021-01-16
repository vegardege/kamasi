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
   * @param {(list|string)} notes Ordered list of notes
   */
  constructor(notes) {
    if (typeof notes === 'string') {
      notes = notes.split(' ')
    }
    this.notes = notes.map(n => ensure_type(n, Note))
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

  toString() {
    return this.notes.map(n => n.toString()).join(' ')
  }
}
