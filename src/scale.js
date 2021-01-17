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
   * Create a new scale based on its name
   * 
   * @param {(Note|string)} tonic Tonic note of the scale OR
   *                              Full scientific pitch notation for tonic OR
   *                              Full name of scale with space after tonic
   * @param {string} name Name of the scale (without note)
   */
  constructor(tonic, name='') {
    if (!name.length) {
      [tonic, name] = tonic.split(" ")
    }
    tonic = ensure_type(tonic, Note)
    name = (name || '').trim()
    validateScale(name)

    const intervals = Scale.scales?.[name] ||
                      Scale.scales[Scale.alias[name]]

    super(intervals.map(i => tonic.transpose(i)))

    this.tonic = tonic
    this.name = name
    this.intervals = intervals
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
}

// List of scales with their intervals
Scale.scales = {
  'major': ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
}
Scale.scaleNames = Object.keys(Scale.scales)

// List of aliases for scales
Scale.alias = {
  '': 'major',
  'maj': 'major',
}

function validateScale(name) {
  if (!Scale.scaleNames.includes(name) &&
      !Object.keys(Scale.alias).includes(name)) {
        throw new Error(`The scale ${name} is not known`)
      }
}
