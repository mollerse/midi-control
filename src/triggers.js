export function isBasicTrigger(triggerId) {
  return typeof triggerId === "string" || typeof triggerId === "number";
}

export function isTriggerPair(triggerId) {
  return Array.isArray(triggerId) && triggerId.length === 2;
}
