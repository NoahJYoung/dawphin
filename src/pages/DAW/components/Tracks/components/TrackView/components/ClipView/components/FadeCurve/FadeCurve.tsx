import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

interface FadeCurveProps {
  fadeInLengthInSamples: number;
  fadeOutLengthInSamples: number;
  height: number;
  color: string;
  samplesPerPixel: number;
  clipDurationInSamples: number;
}

export const FadeCurve = observer(
  ({
    fadeInLengthInSamples,
    fadeOutLengthInSamples,
    height,
    color,
    samplesPerPixel,
    clipDurationInSamples,
  }: FadeCurveProps) => {
    const fadeInWidth = Math.round(fadeInLengthInSamples / samplesPerPixel);
    const fadeOutWidth = Math.round(fadeOutLengthInSamples / samplesPerPixel);
    const endOfClip = Math.round(clipDurationInSamples / samplesPerPixel);
    const [isFadeInHovering, setIsFadeInHovering] = useState(false);
    const [isFadeOutHovering, setIsFadeOutHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
      const handleMouseUp = () => {
        setIsFadeInHovering(false);
        setIsFadeOutHovering(false);
        setIsDragging(false);
      };

      window.addEventListener("dragend", handleMouseUp);

      return () => {
        window.removeEventListener("dragend", handleMouseUp);
      };
    }, []);

    const fadeInControlX = fadeInWidth / 4;
    const fadeInControlY = height / 4;
    const fadeInStartX = 0;
    const fadeInStartY = height;
    const fadeInEndX = fadeInWidth;
    const fadeInEndY = 0;
    const fadeInRectX = fadeInEndX;
    const fadeInRectY = fadeInEndY;

    const fadeOutControlX = endOfClip - fadeOutWidth / 4;
    const fadeOutControlY = 0;
    const fadeOutStartX = endOfClip - fadeOutWidth;
    const fadeOutStartY = 0;
    const fadeOutEndX = endOfClip;
    const fadeOutEndY = height;
    const fadeOutRectX = fadeOutStartX - 10;
    const fadeOutRectY = fadeOutStartY;

    const fadeInCurvePath = `M${fadeInStartX},${fadeInStartY} Q${fadeInControlX},${fadeInControlY} ${fadeInEndX},${fadeInEndY}`;
    const fadeOutCurvePath = `M${fadeOutStartX},${fadeOutStartY} Q${fadeOutControlX},${fadeOutControlY} ${fadeOutEndX},${fadeOutEndY}`;

    const fadeInFillPath = `M${fadeInStartX},${fadeInStartY} Q${fadeInControlX},${fadeInControlY} ${fadeInEndX},${fadeInEndY} L${fadeInEndX},0 L${fadeInStartX},0 Z`;
    const fadeOutFillPath = `M${fadeOutStartX},${fadeOutStartY} Q${fadeOutControlX},${fadeOutControlY} ${fadeOutEndX},${fadeOutEndY} L${fadeOutEndX},0 L${endOfClip},0 L${endOfClip},${fadeOutStartY} Z`;

    return (
      <svg
        width={endOfClip}
        height={height}
        style={{ position: "absolute", left: 0, top: 0, zIndex: 1000 }}
        onMouseDown={() => setIsDragging(true)}
      >
        <path d={fadeInFillPath} fill="rgba(0, 0, 0, 0.4)" />
        <path d={fadeOutFillPath} fill="rgba(0, 0, 0, 0.4)" />

        <path d={fadeInCurvePath} stroke={color} strokeWidth={1} fill="none" />
        <path d={fadeOutCurvePath} stroke={color} strokeWidth={1} fill="none" />

        <rect
          onMouseEnter={() => setIsFadeInHovering(true)}
          onMouseLeave={() => !isDragging && setIsFadeInHovering(false)}
          x={fadeInRectX}
          y={fadeInRectY}
          width={10}
          height={10}
          stroke={color}
          strokeWidth={1}
          fill={isFadeInHovering ? color : "none"}
          style={{ opacity: 0.85, pointerEvents: "all", cursor: "pointer" }}
        />

        <rect
          onMouseEnter={() => setIsFadeOutHovering(true)}
          onMouseLeave={() => !isDragging && setIsFadeOutHovering(false)}
          onDragOver={(e) => e.preventDefault()}
          x={fadeOutRectX}
          y={fadeOutRectY}
          width={10}
          height={10}
          stroke={color}
          strokeWidth={1}
          fill={isFadeOutHovering ? color : "none"}
          style={{ opacity: 0.85, pointerEvents: "all", cursor: "pointer" }}
        />
      </svg>
    );
  }
);
