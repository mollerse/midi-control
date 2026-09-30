import type { MidiControl } from "./internal-types.d.ts";

declare function MidiControlFactory(params: {
  deviceName: string;
  title: string;
}): Promise<MidiControl>;

export type {
  BooleanConfig,
  ColorConfig,
  Effect,
  EffectConfig,
  KeyId,
  MidiControl,
  NumberConfig,
  OnChangeConfig,
  TriggerConfig,
  Value,
} from "./internal-types.d.ts";

export { MidiControlFactory as default };
