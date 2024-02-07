import { injectable } from "inversify";
import { makeObservable, observable } from "mobx";
import { GraphicEQ } from "../Equalizer";
import { BaseEffectType, EffectNames } from "../types";

type EffectType = {
  name: string;
  create: () => BaseEffectType;
};

@injectable()
export class FXFactory {
  effectId: number = 0;
  public effects: EffectType[] = [
    {
      name: EffectNames.graphicEQ,
      create: () => new GraphicEQ(),
    },
    // { name: "EQ3", create: () => new Tone.EQ3() },
    // { name: "Compressor", create: () => new Tone.Compressor() },
    // { name: "Reverb", create: () => new Tone.Reverb() },
  ];

  constructor() {
    makeObservable(this, {
      effects: observable,
    });
  }

  createEffect = (name: string) => {
    const selectedEffect = this.effects.find((effect) => effect.name === name);
    if (selectedEffect) {
      return selectedEffect.create();
    } else {
      console.error(`Effect named "${name}" not found.`);
      return undefined;
    }
  };

  getEffectNames = () => {
    return this.effects.map((effect) => effect.name);
  };
}
