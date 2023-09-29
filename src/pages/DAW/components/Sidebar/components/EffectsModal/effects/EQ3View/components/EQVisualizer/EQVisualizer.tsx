import React from "react";

interface EQVisualizerProps {
  lowValue: number;
  midValue: number;
  highValue: number;
  lowFrequency: number;
  highFrequency: number;
  Q: number;
}

export const EQVisualizer = ({
  lowValue,
  midValue,
  highValue,
  lowFrequency,
  highFrequency,
  Q,
}: EQVisualizerProps) => {
  const height = 200;
  const width = 400;
  const margin = 24;
  const minValue = -10;
  const maxValue = 10;
  const minFreq = 20;
  const maxFreq = 20000;

  const calculateHeight = (value: number) =>
    ((value - minValue) / (maxValue - minValue)) * height;

  const freqToX = (freq: number) =>
    (Math.log(freq / minFreq) / Math.log(maxFreq / minFreq)) *
      (width - 2 * margin) +
    margin;

  const getDisplayHertz = (hertz: number) => {
    if (hertz >= 10000) {
      return `${hertz.toString().split("").slice(0, 2).join("")}k`;
    }

    return hertz;
  };

  const generateBandPath = (
    freq1: number,
    freq2: number,
    value: number,
    color: string
  ) => {
    const left = freqToX(freq1);
    const right = freqToX(freq2);
    const center = (left + right) / 2;
    const top = height + height / 2 - (calculateHeight(value) - margin / 2) * 2;

    return (
      <path
        d={`M ${left} ${height / 2 + margin} Q ${center} ${top} ${right} ${
          height / 2 + margin
        }`}
        fill={color}
        fillOpacity="0.1"
        stroke={color}
        strokeWidth="2"
      />
    );
  };

  return (
    <div
      style={{
        background: "#111",
        borderRadius: "5px",
        width: "100%",
        overflow: "auto",
      }}
    >
      <svg width={width} height={height + 2 * margin}>
        <line
          x1={margin}
          x2={width + margin}
          y1={height - calculateHeight(0) + margin}
          y2={height - calculateHeight(0) + margin}
          stroke="#888"
          strokeDasharray="5,5"
        />

        {generateBandPath(20, lowFrequency, lowValue, "red")}
        {generateBandPath(lowFrequency, highFrequency, midValue, "blue")}
        {generateBandPath(highFrequency, 20000, highValue, "green")}

        {[20, 100, 500, 1000, 5000, 10000, 20000].map((freq) => (
          <React.Fragment key={freq}>
            <line
              x1={freqToX(freq)}
              y1={height + margin}
              x2={freqToX(freq)}
              y2={height + margin - 10}
              stroke="gray"
            />
            <text
              x={freqToX(freq)}
              y={height + 2 * margin}
              fontSize="10"
              fill="gray"
              textAnchor="middle"
            >
              {getDisplayHertz(freq)}
            </text>
          </React.Fragment>
        ))}

        {[-10, -5, 0, 5, 10].map((db) => (
          <React.Fragment key={db}>
            <line
              key={db + "line"}
              x1={margin}
              y1={height - calculateHeight(db) + margin}
              x2={margin + 10}
              y2={height - calculateHeight(db) + margin}
              stroke="gray"
            />
            <text
              key={db + "text"}
              x={margin - 5}
              y={height - calculateHeight(db) + margin + 5}
              fontSize="10"
              fill="gray"
              textAnchor="end"
            >
              {db}
            </text>
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};
