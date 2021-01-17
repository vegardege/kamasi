const { Scale } = require('../dist/kamasi.js')

test('create scale', () => {
  expect(new Scale('C', 'major').toString()).toBe('C D E F G A B')
  expect(new Scale('D major').toString()).toBe('D E F# G A B C#')
  expect(new Scale('Eb').toString()).toBe('Eb F G Ab Bb C D')
})

test('create invalid scale', () => {
  expect(() => new Scale({'tonic': 'C'})).toThrow() // Invalid type
  expect(() => new Scale('x', 'major')).toThrow() // Invalid note
  expect(() => new Scale('C', 'xxxxx')).toThrow() // Invalid name
  expect(() => new Scale('Cmajor')).toThrow() // Invalid string
})

test('transpose scale', () => {
  // Directly maps Note.transpose(), which is tested in note.test.js
  expect(new Scale('C major').transpose('P5')
    .toString()).toBe('G A B C D E F#')
})