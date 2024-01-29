import { Band, Point } from "../types";

export const getBeforeAndAfterPoints = (band: Band): Point[] => {
  const { hertz, gain, Q } = band;

  const octaveFraction = 1 / Q;
  const lowerFrequencyFactor = Math.pow(2, -octaveFraction);
  const upperFrequencyFactor = Math.pow(2, octaveFraction);

  const before = {
    hertz: hertz * lowerFrequencyFactor,
    gain: 0,
  };

  const main = { hertz, gain };

  const after = {
    hertz: hertz * upperFrequencyFactor,
    gain: 0,
  };

  return [before, main, after];
};
