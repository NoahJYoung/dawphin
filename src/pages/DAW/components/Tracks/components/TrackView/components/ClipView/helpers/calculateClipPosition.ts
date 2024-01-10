import { AudioEngine } from "src/AudioEngine";
import { Clip } from "src/AudioEngine/Track/Clip";

export const calculateClipPosition = (
  audioEngine: AudioEngine,
  clip: Clip,
  clipHeight: number,
  topPadding: number
) => {
  const left = Math.round(
    clip.start.toSamples() / audioEngine.timeline.samplesPerPixel
  );
  const top =
    audioEngine.tracks.findIndex((track) => track.id === clip.track.id) *
      (clipHeight + topPadding) +
    topPadding / 2;

  return { top, left };
};
