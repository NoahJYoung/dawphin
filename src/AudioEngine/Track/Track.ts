import { Clip } from "./Clip";
import { action, makeObservable, observable } from "mobx";
import { AudioEngine } from "..";
import * as Tone from "tone";
import audioBufferToWav from "audiobuffer-to-wav";

export class Track {
  public volume: number | null = null;
  public pan: number | null = null;
  public solo: boolean = false;
  public active: boolean = false;
  public leftMeter = new Tone.Meter(0.9);
  public rightMeter = new Tone.Meter(0.9);
  public splitter = new Tone.Split();
  public recorder = new Tone.Recorder();
  public placeholderClipStart: Tone.TimeClass | null = null;
  public effectsChain: Tone.ToneAudioNode[] = [];

  constructor(
    public audioEngine: AudioEngine,
    public id: number,
    public name: string,
    public clips: Clip[] = observable.array([]),
    public color: string = "rgb(125, 0, 250)",
    public selected: boolean = false,
    public channel: Tone.Channel = new Tone.Channel(),
    public muted = channel.mute
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
      effectsChain: observable,
      setEffectsChain: action.bound,
      setPlaceholderClipStart: action.bound,
      setActive: action.bound,
      setMuted: action.bound,
      setSolo: action.bound,
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

  get fxFactory() {
    return this.audioEngine.fxFactory;
  }

  play() {
    if (this.active && this.audioEngine.state === "recording") {
      return;
    }
    const transport = Tone.getTransport();
    this.clips.forEach((clip) => {
      const seekTime = transport.seconds - clip.start.toSeconds();
      if (
        clip.end &&
        transport.seconds > clip.start.toSeconds() &&
        transport.seconds < clip.end?.toSeconds()
      ) {
        clip.play(Tone.now(), seekTime);
      } else {
        clip.schedule();
      }
    });
  }

  setPlaceholderClipStart = (time: Tone.TimeClass | null) => {
    this.placeholderClipStart = time;
  };

  record = async () => {
    const startSeconds = Tone.getTransport().seconds;
    this.recorder.start();
    this.setPlaceholderClipStart(Tone.Time(startSeconds));
    Tone.getTransport().once("stop", async () => {
      const blob = await this.recorder.stop();
      const url = URL.createObjectURL(blob);
      this.setPlaceholderClipStart(null);
      this.addClip(url, startSeconds);
    });
  };

  setVolume = (value: number) => {
    this.channel.set({ volume: Math.round(value) });
    this.volume = Math.round(this.channel.volume.value);
  };

  setPan = (value: number) => {
    this.channel.set({ pan: value / 100 });
    this.pan = this.channel.pan.value * 100;
  };

  setMuted = (state: boolean) => {
    this.channel.set({ mute: state });
    this.muted = this.channel.mute;
  };

  setSolo = (state: boolean) => {
    this.channel.solo = state;
    this.solo = this.channel.solo;
  };

  setActive = (newState: boolean) => {
    Tone.start();
    this.active = newState;
  };

  toggleActive = () => {
    this.setActive(!this.active);
  };

  stop() {
    this.clips.forEach((clip) => clip.stop());
  }

  setName(value: string) {
    this.name = value;
  }

  setColor(color: string) {
    this.color = color;
  }

  select() {
    this.selected = true;
  }

  selectAllClips = () => {
    this.clips.forEach((clip) => clip.setSelect(true));
  };

  setEffectsChain = (effects: Tone.ToneAudioNode[]) => {
    this.effectsChain = effects;
  };

  addEffect = (effect: Tone.ToneAudioNode) => {
    this.effectsChain.forEach((effect, i) => {
      if (i < this.effectsChain.length - 1) {
        effect.disconnect(this.effectsChain[i + 1]);
      }
    });

    this.setEffectsChain([...this.effectsChain, effect]);

    this.channel.chain(...this.effectsChain, Tone.getDestination());
  };

  joinSelectedClips = () => {
    const selectedClips = this.clips.filter((clip) => clip.isSelected);
    if (selectedClips.length < 2) return;

    selectedClips.sort((a, b) => a.start.toSeconds() - b.start.toSeconds());

    const gapsInSeconds = [];

    for (let i = 0; i < selectedClips.length - 1; i++) {
      const currentClipEnd = selectedClips[i].end?.toSeconds() || 0;
      const nextClipStart = selectedClips[i + 1].start.toSeconds();
      const gap = nextClipStart - currentClipEnd;
      gapsInSeconds.push(gap);
    }

    const concatenatedBuffer = Clip.concatenateBuffers(
      selectedClips.map((clip) => clip.audioBuffer),
      gapsInSeconds
    );

    const buffer = concatenatedBuffer.get();
    if (buffer) {
      const blob = new Blob([audioBufferToWav(buffer)], {
        type: "audio/wav",
      });
      const src = URL.createObjectURL(blob);

      selectedClips.forEach((clip) => {
        const clipsCopy = [...this.clips];
        const index = clipsCopy.indexOf(clip);
        if (index !== -1) clipsCopy.splice(index, 1);
        clip.deleteClip();
        this.setClips(clipsCopy);
      });

      const clipId = this.addClip(src, selectedClips[0].start.toSamples());
      const newClip = this.clips.find((clip) => clip.id === clipId);
      newClip && newClip.setSelect(true);
    }
  };

  deselect() {
    this.selected = false;
  }

  toggleSelect() {
    this.selected = !this.selected;
  }

  mute() {
    this.channel.mute = true;
  }

  unmute() {
    this.channel.mute = false;
  }

  toggleMute() {
    this.setMuted(!this.muted);
  }

  addClip(src: string, startSeconds: number) {
    const buffer = new Tone.ToneAudioBuffer(src);
    const clip = new Clip(this, src, buffer, Tone.Time(startSeconds, "s"));
    this.clips.push(clip);

    return clip.id;
  }

  setClips(clips: Clip[]) {
    this.clips = clips;
  }
}
