import * as Tone from "tone";
import { Clip } from "./Clip";
import { Track } from "..";

export class ClipFactory {
  createClip = (track: Track, src: string, startSeconds: number) => {
    const buffer = new Tone.ToneAudioBuffer(src);
    const clip = new Clip(track, src, buffer, Tone.Time(startSeconds, "s"));

    return clip;
  };
}
