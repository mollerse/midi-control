import midiControl from "../../src/index-node.js";
import { NAME } from "../../src/devices/nanokontrol.js";
import initialize from "../lib/initialize.js";

let controls = await midiControl({
  deviceName: NAME,
  title: "Testing Tweakpane",
});

initialize(controls, NAME);

controls.createBinding("toBeRemoved");

setTimeout(() => {
  controls.removeBinding("toBeRemoved");
  controls.activateBinding("Test");
}, 1000);

setTimeout(() => {
  controls.deactivateBinding("Test");
}, 2000);

// Keep-alive
setInterval(() => {}, 100);
