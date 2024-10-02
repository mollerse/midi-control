import { MidiControlImpl } from "./src/midicontrol.js";
import { connect } from "./src/node-midi-connect.js";

/**
 * @param {{deviceName: string, title: string}} config
 * @returns {Promise<MidiControl>}
 */
export default async function midiControlFactory({ deviceName, title }) {
  let { midiInput, midiOutput } = await connect(deviceName);

  return new MidiControlImpl(midiInput, midiOutput, title);
}
