export const SCALES = {

  // Main scales
  'major': ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  'minor': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  'chromatic': ['P1', 'm2', 'M2', 'm3', 'M3', 'P4',
                'A4', 'P5', 'm6', 'M6', 'm7', 'M7'],

  // Penatonic scales
  'pentatonic major':    ['P1', 'M2', 'M3', 'P5', 'M6'],
  'pentatonic minor':    ['P1', 'm3', 'P4', 'P5', 'm7'],
  'pentatonic egyptian': ['P1', 'M2', 'P4', 'P5', 'm7'],
  'pentatonic japanese': ['P1', 'm2', 'P4', 'P5', 'm6'],

  // Blues scales
  'blues major': ['P1', 'M2', 'P4', 'P5', 'M6'],
  'blues minor': ['P1', 'm3', 'P4', 'm6', 'm7'],

  // Bebop scales
  'bebop':                ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7', 'M7'],
  'bebop dorian':         ['P1', 'M2', 'm3', 'M3', 'P4', 'P5', 'M6', 'm7'],
  'bebop major':          ['P1', 'M2', 'M3', 'P4', 'P5', 'A5', 'M6', 'M7'],
  'bebop melodic minor':  ['P1', 'M2', 'm3', 'P4', 'P5', 'A5', 'M6', 'M7'],
  'bebop harmonic minor': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7', 'M7'],
}

export const ALIAS = {
  '': 'major',
  'maj': 'major',
  'm': 'minor',
  'min': 'minor',
  'pentatonic suspended': 'pentatonic egyptian',
}