/**
 * This is a somewhat random collection of chords I've found on Wikipedia.
 * Feel free to add chords, but please add some kind of source and try to
 * group related chords in some way.
 * 
 * Please also use existing chords as bases if possible.
 * 
 * Ideally, I'd like to have a single source (database of chords), but I
 * haven't found any open source lists I can use. Let me know if you know
 * any freely available resources that can be used.
 * 
 * Chords are grouped according to the lists on:
 * 
 *    https://en.wikipedia.org/wiki/Chord_(music)
 *    https://en.wikipedia.org/wiki/Chord_letters
 */
const TRIADS = {
  'major':      ['P1', 'M3', 'P5'],
  'minor':      ['P1', 'm3', 'P5'],
  'augmented':  ['P1', 'M3', 'A5'],
  'diminished': ['P1', 'm3', 'd5'],
}

const SIXTH = {
  'major sixth': TRIADS['major'].concat('M6'),
  'minor sixth': TRIADS['minor'].concat('M6'),
}

const SEVENTH = {
  'dominant seventh':        TRIADS['major'].concat('m7'),
  'major seventh':           TRIADS['major'].concat('M7'),
  'minor seventh':           TRIADS['minor'].concat('m7'),
  'minor-major seventh':     TRIADS['minor'].concat('M7'),
  'diminished seventh':      TRIADS['diminished'].concat('d7'),
  'half-diminished seventh': TRIADS['diminished'].concat('m7'),
  'augmented seventh':       TRIADS['augmented'].concat('m7'),
  'augmented major seventh': TRIADS['augmented'].concat('M7'),
  'seventh flat five':       ['P1', 'M3', 'd5', 'm7'],
}

const NINTH = {
  'dominant minor ninth':        SEVENTH['dominant seventh'].concat('m9'),
  'dominant ninth':              SEVENTH['dominant seventh'].concat('M9'),
  'major ninth':                 SEVENTH['major seventh'].concat('M9'),
  'minor ninth':                 SEVENTH['minor seventh'].concat('M9'),
  'minor-major ninth':           SEVENTH['minor-major seventh'].concat('M9'),
  'diminished minor ninth':      SEVENTH['diminished seventh'].concat('m9'),
  'diminished ninth':            SEVENTH['diminished seventh'].concat('M9'),
  'half-diminished minor ninth': SEVENTH['half-diminished seventh'].concat('m9'),
  'half-diminished ninth':       SEVENTH['half-diminished seventh'].concat('M9'),
  'augmented dominant ninth':    SEVENTH['augmented seventh'].concat('M9'),
  'augmented major ninth':       SEVENTH['augmented major seventh'].concat('M9'),
}

const ELEVENTH = {
  'eleventh':                 NINTH['dominant ninth'].concat('P11'),
  'major eleventh':           NINTH['major ninth'].concat('P11'),
  'minor eleventh':           NINTH['minor ninth'].concat('P11'),
  'minor-major eleventh':     NINTH['minor-major ninth'].concat('P11'),
  'diminished eleventh':      NINTH['diminished ninth'].concat('P11'),
  'half-diminished eleventh': NINTH['half-diminished ninth'].concat('P11'),
  'augmented eleventh':       NINTH['augmented dominant ninth'].concat('P11'),
  'augmented major eleventh': NINTH['augmented major ninth'].concat('P11'),
}

const THIRTEENTH = {
  'dominant thirtheenth':       NINTH['dominant ninth'].concat('M13'),
  'thirteenth':                 ELEVENTH['eleventh'].concat('M13'),
  'major thirteenth':           ELEVENTH['major eleventh'].concat('M13'),
  'minor thirteenth':           ELEVENTH['minor eleventh'].concat('M13'),
  'minor-major thirteenth':     ELEVENTH['minor-major eleventh'].concat('M13'),
  'half-diminished thirteenth': ELEVENTH['half-diminished eleventh'].concat('M13'),
  'augmented thirteenth':       ELEVENTH['augmented eleventh'].concat('M13'),
  'augmented major thirteenth': ELEVENTH['augmented major eleventh'].concat('M13'),
}

