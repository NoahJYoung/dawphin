import { Clip } from "./Clip";
import * as Tone from 'tone';
import { action, makeObservable, observable } from 'mobx';

export class Track {
  constructor(
    public id: number,
    public name: string,
    public clips: Clip[] = observable.array([]),
    public muted: boolean = false,
    public color: string = 'grey',
    public selected: boolean = false,
    public channel: Tone.Channel = new Tone.Channel(),
  ) {
    makeObservable(this, {
      name: observable,
      clips: observable.deep,
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
    const transport = Tone.getTransport();
    const ticks = Tone.getTransport().ticks;
    this.clips.forEach(clip => {
      if (
        ticks >= clip.start.toTicks() &&
        ticks < clip.end?.toTicks()!
      ) {
        const seekTime = (transport.seconds - clip.start.toSeconds());
        clip.play();
        clip.seek(seekTime);
      } else {
        transport.scheduleOnce(clip.play, clip.start.toSeconds());
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

  addClip(src: string, startSeconds: number) {
    console.log(this.clips)
    const buffer = new Tone.ToneAudioBuffer(src)
    const clip = new Clip(this.id, src, buffer, Tone.Time(startSeconds, 's'));
    this.clips.push(clip);
    console.log(this.clips)
  }

  stop() {
    this.clips.forEach(clip => clip.player.stop())
  }
}