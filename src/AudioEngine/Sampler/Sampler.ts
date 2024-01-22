import { injectable } from "inversify";
import { action, makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { blobToBuffer } from "../helpers";

export interface Pad {
  volume: number;
  loaded: boolean;
}

@injectable()
export class Sampler {
  public active: boolean = false;
  public output: Tone.Channel = new Tone.Channel();
  public osc: Tone.Oscillator = new Tone.Oscillator(1).set({ volume: -50 });
  public padStates: Record<number, Pad> = {
    1: { volume: 0, loaded: false },
    2: { volume: 0, loaded: false },
    3: { volume: 0, loaded: false },
    4: { volume: 0, loaded: false },
    5: { volume: 0, loaded: false },
    6: { volume: 0, loaded: false },
    7: { volume: 0, loaded: false },
    8: { volume: 0, loaded: false },
    9: { volume: 0, loaded: false },
  };
  public toneSampler = new Tone.Sampler();

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private init = () => {
    this.toneSampler.connect(this.output);
    this.output.toDestination();
  };

  @action
  private setLoaded = (pad: number, state: boolean = true) => {
    this.padStates[pad].loaded = state;
  };

  async loadAudio(pad: number, audio: Blob) {
    const buffer = await blobToBuffer(audio);
    this.setLoaded(pad);
    this.toneSampler.add(`C${pad}` as Tone.Unit.Note, buffer);
  }

  attack(pad: number) {
    this.toneSampler.set({
      volume: this.padStates[pad].volume,
    });
    this.toneSampler.triggerAttack(`C${pad}`, Tone.immediate());
  }

  release(pad: number) {
    this.toneSampler.triggerRelease(`C${pad}`, Tone.immediate());
  }

  setPadVolume = (pad: number, value: number) => {
    this.padStates[pad].volume = value;
  };
}
