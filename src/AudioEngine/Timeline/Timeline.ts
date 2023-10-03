import { makeAutoObservable } from "mobx";
import * as Tone from "tone";
import { AudioEngine } from "..";

export class Timeline {
  public cursorPosition: number = 0;
  readonly zoomLevels: number[] = [32, 64, 128, 256, 512, 1024, 2048, 4092];
  public audioEngine: AudioEngine | null = null;
  readonly quantizationValues: string[] = [
    "16n",
    "16n",
    "8n",
    "8n",
    "4n",
    "4n",
    "1n",
    "1n",
  ];
  zoomIndex: number = 4;
  samplesPerPixel: number = this.zoomLevels[this.zoomIndex];
  totalMeasures: number = 200;
  scrollXOffsetPixels: number = 0;
  snap: boolean = false;
  updateTimelineUI: (() => void) | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setSnap = (value: boolean) => {
    this.snap = value;
  };

  setZoom = (direction: "zoomIn" | "zoomOut") => {
    if (direction === "zoomOut") {
      this.zoomIndex < this.zoomLevels.length - 1
        ? this.zoomIndex++
        : (this.zoomIndex = this.zoomLevels.length - 1);
    } else {
      this.zoomIndex > 0 ? this.zoomIndex-- : (this.zoomIndex = 0);
    }
    this.samplesPerPixel = this.zoomLevels[this.zoomIndex];
  };

  toStart = () => {
    if (this.audioEngine && this.updateTimelineUI) {
      this.audioEngine.startTone();
      const initialState = this.audioEngine.state;
      if (this.updateTimelineUI) {
        this.audioEngine.pause();
        Tone.getTransport().position = "0:0:0";
        this.updateTimelineUI();
      }
      if (initialState !== "playing") {
        this.audioEngine.stop();
      } else {
        this.audioEngine.play();
      }
    }
  };

  toEnd = () => {
    if (this.audioEngine && this.updateTimelineUI) {
      this.audioEngine.startTone();
      if (this.updateTimelineUI) {
        this.audioEngine.pause();
        Tone.getTransport().position = `${this.totalMeasures}:0:0`;
        this.updateTimelineUI();
        this.audioEngine.pause();
      }
    }
  };

  linkAudioEngine = (engine: AudioEngine) => {
    this.audioEngine = engine;
  };
}
