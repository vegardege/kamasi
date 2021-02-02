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
   * @param {(Note|string)} root Root note of the chord OR
   *                             Full scientific pitch notation for root OR
   *                             Full name of chord with space after root
   * @param {string} name Name of the scale (without note)
   */
  constructor(tonic, name='') {

    tonic = ensure_type(tonic, Note)
    const intervals = scaleIntervals(name)

    super(tonic, intervals)

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
    let [, tonic, name] = string.match('^([a-gA-G][b#]*-?[0-9]?)\s*(.*)')
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

  describe() {
    return `${this.root.toString()} ${this.name} scale (${this.toString()})`
  }
}

// List of scales with their intervals
Scale.scales = SCALES
Scale.alias = ALIAS

function scaleIntervals(name) {
  if (name in Scale.scales) {
    return Scale.scales[name]
  } else if (name in Scale.alias) {
    return Scale.scales[Scale.alias[name]]
  } else {
    throw new Error(`The scale ${name} is not known`)
  }
}

// Shortcut for creating a scale from its full name
export const scale = Scale.fromString
