/**
 * This is a somewhat random collection of scales I've found on Wikipedia.
 * Feel free to add scales, but please add some kind of source and try to
 * group related scales in some way.
 * 
 * Ideally, I'd like to have a single source (database of scales), but I
 * haven't found any open source lists I can use. Let me know if you know
 * any freely available resources.
 * 
 * Sources:
 *   https://en.wikipedia.org/wiki/Major_scale
 *   https://en.wikipedia.org/wiki/Minor_scale
 *   https://en.wikipedia.org/wiki/Bebop_scale
 *   https://en.wikipedia.org/wiki/Jazz_scale
 *   https://en.wikipedia.org/wiki/Pentatonic_scale
 *   https://en.wikipedia.org/wiki/Blues_scale
 *   https://en.wikipedia.org/wiki/Synthetic_scale
 *   https://en.wikipedia.org/wiki/Octatonic_scale
 *   https://en.wikipedia.org/wiki/Double_harmonic_scale
 *   https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
 *   https://en.wikipedia.org/wiki/Phrygian_dominant_scale
 *   https://en.wikipedia.org/wiki/Hungarian_major_scale
 *   https://en.wikipedia.org/wiki/Japanese_musical_scales
 *   https://en.wikipedia.org/wiki/Neapolitan_scale
 *   https://en.wikipedia.org/wiki/Persian_scale
 *   https://en.wikipedia.org/wiki/Romanian_major
 */
