/**
 * @import {MidiControl} from '../../../types/internal-types.js'
 */

import {
  BUTTONS,
  KNOBS,
  MESSAGES,
  TRACKS,
  VALUES,
  LIGHTS,
  SLIDERS,
} from "../../../src/devices/midi-mix.js";

/**
 * @param {MidiControl} controls
 */
export default function initialize(controls) {
  const T1 = TRACKS[0];

  controls
    .addNumberValue(
      "testnumber",
      { initial: 0, min: -100, max: 100, step: 1 },
      {
        keyId: KNOBS[T1][1],
        messageType: MESSAGES.knob,
      },
    )
    .addBooleanValue(
      "solo",
      { initial: false },
      {
        keyId: BUTTONS[T1].solo,
        messageType: MESSAGES.buttonDown,
        value: VALUES.button,
        onChange: function ({ value }) {
          controls.send(MESSAGES.buttonDown, BUTTONS[T1].solo, value ? LIGHTS.on : LIGHTS.off);
        },
      },
    )
    .addBooleanValue(
      "mute",
      { initial: false },
      {
        keyId: BUTTONS[T1].mute,
        messageType: MESSAGES.buttonDown,
        value: VALUES.button,
        onChange: function ({ value }) {
          controls.send(MESSAGES.buttonDown, BUTTONS[T1].mute, value ? LIGHTS.on : LIGHTS.off);
        },
      },
    )
    .addBooleanValue(
      "recArm",
      { initial: false },
      {
        keyId: BUTTONS[T1].recArm,
        messageType: MESSAGES.buttonDown,
        value: VALUES.button,
        onChange: function ({ value }) {
          controls.send(MESSAGES.buttonDown, BUTTONS[T1].recArm, value ? LIGHTS.on : LIGHTS.off);
        },
      },
    )
    .addNumberValue(
      "testscale",
      { initial: 0, min: 0, max: 10, step: 1 },
      {
        keyId: SLIDERS[T1],
        messageType: MESSAGES.slider,
      },
    )
    .addBooleanValue(
      "testonoff",
      { initial: true },
      {
        keyId: [BUTTONS.bankLeft, BUTTONS.bankRight],
        messageType: MESSAGES.buttonDown,
        value: VALUES.button,
        onChange: function ({ value }) {
          controls.send(MESSAGES.buttonDown, BUTTONS.bankLeft, value ? LIGHTS.on : LIGHTS.off);
          controls.send(MESSAGES.buttonDown, BUTTONS.bankRight, value ? LIGHTS.off : LIGHTS.on);
        },
      },
    )
    .addEffect(
      "Do something",
      {
        initial: function () {
          console.log("something");
        },
      },
      { keyId: BUTTONS.solo, messageType: MESSAGES.buttonDown },
    );
}
