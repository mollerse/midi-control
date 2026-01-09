import {
  BUTTONS,
  KNOBS,
  LIGHTS,
  MESSAGES,
  PADS,
  TEMPLATES,
} from "../../../src/devices/launch-control.js";

/**
 * @import {MidiControl} from '../../../types/internal-types.js'
 */

/**
 * @param {MidiControl} controls
 */
export default function initialize(controls) {
  controls
    .addNumberValue(
      "testnumber",
      { initial: 0, min: -100, max: 100, step: 1 },
      {
        keyId: KNOBS[1][1],
        messageType: MESSAGES[TEMPLATES.user].knob,
      },
    )
    .addBooleanValue(
      "testbool",
      { initial: true },
      {
        keyId: PADS[1],
        messageType: MESSAGES[TEMPLATES.user].padOff,
        onChange: function ({ value }) {
          controls.send(
            MESSAGES[TEMPLATES.user].padOn,
            PADS[1],
            value ? LIGHTS.greenFull : LIGHTS.redFull,
          );
        },
      },
    )
    .addNumberValue(
      "testscale",
      { initial: 0, min: -2, max: 2, step: 1 },
      {
        keyId: [BUTTONS.left, BUTTONS.right],
        messageType: MESSAGES[TEMPLATES.user].button,
        value: 0,
        onChange: function ({ value }) {
          controls.send(
            MESSAGES[TEMPLATES.user].button,
            BUTTONS.right,
            [LIGHTS.redFull, LIGHTS.redLow, LIGHTS.off, LIGHTS.off, LIGHTS.off][2 - value],
          );
          controls.send(
            MESSAGES[TEMPLATES.user].button,
            BUTTONS.left,
            [LIGHTS.off, LIGHTS.off, LIGHTS.off, LIGHTS.redLow, LIGHTS.redFull][2 - value],
          );
        },
      },
    )
    .addBooleanValue(
      "testonoff",
      { initial: true },
      {
        keyId: [BUTTONS.up, BUTTONS.down],
        messageType: MESSAGES[TEMPLATES.user].button,
        value: 0,
        onChange: function ({ value }) {
          controls.send(
            MESSAGES[TEMPLATES.user].button,
            BUTTONS.up,
            value ? LIGHTS.redFull : LIGHTS.off,
          );
          controls.send(
            MESSAGES[TEMPLATES.user].button,
            BUTTONS.down,
            value ? LIGHTS.off : LIGHTS.redFull,
          );
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
      { keyId: 10, messageType: MESSAGES[TEMPLATES.user].padOff },
    );
}
