import { injectable } from "inversify";
import * as Tone from "tone";

@injectable()
export class Keyboard {
  public osc: Tone.Oscillator = new Tone.Oscillator(1).set({ volume: -50 });
  constructor(
    public synth: Tone.PolySynth = new Tone.PolySynth(
      Tone.FMSynth
    ).toDestination()
  ) {}
}
