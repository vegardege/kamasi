# Kamasi

Music theory library for node and browsers.

## Reference

### Notes and Intervals

The core objects of Kamasi is the [note](https://en.wikipedia.org/wiki/Musical_note), representing a pitch or a pitch class, and the [interval](https://en.wikipedia.org/wiki/Interval_%28music%29), representing the difference between two pitches or pitch classes. The two are specified by [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) and [shorthand notation](https://en.wikipedia.org/wiki/Interval_%28music%29#Shorthand_notation) respectively.

An interval can be used to transpose a note:

```js
Note.fromString('C').transpose('P5').toString() // 'G'
Note.fromString('Eb5').transpose('-A5').toString() // 'Abb4'
```

### Scales

A [scale](https://en.wikipedia.org/wiki/Scale_%28music%29) can be created from a known list of names, and similarly be transposed:

```js
Scale.fromString('C major').transpose('M2').toString() // 'D E F# G A B C#'
```

See `Scale.scaleNames` or `Scale.alias` for a list of supported scale names.

**Scale preserving functions** will always return a new scale.

**NoteList** functions can be used on a scale, but because they can't guarantee that the result is a valid scale, the return type is `NoteList`.

### Chords

A [chord](https://en.wikipedia.org/wiki/Chord_%28music%29) can be created from a known list of names, and similarly be transposed:

```js
Chord.fromString('D major').transpose('P5').toString() // 'A C# E'
```

See `Chord.chordNames` or `Chord.alias` for a list of supported scale names.

**Chord preserving functions** will always return a new chord.

**NoteList** functions can be used on a chords, but because they can't guarantee that the result is a valid chord, the return type is `NoteList`.

### Note Lists

If you want to represent a sequence of notes without being restricted to names scales or chords, you can use the `NoteList` class:

```js
NoteList.fromString('C4 D#4 Ab4 D5').transpose('-m6').toString() // 'E3 F##3 C4 F#4'
```