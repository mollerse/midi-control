import dat from "dat.gui";

// Patch dat.GUI
dat.GUI.prototype.removeFolder = function (name) {
  var folder = this.__folders[name];
  if (!folder) {
    return;
  }
  folder.close();
  this.__ul.removeChild(folder.domElement.parentNode);
  delete this.__folders[name];
  this.onResize();
};

function normalize(min, max, v) {
  return (v - min) / (max - min);
}

function iterativeFind(keyFn, lookup, iterator) {
  let { value, done } = iterator.next();
  while (!done) {
    if (keyFn(value) === lookup) return value;

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
  constructor() {
    this.gui = new dat.GUI({ closed: false });
    this.device = { in: null, out: null };
    this.schemes = {};
    this.activeScheme = null;
    this.debug = false;
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

  async init(name) {
    if (!window.navigator.requestMIDIAccess) {
      console.warn("Midi not available, not enabling midi controls.");
      return;
    }

    return navigator
      .requestMIDIAccess()
      .then((access) => {
        let inputs = access.inputs.values();
        let outputs = access.outputs.values();
        let findDevice = iterativeFind.bind(null, (v) => v.name, name);

        let maybeInput = findDevice(inputs);
        let maybeOutput = findDevice(outputs);

        if (maybeInput) {
          let input = maybeInput;
          input.onmidimessage = ({ data }) => {
            let [eventId, keyId, value] = data;
            if (this.debug) {
              console.log(
                `Midi Message received: [eventId:${eventId}, keyId:${keyId}, value:${value}]`
              );
            }
            this.trigger(`${keyId}.${eventId}`, normalize(0, 127, value));
          };
          this.device.in = input;
        } else {
          console.warn(`No MIDI Input named ${name} found.`);
        }

        if (maybeOutput) {
          let output = maybeOutput;
          this.device.out = output;
        } else {
          console.warn(`No MIDI Output named ${name} found.`);
        }
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  // Builder methods

  addScheme(name) {
    if (this.getSchemes().indexOf(name) > -1) {
      throw new Error(`Scheme ${name} already exists. Remove existing before adding.`);
    }
    this.schemes[name] = {
      values: {},
      triggers: {},
      gui: this.gui.addFolder(name),
    };
    this.activeScheme = name;

    return this;
  }

  addNumberValue(
    key,
    [value, min = 0, max = value, step = 1],
    { onChange, triggerId, eventId = 176 }
  ) {
    let scheme = this.getScheme();
    scheme.values[key] = value;

    let control = scheme.gui.add(scheme.values, key, min, max, step);

    if (typeof onChange === "function") {
      control.onChange(onChange);
    }

    if (typeof triggerId === "string" || typeof triggerId === "number") {
      scheme.triggers[`${triggerId}.${eventId}`] = (v) => control.setValue(min + v * (max - min));
    } else if (Array.isArray(triggerId) && Math.abs(max - min) / step === 4) {
      let [triggerInc, triggerDec] = triggerId;

      this.send(eventId, triggerInc, [15, 13, 0, 0, 0][max - value]);
      this.send(eventId, triggerDec, [0, 0, 0, 13, 15][max - value]);

      let triggerFn = (inc) => (v) => {
        if (v === 0) return; // Don't trigger on release

        let current = control.getValue();
        let next = current + inc * step;

        if (next > max) next = max;
        if (next < min) next = min;

        control.setValue(next);
        this.send(eventId, triggerInc, [15, 13, 0, 0, 0][max - next]);
        this.send(eventId, triggerDec, [0, 0, 0, 13, 15][max - next]);
      };

      scheme.triggers[`${triggerInc}.${eventId}`] = triggerFn(1);
      scheme.triggers[`${triggerDec}.${eventId}`] = triggerFn(-1);
    } else {
      console.error(`Combination of values and triggers not supported`);
    }

    return this;
  }

  addBooleanValue(key, [value], { onChange, triggerId, eventId = 144 }) {
    let scheme = this.getScheme();
    scheme.values[key] = value;

    let control = scheme.gui.add(scheme.values, key);

    if (typeof onChange === "function") {
      control.onChange(onChange);
    }

    if (typeof triggerId === "string" || typeof triggerId === "number") {
      scheme.triggers[`${triggerId}.${eventId}`] = (v) => {
        if (v === 0) return; // Don't trigger on release
        control.setValue(!control.getValue());
        if (eventId === 176) {
          this.send(eventId, triggerId, control.getValue() ? 15 : 0);
        } else {
          this.send(eventId, triggerId, control.getValue() ? 60 : 15);
        }
      };
    } else if (Array.isArray(triggerId) && triggerId.length === 2) {
      let [triggerOn, triggerOff] = triggerId;

      // Set up state based on default value
      if (value) {
        this.send(eventId, triggerOff, eventId === 176 ? 0 : 15);
        this.send(eventId, triggerOn, eventId === 176 ? 15 : 60);
      } else {
        this.send(eventId, triggerOn, eventId === 176 ? 0 : 15);
        this.send(eventId, triggerOff, eventId === 176 ? 15 : 60);
      }
      onChange(value);

      scheme.triggers[`${triggerOn}.${eventId}`] = (v) => {
        if (v === 0) return; // Don't trigger on release
        control.setValue(true);
        this.send(eventId, triggerOff, eventId === 176 ? 0 : 15);
        this.send(eventId, triggerOn, eventId === 176 ? 15 : 60);
      };

      scheme.triggers[`${triggerOff}.${eventId}`] = (v) => {
        if (v === 0) return; // Don't trigger on release
        control.setValue(false);
        this.send(eventId, triggerOn, eventId === 176 ? 0 : 15);
        this.send(eventId, triggerOff, eventId === 176 ? 15 : 60);
      };
    } else {
      console.error(`Combination of values and triggers not supported`);
    }

    return this;
  }

  addColorValue(key, [value], { onChange }) {
    let scheme = this.getScheme();
    scheme.values[key] = value;

    let control = scheme.gui.addColor(scheme.values, key);

    if (typeof onChange === "function") {
      control.onChange(onChange);
    }

    return this;
  }

  // Runtime methods

  loadScheme(name) {
    if (this.getSchemes().indexOf(name) < 0) {
      throw new Error(`Scheme ${name} not found. Please initialize.`);
    }

    if (this.activeScheme === name) {
      console.warn(`Scheme ${name} already active. Skipping.`);
    } else if (this.activeScheme != null) {
      console.warn(`Unloading active scheme ${name}.`);
      this.unloadScheme(this.activeScheme);
    }

    this.activeScheme = name;
  }

  unloadScheme(name) {
    if (this.getSchemes().indexOf(name) < 0) {
      console.warn(`Scheme ${name} not found. Skipping.`);
    }

    if (this.activeScheme === name) {
      this.activeScheme = null;
    }
  }

  removeScheme(name) {
    if (this.getSchemes().indexOf(name) < 0) {
      console.warn(`Scheme ${name} not found. Skipping.`);
    } else {
      this.unloadScheme(name);
      this.gui.removeFolder(name);
      delete this.schemes[name];
    }
  }

  getValue(key) {
    let scheme = this.getScheme();

    return scheme.values[key];
  }

  // Internal stuff
  getScheme(name = this.activeScheme) {
    return this.schemes[name];
  }

  trigger(triggerId, v) {
    let scheme = this.getScheme();
    if (!scheme) return;

    let trigger = scheme.triggers[triggerId];

    trigger && trigger(v);
  }

  send(eventId, keyId, value) {
    if (this.device.out) {
      if (this.debug) {
        console.log(`Midi Message sent: [eventId:${eventId}, keyId:${keyId}, value:${value}]`);
      }
      this.device.out.send([eventId, keyId, value]);
    }
  }

  // Debug-stuff

  getSchemes() {
    return Object.keys(this.schemes);
  }

  enableDebug() {
    this.debug = true;
  }
}

export function midiControlFactory(name) {
  return new MidiControl(name);
}
