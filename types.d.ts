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

type MidiConfig = {
  keyId: number | [number, number];
  messageType: number;
  value?: number;
};

type TriggerConfig<T extends Value> = MidiConfig & OnChangeConfig<T>;

interface MidiControl {
  createBinding: (name: string) => void;
  removeBinding: (name: string) => void;
  activateBinding: (name: string) => void;

  send: (messageType: number, keyId: number, value: number) => void;
  getValue: (key: string) => Value;

  enableDebug: () => void;

  addNumberValue: (key: string, value: NumberConfig, trigger: TriggerConfig<number>) => MidiControl;
  addBooleanValue: (
    key: string,
    value: BooleanConfig,
    trigger: TriggerConfig<boolean>,
  ) => MidiControl;
  addColorValue: (key: string, value: ColorConfig, trigger: OnChangeConfig<string>) => MidiControl;
  addEffect: (key: string, value: EffectConfig, trigger: TriggerConfig<Effect>) => MidiControl;
}

type MidiControlFactory = (config: { title: string; deviceName: string }) => Promise<MidiControl>;
