const { Interval } = require('../dist/kamasi.js')

test('create interval with quality, number, and direction', () => {
  expect(new Interval('P', 1).toString()).toBe('P1')
  expect(new Interval('m', 3, '-').toString()).toBe('-m3')
  expect(new Interval('A', 28, '+').toString()).toBe('A28')
})

test('create interval with shorthand notation', () => {
  expect(new Interval('M2').toString()).toBe('M2')
  expect(new Interval('-d8').toString()).toBe('-d8')
  expect(new Interval('+d44').toString()).toBe('d44')
})

test('create invalid interval', () => {
  expect(() => new Interval('big')).toThrowError() // Invalid string
  expect(() => new Interval('x', 4)).toThrowError() // Invalid quality
  expect(() => new Interval('P', -1)).toThrowError() // Invalid number
  expect(() => new Interval('P', 1, '/')).toThrowError() // Invalid sign
  expect(() => new Interval('m', 1)).toThrowError() // Invalid combination
  expect(() => new Interval('d1')).toThrowError() // Invalid combination
  expect(() => new Interval({})).toThrowError() // Invalid type
})

test('calculate diatonic and chromatic steps', () => {
  const steps = i => {
    i = new Interval(i)
    return [i.diatonicSteps, i.chromaticSteps].join(", ")
  }
  expect(steps('M7')).toBe('6, 11')
  expect(steps('P12')).toBe('11, 19')
  expect(steps('-P8')).toBe('-7, -12')
  expect(steps('-A18')).toBe('-17, -30')
})

test('calculate frequency ratio and cents', () => {
  expect(new Interval('m3').frequencyRatio()).toBeCloseTo(1.18921, 5)
  expect(new Interval('-m3').frequencyRatio()).toBeCloseTo(0.84090, 5)
  expect(new Interval('P15').frequencyRatio()).toBe(4)
  expect(new Interval('P5').cents()).toBe(700)
})

test('find inversion of interval', () => {
  expect(new Interval('P1').invert().toString()).toBe('P8')
  expect(new Interval('P8').invert().toString()).toBe('P1')
  expect(new Interval('-P15').invert().toString()).toBe('-P1')
  expect(new Interval('A6').invert().toString()).toBe('d3')
  expect(new Interval('-M9').invert().toString()).toBe('-m7')
})

test('check if intervals are enharmonic', () => {
  expect(new Interval('M3').isEnharmonic('d4')).toBe(true)
  expect(new Interval('-A6').isEnharmonic('-m7')).toBe(true)
  expect(new Interval('d9').isEnharmonic('d2')).toBe(false)
})