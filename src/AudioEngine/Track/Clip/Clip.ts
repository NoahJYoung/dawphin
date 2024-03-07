import { makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { v4 as uuidv4 } from "uuid";
import { Track } from "../Track";

export class Clip {
  end: Tone.TimeClass | null = null;
  duration: Tone.TimeClass | null = null;
  samples: number = 0;
  normalized: boolean = false;
  public isSelected: boolean = false;
  public player = new Tone.Player();
  public startEventId: number | null = null;
  public stopEventId: number | null = null;
  public yOffset = 0;

  constructor(
    public track: Track,
    public audioBuffer: Tone.ToneAudioBuffer,
    public start: Tone.TimeClass,
    public fadeIn: Tone.TimeClass = Tone.Time(0),
    public fadeOut: Tone.TimeClass = Tone.Time(0),
    public peaksData: number[][] = [],
    public id = uuidv4(),
    public loopEndSamples: number = 0,
    public loopExtension: Tone.ToneAudioBuffer | null = null
  ) {
    makeAutoObservable(this);

    this.loadAudio();
    this.player.connect(this.track.input.output);

    this.setFadeIn(fadeIn);
    this.setFadeOut(fadeOut);
  }

  play = (time: number, seekTime?: number) => {
    if (this.player.loaded) {
      this.player.start(time, seekTime);
    }
  };

  schedulePlay = () => {
    const transport = Tone.getTransport();
    const seekTime = transport.seconds - this.start.toSeconds();
    const playEventId = transport.scheduleOnce((time) => {
      if (seekTime > 0) {
        this.play(Tone.now(), seekTime);
      } else {
        this.play(time);
      }
    }, this.start.toSeconds());
    this.startEventId = playEventId;
  };

  scheduleStop = () => {
    const transport = Tone.getTransport();
    if (this.end) {
      const stopEventId = transport.scheduleOnce(() => {
        this.stop();
      }, this?.end.toSeconds());
      this.stopEventId = stopEventId;
    }
  };

  schedule = () => {
    this.clearEvents();
    this.schedulePlay();
    this.scheduleStop();
  };

  clearEvents = () => {
    const transport = Tone.getTransport();
    if (this.startEventId) {
      transport.clear(this.startEventId);
    }

    if (this.stopEventId) {
      transport.clear(this.stopEventId);
    }
  };

  setNormalized = (value: boolean) => {
    this.normalized = value;
  };

  stop = () => {
    this.player.stop();
  };

  setLoopExtension = (samples: number, config?: { replace: boolean }) => {
    if (this.loopEndSamples + samples > 0) {
      if (config?.replace) {
        this.loopEndSamples = samples;
      } else {
        this.loopEndSamples += samples;
      }

      const bufferLength = this.audioBuffer.length;

      let additionalSamples = this.loopEndSamples - bufferLength;
      while (additionalSamples < 0) additionalSamples += bufferLength;

      const newLoopExtensionSamples = new Float32Array(this.loopEndSamples);
      newLoopExtensionSamples.set(
        this.audioBuffer
          .getChannelData(0)
          .subarray(0, Math.min(this.loopEndSamples, bufferLength))
      );

      if (additionalSamples > 0) {
        let remainingSamples = additionalSamples;
        while (remainingSamples > 0) {
          const samplesToCopy = Math.min(remainingSamples, bufferLength);
          newLoopExtensionSamples.set(
            this.audioBuffer.getChannelData(0).subarray(0, samplesToCopy),
            this.loopEndSamples - remainingSamples
          );
          remainingSamples -= samplesToCopy;
        }
      }

      this.loopExtension = new Tone.Buffer(
        new AudioBuffer({
          length: newLoopExtensionSamples.length,
          numberOfChannels: 1,
          sampleRate: this.audioBuffer.sampleRate,
        })
      );
      this.loopExtension.get()!.copyToChannel(newLoopExtensionSamples, 0, 0);
    } else {
      this.loopEndSamples = 0;
      this.loopExtension = null;
    }
  };

  loadCombinedBuffer = () => {
    if (this.loopExtension) {
      const combinedBuffer = Clip.concatenateBuffers([
        this.audioBuffer,
        this.loopExtension,
      ]);
      this.player.buffer = combinedBuffer;
      this.setEnd(
        Tone.Time(this.start.toSeconds() + this.player.buffer.duration, "s")
      );
      this.schedule();
    } else {
      this.player.buffer = this.audioBuffer;
    }
  };

  //TODO: Fix this for clips without quantized clip ends
  quantizeLoopEnd = () => {
    const timeline = this.track.audioEngine.timeline;
    const quantizationValue = timeline.quantizationValues[timeline.zoomIndex];

    const quantizedEndSamples = Tone.Time(
      Tone.Time(this.loopEndSamples, "samples").quantize(quantizationValue)
    ).toSamples();

    this.setLoopExtension(quantizedEndSamples, { replace: true });
  };

  loadAudio = async () => {
    this.loadCombinedBuffer();
    this.setDuration(Tone.Time(this.player.buffer.duration, "s"));
    this.setEnd(
      Tone.Time(this.start.toSeconds() + this.player.buffer.duration, "s")
    );
    this.schedule();
  };

  setSamples = (samples: number) => {
    this.samples = samples;
  };

  setPosition = (samples: number) => {
    if (this.duration && this.end) {
      if (samples > 0) {
        this.setStart(Tone.Time(samples, "samples"));

        this.setEnd(
          Tone.Time(this.start.toSeconds() + this.duration.toSeconds(), "s")
        );
      } else {
        this.setStart(Tone.Time(0, "samples"));
        this.setEnd(
          Tone.Time(this.start.toSeconds() + this.duration.toSeconds(), "s")
        );
      }
      this.schedule();
    }
  };

  setStart = (time: Tone.TimeClass) => {
    this.start = time;
  };

  setEnd = (time: Tone.TimeClass) => {
    this.end = time;
  };

  setDuration = (time: Tone.TimeClass) => {
    this.duration = time;
  };

  setPeaksData = (peaks: number[][]) => {
    this.peaksData = peaks;
  };

  setFadeIn = (time: Tone.TimeClass) => {
    if (
      time.toSamples() <
      this.duration!.toSamples() - this.fadeOut.toSamples()
    ) {
      if (time.toSamples() < 0) {
        this.player.fadeIn = 0;
      } else if (
        this.duration &&
        time.toSamples() > this.duration.toSamples()
      ) {
        this.player.fadeIn = this.duration!.toSeconds();
      } else {
        this.player.fadeIn = time.toSeconds();
      }
      this.fadeIn = Tone.Time(this.player.fadeIn);
    }
  };

  setFadeOut = (time: Tone.TimeClass) => {
    if (
      time.toSamples() <
      this.duration!.toSamples() - this.fadeIn.toSamples()
    ) {
      if (time.toSamples() > 0) {
        this.player.fadeOut = time.toSeconds();
      } else if (time.toSamples() <= 0) {
        this.player.fadeOut = 0;
      } else {
        this.player.fadeOut = this.duration!.toSeconds();
      }
      this.fadeOut = Tone.Time(this.player.fadeOut);
    }
  };

  setSelect = (value: boolean) => {
    this.isSelected = value;
  };

  setAudioBuffer = (data: Tone.ToneAudioBuffer) => {
    this.audioBuffer = data;
  };

  setYOffset = (offset: number) => {
    this.yOffset = offset;
  };

  deleteClip = () => {
    this.player.dispose();
    this.clearEvents();
    this.track.setClips([
      ...this.track.clips.filter((clip) => clip.id !== this.id),
    ]);
  };

  split = () => {
    const transportSeconds = Tone.getTransport().seconds;
    const cursorIsOverClip =
      transportSeconds > this.start.toSeconds() &&
      transportSeconds < (this.end?.toSeconds() || 0);

    if (cursorIsOverClip && this.isSelected) {
      const clipRelativeTransportseconds =
        transportSeconds - this.start.toSeconds();

      const clipOneBuffer = this.audioBuffer.slice(
        0,
        clipRelativeTransportseconds
      );

      const clipTwoBuffer = this.audioBuffer.slice(
        clipRelativeTransportseconds,
        this.duration?.toSeconds()
      );
      this.deleteClip();
      return {
        clips: [
          {
            start: Tone.Time(
              this.start.toSeconds() / Tone.getContext().sampleRate
            ),
            buffer: clipOneBuffer,
            fadeIn: this.fadeIn,
          },
          {
            start: Tone.Time(transportSeconds / Tone.getContext().sampleRate),
            buffer: clipTwoBuffer,
            fadeOut: this.fadeOut,
          },
        ],
        oldId: this.id,
      };
    }

    return null;
  };

  static concatenateBuffers = (
    buffers: Tone.ToneAudioBuffer[],
    gapsInSeconds: number[] = []
  ): Tone.ToneAudioBuffer => {
    const totalLength =
      buffers.reduce((sum, buffer) => sum + buffer.length, 0) +
      gapsInSeconds.reduce(
        (sum, gap) => sum + gap * Tone.getContext().sampleRate,
        0
      );

    const audioContext = Tone.getContext().rawContext;
    const concatenatedBuffer = audioContext.createBuffer(
      1,
      totalLength,
      audioContext.sampleRate
    );

    let offset = 0;
    buffers.forEach((buffer, index) => {
      concatenatedBuffer.copyToChannel(buffer.getChannelData(0), 0, offset);
      offset += buffer.length;

      if (index < buffers.length - 1 && gapsInSeconds[index]) {
        offset += gapsInSeconds[index] * Tone.getContext().sampleRate;
      }
    });

    return new Tone.ToneAudioBuffer(concatenatedBuffer);
  };

  getClipData = () => {
    const buffer = this.audioBuffer.get();
    const fadeInSamples = this.fadeIn.toSamples();
    const fadeOutSamples = this.fadeOut.toSamples();

    return {
      data: buffer!,
      start: this.start,
      fadeInSamples,
      fadeOutSamples,
      peaksData: this.peaksData,
    };
  };

  async getBufferWithFades() {
    const clipDuration = this.player.buffer.duration;
    const fadeInDuration = this.fadeIn.toSeconds();
    const fadeOutDuration = this.fadeOut.toSeconds();

    return await Tone.Offline(async (context) => {
      const source = new Tone.BufferSource(this.player.buffer).connect(
        context.destination
      );

      source.fadeIn = fadeInDuration;
      source.fadeOut = fadeOutDuration;

      source.start();

      const stopTime = clipDuration - fadeOutDuration;
      source.stop(stopTime);
    }, clipDuration);
  }

  static concatenateAndFadeClips = async (
    clips: Clip[],
    gapsInSeconds: number[]
  ) => {
    let totalDuration = 0;
    const buffersWithFades: Tone.ToneAudioBuffer[] = [];

    for (const clip of clips) {
      const bufferWithFades = await clip.getBufferWithFades();
      buffersWithFades.push(bufferWithFades);
      totalDuration += bufferWithFades.duration;
    }

    totalDuration += gapsInSeconds.reduce((sum, gap) => sum + gap, 0);

    return await Tone.Offline(async (context) => {
      let offset = 0;
      buffersWithFades.forEach((buffer, index) => {
        const source = new Tone.BufferSource(buffer).connect(
          context.destination
        );
        source.start(offset);
        offset += buffer.duration;

        if (index < gapsInSeconds.length) {
          offset += gapsInSeconds[index];
        }
      });
    }, totalDuration);
  };

  offlineRender = (offlineTrackChannel: Tone.Channel) => {
    const offlinePlayer = new Tone.Player().set({
      fadeIn: this.fadeIn?.toSeconds(),
      fadeOut: this.fadeOut?.toSeconds(),
    });
    offlinePlayer.buffer = this.player.buffer;
    if (offlinePlayer.loaded) {
      offlinePlayer.connect(offlineTrackChannel);
      offlinePlayer.start(this.start.toSeconds());
      offlinePlayer.stop(
        this.start.toSeconds() + (this.player.buffer.duration || 0)
      );
    }
  };
}
