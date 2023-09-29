import { Track } from "src/AudioEngine/Track";
import { Clip } from "src/AudioEngine/Track/Clip";

export const calculateClipPosition = (
  track: Track,
  clip: Clip,
  clipHeight: number,
  topPadding: number
) => {
  const audioEngine = track.audioEngine;
  const left = Math.round(clip.start.toSamples() / audioEngine.samplesPerPixel);
  const top =
    audioEngine.tracks.findIndex((track) => track.id === clip.track.id) *
      (clipHeight + topPadding) +
    topPadding / 2;

  return { top, left };
};
