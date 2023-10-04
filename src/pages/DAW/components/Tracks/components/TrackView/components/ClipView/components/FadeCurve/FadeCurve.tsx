import { observer } from "mobx-react-lite";

interface FadeCurveProps {
  lengthInSamples: number;
  height: number;
  color: string;
  samplesPerPixel: number;
  direction: "in" | "out";
  clipDurationInSamples: number;
}

export const FadeCurve = observer(
  ({
    lengthInSamples,
    height,
    color,
    samplesPerPixel,
    direction,
    clipDurationInSamples,
  }: FadeCurveProps) => {
    const width = Math.round(lengthInSamples / samplesPerPixel);
    const endOfClip = Math.round(clipDurationInSamples / samplesPerPixel);

    let controlX, controlY, startX, startY, endX, endY, rectX, rectY;

    if (direction === "in") {
      controlX = width / 4;
      controlY = height / 4;
      startX = 0;
      startY = height;
      endX = width;
      endY = 0;
      rectX = endX;
      rectY = endY;
    } else {
      controlX = endOfClip - width / 4;
      controlY = 0;
      startX = endOfClip - width;
      startY = 0;
      endX = endOfClip;
      endY = height;
      rectX = startX - 10;
      rectY = startY;
    }

    const curvePath = `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY}`;
    const fillPath =
      direction === "in"
        ? `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY} L${endX},0 L${startX},0 Z`
        : `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY} L${endX},0 L${endOfClip},0 L${endOfClip},${startY} Z`;

    return (
      <svg
        width={endOfClip}
        height={height}
        style={{ position: "absolute", left: 0, top: 0, zIndex: 1000 }}
      >
        <path d={fillPath} fill="rgba(0, 0, 0, 0.5)" />
        <path d={curvePath} stroke={color} strokeWidth={1} fill="none" />
        <rect x={rectX} y={rectY} width={10} height={10} fill={color} />
      </svg>
    );
  }
);
