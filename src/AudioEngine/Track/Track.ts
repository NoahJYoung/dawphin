import { Clip } from "./Clip";
import { action, makeObservable, observable } from 'mobx';
import { AudioEngine } from "..";
import * as Tone from 'tone';

export class Track {
  public volume: number | null = null;
  public pan: number | null = null;
  public solo: boolean = false;
  public active: boolean = false;
  public leftMeter = new Tone.Meter(0.75);
  public rightMeter = new Tone.Meter(0.75);
  public splitter = new Tone.Split();
  public recorder = new Tone.Recorder();
  public placeholderClipStart: Tone.TimeClass | null = null; 

  constructor(
    public audioEngine: AudioEngine,
    public id: number,
    public name: string,
    public clips: Clip[] = observable.array([]),
    public color: string = 'rgb(175, 175, 175)',
    public selected: boolean = false,
    public channel: Tone.Channel = new Tone.Channel(),
    public muted = channel.mute,
  ) {
    makeObservable(this, {
      name: observable,
      volume: observable,
      pan: observable,
      clips: observable,
      color: observable,
      muted: observable,
      active: observable,
      placeholderClipStart: observable,
      setPlaceholderClipStart: action.bound,
      setActive: action.bound,
      setMuted: action.bound,
      setVolume: action.bound,
      setPan: action.bound,
      addClip: action.bound,
      setClips: action.bound,
      setName: action.bound,
      setColor: action.bound,
      selected: observable,
      select: action.bound,
      deselect: action.bound,
      toggleSelect: action.bound,
    });

    this.setPan(0);
    this.channel.connect(this.splitter);
    this.splitter.connect(this.leftMeter, 0);
    this.splitter.connect(this.rightMeter, 1);
    this.channel.toDestination();
  }

  play() {
    if (this.active && this.audioEngine.state === 'recording') {
      return;
    }
    const transport = Tone.getTransport();
    this.clips.forEach(clip => {
      const seekTime = (transport.seconds - clip.start.toSeconds());
      if (clip.end && transport.seconds > clip.start.toSeconds() && transport.seconds < clip.end?.toSeconds()) {
        clip.play(Tone.now(), seekTime)
      } else {
        clip.schedule();
      }
    });
  }

  setPlaceholderClipStart = (time: Tone.TimeClass | null) => {
    this.placeholderClipStart = time;
  }

  record = async () => {
    const startSeconds = Tone.getTransport().seconds;
    this.recorder.start();
    this.setPlaceholderClipStart(Tone.Time(startSeconds))
    Tone.getTransport().once('stop', async () => {
      const blob = await this.recorder.stop();
      const url = URL.createObjectURL(blob);
      this.setPlaceholderClipStart(null)
      this.addClip(url, startSeconds);
    });
  }
  

  setVolume = (value: number) => {
    this.channel.set({ volume: Math.round(value) });
    this.volume = Math.round(this.channel.volume.value);
  }

  setPan = (value: number) => {
    this.channel.set({ pan: value / 100 });
    this.pan = this.channel.pan.value * 100
  }

  setMuted = (state: boolean) => {
    this.channel.set({ mute: state });
    this.muted = this.channel.mute;
  }

  setActive = (newState: boolean) => {
    this.active = newState;
  }

  toggleActive = () => {
    this.setActive(!this.active);
  }

  stop() {
    this.clips.forEach(clip => clip.stop())
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

  selectAllClips = () => {
    this.clips.forEach(clip => clip.setSelect(true))
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
    this.muted = this.channel.mute;
  }

  addClip(src: string, startSeconds: number) {
    const buffer = new Tone.ToneAudioBuffer(src)
    const clip = new Clip(this, src, buffer, Tone.Time(startSeconds, 's'));
    this.clips.push(clip);
  }

  setClips(clips: Clip[]) {
    this.clips = clips;
  }
}