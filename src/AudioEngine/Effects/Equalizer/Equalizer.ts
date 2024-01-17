import { injectable } from "inversify";
import { makeObservable } from "mobx";
import * as Tone from "tone";
import * as d3 from "d3";

const logScale = d3.scaleLog().domain([0, 20000]).range([0, 800]);

// interface Band {
//   type
// }

@injectable()
export class Equalizer {
  low: Tone.Filter;
  high: Tone.Filter;
  bands: Tone.Filter[] = [];
  input: Tone.ToneAudioNode;
  destination: Tone.ToneAudioNode;

  constructor(input: Tone.ToneAudioNode, destination: Tone.ToneAudioNode) {
    this.input = input;

    this.low = new Tone.Filter();
    this.low.type = "lowshelf";

    const mid = new Tone.Filter();
    mid.type = "peaking";
    this.bands.push(mid);

    this.high = new Tone.Filter();
    this.high.type = "highshelf";

    this.destination = destination;

    this.chain();

    makeObservable(this);
  }

  chain = () => {
    this.input.disconnect();
    this.input.chain(this.low, ...this.bands, this.high, this.destination);
  };
}
