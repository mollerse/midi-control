export declare const TRACKS: readonly [1, 2, 3, 4, 5, 6, 7, 8];

type Track = (typeof TRACKS)[number];
type Row = 1 | 2 | 3;

export declare const BUTTONS: Readonly<
  {
    [track in Track]: Readonly<{ mute: number; solo: number; recArm: number }>;
  } & {
    bankLeft: number;
    bankRight: number;
    solo: number;
  }
>;

export declare const KNOBS: Readonly<Record<Track, Readonly<Record<Row, number>>>>;

export declare const SLIDERS: Readonly<
  Record<Track, number> & {
    master: number;
  }
>;

export declare const MESSAGES: Readonly<{
  knob: number;
  slider: number;
  buttonDown: number;
  buttonUp: number;
}>;

export declare const VALUES: Readonly<{
  knobHigh: number;
  knobLow: number;
  sliderHigh: number;
  sliderLow: number;
  button: number;
}>;

export declare const LIGHTS: Readonly<{
  off: number;
  on: number;
}>;

export declare const NAME: "MIDI Mix";
