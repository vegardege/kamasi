import { CHORD_ALIAS, CHORDS } from "#data/chords.js";
import type { IntervalNotation } from "#data/intervals.js";
import { SCALE_ALIAS, SCALES } from "#data/scales.js";
import { Interval } from "#src/interval.js";
import { Note } from "#src/note.js";
import {
  search as _search,
  type PatternResult,
  type SearchResult,
} from "#src/search.js";
import { ensureType } from "#src/utils.js";

/**
 * A note list is an ordered sequence of notes. The notes can be
 * harmonic (simultaneous) or melodic (sequential).
 *
 * This class is a collection used for an arbitrary list of notes. Subclasses
 * should be used for more specific purposes, e.g. a scale, a chord, or a
 * melody.
 */
export class NoteList {
  readonly notes: Note[];
  readonly intervals?: Interval[];

  /**
   * Create a new note list from an array of notes.
   *
   * @param notes Array of notes (as Note objects or strings in scientific pitch notation)
   */
  constructor(notes: (Note | string)[] = []) {
    this.notes = notes.map((n) => ensureType(n, Note));

    // There are no intervals between pitches and pitch classes, so
    // intervals can't be calculated. The list will still work, but
    // can't be used for search or other functions requiring intervals.
    this.intervals = this.isEmpty()
      ? []
      : this.isMixed()
        ? undefined
        : this.notes.map((n) => this.notes[0]!.intervalTo(n));
  }

  /**
   * Create a note list from a string of notes.
   *
   * @param notation Space separated list of notes
   */
  static fromString(notation: string): NoteList {
    try {
      return new NoteList(notation.split(" "));
    } catch {
      throw new Error(`'${notation}' is not a valid note list`);
    }
  }

  /**
   * Create a note list from a root note and a list of intervals.
   *
   * @param root Root note of the list
   * @param intervals Array of intervals from the root note
   */
  static fromIntervals(
    root: Note | string,
    intervals: (Interval | string)[],
  ): NoteList {
    const rootNote = ensureType(root, Note);
    const intervalObjects = intervals.map((i) => ensureType(i, Interval));
    const notes = intervalObjects.map((i) => rootNote.transpose(i));

    return new NoteList(notes);
  }

  /**
   * Create a scale from a tonic note and scale name.
   *
   * @param tonic Root note of scale
   * @param name Name of scale
   */
  static fromScale(tonic: Note | string, name: string): NoteList {
    if (name in SCALES) {
      return NoteList.fromIntervals(tonic, SCALES[name]!);
    } else if (name in SCALE_ALIAS) {
      const scaleName = SCALE_ALIAS[name]!;
      return NoteList.fromIntervals(tonic, SCALES[scaleName]!);
    } else {
      throw new Error(`The scale '${name}' is not known`);
    }
  }

  /**
   * Create a chord from a tonic note and chord name.
   *
   * @param tonic Root note of chord
   * @param name Name of chord
   */
  static fromChord(tonic: Note | string, name: string): NoteList {
    if (name in CHORDS) {
      return NoteList.fromIntervals(tonic, CHORDS[name]!);
    } else if (name in CHORD_ALIAS) {
      const chordName = CHORD_ALIAS[name]!;
      return NoteList.fromIntervals(tonic, CHORDS[chordName]!);
    } else {
      throw new Error(`The chord '${name}' is not known`);
    }
  }

  /**
   * Transpose all notes in the list by the same interval.
   *
   * @param interval Interval object OR Shorthand interval notation (e.g. P5)
   */
  transpose(interval: Interval | string): NoteList {
    return new NoteList(this.notes.map((n) => n.transpose(interval)));
  }

  /**
   * Reduce accidentals as much as possible for each note in the list.
   */
  simplify(): NoteList {
    return new NoteList(this.notes.map((n) => n.simplify()));
  }

  /**
   * Sort the note list by pitch.
   */
  sort(): NoteList {
    // .slice(0) copies the array to avoid mutating the original
    return new NoteList(this.notes.slice(0).sort(Note.compare));
  }

  /**
   * Returns a copy of the list with `note` added.
   *
   * @param note Note to add to list
   */
  add(note: Note | string): NoteList {
    const noteObj = ensureType(note, Note);
    return new NoteList(this.notes.concat(noteObj));
  }

  /**
   * Returns a copy of the list with all instances of `note` removed.
   *
   * @param note Note to remove from list
   * @param enharmonic If true, removes all enharmonic notes
   */
  remove(note: Note | string, enharmonic: boolean = false): NoteList {
    const noteObj = ensureType(note, Note);
    const filter = enharmonic
      ? (n: Note) => !n.isEnharmonic(noteObj)
      : (n: Note) => !n.isEqual(noteObj);
    return new NoteList(this.notes.filter(filter));
  }

  /**
   * Returns a copy of the list with note toggled.
   *
   * @param note Note to toggle
   * @param enharmonic If true, toggles all enharmonic notes
   */
  toggle(note: Note | string, enharmonic: boolean = false): NoteList {
    const noteObj = ensureType(note, Note);
    return this.includes(noteObj, enharmonic)
      ? this.remove(noteObj, enharmonic)
      : this.add(noteObj);
  }

