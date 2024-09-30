import { Pane } from "tweakpane";

import { clamp, normalize } from "./lib/utils.js";
import { isBasicTrigger, isTriggerPair } from "./lib/triggers.js";

/**
 * @typedef {(v: number) => void} Trigger
 * @typedef {`${number}.${number}`} TriggerId
 *
 * @typedef {Record.<string, Value>} Params
 * @typedef {Record.<TriggerId, Trigger>} Triggers
 *
 * @typedef {Object} Binding
 * @property {Params} params
 * @property {Triggers} triggers
 * @property {import("@tweakpane/core").FolderApi?} uiRef
 */

/** @implements {MidiControl} */
export class MidiControlImpl {
  /** @type {MidiControlOutput?} */
  #outDevice;
  /** @type {MidiControlInput?} */
  #inDevice;
  /** @type {Record.<string, Binding>} */
  #bindings = {};
  /** @type {string?} */
  #activeBinding = null;
  /** @type {boolean} */
  #debug = false;
  /** @type {Pane?} */
  #gui = null;

  /**
   * @param {MidiControlInput?} input
   * @param {MidiControlOutput?} output
   * @param {string} title
   */
  constructor(input, output, title) {
    this.#inDevice = input;
    this.#outDevice = output;

    this.#addMidiListener();

    if (typeof window !== "undefined") {
      this.#gui = new Pane({ expanded: true, title });
    }
  }

