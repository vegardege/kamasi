export const CHORDS = {

  // Triads
  'major':      ['P1', 'M3', 'P5'],
  'minor':      ['P1', 'm3', 'P5'],
  'augmented':  ['P1', 'M3', 'A5'],
  'diminished': ['P1', 'm3', 'd5'],

  // Sixth chords
  'major sixth': ['P1', 'M3', 'P5', 'M6'],
  'minor sixth': ['P1', 'm3', 'P5', 'M6'],

  // Seventh chords
  'dominant seventh':        ['P1', 'M3', 'P5', 'm7'],
  'major seventh':           ['P1', 'M3', 'P5', 'M7'],
  'augmented seventh':       ['P1', 'M3', 'A5', 'm7'],
  'minor seventh':           ['P1', 'm3', 'P5', 'm7'],
  'minor-major seventh':     ['P1', 'm3', 'P5', 'M7'],
  'diminished seventh':      ['P1', 'm3', 'd5', 'd7'],
  'half-diminished seventh': ['P1', 'm3', 'd5', 'm7'],
  'augmented major seventh': ['P1', 'M3', 'A5', 'M7'],

  // Extended chords (TODO)
  // Altered chords (TODO)
  
  // Added tone chords
  'add nine':    ['P1', 'M3', 'P5', 'M9'],
  'add fourth':  ['P1', 'M3', 'P5', 'P4'],
  'six-nine':    ['P1', 'M3', 'P5', 'M6', 'M9'],
  'seven-six':   ['P1', 'M3', 'P5', 'M6', 'm7'],
  'mixed-third': ['P1', 'm3', 'M3', 'P5'],

  // Suspended chords
  'suspended second': ['P1', 'M2', 'P5'],
  'suspended fourth': ['P1', 'P4', 'P5'],
  'suspended jazz':   ['P1', 'P5', 'm7', 'M9'],

  // Borrowed chords (TODO)

}

export const ALIAS = {
  '': 'major',
  'maj': 'major',

  'm': 'minor',
  'min': 'minor',

  'o': 'diminished',
  'dim': 'diminished',

  '+': 'augmented',
  'aug': 'augmented',

  '6': 'major sixth',
  'M6': 'major sixth',
  'maj6': 'major sixth',
  'add sixth': 'major sixth',

  'm6': 'minor sixth',
  'min6': 'minor sixth',

  '7': 'dominant seventh',
  'dom7': 'dominant seventh',

  'M7': 'major seventh',
  'maj7': 'major seventh',
  '∆7': 'major seventh',

  '+7': 'augmented seventh',
  'aug7': 'augmented seventh',

  'm7': 'minor seventh',
  'min7': 'minor seventh',

  'mM7': 'minor-major seventh',
  'minmaj7': 'minor-major seventh',

  'o7': 'diminished seventh',
  'dim7': 'diminished seventh',

  'ø': 'half-diminished seventh',
  'ø7': 'half-diminished seventh',

  '+M7': 'augmented major seventh',
  'augM7': 'augmented major seventh',

  '2': 'add nine',
  'add9': 'add nine',

  '4': 'add fourth',
  'add11': 'add fourth',

  '6/9': 'six-nine',
  '7/6': 'seven-six',

  'sus2': 'suspended second',
  'sus4': 'suspended fourth',
  '9sus4': 'suspended jazz',
}