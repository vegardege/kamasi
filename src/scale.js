import { SCALES, ALIAS } from '../data/scales.js'
import { Interval } from './interval.js'
import { Note } from './note.js'
import { NoteList } from './notelist.js'
import { ensure_type } from './utils.js'

/**
 * A scale is an ascending list of notes, typically spanning an octave,
 * naming a subset of the chromatic notes that sounds well together.
 * 
 * Scales are normally played in sequence, rather than in harmony.
 * 
 * This class is only for known, named scales. If you want an unknown scale,
 * use a `NoteList`, which is an arbitrary list of notes.
 * 
 * @see {@link https://en.wikipedia.org/wiki/Scale_(music)}
 */
export class Scale extends NoteList {

  /**
   * Create a new scale based on tonic note and name
   * 
   * @param {Note} tonic Tonic note of the scale
   * @param {string} name Name of the scale (without note)
   */
  constructor(tonic, name='') {
    validateScale(name)

    tonic = ensure_type(tonic, Note)
    const intervals = Scale.scales[name] ||
                      Scale.scales[Scale.alias[name]]

    super(intervals.map(i => tonic.transpose(i)))

    this.tonic = tonic
    this.name = name
  }

  /**
   * Create a scale from a string representation.
   * 
   * @param {string} string Tonic note and scale name separated by space
   */
  static fromString(string) {
    //eslint-disable-next-line
    let [, tonic, name] = string.match('^([a-gA-G][b#]*-?[0-9]?)\s*([^\s]*)')
    return new Scale(tonic, name.trim())
  }

  /**
   * Performs a chromatic transposition of the scale. All notes are transposed
   * according to the interval, but the general pattern (and name) remains.
   * 
   * @param {(Interval|string)} interval Interval object OR
   *                                     Shorthand interval notation (e.g. P5)
   */
  transpose(interval) {
    interval = ensure_type(interval, Interval)
    return new Scale(this.tonic.transpose(interval), this.name)
  }

  toString() {
    return `${this.tonic.toString()} ${this.name} scale (${this.notes.join(' ')})`
  }
}

// List of scales with their intervals
Scale.scales = SCALES
Scale.alias = ALIAS
Scale.scaleNames = Object.keys(Scale.scales).concat(Object.keys(Scale.alias))

function validateScale(name) {
  if (!Scale.scaleNames.includes(name) &&
      !Object.keys(Scale.alias).includes(name)) {
        throw new Error(`The scale ${name} is not known`)
      }
}

// Shortcut for creating a scale from its full name
export const scale = Scale.fromString
