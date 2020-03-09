const dat = require("dat.gui");

// Patch dat.GUI
dat.GUI.prototype.removeFolder = function(name) {
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

class MidiControl {
  constructor(name) {
    this.gui = new dat.GUI({ closed: false });
    this.device = { in: null, out: null };
    this.schemes = {};
    this.activeScheme = null;

    if (!window.navigator.requestMIDIAccess) {
      console.warn("Midi not available, not enabling midi controls.");
      return;
    }

    navigator
      .requestMIDIAccess()
      .then(access => {
        let inputs = access.inputs.values();
        let outputs = access.outputs.values();
        let findDevice = iterativeFind.bind(null, v => v.name, name);

        let maybeInput = findDevice(inputs);
        let maybeOutput = findDevice(outputs);

        if (maybeInput) {
          let input = maybeInput;
          input.onmidimessage = ({ data }) => {
            let [eventId, keyId, value] = data;
            if (eventId === 144 || eventId === 176) {
              this.trigger(keyId, normalize(0, 127, value));
            }
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
      .catch(e => {
        console.warn(e);
      });
  }

  // Builder methods

  addScheme(name) {
    if (this.getSchemes().indexOf(name) > -1) {
      throw new Error(
        `Scheme ${name} already exists. Remove existing before adding.`
      );
    }
    this.schemes[name] = {
      values: {},
      triggers: {},
      gui: this.gui.addFolder(name)
    };
    this.activeScheme = name;

    return this;
  }

  addNumberValue(
    key,
    [value, min = 0, max = value, step = 1],
    { onChange, triggerId }
  ) {
    let scheme = this.getScheme();
    scheme.values[key] = value;

    let control = scheme.gui.add(scheme.values, key, min, max, step);

    if (typeof onChange === "function") {
      control.onChange(onChange);
    }

    if (typeof triggerId === "string" || typeof triggerId === "number") {
      scheme.triggers[triggerId] = v => control.setValue(min + v * (max - min));
    }

    return this;
  }

  addBooleanValue(key, [value], { onChange, triggerId }) {
    let scheme = this.getScheme();
    scheme.values[key] = value;

    let control = scheme.gui.add(scheme.values, key);

    if (typeof onChange === "function") {
      control.onChange(onChange);
    }

    if (typeof triggerId === "string" || typeof triggerId === "number") {
      scheme.triggers[triggerId] = () => {
        control.setValue(!control.getValue());
        if (this.device.out) {
          this.device.out.send([144, triggerId, control.getValue() ? 100 : 10]);
        }
      };
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

  // Debug-stuff

  getSchemes() {
    return Object.keys(this.schemes);
  }
}

module.exports = function midiControlFactory(name) {
  return new MidiControl(name);
};
