/**
 * Several `kamasi` functions accept either an object or a short hand notation
 * string form, e.g. `new Note('C', '#', 4)` or `'C#4'`.
 * 
 * This function converts the string representation to `cls` if necessary.
 * 
 * @param {(class|string)} object Input argument
 * @param {class} cls Target class (with static `.fromString(str)` function)
 */
export function ensureType(object, cls) {
  if (typeof object === "string") {
    return cls.fromString(object)
  }
  return object
}

/**
 * Calculates modulo with offset.
 * 
 * Normal mod has the range [0, dividend - 1]. The offset shifts this to
 * [offset, offset + dividend - 1]. This is useful when mapping a number to
 * a list that is not 0-indexed, as the case is with intervals.
 * 
 * @see {@link https://en.wikipedia.org/wiki/Modulo_operation#Modulo_with_offset}
 */
export function mod(dividend, divisor, offset=0) {
  return dividend - divisor * Math.floor((dividend - offset) / divisor)
}