const TONE = {
  'mixed-third': TRIADS['major'].concat('m3'),
  'add fourth':  TRIADS['major'].concat('P4'),
  'add nine':    TRIADS['major'].concat('M9'),
  'seven-six':   SIXTH['major sixth'].concat('m7'),
  'six-nine':    SIXTH['major sixth'].concat('M9'),
}

const SUSPENDED = {
  'suspended second': ['P1', 'M2', 'P5'],
  'suspended fourth': ['P1', 'P4', 'P5'],
  'suspended jazz':   ['P1', 'P5', 'm7', 'M9'],
}

export const CHORDS = Object.assign({},
  TRIADS,
  SIXTH,
  SEVENTH,
  NINTH,
  ELEVENTH,
  THIRTEENTH,
  TONE,
  SUSPENDED,
)

export const CHORD_ALIAS = {
  // Triads
  '': 'major',
  'M': 'major',
  'maj': 'major',

  '-': 'minor',
  'm': 'minor',
  'min': 'minor',

  '+': 'augmented',
  'aug': 'augmented',

  'o': 'diminished',
  'dim': 'diminished',

  // Sixth
  '6': 'major sixth',
  'M6': 'major sixth',
  'maj6': 'major sixth',
  'add sixth': 'major sixth',

  'm6': 'minor sixth',
  'min6': 'minor sixth',

  // Seventh
  '7': 'dominant seventh',
  'dom7': 'dominant seventh',

  'M7': 'major seventh',
  'maj7': 'major seventh',

  'm7': 'minor seventh',
  'min7': 'minor seventh',

  'mM7': 'minor-major seventh',
  'minmaj7': 'minor-major seventh',

  'o7': 'diminished seventh',
  'dim7': 'diminished seventh',

  'ø': 'half-diminished seventh',
  'ø7': 'half-diminished seventh',

  '+7': 'augmented seventh',
  'aug7': 'augmented seventh',

  '+M7': 'augmented major seventh',
  'augM7': 'augmented major seventh',

  '7b5': 'seventh flat five',
  '7dim5': 'seventh flat five',

  // Ninth
  '7b9': 'dominant minor ninth',

  '9': 'dominant ninth',

  'M9': 'major ninth',
  'maj9': 'major ninth',

  'm9': 'minor ninth',
  'min9': 'minor ninth',

  'mM9': 'minor-major ninth',
  'minmaj9': 'minor-major ninth',

  'ob9': 'diminished minor ninth',
  'dimb9': 'diminished minor ninth',

  'o9': 'diminished ninth',
  'dim9': 'diminished ninth',

  'ø9': 'half-diminished ninth',
  'øb9': 'half-diminished minor ninth',

  '+9': 'augmented dominant ninth',
  'aug9': 'augmented dominant ninth',

  '+M9': 'augmented major ninth',
  'augmaj9': 'augmented major ninth',

  // Eleventh
  '11': 'eleventh',
  
  'M11': 'major eleventh',
  'maj11': 'major eleventh',

  'm11': 'minor eleventh',
  'min11': 'minor eleventh',

  'mM11': 'minor-major eleventh',
  'minmaj11': 'minor-major eleventh',
  
  'o11': 'diminished eleventh',
  'dim11': 'diminished eleventh',

  'ø11': 'half-diminished eleventh',
  
  '+11': 'augmented eleventh',
  'aug11': 'augmented eleventh',

  '+M11': 'augmented major eleventh',
  'augmaj11': 'augmented major eleventh',

  // Thirteenth
  '13': 'thirteenth',

  'M13': 'major thirteenth',
  'maj13': 'major thirteenth',

  'mM13': 'minor-major thirteenth',
  'minmaj13': 'minor-major thirteenth',

  'm13': 'minor thirteenth',
  'min13': 'minor thirteenth',

  'ø13': 'half-diminished thirteenth',

  '+13': 'augmented thirteenth',
  'aug13': 'augmented thirteenth',

  '+M13': 'augmented major thirteenth',
  'augmaj13': 'augmented major thirteenth',

  // Added tone
  '2': 'add nine',
  'add9': 'add nine',

  '4': 'add fourth',
  'add11': 'add fourth',

  '6/9': 'six-nine',

  '7/6': 'seven-six',

  // Suspended
  'sus2': 'suspended second',

  'sus': 'suspended fourth',
  'sus4': 'suspended fourth',
  
  '9sus4': 'suspended jazz',
}
