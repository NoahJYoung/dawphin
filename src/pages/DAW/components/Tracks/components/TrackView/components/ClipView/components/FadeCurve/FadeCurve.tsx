import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useAudioEngine } from "src/pages/DAW/hooks";
import styles from "./FadeCurve.module.scss";
import * as d3 from "d3";

interface FadeCurveProps {
  fadeInLengthInSamples: number;
  fadeOutLengthInSamples: number;
  height: number;
  color: string;
  clipDurationInSamples: number;
}

export const FadeCurve = observer(
  ({
    fadeInLengthInSamples,
    fadeOutLengthInSamples,
    height,
    color,
    clipDurationInSamples,
  }: FadeCurveProps) => {
    const audioEngine = useAudioEngine();
    const fadeInWidth = Math.round(
      audioEngine.timeline.samplesToPixels(fadeInLengthInSamples)
    );
    const fadeOutWidth = Math.round(
      audioEngine.timeline.samplesToPixels(fadeOutLengthInSamples)
    );
    const endOfClip = Math.round(
      audioEngine.timeline.samplesToPixels(clipDurationInSamples)
    );

    const fadeInRef = useRef(null);
    const fadeOutRef = useRef(null);

    useEffect(() => {
      if (fadeInRef.current) {
        const fadeInDragHandler = d3
          .drag<any, unknown>()
          .on("start", function () {
            d3.select(this).raise();
          })
          .on("drag", function (event) {
            audioEngine.setFadeInOnSelectedClips(event.dx);
          });

        d3.select(fadeInRef.current).call(fadeInDragHandler);
      }
      if (fadeOutRef.current) {
        const fadeOutdragHandler = d3
          .drag<any, unknown>()
          .on("start", function () {
            d3.select(this).raise();
          })
          .on("drag", function (event) {
            audioEngine.setFadeOutOnSelectedClips(-event.dx);
          });

        d3.select(fadeOutRef.current).call(fadeOutdragHandler);
      }
    }, [audioEngine, fadeInRef, fadeOutRef]);

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
      >
        <path d={fadeInFillPath} fill="rgba(0, 0, 0, 0.4)" />
        <path d={fadeOutFillPath} fill="rgba(0, 0, 0, 0.4)" />

        <path d={fadeInCurvePath} stroke={color} strokeWidth={1} fill="none" />
        <path d={fadeOutCurvePath} stroke={color} strokeWidth={1} fill="none" />

        <rect
          className={styles.fadeCurveRect}
          ref={fadeInRef}
          x={fadeInRectX}
          y={fadeInRectY}
          width={10}
          height={10}
          stroke={color}
          strokeWidth={1}
          fill="transparent"
        />

        <rect
          className={styles.fadeCurveRect}
          ref={fadeOutRef}
          x={fadeOutRectX}
          y={fadeOutRectY}
          width={10}
          height={10}
          stroke={color}
          strokeWidth={1}
          fill="transparent"
        />
      </svg>
    );
  }
);
