import dat from "dat.gui";
import MidiControl from "./midicontrol.js";

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

const N = normalize.bind(null, 0, 127);

class DatGuiMidiControl extends MidiControl {
  #gui;

  constructor() {
    super();
    this.#gui = new dat.GUI({ closed: true });
  }

  addNumberValue(
    key,
    [value, min = 0, max = value, step = 1],
    { onChange, triggerId, eventId = 176 }
  ) {
    let { params, uiRef, triggers } = this.getActiveBinding();
    params[key] = value;

    let control = uiRef.add(params, key, min, max, step);

    if (typeof onChange === "function") {
      control.onChange(onChange);
    }

    if (typeof triggerId === "string" || typeof triggerId === "number") {
      triggers[`${triggerId}.${eventId}`] = (v) => control.setValue(min + N(v) * (max - min));
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

      triggers[`${triggerInc}.${eventId}`] = triggerFn(1);
      triggers[`${triggerDec}.${eventId}`] = triggerFn(-1);
    } else {
      console.error(`Combination of values and triggers not supported`);
    }

    return this;
  }

  addBooleanValue(key, [value], { onChange, triggerId, eventId = 144 }) {
    let { params, uiRef, triggers } = this.getActiveBinding();
    params[key] = value;

    let control = uiRef.add(params, key);

    if (typeof onChange === "function") {
      control.onChange(onChange);
    }

    if (typeof triggerId === "string" || typeof triggerId === "number") {
      triggers[`${triggerId}.${eventId}`] = (v) => {
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

      triggers[`${triggerOn}.${eventId}`] = (v) => {
        if (v === 0) return; // Don't trigger on release
        control.setValue(true);
        this.send(eventId, triggerOff, eventId === 176 ? 0 : 15);
        this.send(eventId, triggerOn, eventId === 176 ? 15 : 60);
      };

      triggers[`${triggerOff}.${eventId}`] = (v) => {
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
    let { params, uiRef } = this.getActiveBinding();
    params[key] = value;

    let control = uiRef.addColor(params, key);

    if (typeof onChange === "function") {
      control.onChange(onChange);
    }

    return this;
  }

  // Extended methods
  removeBinding(name) {
    super.removeBinding(name);
    this.#gui.removeFolder(name);
  }

  createBinding(name) {
    let ref = super.createBinding(name);
    ref.uiRef = this.#gui.addFolder(name);

    return this;
  }
}

export default DatGuiMidiControl;
