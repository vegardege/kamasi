import { Interval } from './interval.js'
import { Note } from './note.js'
import { NoteList } from './notelist.js'
import { ensure_type } from './utils.js'

/**
 * A chord is an ascending list of notes, naming a subset of the chromatic
 * notes that sounds well together when played in harmony.
 * 
 * Chords can also be played sequentially, known as arpeggios.
 * 
 * This class is only for known, named chords. If you want an unknown chord,
 * use a `NoteList`, which is an arbitrary list of notes.
 * 
 * @see {@link https://en.wikipedia.org/wiki/Chord_(music)}
 */
export class Chord extends NoteList {

  /**
   * Creates a new chord based on its name
   * 
   * @param {(Note|string)} root Root note of the chord OR
   *                             Full scientific pitch notation for root OR
   *                             Full name of chord with space after root
   * @param {string} name Name of the chord (without note)
   */
  constructor(root, name='') {
    if (!name.length) {
      [root, name] = root.split(" ")
    }
    root = ensure_type(root, Note)
    name = (name || '').trim()
    validateChord(name)

    const intervals = Chord.chords?.[name] ||
                      Chord.chords[Chord.alias[name]]

    super(intervals.map(i => root.transpose(i)))

    this.root = root
    this.name = name
    this.intervals = intervals
  }

  /**
   * Performs a chromatic transposition of the chord. All notes are transposed
   * according to the interval, but the general pattern (and name) remains.
   * 
   * @param {(Interval|string)} interval Interval object OR
   *                                     Shorthand interval notation (e.g. P5)
   */
  transpose(interval) {
    interval = ensure_type(interval, Interval)
    return new Chord(this.root.transpose(interval), this.name)
  }
}

Chord.chords = {
  'major': ['P1', 'M3', 'P5'],
}
Chord.chordNames = Object.keys(Chord.chords)

Chord.alias = {
  '': 'major',
  'maj': 'major',
}

function validateChord(name) {
  if (!Chord.chordNames.includes(name) &&
      !Object.keys(Chord.alias).includes(name)) {
        throw new Error(`The chords ${name} is not known`)
      }
}
