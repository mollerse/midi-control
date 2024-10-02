import { find as iterativeFind, map as iterativeMap } from "./lib/iterator-methods.js";

/** @type {MidiControl.Connector} */
export async function connect(deviceName) {
  /** @type {MidiControl.MidiControlInput?} */
  let midiInput = null;
  /** @type {MidiControl.MidiControlOutput?} */
  let midiOutput = null;

  if (!window.navigator.requestMIDIAccess) {
    console.warn("Midi not available, not enabling midi controls.");
    return { midiInput, midiOutput };
  }

  try {
    let access = await navigator.requestMIDIAccess();

    let inputs = access.inputs.values();
    let outputs = access.outputs.values();

    let maybeInput = iterativeFind((v) => (v.name || "").includes(deviceName), inputs);
    let maybeOutput = iterativeFind((v) => (v.name || "").includes(deviceName), outputs);

    if (maybeInput) {
      midiInput = maybeInput;
    } else {
      console.warn(`No MIDI Input named ${deviceName} found.`);
    }

    if (maybeOutput) {
      midiOutput = maybeOutput;
    } else {
      console.warn(`No MIDI Output named ${deviceName} found.`);
    }
  } catch (error) {
    if (error instanceof DOMException) {
      throw error;
    }
  }

  return { midiInput, midiOutput };
}

/**
 * @returns {Promise<{inputs: string[], outputs: string[]} | null>}
 */
export async function listDevices() {
  if (!window.navigator.requestMIDIAccess) {
    console.warn("Midi not available, not enabling midi controls.");
    return null;
  }

  try {
    let access = await navigator.requestMIDIAccess();
    let inputs = access.inputs.values();
    let outputs = access.outputs.values();

    let inputNames = iterativeMap((v) => /** @type {string} */ (v.name), inputs);
    let outputNames = iterativeMap((v) => /** @type {string} */ (v.name), outputs);

    return { inputs: inputNames, outputs: outputNames };
  } catch (error) {
    if (error instanceof DOMException) {
      throw error;
    }
  }

  return null;
}
