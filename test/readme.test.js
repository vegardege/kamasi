// Test README.md commands to ensure they run correctly
import { Interval, interval, note, notes, chord, scale, search } from '#src/index.ts';

test('quick start', () => {
  // Transpose or find interval between notes
  expect(note('G').intervalTo('Cb').toString()).toBe('d4')
  expect(note('G4').transpose('d4').toString()).toBe('Cb5')
  expect(chord('F4 dim').toString()).toBe('F4 Ab4 Cb5')
  expect(scale('D minor').toString()).toBe('D E F G A Bb C')

  // Use operations on custom or known note lists
  expect(notes('Fbb4 B##4 Cb5').simplify().sort().toString()).toBe('D#4 B4 C#5')
  expect(scale('Dm').add('C#').transpose('m2').toString()).toBe('Eb F Gb Ab Bb Cb Db D')
  
  // Reverses lookup from intervals or notes
  expect(search('P1 m3 P5').exact().chord()).toBe('minor')
  expect(notes('F Gb A Bb C').supersets().scales()).toContain('chromatic')
  expect(notes('F Gb A Bb C').supersets().scales()).toContain('major double harmonic')
  expect(scale('minor').subsets().chords()).toContain('minor')
  expect(scale('minor').subsets().chords()).toContain('minor seventh')
  
  // Use nesting and chaining to make a query as complex as you want
  expect(scale('minor').includesAll(chord('sus4'))).toBe(true)
  expect(chord('D4 minor')
          .add('C#5')
          .add(note('C#5').transpose('m3'))
          .exact()
          .chord()).toBe('minor-major ninth')
})

test('intervals', () => {
  expect(interval('M2').add('m3').isEnharmonic('P4')).toBe(true)
  expect(Interval.fromSteps(4, 7)
          .add('M7')
          .simpleTerm()
          .frequencyRatio()).toBeCloseTo(Math.SQRT2)
})

test('notes', () => {
  expect(note('Fbb').simplify().toString()).toBe('D#')
  expect(note('Fbb').isEnharmonic('D#')).toBe(true)
  expect(note('C#4').frequency()).toBeCloseTo(277.1826309768721)

  expect(note('C').transpose('P5').toString()).toBe('G')
  expect(note('D#').intervalTo('A').toString()).toBe('d5')
  expect(note('Eb5').transpose('-A5').toString()).toBe('Abb4')

  expect(note('Eb5').transpose('-A5')
                    .simplify()
                    .toPitchClass()
                    .toString()).toBe('G')
})

test('notelist', () => {
  expect(notes('C4 D#4 Ab4 D5').transpose('-m6').toString()).toBe('E3 F##3 C4 F#4')

  expect(notes('Abb E4 C').toPitches(4)
                          .simplify()
                          .remove('C4')
                          .sort()
                          .toString()).toBe('E4 G4')
})

test('scales', () => {
  expect(scale('E augmented').toString()).toBe('E G G# B B# D#')

  expect(scale('Bb blues minor').transpose('d5').simplify().toString()).toBe('E G A C D')

  expect(scale('ionian').exact().scales()).toContain('major')
  expect(scale('ionian').exact().scales()).toContain('ionian')
})

test('chords', () => {
  expect(chord('A# dom7').toString()).toBe('A# C## E# G#')

  expect(chord('F minor').transpose('M2').includesAll(['G', 'Bb', 'D'])).toBe(true)

  expect(chord('sus4').supersets().chords()).toContain('add fourth')
  expect(chord('sus4').supersets().chords()).toContain('suspended fourth')
})

test('search', () => {
  expect(search('P1 M3 P5 M7', true, 'exact', 'chord')).toBe('major seventh')
  expect(search('P1 M3 P5 M7').exact().chord()).toBe('major seventh')

  expect(notes('C E G').search(true, 'exact', 'chord')).toBe('major')
  expect(notes('C D E F G A B').subsets().chords()).toContain('major')
  expect(notes('C D E F G A B').subsets().chords()).toContain('major sixth')
  expect(notes('C Eb G').supersets().scales()).toContain('minor')
  expect(notes('C Eb G').supersets().scales()).toContain('minor harmonic')

  expect(scale('minor').supersets().scales()).toContain('minor')
  expect(scale('minor').supersets().scales()).toContain('chromatic')
  expect(scale('minor').subsets().chords()).toContain('minor')
  expect(scale('minor').subsets().chords()).toContain('minor seventh')
  expect(chord('7').subsets().chords()).toContain('major')
  expect(chord('dim').supersets().scales()).toContain('chromatic')
  expect(chord('dim').supersets().scales()).toContain('blues hexatonic')
})
