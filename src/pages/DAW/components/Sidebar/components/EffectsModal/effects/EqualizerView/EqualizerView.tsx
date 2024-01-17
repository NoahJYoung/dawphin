import { EQGrid } from "./components";
import { Point, bands } from "./helpers/lines";
import * as d3 from "d3";
import { findLogarithmicIntersections, getBeforeAndAfterPoints } from "./notes";

const indexToLineColorMap: Record<number, string> = {
  0: "blue",
  1: "red",
  2: "green",
  3: "white",
  4: "orange",
  5: "purple",
};

interface EqualizerViewProps {
  width: number;
  height: number;
}

const twoDArray = bands.map((band) => getBeforeAndAfterPoints(band));

// const zeroDbBaselinePoints: Point[] = getBeforeAndAfterPoints({
//   hertz: 800,
//   gain: 0,
//   Q: 0.1,
// });

const zeroDbBaselinePoints: Point[] = [
  { hertz: 20, gain: 0 },
  { hertz: 20000, gain: 0 },
];

const pointsToMap = [...twoDArray, zeroDbBaselinePoints];

console.log("intersection Points", findLogarithmicIntersections(pointsToMap));

const intersectingPoints = findLogarithmicIntersections(pointsToMap);
const preparedBands = bands.map(({ gain, hertz }) => ({ gain, hertz }));

const curveToMap = [
  ...preparedBands,
  ...intersectingPoints,
  ...zeroDbBaselinePoints,
].sort((a, b) => a.hertz - b.hertz);

export const EqualizerView = ({ width, height }: EqualizerViewProps) => {
  const scaleY = d3
    .scaleLinear()
    .domain([-12, 12])
    .range([height - 20, 0]);

  const scaleX = d3
    .scaleLog()
    .domain([20, 20000])
    .range([50, width - 20]);

  const lineGenerator = d3
    .line<Point>()
    .x((band) => scaleX(band.hertz))
    .y((band) => scaleY(band.gain))
    .curve(d3.curveBumpX);

  const linePaths = pointsToMap.map((points) => lineGenerator(points));

  const unifiedCurvePath = lineGenerator(curveToMap);

  return (
    <div style={{ background: "#ccc", height, width }}>
      <svg width={width} height={height}>
        <EQGrid scaleY={scaleY} scaleX={scaleX} width={width} height={height} />

        {bands.map((band, i) => (
          <circle
            key={i}
            stroke="#ccc"
            fill="nofill"
            cx={scaleX(band.hertz)}
            cy={scaleY(band.gain)}
            r={5}
          />
        ))}

        {unifiedCurvePath && (
          <path d={unifiedCurvePath} fill="none" stroke="rgb(125, 0, 250)" />
        )}

        {/* {linePaths.map((path, i) =>
          path ? (
            <path
              key={i}
              d={path}
              fill="none"
              stroke={indexToLineColorMap[i]}
            />
          ) : null
        )} */}
      </svg>
    </div>
  );
};
