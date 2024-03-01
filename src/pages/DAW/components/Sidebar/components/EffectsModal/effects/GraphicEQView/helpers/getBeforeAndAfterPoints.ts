import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { Point } from "../types";

export const getBeforeAndAfterPoints = (band: Band): Point[] => {
  const { hertz, gain, Q } = band;
  const octaveFraction = 1 / Q;
  const lowerFrequencyFactor = Math.pow(2, -octaveFraction);
  const upperFrequencyFactor = Math.pow(2, octaveFraction);

  switch (band.type) {
    case "highpass": {
      const before = { type: "marker", hertz: 1, gain: 0 };
      const prev = { type: "marker", hertz: 10, gain: -24 };
      const main = {
        type: "marker",
        hertz: hertz * lowerFrequencyFactor,
        gain: -24,
      };
      const after = { type: "highpass", hertz, gain: 0 };
      return [before, prev, main, after] as Point[];
    }
    case "highshelf": {
      const before = {
        type: "marker",
        hertz: hertz * 0.9 * lowerFrequencyFactor,
        gain: 0,
      };
      const main = { type: "highshelf", hertz, gain };
      const after = {
        type: "marker",
        hertz: 45000,
        gain: gain,
      };
      const end = { type: "marker", hertz: 45001, gain: 0 };
      return [before, main, after, end] as Point[];
    }
    default:
    case "peaking": {
      const before = {
        type: "marker",
        hertz: hertz * lowerFrequencyFactor,
        gain: 0,
        id: band.id,
      };

      const main = { type: "peaking", hertz, gain };

      const after = {
        type: "marker",
        hertz: Math.round(hertz * upperFrequencyFactor),
        gain: 0,
        id: band.id,
      };

      return [before, main, after] as Point[];
    }
  }
};
