import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { Frequency, Time } from "tone/build/esm/core/type/Units";

@injectable()
export class Keyboard {
  public mode: "sampler" | "synth" = "synth";
  public osc = new Tone.Oscillator(1).set({ volume: -50 });
  public baseOctave: number = 3;
  public baseUrl: string = "src/assets/sounds/keys/";
  private synth = new Tone.Channel();
  private output = new Tone.Channel();
  private sampler = new Tone.Sampler({
    urls: {
      F2: "F2.mp3",
      G2: "G2.mp3",
      A2: "A2.mp3",
      B2: "B2.mp3",
      C3: "C3.mp3",
      D3: "D3.mp3",
      E3: "E3.mp3",
      F3: "F3.mp3",
      G3: "G3.mp3",
      A3: "A3.mp3",
      B3: "B3.mp3",
      C4: "C4.mp3",
      D4: "D4.mp3",
      E4: "E4.mp3",
    },
    baseUrl: this.baseUrl,
  });

  public triangleSynth = new Tone.PolySynth(Tone.Synth)
    .set({ oscillator: { type: "triangle" } })
    .connect(this.synth);

  public squareSynth = new Tone.PolySynth(Tone.Synth)
    .set({ oscillator: { type: "square" } })
    .connect(this.synth);

  public sineSynth = new Tone.PolySynth(Tone.Synth)
    .set({ oscillator: { type: "sine" } })
    .connect(this.synth);

  private synths = [this.triangleSynth, this.squareSynth, this.sineSynth];

  public volume = this.output.volume.value;

  public triangleVolume = this.triangleSynth.volume.value;

  public squareVolume = this.squareSynth.volume.value;

  public sineVolume = this.sineSynth.volume.value;

  constructor() {
    makeAutoObservable(this);
    this[this.mode].connect(this.output);
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

  public setKeyboardMode = (mode: "synth" | "sampler") => {
    this[this.mode].disconnect();
    this.mode = mode;
    this[this.mode].connect(this.output);
  };

  public setSamplerBaseUrl = (url: string) => {
    this.baseUrl = url;
    this.sampler.set({ baseUrl: this.baseUrl });
  };

  public setBaseOctave = (octave: number) => {
    if (octave >= 0 && octave <= 5) {
      this.baseOctave = octave;
    }
  };

  public triggerAttack = (note: Frequency | Frequency[], time?: Time) => {
    if (this.mode === "synth") {
      this.synths.forEach((synth) => synth.triggerAttack(note, time));
      return;
    }
    this.sampler.triggerAttack(note, time);
  };

  public triggerRelease = (note: Frequency | Frequency[], time?: Time) => {
    if (this.mode === "synth") {
      this.synths.forEach((synth) => synth.triggerRelease(note, time));
      return;
    }
    this.sampler.triggerRelease(note, time);
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
