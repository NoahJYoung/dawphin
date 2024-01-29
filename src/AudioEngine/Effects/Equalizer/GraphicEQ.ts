import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { Band } from "./Band";

@injectable()
export class GraphicEQ {
  channel: Tone.ToneAudioNode = new Tone.Channel();
  bands: Band[] = [];

  name: string = "graphicEQ";

  constructor() {
    makeAutoObservable(this);
    this.createBand();
    this.chain();
  }

  createBand = () => {
    this.channel.disconnect();
    this.bands.push(new Band());
    this.chain();
  };

  chain = () => {
    this.channel.disconnect();
    this.channel.chain(...this.bands.map((band) => band.filter));
  };
}
