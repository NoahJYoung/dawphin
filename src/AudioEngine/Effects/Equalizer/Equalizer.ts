import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { Band } from "./Band";

@injectable()
export class Equalizer {
  // low: Tone.Filter;
  // high: Tone.Filter;
  bands: Band[] = [];
  input: Tone.ToneAudioNode;
  destination: Tone.ToneAudioNode;

  constructor(input: Tone.ToneAudioNode, destination: Tone.ToneAudioNode) {
    this.input = input;

    // this.low = new Tone.Filter();
    // this.low.type = "lowshelf";

    const mid = new Tone.Filter();
    mid.type = "peaking";
    // this.bands.push(mid);

    // this.high = new Tone.Filter();
    // this.high.type = "highshelf";

    this.destination = destination;

    // this.chain();

    makeAutoObservable(this);
  }

  chain = () => {
    this.input.disconnect();
    // this.input.chain(this.low, ...this.bands, this.high, this.destination);
  };

  createBand = () => {
    this.bands.push(new Band());
  };
}
