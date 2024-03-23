/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { v4 as uuid } from "uuid";
import * as Tone from "tone";
import { BaseEffectType, EffectKeys } from "../types";

interface SetOptions {
  wet?: number;
  preDelay?: number;
  decay?: number;
}

type ValidReverbKeys = keyof SetOptions;

@injectable()
export class Reverb implements BaseEffectType {
  reverb: Tone.Reverb | null = null;

  constructor(
    public id = uuid(),
    public name: EffectKeys = EffectKeys.reverb,
    public input = new Tone.Channel(0),
    public output = new Tone.Channel(20),
    public wet = 1,
    public preDelay = 0,
    public decay = 1
  ) {
    makeAutoObservable(this);
    this.init();
  }

  init = () => {
    this.reverb = new Tone.Reverb(this.decay);
    this.connect();
  };

  connect = () => {
    if (this.reverb) {
      this.input.connect(this.reverb);
      this.reverb.connect(this.output);
    }
  };

  set = (params: SetOptions) => {
    if (this.reverb) {
      (Object.keys(params) as ValidReverbKeys[]).forEach((key) => {
        if (key in this.reverb! && key in this) {
          const paramValue = params[key];
          if (typeof paramValue === "number") {
            this.reverb![key as ValidReverbKeys] = paramValue as any;
            this[key] = paramValue;
          }
        }
      });
    }
  };

  offlineRender = () => {
    const input = new Tone.Channel();
    const output = new Tone.Channel(20);
    const offlineReverb = new Tone.Reverb(this.decay);
    input.chain(offlineReverb, output);
    return { input, output };
  };
}
