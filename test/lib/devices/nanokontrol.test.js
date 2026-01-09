import {
  BUTTONS,
  KNOBS,
  VALUES,
  LIGHTS,
  TRACKS,
  MESSAGES,
  GLOBAL_BUTTONS,
  SLIDERS,
} from "../../../src/devices/nanokontrol.js";

/**
 * @import {MidiControl} from '../../../types/internal-types.js'
 */

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
        keyId: KNOBS[T1],
        messageType: MESSAGES.knob,
      },
    )
    .addBooleanValue(
      "solo",
      { initial: false },
      {
        keyId: BUTTONS[T1].solo,
        messageType: MESSAGES.button,
        value: VALUES.button.down,
        onChange: function ({ value }) {
          controls.send(MESSAGES.light, BUTTONS[T1].solo, value ? LIGHTS.on : LIGHTS.off);
        },
      },
    )
    .addBooleanValue(
      "mute",
      { initial: false },
      {
        keyId: BUTTONS[T1].mute,
        messageType: MESSAGES.button,
        value: VALUES.button.down,
        onChange: function ({ value }) {
          controls.send(MESSAGES.light, BUTTONS[T1].mute, value ? LIGHTS.on : LIGHTS.off);
        },
      },
    )
    .addBooleanValue(
      "recArm",
      { initial: false },
      {
        keyId: BUTTONS[T1].recArm,
        messageType: MESSAGES.button,
        value: VALUES.button.down,
        onChange: function ({ value }) {
          controls.send(MESSAGES.light, BUTTONS[T1].recArm, value ? LIGHTS.on : LIGHTS.off);
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
        keyId: [GLOBAL_BUTTONS.rewind, GLOBAL_BUTTONS.fastForward],
        messageType: MESSAGES.button,
        value: VALUES.button.down,
        onChange: function ({ value }) {
          controls.send(MESSAGES.light, GLOBAL_BUTTONS.rewind, value ? LIGHTS.on : LIGHTS.off);
          controls.send(MESSAGES.light, GLOBAL_BUTTONS.fastForward, value ? LIGHTS.off : LIGHTS.on);
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
      { keyId: GLOBAL_BUTTONS.play, messageType: MESSAGES.button },
    );
}
