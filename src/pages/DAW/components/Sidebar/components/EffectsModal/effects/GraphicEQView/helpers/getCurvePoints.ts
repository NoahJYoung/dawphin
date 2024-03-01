import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { getBeforeAndAfterPoints } from ".";
import { Point } from "../types";

function calculateYValueFromXDifference(
  startX: number,
  endX: number,
  domainX: [number, number] = [20, 20000],
  domainY: [number, number] = [-12, 12]
): number {
  const ratioX = endX / startX;

  const logRangeX = Math.log10(domainX[1]) - Math.log10(domainX[0]);

  const rangeY = domainY[1] - domainY[0];

  const proportionX = Math.log10(ratioX) / logRangeX;

  const movementY = proportionX * rangeY;

  return movementY;
}

const applyHighPassAdjustment = (
  points: Point[],
  currentPoint: Point,
  i: number
) => {
  for (let j = i + 1; j < points.length; j++) {
    if (points[j].hertz <= currentPoint.hertz) {
      const nextRealPoint = points.find(
        (point, k) => point.type !== "marker" && k > j
      );
      if (nextRealPoint) {
        const nextRealPointIndex = points.indexOf(nextRealPoint);
        const nextRealPointInitialGain = nextRealPoint.gain;

        if (nextRealPointIndex - j === 1 && nextRealPointInitialGain > 0) {
          nextRealPoint.gain += calculateYValueFromXDifference(
            currentPoint.hertz,
            points[j].hertz
          );
          if (nextRealPoint.hertz < points[nextRealPointIndex + 1].hertz) {
            nextRealPoint.hertz += (currentPoint.hertz - points[j].hertz) * 0.6;
          }

          if (nextRealPointInitialGain > 0 && nextRealPoint.gain < 0) {
            nextRealPoint.gain = 0;
          }

          if (points[j].hertz < points[nextRealPointIndex + 1].hertz) {
            points[j].hertz = currentPoint.hertz;
          }

          if (nextRealPoint.hertz < currentPoint.hertz) {
            nextRealPoint.hertz = currentPoint.hertz;
          }
        }
      }
    }
  }
};

const adjustCurvePoints = (points: Point[]) => {
  return points.map((point, i) => {
    if (point.type === "highpass") {
      applyHighPassAdjustment(points, point, i);
    }
    return point;
  });
};

export const getCurvePoints = (bands: Band[]) => {
  const twoDArray = bands.map((band) => getBeforeAndAfterPoints(band));
  const centerLine: Point[] = [
    { hertz: 1, gain: 0, type: "marker" },
    { hertz: 45000, gain: 0, type: "marker" },
  ];

  return adjustCurvePoints([...twoDArray, ...centerLine].flat());
};