export const SCALES = {

  // Main scales
  'major':          ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  'minor':          ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  'major harmonic': ['P1', 'M2', 'M3', 'P4', 'P5', 'm6', 'M7'],
  'major melodic':  ['P1', 'M2', 'M3', 'P4', 'P5', 'm6', 'm7'],
  'minor harmonic': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
  'minor melodic':  ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
  'chromatic':      ['P1', 'm2', 'M2', 'm3', 'M3', 'P4',
                     'A4', 'P5', 'm6', 'M6', 'm7', 'M7'],

  // Penatonic scales
  'pentatonic major':    ['P1', 'M2', 'M3', 'P5', 'M6'],
  'pentatonic minor':    ['P1', 'm3', 'P4', 'P5', 'm7'],
  'pentatonic egyptian': ['P1', 'M2', 'P4', 'P5', 'm7'],
  'pentatonic japanese': ['P1', 'm2', 'P4', 'P5', 'm6'],
  'hirajoshi':           ['P1', 'M2', 'm3', 'P5', 'm6'],
  'insen':               ['P1', 'm2', 'P4', 'P5', 'm7'],
  'iwato':               ['P1', 'm2', 'P4', 'd5', 'm7'],

  // Jazz (modes of major scale)
  'ionian':     ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  'dorian':     ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
  'phygrian':   ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  'lydian':     ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
  'mixolydian': ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
  'aeolian':    ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
  'locrian':    ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],

  // Jazz (modes of melodic minor scale)
  'dorian b2':        ['P1', 'm2', 'm3', 'P4', 'P5', 'M6', 'm7'],
  'lydian augmented': ['P1', 'M2', 'M3', 'A4', 'A5', 'M6', 'M7'],
  'lydian dominant':  ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'm7'],
  'half-diminished':  ['P1', 'M2', 'm3', 'P4', 'd5', 'm6', 'm7'],
  'altered':          ['P1', 'm2', 'm3', 'd4', 'd5', 'm6', 'm7'],

  // Blues scales
  'blues major':      ['P1', 'M2', 'P4', 'P5', 'M6'],
  'blues minor':      ['P1', 'm3', 'P4', 'm6', 'm7'],
  'blues hexatonic':  ['P1', 'm3', 'P4', 'd5', 'P5', 'm7'],
  'blues heptatonic': ['P1', 'M2', 'm3', 'P4', 'd5', 'M6', 'm7'],
  'blues nonaonic':   ['P1', 'M2', 'm3', 'M3', 'P4', 'P5', 'M6', 'm7', 'M7'],

  // Bebop scales
  'bebop':                ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7', 'M7'],
  'bebop minor':          ['P1', 'M2', 'm3', 'M3', 'P4', 'P5', 'M6', 'm7'],
  'bebop major':          ['P1', 'M2', 'M3', 'P4', 'P5', 'A5', 'M6', 'M7'],
  'bebop melodic minor':  ['P1', 'M2', 'm3', 'P4', 'P5', 'A5', 'M6', 'M7'],
  'bebop harmonic minor': ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7', 'M7'],

  // Hungarian scales
  'major hungarian':       ['P1', 'A2', 'M3', 'A4', 'P5', 'M6', 'm7'],
  'ultralocrian bb6':      ['P1', 'A2', 'M3', 'A4', 'P5', 'M6', 'm7'],
  'minor harmonic b5':     ['P1', 'M2', 'm3', 'P4', 'd5', 'm6', 'M7'],
  'superlocrian 6':        ['P1', 'm2', 'm3', 'd4', 'd5', 'M6', 'm7'],
  'minor jazz #5':         ['P1', 'M2', 'm3', 'P4', 'A5', 'M6', 'M7'],
  'dorian b2 #4':          ['P1', 'm2', 'm3', 'A4', 'P5', 'M6', 'm7'],
  'nohkan flute':          ['P1', 'M2', 'A3', 'A4', 'A5', 'M6', 'M7'],
  'minor hungarian':       ['P1', 'M2', 'm3', 'A4', 'P5', 'm6', 'M7'],

  // Neapolitan scales
  'minor neapolitan':     ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'M7'],
  'lydian #6':            ['P1', 'M2', 'M3', 'A4', 'P5', 'A6', 'M7'],
  'mixolydian augmented': ['P1', 'M2', 'M3', 'P4', 'A5', 'M6', 'm7'],
  'romani minor':         ['P1', 'M2', 'm3', 'A4', 'P5', 'm6', 'm7'],
  'locrian dominant':     ['P1', 'm2', 'M3', 'P4', 'd5', 'm6', 'm7'],
  'ionian #2':            ['P1', 'A2', 'M3', 'P4', 'P5', 'M6', 'M7'],
  'ultralocrian bb3':     ['P1', 'm2', 'd3', 'd4', 'd5', 'm6', 'd7'],

  'major neapolitan':          ['P1', 'm2', 'm3', 'P4', 'P5', 'M6', 'M7'],
  'leading whole tone':        ['P1', 'M2', 'M3', 'A4', 'A5', 'A6', 'M7'],
  'lydian augmented dominant': ['P1', 'M2', 'M3', 'A4', 'A5', 'M6', 'm7'],
  'lydian dominant b6':        ['P1', 'M2', 'M3', 'A4', 'P5', 'm6', 'm7'],
  'major locrian':             ['P1', 'M2', 'M3', 'P4', 'd5', 'm6','m7'],
  'half-diminshed b4':         ['P1', 'M2', 'm3', 'd4', 'd5', 'm6', 'm7'],
  'superlocrian bb3':          ['P1', 'm2', 'd3', 'd4', 'd5', 'm6', 'm7'],

  // Persian scales
  'persian':                         ['P1', 'm2', 'M3', 'P4', 'd5', 'm6', 'M7'],
  'ionian #2 #6':                    ['P1', 'A2', 'M3', 'P4', 'P5', 'A6', 'M7'],
  'ultraphrygian bb3':               ['P1', 'm2', 'd3', 'd4', 'P5', 'm6', 'd7'],
  'todi that':                       ['P1', 'm2', 'm3', 'A4', 'P5', 'm6', 'M7'],
  'lydian #3 #6':                    ['P1', 'M2', 'A3', 'A4', 'P5', 'A6', 'M7'],
  'mixolydian augmented #2':         ['P1', 'A2', 'M3', 'P4', 'A5', 'M6', 'm7'],
  'chromatic hypophrygian inverses': ['P1', 'm2', 'd3', 'P4', 'd5', 'd6', 'd7'],

  // Romanian scales
  'major romanian':           ['P1', 'm2', 'M3', 'A4', 'P5', 'M6', 'm7'],
  'super lydian augmented 6': ['P1', 'A2', 'A3', 'A4', 'A5', 'M6', 'M7'],
  'locrian 2 bb7':            ['P1', 'M2', 'm3', 'P4', 'd5', 'm6', 'd7'],
  'superlocrian bb6':         ['P1', 'm2', 'm3', 'd4', 'd5', 'd6', 'm7'],
  'minor jazz b5':            ['P1', 'M2', 'm3', 'P4', 'd5', 'M6', 'M7'],
  'javanese b4':              ['P1', 'm2', 'm3', 'd4', 'P5', 'M6', 'm7'],
  'lydian augmented b3':      ['P1', 'M2', 'm3', 'A4', 'A5', 'M6', 'M7'],
  'minor romanian':           ['P1', 'M2', 'm3', 'd5', 'P5', 'M6', 'm7'],

  // Double harmonic modes
  'major double harmonic': ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'M7'],
  'lydian #2 #6':          ['P1', 'A2', 'M3', 'A4', 'P5', 'A6', 'M7'],
  'ultraphrygian':         ['P1', 'm2', 'm3', 'd4', 'P5', 'm6', 'd7'],
  'oriental':              ['P1', 'm2', 'M3', 'P4', 'd5', 'M6', 'm7'],
  'ionian #2 #5':          ['P1', 'A2', 'M3', 'P4', 'A5', 'M6', 'M7'],
  'locrian bb3 bb7':       ['P1', 'm2', 'd3', 'P4', 'd5', 'm6', 'd7'],

  // Misc
  'augmented':         ['P1', 'm3', 'M3', 'P5', 'A5', 'M7'],
  'diminished':        ['P1', 'M2', 'm3', 'P4', 'd5', 'm6', 'M6', 'M7'],
  'dorian ukrainian':  ['P1', 'M2', 'm3', 'A4', 'P5', 'M6', 'm7'],
  'phrygian dominant': ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'm7'],
  'enigmatic':         ['P1', 'm2', 'M3', 'A4', 'A5', 'A6', 'M7'],
  'prometheus':        ['P1', 'M2', 'M3', 'A4', 'M6', 'm7'],
}

