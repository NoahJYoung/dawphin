import { Track } from "src/AudioEngine/Track";
import { convertRgbToRgba } from ".";

export const getTrackBackgroundColor = (track: Track) => {
  return track.selected
    ? `radial-gradient(${convertRgbToRgba(
        track.color,
        0.8
      )}, ${convertRgbToRgba(track.color, 0.6)})`
    : `radial-gradient(${convertRgbToRgba(
        track.color,
        0.5
      )}, ${convertRgbToRgba(track.color, 0.3)})`;
};
