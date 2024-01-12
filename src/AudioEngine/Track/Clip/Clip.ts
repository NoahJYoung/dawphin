import { makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { v4 as uuidv4 } from "uuid";
import { Track } from "../Track";

export class Clip {
  id: string;
  end: Tone.TimeClass | null = null;
  duration: Tone.TimeClass | null = null;
  samples: number = 0;
  waveformData: any;
  normalized: boolean = false;
  public isSelected: boolean = false;
  public player = new Tone.Player();
  public startEventId: number | null = null;
  public stopEventId: number | null = null;

  constructor(
    public track: Track,
    public audioBuffer: Tone.ToneAudioBuffer,
    public start: Tone.TimeClass,
    public fadeIn: Tone.TimeClass = Tone.Time(0),
    public fadeOut: Tone.TimeClass = Tone.Time(0)
  ) {
    makeAutoObservable(this);
    this.id = uuidv4();
    this.loadAudio();
    this.player.connect(this.track.channel.output);

    this.setFadeIn(fadeIn);
    this.setFadeOut(fadeOut);
  }

  play = (time: number, seekTime?: number) => {
    this.player.start(time, seekTime);
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

  loadAudio = async () => {
    this.player.buffer = this.audioBuffer;
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

  setFadeIn = (time: Tone.TimeClass) => {
    if (time.toSamples() < 0) {
      this.player.fadeIn = 0;
    } else if (this.duration && time.toSamples() > this.duration!.toSamples()) {
      this.player.fadeIn = this.duration!.toSeconds();
    } else {
      this.player.fadeIn = time.toSeconds();
    }
    this.fadeIn = Tone.Time(this.player.fadeIn);
  };

  setFadeOut = (time: Tone.TimeClass) => {
    if (time.toSamples() > 0) {
      this.player.fadeOut = time.toSeconds();
    } else {
      this.player.fadeOut = 0;
    }
    this.fadeOut = Tone.Time(this.player.fadeOut);
  };

  setSelect = (value: boolean) => {
    this.isSelected = value;
  };

  setAudioBuffer = (data: any) => {
    this.audioBuffer = data;
  };

  deleteClip = () => {
    this.player.dispose();
    this.clearEvents();
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
          },
          {
            start: Tone.Time(transportSeconds / Tone.getContext().sampleRate),
            buffer: clipTwoBuffer,
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
}
