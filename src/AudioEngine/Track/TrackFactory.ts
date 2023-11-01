import { AudioEngine } from "..";
import { ClipFactory } from "./Clip";
import { Track } from "./Track";

export class TrackFactory {
  private currentTrackId = 1;

  constructor(private clipFactory: ClipFactory) {}

  createTrack = (engine: AudioEngine): Track => {
    const newTrack = new Track(
      engine,
      this.clipFactory,
      this.currentTrackId,
      `Track ${this.currentTrackId}`
    );
    this.currentTrackId += 1;
    return newTrack;
  };
}
