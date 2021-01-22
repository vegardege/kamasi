const { Chord } = require('../dist/kamasi.js')
const { Note } = require('../dist/kamasi.js')

test('create chord', () => {
  expect(new Chord(new Note('C'), 'major').notes.join(' ')).toBe('C E G')
  expect(Chord.fromString('D major').notes.join(' ')).toBe('D F# A')
  expect(Chord.fromString('Eb').notes.join(' ')).toBe('Eb G Bb')
})

test('create invalid chord', () => {
  expect(() => new Chord({'tonic': 'C'})).toThrow() // Invalid type
  expect(() => new Chord('x', 'major')).toThrow() // Invalid note
  expect(() => new Chord('C', 'xxxxx')).toThrow() // Invalid name
})

test('transpose chord', () => {
  // Directly maps Note.transpose(), which is tested in note.test.js
  expect(Chord.fromString('C major').transpose('P5')
  .notes.join(' ')).toBe('G B D')
})