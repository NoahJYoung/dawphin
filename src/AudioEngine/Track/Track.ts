/* eslint-disable @typescript-eslint/no-unused-vars */
import { Clip } from "./Clip";
import { makeAutoObservable, observable } from "mobx";
import { AudioEngine } from "..";
import * as Tone from "tone";
import { injectable } from "inversify";
import { blobToBuffer, bufferToWav } from "../helpers";
import { v4 as uuidv4 } from "uuid";
import { BaseEffectType } from "../Effects/types";

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
  public effectsChain: BaseEffectType[] = [];
  public inputMode: "mic" | "keyboard" | "sampler" = "mic";

  constructor(
    public audioEngine: AudioEngine,
    private getNewClip: (
      track: Track,
      audioBuffer: Tone.ToneAudioBuffer,
      start: Tone.TimeClass,
      fadeIn: Tone.TimeClass,
      fadeOut: Tone.TimeClass,
      peaksData: number[][]
    ) => Clip,
    public id: string = uuidv4(),
    public name: string,
    public clips: Clip[] = observable.array([]),
    public color: string = "rgb(125, 0, 250)",
    public selected: boolean = false,
    public input = new Tone.Channel(),
    public output = new Tone.Channel(),
    public auxIn = new Tone.Channel(),
    public auxOut = new Tone.Channel(),
    public muted = input.mute,
    public sortIndex = audioEngine.tracks.length
  ) {
    makeAutoObservable(this);
    this.setPan(0);
    this.auxIn.connect(this.input);
    this.input.connect(this.output);
    this.output.connect(this.splitter);
    this.splitter.connect(this.leftMeter, 0);
    this.splitter.connect(this.rightMeter, 1);
    this.output.connect(this.auxOut);
    this.output.toDestination();
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

  setSortIndex = (index: number) => {
    if (this.audioEngine.tracks[index]) {
      this.audioEngine.tracks[index].sortIndex = this.sortIndex;
    }
    this.sortIndex = index;
  };

  // TODO: REPLACE WITH LATENCY MANAGER CLASS
  adjustLatency = (
    buffer: Tone.ToneAudioBuffer,
    startSeconds: number,
    inputMode: "mic" | "keyboard" | "sampler"
  ) => {
    const lookAhead = Tone.getContext().lookAhead;
    const latencyMap: Record<string, number> = {
      mic: 0.23,
      keyboard: lookAhead,
      sampler: lookAhead,
    };

    const start = Tone.Time(latencyMap[inputMode], "s");

    const adjustedbuffer = buffer.slice(start as unknown as number);

    return { buffer: adjustedbuffer, seconds: startSeconds };
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

      const { buffer, seconds } = this.adjustLatency(
        toneBuffer,
        startSeconds,
        this.inputMode
      );

      this.addClip(buffer, seconds);
    });
  };

  setVolume = (value: number) => {
    this.input.set({ volume: Math.round(value) });
    this.volume = Math.round(this.input.volume.value);
  };

  setPan = (value: number) => {
    this.output.set({ pan: value / 100 });
    this.pan = this.output.pan.value * 100;
  };

  setMuted = (state: boolean) => {
    this.input.set({ mute: state });
    this.muted = this.input.mute;
  };

  setSolo = (state: boolean) => {
    this.input.solo = state;
    this.solo = this.input.solo;
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

  setEffectsChain = (effects: BaseEffectType[]) => {
    this.effectsChain = effects;
  };

  setInputMode = (inputMode: "mic" | "keyboard" | "sampler") => {
    this.inputMode = inputMode;
  };

  addEffect = (effect: BaseEffectType) => {
    this.input.disconnect();
    this.output.disconnect();
    this.effectsChain.forEach((effect, i) => {
      if (i < this.effectsChain.length - 1) {
        effect.output.disconnect(this.effectsChain[i + 1].input);
      }
    });

    this.setEffectsChain([...this.effectsChain, effect]);
    this.input.connect(this.effectsChain[0].input);
    this.effectsChain[this.effectsChain.length - 1].output.connect(this.output);
    this.output.connect(this.splitter);
    this.output.toDestination();
  };

  removeEffect = (id: string) => {
    this.input.disconnect(this.effectsChain[0].input);
    this.effectsChain.forEach((effect, i) => {
      if (i < this.effectsChain.length) {
        effect.output.disconnect(this.effectsChain[i + 1]?.input);
      }
    });
    const filteredFX = [...this.effectsChain];
    const index = this.effectsChain.findIndex((effect) => effect.id === id);
    filteredFX.splice(index, 1);
    this.setEffectsChain(filteredFX);
    this.input.chain(
      ...this.effectsChain.map((effect) => effect.input),
      this.output
    );
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

    const concatenatedBuffer = config?.noFade
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
    this.input.mute = true;
  };

  unmute = () => {
    this.input.mute = false;
  };

  toggleMute = () => {
    this.setMuted(!this.muted);
  };

  addClip = (
    buffer: Tone.ToneAudioBuffer,
    startSeconds: number,
    fadeInSamples?: number,
    fadeOutSamples?: number,
    peaks?: number[][]
  ) => {
    const clip = this.getNewClip(
      this,
      buffer,
      Tone.Time(startSeconds, "s"),
      Tone.Time(fadeInSamples || 0, "samples"),
      Tone.Time(fadeOutSamples || 0, "samples"),
      peaks ?? []
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
    const blob = bufferToWav(buffer);
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

      return (
        lastClip.start.toSeconds() + (lastClip.player.buffer.duration || 0)
      );
    }
    return this.clips.length === 1
      ? this.clips[0].start.toSeconds() +
          (this.clips[0].player.buffer.duration || 0)
      : 0;
  };

  recreateEffectSends = (offlineCtx: Tone.OfflineContext) => {
    const effectsMap = this.audioEngine.auxSendManager
      .getOfflineEffects()
      .filter(([key]) => key === this.id);

    const effects = effectsMap.map(([, data]) => {
      if (typeof data !== "string") {
        const fxChainInput = new Tone.Channel(data.volume);
        const offlineFx = data.effects.map((effect) => effect.offlineRender());
        if (offlineFx.length > 0) {
          fxChainInput.connect(offlineFx[0].input);
        }
        offlineFx.forEach((effect, i) => {
          if (i < offlineFx.length - 2) {
            effect.output.connect(offlineFx[i + 1].input);
          } else {
            effect.output.connect(offlineCtx.destination);
          }
        });

        return fxChainInput;
      }
    });

    return effects.filter((item) => !!item);
  };

  offlineRender = (offlineCtx: Tone.OfflineContext) => {
    const offlineInput = new Tone.Channel();
    const offlineOutput = new Tone.Channel().set({
      volume: this.volume || 0,
      pan: (this.pan || 0) / 100,
      mute: this.input.mute,
    });

    const offlineFxChain = this.effectsChain.map((effect) =>
      effect.offlineRender()
    );

    if (this.effectsChain.length > 0) {
      offlineInput.connect(offlineFxChain[0].input);
      offlineFxChain.forEach(({ output }, i) => {
        if (i < offlineFxChain.length - 2) {
          output.connect(offlineFxChain[i + 1].input);
        } else {
          output.connect(offlineOutput);
        }
      });
    } else {
      offlineInput.connect(offlineOutput);
    }

    const offlineEffectSends = this.recreateEffectSends(offlineCtx);
    offlineOutput.fan(...(offlineEffectSends as any));
    offlineOutput.connect(offlineCtx.destination);
    this.clips.forEach((clip) => clip.offlineRender(offlineInput));
  };
}
