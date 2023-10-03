import { observable, makeObservable, action } from "mobx";
import * as Tone from "tone";
import { FXFactory } from "../Effects/FXFactory";

export class MasterControl {
  public name = "Master";
  public volume: number | null = null;
  public pan: number | null = null;
  public effectsChain: Tone.ToneAudioNode[] = [];
  public leftMeter = new Tone.Meter(0.9);
  public rightMeter = new Tone.Meter(0.9);
  public splitter = new Tone.Split();
  public channel: Tone.Channel = new Tone.Channel();

  constructor(public fxFactory: FXFactory) {
    makeObservable(this, {
      volume: observable,
      pan: observable,
      effectsChain: observable,
      setEffectsChain: action.bound,
      setVolume: action.bound,
    });

    Tone.getDestination().connect(this.channel.connect(this.splitter));
    this.splitter.connect(this.leftMeter, 0);
    this.splitter.connect(this.rightMeter, 1);
  }

  setVolume = (value: number) => {
    Tone.getDestination().set({ volume: Math.round(value) });
    this.volume = Math.round(Tone.getDestination().volume.value);
  };

  setEffectsChain = (effects: Tone.ToneAudioNode[]) => {
    this.effectsChain = effects;
  };

  addEffect = (effect: Tone.ToneAudioNode) => {
    this.effectsChain.forEach((effect, i) => {
      if (i < this.effectsChain.length - 1) {
        effect.disconnect(this.effectsChain[i + 1]);
      }
    });

    this.setEffectsChain([...this.effectsChain, effect]);

    this.channel.chain(...this.effectsChain, Tone.getDestination());
  };

  removeEffect = (index: number) => {
    const filteredFX = [...this.effectsChain];
    filteredFX.splice(index, 1);
    this.setEffectsChain(filteredFX);
  };
}
