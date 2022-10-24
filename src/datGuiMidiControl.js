import dat from "dat.gui";
import MidiControl from "./midicontrol.js";
import { clamp, normalize } from "./utils.js";
import { isBasicTrigger, isTriggerPair } from "./triggers.js";

const N = normalize.bind(null, 0, 127);

class DatGuiMidiControl extends MidiControl {
  #gui;

  constructor() {
    super();
    this.#gui = new dat.GUI({ closed: false });
  }

  addNumberValue(
    key,
    [value, min = 0, max = value, step = 1],
    { onChange, triggerId, eventId = 176, triggerValue = 0 }
  ) {
    let { params, uiRef, triggers } = this.getActiveBinding();
    params[key] = value;

    let control = uiRef.add(params, key, min, max, step);

    if (typeof onChange === "function") {
      control.onChange((value) => onChange({ value }));
      onChange({ value }); // call onChange with initial value
    }

    function basicNumberUpdateFunc(v) {
      control.setValue(min + N(v) * (max - min));
    }

    function createIncDecUpdateFunc(inc, v) {
      if (v !== triggerValue) return; // Only trigger for designated values

      let current = control.getValue();
      let next = current + inc * step;

      control.setValue(clamp(min, max, next));
    }

    let inc = createIncDecUpdateFunc.bind(null, 1);
    let dec = createIncDecUpdateFunc.bind(null, -1);

    if (isBasicTrigger(triggerId)) {
      triggers[`${triggerId}.${eventId}`] = basicNumberUpdateFunc;
    } else if (isTriggerPair(triggerId)) {
      let [triggerDec, triggerInc] = triggerId;

      triggers[`${triggerInc}.${eventId}`] = inc;
      triggers[`${triggerDec}.${eventId}`] = dec;
    } else {
      throw new Error(`Combination of triggers not supported`);
    }

    return this;
  }

  addBooleanValue(key, [value], { onChange, triggerId, eventId = 144, triggerValue = 0 }) {
    let { params, uiRef, triggers } = this.getActiveBinding();
    params[key] = value;

    let control = uiRef.add(params, key);

    if (typeof onChange === "function") {
      control.onChange((value) => onChange({ value }));
      onChange({ value }); // call onChange with initial value
    }

    function basicBoolUpdateFunc(v) {
      if (v !== triggerValue) return; // Only trigger for designated values

      control.setValue(!control.getValue());
    }

    function createOnOffUpdateFunc(on, v) {
      if (v !== triggerValue) return; // Only trigger for designated values

      control.setValue(on);
    }

    let on = createOnOffUpdateFunc.bind(null, true);
    let off = createOnOffUpdateFunc.bind(null, false);

    if (isBasicTrigger(triggerId)) {
      triggers[`${triggerId}.${eventId}`] = basicBoolUpdateFunc;
    } else if (isTriggerPair(triggerId)) {
      let [triggerOn, triggerOff] = triggerId;

      triggers[`${triggerOn}.${eventId}`] = on;
      triggers[`${triggerOff}.${eventId}`] = off;
    } else {
      throw new Error(`Combination of triggers not supported`);
    }

    return this;
  }

  addColorValue(key, [value], { onChange } = {}) {
    let { params, uiRef } = this.getActiveBinding();
    params[key] = value;

    let control = uiRef.addColor(params, key);

    if (typeof onChange === "function") {
      control.onChange((value) => onChange({ value }));
      onChange({ value }); // call onChange with initial value
    }

    return this;
  }

  addEffect(key, [fn], { triggerId, eventId = 144, triggerValue = 0 }) {
    let { params, uiRef, triggers } = this.getActiveBinding();
    params[key] = fn;

    uiRef.add(params, key);

    triggers[`${triggerId}.${eventId}`] = (v) => {
      if (v !== triggerValue) return; // Only trigger for designated values

      fn();
    };

    return this;
  }

  // Extended methods
  removeBinding(name) {
    let ref = super.removeBinding(name);
    this.#gui.removeFolder(ref.uiRef);
  }

  createBinding(name) {
    let ref = super.createBinding(name);
    ref.uiRef = this.#gui.addFolder(name);
    ref.uiRef.open();

    return this;
  }
}

export default DatGuiMidiControl;
