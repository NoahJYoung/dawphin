import React from "react";

interface KeyboardIconProps {
  color: string;
  size?: number; // Added size property
}

export const KeyboardIcon = ({ color, size = 18 }: KeyboardIconProps) => {
  // Default size if not provided
  return (
    <svg
      style={{ alignSelf: "center" }}
      width={size} // Set width based on size
      height={(size * 20) / 18} // Set height based on size, maintaining aspect ratio
      viewBox="0 0 18 20" // Added for scalability
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0"
        y="0.5"
        width="18"
        height="19"
        rx="2"
        ry="2"
        stroke={color}
        strokeWidth={1}
      />
      <rect
        x="6"
        y="0.5"
        width="6"
        height="19"
        stroke={color}
        strokeWidth={1}
      />
      <rect x="4" y="0.5" width="4" height="12" stroke={color} fill={color} />
      <rect x="10" y="0.5" width="4" height="12" stroke={color} fill={color} />
    </svg>
  );
};
