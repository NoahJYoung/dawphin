import { Band, Point } from "./helpers/lines";

// export const octaveBandwidthToHertz = (
//   centerFrequency: number,
//   bandwidthInOctaves: number
// ): number => {
//   // Calculate the upper and lower frequencies
//   const upperFrequency = centerFrequency * Math.pow(2, bandwidthInOctaves / 2);
//   const lowerFrequency = centerFrequency / Math.pow(2, bandwidthInOctaves / 2);

//   // Bandwidth in Hertz is the difference between the upper and lower frequencies
//   const bandwidthInHertz = upperFrequency - lowerFrequency;

//   return bandwidthInHertz;
// };

// // Example usage:
// const centerFrequency = 1000; // 1000 Hz
// const bandwidthInOctaves = 1; // 1 octave
// const bandwidthInHertz = octaveBandwidthToHertz(
//   centerFrequency,
//   bandwidthInOctaves
// );
// console.log(`Bandwidth in Hertz: ${bandwidthInHertz} Hz`);

// export const testBandsOne = [
//   // { hertz: 0, gain: 0, Q: 1 },
//   { hertz: 14000, gain: 0, Q: 1 },
//   { hertz: 850, gain: -5, Q: 1 },
//   { hertz: 15000, gain: 0, Q: 1 },
//   // { hertz: 20000, gain: 0, Q: 1 },
// ];

// y = A(log(x))^2 + B(log(x)) + C es tu funcion que te va a dibujar bonito y simetrico en semi-log scale

export const getBeforeAndAfterPoints = (band: Band): Point[] => {
  const { hertz, gain, Q } = band;

  const octaveFraction = 1 / Q; // Define the fraction of an octave as the bandwidth
  const lowerFrequencyFactor = Math.pow(2, -octaveFraction); // Calculate the lower frequency factor
  const upperFrequencyFactor = Math.pow(2, octaveFraction); // Calculate the upper frequency factor

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

///

// export function findLogarithmicIntersections(curves: Point[][]): Point[] {
//   const intersections: Point[] = [];
//   const usedSegments = new Map<number, Set<number>>();

//   // Initialize the used segments map with empty sets for each curve
//   curves.forEach((_, index) => usedSegments.set(index, new Set()));

//   // Check if two line segments intersect and return the intersection point, if any
//   function getIntersectionPoint(
//     p0: Point,
//     p1: Point,
//     p2: Point,
//     p3: Point
//   ): Point | null {
//     // Line AB represented as a1x + b1y = c1
//     const a1 = p1.gain - p0.gain;
//     const b1 = p0.hertz - p1.hertz;
//     const c1 = a1 * p0.hertz + b1 * p0.gain;

//     // Line CD represented as a2x + b2y = c2
//     const a2 = p3.gain - p2.gain;
//     const b2 = p2.hertz - p3.hertz;
//     const c2 = a2 * p2.hertz + b2 * p2.gain;

//     // Calculate the determinant
//     const determinant = a1 * b2 - a2 * b1;

//     if (determinant === 0) {
//       // Lines are parallel
//       return null;
//     } else {
//       // Intersection point (hertz, gain)
//       const hertz = (b2 * c1 - b1 * c2) / determinant;
//       const gain = (a1 * c2 - a2 * c1) / determinant;

//       // Check if the intersection point is within both line segments
//       if (
//         Math.min(p0.hertz, p1.hertz) <= hertz &&
//         hertz <= Math.max(p0.hertz, p1.hertz) &&
//         Math.min(p0.gain, p1.gain) <= gain &&
//         gain <= Math.max(p0.gain, p1.gain) &&
//         Math.min(p2.hertz, p3.hertz) <= hertz &&
//         hertz <= Math.max(p2.hertz, p3.hertz) &&
//         Math.min(p2.gain, p3.gain) <= gain &&
//         gain <= Math.max(p2.gain, p3.gain)
//       ) {
//         return { hertz, gain };
//       }
//     }

//     return null;
//   }

//   // Iterate over all pairs of curves and their segments
//   for (let i = 0; i < curves.length - 1; i++) {
//     for (let j = i + 1; j < curves.length; j++) {
//       for (let k = 0; k < curves[i].length - 1; k++) {
//         if (usedSegments.get(i)!.has(k)) continue; // Skip if this segment is already used

//         for (let l = 0; l < curves[j].length - 1; l++) {
//           if (usedSegments.get(j)!.has(l)) continue; // Skip if this segment is already used

//           const intersection = getIntersectionPoint(
//             curves[i][k],
//             curves[i][k + 1],
//             curves[j][l],
//             curves[j][l + 1]
//           );
//           if (intersection) {
//             intersections.push(intersection);
//             // Mark these segments as used
//             usedSegments.get(i)!.add(k);
//             usedSegments.get(j)!.add(l);
//           }
//         }
//       }
//     }
//   }

//   return intersections;
// }

export function findLogarithmicIntersections(curves: Point[][]): Point[] {
  // Helper function to linearly interpolate in log scale for hertz
  // function interpolateLog(p1: Point, p2: Point, hertz: number): number {
  //   let logHz1 = Math.log(p1.hertz);
  //   let logHz2 = Math.log(p2.hertz);
  //   let ratio = (Math.log(hertz) - logHz1) / (logHz2 - logHz1);
  //   return p1.gain + ratio * (p2.gain - p1.gain);
  // }

  // Helper function to find intersection of two line segments
  // Assumes that p1.hertz and p2.hertz are not equal
  function findIntersection(
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point
  ): Point | null {
    // Convert hertz to logarithmic scale for calculations
    let p1LogHz = Math.log(p1.hertz);
    let p2LogHz = Math.log(p2.hertz);
    let p3LogHz = Math.log(p3.hertz);
    let p4LogHz = Math.log(p4.hertz);

    let denominator =
      (p4LogHz - p3LogHz) * (p2.gain - p1.gain) -
      (p2LogHz - p1LogHz) * (p4.gain - p3.gain);
    if (denominator === 0) return null; // Lines are parallel or coincident

    let ua =
      ((p4.gain - p3.gain) * (p1LogHz - p3LogHz) +
        (p3LogHz - p4LogHz) * (p1.gain - p3.gain)) /
      denominator;
    let ub =
      ((p2.gain - p1.gain) * (p1LogHz - p3LogHz) +
        (p1LogHz - p2LogHz) * (p1.gain - p3.gain)) /
      denominator;

    // Check if the intersection point is within the line segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null;

    // Calculate the intersection point in log scale and convert back
    let intersectionLogHz = p1LogHz + ua * (p2LogHz - p1LogHz);
    let intersectionHz = Math.exp(intersectionLogHz);
    let intersectionGain = p1.gain + ua * (p2.gain - p1.gain);

    return {
      hertz: Math.round(intersectionHz),
      gain: Math.round(intersectionGain * 100) / 100,
    };
  }

  let intersections: Point[] = [];
  let intersectedSegments: Set<string> = new Set(); // To keep track of segments that have intersected

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
      let curve1 = curves[i];
      let curve2 = curves[j];

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

          let intersection = findIntersection(
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

  return intersections.sort((a, b) => a.hertz - b.hertz);
}
