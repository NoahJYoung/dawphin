import * as Tone from "tone";

export class Keyboard {
  public osc: Tone.Oscillator = new Tone.Oscillator(1).set({ volume: -50 });
  constructor(public synth: Tone.PolySynth<Tone.AMSynth>) {}
}
