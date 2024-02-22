import { Band } from "src/AudioEngine/Effects/Equalizer/Band";
import { getBeforeAndAfterPoints, findLogarithmicIntersections } from ".";
import { Point } from "../types";

export const getCurvePoints = (bands: Band[]) => {
  const twoDArray = bands.map((band) => getBeforeAndAfterPoints(band));

  const zeroDbBaselinePoints = [
    { type: "baseline", hertz: 1, gain: 0 },
    { type: "baseline", hertz: 45000, gain: 0 },
  ];

  const pointsToMap = [...twoDArray];

  const intersectingPoints = findLogarithmicIntersections(
    pointsToMap,
    zeroDbBaselinePoints,
    bands[bands.length - 1].gain
  );

  const preparedBands = bands.map(({ hertz, gain }) => ({ hertz, gain }));

  const curves = [
    ...preparedBands,
    ...intersectingPoints,
    ...zeroDbBaselinePoints,
  ].sort((a, b) => a.hertz - b.hertz);

  return [
    // [
    //   { type: "baseline", hertz: 1, gain: 0 },
    //   { type: "baseline", hertz: 15, gain: -24 },
    //   { type: "baseline", hertz: twoDArray[], gain: -24 },
    // ],
    ...twoDArray,
  ];
};
