function iterativeFind(findFn, iterator) {
  let { value, done } = iterator.next();
  while (!done) {
    if (findFn(value)) return value;

    ({ value, done } = iterator.next());
  }
}

function iterativeForEach(forEachFn, iterator) {
  let { value, done } = iterator.next();
  while (!done) {
    forEachFn(value);
    ({ value, done } = iterator.next());
  }
}

class MidiControl {
  #outDevice;
  #inDevice;
  #bindings = {};
  #activeBinding = null;
  #debug = false;

  constructor() {}

  async init(deviceName) {
    if (!window.navigator.requestMIDIAccess) {
      console.warn("Midi not available, not enabling midi controls.");
      return;
    }

    return navigator
      .requestMIDIAccess()
      .then((access) => {
        let findDevice = iterativeFind.bind(null, (v) => v.name.includes(deviceName));

        let inputs = access.inputs.values();
        let outputs = access.outputs.values();

        let maybeInput = findDevice(inputs);
        let maybeOutput = findDevice(outputs);

        if (maybeInput) {
          this.#setupInput(maybeInput);
        } else {
          console.warn(`No MIDI Input named ${deviceName} found.`);
        }

        if (maybeOutput) {
          this.#setupOutput(maybeOutput);
        } else {
          console.warn(`No MIDI Output named ${deviceName} found.`);
        }
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  // Helper to just list devices, incase you don't know what yours is called.
  async listDevices() {
    if (!window.navigator.requestMIDIAccess) {
      console.warn("Midi not available, not enabling midi controls.");
      return;
    }

    return navigator
      .requestMIDIAccess()
      .then((access) => {
        let inputs = access.inputs.values();
        let outputs = access.outputs.values();

        let listNames = iterativeForEach.bind(null, (v) => {
          console.log(`\tFound device: ${v.name}`);
        });

        console.log("Scanning inputs...");
        listNames(inputs);
        console.log("Scanning outputs...");
        listNames(outputs);
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  #setupInput(input) {
    this.#inDevice = input;

    this.#inDevice.onmidimessage = ({ data }) => {
      let [eventId, keyId, value] = data;

      this.#debugLog(`Midi Message received: [eventId:${eventId}, keyId:${keyId}, value:${value}]`);

      this.#trigger(`${keyId}.${eventId}`, value);
    };
  }

  #setupOutput(output) {
    this.#outDevice = output;
  }

  #debugLog(msg) {
    if (this.#debug) console.log(msg);
  }

  #trigger(triggerId, v) {
    let binding = this.getActiveBinding();

    if (!binding) return;

    let trigger = binding.triggers[triggerId];

    trigger && trigger(v);
  }

  send(eventId, keyId, value) {
    if (!this.#outDevice) return;

    this.#debugLog(`Midi Message sent: [eventId:${eventId}, keyId:${keyId}, value:${value}]`);
    this.#outDevice.send([eventId, keyId, value]);
  }

  getActiveBinding() {
    return this.#bindings[this.#activeBinding];
  }

  #ensureBindingExist(name) {
    if (!Object.keys(this.#bindings).includes(name)) {
      throw new Error(`Cannot operate on unknown binding ${name}.`);
    }
  }

  #ensureBindingNotExist(name) {
    if (Object.keys(this.#bindings).includes(name)) {
      throw new Error(`Binding ${name} already exists. Remove before recreating.`);
    }
  }

  createBinding(name) {
    this.#ensureBindingNotExist(name);

    this.#bindings[name] = {
      params: {},
      triggers: {},
    };

    this.activateBinding(name);

    let ref = this.#bindings[name];
    return ref;
  }

  removeBinding(name) {
    this.#ensureBindingExist(name);

    if (this.#activeBinding === name) {
      this.#activeBinding = null;
      console.info(
        `Removing binding ${name} which is the current binding, current binding is now null.`
      );
    }

    let ref = this.#bindings[name];
    delete this.#bindings[name];
    return ref;
  }

  activateBinding(name) {
    this.#ensureBindingExist(name);

    if (this.#activeBinding === name) return; // noop

    this.#debugLog(`Setting "${name}" to active binding.`);
    this.#activeBinding = name;
  }

  getValue(key) {
    let { params } = this.#bindings[this.#activeBinding];

    return params[key];
  }

  enableDebug() {
    this.#debug = true;
  }
}

export default MidiControl;
