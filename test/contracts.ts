type Assert<T extends true> = T;
type Satisfies<Implementation, Contract> = Implementation extends Contract ? true : false;

export type BrowserFactoryContract = Assert<
  Satisfies<typeof import("../src/index.js"), typeof import("../types/types.d.ts")>
>;

export type NodeFactoryContract = Assert<
  Satisfies<typeof import("../src/index-node.js"), typeof import("../types/types.d.ts")>
>;

export type LaunchControlContract = Assert<
  Satisfies<
    typeof import("../src/devices/launch-control.js"),
    typeof import("../types/devices/launch-control.d.ts")
  >
>;

export type MidiMixContract = Assert<
  Satisfies<
    typeof import("../src/devices/midi-mix.js"),
    typeof import("../types/devices/midi-mix.d.ts")
  >
>;

export type NanoKontrolContract = Assert<
  Satisfies<
    typeof import("../src/devices/nanokontrol.js"),
    typeof import("../types/devices/nanokontrol.d.ts")
  >
>;
