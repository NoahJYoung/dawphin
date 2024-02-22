import React from "react";

export const HighShelfFilterIcon = ({
  color = "#888",
  size = 24,
  stroke = "5",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "flex", alignItems: "center" }}
  >
    {/* Background */}
    <rect width="100%" height="100%" fill="transparent" />
    {/* High Pass Filter line */}
    <polyline
      points="5,70 30,70 50,35 95,35"
      stroke={color}
      stroke-width={stroke}
      fill="none"
    />
  </svg>
);
