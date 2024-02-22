import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { Point } from "../types";

export const getBeforeAndAfterPoints = (band: Band): Point[] => {
  const { hertz, gain, Q } = band;

  switch (band.type) {
    case "highpass": {
      const before = { hertz: 1, gain: 0, id: band.id };
      const main = { type: "center", hertz: 10, gain: -24, id: band.id };
      const after = { type: "center", hertz, gain: 0, id: band.id };
      return [before, main, after];
    }
    case "highshelf": {
      const octaveFraction = 1 / Q;
      const lowerFrequencyFactor = Math.pow(2, -octaveFraction);
      const before = {
        type: "before",
        hertz: hertz * lowerFrequencyFactor,
        gain: 0,
        id: band.id,
      };
      const main = { type: "center", hertz, gain, id: band.id };
      const after = { hertz: 45000, gain, id: band.id };
      return [before, main];
    }
    default:
    case "peaking": {
      const octaveFraction = 1 / Q;
      const lowerFrequencyFactor = Math.pow(2, -octaveFraction);
      const upperFrequencyFactor = Math.pow(2, octaveFraction);

      const before = {
        type: "before",
        hertz: hertz * lowerFrequencyFactor,
        gain: 0,
        id: band.id,
      };

      const main = { type: "center", hertz, gain, id: band.id };

      const after = {
        type: "after",
        hertz: Math.round(hertz * upperFrequencyFactor),
        gain: 0,
        id: band.id,
      };

      return [before, main, after];
    }
  }
};
