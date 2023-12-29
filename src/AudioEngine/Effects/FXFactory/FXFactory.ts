import * as Tone from "tone";
import { injectable } from "inversify";
import { makeObservable, observable } from "mobx";

type EffectType = {
  name: string;
  create: () => Tone.ToneAudioNode;
};

@injectable()
export class FXFactory {
  effectId: number = 0;
  public effects: EffectType[] = [
    { name: "EQ3", create: () => new Tone.EQ3() },
    { name: "Compressor", create: () => new Tone.Compressor() },
    { name: "Reverb", create: () => new Tone.Reverb() },
  ];

  constructor() {
    makeObservable(this, {
      effects: observable,
    });
  }

  createEffect = (name: string): Tone.ToneAudioNode | undefined => {
    const selectedEffect = this.effects.find((effect) => effect.name === name);
    if (selectedEffect) {
      return selectedEffect.create();
    } else {
      console.error(`Effect named "${name}" not found.`);
      return undefined;
    }
  };
}
