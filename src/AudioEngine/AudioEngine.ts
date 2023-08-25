import { Track } from './Track';
import { action, makeObservable, observable } from 'mobx';
import * as Tone from 'tone';
import { Clip } from './Track/Clip';
import audioBufferToWav from 'audiobuffer-to-wav';

export class AudioEngine {
  zoomLevels: number[] = [32, 64, 128, 256, 512, 1024, 2048, 4092];
  zoomIndex: number = 4;
  samplesPerPixel: number = this.zoomLevels[this.zoomIndex];
  state: string = 'stopped';
  bpm: number = Tone.getTransport().bpm.value;
  timeSignature = Tone.getTransport().timeSignature;
  currentTrackId = 1;
  totalMeasures: number = 200;
  selectedClips: Clip[] = [];
  scrollXOffsetPixels: number = 0;
  selectedTracks: Track[] = observable.array([]);
  metronomeActive: boolean = false;
  metronome: Tone.PluckSynth | null = null;

  constructor(
    public tracks: Track[] = observable.array([]),
    public cursorPosition: number = 0,
    public audioCtx = Tone.getContext(),
  ) {
    makeObservable(this, {
      metronomeActive: observable,
      setMetronome: action.bound,
      tracks: observable,
      samplesPerPixel: observable,
      bpm: observable,
      selectedTracks: observable,
      setBpm: action.bound,
      timeSignature: observable,
      setTimeSignature: action.bound,
      setZoom: action.bound,
      createTrack: action.bound,
      getSelectedTracks: action.bound,
      deleteSelectedTracks: action.bound,
      getSelectedClips: action.bound,
      moveSelectedClips: action.bound,
      deleteSelectedClips: action.bound,
    });
    // const baseContext = new AudioContext({ sampleRate: 44100, latencyHint: 'interactive' });
    // const context = new Tone.Context(baseContext);
    // Tone.setContext(context);
    this.metronome = new Tone.PluckSynth().toDestination();
    this.createTrack();
  }

  setMetronome(value: boolean) {
    this.metronomeActive = value;
  };

  toggleMetronome = () => {
    this.setMetronome(!this.metronomeActive);
  }

  setZoom(direction: 'zoomIn' | 'zoomOut') {
    if (direction === 'zoomOut') {
      this.zoomIndex < this.zoomLevels.length -1 ? this.zoomIndex++ : this.zoomIndex = this.zoomLevels.length -1;
    } else {
      this.zoomIndex > 0 ? this.zoomIndex-- : this.zoomIndex = 0;
    }
    this.samplesPerPixel = this.zoomLevels[this.zoomIndex];
  }

  setBpm(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
    this.bpm = Tone.getTransport().bpm.value;
  }

  setTimeSignature(value: number | number[]) {
    Tone.getTransport().timeSignature = value;
    this.timeSignature = Tone.getTransport().timeSignature;
  }

  createTrack() {
    const newTrack = new Track(this.currentTrackId, `Track ${this.tracks.length + 1}`);
    this.tracks.push(newTrack);
    this.currentTrackId += 1;
  }

  getSelectedTracks() {
    this.selectedTracks = observable.array([...this.tracks].filter(track => !!track.selected));
  }

  deleteSelectedTracks() {
    this.getSelectedTracks();
    this.selectedTracks.forEach(track => track.channel.dispose())
    const selectedTrackIds = this.selectedTracks.map(track => track.id);
    this.tracks = this.tracks.filter(track => !selectedTrackIds.includes(track.id));
    this.selectedTracks = []
  }

  getSelectedClips() {
    const selectedClips: Clip[] = [];
    this.tracks.forEach(track => {
      track.clips.forEach((clip) => {
        if (clip.isSelected) {
          selectedClips.push(clip);
        }
      });
    });

    this.selectedClips = selectedClips;
  }

  moveSelectedClips(samples: number, direction: 'right' | 'left') {
    this.getSelectedClips();
    if (direction === 'right') {
      this.selectedClips.forEach(clip => clip.setPosition(clip.start.toSamples() + samples))
    } else {
      if (!this.selectedClips.find(clip => clip.start.toSamples() === 0)) {
        this.selectedClips.forEach(clip => clip.setPosition(clip.start.toSamples() - samples))
      }
    }
  }

  deleteSelectedClips() {
    this.getSelectedClips();
    const clipIds = this.selectedClips.map(clip => clip.id);
    this.tracks.forEach(track => {
      track.setClips(track.clips.filter((clip) => !clipIds.includes(clip.id)))
    });
    this.selectedClips.forEach(clip => clip.deleteClip());
  }

  splitSelectedClipsAtPlayhead = () => {
    this.getSelectedClips();
    this.selectedClips.forEach(clip => {
      const currentTrack = this.tracks.find(track => track.id === clip.trackId);
      const data = clip.split();
      data && data.clips.forEach((clipData) => {
        const buffer = clipData.buffer.get();
        if (buffer) {
          const blob = new Blob([audioBufferToWav(buffer)], { type: "audio/wav" });
          currentTrack?.addClip(URL.createObjectURL(blob),  clipData.start.toSamples());
        }
      })
      currentTrack?.setClips(currentTrack.clips.filter(clip => clip.id !== data?.oldId));   
    })
  }

  deselectClips() {
    this.getSelectedClips();
    this.selectedClips.forEach(clip => clip.setSelect(false))
    this.selectedClips = [];
  }

  setPosition = (time: Tone.TimeClass, redraw: () => void) => {
    const transport = Tone.getTransport();
    if (this.state === 'playing') {
      this.pause();
      transport.ticks = time.toTicks();
      redraw();
      this.play();
    } else {
      transport.ticks = time.toTicks();
      redraw();
    }
  }

  play = () => {
    if (this.metronomeActive) {
      
      Tone.Transport.scheduleRepeat(time => {
        this.metronome?.triggerAttack('C5', Tone.now())
      }, "4n");
    }
    this.state = 'playing';
    Tone.getTransport().start();
    this.tracks.forEach(track => track.play())
  }

  stop = () => {
    this.state = 'stopped';
    Tone.getTransport().stop();
    this.tracks.forEach(track => track.stop())
  }

  pause = () => {
    this.state = 'paused';
    this.tracks.forEach(track => track.stop())
    Tone.getTransport().pause();
  }

  startTone = () => {
    Tone.start();
  }
}