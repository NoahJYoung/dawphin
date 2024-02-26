import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { Point } from "../types";

export const getBeforeAndAfterPoints = (band: Band): Point[] => {
  const { hertz, gain, Q } = band;

  switch (band.type) {
    case "highpass": {
      const before = { type: "marker", hertz: 1, gain: 0, id: band.id };
      const main = { type: "marker", hertz: 10, gain: -24, id: band.id };
      const after = { type: "highpass", hertz, gain: 0, id: band.id };
      return [before, main, after];
    }
    case "highshelf": {
      const octaveFraction = 1 / Q;
      const lowerFrequencyFactor = Math.pow(2, -octaveFraction);
      const before = {
        type: "marker",
        hertz: hertz * 0.9 * lowerFrequencyFactor,
        gain: 0,
        id: band.id,
      };
      const main = { type: "highshelf", hertz, gain, id: band.id };
      const after = {
        type: "marker",
        hertz: 45000,
        gain: gain,
        id: band.id,
      };
      const end = { type: "marker", hertz: 45001, gain: 0 };
      return [before, main, after, end];
    }
    default:
    case "peaking": {
      const octaveFraction = 1 / Q;
      const lowerFrequencyFactor = Math.pow(2, -octaveFraction);
      const upperFrequencyFactor = Math.pow(2, octaveFraction);

      const before = {
        type: "marker",
        hertz: hertz * lowerFrequencyFactor,
        gain: 0,
        id: band.id,
      };

      const main = { type: "peaking", hertz, gain, id: band.id };

      const after = {
        type: "marker",
        hertz: Math.round(hertz * upperFrequencyFactor),
        gain: 0,
        id: band.id,
      };

      return [before, main, after];
    }
  }
};
