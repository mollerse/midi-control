import midi from "midi";

/**
 * @type {Types.MidiControlOutput}
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
 * @type {Types.MidiControlInput}
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
   * @param {(this: Types.MidiControlInput, ev: Types.MidiControlMessage) => any} listener
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

/** @type {Types.Connector} */
export async function connect(deviceName) {
  let midiInput = null;
  let midiOutput = null;

  let output = new midi.output();
  let input = new midi.input();

  let portNumber = null;

  for (let i = 0; i < output.getPortCount(); i++) {
    /** @type {string} */
    let portName = output.getPortName(i);

    if (portName.includes(deviceName)) {
      portNumber = i;
      break;
    }
  }

  if (portNumber == null) {
    output.closePort();
    console.warn(`No output with name ${deviceName} found.`);
  } else {
    output.openPort(portNumber);
    midiOutput = new NodeMidiOutput(output);
  }

  portNumber = null;

  for (let i = 0; i < input.getPortCount(); i++) {
    /** @type {string} */
    let portName = input.getPortName(i);

    if (portName.includes(deviceName)) {
      portNumber = i;
      break;
    }
  }
  if (portNumber == null) {
    input.closePort();
    console.warn(`No input with name ${deviceName} found.`);
  } else {
    input.openPort(portNumber);
    midiInput = new NodeMidiInput(input);
  }

  return { midiInput, midiOutput };
}
