import React, { useState, useEffect } from "react";

function convertToLogarithmic(value: number, min: number, max: number) {
  const scale = (value - min) / (max - min);

  const minLog = Math.log(min);
  const maxLog = Math.log(max);
  const scaleLog = minLog + (maxLog - minLog) * scale;

  return Math.exp(scaleLog);
}

interface KnobProps {
  value: number;
  onChange: (newValue: number) => void;
  size?: number;
  min?: number;
  max?: number;
  numTicks?: number;
  degrees?: number;
  color?: string;
  double?: boolean;
  suffix?: string;
  step?: number;
  round?: boolean;
  renderValue?: (value: number) => string;
  logarithmic?: boolean;
}

export const Knob = ({
  value,
  onChange,
  size = 150,
  min = -50,
  max = 50,
  degrees = 270,
  color = "blue",
  double = false,
  suffix,
  step = 1,
  round,
  renderValue,
  logarithmic = false,
}: KnobProps) => {
  const startAngle = (360 - degrees) / 2;
  const endAngle = startAngle + degrees;
  const margin = size * 0.1;

  const convertRange = (
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number,
    oldValue: number
  ) => {
    return (
      ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
    );
  };

  const [deg, setDeg] = useState(
    convertRange(min, max, startAngle, endAngle, value)
  );

  useEffect(() => {
    const newValue = logarithmic
      ? convertToLogarithmic(
          convertRange(startAngle, endAngle, min, max, deg),
          min,
          max
        )
      : convertRange(startAngle, endAngle, min, max, deg);

    onChange((newValue / step) * step);
  }, [deg, min, max, startAngle, endAngle, onChange, step, logarithmic]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type !== "touchMove") {
      e.preventDefault();
    }
    e.stopPropagation();

    const knob = e.currentTarget.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
    };

    const moveHandler = (e: MouseEvent | TouchEvent) => {
      let currentX, currentY;
      if (e.type === "touchmove") {
        currentX = (e as TouchEvent).touches[0].clientX;
        currentY = (e as TouchEvent).touches[0].clientY;
      } else {
        currentX = (e as MouseEvent).clientX;
        currentY = (e as MouseEvent).clientY;
      }

      const currentDeg =
        Math.round(getDeg(currentX, currentY, pts) / step) * step;

      setDeg(currentDeg);
    };

    const endHandler = (e: any) => {
      e.stopPropagation();
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.addEventListener("mouseup", endHandler);
      document.addEventListener("touchend", endHandler);
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", endHandler);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", endHandler);
  };

  const getDeg = (cX: number, cY: number, pts: { x: number; y: number }) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = (Math.atan2(y, x) * 180) / Math.PI;
    deg = (deg + 360) % 360;
    let finalDeg = Math.min(Math.max(startAngle, deg), endAngle);
    return finalDeg;
  };

  const handleResetValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeg(180);
  };

  const calculateColorAngle = () => {
    if (double) {
      const colorAngle =
        value <= 0
          ? 180 - convertRange(min, max, startAngle, endAngle, value)
          : 360 -
            convertRange(min, max, startAngle - 180, endAngle - 180, value);

      const negativeGradient = `conic-gradient(${color} ${colorAngle}deg, #222 ${colorAngle}deg)`;
      const positiveGradient = `conic-gradient(#222 ${colorAngle}deg, ${color} ${colorAngle}deg)`;
      const background = value > 0 ? positiveGradient : negativeGradient;

      return background;
    } else {
      const colorAngle =
        225 - convertRange(min, max, startAngle - 180, endAngle - 180, value);
      const background = `conic-gradient(#222 ${colorAngle}deg, ${color} ${colorAngle}deg)`;

      return background;
    }
  };

  const background = logarithmic ? "#222" : calculateColorAngle();
  const preparedValue = round
    ? Math.round(value)
    : Math.round(value * 100) / 100;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
      onDoubleClick={handleResetValue}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
    >
      <svg
        className="knob"
        width={size}
        height={size}
        style={{
          transform: `rotate(${deg - 180}deg)`,
          background,
          borderRadius: "50%",
          boxShadow: "-1px -4px 5px rgba(25, 25, 25, 0.5)",
        }}
      >
        <circle cx={size / 2} cy={size / 2} r={size / 2} fill="none" />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - margin}
          fill="#292929"
        />

        <line
          x1={size / 2}
          y1={0}
          x2={size / 2}
          y2={margin * 2}
          stroke={color}
          strokeWidth="2"
        />
      </svg>

      <p
        style={{
          position: "absolute",
          margin: 0,
          fontSize: "0.65rem",
          whiteSpace: "nowrap",
        }}
      >
        {`${renderValue ? renderValue(preparedValue) : preparedValue}${
          suffix ?? ""
        }`}
      </p>
    </div>
  );
};
