const { NoteList, Note } = require('../dist/kamasi.js')

test('create note list', () => {
  expect(new NoteList([]).toString()).toBe('')
  expect(new NoteList(['C', 'D', 'E']).toString()).toBe('C D E')
  expect(new NoteList([new Note('F#5'), new Note('Gb5')])
    .toString()).toBe('F#5 Gb5')
})

test('create invalid note list', () => {
  expect(() => new NoteList({'tonic': 'C'})).toThrow() // Invalid type
  expect(() => new NoteList(['C', 'x'])).toThrow() // Invalid note
  expect(() => new NoteList('C #')).toThrow() // Invalid string
})

test('transpose note list', () => {
  // Directly maps Note.transpose(), which is tested in note.test.js
  expect(new NoteList(['C', 'E', 'G']).transpose('P5')
    .toString()).toBe('G B D')
})