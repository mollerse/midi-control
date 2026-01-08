/**
 * @import {KeyId} from '../../../types/internal-types.js'
 */

/**
 * @param {KeyId} keyId
 * @returns {boolean}
 */
export function isBasicTrigger(keyId) {
  return typeof keyId === "string" || typeof keyId === "number";
}

/**
 * @param {KeyId} keyId
 * @returns {boolean}
 */
export function isTriggerPair(keyId) {
  return Array.isArray(keyId) && keyId.length === 2;
}
