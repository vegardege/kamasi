import { CHORDS } from "#data/chords.js";
import {
  INTERVAL_BITMASK,
  INTERVAL_BITMASK_ENHARMONIC,
  type IntervalNotation,
} from "#data/intervals.js";
import { SCALES } from "#data/scales.js";

type IndexEntry = {
  name: string;
  bitmask: number;
};

type IndexType = "chords" | "scales";
type EnharmonicType = "exact" | "enharmonic";
type SearchFilter = "exact" | "sub" | "sup";

/**
 * Lazy-loaded search index for scales and chords.
 *
 * The search function works by creating bitmasks for all scales and
 * chords, then comparing these with the bitmask of a note list.
 *
 * The index is built lazily to prevent overhead for users who
 * don't use the search function.
 */
const index: Record<IndexType, Record<EnharmonicType, IndexEntry[]>> = {
  chords: {
    exact: [],
    enharmonic: [],
  },
  scales: {
    exact: [],
    enharmonic: [],
  },
};

/**
 * Four search functions are currently supported:
 *  'exact': Only match if all intervals are similar
 *  'sub': Match if scale/chord is a subset of given intervals
 *  'sup': Match if scale/chord is a superset of given intervals
 *  'all': Match if scale/chord is a subset or a superset
 */
const searchFunctions: Record<SearchFilter, (a: number, b: number) => boolean> =
  {
    exact: (a, b) => a === b,
    sub: (a, b) => (~a & b) === 0,
    sup: (a, b) => (a & ~b) === 0,
  };

/**
 * Lazily build index the first time it's requested
 */
function loadIndex(type: IndexType, enharmonic: boolean): IndexEntry[] {
  const db = type === "chords" ? CHORDS : SCALES;
  const enharmonicType: EnharmonicType = enharmonic ? "enharmonic" : "exact";

  if (index[type][enharmonicType].length === 0) {
    for (const name in db) {
      index[type][enharmonicType].push({
        name: name,
        bitmask: bitmask(db[name]!, enharmonic),
      });
    }
  }
  return index[type][enharmonicType];
}

/**
 * Calculate the binary bitmask of a lists of intervals
 *
 * @param intervals List of intervals
 * @param enharmonic If true, bitmask will be identical for enharmonic intervals
 */
function bitmask(
  intervals: readonly IntervalNotation[],
  enharmonic: boolean = true,
): number {
  const mask = enharmonic ? INTERVAL_BITMASK_ENHARMONIC : INTERVAL_BITMASK;
  return intervals.reduce((bitmask, cur) => bitmask | (mask[cur] ?? 0), 0);
}

/**
 *
 * @param type 'chords' or 'scales'
 * @param intervals Array of intervals as strings
 * @param filter Filter function ('exact', 'sub', 'sup', 'all')
 * @param enharmonic If true, bitmask will be identical for enharmonic intervals
 */
function searcher(
  type: IndexType,
  intervals: readonly IntervalNotation[],
  filter: SearchFilter,
  enharmonic: boolean,
): string[] {
  const needle = bitmask(intervals, enharmonic);
  const haystack = loadIndex(type, enharmonic);
  const match = searchFunctions[filter];

  return (
    haystack
      .filter((candidate) => match(needle, candidate.bitmask))
      .map((candidate) => candidate.name) || []
  );
}

/**
 * Result object with filter methods for searching scales and chords.
 * Use exact(), supersets(), or subsets() to specify the search type.
 */
export type SearchResult = {
  exact: () => PatternResult;
  supersets: () => PatternResult;
  subsets: () => PatternResult;
};

/**
 * Result object with methods to retrieve matching chords or scales.
 * Use singular methods to get first match, plural to get all matches.
 */
export type PatternResult = {
  chord: () => string | undefined;
  scale: () => string | undefined;
  chords: () => string[];
  scales: () => string[];
};

/**
 * Search for chords or scales containing a specified set of intervals.
 * Uses a chaining API for type-safe, discoverable searches.
 *
 * @param intervals Array of intervals as strings or space-separated string
 * @param enharmonic If true, bitmask will be identical for enharmonic intervals
 *
 * @example
 * search('P1 M3 P5').exact().chord()      // 'major'
 * search('P1 M3 P5').exact().chords()     // ['major']
 * search('P1 M3').supersets().scales()    // All scales containing P1 and M3
 */
export function search(
  intervals: readonly IntervalNotation[] | string,
  enharmonic = true,
): SearchResult {
  const intervalArray =
    typeof intervals === "string"
      ? (intervals.split(" ") as IntervalNotation[])
      : intervals;

  return {
    exact: () => ({
      chord: () => searcher("chords", intervalArray, "exact", enharmonic)[0],
      scale: () => searcher("scales", intervalArray, "exact", enharmonic)[0],
      chords: () => searcher("chords", intervalArray, "exact", enharmonic),
      scales: () => searcher("scales", intervalArray, "exact", enharmonic),
    }),
    supersets: () => ({
      chord: () => searcher("chords", intervalArray, "sup", enharmonic)[0],
      scale: () => searcher("scales", intervalArray, "sup", enharmonic)[0],
      chords: () => searcher("chords", intervalArray, "sup", enharmonic),
      scales: () => searcher("scales", intervalArray, "sup", enharmonic),
    }),
    subsets: () => ({
      chord: () => searcher("chords", intervalArray, "sub", enharmonic)[0],
      scale: () => searcher("scales", intervalArray, "sub", enharmonic)[0],
      chords: () => searcher("chords", intervalArray, "sub", enharmonic),
      scales: () => searcher("scales", intervalArray, "sub", enharmonic),
    }),
  };
}
