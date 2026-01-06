import midiControl from "../../index.js";
import { NAME } from "../../src/devices/launch-control.js";
import { setupTestBinding } from "../lib/controls-setup.js";

let controls = await midiControl({
  deviceName: NAME,
  title: "Testing Tweakpane",
});

setupTestBinding(controls);

controls.createBinding("toBeRemoved");

setTimeout(() => {
  controls.removeBinding("toBeRemoved");
  controls.activateBinding("Test");
}, 1000);

setTimeout(() => {
  controls.deactivateBinding("Test");
}, 2000);
