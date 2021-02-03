import { CHORDS, CHORD_ALIAS } from '../data/chords.js'
import { Interval } from './interval.js'
import { Note } from './note.js'
import { NoteList } from './notelist.js'
import { ensureType } from './utils.js'

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
   * @param {(Note|string)} tonic Root note of the chord OR
   *                              Full scientific pitch notation for root OR
   *                              Full name of chord with space after root
   * @param {string} name Name of the chord (without note)
   */
  constructor(tonic, name='') {
    
    tonic = ensureType(tonic, Note)
    const intervals = chordIntervals(name)

    super(tonic, intervals)

    this.tonic = tonic
    this.name = name
  }

  /**
   * Create a chord from a string representation.
   * 
   * @param {string} string Root note and chord name separated by space
   */
  static fromString(string) {
    //eslint-disable-next-line
    let [, tonic, name] = string.match('^([a-gA-G][b#]*-?[0-9]?)\s*(.*)')
    return new Chord(tonic, name.trim())
  }

  /**
   * Performs a chromatic transposition of the chord. All notes are transposed
   * according to the interval, but the general pattern (and name) remains.
   * 
   * @param {(Interval|string)} interval Interval object OR
   *                                     Shorthand interval notation (e.g. P5)
   */
  transpose(interval) {
    interval = ensureType(interval, Interval)
    return new Chord(this.tonic.transpose(interval), this.name)
  }

  describe() {
    return `${this.tonic.toString()} ${this.name} chord (${this.toString()})`
  }
}

Chord.chords = CHORDS
Chord.alias = CHORD_ALIAS

function chordIntervals(name) {
  if (name in Chord.chords) {
    return Chord.chords[name]
  } else if (name in Chord.alias) {
    return Chord.chords[Chord.alias[name]]
  } else {
    throw new Error(`The chord ${name} is not known`)
  }
}

// Shortcut for creating a chord from its full name
export const chord = Chord.fromString
