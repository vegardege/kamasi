import { INTERVAL_BITMASK, INTERVAL_BITMASK_ENHARMONIC } from '../data/intervals.js'
import { CHORDS } from '../data/chords.js'
import { SCALES } from '../data/scales.js'

/**
 * The search function works by creating and bitmasks for all scales and
 * chords, then comparing these with the bitmask of a note list.
 * 
 * The index is built on first search, to prevent overhead for users who
 * won't use the search function.
 * 
 * At the moment, this functionality is only exposed publically through
 * NoteList.search(), NoteList.subsets(), ad NoteList.supersets().
 */
const index = []

/**
 * Initialize the index
 */
function buildIndex() {
  for (const name in CHORDS) {
    add(name, CHORDS[name], 'chords')
  }
  for (const name in SCALES) {
    add(name, SCALES[name], 'scales')
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
 * Search for scales or chords matching a list of intervals
 * 
 * @param {list} intervals List of interval string representations
 * @param {string} type 'exact': Only find exact matches
 *                      'sub': Find subsets of intervals
 *                      'sup': Find supersets of intervals
 * @param {boolean} enharmonic If true, search won't differentiate
 *                             between enharmonic intervals
 */
export function search(intervals, type='exact', enharmonic=true) {

  if (index.length === 0) {
    buildIndex()
  }

  const result = {'scales': {}, 'chords': {}}

  if (intervals.some(i => INTERVAL_BITMASK[i] === undefined)) {
    return result // Search term has intervals not in the index
  }

  const field = enharmonic ? 'bitmaskEnharmonic' : 'bitmask',
        search = searchTypes[type],
        needle = bitmask(intervals, enharmonic)

  for (const candidate of index) {
    if (search.compare(needle, candidate[field])) {
      result[candidate['type']][candidate['name']] = search.match(intervals, candidate)
    }
  }
  return {
    'scales': new ResultSet(result['scales']),
    'chords': new ResultSet(result['chords']),
  }
}

/**
 * Compare functions and match level for the three search types.
 * 'compare' is a binary operation specifying whether two bitmasks match.
 * 'match' is a function determining how well the two match from 0–1.
 */
const searchTypes = {
  'exact': {
    'compare': (a, b) => a === b,
    'match': () => 1.0,
  },
  'sub': {
    'compare': (a, b) => (~a & b) === 0,
    'match': (a, b) => b.length / a.length,
  },
  'sup': {
    'compare': (a, b) => (a & ~b) === 0,
    'match': (a, b) => a.length / b.length,
  }
}

/**
 * A ResultSet is a list of scales and chords that matches the search
 * intervals.
 */
class ResultSet {
  constructor(results) {
    this.results = results
  }

  /**
   * Returns the first value matching at all (>0)
   */
  any() {
    return Object.keys(this.results)[0]
  }

  /**
   * Returns a list of all matching names
   */
  all() {
    return Object.keys(this.results)
  }

  /**
   * Returns the name of the best match (or undefined if none found)
   */
  best() {
    let argmax = undefined,
        max = 0

    Object.keys(this.results).forEach(name => {
      if (this.results[name] > max) {
        argmax = name
        max = this.results[name]
      }
    })
    return argmax
  }

  /**
   * Returns the name of an exact match (or undefined if none found)
   */
  exact() {
    for (let name of Object.keys(this.results)) {
      if (this.results[name] >= 1) {
        return name
      }
    }
  }

  /**
   * Returns true if scale/chord is in the resultset (>0)
   * 
   * @param {string} name Name of scale/chord
   */
  includes(name) {
    return name in this.results
  }

  /**
   * Returns true if scale/chord is a perfect match
   * 
   * @param {string} name Name of scale/chord
   */
  includesExact(name) {
    return this.results[name] >= 1
  }
}
