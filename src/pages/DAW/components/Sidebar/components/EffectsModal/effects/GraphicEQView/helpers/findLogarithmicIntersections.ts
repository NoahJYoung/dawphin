import { Point } from "../types";

export function findLogarithmicIntersections(
  inputCurves: Point[][],
  baseline: Point[],
  highshelfGain: number
): Point[] {
  const curves = [...inputCurves, baseline];

  function findIntersection(
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point
  ): Point | null {
    // Convert hertz to logarithmic scale for calculations
    const p1LogHz = Math.log(p1.hertz);
    const p2LogHz = Math.log(p2.hertz);
    const p3LogHz = Math.log(p3.hertz);
    const p4LogHz = Math.log(p4.hertz);

    const denominator =
      (p4LogHz - p3LogHz) * (p2.gain - p1.gain) -
      (p2LogHz - p1LogHz) * (p4.gain - p3.gain);

    if (denominator === 0) return null; // Lines are parallel or coincident
    const ua =
      ((p4.gain - p3.gain) * (p1LogHz - p3LogHz) +
        (p3LogHz - p4LogHz) * (p1.gain - p3.gain)) /
      denominator;
    const ub =
      ((p2.gain - p1.gain) * (p1LogHz - p3LogHz) +
        (p1LogHz - p2LogHz) * (p1.gain - p3.gain)) /
      denominator;

    // Check if the intersection point is within the line segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null;

    // Calculate the intersection point in log scale and convert back
    const intersectionLogHz = p1LogHz + ua * (p2LogHz - p1LogHz);
    const intersectionHz = Math.exp(intersectionLogHz);
    const intersectionGain = p1.gain + ua * (p2.gain - p1.gain);

    return {
      hertz: Math.round(intersectionHz),
      gain: Math.round(intersectionGain * 100) / 100,
    };
  }

  const intersections: Point[] = [];
  const intersectedSegments: Set<string> = new Set(); // To keep track of segments that have intersected

  // Helper function to generate a unique key for a curve segment
  function segmentKey(curveIndex: number, segmentIndex: number): string {
    return `${curveIndex}:${segmentIndex}`;
  }

  // Helper function to check if the segment is a part of the baseline
  function isBaselineSegment(curveIndex: number): boolean {
    return curveIndex === curves.length - 1; // Assuming the baseline is the last one in the array
  }

  // Iterate over all pairs of curves
  for (let i = 0; i < curves.length - 1; i++) {
    for (let j = i + 1; j < curves.length; j++) {
      const curve1 = curves[i];
      const curve2 = curves[j];

      // Iterate over all pairs of line segments
      for (let k = 0; k < curve1.length - 1; k++) {
        for (let l = 0; l < curve2.length - 1; l++) {
          // Skip if either segment has already been part of an intersection
          // except if one of the segments is part of the baseline
          if (
            (!isBaselineSegment(i) &&
              intersectedSegments.has(segmentKey(i, k))) ||
            (!isBaselineSegment(j) && intersectedSegments.has(segmentKey(j, l)))
          ) {
            continue;
          }

          const intersection = findIntersection(
            curve1[k],
            curve1[k + 1],
            curve2[l],
            curve2[l + 1]
          );

          if (intersection) {
            intersections.push(intersection);
            // Mark these segments as having intersected unless it's the baseline
            if (!isBaselineSegment(i)) {
              intersectedSegments.add(segmentKey(i, k));
            }
            if (!isBaselineSegment(j)) {
              intersectedSegments.add(segmentKey(j, l));
            }
          }
        }
      }
    }
  }

  const highpass = { gain: -24, hertz: 6 };
  const highshelf = { gain: highshelfGain, hertz: 45000 };

  return [highpass, ...intersections, highshelf].sort(
    (a, b) => a.hertz - b.hertz
  );
}
