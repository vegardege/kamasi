/**
 * Several functions accepts either an object of a given class, or the input
 * to that classes constructor, e.g. `new Note('C4')` or `'C4'`.
 * 
 * This function returns a valid `cls` instance or throws an error.
 * 
 * @param {*} object Input argument
 * @param {class} cls Target class
 */
export function ensure_type(object, cls) {
  if (object instanceof cls) {
    return object
  }
  return new cls(object)
}

/**
 * Calculates modulo (remainder of a division) with an optional offset.
 * 
 * Normal mod maps dividend to [0, divisor-1]. The offset shifts this to
 * [offset, offset+divisor-1]. This is, for instance, useful when mapping
 * a number to a list that is not 0-indexed, as the case is with intervals.
 */
export function mod(divisor, dividend, offset=0) {
  return divisor - dividend * Math.floor((divisor - offset) / dividend)
}
