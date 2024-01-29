import { injectable } from "inversify";
import * as Tone from "tone";
import { makeAutoObservable } from "mobx";

@injectable()
export class Band {
  filter: Tone.Filter = new Tone.Filter();
  constructor(
    public hertz: number = 1000,
    public gain: number = 0,
    public type: BiquadFilterType = "peaking",
    public Q: number = 0.2
  ) {
    makeAutoObservable(this);
  }

  connect = (node: Tone.ToneAudioNode) => {
    this.filter.connect(node);
  };

  disconnect = (node: Tone.ToneAudioNode) => {
    this.filter.disconnect(node);
  };

  setHertz = (frequency: number) => {
    const roundedValue = Math.round(frequency * 100) / 100;
    this.filter.set({ frequency: roundedValue });
    this.hertz = this.filter.frequency.get().value;
  };

  setGain = (gain: number) => {
    const roundedValue = Math.round(gain * 100) / 100;
    this.filter.set({ gain: roundedValue });
    this.gain = this.filter.gain.get().value;
  };

  setQ = (Q: number) => {
    this.filter.set({ Q });
    this.Q = this.filter.Q.get().value;
  };
}
