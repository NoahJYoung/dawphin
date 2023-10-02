import * as Tone from "tone";
import { makeObservable, observable } from "mobx";

type EffectType = {
  name: string;
  factory: () => Tone.ToneAudioNode;
};

export class FXFactory {
  effectId: number = 0;
  public effects: EffectType[] = [
    { name: "EQ3", factory: () => new Tone.EQ3() },
    { name: "Compressor", factory: () => new Tone.Compressor() },
    { name: "Reverb", factory: () => new Tone.Reverb() },
  ];

  constructor() {
    makeObservable(this, {
      effects: observable,
    });
  }

  createEffect = (name: string): Tone.ToneAudioNode | undefined => {
    const selectedEffect = this.effects.find((effect) => effect.name === name);
    if (selectedEffect) {
      return selectedEffect.factory();
    } else {
      console.error(`Effect named "${name}" not found.`);
      return undefined;
    }
  };
}
