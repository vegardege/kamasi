const { Chord } = require('../dist/kamasi.js')

test('create chord', () => {
  expect(new Chord('C', 'major').toString()).toBe('C E G')
  expect(new Chord('D major').toString()).toBe('D F# A')
  expect(new Chord('Eb').toString()).toBe('Eb G Bb')
})

test('create invalid chord', () => {
  expect(() => new Chord({'tonic': 'C'})).toThrow() // Invalid type
  expect(() => new Chord('x', 'major')).toThrow() // Invalid note
  expect(() => new Chord('C', 'xxxxx')).toThrow() // Invalid name
  expect(() => new Chord('Cmajor')).toThrow() // Invalid string
})

test('transpose chord', () => {
  // Directly maps Note.transpose(), which is tested in note.test.js
  expect(new Chord('C major').transpose('P5')
    .toString()).toBe('G B D')
})