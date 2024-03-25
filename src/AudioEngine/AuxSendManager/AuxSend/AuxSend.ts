import * as Tone from "tone";
import { makeAutoObservable } from "mobx";
import { injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { Track } from "src/AudioEngine/Track";

@injectable()
export class AuxSend {
  private channel = new Tone.Channel();

  constructor(
    public from: Track,
    public to: Track,
    public volume: number,
    public id: string = uuidv4()
  ) {
    makeAutoObservable(this);
    this.init();
  }

  init = () => {
    this.connect();
    this.channel.set({ volume: this.volume });
  };

  connect = () => {
    this.from.auxOut.chain(this.channel, this.to.auxIn);
  };

  setVolume = (volume: number) => {
    this.channel.set({ volume });
    this.volume = volume;
  };

  destroy = () => {
    this.from.auxOut.disconnect(this.channel);
    this.channel.disconnect();
    this.channel.dispose();
  };
}
