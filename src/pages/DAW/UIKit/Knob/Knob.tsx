import React, { useState, useEffect } from 'react';

interface KnobProps {
  value: number;
  onChange: (newValue: number) => void;
  size?: number;
  min?: number;
  max?: number;
  numTicks?: number;
  degrees?: number;
  color?: boolean;
}

const convertRange = (oldMin: number, oldMax: number, newMin: number, newMax: number, oldValue: number) => {
  return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
};

export const Knob = ({
  value,
  onChange,
  size = 150,
  min = -50,
  max = 50,
  degrees = 270,
}: KnobProps) => {
  const startAngle = (360 - degrees) / 2;
  const endAngle = startAngle + degrees;
  const margin = size * 0.1;

  const [deg, setDeg] = useState(
    Math.floor(
      convertRange(min, max, startAngle, endAngle, value)
    )
  );

  useEffect(() => {
    if (onChange) {
      const newValue = Math.floor(
        ((deg - startAngle) * (max - min)) / (endAngle - startAngle) + min
      );
      onChange(newValue);
    }
  }, [deg, min, max, startAngle, endAngle, onChange]);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const knob = e.currentTarget.getBoundingClientRect();
    const pts = {
      x: knob.left + knob.width / 2,
      y: knob.top + knob.height / 2,
    };

    const moveHandler = (e: MouseEvent) => {
      const currentDeg = getDeg(e.clientX, e.clientY, pts);
      setDeg(currentDeg);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', moveHandler);
    });
  };

  const getDeg = (cX: number, cY: number, pts: { x: number; y: number }) => {
    const x = cX - pts.x;
    const y = cY - pts.y;
    let deg = (Math.atan2(y, x) * 180) / Math.PI;
    deg = (deg + 360) % 360;
    let finalDeg = Math.min(Math.max(startAngle, deg), endAngle);
    return finalDeg;
  };

  const handleResetValue = () => setDeg(180);

  const alphaValue = (value - min) / (max - min);
  const negativeAlphaValue = 1 - alphaValue;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onDoubleClick={handleResetValue} onMouseDown={startDrag}>
      <svg
        className="knob"
        width={size}
        height={size}
        style={{
          transform: `rotate(${deg - 180}deg)`,
          backgroundImage: 'radial-gradient(100% 70%, #ddd 6%, #555 90%)',
          borderRadius: '50%',
          boxShadow: '-1px -4px 5px rgba(25, 25, 25, 0.5)'
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - margin}
          fill="none"
        />

        <line
          x1={size / 2}
          y1={size / 2}
          x2={size / 2}
          y2={margin}
          stroke={`rgba(25, 25, 25, ${negativeAlphaValue})`}
          strokeWidth="2"
        />

        <line
          x1={size / 2}
          y1={size / 2}
          x2={size / 2}
          y2={margin}
          stroke={`rgba(0, 0, 255, ${alphaValue})`}
          strokeWidth="2"
        />

        {/* <circle
          cx={size / 2}
          cy={margin}
          r={size / 16}
          fill={`rgba(72, 72, 72, ${negativeAlphaValue})`}
        />

        <circle
          cx={size / 2}
          cy={margin}
          r={size / 16}
          fill={`rgba(0, 0, 255, ${alphaValue})`}
        /> */}
      </svg>
    </div>
  );
};
