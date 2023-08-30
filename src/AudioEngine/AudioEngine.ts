import { Track } from './Track';
import { action, makeObservable, observable } from 'mobx';
import * as Tone from 'tone';
import { Clip } from './Track/Clip';
import audioBufferToWav from 'audiobuffer-to-wav';

interface ClipboardItem {
  data: Blob
  start: Tone.TimeClass
}

export class AudioEngine {
  zoomLevels: number[] = [32, 64, 128, 256, 512, 1024, 2048, 4092];
  clipboard: (ClipboardItem | null)[] = [];
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
  snap: boolean = false;
  metronomeActive: boolean = true;
  metronome: Tone.PluckSynth | null = null;
  quantizationValues: string[] = ['16n', '16n', '8n', '8n', '4n', '4n', '1n', '1n']

  constructor(
    public tracks: Track[] = observable.array([]),
    public cursorPosition: number = 0,
    public audioCtx = Tone.getContext(),
  ) {
    makeObservable(this, {
      state: observable,
      setState: action.bound,
      metronomeActive: observable,
      setMetronome: action.bound,
      snap: observable,
      setSnap: action.bound,
      tracks: observable,
      samplesPerPixel: observable,
      bpm: observable,
      selectedTracks: observable,
      selectedClips: observable,
      setBpm: action.bound,
      timeSignature: observable,
      setTimeSignature: action.bound,
      setZoom: action.bound,
      createTrack: action.bound,
      getSelectedTracks: action.bound,
      deleteSelectedTracks: action.bound,
      getSelectedClips: action.bound,
      setSelectedClips: action.bound,
      moveSelectedClips: action.bound,
      deleteSelectedClips: action.bound,
    });
    // const baseContext = new AudioContext({ sampleRate: 44100, latencyHint: 'interactive' });
    // const context = new Tone.Context(baseContext);
    // Tone.setContext(context);
    this.metronome = new Tone.PluckSynth().toDestination();
    this.setupMetronome();
  }

  setState(newState: 'playing' | 'stopped' | 'paused' | 'recording') {
    this.state = newState;
  }

  setMetronome(value: boolean) {
    this.metronomeActive = value;
  };

  setupMetronome = () => {
    Tone.getTransport().scheduleRepeat(time => {
      this.metronome?.triggerAttack('C5', time)
    }, "4n");
    // this.metronomeEventId = metronomeEventId;
    this.createTrack();
  }

  toggleMetronome = () => {
    this.setMetronome(!this.metronomeActive);
    if (!this.metronomeActive) {
      this.metronome!.disconnect()
    } else {
      this.metronome!.toDestination()
    }
  }

  setSnap = (value: boolean) => {
    this.snap = value;
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
    const newTrack = new Track(this, this.currentTrackId, `Track ${this.tracks.length + 1}`);
    this.tracks.push(newTrack);
    this.currentTrackId += 1;
  }

  getSelectedTracks() {
    this.selectedTracks = observable.array([...this.tracks].filter(track => !!track.selected));
  }

  deselectAllTracks = () => {
    this.tracks.forEach(track => track.deselect())
  }

  deleteSelectedTracks() {
    this.getSelectedTracks();
    this.selectedTracks.forEach(track => track.channel.dispose())
    const selectedTrackIds = this.selectedTracks.map(track => track.id);
    this.tracks = this.tracks.filter(track => !selectedTrackIds.includes(track.id));
    this.selectedTracks = []
  }
  
  setSelectedClips(clips: Clip[]) {
    this.selectedClips = observable.array(clips);
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

    this.setSelectedClips(selectedClips);
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

  quantizeSelectedClips() {
    this.selectedClips.forEach(clip => {
      const quantizedTime = Tone.Time(clip.start.quantize(this.quantizationValues[this.zoomIndex])).toSamples();
      clip.setPosition(quantizedTime)
    })
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
      const currentTrack = clip.track;
      const data = clip.split();
      data && data.clips.forEach((clipData, i) => {
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
    this.setSelectedClips([])
  }

  copyClips = () => {
    this.clipboard = this.selectedClips.map(clip => {
      const buffer = clip.audioBuffer.get();
      if (buffer) {
        return {
          data: new Blob([audioBufferToWav(buffer)], { type: "audio/wav" }),
          start: clip.start
        }
      }
      return null;
    })
  };

  pasteClips = () => {
    if (this.selectedTracks.length > 0) {
      this.clipboard.forEach((item, i) => {
        if (item?.data) {
          if (i > 0) {
            const adjustedStart = item.start.toSeconds() + Tone.getTransport().seconds;
            this.selectedTracks.forEach(track => track.addClip(URL.createObjectURL(item.data), adjustedStart));
          } else {
            this.selectedTracks.forEach(track => track.addClip(URL.createObjectURL(item.data), Tone.getTransport().seconds));
          }
        }
      })
    }
  }

  setPosition = (time: Tone.TimeClass, redraw: () => void) => {
    const transport = Tone.getTransport();
    if (this.state === 'playing') {
      this.stop();
      transport.ticks = time.toTicks();
      this.play();
    } else {
      transport.ticks = time.toTicks();
      redraw();
    }
  }

  play = () => {
    if (this.state !== 'playing') {
      // this.setState('playing');
      // Tone.getTransport().start();
      this.tracks.forEach(track => track.play());
      Tone.getTransport().start()
    }
  }

  stop = () => {
    this.setState('stopped');
    Tone.getTransport().stop();
    this.tracks.forEach(track => track.stop());
  }

  pause = () => {
    Tone.getTransport().pause();
    this.tracks.forEach(track => track.stop())
    this.setState('paused')
  }

  startTone = () => {
    Tone.start();
  }
}