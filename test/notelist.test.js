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

test('add, remove, and toggle notes', () => {
  const noteList = new NoteList([new Note('F', '#', 5), new Note('G', 'b', 5)])
  expect(noteList.add('A5').toString()).toBe('F#5 Gb5 A5')
  expect(noteList.remove('F#5').toString()).toBe('Gb5')
  expect(noteList.remove('E##5').toString()).toBe('F#5 Gb5')
  expect(noteList.remove('E##5', true).toString()).toBe('')
  expect(noteList.toggle('Gb5').toString()).toBe('F#5')
  expect(noteList.toggle('A5', true).toString()).toBe('F#5 Gb5 A5')
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
  expect(new NoteList([]).isEmpty()).toBe(true)
  expect(NoteList.fromString('C4 D4 E4').isEmpty()).toBe(false)
  expect(NoteList.fromString('C4 D4 E4').root().toString()).toBe('C4')
})

test('check pitches and pitch classes', () => {
  const noteList = new NoteList([new Note('F', '#'), new Note('G', 'b')])
  const mixedNoteList = new NoteList([new Note('D', '#'), new Note('A', 'b', 4)])
  expect(noteList.isPitches()).toBe(false)
  expect(noteList.isPitchClasses()).toBe(true)
  expect(noteList.isMixed()).toBe(false)
  expect(noteList.toPitches(4).toString()).toBe('F#4 Gb4')
  expect(mixedNoteList.isPitches()).toBe(false)
  expect(mixedNoteList.isPitchClasses()).toBe(false)
  expect(mixedNoteList.isMixed()).toBe(true)
  expect(mixedNoteList.toPitches(4).toString()).toBe('D#4 Ab4')
  expect(mixedNoteList.toPitchClasses().toString()).toBe('D# Ab')
})

test('search for scale/chord', () => {
  const noteList = new NoteList([new Note('C'), new Note('F', 'b')])
  const mixedNoteList = new NoteList([new Note('C'), new Note('E', '', 4)])
  expect(noteList.search()).toStrictEqual({'scales': {}, 'chords': {}})
  expect(noteList.search(true)).toStrictEqual({'scales': {}, 'chords': {}})
  expect(noteList.supersets(true)['chords']['major']).toBe(2/3)
  expect(noteList.subsets(true)).toStrictEqual({'scales': {}, 'chords': {}})
  expect(() => mixedNoteList.search()).toThrow()
})