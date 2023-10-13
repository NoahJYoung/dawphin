import React from "react";

interface WaveformIconProps {
  color: string;
}

export const WaveformIcon: React.FC<WaveformIconProps> = ({ color }) => {
  return (
    <svg
      style={{ alignSelf: "center" }}
      width="18"
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="17"
        height="19"
        rx="2"
        ry="2"
        stroke={color}
        strokeWidth={1}
      />
      <polyline
        points="1,10 3,15 6,5 9,18 12,2 15,14"
        stroke={color}
        strokeWidth={1}
        fill="none"
      />
    </svg>
  );
};
