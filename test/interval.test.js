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