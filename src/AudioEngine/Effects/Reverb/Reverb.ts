/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import { v4 as uuid } from "uuid";
import * as Tone from "tone";
import { BaseEffectType, EffectKeys } from "../types";
import { plate, hall } from "src/assets/sounds/reverbs";

@injectable()
export class Reverb implements BaseEffectType {
  plateConvolver = new Tone.Convolver(plate);
  hallConvolver = new Tone.Convolver(hall);
  convolvers = [this.plateConvolver, this.hallConvolver];
  activeConvolver = this.convolvers[this.activeConvolverIndex];
  public name: EffectKeys = EffectKeys.reverb;
  public input = new Tone.Channel();
  private bypass = new Tone.Channel();
  private convolverOutput = new Tone.Channel();
  public output = new Tone.Channel();

  constructor(
    public id = uuid(),
    public activeConvolverIndex = 0,
    public wet = 1
  ) {
    makeAutoObservable(this);
    this.init();
  }

  init = () => {
    this.convolvers.forEach((convolver) => {
      convolver.set({ normalize: false });
    });
    this.activeConvolver = this.convolvers[this.activeConvolverIndex];
    this.setWet(this.wet);
    this.connect();
  };

  connect = () => {
    this.input.chain(this.activeConvolver, this.convolverOutput, this.output);
    this.input.chain(this.bypass, this.output);
  };

  disconnect = () => {
    this.input.disconnect();
    this.bypass.disconnect();
    this.convolverOutput.disconnect();
    this.activeConvolver.disconnect();
  };

  toggleActiveConvolver = () => {
    this.disconnect();
    this.activeConvolverIndex = this.activeConvolverIndex === 0 ? 1 : 0;
    this.activeConvolver = this.convolvers[this.activeConvolverIndex];
    this.connect();
  };

  setWet = (wet: number) => {
    const clampedWet = Math.max(0, Math.min(1, wet));
    this.bypass.volume.linearRampTo(Tone.gainToDb(1 - clampedWet), 0.01);
    this.convolverOutput.volume.linearRampTo(Tone.gainToDb(clampedWet), 0.01);
    this.wet = clampedWet;
  };

  offlineRender = () => {
    const input = new Tone.Channel();
    const output = new Tone.Channel(20);
    console.log("bypass: ", this.bypass.volume.value);
    console.log("convolverOutput: ", this.convolverOutput.volume.value);

    const bypass = new Tone.Channel(this.bypass.volume.value);
    const convolverOutput = new Tone.Channel(this.convolverOutput.volume.value);
    const convolver = new Tone.Convolver(
      this.activeConvolverIndex === 0 ? plate : hall
    );
    input.chain(convolver, convolverOutput, output);
    input.chain(bypass, output);
    return { input, output };
  };
}
