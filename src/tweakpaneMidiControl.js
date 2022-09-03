import { Pane } from "tweakpane";
import MidiControl from "./midicontrol.js";
import { clamp, normalize } from "./utils.js";

const N = normalize.bind(null, 0, 127);

function isBasicTrigger(triggerId) {
  return typeof triggerId === "string" || typeof triggerId === "number";
}

function isTriggerPair(triggerId) {
  return Array.isArray(triggerId) && triggerId.length === 2;
}

class TweakpaneMidiControl extends MidiControl {
  #gui;

  constructor(title) {
    super();
    this.#gui = new Pane({ expanded: true, title });
  }

  addNumberValue(
    key,
    [value, min = 0, max = value, step = 1],
    { onChange, triggerId, eventId = 176 }
  ) {
    let { params, uiRef, triggers } = this.getActiveBinding();

    params[key] = value;

    let control = uiRef.addInput(params, key, { min, max, step });

    if (typeof onChange === "function") {
      control.on("change", onChange);
      onChange({ value }); // call onChange with initial value
    }

    function basicNumberUpdateFunc(v) {
      params[key] = min + N(v) * (max - min);
      control.refresh();
    }

    function createIncDecUpdateFunc(inc, v) {
      if (v !== 0) return; // Only trigger on release

      let current = params[key];
      let next = current + inc * step;

      params[key] = clamp(min, max, next);
      control.refresh();
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
      throw new Error(`Combination of values and triggers not supported`);
    }

    return this;
  }

  addBooleanValue(key, [value], { onChange, triggerId, eventId = 128 }) {
    let { params, uiRef, triggers } = this.getActiveBinding();
    params[key] = value;

    let control = uiRef.addInput(params, key);

    if (typeof onChange === "function") {
      control.on("change", onChange);
      onChange({ value }); // call onChange with initial value
    }

    function basicBoolUpdateFunc(v) {
      if (v !== 0) return; // Only trigger on release

      params[key] = !params[key];
      control.refresh();
    }

    function createOnOffUpdateFunc(on, v) {
      if (v !== 0) return; // Only trigger on release

      params[key] = on;
      control.refresh();
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
      throw new Error(`Combination of values and triggers not supported`);
    }

    return this;
  }

  addColorValue(key, [value], { onChange } = {}) {
    let { params, uiRef } = this.getActiveBinding();
    params[key] = value;

    let control = uiRef.addInput(params, key, { color: { alpha: true } });

    if (typeof onChange === "function") {
      control.on("change", onChange);
      onChange({ value }); // call onChange with initial value
    }

    return this;
  }

  addEffect(key, [fn], { triggerId, eventId = 144 }) {
    let { params, uiRef, triggers } = this.getActiveBinding();
    params[key] = fn;

    let btn = uiRef.addButton({
      title: key,
    });

    btn.on("click", fn);

    triggers[`${triggerId}.${eventId}`] = fn;

    return this;
  }

  // Extended methods
  removeBinding(name) {
    let ref = super.removeBinding(name);
    ref.uiRef.remove();
  }

  createBinding(name) {
    let ref = super.createBinding(name);
    ref.uiRef = this.#gui.addFolder({ title: name, expanded: true });

    return this;
  }
}

export default TweakpaneMidiControl;
