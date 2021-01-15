const { Note } = require('../dist/kamasi.js')

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