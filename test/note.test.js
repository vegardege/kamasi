const { Note, Interval } = require('../dist/kamasi.js')

test('create note with letter, accidentals, and octave', () => {
  expect(new Note('C').toString()).toBe('C')
  expect(new Note('D', '#').toString()).toBe('D#')
  expect(new Note('E', 'b', 4).toString()).toBe('Eb4')
})

test('create interval from scientific pitch notation', () => {
  expect(new Note('F##').toString()).toBe('F##')
  expect(new Note('Gbb3').toString()).toBe('Gbb3')
  expect(new Note('A####-1').toString()).toBe('A####-1')
})

test('create invalid note', () => {
  expect(() => new Note('big')).toThrowError() // Invalid string
  expect(() => new Note('x', '#')).toThrowError() // Invalid letter
  expect(() => new Note('C', 'x')).toThrowError() // Invalid accidentals
  expect(() => new Note('C', '#', 'x')).toThrowError() // Invalid octave
  expect(() => new Note('D#b')).toThrowError() // Invalid accidentals
  expect(() => new Note({})).toThrowError() // Invalid type
})

test('calcuate diatonic and chromatic offset', () => {
  const offset = n => {
    n = new Note(n)
    return [n.diatonicOffset, n.chromaticOffset].join(", ")
  }
  expect(offset('C')).toBe('0, 0')
  expect(offset('F#')).toBe('3, 6')
  expect(offset('Gb4')).toBe('4, 6')
  expect(offset('B####')).toBe('6, 15')
})

// Transposition tests
test('transpose function input', () => {
  expect(new Note('C').transpose(new Interval('P5')).toString()).toBe('G')
  expect(new Note('Db').transpose('m3').toString()).toBe('Fb')
})

const t = (note, interval) => new Note(note).transpose(interval).toString()
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
