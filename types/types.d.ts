declare type MidiControl = import("./internal-types.d.ts").MidiControl;
declare function MidiControlFactory(params: {
  deviceName: string;
  title: string;
}): Promise<MidiControl>;

export { MidiControlFactory as default, MidiControl };
