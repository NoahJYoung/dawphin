import { action, makeObservable, observable } from 'mobx';
import * as Tone from 'tone';
import { v4 as uuidv4 } from 'uuid';

export class Clip {
  id: string;
  end: Tone.TimeClass | null = null;
  duration: Tone.TimeClass | null = null;
  samples: number = 0;
  waveformData: any;
  // audioBuffer: Tone.ToneAudioBuffer | null = null;

  constructor(
    public trackId: number,
    public audioSrc: string,
    public audioBuffer: Tone.ToneAudioBuffer,
    public start: Tone.TimeClass,
    public isSelected: boolean = false,
    public player = new Tone.Player()
  ) {
    makeObservable(this, {
      isSelected: observable,
      start: observable,
      end: observable,
      setEnd: action.bound,
      duration: observable,
      setDuration: action.bound,
      setPosition: action.bound,
      setSelect: action.bound,
    });
    this.id = uuidv4();
    this.player.toDestination();
    this.loadAudio();
  }

  play = () => {
    this.player.start();
  }

  loadAudio = async () => {
    await this.player.load(this.audioSrc);
    this.setDuration(Tone.Time(this.player.buffer.duration, 's'));
    this.setEnd(Tone.Time(this.start.toSeconds() + this.player.buffer.duration, 's'))
  }

  setSamples(samples: number) {
    this.samples = samples;
  }

  seek(time: number) {
    this.player.seek(time);
  }

  setPosition(samples: number) {
    if (this.duration && this.end) {
      if (samples > 0) {
        this.setStart(Tone.Time(samples, 'samples'));
        this.setEnd(Tone.Time(this.start.toSeconds() + this.duration.toSeconds(), 's'));
      } else {
        this.setStart(Tone.Time(0, 'samples'))
        this.setEnd(Tone.Time(this.start.toSeconds() + this.duration.toSeconds(), 's'));
      }
    }
  }

  setStart(time: Tone.TimeClass) {
    this.start = time;
  }

  setEnd(time: Tone.TimeClass) {
    this.end = time;
  }

  setDuration(time: Tone.TimeClass) {
    this.duration = time;
  }

  setSelect(value: boolean) {
    this.isSelected = value;
  }

  setAudioBuffer(data: any) {
    this.audioBuffer = data
  }
}