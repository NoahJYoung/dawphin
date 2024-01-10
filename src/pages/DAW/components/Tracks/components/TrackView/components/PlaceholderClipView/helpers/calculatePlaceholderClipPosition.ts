import { AudioEngine } from "src/AudioEngine";
import { Track } from "src/AudioEngine/Track";

export const calculatePlaceholderClipPosition = (
  audioEngine: AudioEngine,
  track: Track,
  clipHeight: number,
  topPadding: number
) => {
  const left = Math.round(
    track.placeholderClipStart!.toSamples() /
      audioEngine.timeline.samplesPerPixel
  );
  const top =
    audioEngine.tracks.findIndex(
      (audioEngineTrack) => audioEngineTrack.id === track.id
    ) *
      (clipHeight + topPadding) +
    topPadding / 2;

  return { top, left };
};
