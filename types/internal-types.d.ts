declare interface MidiControlMessage {
  readonly data: Uint8Array;
}

declare class MidiControlInput {
  addEventListener(
    type: "midimessage",
    listener: (this: MidiControlInput, ev: MidiControlMessage) => any,
  ): void;
}

declare class MidiControlOutput {
  send(data: number[]): void;
}

declare function Connector(
  deviceName: string,
): Promise<{ midiInput: MidiControlInput?; midiOutput: MidiControlOutput? }>;

type Effect = () => void;
type Value = number | string | boolean | Effect;

type NumberConfig = {
  initial: number;
  min?: number;
  max?: number;
  step?: number;
};
type BooleanConfig = { initial: boolean };
type ColorConfig = { initial: string };
type EffectConfig = { initial: () => void };

type OnChangeConfig<T extends Value> = {
  onChange?: (event: { value: T }) => void;
};

type KeyId = number | [number, number];

type MidiConfig = {
  keyId: KeyId;
  messageType: number;
  value?: number;
};

type TriggerConfig<T extends Value> = MidiConfig & OnChangeConfig<T>;

declare class MidiControl {
  createBinding: (name: string) => void;
  removeBinding: (name: string) => void;
  activateBinding: (name: string) => void;
  deactivateBinding: (name: string) => void;

  enableDebug: () => void;

  send: (messageType: number, keyId: number, value: number) => void;
  sendSysEx: (data: number[]) => void;

  getNumberValue: (key: string) => number;
  getBooleanValue: (key: string) => boolean;
  getStringValue: (key: string) => string;
  getEffect: (key: string) => Effect;

  addNumberValue: (key: string, value: NumberConfig, trigger: TriggerConfig<number>) => MidiControl;
  addBooleanValue: (
    key: string,
    value: BooleanConfig,
    trigger: TriggerConfig<boolean>,
  ) => MidiControl;
  addColorValue: (key: string, value: ColorConfig, trigger: OnChangeConfig<string>) => MidiControl;
  addEffect: (key: string, value: EffectConfig, trigger: TriggerConfig<Effect>) => MidiControl;
}

export {
  MidiControl,
  MidiControlMessage,
  MidiControlInput,
  MidiControlOutput,
  Connector,
  Effect,
  Value,
  KeyId,
  NumberConfig,
  BooleanConfig,
  ColorConfig,
  EffectConfig,
  OnChangeConfig,
  TriggerConfig,
};
