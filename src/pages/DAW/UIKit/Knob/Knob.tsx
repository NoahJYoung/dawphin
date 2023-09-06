import React, { useState, useRef } from 'react';

interface KnobProps {
  value: number;
  onChange: (value: number) => void;
}

export const Knob: React.FC<KnobProps> = ({ value, onChange }) => {
  const [dragging, setDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startValue, setStartValue] = useState(value);
  const knobRef = useRef<any>(null);

  const min = 0;
  const max = 100;

  const radius = 20;
  const centerX = 60;
  const centerY = 60;

  const getAngle = (x: number, y: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    const knobRect = knobRef.current?.getBoundingClientRect();
    if (knobRect) {
      const angle = getAngle(
        e.clientX - knobRect.left,
        e.clientY - knobRect.top
      );
      setStartAngle(angle);
      setStartValue(value);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      const angle = getAngle(e.clientX - centerX, e.clientY - centerY);
      const deltaAngle = angle - startAngle;
      const deltaValue = ((max - min) * (deltaAngle / 270)) | 0; // 270 degrees = full range
      const newValue = Math.min(max, Math.max(min, startValue + deltaValue));
      onChange(newValue);
  
      // Calculate rotation angle based on the newValue (adjust scale as needed)
      const rotationAngle = (newValue / max) * 270 - 135; // 270 degrees = full range, -135 to start from the top
      if (knobRef.current) {
        knobRef.current.style.transform = `rotate(${rotationAngle}deg)`;
      }
    }
  };
  

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      // ref={knobRef}
      className="knob"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <svg width="120" height="120" ref={knobRef}>
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="lightgray"
          stroke="black"
          strokeWidth="2"
        />
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX}
          y2={centerY - radius}
          stroke="black"
          strokeWidth="2"
        />
        <rect
          x={centerX - 2}
          y={centerY - radius - 10}
          width="4"
          height="10"
          fill="black"
        />
      </svg>
      <div className="knob-value">{value}</div>
    </div>
  );
};
