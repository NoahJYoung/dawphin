import { observable, makeObservable, action } from "mobx";
import * as Tone from "tone";

export class MasterControl {
  public volume: number | null = null;
  public pan: number | null = null;

  constructor(
    public leftMeter = new Tone.Meter(0.9),
    public rightMeter = new Tone.Meter(0.9),
    public splitter = new Tone.Split()
  ) {
    makeObservable(this, {
      volume: observable,
      pan: observable,
      setVolume: action.bound,
    });

    Tone.getDestination().connect(this.splitter);
    this.splitter.connect(this.leftMeter, 0);
    this.splitter.connect(this.rightMeter, 1);
  }

  setVolume = (value: number) => {
    Tone.getDestination().set({ volume: Math.round(value) });
    this.volume = Math.round(Tone.getDestination().volume.value);
  };
}
