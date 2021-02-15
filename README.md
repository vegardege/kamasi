# Kamasi

Music theory library for node and browsers.

## Installation

## Quick Intro

## Reference

 * [Intervals](#intervals)
 * [Notes](#notes)
 * [NoteLists](#notelists)
 * [Scales](#scales)
 * [Chords](#chords)
 * [Search](#search)

### Intervals

An [interval](https://en.wikipedia.org/wiki/Interval_%28music%29) is the difference between two pitches or pitch classes. It is represented by its [shorthand notation](https://en.wikipedia.org/wiki/Interval_%28music%29#Shorthand_notation), which specifies the direction, quality, and diatonic number of the interval.

In the example below, we show that a major second (M2) and a minor third (m3) following each other is enharmonically equivalent to a perfect fourth (P4):

```js
interval('M2').add('m3').isEnharmonic('P4') // true
```

Constructors:

 * new **Interval**(_quality_, _number_[, _sign_])
 * Interval.**fromString**(_string_) – Create from [shorthand notation](https://en.wikipedia.org/wiki/Interval_%28music%29#Shorthand_notation)
 * Interval.**fromSemitones**(_semitones_) – Create interval spanning the specified number of semitones
 * Interval.**fromSteps**(_diatonicSteps_, _semitones_) – Create interval spanning specified number of steps (not guaranteed to have a valid answer)

Methods:

 * _interval_.**add**(_interval_) Add two intervals
 * _interval_.**sub**(_interval_) Subtract one interval from another
 * _interval_.**simpleTerm**() Subtract all octaves from a compound interval
 * _interval_.**simplify**() Find the enharmonic interval with the simplest quality possible
 * _interval_.**frequencyRatio**() Returns the [frequency ratio](https://en.wikipedia.org/wiki/Interval_%28music%29#Frequency_ratios) of interval as a float
 * _interval_.**cents**() Returns the interval size in [cents](https://en.wikipedia.org/wiki/Interval_%28music%29#Cents) as an int
 * _interval_.**invert**() Returns the [invert](https://en.wikipedia.org/wiki/Interval_%28music%29#Inversion) of the interval
 * _interval_.**isCompound**() Returns true if the interval spans more than one octave
 * _interval_.**isEnharmonic**(_interval_) Checks if the interval is [enharmonically equivalent](https://en.wikipedia.org/wiki/Interval_%28music%29#Enharmonic_intervals) to another
 * _interval_.**toString**() Returns the [shorthand notation](https://en.wikipedia.org/wiki/Interval_%28music%29#Shorthand_notation) as a string

### Notes

A [note](https://en.wikipedia.org/wiki/Musical_note) represents a specific pitch or a general pitch class. It is represented by its [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation), which specifies the note letter, accidentals, and the octave (empty for pitch classes).

```js
note('Fbb').simplify().toString() // 'D#'
note('Fbb').isEnharmonic('D#') // true
note('C#4').frequency() // 277.1826309768721
```

Notes can be transposed using intervals. We can also find an interval from two notes:

```js
note('C').transpose('P5').toString() // 'G'
note('Eb5').transpose('-A5').toString() // 'Abb4'
note('D#').intervalTo('A').toString() // 'd5'
```

Constructors:

 * **new Note**(_letter_, _accidentals_[, _octave_]) Create a new pitch (with octave) or pitch class
 * Note.**fromString**(_string_) Create a note from its [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)

Methods:

 * _note_.**transpose**(_interval_) [Transpose](https://en.wikipedia.org/wiki/Transposition_%28music%29) a note by the specified interval
 * _note_.**distance**(_note_) Returns the distance between two notes in semitones
 * _note_.**intervalTo**(_note_) Returns the interval from this to another note
 * _note_.**intervalFrom**(_note_) Returns the interval from another note to this
 * _note_.**frequency**() Returns the frequency in Hz as a float (A4 = 440Hz)
 * _note_.**midi**() Returns the MIDI code of the note
 * _note_.**simplify**() Returns the enharmonic note with the fewest possible accidentals
 * _note_.**isEqual**(_note_) Check if two notes are identical
 * _note_.**isEnharmonic**(_note_) Check if the note is [enharmonically equivalent](https://en.wikipedia.org/wiki/Enharmonic) to another note
 * _note_.**isPitch**() Check if the note is a specific pitch
 * _note_.**isPitchClass**() Check if the note is a pitch class
 * _note_.**toPitch**(_octave_) Convert a pitch class to a pitch in the specified octave
 * _note_.**toPitchClass**() Convert a pitch to a pitch class by removing the octave
 * _note_.**toString**() Returns the [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) as a string

### NoteLists

If you want to represent a sequence of notes without being restricted to names scales or chords, you can use the `NoteList` class:

```js
notes('C4 D#4 Ab4 D5').transpose('-m6').toString() // 'E3 F##3 C4 F#4'
```

Constructors:

 * **new NoteLists**(_root_[, _intervals]) Create a NoteList from a list of notes or a root note and intervals
 * NoteList.**fromString**(_string_) Create a NoteList from a space separated list of notes
 * NoteList.**fromScale**(_tonic_, _name_) Create a NoteList from a tonic note and a scale name
 * NoteList.**fromChord**(_tonic_, _name_) Create a NoteList from a tonic note and a chord name

Methods:

 * _notelist_.**transpose**(_interval_) 
 * _notelist_.**simplify**()
 * _notelist_.**add**(_note_)
 * _notelist_.**remove**(_note_[, _enharmonic_])
 * _notelist_.**toggle**(_note_[, _enharmonic_])
 * _notelist_.**includes**(_note_[, _enharmonic_])
 * _notelist_.**includesAll**(_notelist_[, _enharmonic_])
 * _notelist_.**sort**()
 * _notelist_.**root**()
 * _notelist_.**search**([_enharmonic_[, _type_]])
 * _notelist_.**subsets**([_enharmonic_])
 * _notelist_.**supersets**([_enharmonic_])
 * _notelist_.**isEmpty**()
 * _notelist_.**isMixed**()
 * _notelist_.**isPitches**()
 * _notelist_.**isPitchClasses**()
 * _notelist_.**toPitches**(_octave_)
 * _notelist_.**toPitchClasses**()
 * _notelist_.**toStringArray**()
 * _notelist_.**toString**()

### Scales

### Chords

### Search

 