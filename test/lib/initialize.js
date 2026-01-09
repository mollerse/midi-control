import { NAME as launchControl } from "../../src/devices/launch-control.js";
import { NAME as nanokontrol } from "../../src/devices/nanokontrol.js";
import { NAME as midiMix } from "../../src/devices/midi-mix.js";

import initializeNanokontrol from "./devices/nanokontrol.test.js";
import initializeLaunchControl from "./devices/launch-control.test.js";
// import initializeMidiMix from './devices/midi-mix.test.js'

/**
 * @import {MidiControl} from '../../types/internal-types.js'
 */

/**
 * @param {MidiControl} controls
 * @param {string} name
 */
export default function initialize(controls, name) {
  controls.createBinding("Test");
  controls.enableDebug();

  // NOTE: colorValue is not dependent on the device
  controls.addColorValue("testcolor", { initial: "#ff00ffff" }, {});

  let initializeDevice = {
    [launchControl]: initializeLaunchControl,
    [nanokontrol]: initializeNanokontrol,
    [midiMix]: null,
  }[name];

  if (initializeDevice == null) {
    throw Error(`Device ${name} not found.`);
  }

  initializeDevice(controls);
}
