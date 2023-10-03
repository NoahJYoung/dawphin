import React from "react";

interface FadeCurveProps {
  lengthInSamples: number;
  height: number;
  color: string;
  samplesPerPixel: number;
  direction: "in" | "out";
}

export const FadeCurve = ({
  lengthInSamples,
  height,
  color,
  samplesPerPixel,
  direction,
}: FadeCurveProps) => {
  const width = lengthInSamples / samplesPerPixel;

  const curveControlPoint = 0; // Adjust this value to change the curvature

  const pathD =
    direction === "in"
      ? `M0,${height} C${curveControlPoint}, ${height} ${curveControlPoint}, 0 ${width},0 L${width},${height} Z`
      : `M0,0 C${curveControlPoint},0 ${curveControlPoint},${height} ${width},${height} L0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      style={{ overflow: "visible", zIndex: -5 }}
    >
      <path d={pathD} fill={color} />
    </svg>
  );
};
