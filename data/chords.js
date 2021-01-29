export const CHORDS = {

  // Triads
  'major': ['P1', 'M3', 'P5'],
  'min':   ['P1', 'm3', 'P5'],
  'aug':   ['P1', 'M3', 'A5'],
  'dim':   ['P1', 'm3', 'd5'],

  // Seventh chords
  'dim7':    ['P1', 'm3', 'd5', 'd7'],
  'ø':       ['P1', 'm3', 'd5', 'm7'],
  'min7':    ['P1', 'm3', 'P5', 'm7'],
  'minmaj7': ['P1', 'm3', 'P5', 'M7'],
  'dom7':    ['P1', 'M3', 'P5', 'm7'],
  'maj7':    ['P1', 'M3', 'P5', 'M7'],
  'aug7':    ['P1', 'M3', 'A5', 'm7'],
  'augM7':   ['P1', 'M3', 'A5', 'M7'],

  // Altered chords (TODO)
  // Added tone chords (TODO)
  // Suspended chords (TODO)
  // Borrowed chords (TODO)

  // Sixth chords
  'maj6': ['P1', 'M3', 'P5', 'M6'],
  'min6': ['P1', 'm3', 'P5', 'M6'],

}

export const ALIAS = {
  '': 'major',
  'maj': 'major',
  'major triad': 'major',
  '6': 'maj6',
  'M6': 'maj6',
  '7': 'dom7',
  'M7': 'maj7',
  '+': 'aug',
  '+7': 'aug7',
  'm': 'min',
  'minor': 'min',
  'm6': 'min6',
  'm7': 'min7',
  'mM7': 'minmaj7',
  'o': 'dim',
  'o7': 'dim7',
  'ø7': 'ø',
}