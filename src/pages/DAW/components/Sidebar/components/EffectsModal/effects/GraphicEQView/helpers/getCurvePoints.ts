import { getBeforeAndAfterPoints, findLogarithmicIntersections } from ".";
import { Band, Point } from "../types";

export const getCurvePoints = (bands: Band[]): Point[] => {
  const twoDArray = bands.map((band) => getBeforeAndAfterPoints(band));

  const zeroDbBaselinePoints: Point[] = [
    { hertz: 20, gain: 0 },
    { hertz: 20000, gain: 0 },
  ];

  const pointsToMap = [...twoDArray];

  const intersectingPoints = findLogarithmicIntersections(
    pointsToMap,
    zeroDbBaselinePoints
  );
  const preparedBands = bands.map(({ gain, hertz }) => ({ gain, hertz }));

  const curves = [
    ...preparedBands,
    ...intersectingPoints,
    ...zeroDbBaselinePoints,
  ].sort((a, b) => a.hertz - b.hertz);

  return curves;
};
