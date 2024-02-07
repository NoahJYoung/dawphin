import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { v4 as uuid } from "uuid";
import * as Tone from "tone";
import { Band } from "./Band";
import { BaseEffectType, EffectNames } from "../types";

@injectable()
export class GraphicEQ implements BaseEffectType {
  id = uuid();
  bands: Band[] = [];
  input = new Tone.Channel();
  output = new Tone.Channel();
  name: EffectNames = EffectNames.graphicEQ;

  constructor() {
    makeAutoObservable(this);
    this.input.connect(this.output);
    this.connect();
  }

  createBand = () => {
    const band = new Band();
    this.bands.push(band);
    this.input.disconnect();

    this.connect();

    return band.id;
  };

  deleteBand = (key: string) => {
    this.bands = [...this.bands.filter((band) => band?.id !== key)];
  };

  connect = () => {
    const bandsLength = this.bands.length;
    if (bandsLength > 0) {
      this.input.connect(this.bands[0].filter);

      for (let i = 0; i < bandsLength - 1; i++) {
        this.bands[i].connect(this.bands[i + 1].filter);
      }

      this.bands[bandsLength - 1].connect(this.output);
    }
  };

  mute = () => this.output.set({ mute: true });
}
