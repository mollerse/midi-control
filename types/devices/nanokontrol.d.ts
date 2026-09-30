import type { MidiControl } from "../types.d.ts";

export declare const NAME: "nanoKONTROL2";

export declare const TRACKS: readonly [1, 2, 3, 4, 5, 6, 7, 8];

export declare const FEATURES: readonly ["KNOB", "SLIDER", "BUTTON"];

type Track = (typeof TRACKS)[number];

export declare const KNOBS: Readonly<Record<Track, number>>;

export declare const SLIDERS: Readonly<Record<Track, number>>;

export declare const BUTTONS: Readonly<
  Record<Track, Readonly<{ solo: number; mute: number; recArm: number }>>
>;

export declare const GLOBAL_BUTTONS: Readonly<{
  track: Readonly<{ next: number; previous: number }>;
  marker: Readonly<{ set: number; next: number; previous: number }>;
  cycle: number;
  rewind: number;
  fastForward: number;
  stop: number;
  play: number;
  record: number;
}>;

export declare const MESSAGES: Readonly<{
  button: number;
  knob: number;
  slider: number;
  light: number;
}>;

export declare const VALUES: Readonly<{
  button: Readonly<{ down: number; up: number }>;
  knob: Readonly<{ high: number; low: number }>;
  slider: Readonly<{ high: number; low: number }>;
}>;

export declare const LIGHTS: Readonly<{
  off: number;
  on: number;
}>;

export declare function enableExternalControlOfLEDs(controls: MidiControl): void;
