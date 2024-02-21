import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { getBeforeAndAfterPoints, findLogarithmicIntersections } from ".";
import { Point } from "../types";

export const getCurvePoints = (bands: Band[]): Point[] => {
  const twoDArray = bands.map((band) => getBeforeAndAfterPoints(band));

  const zeroDbBaselinePoints: Point[] = [
    { hertz: 1, gain: 0 },
    { hertz: 45000, gain: 0 },
  ];

  const pointsToMap = [...twoDArray];

  const intersectingPoints = findLogarithmicIntersections(
    pointsToMap,
    zeroDbBaselinePoints,
    bands[bands.length - 1].gain
  );

  const preparedBands = bands.map(({ gain, hertz }) => ({ gain, hertz }));

  const curves = [
    ...preparedBands,
    ...intersectingPoints,
    ...zeroDbBaselinePoints,
  ].sort((a, b) => a.hertz - b.hertz);

  return curves;
};
