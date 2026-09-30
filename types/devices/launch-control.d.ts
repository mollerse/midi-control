type PadId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type KnobBank = 1 | 2;
type KnobId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export declare const TEMPLATES: {
  readonly user: "user";
  readonly factory: "factory";
};

export declare const PADS: Readonly<Record<PadId, number>>;

export declare const BUTTONS: Readonly<{
  up: number;
  down: number;
  left: number;
  right: number;
}>;

export declare const KNOBS: Readonly<Record<KnobBank, Readonly<Record<KnobId, number>>>>;

export declare const MESSAGES: Readonly<
  Record<"user" | "factory", Readonly<Record<"knob" | "padOn" | "padOff" | "button", number>>>
>;

export declare const VALUES: Readonly<{
  knobHigh: number;
  knobLow: number;
  buttonDown: number;
  buttonUp: number;
  padDown: number;
  padUp: number;
}>;

export declare const LIGHTS: Readonly<{
  off: number;
  redLow: number;
  redFull: number;
  amberLow: number;
  amberFull: number;
  yellow: number;
  greenLow: number;
  greenFull: number;
}>;

export declare const SPECIAL_MESSAGES: Readonly<
  Record<
    "reset" | "lowBrightnessTest" | "mediumBrightnessTest" | "fullBrightnessTest",
    [number, number, number]
  >
>;

export declare const NAME: "Launch Control";
