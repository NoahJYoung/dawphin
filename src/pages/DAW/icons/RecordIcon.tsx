import React from "react";

export const RecordIcon = ({
  width = 48,
  height = 48,
  color = "red",
  innerColor = "lightgray",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width={width}
    height={height}
    fill={color}
  >
    <circle cx="24" cy="24" r="21" fill={color} />
    <circle cx="24" cy="24" r="12" fill={innerColor} />
    <circle cx="24" cy="24" r="10" fill={color} />
  </svg>
);
