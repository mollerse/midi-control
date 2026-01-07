import type { MidiControl } from "../../internal-types.js";

declare function midiControlFactory(params: MidiControlFactoryParams): Promise<MidiControl>;

export default midiControlFactory;
