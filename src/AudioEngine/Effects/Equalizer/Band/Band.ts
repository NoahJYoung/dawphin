import { injectable } from "inversify";
import { v4 as uuid } from "uuid";
import * as Tone from "tone";
import { makeAutoObservable } from "mobx";

@injectable()
export class Band {
  filter: Tone.Filter = new Tone.Filter();
  id = uuid();
  constructor(
    public hertz: number = 1000,
    public gain: number = 0,
    public type: BiquadFilterType = "peaking",
    public Q: number = 0.5
  ) {
    makeAutoObservable(this);
    this.init();
  }

  init = () => {
    const { hertz, gain, type, Q } = this;
    this.filter.set({ frequency: hertz, gain, type, Q });
  };

  connect = (destination: Tone.ToneAudioNode) => {
    this.filter.connect(destination);
  };

  setHertz = (frequency: number) => {
    const roundedValue = Math.round(frequency);
    this.filter.set({ frequency: roundedValue });
    this.hertz = roundedValue;
  };

  setGain = (gain: number) => {
    if (gain < 12 && gain > -12) {
      const roundedValue = Math.round(gain * 100) / 100;
      this.filter.gain.linearRampTo(roundedValue, 0.1);
      this.gain = roundedValue;
    }
  };

  setQ = (Q: number) => {
    this.filter.set({ Q });
    this.Q = Q;
  };

  setFilterType = (type: BiquadFilterType) => {
    this.filter.type = type;
    this.type = this.filter.type;
  };

  dispose = () => {};
}
