import midi from "midi";

import { normalize as n } from "./domain/normalize-device-name.js";

/**
 * @import {MidiControlOutput, MidiControlInput, Connector, MidiControlMessage} from '../../types/internal-types.js'
 * @import {Output as MidiOutput, Input as MidiInput} from 'midi'
 */

/**
 * Wrapper-class to make the interface of Midi.Output the same as WebAudioAPI.MidiOutput
 * @type {MidiControlOutput}
 */
class NodeMidiOutput {
  #device;

  /**
   * @param {MidiOutput} device
   */
  constructor(device) {
    this.#device = device;
  }

  /**
   * @param {number[]} data
   */
  send(data) {
    // TODO: Look at the typedef of midimessage internally in this module
    this.#device.sendMessage(/** @type {[number, number, number]} */ (data));
  }
}

/**
 * Wrapper-class to make the interface of Midi.Iutput the same as WebAudioAPI.MidiInput
 * @type {MidiControlInput}
 */
class NodeMidiInput {
  #device;

  /**
   * @param {MidiInput} device
   */
  constructor(device) {
    this.#device = device;
  }

  /**
   * @param {"midimessage"} _type
   * @param {(this: MidiControlInput, ev: MidiControlMessage) => void} listener
   */
  addEventListener(_type, listener) {
    this.#device.on("message", (_deltaTime, message) => {
      listener.call(this, { data: message });
    });
  }
}

/** @type {Connector} */
export async function connect(deviceName) {
  /** @type {MidiControlInput?} */
  let midiInput = null;
  /** @type {MidiControlOutput?} */
  let midiOutput = null;

  let output = new midi.Output();
  let input = new midi.Input();

  let outputPortNumber = null;

  let normalizedDeviceName = n(deviceName);

  for (let i = 0; i < output.getPortCount(); i++) {
    /** @type {string} */
    let portName = n(output.getPortName(i));

    if (portName.includes(normalizedDeviceName)) {
      outputPortNumber = i;
      break;
    }
  }

  if (outputPortNumber == null) {
    output.closePort();
    console.warn(`No output with name ${normalizedDeviceName} found.`);
  } else {
    output.openPort(outputPortNumber);
    midiOutput = new NodeMidiOutput(output);
  }

  let inputPortNumber = null;

  for (let i = 0; i < input.getPortCount(); i++) {
    /** @type {string} */
    let portName = n(input.getPortName(i));

    if (portName.includes(normalizedDeviceName)) {
      inputPortNumber = i;
      break;
    }
  }

  if (inputPortNumber == null) {
    input.closePort();
    console.warn(`No input with name ${normalizedDeviceName} found.`);
  } else {
    input.openPort(inputPortNumber);
    midiInput = new NodeMidiInput(input);
  }

  return { midiInput, midiOutput };
}
