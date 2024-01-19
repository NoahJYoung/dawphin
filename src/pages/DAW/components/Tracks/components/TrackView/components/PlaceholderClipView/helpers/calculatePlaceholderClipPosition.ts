import { AudioEngine } from "src/AudioEngine";
import { Track } from "src/AudioEngine/Track";

export const calculatePlaceholderClipPosition = (
  audioEngine: AudioEngine,
  track: Track,
  clipHeight: number,
  topPadding: number
) => {
  const left = Math.round(
    audioEngine.timeline.samplesToPixels(
      track.placeholderClipStart!.toSamples()
    )
  );
  const top =
    audioEngine.tracks.findIndex(
      (audioEngineTrack) => audioEngineTrack.id === track.id
    ) *
      (clipHeight + topPadding) +
    topPadding / 2;

  return { top, left };
};
