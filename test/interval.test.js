const { Interval } = require('../dist/kamasi.js')

test('create interval with quality, number, and direction', () => {
  expect(new Interval('P', 1).toString()).toBe('P1')
  expect(new Interval('m', 3, '-').toString()).toBe('-m3')
  expect(new Interval('A', 28, '+').toString()).toBe('A28')
})

test('create interval with shorthand notation', () => {
  expect(Interval.fromString('M2').toString()).toBe('M2')
  expect(Interval.fromString('-d8').toString()).toBe('-d8')
  expect(Interval.fromString('+d44').toString()).toBe('d44')
})

test('create interval from semitones', () => {
  expect(Interval.fromSemitones(5).toString()).toBe('P4')
  expect(Interval.fromSemitones(-6).toString()).toBe('-A4')
  expect(Interval.fromSemitones(-21).toString()).toBe('-M13')
})

test('create interval from steps', () => {
  expect(Interval.fromSteps(2, 3).toString()).toBe('m3')
  expect(Interval.fromSteps(-4, -7).toString()).toBe('-P5')
  expect(Interval.fromSteps(14, 23).toString()).toBe('d15')
  expect(Interval.fromSteps(-9, -18).toString()).toBe('-AA10')
  expect(Interval.fromSteps(1, -1).toString()).toBe('dd2')
  expect(Interval.fromSteps(-1, 1).toString()).toBe('-dd2')
})

test('create invalid interval', () => {
  expect(() => new Interval('x', 4)).toThrowError() // Invalid quality
  expect(() => new Interval('P', -1)).toThrowError() // Invalid number
  expect(() => new Interval('P', 1, '/')).toThrowError() // Invalid sign
  expect(() => new Interval('m', 1)).toThrowError() // Invalid combination
  expect(() => new Interval({})).toThrowError() // Invalid type
  expect(() => Interval.fromString('big')).toThrowError() // Invalid string
  expect(() => Interval.fromString('P2')).toThrowError() // Invalid combination
})

test('calculate diatonic and chromatic steps', () => {
  const steps = i => {
    i = Interval.fromString(i)
    return [i.diatonicSteps, i.chromaticSteps].join(", ")
  }
  expect(steps('M7')).toBe('6, 11')
  expect(steps('P12')).toBe('11, 19')
  expect(steps('-P8')).toBe('-7, -12')
  expect(steps('-A18')).toBe('-17, -30')
})

test('add and subtract intervals', () => {
  expect(Interval.fromString('M3').add('m2').toString()).toBe('P4')
  expect(Interval.fromString('-A11').add('P4').toString()).toBe('-A8')
  expect(Interval.fromString('d20').sub('A11').toString()).toBe('dd10')
  expect(Interval.fromString('-P5').sub('m3').toString()).toBe('-m7')
})

test('calculate frequency ratio and cents', () => {
  expect(Interval.fromString('m3').frequencyRatio()).toBeCloseTo(1.18921, 5)
  expect(Interval.fromString('-m3').frequencyRatio()).toBeCloseTo(0.84090, 5)
  expect(Interval.fromString('P15').frequencyRatio()).toBe(4)
  expect(Interval.fromString('P5').cents()).toBe(700)
})

test('find inversion of interval', () => {
  expect(Interval.fromString('P1').invert().toString()).toBe('P8')
  expect(Interval.fromString('P8').invert().toString()).toBe('P1')
  expect(Interval.fromString('-P15').invert().toString()).toBe('-P1')
  expect(Interval.fromString('AA6').invert().toString()).toBe('dd3')
  expect(Interval.fromString('-M9').invert().toString()).toBe('-m7')
})
 
test('check if intervals are enharmonic', () => {
  expect(Interval.fromString('M3').isEnharmonic('d4')).toBe(true)
  expect(Interval.fromString('-A6').isEnharmonic('-m7')).toBe(true)
  expect(Interval.fromString('d9').isEnharmonic('d2')).toBe(false)
})