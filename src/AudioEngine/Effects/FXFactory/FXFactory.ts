import { injectable } from "inversify";
import { makeObservable, observable } from "mobx";
import { GraphicEQ } from "../Equalizer";
import { BaseEffectType, EffectKeys } from "../types";

type EffectType = {
  name: EffectKeys;
  create: () => BaseEffectType;
};

@injectable()
export class FXFactory {
  effectId: number = 0;
  public effects: EffectType[] = [
    {
      name: EffectKeys.graphicEQ,
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

  getEffectKeys = (): EffectKeys[] => {
    return this.effects.map((effect) => effect.name);
  };
}
