import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

type BandType = "hipass" | "lowpass" | "peaking";

@injectable()
export class Band {
  public Q: number = 1;

  constructor(
    public hertz: number = 1000,
    public gain: number = 0,
    public type: BandType = "peaking"
  ) {
    makeAutoObservable(this);
  }

  setHertz = (hertz: number) => {
    this.hertz = hertz;
  };

  setGain = (gain: number) => {
    this.gain = gain;
  };

  setQ = (Q: number) => {
    this.Q = Q;
  };
}
