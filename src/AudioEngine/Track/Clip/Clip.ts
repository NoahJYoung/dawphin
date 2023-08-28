import { action, makeObservable, observable } from 'mobx';
import * as Tone from 'tone';
import { v4 as uuidv4 } from 'uuid';
import { Track } from '../Track';

export class Clip {
  id: string;
  end: Tone.TimeClass | null = null;
  duration: Tone.TimeClass | null = null;
  samples: number = 0;
  waveformData: any;
  normalized: boolean = false;

  constructor(
    public track: Track,
    public audioSrc: string,
    public audioBuffer: Tone.ToneAudioBuffer,
    public start: Tone.TimeClass,
    public isSelected: boolean = false,
    public player = new Tone.Player(),
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

  play = (time: number, seekTime?: number) => {
    this.player.start(time, seekTime);
  }

  stop = () => {
    this.player.stop();
  }

  loadAudio = async () => {
    await this.player.load(this.audioSrc);
    this.setDuration(Tone.Time(this.player.buffer.duration, 's'));
    this.setEnd(Tone.Time(this.start.toSeconds() + this.player.buffer.duration, 's'));
  }

  setSamples(samples: number) {
    this.samples = samples;
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

  deleteClip() {
    URL.revokeObjectURL(this.audioSrc);
    this.player.dispose();
  }

  split() {
    const transportSeconds = Tone.getTransport().seconds;
    const cursorIsOverClip = transportSeconds > this.start.toSeconds() && transportSeconds < (this.end?.toSeconds() || 0);
    if (cursorIsOverClip && this.isSelected) {
      const clipRelativeTransportseconds = transportSeconds - this.start.toSeconds();
      const clipOneBuffer = this.audioBuffer.slice(0, clipRelativeTransportseconds);
      const clipTwoBuffer = this.audioBuffer.slice(clipRelativeTransportseconds, this.duration?.toSeconds());
      this.deleteClip();
      return {
        clips: [
          {
            start: Tone.Time(this.start.toSeconds() / Tone.getContext().sampleRate),
            buffer: clipOneBuffer,
          },
          {
            start: Tone.Time(transportSeconds / Tone.getContext().sampleRate),
            buffer: clipTwoBuffer,
          },
        ],
        oldId: this.id,
      }
    }

    return null;
  }
}