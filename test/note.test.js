const { Note, Interval } = require('../dist/kamasi.js')

test('create note with letter, accidentals, and octave', () => {
  expect(new Note('C').toString()).toBe('C')
  expect(new Note('D', '#').toString()).toBe('D#')
  expect(new Note('E', 'b', 4).toString()).toBe('Eb4')
})

test('create interval from scientific pitch notation', () => {
  expect(Note.fromString('F##').toString()).toBe('F##')
  expect(Note.fromString('Gbb3').toString()).toBe('Gbb3')
  expect(Note.fromString('A####-1').toString()).toBe('A####-1')
})

test('create invalid note', () => {
  expect(() => new Note('x', '#')).toThrowError() // Invalid letter
  expect(() => new Note('C', 'x')).toThrowError() // Invalid accidentals
  expect(() => new Note('C', '#', 'x')).toThrowError() // Invalid octave
  expect(() => new Note({})).toThrowError() // Invalid type
  expect(() => Note.fromString('big')).toThrowError() // Invalid string
  expect(() => Note.fromString('D#b')).toThrowError() // Invalid accidentals
})

test('calcuate diatonic and chromatic offset', () => {
  const offset = n => {
    n = Note.fromString(n)
    return [n.diatonicOffset, n.chromaticOffset].join(", ")
  }
  expect(offset('C')).toBe('0, 0')
  expect(offset('F#')).toBe('3, 6')
  expect(offset('Gb4')).toBe('4, 6')
  expect(offset('B####')).toBe('6, 15')
})

// Transposition tests
test('transpose function input', () => {
  expect(Note.fromString('C').transpose(new Interval('P', 5)).toString()).toBe('G')
  expect(Note.fromString('Db').transpose('m3').toString()).toBe('Fb')
})

const t = (note, interval) => Note.fromString(note).transpose(interval).toString()
test('transpose note by positive simple interval', () => {
  expect(t('C', 'P8')).toBe('C')
  expect(t('Db', 'A5')).toBe('A')
  expect(t('E#4', 'M3')).toBe('G##4')
})

test('transpose note by negative simple interval', () => {
  expect(t('D', '-P8')).toBe('D')
  expect(t('Bbb', '-d5')).toBe('Eb')
  expect(t('A#5', '-m7')).toBe('B#4')
})

test('transpose note by compound interval', () => {
  expect(t('E', 'P15')).toBe('E')
  expect(t('Fbb', '-d14')).toBe('Gb')
  expect(t('G#4', 'M14')).toBe('F##6')
})

test('transpose difficult notes', () => {
  expect(t('B###4', 'm2')).toBe('C###5')
  expect(t('Dbbbbbb', 'A6')).toBe('Bbbbbb')
  expect(t('Cbb5', '-d3')).toBe('Ab4')
  expect(t('B#############2', 'A3')).toBe('D###############3')
})

// Utility function tests
test('calculate distance between notes and enharmonicity', () => {
  expect(Note.fromString('C4').distance('F4')).toBe(5)
  expect(Note.fromString('Abb').distance('D#')).toBe(-4)
  expect(Note.fromString('B3').distance('C6')).toBe(25)
  expect(Note.fromString('C##').isEnharmonic('Ebb')).toBe(true)
  expect(Note.fromString('C##4').isEnharmonic('Ebb5')).toBe(false)
})

test('calculate frequency and midi of note', () => {
  expect(Note.fromString('C4').frequency()).toBeCloseTo(261.6256, 3)
  expect(Note.fromString('B7').frequency()).toBeCloseTo(3951.066, 2)
  expect(Note.fromString('C0').frequency()).toBeCloseTo(16.35160, 3)
  expect(Note.fromString('F1').midi()).toBe(29)
  expect(Note.fromString('G#8').midi()).toBe(116)
  expect(Note.fromString('C-2').midi()).toBe(-1)
  expect(Note.fromString('B9').midi()).toBe(-1)
})

test('simplify a note', () => {
  expect(Note.fromString('F####').simplify().toString()).toBe('A')
  expect(Note.fromString('Dbbbb4').simplify().toString()).toBe('A#3')
  expect(Note.fromString('B#############2').simplify().toString()).toBe('C4')
})