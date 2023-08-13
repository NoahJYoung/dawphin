import { Track } from './Track';
import { action, makeObservable, observable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import * as Tone from 'tone';

export class AudioEngine {
  samplesPerTick: number = Tone.context.sampleRate / Tone.Transport.PPQ;
  zoomLevels: number[] = [512, 1024, 2048, 4092];
  zoomIndex: number = 0;
  samplesPerPixel: number = this.zoomLevels[this.zoomIndex];
  state: string = 'stopped';

  constructor(
    public transport = Tone.getTransport(),
    public tracks: Track[] = [],
    public selectedTracks: Track[] = [],
    public cursorPosition: number = 0,
    public audioCtx = Tone.getContext(),
  ) {
    makeObservable(this, {
      tracks: observable,
      samplesPerPixel: observable,
      setZoom: action.bound,
      createTrack: action.bound,
      getSelectedTracks: action.bound,
      deleteSelectedTracks: action.bound,
    });
  }

  setZoom(direction: 'zoomIn' | 'zoomOut') {
    if (direction === 'zoomOut') {
      this.zoomIndex < this.zoomLevels.length -1 ? this.zoomIndex++ : this.zoomIndex = this.zoomLevels.length -1;
    } else {
      this.zoomIndex > 0 ? this.zoomIndex-- : this.zoomIndex = 0;
    }
    this.samplesPerPixel = this.zoomLevels[this.zoomIndex];
  }

  setBpm(value: number) {
    this.transport.bpm.value = value
  }

  setTimeSignature(value: number | number[]) {
    this.transport.timeSignature = value;
  }

  createTrack() {
    const newTrack = new Track(uuidv4(), `Track ${this.tracks.length + 1}`);
    this.tracks.push(newTrack);
  }

  getSelectedTracks() {
    this.selectedTracks = [...this.tracks].filter(track => !track.selected);
  }

  deleteSelectedTracks() {
    this.getSelectedTracks();
    this.selectedTracks.forEach(track => track.channel.dispose())
    const selectedTrackIds = this.selectedTracks.map(track => track.id);
    this.tracks = this.tracks.filter(track => selectedTrackIds.includes(track.id));
    this.selectedTracks = []
  }

  setPosition = (ticks: number, redraw: () => void) => {
    if (this.state === 'playing') {
      this.transport.ticks = ticks;
      redraw();
      this.play();
    } else {
      this.transport.ticks = ticks;
      redraw();
    }
  }

  play = () => {
    this.state = 'playing';
    this.transport.start();
    this.tracks.forEach(track => track.play())
  }

  stop = () => {
    this.state = 'stopped';
    this.transport.stop();
    this.tracks.forEach(track => track.stop())
  }

  pause = () => {
    this.state = 'paused';
    this.transport.pause();
    this.tracks.forEach(track => track.stop())
  }

  startTone = () => {
    Tone.start();
  }
}