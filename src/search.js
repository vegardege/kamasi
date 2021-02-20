import { INTERVAL_BITMASK, INTERVAL_BITMASK_ENHARMONIC } from '../data/intervals.js'
import { CHORDS } from '../data/chords.js'
import { SCALES } from '../data/scales.js'

/**
 * The search function works by creating and bitmasks for all scales and
 * chords, then comparing these with the bitmask of a note list.
 * 
 * The index is built lazily, to prevent overhead for users who
 * won't use the search function.
 */
const index = {
  'chords': {
    'exact': [],
    'enharmonic': [],
  },
  'scales': {
    'exact': [],
    'enharmonic': [],
  },
}

/**
 * Four search functions are currently supported:
 *  'exact': Only match if all intervals are similar
 *  'sub': Match if scale/chord is a subset of given intervals
 *  'sup': Match if scale/chord is a superset of given intervals
 *  'all': Match if scale/chord is a subset or a superset
 */
const searchFunctions = {
  'exact': (a, b) => a === b,
  'sub': (a, b) => (~a & b) === 0,
  'sup': (a, b) => (a & ~b) === 0,
}

/**
 * Lazily build index the first time it's requested
 */
function loadIndex(type, enharmonic) {
  const db = type === 'chords' ? CHORDS : SCALES
  const enharmonicType = enharmonic ? 'enharmonic' : 'exact'

  if (index[type][enharmonicType].length === 0) {
    for (const name in db) {
      index[type][enharmonicType].push({
        'name': name,
        'bitmask': bitmask(db[name], enharmonic),
      })
    }
  }
  return index[type][enharmonicType]
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
 * 
 * @param {string} type 'chords' or 'scales'
 * @param {array} intervals Array of intervals as strings
 * @param {string} filter Filter function ('exact', 'sub', 'sup', 'all')
 * @param {boolean} enharmonic If true, bitmask will be identical
 *                             for enharmonic intervals
 */
function searcher(type, intervals, filter, enharmonic) {

  const needle = bitmask(intervals, enharmonic),
        haystack = loadIndex(type, enharmonic),
        match = searchFunctions[filter]

  return haystack.filter(
    candidate => match(needle, candidate.bitmask)
  ).map(
    candidate => candidate.name
  ) || []
}

/**
 * Search for chords or scales containing a specified set of intervals.
 * Lazily finds values for a specified combination of scale/chord and
 * filter (exact, all, supersets, subsets).
 * 
 * @param {array} intervals Array of intervals as strings
 * @param {boolean} enharmonic If true, bitmask will be identical
 *                             for enharmonic intervals
 * @param {string} searchType If set, only returns search type
 *                            'exact', 'subsets', or 'supersets'
 * @param {string} patternType If set, only returns pattern type
 *                             'chord', 'scale', 'chords', or 'scales'
 */
export function search(intervals, enharmonic=true, searchType=undefined, patternType=undefined) {
  intervals = typeof intervals === 'string' ? intervals.split(' ') : intervals

  const result = {
    'exact': () => {
      return {
        'chord': () => searcher('chords', intervals, 'exact', enharmonic)[0],
        'scale': () => searcher('scales', intervals, 'exact', enharmonic)[0],
        'chords': () => searcher('chords', intervals, 'exact', enharmonic),
        'scales': () => searcher('scales', intervals, 'exact', enharmonic),
    }},
    'supersets': () => {
      return {
        'chord': () => searcher('chords', intervals, 'sup', enharmonic)[0],
        'scale': () => searcher('scales', intervals, 'sup', enharmonic)[0],
        'chords': () => searcher('chords', intervals, 'sup', enharmonic),
        'scales': () => searcher('scales', intervals, 'sup', enharmonic),
    }},
    'subsets': () => {
      return {
        'chord': () => searcher('chords', intervals, 'sup', enharmonic)[0],
        'scale': () => searcher('scales', intervals, 'sup', enharmonic)[0],
        'chords': () => searcher('chords', intervals, 'sub', enharmonic),
        'scales': () => searcher('scales', intervals, 'sub', enharmonic),
    }},
  }

  if (searchType && patternType) {
    return result[searchType]()[patternType]()
  } else if (searchType) {
    return result[searchType]()
  } else {
    return result
  }
}
