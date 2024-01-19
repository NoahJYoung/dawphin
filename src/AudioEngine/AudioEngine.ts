import { Track } from "./Track";
import { makeAutoObservable, observable } from "mobx";
import * as Tone from "tone";
import { Clip } from "./Track/Clip";
import audioBufferToWav from "audiobuffer-to-wav";
import { MasterControl } from "./MasterControl";
import { FXFactory } from "./Effects";
import { Timeline } from "./Timeline";
import { Keyboard } from "./Keyboard";
import { inject, injectable } from "inversify";
import { constants } from "./constants";
import { Sampler } from "./Sampler";
import { blobToBuffer } from "./helpers";

interface ClipboardItem {
  data: Blob;
  start: Tone.TimeClass;
  fadeInSamples: number;
  fadeOutSamples: number;
}

@injectable()
export class AudioEngine {
  projectTitle: string = "New Project";
  clipboard: (ClipboardItem | null)[] = observable.array([]);
  state: string = "stopped";
  bpm: number = Tone.getTransport().bpm.value;
  timeSignature = Tone.getTransport().timeSignature;
  selectedClips: Clip[] = observable.array([]);
  selectedTracks: Track[] = observable.array([]);
  activeTracks: Track[] = observable.array([]);
  metronomeActive: boolean = true;
  metronome: Tone.PluckSynth | null = null;

  mic: Tone.UserMedia = new Tone.UserMedia();
  public cursorPosition: number = 0;

  constructor(
    @inject(MasterControl) public masterControl: MasterControl,
    @inject(FXFactory) public fxFactory: FXFactory,
    @inject(Timeline) public timeline: Timeline,
    @inject(constants.TRACK_FACTORY)
    private getNewTrack: (audioEngine: AudioEngine) => Track,
    @inject(Keyboard) public keyboard: Keyboard,
    @inject(Sampler) public sampler: Sampler,

    public tracks: Track[] = observable.array([])
  ) {
    makeAutoObservable(this);
    this.metronome = new Tone.PluckSynth().toDestination();
    this.setupMetronome();
    this.timeline.linkAudioEngine(this);
  }

  setState(
    newState: "playing" | "stopped" | "paused" | "recording" | "seeking"
  ) {
    this.state = newState;
  }

  setMetronome(value: boolean) {
    this.metronomeActive = value;
  }

  setupMetronome = () => {
    Tone.getTransport().scheduleRepeat((time) => {
      this.metronome?.triggerAttack("C5", time);
    }, "4n");
  };

  toggleMetronome = () => {
    if (this.metronome) {
      this.setMetronome(!this.metronomeActive);
      if (!this.metronomeActive) {
        this.metronome.disconnect();
      } else {
        this.metronome.toDestination();
      }
    }
  };

  setBpm = (bpm: number) => {
    const transport = Tone.getTransport();

    transport.bpm.value = Math.round(bpm);
    this.bpm = Math.round(transport.bpm.value);
  };

  setTimeSignature = (value: number | number[]) => {
    const transport = Tone.getTransport();
    transport.timeSignature = value;
    this.timeSignature = transport.timeSignature;
  };

  createTrack = () => {
    this.startTone();
    const newTrack = this.getNewTrack(this);
    this.tracks.push(newTrack);
  };

  getSelectedTracks = () => {
    this.selectedTracks = observable.array(
      [...this.tracks].filter((track) => track.selected)
    );
    return this.selectedTracks;
  };

  getActiveTracks = () => {
    this.activeTracks = [...this.tracks].filter((track) => track.active);
  };

  deselectAllTracks = () => {
    this.tracks.forEach((track) => track.deselect());
  };

  deleteSelectedTracks = () => {
    this.getSelectedTracks();
    this.selectedTracks.forEach((track) => track.channel.dispose());
    const selectedTrackIds = this.selectedTracks.map((track) => track.id);
    this.tracks = this.tracks.filter(
      (track) => !selectedTrackIds.includes(track.id)
    );
    this.selectedTracks = [];
  };

  setSelectedClips = (clips: Clip[]) => {
    this.selectedClips = observable.array(clips);
  };

  getSelectedClips = () => {
    const selectedClips: Clip[] = [];
    this.tracks.forEach((track) => {
      track.clips.forEach((clip) => {
        if (clip.isSelected) {
          selectedClips.push(clip);
        }
      });
    });

    this.setSelectedClips(selectedClips);
  };

