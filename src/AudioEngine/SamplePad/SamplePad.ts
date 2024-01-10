import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import * as Tone from "tone";

@injectable()
export class SamplePad {
  public active: boolean = false;
  public players: Record<number, Tone.Player> = {
    1: new Tone.Player(),
    2: new Tone.Player(),
    3: new Tone.Player(),
    5: new Tone.Player(),
    6: new Tone.Player(),
    7: new Tone.Player(),
    8: new Tone.Player(),
    9: new Tone.Player(),
  };

  constructor() {
    makeAutoObservable(this);
  }

  async loadAudio(pad: number, audioSrc: string) {
    await this.players[pad].load(audioSrc);
  }

  attack(pad: number) {
    const activePad = this.players[pad];
    if (activePad.loaded) {
      this.active = true;
      activePad.start();
    }
  }

  release(pad: number) {
    const activePad = this.players[pad];
    if (activePad.loaded) {
      activePad.stop();
      this.active = false;
    }
  }
}
