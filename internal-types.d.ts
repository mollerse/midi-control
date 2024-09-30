interface MidiControlMessage {
  readonly data: Uint8Array;
}

interface MidiControlInput {
  addEventListener(
    type: "midimessage",
    listener: (this: MidiControlInput, ev: MidiControlMessage) => any,
  ): void;
}

interface MidiControlOutput {
  send(data: number[]): void;
}

type Connector = (
  deviceName: string,
) => Promise<{ midiInput: MidiControlInput?; midiOutput: MidiControlOutput? }>;
