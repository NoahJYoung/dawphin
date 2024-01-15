import { injectable } from "inversify";
import { action, makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { blobToBuffer } from "../helpers";

export interface Pad {
  player: Tone.Player;
  volume: number;
  loaded: boolean;
}

@injectable()
export class Sampler {
  public active: boolean = false;
  public output: Tone.Channel = new Tone.Channel();
  public osc: Tone.Oscillator = new Tone.Oscillator(1).set({ volume: -50 });
  // TODO: REFACTOR: use Tone.Players() ?
  public pads: Record<number, Pad> = {
    1: { player: new Tone.Player(), volume: 0, loaded: false },
    2: { player: new Tone.Player(), volume: 0, loaded: false },
    3: { player: new Tone.Player(), volume: 0, loaded: false },
    4: { player: new Tone.Player(), volume: 0, loaded: false },
    5: { player: new Tone.Player(), volume: 0, loaded: false },
    6: { player: new Tone.Player(), volume: 0, loaded: false },
    7: { player: new Tone.Player(), volume: 0, loaded: false },
    8: { player: new Tone.Player(), volume: 0, loaded: false },
    9: { player: new Tone.Player(), volume: 0, loaded: false },
  };

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private init = () => {
    Object.keys(this.pads).forEach((pad) =>
      this.pads[parseInt(pad)].player.connect(this.output)
    );
    this.output.toDestination();
  };

  @action
  private setLoaded = (pad: number) => {
    this.pads[pad].loaded = this.pads[pad].player.loaded;
  };

  async loadAudio(pad: number, audio: Blob) {
    const buffer = await blobToBuffer(audio);
    this.pads[pad].player.buffer = buffer;
    this.setLoaded(pad);
  }

  attack(pad: number) {
    const activePad = this.pads[pad]?.player;
    if (activePad?.loaded) {
      this.active = true;
      activePad.start();
    }
  }

  release(pad: number) {
    const activePad = this.pads[pad]?.player;
    if (activePad?.loaded) {
      activePad.stop();
      this.active = false;
    }
  }
}
