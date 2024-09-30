/**
 * @param {any} triggerId
 * @returns {boolean}
 */
export function isBasicTrigger(triggerId) {
  return typeof triggerId === "string" || typeof triggerId === "number";
}

/**
 * @param {any} triggerId
 * @returns {boolean}
 */
export function isTriggerPair(triggerId) {
  return Array.isArray(triggerId) && triggerId.length === 2;
}
