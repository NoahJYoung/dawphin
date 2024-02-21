//TODO: Find a better solution than this for the UI bug that happens when two points are very close together
import { Point } from "../types";

export const getCorrectedCurvePoints = (
  prevCurves: Point[],
  curves: Point[]
) => {
  const zeroDbCurveIndices = [0, 2, 4, curves.length - 1];

  const correctedCurves = curves.map((curvePoint, i) => {
    if (zeroDbCurveIndices.includes(i) && curvePoint.gain !== 0) {
      return prevCurves[i];
    } else if (
      curves.length >= 3 &&
      prevCurves.length > 3 &&
      i == 2 &&
      curvePoint.gain === 0
    ) {
      return prevCurves[i];
    } else {
      return curvePoint;
    }
  });

  return correctedCurves.sort((a, b) => a.hertz - b.hertz);
};
