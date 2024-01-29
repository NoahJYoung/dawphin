import { Clip } from "./Clip";
import { makeAutoObservable, observable } from "mobx";
import { AudioEngine } from "..";
import * as Tone from "tone";
import { injectable } from "inversify";
import { blobToBuffer, bufferToBlob } from "../helpers";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";
import { FXFactory } from "../Effects";

@injectable()
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
  public inputMode: "mic" | "keyboard" | "sampler" = "mic";

  constructor(
    public audioEngine: AudioEngine,
    private getNewClip: (
      track: Track,
      audioBuffer: Tone.ToneAudioBuffer,
      start: Tone.TimeClass,
      fadeIn: Tone.TimeClass,
      fadeOut: Tone.TimeClass
    ) => Clip,
    public id: string,
    public name: string,
    public clips: Clip[] = observable.array([]),
    public color: string = "rgb(125, 0, 250)",
    public selected: boolean = false,
    public channel: Tone.Channel = new Tone.Channel(),
    public muted = channel.mute
  ) {
    makeAutoObservable(this);

    this.setPan(0);
    this.channel.connect(this.splitter);
    this.splitter.connect(this.leftMeter, 0);
    this.splitter.connect(this.rightMeter, 1);
    this.channel.toDestination();
  }

  get fxFactory() {
    return this.audioEngine.fxFactory;
  }

  play = () => {
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
  };

  setPlaceholderClipStart = (time: Tone.TimeClass | null) => {
    this.placeholderClipStart = time;
  };

  record = async () => {
    const transport = Tone.getTransport();
    const startSeconds = transport.seconds;

    this.setPlaceholderClipStart(Tone.Time(startSeconds));
    this.recorder.start();
    transport.once("stop", async () => {
      const blob = await this.recorder.stop();
      const toneBuffer = await blobToBuffer(blob);
      this.setPlaceholderClipStart(null);
      this.addClip(toneBuffer, startSeconds);
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
    if (this.solo && this.muted) {
      this.setMuted(false);
    }
  };

  toggleSolo = () => {
    this.setSolo(!this.solo);
  };

  setActive = (newState: boolean) => {
    Tone.start();
    this.active = newState;
  };

  toggleActive = () => {
    this.setActive(!this.active);
  };

  stop = () => {
    this.clips.forEach((clip) => clip.stop());
  };

  setName = (value: string) => {
    this.name = value;
  };

  setColor = (color: string) => {
    this.color = color;
  };

  select = () => {
    this.selected = true;
  };

  selectAllClips = () => {
    this.clips.forEach((clip) => clip.setSelect(true));
    this.audioEngine.getSelectedTracks();
  };

  setEffectsChain = (effects: Tone.ToneAudioNode[]) => {
    this.effectsChain = effects;
  };

  setInputMode = (inputMode: "mic" | "keyboard" | "sampler") => {
    this.inputMode = inputMode;
  };

  addEffect = (effect: Tone.ToneAudioNode) => {
    // this.effectsChain.forEach((effect, i) => {
    //   if (i < this.effectsChain.length - 1) {
    //     effect.disconnect(this.effectsChain[i + 1]);
    //   }
    // });

    this.setEffectsChain([...this.effectsChain, effect]);
    this.channel.chain(...this.effectsChain, Tone.getDestination());
  };

  removeEffect = (index: number) => {
    this.channel.disconnect(this.effectsChain[0]);
    this.effectsChain.forEach((effect, i) => {
      if (i < this.effectsChain.length) {
        effect.disconnect(this.effectsChain[i + 1]);
      }
    });
    const filteredFX = [...this.effectsChain];
    filteredFX.splice(index, 1);
    this.setEffectsChain(filteredFX);
    this.channel.chain(...this.effectsChain, Tone.getDestination());
  };

  joinSelectedClips = async (config?: { noFade: boolean }) => {
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

    const concatenatedBuffer = !!config?.noFade
      ? Clip.concatenateBuffers(
          selectedClips.map((clip) => clip.audioBuffer),
          gapsInSeconds
        )
      : await Clip.concatenateAndFadeClips(selectedClips, gapsInSeconds);

    const buffer = new Tone.ToneAudioBuffer(concatenatedBuffer.get());
    if (buffer) {
      selectedClips.forEach((clip) => {
        const clipsCopy = [...this.clips];
        const index = clipsCopy.indexOf(clip);
        if (index !== -1) clipsCopy.splice(index, 1);
        clip.deleteClip();
        this.setClips(clipsCopy);
      });

      this.addClip(buffer, selectedClips[0].start.toSeconds());
    }
  };

  deselect = () => {
    this.selected = false;
  };

  toggleSelect = () => {
    this.selected = !this.selected;
  };

  mute = () => {
    this.channel.mute = true;
  };

  unmute = () => {
    this.channel.mute = false;
  };

  toggleMute = () => {
    this.setMuted(!this.muted);
  };

  addClip = (
    buffer: Tone.ToneAudioBuffer,
    startSeconds: number,
    fadeInSamples?: number,
    fadeOutSamples?: number
  ) => {
    const clip = this.getNewClip(
      this,
      buffer,
      Tone.Time(startSeconds, "s"),
      Tone.Time(fadeInSamples || 0, "samples"),
      Tone.Time(fadeOutSamples || 0, "samples")
    );

    this.clips.push(clip);

    return clip;
  };

  setClips = (clips: Clip[]) => {
    this.clips = clips;
  };

  getCombinedTrackAudioBuffer = async () => {
    const gapsInSeconds = [];
    for (let i = 0; i < this.clips.length - 1; i++) {
      const currentClipEnd = this.clips[i].end?.toSeconds() || 0;
      const nextClipStart = this.clips[i + 1].start.toSeconds();
      const gap = nextClipStart - currentClipEnd;
      gapsInSeconds.push(gap);
    }
    const concatenatedBuffer = await Clip.concatenateAndFadeClips(
      this.clips,
      gapsInSeconds
    );
    return concatenatedBuffer;
  };

  downloadTrackAudio = async () => {
    const buffer = await this.getCombinedTrackAudioBuffer();
    const blob = bufferToBlob(buffer);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = url;
    anchor.download = `${this.name || "track"}.wav`;
    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  getLastClipEndpointInSeconds = (): number => {
    if (this.clips.length >= 2) {
      const [lastClip] = [...this.clips].sort(
        (a, b) =>
          a.start.toSeconds() +
          (a.duration?.toSeconds() || 0) +
          (b.start.toSeconds() + (b.duration?.toSeconds() || 0))
      );

      return lastClip.start.toSeconds() + (lastClip.duration?.toSeconds() || 0);
    }
    return this.clips.length === 1
      ? this.clips[0].start.toSeconds() +
          (this.clips[0].duration?.toSeconds() || 0)
      : 0;
  };

  offlineRender = (offlineCtx: Tone.OfflineContext) => {
    const offlineChannel = new Tone.Channel().set({
      volume: this.volume || 0,
      pan: (this.pan || 0) / 100,
      mute: this.channel.mute,
    });
    const offlineFxFactory = new FXFactory();
    const offlineFxChain = this.effectsChain.map((effect) => {
      return offlineFxFactory.createEffect(effect.name)!;
    });

    offlineChannel.chain(...offlineFxChain, offlineCtx.destination);
    this.clips.forEach((clip) => clip.offlineRender(offlineChannel));
  };
}