  /**
   * Check if note list contains a note equal to `note`.
   *
   * @param note Note to look for OR Full scientific pitch notation for note
   */
  includes(note: Note | string, enharmonic: boolean = false): boolean {
    const noteObj = ensureType(note, Note);
    return enharmonic
      ? this.notes.some((n) => n.isEnharmonic(noteObj))
      : this.notes.some((n) => n.isEqual(noteObj));
  }

  /**
   * Check if note list contains all the notes in `notes`.
   *
   * @param notes List of notes to look for OR Full scientific pitch notation
   *  for note
   * @param enharmonic Whether it should accept enharmonic (but not identical)
   *  notes in comparison
   */
  includesAll(
    notes: NoteList | (Note | string)[],
    enharmonic: boolean = false,
  ): boolean {
    const noteArray = notes instanceof NoteList ? notes.notes : notes;
    return noteArray.every((n) => this.includes(n, enharmonic));
  }

  /**
   * Returns the first note of the list. Note that this is not guaranteed
   * to be the lowest pitch, as a notelist does not need to be ascending.
   */
  root(): Note | undefined {
    return this.notes[0];
  }

  /**
   * Check if the notelist is empty.
   */
  isEmpty(): boolean {
    return this.notes.length === 0;
  }

  /**
   * True if the notelist is a mix of pitches and pitch classes.
   * These lists are possible to create and work with, but can't be used to
   * search or convert to a chord or scale.
   */
  isMixed(): boolean {
    const firstNote = this.notes[0];
    if (!firstNote) return false;
    const rootIsPitch = firstNote.isPitch();
    return this.notes.some((n) => n.isPitch() !== rootIsPitch);
  }

  /**
   * True if all notes in the notelist are pitches (e.g. C#4, not C#).
   */
  isPitches(): boolean {
    return this.notes.every((n) => n.isPitch());
  }

  /**
   * True if all notes in the notelist are pitch classes (e.g. C#, not C#4).
   */
  isPitchClasses(): boolean {
    return this.notes.every((n) => n.isPitchClass());
  }

  /**
   * Search for chords and scales these notes form. Supports sub and super
   * sets as well as exact search.
   *
   * @param enharmonic If true, search won't differentiate between enharmonic intervals
   *
   * @example
   * notes('C E G').search().exact().chord()      // 'major'
   * notes('C E G').search().supersets().scales() // All scales containing C, E, G
   */
  search(enharmonic = true): SearchResult {
    if (this.intervals === undefined) {
      throw new Error(
        "This note list is a mix of pitches and pitch " +
          "classes, and can not be used to search. Convert the list " +
          "using .toPitches(octave) or .toPitchClasses() to search.",
      );
    }

    const intervals = enharmonic
      ? this.intervals.map((i) => i.simplify())
      : this.intervals;

    return _search(
      intervals.map((i) => i.toString()) as IntervalNotation[],
      enharmonic,
    );
  }

  /**
   * Search for scales/chords with the exact notes from this notelist.
   *
   * @param enharmonic If true, search won't differentiate between enharmonic intervals
   *
   * @example
   * notes('C E G').exact().chord()  // 'major'
   * notes('C E G').exact().chords() // ['major']
   */
  exact(enharmonic = true): PatternResult {
    return this.search(enharmonic).exact();
  }

  /**
   * Search for scales/chords including the notes from this notelist.
   *
   * @param enharmonic If true, search won't differentiate between enharmonic intervals
   *
   * @example
   * notes('C E').supersets().scales() // All scales containing C and E
   */
  supersets(enharmonic = true): PatternResult {
    return this.search(enharmonic).supersets();
  }

  /**
   * Search for scales/chords containing only notes from this notelist.
   *
   * @param enharmonic If true, search won't differentiate between enharmonic intervals
   *
   * @example
   * notes('C D E F G A B').subsets().chords() // All chords using only notes from C major scale
   */
  subsets(enharmonic = true): PatternResult {
    return this.search(enharmonic).subsets();
  }

  /**
   * Convert all notes in the list to a pitch in the specified octave.
   * Note that this will also change the octave of existing pitches.
   *
   * @param octave Octave of notes
   */
  toPitches(octave: number): NoteList {
    return new NoteList(this.notes.map((n) => n.toPitch(octave)));
  }

  /**
   * Convert all notes in the list to a pitch class.
   */
  toPitchClasses(): NoteList {
    return new NoteList(this.notes.map((n) => n.toPitchClass()));
  }

  /**
   * Convert note list to an array of note strings.
   */
  toStringArray(): string[] {
    return this.notes.map((n) => n.toString());
  }

  /**
   * Convert note list to a space-separated string of notes.
   */
  toString(): string {
    return this.toStringArray().join(" ");
  }
}

// Shortcut for creating a note list from space separated notes
export const notes = NoteList.fromString;

/**
 * Create a NoteList from a scale tonic and name.
 */
export function scale(notation: string): NoteList {
  const match = notation.match(/^([A-G][b#]*-?[0-9]?)?\s*(.*)$/);
  if (!match) throw new Error(`'${notation}' is not a valid scale`);
  const [, tonic, name] = match;
  return NoteList.fromScale(tonic || "C", name!.trim());
}

/**
 * Create a NoteList from a chord tonic and name.
 */
export function chord(notation: string): NoteList {
  const match = notation.match(/^([A-G][b#]*-?[0-9]?)?\s*(.*)$/);
  if (!match) throw new Error(`'${notation}' is not a valid chord`);
  const [, tonic, name] = match;
  return NoteList.fromChord(tonic || "C", name!.trim());
}