  /**
   * @void
   */
  #addMidiListener() {
    if (!this.#inDevice) return;

    this.#inDevice.addEventListener("midimessage", ({ data }) => {
      if (data == null) return;

      let [eventId, keyId, value] = data;

      this.#debugLog(`Midi Message received: [eventId:${eventId}, keyId:${keyId}, value:${value}]`);

      this.#trigger(`${keyId}.${eventId}`, value);
    });
  }

  /**
   * Logs messages to the console if debug is enabled.
   *
   * @param {string} msg
   */
  #debugLog(msg) {
    if (this.#debug) console.log(msg);
  }

  /**
   * Triggers a trigger with a value if an active binding exists.
   *
   * No-ops if trigger is not found.
   *
   * @param {TriggerId} triggerId
   * @param {number} v
   * @void
   */
  #trigger(triggerId, v) {
    let binding = this.#getActiveBinding();

    let trigger = binding.triggers[triggerId];

    if (!trigger) {
      this.#debugLog(`Tried to trigger trigger with ID ${triggerId}, but it does not exist.`);
      return;
    } else {
      this.#debugLog(`Triggering trigger ${triggerId} with value ${v}`);
    }

    trigger(v);
  }

  /**
   * @param {number} eventId
   * @param {number} keyId
   * @param {number} value
   */
  send(eventId, keyId, value) {
    if (!this.#outDevice) return;

    this.#debugLog(`Midi Message sent: [eventId:${eventId}, keyId:${keyId}, value:${value}]`);
    this.#outDevice.send([eventId, keyId, value]);
  }

  #getActiveBinding() {
    if (!this.#activeBinding) {
      throw new Error("Cannot get active binding, no active binding exists.");
    }

    return this.#bindings[this.#activeBinding];
  }

  /**
   * @param {string} name
   * @throws {Error}
   */
  #ensureBindingExist(name) {
    if (!Object.keys(this.#bindings).includes(name)) {
      throw new Error(`Cannot operate on unknown binding ${name}.`);
    }
  }

  /**
   * @param {string} name
   * @throws {Error}
   */
  #ensureBindingNotExist(name) {
    if (Object.keys(this.#bindings).includes(name)) {
      throw new Error(`Binding ${name} already exists. Remove before recreating.`);
    }
  }

  /**
   * @param {string} name
   */
  createBinding(name) {
    this.#ensureBindingNotExist(name);

    let uiRef = null;
    if (this.#gui) {
      uiRef = this.#gui.addFolder({ title: name, expanded: true });
    }

    this.#bindings[name] = {
      params: {},
      triggers: {},
      uiRef: uiRef,
    };

    this.activateBinding(name);
  }

  /**
   * @param {string} name
   */
  removeBinding(name) {
    this.#ensureBindingExist(name);

    if (this.#activeBinding === name) {
      this.#activeBinding = null;
      this.#debugLog(
        `Removing binding ${name} which is the current binding, current binding is now null.`,
      );
    }

    let ref = this.#bindings[name];
    if (this.#gui) {
      this.#gui.remove(/** @type {import('tweakpane').FolderApi} */ (ref.uiRef));
    }
    delete this.#bindings[name];
  }

  /**
   * @param {string} name
   */
  activateBinding(name) {
    this.#ensureBindingExist(name);

    if (this.#activeBinding === name) return; // noop

    this.#debugLog(`Setting "${name}" to active binding.`);
    this.#activeBinding = name;
  }

  /**
   * @param {string} key
   */
  getValue(key) {
    if (!this.#activeBinding) {
      throw new Error("No active binding.");
    }

    let { params } = this.#bindings[this.#activeBinding];

    return params[key];
  }

  enableDebug() {
    this.#debug = true;
  }

  /**
   * @param {string} key
   * @param {NumberConfig} value
   * @param {TriggerConfig<number>} trigger
   *
   * @returns {MidiControl}
   */
  addNumberValue(key, value, trigger) {
    let { params, uiRef, triggers } = this.#getActiveBinding();

    let initial = value.initial;
    let min = value.min || 0;
    let max = value.max || initial;
    let step = value.step || 1;

    let keyId = trigger.keyId;
    let messageType = trigger.messageType;
    let triggerValue = trigger.value;

    params[key] = initial;

    /** @type {import('@tweakpane/core').BindingApi?} */
    let control = null;
    if (uiRef) {
      control = uiRef.addBinding(params, key, { min, max, step });
    }

    if (typeof trigger.onChange === "function") {
      if (control) control.on("change", trigger.onChange);
      trigger.onChange({ value: initial });
    }

    /**
     * @param {number} v
     */
    function basicNumberUpdateFunc(v) {
      // NOTE: Most MIDI Knobs are in the range of 0x0 (0) to 0x7F (127). Might be wrong.
      params[key] = min + normalize(0x0, 0x7f, v) * (max - min);
      if (control) {
        control.refresh();
      } else if (typeof trigger.onChange === "function") {
        trigger.onChange({ value: params[key] });
      }
    }

    /**
     * @param {number} inc
     * @param {number} v
     * @returns
     */
    function createIncDecUpdateFunc(inc, v) {
      if (triggerValue != null && v !== triggerValue) return;

      let current = /** @type {number} */ (params[key]);
      let next = current + inc * step;

      params[key] = clamp(min, max, next);
      if (control) {
        control.refresh();
      } else if (typeof trigger.onChange === "function") {
        trigger.onChange({ value: params[key] });
      }
    }

    let inc = createIncDecUpdateFunc.bind(null, 1);
    let dec = createIncDecUpdateFunc.bind(null, -1);

    if (isBasicTrigger(keyId)) {
      triggers[`${/** @type {number} */ (keyId)}.${messageType}`] = basicNumberUpdateFunc;
    } else if (isTriggerPair(keyId)) {
      let [decId, incId] = /** @type {[number, number]} */ (keyId);

      triggers[`${incId}.${messageType}`] = inc;
      triggers[`${decId}.${messageType}`] = dec;
    } else {
      throw new Error(`Combination of triggers not supported`);
    }

    return this;
  }

  /**
   * @param {string} key
   * @param {BooleanConfig} value
   * @param {TriggerConfig<boolean>} trigger
   * @returns {MidiControl}
   */
  addBooleanValue(key, value, trigger) {
    let { params, uiRef, triggers } = this.#getActiveBinding();

    let initial = value.initial;

    let keyId = trigger.keyId;
    let messageType = trigger.messageType;
    let triggerValue = trigger.value;

    params[key] = initial;

    /** @type {import('@tweakpane/core').BindingApi?} */
    let control = null;
    if (uiRef) {
      control = uiRef.addBinding(params, key);
    }

    if (typeof trigger.onChange === "function") {
      if (control) control.on("change", trigger.onChange);
      trigger.onChange({ value: initial });
    }

    /**
     * @param {number} v
     * @returns {void}
     */
    function basicBoolUpdateFunc(v) {
      if (triggerValue != null && v !== triggerValue) return;

      params[key] = !params[key];
      if (control) {
        control.refresh();
      } else if (typeof trigger.onChange === "function") {
        trigger.onChange({ value: params[key] });
      }
    }

    /**
     * @param {boolean} on
     * @param {number} v
     * @returns
     */
    function createOnOffUpdateFunc(on, v) {
      if (triggerValue != null && v !== triggerValue) return;

      params[key] = on;

      if (control) {
        control.refresh();
      } else if (typeof trigger.onChange === "function") {
        trigger.onChange({ value: params[key] });
      }
    }

    let on = createOnOffUpdateFunc.bind(null, true);
    let off = createOnOffUpdateFunc.bind(null, false);

    if (isBasicTrigger(keyId)) {
      triggers[`${/** @type {number} */ (keyId)}.${messageType}`] = basicBoolUpdateFunc;
    } else if (isTriggerPair(keyId)) {
      let [onId, offId] = /** @type {[number, number]} */ (keyId);

      triggers[`${onId}.${messageType}`] = on;
      triggers[`${offId}.${messageType}`] = off;
    } else {
      throw new Error(`Combination of triggers not supported`);
    }

    return this;
  }

  /**
   * @param {string} key
   * @param {ColorConfig} value
   * @param {OnChangeConfig<string>} trigger
   * @returns {MidiControl}
   */
  addColorValue(key, value, trigger) {
    let { params, uiRef } = this.#getActiveBinding();
    let initial = value.initial;
    params[key] = initial;

    /** @type {import('@tweakpane/core').BindingApi?} */
    let control = null;
    if (uiRef) {
      control = uiRef.addBinding(params, key, { color: { alpha: true } });
    }

    if (typeof trigger.onChange === "function") {
      if (control) control.on("change", trigger.onChange);
      trigger.onChange({ value: initial });
    }

    return this;
  }

  /**
   * @param {string} key
   * @param {EffectConfig} value
   * @param {TriggerConfig<Effect>} trigger
   * @returns {MidiControl}
   */
  addEffect(key, value, trigger) {
    let { params, uiRef, triggers } = this.#getActiveBinding();

    let effect = value.initial;

    let keyId = trigger.keyId;
    let messageType = trigger.messageType;
    let triggerValue = trigger.value;

    params[key] = effect;

    if (uiRef) {
      let btn = uiRef.addButton({
        title: key,
      });

      btn.on("click", effect);
    }

    /**
     * @param {number} v
     * @returns {void}
     */
    function basicEffectTriggerFn(v) {
      if (triggerValue != null && v !== triggerValue) return;

      effect();
    }

    if (isBasicTrigger(keyId)) {
      triggers[`${/** @type {number} */ (keyId)}.${messageType}`] = basicEffectTriggerFn;
    } else {
      throw new Error(`Combination of triggers not supported`);
    }

    return this;
  }
}
