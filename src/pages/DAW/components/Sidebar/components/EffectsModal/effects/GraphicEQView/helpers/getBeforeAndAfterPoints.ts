import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { Point } from "../types";

export const getBeforeAndAfterPoints = (band: Band): Point[] => {
  const { hertz, gain, Q } = band;

  switch (band.type) {
    case "highpass": {
      const before = { hertz: 2, gain: -12 };
      const main = { hertz, gain: 0.5 };
      const after = { hertz: hertz + 10, gain: 0 };
      return [before, main, after];
    }
    case "highshelf": {
      const octaveFraction = 1 / Q;
      const lowerFrequencyFactor = Math.pow(2, -octaveFraction);
      const before = { hertz: hertz * lowerFrequencyFactor, gain: 0 };
      const main = { hertz, gain };
      const after = { hertz: 45000, gain };
      return [before, main, after];
    }
    default:
    case "peaking": {
      const octaveFraction = 1 / Q;
      const lowerFrequencyFactor = Math.pow(2, -octaveFraction);
      const upperFrequencyFactor = Math.pow(2, octaveFraction);

      const before = {
        hertz: hertz * lowerFrequencyFactor,
        gain: 0,
      };

      const main = { hertz, gain };

      const after = {
        hertz: Math.round(hertz * upperFrequencyFactor),
        gain: 0,
      };

      return [before, main, after];
    }
  }
};
