import midi from "midi";

import { normalize as n } from './lib/normalize-device-name.js';

/**
 * @type {MidiControl.MidiControlOutput}
 */
class NodeMidiOutput {
  #device;

  /**
   * @param {any} device
   */
  constructor(device) {
    this.#device = device;
  }

  /**
   * @param {number[]} data
   */
  send(data) {
    this.#device.sendMessage(data);
  }
}

/**
 * @type {MidiControl.MidiControlInput}
 */
class NodeMidiInput {
  #device;

  /**
   * @param {any} device
   */
  constructor(device) {
    this.#device = device;
  }

  /**
   * @param {"midimessage"} _
   * @param {(this: MidiControl.MidiControlInput, ev: MidiControl.MidiControlMessage) => any} listener
   */
  addEventListener(_, listener) {
    /**
     * @this {NodeMidiInput}
     * @param {any} _
     * @param {any} message
     */
    function wrappedListener(_, message) {
      let data = /** @type {Uint8Array} */ (message);

      listener.call(this, { data });
    }

    this.#device.on("message", wrappedListener.bind(this));
  }
}

/** @type {MidiControl.Connector} */
export async function connect(deviceName) {
  let midiInput = null;
  let midiOutput = null;

  let output = new midi.output();
  let input = new midi.input();

  let portNumber = null;

  let normalizedDeviceName = n(deviceName)

  for (let i = 0; i < output.getPortCount(); i++) {
    /** @type {string} */
    let portName = n(output.getPortName(i));

    if (portName.includes(normalizedDeviceName)) {
      portNumber = i;
      break;
    }
  }

  if (portNumber == null) {
    output.closePort();
    console.warn(`No output with name ${normalizedDeviceName} found.`);
  } else {
    output.openPort(portNumber);
    midiOutput = new NodeMidiOutput(output);
  }

  portNumber = null;

  for (let i = 0; i < input.getPortCount(); i++) {
    /** @type {string} */
    let portName = n(input.getPortName(i));

    if (portName.includes(normalizedDeviceName)) {
      portNumber = i;
      break;
    }
  }
  if (portNumber == null) {
    input.closePort();
    console.warn(`No input with name ${normalizedDeviceName} found.`);
  } else {
    input.openPort(portNumber);
    midiInput = new NodeMidiInput(input);
  }

  return { midiInput, midiOutput };
}
