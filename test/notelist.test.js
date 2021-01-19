const { NoteList, Note } = require('../dist/kamasi.js')

test('create note list', () => {
  expect(new NoteList([]).toString()).toBe('')
  expect(new NoteList([new Note('F', '#', 5), new Note('G', 'b', 5)])
    .toString()).toBe('F#5 Gb5')
  expect(NoteList.fromString('G4 A4 B4').toString()).toBe('G4 A4 B4')
})

test('create invalid note list', () => {
  expect(() => NoteList.fromString('C #')).toThrow() // Invalid string
})

test('transpose note list', () => {
  // Directly maps Note.transpose(), which is tested in note.test.js
  expect(NoteList.fromString('C E G').transpose('P5')
    .toString()).toBe('G B D')
})

test('find intervals in list', () => {
  // Directly maps Note.intervalTo(), which is tested in note.test.js
  const intervals = NoteList.fromString('C E G').intervals()
  expect(intervals[0].toString()).toBe('P1')
  expect(intervals[1].toString()).toBe('M3')
  expect(intervals[2].toString()).toBe('P5')
})
