import { INTERVAL_BITMASK, INTERVAL_BITMASK_ENHARMONIC } from '../data/intervals.js'
import { CHORDS } from '../data/chords.js'
import { SCALES } from '../data/scales.js'

// Compare functions and match level for the three search types
const searchTypes = {
  'exact': {
    'compare': (a, b) => a === b,
    'match': () => 1,
  },
  'sub': {
    'compare': (a, b) => (~a & b) === 0,
    'match': (a, b) => b['length'] / a['length'],
  },
  'sup': {
    'compare': (a, b) => (a & ~b) === 0,
    'match': (a, b) => a['length'] / b['length']
  }
}

// The index is initialized on first search, and contains
// pre-calculated bitmasks for all chords and scales.
const index = []

/**
 * Initialize the index
 */
function buildIndex() {
  for (const name in CHORDS) {
    add(name, CHORDS[name], 'chord')
  }
  for (const name in SCALES) {
    add(name, SCALES[name], 'scale')
  }
}

/**
 * Add a potential match to the index
 * 
 * @param {string} name Name of match
 * @param {list} intervals List of interval strings
 * @param {string} type 'scale' or 'chord'
 */
function add(name, intervals, type) {
  index.push({
    'name': name,
    'type': type,
    'bitmask': bitmask(intervals, false),
    'bitmaskEnharmonic': bitmask(intervals, true),
    'length': intervals.length,
  })
}

/**
 * Calculate the binary bitmask of a lists of intervals
 * 
 * @param {list} intervals List of intervals
 * @param {boolean} enharmonic If true, bitmask will be identical
 *                             for enharmonic intervals
 */
function bitmask(intervals, enharmonic=true) {
  const mask = enharmonic ? INTERVAL_BITMASK_ENHARMONIC : INTERVAL_BITMASK
  return intervals.reduce(
    (bitmask, cur) => bitmask | mask[cur], 0)
}

/**
 * Searches for scales or chords matching a list of intervals
 * 
 * @param {list} intervals List of interval string representations
 * @param {string} type 'exact': Only find exact matches
   *                    'sub': Find subsets of intervals
   *                    'sup': Find supersets of intervals
 * @param {boolean} enharmonic If true, search won't differentiate
   *                           between enharmonic intervals
 */
export function search(intervals, type='exact', enharmonic=true) {

  if (index.length === 0) {
    buildIndex() // Build index the first time `search` is called
  }

  if (intervals.some(i => INTERVAL_BITMASK[i] === undefined)) {
    return [] // Search term has intervals not in the index
  }

  const result = [],
        field = enharmonic ? 'bitmaskEnharmonic' : 'bitmask',
        search = searchTypes[type],
        needle = bitmask(intervals, enharmonic)

  for (const x of index) {
    if (search.compare(needle, x[field])) {
      result.push({
        'name': x['name'],
        'type': x['type'],
        'match': search.match(intervals, x),
      })
    }
  }
  return result.sort((a, b) => b.match - a.match)
}
