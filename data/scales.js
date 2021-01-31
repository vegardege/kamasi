export const SCALES = {

  // Main scales
  'major':          ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  'minor natural':  ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  'minor harmonic': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
  'minor melodic':  ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
  'chromatic':      ['P1', 'm2', 'M2', 'm3', 'M3', 'P4',
                     'A4', 'P5', 'm6', 'M6', 'm7', 'M7'],

  // Penatonic scales
  'pentatonic major':    ['P1', 'M2', 'M3', 'P5', 'M6'],
  'pentatonic minor':    ['P1', 'm3', 'P4', 'P5', 'm7'],
  'pentatonic egyptian': ['P1', 'M2', 'P4', 'P5', 'm7'],
  'pentatonic japanese': ['P1', 'm2', 'P4', 'P5', 'm6'],

  // Diatonic scales / modes
  'ionian':     ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  'dorian':     ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
  'phygrian':   ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  'lydian':     ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
  'mixolydian': ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
  'aeolian':    ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  'locrian':    ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],

  // Blues scales
  'blues major':      ['P1', 'M2', 'P4', 'P5', 'M6'],
  'blues minor':      ['P1', 'm3', 'P4', 'm6', 'm7'],
  'blues hexatonic':  ['P1', 'm3', 'P4', 'd5', 'P5', 'm7'],
  'blues heptatonic': ['P1', 'M2', 'm3', 'P4', 'd5', 'M6', 'm7'],
  'blues nonaonic':   ['P1', 'M2', 'm3', 'M3', 'P4', 'P5', 'M6', 'm7', 'M7'],

  // Bebop scales
  'bebop':                ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7', 'M7'],
  'bebop dorian':         ['P1', 'M2', 'm3', 'M3', 'P4', 'P5', 'M6', 'm7'],
  'bebop major':          ['P1', 'M2', 'M3', 'P4', 'P5', 'A5', 'M6', 'M7'],
  'bebop melodic minor':  ['P1', 'M2', 'm3', 'P4', 'P5', 'A5', 'M6', 'M7'],
  'bebop harmonic minor': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7', 'M7'],

  // Misc
  'acoustic':        ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'm7'],
  'augmented':       ['P1', 'm3', 'M3', 'P5', 'A5', 'M7'],
  'harmonic double': ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'M7'],
  'enigmatic':       ['P1', 'm2', 'M3', 'A4', 'A5', 'A6', 'M7'],
}

export const ALIAS = {
  '': 'major',
  'maj': 'major',
  'ionian': 'major',
  'm': 'minor',
  'min': 'minor',
  'minor natural': 'minor',
  'aeolian': 'minor',
  'pentatonic suspended': 'pentatonic egyptian',
  'mayamalavagowla': 'harmonic double',
  'bhairav raga': 'harmonic double',
  'byzantine': 'harmonic double',
  'arabic': 'harmonic double',
  'flamenco': 'harmonic double',
  'gypsy major': 'harmonic double',
}