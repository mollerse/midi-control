/** @import * as Types from '../../types/devices/launch-control.d.ts' */

/** @type {typeof Types.TEMPLATES} */
export const TEMPLATES = {
  user: "user",
  factory: "factory",
};

/** @type {typeof Types.PADS} */
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

// Buttons only has a single red LED.
/** @type {typeof Types.BUTTONS} */
export const BUTTONS = {
  up: 0x72,
  down: 0x73,
  left: 0x74,
  right: 0x75,
};

/** @type {typeof Types.KNOBS} */
export const KNOBS = {
  1: {
    1: 0x15,
    2: 0x16,
    3: 0x17,
    4: 0x18,
    5: 0x19,
    6: 0x1a,
    7: 0x1b,
    8: 0x1c,
  },
  2: {
    1: 0x29,
    2: 0x2a,
    3: 0x2b,
    4: 0x2c,
    5: 0x2d,
    6: 0x2e,
    7: 0x2f,
    8: 0x30,
  },
};

/** @type {typeof Types.MESSAGES} */
export const MESSAGES = {
  [TEMPLATES.user]: {
    knob: 0xb0,
    padOn: 0x90,
    padOff: 0x80,
    button: 0xb0,
  },
  [TEMPLATES.factory]: {
    knob: 0xb8,
    padOn: 0x98,
    padOff: 0x88,
    button: 0xb8,
  },
};

/** @type {typeof Types.VALUES} */
export const VALUES = {
  knobHigh: 0x7f,
  knobLow: 0x00,
  buttonDown: 0x7f,
  buttonUp: 0x00,
  padDown: 0x7f,
  padUp: 0x00,
};

/** @type {typeof Types.LIGHTS} */
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

/** @type {typeof Types.SPECIAL_MESSAGES} */
export const SPECIAL_MESSAGES = {
  reset: [0xb0, 0x00, 0x00],
  lowBrightnessTest: [0xb0, 0x00, 0x7d],
  mediumBrightnessTest: [0xb0, 0x00, 0x7e],
  fullBrightnessTest: [0xb0, 0x00, 0x7f],
};

/** @type {typeof Types.NAME} */
export const NAME = "Launch Control";
