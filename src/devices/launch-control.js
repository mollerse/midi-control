const USER = "user";
const FACTORY = "factory";

/**
 * @type {{user: typeof USER, factory: typeof FACTORY}}
 */
export const TEMPLATES = {
  user: USER,
  factory: FACTORY,
};

/** @type {Record.<string, number>} */
export const PADS = {
  1: 0x09,
  2: 0x0a,
  3: 0x0b,
  4: 0x0c,
  5: 0x19,
  6: 0x1a,
  7: 0x1b,
  8: 0x1c,
};

/**
 * @type {Record.<string, number>}
 *
 * Buttons only has a single red LED.
 */
export const BUTTONS = {
  up: 0x72,
  down: 0x73,
  left: 0x74,
  right: 0x75,
};

/** @type {Record.<string, number>} */
export const KNOBS = {
  1: 0x15,
  2: 0x16,
  3: 0x17,
  4: 0x18,
  5: 0x19,
  6: 0x1a,
  7: 0x1b,
  8: 0x1c,
  9: 0x29,
  10: 0x2a,
  11: 0x2b,
  12: 0x2c,
  13: 0x2d,
  14: 0x2e,
  15: 0x2f,
  16: 0x30,
};

/** @type {Record.<typeof USER | typeof FACTORY, Record.<string, number>>} */
export const MESSAGES = {
  [USER]: {
    knob: 0xb0,
    padOn: 0x90,
    padOff: 0x80,
    button: 0xb0,
  },
  [FACTORY]: {
    knob: 0xb8,
    padOn: 0x98,
    padOff: 0x88,
    button: 0xb8,
  },
};

/** @type {Record.<string, number>} */
export const VALUES = {
  knobHigh: 0x7f,
  knobLow: 0x00,
  buttonDown: 0x7f,
  buttonUp: 0x00,
  padDown: 0x7f,
  padUp: 0x00,
};

/** @type {Record.<string, number>} */
export const LIGHTS = {
  off: 0x0c,
  redLow: 0x0d,
  redFull: 0x0f,
  amberLow: 0x1d,
  amberFull: 0x3f,
  yellow: 0x3e,
  greenLow: 0x1c,
  greenFull: 0x3c,
};

/** @type {Record.<string, [number, number, number]>} */
export const SPECIAL_MESSAGES = {
  reset: [0xb0, 0x00, 0x00],
  lowBrightnessTest: [0xb0, 0x00, 0x7d],
  mediumBrightnessTest: [0xb0, 0x00, 0x7e],
  fullBrightnessTest: [0xb0, 0x00, 0x7f],
};
