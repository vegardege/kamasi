# Kamasi

Music theory library for node and browsers.

## Reference

 * Interval
 * Note
 * Scale
 * Chords
 * NoteLists
 * Search

### Intervals

An [interval](https://en.wikipedia.org/wiki/Interval_%28music%29) is the difference between two pitches or pitch classes. It is represented by its [shorthand notation](https://en.wikipedia.org/wiki/Interval_%28music%29#Shorthand_notation), which specifies the direction, quality, and number of the interval.

In the example below, we show that a major second (M2) and a minor third (m3) following each other is enharmonically equivalent to a perfect fourth (P4):

```js
interval('M2').add('m3').isEnharmonic('P4') // true
```

The library API is built around chaining.

```js
interval('-m2').add('M14')
               .sub('A6')
               .simpleTerm()
               .toString() // 'P1'
```

Constructors:

 * new **Interval**(_quality_, _number_[, _sign_])
 * Interval.**fromString**(_string_) – Create from [shorthand notation](https://en.wikipedia.org/wiki/Interval_%28music%29#Shorthand_notation)
 * Interval.**fromSemitones**(_semitones_) – Create interval spanning the specified number of semitones
 * Interval.**fromSteps**(_wholetones_, _semitones_) – Create interval spanning specified number of steps

Methods:

 * _interval_.**add**(_interval_) Add two intervals
 * _interval_.**sub**(_interval_) Subtract one interval from another
 * _interval_.**simpleTerm**() Subtract all octaves from a compound interval
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
 * _note_.**toPitchClass**() Convert a pitch to a pitch class by removing the octave
 * _note_.**toPitch**(_octave_) Convert a pitch class to a pitch in the specified octave
 * _note_.**isPitchClass**() Check if the note represents a pitch or a pitch class
 * _note_.**isEnharmonic**(_note_) Checks if the note is [enharmonically equivalent](https://en.wikipedia.org/wiki/Enharmonic) to another
 * _note_.**toString**() Returns the [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) as a string

### Scales

A [scale](https://en.wikipedia.org/wiki/Scale_%28music%29) can be created from a known list of names, and similarly be transposed:

```js
scale('C major').transpose('M2').toString() // 'D E F# G A B C#'
```

See `Scale.scaleNames` or `Scale.alias` for a list of supported scale names.

**Scale preserving functions** will always return a new scale.

**NoteList** functions can be used on a scale, but because they can't guarantee that the result is a valid scale, the return type is `NoteList`.

### Chords

A [chord](https://en.wikipedia.org/wiki/Chord_%28music%29) can be created from a known list of names, and similarly be transposed:

```js
chord('D major').transpose('P5').toString() // 'A C# E'
```

See `Chord.chordNames` or `Chord.alias` for a list of supported scale names.

**Chord preserving functions** will always return a new chord.

**NoteList** functions can be used on a chords, but because they can't guarantee that the result is a valid chord, the return type is `NoteList`.

### Note Lists

If you want to represent a sequence of notes without being restricted to names scales or chords, you can use the `NoteList` class:

```js
notes('C4 D#4 Ab4 D5').transpose('-m6').toString() // 'E3 F##3 C4 F#4'
```


Methods:

 * _notelist_.**transpose**(_interval_) 
 * _notelist_.**simplify**()
 * _notelist_.**includes**(_note_[,_enharmonic_])
 * _notelist_.**includesAll**(_notelist_[,_enharmonic_])
 * _notelist_.**intervals**()
 * _notelist_.**sort**()
 * _notelist_.**toStringArray**()
 * _notelist_.**toString**()

 ### Search

 