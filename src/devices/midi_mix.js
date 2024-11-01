/**
 * @type {Record.<string, {mute: number, solo: number, recArm: number}>| {bankLeft: number, bankRight: number, solo: number}}
 *
 * Buttons only has a single red LED.
 */
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

/** @type {Record.<string, Record.<string, number>>} */
export const KNOBS = {
  1: {
    1: 0x10,
    2: 0x14,
    3: 0x18,
    4: 0x1c,
    5: 0x2e,
    6: 0x32,
    7: 0x36,
    8: 0x3a,
  },
  2: {
    1: 0x11,
    2: 0x15,
    3: 0x19,
    4: 0x1d,
    5: 0x2f,
    6: 0x33,
    7: 0x37,
    8: 0x3b,
  },
  3: {
    1: 0x12,
    2: 0x16,
    3: 0x1a,
    4: 0x1e,
    5: 0x30,
    6: 0x34,
    7: 0x38,
    8: 0x3c,
  },
};

/** @type {Record.<string, number>} */
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

/** @type {Record.<string, number>} */
export const EVENTS = {
  knob: 0xb0,
  slider: 0xb0,
  buttonDown: 0x90,
  buttonUp: 0x80,
};

/** @type {Record.<string, number>} */
export const VALUES = {
  knobHigh: 0x7f,
  knobLow: 0x00,
  sliderHigh: 0x7f,
  sliderLow: 0x00,
  buttonDown: 0x7f,
  buttonUp: 0x7f,
};

/** @type {Record.<string, number>} */
export const LIGHTS = {
  off: 0x0,
  on: 0x1,
};

export const NAME = "MIDI Mix";
