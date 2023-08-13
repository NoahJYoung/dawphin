import { Clip } from "./Clip";
import * as Tone from 'tone';
import { action, makeObservable, observable } from 'mobx';

export class Track {
  constructor(
    public id: string,
    public name: string,
    public clips: Clip[] = [],
    public muted: boolean = false,
    public color: string = 'grey',
    public selected: boolean = false,
    public channel: Tone.Channel = new Tone.Channel(),
  ) {
    makeObservable(this, {
      name: observable,
      clips: observable,
      addClip: action.bound,
      setName: action.bound,
      setColor: action.bound,
      selected: observable,
      select: action.bound,
      deselect: action.bound,
      toggleSelect: action.bound,
    });
  }

  play() {
    const cursorTicks = Tone.getTransport().ticks;
    this.clips.forEach(clip => {
      if (
        cursorTicks >= clip.startTicks &&
        cursorTicks < clip.endTicks!
      ) {
        const seekTime = ((cursorTicks - clip.startTicks) / Tone.Transport.PPQ) / 2;
        clip.play();
        clip.seek(seekTime);
      } else {
        Tone.Transport.scheduleOnce(clip.play, (clip.startTicks / Tone.Transport.PPQ) / 2);
      }
    });
  }

  setName(value: string) {
    this.name = value;
  }

  setColor(color: string) {
    this.color = color
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }

  toggleSelect() {
    this.selected =  !this.selected
  }

  mute() {
    this.channel.mute = true
  }

  unmute() {
    this.channel.mute = false;
  }

  toggleMute() {
    this.channel.mute = !this.channel.mute;
  }

  addClip(src: string, ticks: number) {
    const clip = new Clip(src, ticks)
    this.clips.push(clip)
  }

  stop() {
    this.clips.forEach(clip => clip.player.stop())
  }
}