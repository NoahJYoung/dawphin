import { action, makeObservable, observable } from 'mobx';
import * as Tone from 'tone';
import { v4 as uuidv4 } from 'uuid';

export class Clip {
  id: string;
  endTicks: number = 0;
  samples: number = 0;
  durationTicks: number = 0;

  constructor(
    public audioSrc: string,
    public startTicks: number,
    public isSelected: boolean = false,
    public player = new Tone.Player()
  ) {
    this.id = uuidv4();
    this.player.toDestination();
    this.loadAudio();
    makeObservable(this, {
      startTicks: observable,
      endTicks: observable,
      samples: observable,
      setPosition: action.bound,
    });
  }

  play = () => {
    this.player.start();
  }

  loadAudio = async () => {
    await this.player.load(this.audioSrc);
    const transport = Tone.getTransport();
    const durationInSeconds = this.player.buffer.duration;
    const bpm = transport.bpm.value;
    const ticksPerBeat = transport.PPQ;
    const durationInBeats = durationInSeconds / (60 / bpm);
    this.durationTicks = Math.round(durationInBeats * ticksPerBeat);
    this.endTicks = this.startTicks + this.durationTicks;

    const samples = Tone.context.sampleRate * this.player.buffer.duration
    this.samples = samples;
  }

  seek(time: number) {
    this.player.seek(time);
  }

  setPosition(startTicks: number) {
    this.startTicks = startTicks;
    this.endTicks = this.startTicks + this.durationTicks;
  }
}