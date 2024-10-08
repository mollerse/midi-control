import midiControl from "../../index.js";
import { setupTestBinding } from "../lib/controls-setup.js";

let controls = await midiControl({
  deviceName: "Launch Control MIDI 1",
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
