import type { MidiControl } from "./internal-types.d.ts";

declare function midiControlFactory(params: MidiControlFactoryParams): Promise<MidiControl>;

export default midiControlFactory;
