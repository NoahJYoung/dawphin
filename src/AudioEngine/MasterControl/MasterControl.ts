import { observable, makeObservable, action } from "mobx";
import * as Tone from "tone";
import { FXFactory } from "../FXFactory";

export class MasterControl {
  public name = "Master";
  public volume: number | null = null;
  public pan: number | null = null;
  public effectsChain: Tone.ToneAudioNode[] = [];
  public leftMeter = new Tone.Meter(0.9);
  public rightMeter = new Tone.Meter(0.9);
  public splitter = new Tone.Split();

  constructor(public fxFactory: FXFactory) {
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

  addEffect = () => console.log("not implemented yet");
}
