# Kamasi

Music theory library for node and browsers.

## Installation

## Quick Intro

To explore Kamasi, start with the functions `interval()`, `note()`, `notes()`, `scale()`, `chord()`, and `search()`. They all accept a string input, and return an object with the functions listed in the [reference](#reference).

Here are a few examples of what you can do:

```js
// Transpose or find interval between notes
note('G').intervalTo('Cb').toString() // 'd4'
note('G4').transpose('d4').toString() // 'Cb5'

// Lookup a chord or a scale
scale('Dm').toString() // 'D E F G A Bb C'
chord('F4 dim').toString() // 'F4 Ab4 Cb5'

// Use operations on custom or known note lists
notes('Fbb4 B##4 Cb5').simplify().sort().toString() // 'D#4 B4 C#5'
scale('Dm').add('C#').transpose('m2').toString() // 'Eb F Gb Ab Bb Cb Db D'

// Reverses lookup from intervals or notes
search('P1 m3 P5').exact().chord() // 'minor'
notes('F Gb A Bb C').supersets().scales() // [ 'chromatic', 'major double harmonic', ...]
scale('C minor').subsets().chords() // [ 'minor', 'minor seventh', ... ]

// Use nesting and chaining to make a query as complex as you want
chord('D4 minor')
  .add('C#5')
  .add(note('C#5').transpose('m3'))
  .add(note('C#5').transpose(interval('m3').add('m3')))
  .exact()
  .chord() // 'minor-major eleventh'
```

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

You can use chaining to combine different actions:

```js
Interval.fromSteps(4, 7)
        .add('M6')
        .simpleTerm()
        .frequencyRatio() // 1.4142135623730951
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
note('D#').intervalTo('A').toString() // 'd5'
note('Eb5').transpose('-A5').toString() // 'Abb4'
```

You can uses chaining to perform several actions in one line. If you're unhappy with the 'Abb4' return value of the last line, it can be simplified:

```js
note('Eb5').transpose('-A5')
           .simplify()
           .toPitchClass()
           .toString() // 'G'
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

Chaining still works for the lists:

```js
notes('Abb E4 C').toPitches(4)
                 .simplify()
                 .remove('C4')
                 .sort()
                 .toString() // 'E4 G4'
```

Constructors:

 * **new NoteLists**(_root_[, _intervals]) Create a NoteList from a list of notes or a root note and intervals
 * NoteList.**fromString**(_string_) Create a NoteList from a space separated list of notes

Methods:

 * _notelist_.**transpose**(_interval_) Transpose all notes in list
 * _notelist_.**simplify**() Simplify all notes in list
 * _notelist_.**add**(_note_) Add note to the end of the list
 * _notelist_.**remove**(_note_[, _enharmonic_]) Remove (enharmonic) notes from list
 * _notelist_.**toggle**(_note_[, _enharmonic_]) Toggle (enharmonic) notes in list
 * _notelist_.**includes**(_note_[, _enharmonic_]) True if list contains (enharmonic) note
 * _notelist_.**includesAll**(_notelist_[, _enharmonic_]) True if list contains all (enharmonic) notes
 * _notelist_.**sort**() Return a sorted copy of the list
 * _notelist_.**root**() Return the root note of the list
 * _notelist_.**search**([_enharmonic_[, _searchType_[, _patternType_]]]) See [search](#search)
 * _notelist_.**subsets**([_enharmonic_]) See [search](#search)
 * _notelist_.**supersets**([_enharmonic_]) See [search](#search)
 * _notelist_.**isEmpty**() True if list is empty
 * _notelist_.**isMixed**() True if list is mix of pitches and pitch classes
 * _notelist_.**isPitches**() True if list is only specific pitches
 * _notelist_.**isPitchClasses**() True if list is only pitch classes
 * _notelist_.**toPitches**(_octave_) Convert all notes to pitches in specified octave
 * _notelist_.**toPitchClasses**() Convert all notes to pitch classes
 * _notelist_.**toStringArray**() Return array of [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)
 * _notelist_.**toString**() Return [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) as a string

### Scales

A scale is just a NoteList, but you can create it using a known name:

```js
scale('E augmented').toString() // 'E G G# B B# D#'
```

It returns a `NoteList` object, so all methods in the last section can be used:

```js
scale('Bb blues minor').transpose('d5').simplify().toString() // 'E G A C D'
```

 * NoteList.**fromScale**(_tonic_, _name_) Create a NoteList from a tonic note and a scale name
 * **scale**(_name_) Create a NoteList from a scale name string

These functions both return a NoteList, allowing normal use.

To find a scale from a NoteList, see the [search](#search) section.

### Chords

A chord is just a NoteList, but you can create it using a known name:

```js
chord('A# dom7').toString() // 'A# C## E# G#'
```

It returns a `NoteList` object, so all methods in the last section can be used:

```js
chord('F minor').transpose('M2').includesAll(['G', 'Bb', 'D']) // true
```

 * NoteList.**fromChord**(_tonic_, _name_) Create a NoteList from a tonic note and a chord name
 * **chord**(_name_) Create a NoteList from a chord name string

These functions both return a NoteList, allowing normal use.

To find a chord from a NoteList, see the [search](#search) section.

### Search

There are two ways to search for chords or scales using kamasi. To search with intervals, use the top-level `search()` function. It supports arguments or chaining:

```js
search('P1 M3 P5 M7', true, 'exact', 'chord') // 'major seventh'
search('P1 M3 P5 M7').exact().chord() // 'major seventh'
```

If you want to search using notes rather than intervals, the same interface is available from the notelist class:

```js
notes('C E G').search(true, 'exact', 'chord') // 'major'
notes('C D E F G A B').subsets().chords() // [ 'major', 'major sixth', ... ]
notes('C Eb G').supersets().scales() // [ 'minor', 'minor harmonic', ... ]
```

Note that `scale()` and `chord()` returns `NoteList`, allowing you to find sub and supersets of scales and chords:

```js
scale('C minor').supersets().scales() // [ 'minor', 'chromatic', ... ]
scale('C minor').subsets().chords() // [ 'minor', 'minor seventh', ... ]
chord('C7').subsets().chords() // [ 'major' ]
chord('C dim').supersets().scales() // [ 'chromatic', 'blues hexatonic', ... ]
```

The function definitions are:

 * **search**(_intervals_, _enharmonic_) Find scales and chords from a space separated list of (enharmonic) intervals

If you want to search based on notes, use notelist:

 * _notelist_.**exact**([_enharmonic_]) Find scales and chords from a notelist
 * _notelist_.**subsets**([_enharmonic_]) Find chords from a notelist
 * _notelist_.**supersets**([_enharmonic_]) Find scales from a notelist

All of these functions will return an object with functions you can use to narrow the search. The search itself is performed lazily.

The top level lets you choose one of four functions:

 * **exact**() Scale/chord has the exact same intervals as search object
 * **subsets**() Scale/chord contains only intervals in the search object
 * **supersets**() Scale/chord contains all intervals in the search object

The second level contains four functions:

 * **chord**() Narrow search object down to a single chord
 * **scale**() Narrow search object down to scales scale
 * **chords**() Narrow search object down to chords
 * **scales**() Narrow search object down to scales

If multiple chords/scales match, the singlular form will return the first. This may or may not be the best match.
