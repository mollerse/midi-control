import DatGuiMidiControl from "./datGuiMidiControl";

export default function midiControlFactory(type) {
  if (type === "dat") {
    return new DatGuiMidiControl();
  } else {
    throw new Error(`Unknown type ${type}`);
  }
}
