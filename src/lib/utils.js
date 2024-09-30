/**
 * Function to normalize a value between an upper and a lower bound.
 *
 * @param {number} lower lower bound
 * @param {number} upper upper bound
 * @param {number} v value to normalize
 * @returns {number}
 */
export function normalize(lower, upper, v) {
  return (v - lower) / (upper - lower);
}

/**
 * Clamp a value between a lower and an upper bound.
 *
 * @param {number} min lower bound
 * @param {number} max upper bound
 * @param {number} v value to clamp
 * @returns
 */
export function clamp(min, max, v) {
  return v < min ? min : v > max ? max : v;
}
