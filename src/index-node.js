import { MidiControlImpl } from "./lib/midicontrol.js";
import { connect } from "./lib/node-midi-connect.js";

/** @type {import('../types/types.d.ts').default} */
export default async function midiControlFactory({ deviceName, title }) {
  let { midiInput, midiOutput } = await connect(deviceName);

  return new MidiControlImpl(midiInput, midiOutput, title);
}
