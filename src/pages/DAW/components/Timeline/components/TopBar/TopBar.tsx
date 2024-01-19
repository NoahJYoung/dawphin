import React from "react";
import {
  calculateGridlineValues,
  getTimeSignature,
  zoomToGridlineMap,
} from "../../helpers";
import { observer } from "mobx-react-lite";
import { useAudioEngine } from "src/pages/DAW/hooks";

interface TopBarProps {
  topbarRef: React.LegacyRef<SVGSVGElement>;
  gridWidth: number;
  topBarHeight: number;
}

export const TopBar = observer(
  ({ topbarRef, gridWidth, topBarHeight }: TopBarProps) => {
    const audioEngine = useAudioEngine();

    const { totalBeats, samplesPerBeat } = calculateGridlineValues(audioEngine);
    const beatsPerMeasure = getTimeSignature(audioEngine);

    return (
      <svg
        ref={topbarRef}
        style={{
          borderRadius: "5px",
          position: "absolute",
          pointerEvents: "none",
        }}
        width={gridWidth}
        height={topBarHeight}
      >
        {Array.from({ length: totalBeats + 1 }).map((_, i) => {
          const sample = i * samplesPerBeat * beatsPerMeasure;
          const x =
            audioEngine.timeline.samplesToPixels(sample) / beatsPerMeasure;
          const isMeasure = i % beatsPerMeasure === 0;
          const isQuarterNote = !isMeasure;

          const shouldDrawQuarterNotes =
            zoomToGridlineMap[audioEngine.timeline.samplesPerPixel]
              .quarterNotes;

          const shouldDrawEighthNotes =
            zoomToGridlineMap[audioEngine.timeline.samplesPerPixel].eighthNotes;

          const shouldDrawSixteenthNotes =
            zoomToGridlineMap[audioEngine.timeline.samplesPerPixel]
              .sixteenthNotes;

          return (
            <g key={i}>
              {isMeasure && (
                <line
                  key={`${i}m`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2={topBarHeight}
                  stroke="#444"
                />
              )}
              {isMeasure && (
                <text
                  x={x + 2}
                  y="15"
                  fill="#888"
                  fontSize="12px"
                  fontFamily="Inter"
                >
                  {i / beatsPerMeasure + 1}
                </text>
              )}
              {shouldDrawQuarterNotes && isQuarterNote && (
                <line
                  key={`${i}4n`}
                  x1={x}
                  y1={topBarHeight * 0.25}
                  x2={x}
                  y2={topBarHeight}
                  stroke="#444"
                />
              )}

              {shouldDrawEighthNotes && (
                <line
                  key={`${i}8n`}
                  x1={x * 0.5}
                  y1={topBarHeight * 0.5}
                  x2={x * 0.5}
                  y2={topBarHeight}
                  stroke="#444"
                />
              )}

              {shouldDrawSixteenthNotes && (
                <line
                  key={`${i}16n`}
                  x1={x * 0.25}
                  y1={topBarHeight * 0.75}
                  x2={x * 0.25}
                  y2={topBarHeight}
                  stroke="#444"
                />
              )}
            </g>
          );
        })}
      </svg>
    );
  }
);
