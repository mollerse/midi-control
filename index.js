import DatGuiMidiControl from "./datGuiMidiControl";
import TweakpaneMidiControl from "./tweakpaneMidiControl";

export default function midiControlFactory(type, args) {
  if (type === "dat") {
    return new DatGuiMidiControl();
  } else if (type === "tweakpane") {
    return new TweakpaneMidiControl(...args);
  } else {
    throw new Error(`Unknown type ${type}`);
  }
}