  moveSelectedClips = (movementValue: number) => {
    this.getSelectedClips();
    this.selectedClips.forEach((clip) =>
      clip.setPosition(
        clip.start.toSamples() + this.timeline.pixelsToSamples(movementValue)
      )
    );
  };

  quantizeSelectedClips = () => {
    this.selectedClips.forEach((clip) => {
      const quantizedTime = Tone.Time(
        clip.start.quantize(
          this.timeline.quantizationValues[this.timeline.zoomIndex]
        )
      ).toSamples();
      clip.setPosition(quantizedTime);
    });
  };

  setFadeInOnSelectedClips = (movement: number) => {
    this.getSelectedClips();
    this.selectedClips.forEach((clip) => {
      clip.setFadeIn(
        Tone.Time(
          (clip.fadeIn?.toSamples() || 0) +
            this.timeline.pixelsToSamples(movement),
          "samples"
        )
      );
    });
  };

  setFadeOutOnSelectedClips = (movement: number) => {
    this.getSelectedClips();
    this.selectedClips.forEach((clip) => {
      clip.setFadeOut(
        Tone.Time(
          (clip.fadeOut?.toSamples() || 0) +
            this.timeline.pixelsToSamples(movement),
          "samples"
        )
      );
    });
  };

  deleteSelectedClips = () => {
    this.getSelectedClips();
    const clipIds = this.selectedClips.map((clip) => clip.id);
    this.tracks.forEach((track) => {
      track.setClips(track.clips.filter((clip) => !clipIds.includes(clip.id)));
    });
    this.selectedClips.forEach((clip) => clip.deleteClip());
  };

  setSelectedTracksColor = (color: string) => {
    this.selectedTracks.forEach((track) => track.setColor(color));
  };

  splitSelectedClipsAtPlayhead = () => {
    this.getSelectedClips();
    this.selectedClips.forEach((clip) => {
      const currentTrack = clip.track;
      const data = clip.split();
      data &&
        data.clips.forEach((clipData) => {
          const buffer = clipData.buffer.get();
          const toneBuffer = new Tone.ToneAudioBuffer(buffer);
          if (buffer) {
            const clip = currentTrack?.addClip(
              toneBuffer,
              clipData.start.toSamples()
            );
            if (clipData.fadeIn) {
              clip.setFadeIn(clipData.fadeIn);
            }

            if (clipData.fadeOut) {
              clip.setFadeOut(clipData.fadeOut);
            }
          }
        });
      currentTrack?.setClips(
        currentTrack.clips.filter((clip) => clip.id !== data?.oldId)
      );
    });
  };

  joinSelectedClips = (config?: { noFade: boolean }) => {
    this.tracks.forEach((track) => track.joinSelectedClips(config));
  };

  deselectClips = () => {
    this.getSelectedClips();
    this.selectedClips.forEach((clip) => clip.setSelect(false));
    this.setSelectedClips([]);
  };

  copyClips = () => {
    this.clipboard = this.selectedClips.map((clip) => {
      const buffer = clip.audioBuffer.get();
      const fadeInSamples = clip.fadeIn.toSamples();
      const fadeOutSamples = clip.fadeOut.toSamples();
      if (buffer) {
        return {
          data: new Blob([audioBufferToWav(buffer)], { type: "audio/wav" }),
          start: clip.start,
          fadeInSamples,
          fadeOutSamples,
        };
      }
      return null;
    });
  };

  setNormalized = (value: boolean) => {
    this.selectedClips.forEach((clip) => clip.setNormalized(value));
  };

  pasteClips = () => {
    const transport = Tone.getTransport();
    if (this.selectedTracks.length > 0) {
      const sortedClipboard = [...this.clipboard]
        .filter((item): item is ClipboardItem => item !== null)
        .sort((a, b) => a.start.toSeconds() - b.start.toSeconds());

      sortedClipboard.forEach(async (item, i) => {
        if (item?.data) {
          const buffer = await blobToBuffer(item.data);
          if (i > 0) {
            const adjustedStart = item.start.toSeconds() + transport.seconds;
            this.selectedTracks.forEach((track) => {
              track.addClip(
                buffer,
                adjustedStart,
                item.fadeInSamples,
                item.fadeOutSamples
              );
            });
          } else {
            this.selectedTracks.forEach((track) => {
              track.addClip(
                buffer,
                transport.seconds,
                item.fadeInSamples,
                item.fadeOutSamples
              );
            });
          }
        }
      });
    }
  };

