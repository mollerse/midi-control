/** @import * as Types from '../../types/devices/midi-mix.d.ts' */

// Buttons only has a single red LED.
/** @type {typeof Types.TRACKS} */
export const TRACKS = /** @type {const} */ ([1, 2, 3, 4, 5, 6, 7, 8]);

/** @type {typeof Types.BUTTONS} */
export const BUTTONS = {
  1: { mute: 0x1, solo: 0x2, recArm: 0x3 },
  2: { mute: 0x4, solo: 0x5, recArm: 0x6 },
  3: { mute: 0x7, solo: 0x8, recArm: 0x9 },
  4: { mute: 0xa, solo: 0xb, recArm: 0xc },
  5: { mute: 0xd, solo: 0xe, recArm: 0xf },
  6: { mute: 0x10, solo: 0x11, recArm: 0x12 },
  7: { mute: 0x13, solo: 0x14, recArm: 0x15 },
  8: { mute: 0x16, solo: 0x17, recArm: 0x18 },
  bankLeft: 0x19,
  bankRight: 0x1a,
  solo: 0x1b,
};

/** @type {typeof Types.KNOBS} */
export const KNOBS = {
  1: {
    1: 0x10,
    2: 0x11,
    3: 0x12,
  },
  2: {
    1: 0x14,
    2: 0x15,
    3: 0x16,
  },
  3: {
    1: 0x18,
    2: 0x19,
    3: 0x1a,
  },
  4: {
    1: 0x1c,
    2: 0x1d,
    3: 0x1e,
  },
  5: {
    1: 0x2e,
    2: 0x2f,
    3: 0x30,
  },
  6: {
    1: 0x32,
    2: 0x33,
    3: 0x34,
  },
  7: {
    1: 0x36,
    2: 0x37,
    3: 0x38,
  },
  8: {
    1: 0x3a,
    2: 0x3b,
    3: 0x3c,
  },
};

/** @type {typeof Types.SLIDERS} */
export const SLIDERS = {
  1: 0x13,
  2: 0x17,
  3: 0x1b,
  4: 0x1f,
  5: 0x31,
  6: 0x35,
  7: 0x39,
  8: 0x3d,
  master: 0x3e,
};

/** @type {typeof Types.MESSAGES} */
export const MESSAGES = {
  knob: 0xb0,
  slider: 0xb0,
  buttonDown: 0x90,
  buttonUp: 0x80,
};

/** @type {typeof Types.VALUES} */
export const VALUES = {
  knobHigh: 0x7f,
  knobLow: 0x00,
  sliderHigh: 0x7f,
  sliderLow: 0x00,
  button: 0x7f,
};

/** @type {typeof Types.LIGHTS} */
export const LIGHTS = {
  off: 0x0,
  on: 0x1,
};

/** @type {typeof Types.NAME} */
export const NAME = "MIDI Mix";
