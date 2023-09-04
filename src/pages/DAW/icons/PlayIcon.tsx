import React from 'react';

export const PlayIcon = ({ width = 24, height = 24, color = 'black' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill={color}
  >
    <path
      d="M8 5v14l11-7z"
      style={{
        stroke: color,
        strokeWidth: '2px',
        strokeLinejoin: 'round',
        fill: color,
        borderRadius: 2,
      }}
    />
  </svg>
);