  setPosition = (time: Tone.TimeClass) => {
    const transport = Tone.getTransport();

    if (this.state !== "recording") {
      if (this.state === "playing") {
        this.pause();
        transport.pause();
        transport.ticks = time.toTicks();
        this.cursorPosition = transport.ticks;
        this.play();
      } else {
        transport.ticks = time.toTicks();
        this.cursorPosition = transport.ticks;
      }
      if (this.timeline.updateTimelineUI) {
        this.timeline.updateTimelineUI();
      }
    }
  };

  muteSelectedTracks = () => {
    this.getSelectedTracks();
    this.selectedTracks.forEach((track) => track.setMuted(true));
  };

  unmuteSelectedTracks = () => {
    this.getSelectedTracks();
    this.selectedTracks.forEach((track) => track.setMuted(false));
  };

  soloSelectedTracks = () => {
    this.getSelectedTracks();
    this.selectedTracks.forEach((track) => track.setSolo(true));
  };

  unsoloSelectedTracks = () => {
    this.getSelectedTracks();
    this.selectedTracks.forEach((track) => track.setSolo(false));
  };

  muteUnsoloedTracks = () => {
    const soloedTracks = [...this.tracks].filter((track) => track.solo);
    if (soloedTracks.length > 0) {
      this.tracks.forEach((track) => {
        if (!track.solo) {
          track.setMuted(true);
        }
      });
    }
  };

  private connectInputToTracks = (mic: Tone.UserMedia) => {
    this.activeTracks.forEach((track) => {
      if (track.inputMode === "mic") {
        mic.connect(track.recorder);
      } else if (track.inputMode === "keyboard") {
        this.keyboard.osc.connect(track.recorder);
        if (this.keyboard.osc.state !== "started") {
          this.keyboard.osc.start();
        }
        this.keyboard.connect(track.recorder);
      } else if (track.inputMode === "sampler") {
        this.sampler.osc.connect(track.recorder);
        if (this.sampler.osc.state !== "started") {
          this.sampler.osc.start();
        }
        this.sampler.output.connect(track.recorder);
      }
      track.record();
    });
  };

  record = async () => {
    await this.startTone();
    if (this.state !== "recording") {
      this.getActiveTracks();
      try {
        await this.mic.open();
      } catch (error) {
        console.error("Microphone not accessible:", error);
        return;
      }

      this.play();
      this.setState("recording");
      this.connectInputToTracks(this.mic);
    } else {
      this.stop();
    }
  };

  play = async () => {
    if (this.state !== "playing") {
      this.setState("playing");
      await this.startTone();
      this.tracks.forEach((track) => track.play());
      Tone.Transport.start();
    }
  };

  stop = () => {
    this.startTone();
    Tone.getTransport().stop();
    this.tracks.forEach((track) => track.stop());
    if (this.state === "recording") {
      this.keyboard.osc.disconnect();
      this.sampler.osc.disconnect();
      this.mic.disconnect();
      this.keyboard.disconnect();
      this.keyboard.toDestination();
    }
    this.setState("stopped");
    if (this.timeline.updateTimelineUI) {
      this.timeline.updateTimelineUI();
    }
  };

  pause = () => {
    Tone.getTransport().pause();
    this.tracks.forEach((track) => track.stop());
    this.setState("paused");
  };

  startTone = async () => {
    if (Tone.getContext().state !== "running") {
      await Tone.start();
    }
  };

  getOfflineBounce = async () => {
    const totalDurationInSeconds = 30;

    const toneBuffer = await Tone.Offline(async () => {
      this.tracks.forEach((track) => {
        track.channel.toDestination();
        track.play();
      });
    }, totalDurationInSeconds);

    const rawBuffer = toneBuffer.get();

    if (rawBuffer) {
      const wav = audioBufferToWav(rawBuffer);
      return new Blob([wav], { type: "audio/wav" });
    }

    return null;
  };

  downloadProjectMixdown = async () => {
    const blob = await this.getOfflineBounce();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.style.display = "none";
      anchor.href = url;
      anchor.download = `${this.projectTitle || "track"}.wav`;
      document.body.appendChild(anchor);
      anchor.click();

      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }
  };
}