export const SCALE_ALIAS = {
  '': 'major',
  'maj': 'major',
  'major natural': 'major',

  'm': 'minor',
  'min': 'minor',
  'minor natural': 'minor',

  'mixolydian b6': 'major melodic',
  'hindu': 'major melodic',
  'myxeolian': 'major melodic',

  'ryo': 'pentatonic major',
  'pentatonic suspended': 'pentatonic egyptian',
  'in': 'pentatonic japanese',
  'sakura': 'pentatonic japanese',

  'man gong': 'blues minor',
  'ritsusen': 'blues major',
  'ritsu': 'blues major',

  'mayamalavagowla': 'major double harmonic',
  'bhairav raga': 'major double harmonic',
  'byzantine': 'major double harmonic',
  'arabic': 'major double harmonic',
  'flamenco': 'major double harmonic',
  'major gypsy': 'major double harmonic',

  'phygrian #6': 'dorian b2',
  'lydian #5': 'lydian augmented',
  'acoustic': 'lydian dominant',
  'lydian b5': 'lydian dominant',
  'mixolydian #4': 'lydian dominant',
  'overtone': 'lydian dominant',
  'lydomyxian': 'lydian dominant',
  'aeolocrian': 'half-diminished',
  'locrian 2': 'half-diminished',
  'super locrian': 'altered',

  'bebop dorian': 'bebop minor',

  'minor gypsy': 'minor hungarian',
  'romanian minor': 'dorian ukrainian',
  'altered dorian': 'dorian ukrainian',
  'misheberak': 'dorian ukrainian',
  'altered phrygian': 'phrygian dominant',
  'freygish': 'phrygian dominant',
}