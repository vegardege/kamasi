const { NoteList, Note } = require('../dist/kamasi.js')

test('create note list', () => {
  expect(new NoteList().toString()).toBe('')
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
  const intervals = NoteList.fromString('C E G').intervals
  expect(intervals[0].toString()).toBe('P1')
  expect(intervals[1].toString()).toBe('M3')
  expect(intervals[2].toString()).toBe('P5')
})

test('sort note list', () => {
  expect(NoteList.fromString('F4 C6 D3 A####5 Bbbb5').sort()
    .toString()).toBe('D3 F4 Bbbb5 A####5 C6')
})

test('simplify note list', () => {
  // Directly maps Note.simplify(), which is tested in note.test.js
  expect(NoteList.fromString('Fb4 C##6 Dbbb3 A####5 Bbbb5').simplify()
    .toString()).toBe('E4 D6 B2 C#6 G#5')
})

test('add and remove notes', () => {
  const noteList = new NoteList([new Note('F', '#', 5), new Note('G', 'b', 5)])
  expect(noteList.add('A5').toString()).toBe('F#5 Gb5 A5')
  expect(noteList.remove('F#5').toString()).toBe('Gb5')
  expect(noteList.remove('E##5').toString()).toBe('F#5 Gb5')
  expect(noteList.remove('E##5', true).toString()).toBe('')
})

test('check if note is in note list', () => {
  // Directly maps Note.simplify(), which is tested in note.test.js
  expect(NoteList.fromString('E4 F4 C#6').includes('E4')).toBe(true)
  expect(NoteList.fromString('E4 F4 C#6').includes('Gbb4')).toBe(false)
  expect(NoteList.fromString('E4 F4 C#6').includes('Gbb4', true)).toBe(true)

  expect(NoteList.fromString('C D E F G').includesAll(['C', 'D'])).toBe(true)
  expect(NoteList.fromString('C D E F G').includesAll(['C', 'Ebb'])).toBe(false)
  expect(NoteList.fromString('C D E F G').includesAll(['C', 'Ebb'], true)).toBe(true)
})

test('check if list is empty or root note', () => {
  expect((new NoteList([])).isEmpty()).toBe(true)
  expect(NoteList.fromString('C4 D4 E4').isEmpty()).toBe(false)
  expect(NoteList.fromString('C4 D4 E4').root().toString()).toBe('C4')
})
