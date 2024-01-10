import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { Frequency, Time } from "tone/build/esm/core/type/Units";

@injectable()
export class Keyboard {
  public osc: Tone.Oscillator = new Tone.Oscillator(1).set({ volume: -50 });
  public baseOctave: number = 3;
  private output = new Tone.Channel();

  public triangleSynth = new Tone.PolySynth(Tone.Synth)
    .set({ oscillator: { type: "triangle" } })
    .connect(this.output);

  public squareSynth = new Tone.PolySynth(Tone.Synth)
    .set({ oscillator: { type: "square" } })
    .connect(this.output);

  public sineSynth = new Tone.PolySynth(Tone.Synth)
    .set({ oscillator: { type: "sine" } })
    .connect(this.output);

  private synths = [this.triangleSynth, this.squareSynth, this.sineSynth];

  public volume = this.output.volume.value;

  public triangleVolume = this.triangleSynth.volume.value;

  public squareVolume = this.squareSynth.volume.value;

  public sineVolume = this.sineSynth.volume.value;

  constructor() {
    makeAutoObservable(this);
    this.output.toDestination();
  }

  public connect = (node: Tone.ToneAudioNode) => {
    this.output.connect(node);
  };

  public disconnect = () => {
    this.output.disconnect();
  };

  public toDestination = () => {
    this.output.toDestination();
  };

  public setBaseOctave = (octave: number) => {
    if (octave >= 0 && octave <= 5) {
      this.baseOctave = octave;
    }
  };

  public triggerAttack = (note: Frequency | Frequency[], time?: Time) => {
    this.synths.forEach((synth) => synth.triggerAttack(note, time));
  };

  public triggerRelease = (note: Frequency | Frequency[], time?: Time) => {
    this.synths.forEach((synth) => synth.triggerRelease(note, time));
  };

  public setVolume = (volume: number) => {
    this.output.volume.value = volume;
    this.volume = this.output.volume.value;
  };

  public setTriangleVolume = (volume: number) => {
    this.triangleSynth.volume.value = volume;
    this.triangleVolume = this.triangleSynth.volume.value;
  };

  public setSquareVolume = (volume: number) => {
    this.squareSynth.volume.value = volume;
    this.squareVolume = this.squareSynth.volume.value;
  };

  public setSineVolume = (volume: number) => {
    this.sineSynth.volume.value = volume;
    this.sineVolume = this.sineSynth.volume.value;
  };
}
