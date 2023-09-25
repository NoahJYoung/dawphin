import { observable, makeObservable, action } from "mobx";
import * as Tone from "tone";

export class ToneEQ3 {
  public EQ3: Tone.EQ3 = new Tone.EQ3();
  public low: number = Number(this.EQ3.low.value);
  public mid: number = Number(this.EQ3.mid.value);
  public high: number = Number(this.EQ3.high.value);
  public lowFrequency: number = Number(this.EQ3.lowFrequency.value);
  public highFrequency: number = Number(this.EQ3.highFrequency.value);
  public Q: number = Number(this.EQ3.Q.value);

  constructor() {
    makeObservable(this, {
      EQ3: observable,
      low: observable,
      mid: observable,
      high: observable,
      lowFrequency: observable,
      highFrequency: observable,
      Q: observable,
      setLow: action.bound,
      setMid: action.bound,
      setHigh: action.bound,
      setLowFrequency: action.bound,
      setHighFrequency: action.bound,
      setQ: action.bound,
    });
  }

  setLow = (value: number) => {
    this.low = value;
  };

  setMid = (value: number) => {
    this.mid = value;
  };

  setHigh = (value: number) => {
    this.high = value;
  };

  setLowFrequency = (value: number) => {
    this.lowFrequency = value;
  };

  setHighFrequency = (value: number) => {
    this.highFrequency = value;
  };

  setQ = (value: number) => {
    this.Q = value;
  };

  connect = (node: Tone.ToneAudioNode) => {
    this.EQ3.connect(node);
  };

  disconnect = (node: Tone.ToneAudioNode) => {
    this.EQ3.disconnect(node);
  };
}
